import axios from "axios";
import { useState, useEffect, useRef } from "react";

const BASE_URL = "https://vizit-backend-hubw.onrender.com/api/kyc";
const CLOUD_NAME = "dgigs6v72";
const UPLOAD_PRESET = "vizit-image";

export default function KYCForm() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    /* =========================
       DECODE OWNER
    ========================== */
    useEffect(() => {
        const decodeOwner = async () => {
            try {
                const token = localStorage.getItem("token")?.trim();
                if (!token) return;

                // Force a clean URL with no hidden characters
                const url = "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner".trim();

                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache" // Prevent browser from serving a stale 404
                    },
                });

                // Backend returns { res: owner }, so we check for res.data.res
                if (res.data && res.data.res) {
                    setCurrentUser(res.data.res);
                }
            } catch (err) {
                console.error("Full URL attempted:", err.config?.url);
                console.error("Response Data:", err.response?.data);

                // If it's a 404, it's either the URL or the ID not existing in the DB
                if (err.response?.status === 404) {
                    console.warn("The route exists but the Owner ID in the token wasn't found in the DB.");
                }
            }
        };
        decodeOwner();
    }, []);
    const userEmail = currentUser?.email;

    const [formData, setFormData] = useState({
        companyName: "",
        companyEmail: "",
        phone: "",
        location: "",
        idSnapshot: "",
        taxCardSnapshot: "",
        selfieWithId: "",
        status: "pending",
    });



    /* =========================
       LOAD EXISTING KYC
    ========================== */
    useEffect(() => {
        if (!userEmail) return;

        fetch(`${BASE_URL}/user/${userEmail}`)
            .then(res => res.json())
            .then(data => {
                if (data.kyc) {
                    setFormData(data.kyc);
                    setIsSubmitted(true);
                }
            })
            .catch(() => { });
    }, [userEmail]);

    /* =========================
       CLOUDINARY UPLOAD
    ========================== */
    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", UPLOAD_PRESET);

        try {
            setUploading(true);

            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                data
            );

            setUploading(false);
            return res.data.secure_url;
        } catch (err) {
            setUploading(false);
            alert("Image upload failed");
            return null;
        }
    };

    const handleFile = async (file, name) => {
        const url = await uploadToCloudinary(file);
        if (!url) return;

        setFormData(prev => ({
            ...prev,
            [name]: url,
        }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* =========================
       SUBMIT TO BACKEND
    ========================== */
    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    email: userEmail,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setFormData(data.kyc);
                setIsSubmitted(true);
            } else {
                alert("Please Change the Number or Company Name It has been used by another Registrar");
            }
        } catch (err) {
            alert("Submission failed");
        }

        setLoading(false);
    };


    const handleEdit = () => {
        setIsSubmitted(false);
        setStep(1);
    };




    
 useEffect(() => {
    if (formData?.status == "approved") {
      window.location.href = "/dashboard"
    }
  }, [formData?.status])
  
    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Business Verification (KYC)</h2>

                {isSubmitted ? (
                    <ReviewSection formData={formData} onEdit={handleEdit} />
                ) : (
                    <>
                        <Progress step={step} />

                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <div style={styles.section}>
                                    <Input label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
                                    <Input label="Company Email" name="companyEmail" type="email" value={formData.companyEmail} onChange={handleChange} />
                                    <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                                    <Input label="Location" name="location" value={formData.location} onChange={handleChange} />

                                    <button type="button" onClick={() => setStep(2)} style={styles.primaryBtn}>
                                        Continue
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div style={styles.section}>
                                    <UploadCard label="Government ID" name="idSnapshot" value={formData.idSnapshot} onFile={handleFile} />
                                    <UploadCard label="Tax Payer Card" name="taxCardSnapshot" value={formData.taxCardSnapshot} onFile={handleFile} />
                                    <UploadCard label="Selfie Holding ID" name="selfieWithId" value={formData.selfieWithId} onFile={handleFile} />

                                    {uploading && <p style={{ color: "#059669" }}>Uploading image...</p>}

                                    <div style={styles.buttonRow}>
                                        <button type="button" onClick={() => setStep(1)} style={styles.secondaryBtn}>
                                            Back
                                        </button>
                                        <button type="submit" style={styles.successBtn}>
                                            {loading ? "Submitting..." : "Submit Verification"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

/* ================= COMPONENTS ================= */

const Input = ({ label, ...props }) => (
    <div style={styles.inputWrapper}>
        <label style={styles.label}>{label}</label>
        <input {...props} required style={styles.input} />
    </div>
);

const UploadCard = ({ label, name, value, onFile }) => {
    const ref = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onFile(file, name);
    };

    return (
        <div
            style={styles.uploadCard}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => ref.current.click()}
        >
            <input
                type="file"
                hidden
                ref={ref}
                accept="image/*"
                onChange={(e) => onFile(e.target.files[0], name)}
            />

            {value ? (
                <img src={value} alt="preview" style={styles.previewImage} />
            ) : (
                <>
                    <p style={styles.uploadText}>{label}</p>
                    <small>Drag & Drop or Click</small>
                </>
            )}
        </div>
    );
};

const Progress = ({ step }) => (
    <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: step === 1 ? "50%" : "100%" }} />
    </div>
);

const ReviewSection = ({ formData, onEdit }) => (
    <div style={styles.reviewContainer}>
        <div style={styles.statusCard}>
            <h4>Status: {formData.status?.toUpperCase()}</h4>
            <p>Please be patient while we review your documents.</p>
        </div>

        <div style={styles.detailsGrid}>
            <Detail label="Company" value={formData.companyName} />
            <Detail label="Email" value={formData.companyEmail} />
            <Detail label="Phone" value={formData.phone} />
            <Detail label="Location" value={formData.location} />
        </div>

        <div style={styles.imageGrid}>
            <img src={formData.idSnapshot} style={styles.reviewImage} />
            <img src={formData.taxCardSnapshot} style={styles.reviewImage} />
            <img src={formData.selfieWithId} style={styles.reviewImage} />
        </div>

        {formData.status !== "approved" && (
            <button onClick={onEdit} style={styles.editBtn}>
                Edit Submission
            </button>
        )}
    </div>
);

const Detail = ({ label, value }) => (
    <div style={styles.detailCard}>
        <small>{label}</small>
        <strong>{value}</strong>
    </div>
);

/* ================= UI ================= */

const styles = {
    wrapper: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "850px",
        background: "#fff",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    },
    title: { marginBottom: "20px", color: "#065f46" },
    progressContainer: {
        height: "6px",
        background: "#e5e7eb",
        borderRadius: "5px",
        marginBottom: "30px",
    },
    progressBar: {
        height: "100%",
        background: "#059669",
        borderRadius: "5px",
    },
    section: { display: "flex", flexDirection: "column", gap: "20px" },
    inputWrapper: { display: "flex", flexDirection: "column" },
    label: { marginBottom: "6px", fontWeight: "600", color: "#065f46" },
    input: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #d1fae5",
        outline: "none",
    },
    uploadCard: {
        border: "2px dashed #10b981",
        borderRadius: "16px",
        padding: "30px",
        textAlign: "center",
        cursor: "pointer",
    },
    uploadText: { fontWeight: "600" },
    previewImage: {
        width: "100%",
        maxHeight: "200px",
        objectFit: "cover",
        borderRadius: "12px",
    },
    buttonRow: { display: "flex", justifyContent: "space-between" },
    primaryBtn: {
        background: "#059669",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
    },
    secondaryBtn: {
        background: "#9ca3af",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
    },
    successBtn: {
        background: "#047857",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
    },
    reviewContainer: { display: "flex", flexDirection: "column", gap: "20px" },
    statusCard: {
        background: "#ecfdf5",
        padding: "15px",
        borderRadius: "12px",
    },
    detailsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: "15px",
    },
    detailCard: {
        background: "#f0fdf4",
        padding: "15px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
    },
    imageGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: "15px",
    },
    reviewImage: { width: "100%", borderRadius: "12px" },
    editBtn: {
        background: "#065f46",
        color: "#fff",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
    },
};
