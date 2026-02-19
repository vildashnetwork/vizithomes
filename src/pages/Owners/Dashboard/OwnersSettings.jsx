// ProfilePanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VerifyModal from "./Verify";
import VerificationBadge from "./Badge"

const STORAGE_KEY = "vizit_user_profile";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dgigs6v72/image/upload";
const CLOUDINARY_PRESET = "vizit-image";

/* ---------------- storage helpers ---------------- */
function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveToStorage(obj) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch { }
}

/* ---------------- component ---------------- */
export default function OnwnerSetting({
    onLogout = () => {
        localStorage.clear();
        window.location.reload()
    },
    onUpgrade = () => { },
    mybalance
}) {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState(50);
    const [error, setError] = useState("");
    const [userhere, setuser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        location: "",
        companyname: "",
        bio: "",
        phone: "",
        IDno: "",
        paymentmethod: "",
    });


    const [notifications, setNotifications] = useState(true);
    const [privacy, setPrivacy] = useState(false);

    /* ---------------- decode token ---------------- */
    useEffect(() => {
        const decoding = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await axios.get(
                    "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.status === 200) {
                    setuser(res.data.res);

                    console.log("profile", res.data.res)
                }
            } catch (error) {
                console.error("Failed to decode token:", error);
            } finally {
                setLoading(false);
            }
        };

        const cached = loadFromStorage();
        if (cached) {
            setuser(cached);
            setProfile(cached);
            setLoading(false);
        } else {
            decoding();
        }
    }, []);

    /* ---------------- sync form ---------------- */
    useEffect(() => {
        if (!userhere) return;

        setForm({
            name: userhere.name || "",
            email: userhere.email || "",
            location: userhere.location || "",
            companyname: userhere.companyname || "",
            bio: userhere.bio || "",
            phone: userhere.phone || "",
            IDno: userhere.IDno || "",
            paymentmethod: userhere.paymentmethod || "",
        });

        setNotifications(userhere.Notifications ?? true);
        setPrivacy(userhere.enabletwofactor ?? false);
    }, [userhere]);

    /* ---------------- cloudinary ---------------- */
    const uploadImageToCloudinary = async () => {
        if (!imageFile) return userhere?.profile;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", CLOUDINARY_PRESET);

        const res = await axios.post(CLOUDINARY_URL, formData);
        return res.data.secure_url;
    };

    /* ---------------- backend submit ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userhere?._id) return;

        setSaving(true);

        try {
            const imageUrl = await uploadImageToCloudinary();

            const payload = {
                ...form,
                Notifications: notifications,
                enabletwofactor: privacy,
                profile: imageUrl,
            };

            await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/owner/edit/${userhere._id}`,
                payload
            );

            const updatedProfile = { ...profile, ...payload };
            setProfile(updatedProfile);
            setuser(updatedProfile);
            saveToStorage(updatedProfile);

            setEditing(false);
            setImageFile(null);
            alert("Profile updated successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };











    const [me, setme] = useState([])
    const [loadme, setloadme] = useState(false)
    useEffect(() => {
        if (!profile?.email) return;
        const fetchLatestTransaction = async () => {
            try {
                setloadme(true)
                const res = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/user/me/${userhere.email}`
                );
                if (res.data) {

                    setme(res.data.user)
                }
            } catch (error) {
                console.error("Error fetching latest transaction:", error);

            } finally {
                setloadme(false)
            }
        };
        fetchLatestTransaction()
    }, [profile?.email]);


    const increment = () => setAmount(prev => prev + 500);
    const decrement = () => setAmount(prev => (prev > 500 ? prev - 500 : 500));
    const [paying, setPaying] = useState(false)
    const handleSubmit1 = async (e) => {
        if (e?.preventDefault) e.preventDefault();

        setError("");

        if (!userhere?._id || !userhere?.role) {
            return setError("User session expired. Please login again.");
        }

        if (!/^2376\d{8}$/.test(phoneNumber)) {
            return setError("Enter a valid Cameroon number (2376XXXXXXXX)");
        }

        if (!amount || Number(amount) < 50) {
            return setError("Minimum payment is 50 FCFA");
        }

        if (paying) return;

        try {
            setPaying(true);

            const res = await axios.post(
                "https://vizit-backend-hubw.onrender.com/api/pay",
                {
                    phoneNumber: phoneNumber.trim(),
                    amount: Number(amount),
                    description: "Add tokens to my Vizit site",
                    id: userhere._id,
                    role: userhere.role
                }
            );

            if (res.status !== 201) {
                setError("Payment could not be processed.");
                setPaying(false);
                return;
            }

            alert("Payment initiated. Waiting for confirmation this might take one minute do not refresh your browser...");

            //  START POLLING
            let attempts = 0;
            const maxAttempts = 15; // 15 × 4s = 60 seconds

            const interval = setInterval(async () => {
                attempts++;

                try {
                    // 1 Reconcile with NKWA
                    await axios.get(
                        "https://vizit-backend-hubw.onrender.com/api/reconcile-payments"
                    );

                    // 2 Credit user (adds only if success + notadded)
                    await axios.post(
                        `https://vizit-backend-hubw.onrender.com/api/credit-user/${userhere.email}`
                    );

                    // 3 Fetch updated user
                    const updatedUser = await axios.get(
                        `https://vizit-backend-hubw.onrender.com/api/user/me/${userhere.email}`
                    );

                    const latestPayments =
                        updatedUser.data?.user?.paymentprscribtion || [];

                    const latestTransaction = latestPayments.at(-1);

                    if (!latestTransaction) return;

                    if (latestTransaction.status === "success") {
                        clearInterval(interval);
                        alert("Payment successful ✅ Balance updated.");
                        window.location.reload();
                    }

                    if (latestTransaction.status === "failed") {
                        clearInterval(interval);
                        alert("Payment failed ❌");
                    }

                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        alert("Payment confirmation timeout. Please refresh.");
                    }

                } catch (pollError) {
                    console.log("Polling error:", pollError.message);
                }

            }, 4000);

        } catch (err) {
            console.error("Payment error:", err.response?.data || err.message);
            setError(
                err.response?.data?.message ||
                "Payment failed. Please try again."
            );
        } finally {
            setPaying(false);
        }
    };





    /* ---------------- ui handlers ---------------- */
    const startEdit = () => setEditing(true);

    const cancelEdit = () => {
        setEditing(false);
        setImageFile(null);
        setForm({
            name: userhere?.name || "",
            email: userhere?.email || "",
            location: userhere?.location || "",
            companyname: userhere?.companyname || "",
            bio: userhere?.bio || "",
            phone: userhere?.phone || "",
            IDno: userhere?.IDno || "",
            paymentmethod: userhere?.paymentmethod || "",
        });
    };

    const toggleNotifications = () => {
        const next = !notifications;
        setNotifications(next);
        setProfile(p => ({ ...p, Notifications: next }));
    };

    const togglePrivacy = () => {
        const next = !privacy;
        setPrivacy(next);
        setProfile(p => ({ ...p, enabletwofactor: next }));
    };

    // const confirmUpgrade = async () => {
    //     setSaving(true);
    //     await new Promise(r => setTimeout(r, 450));
    //     const updated = { ...profile, plan: selectedPlan };
    //     setProfile(updated);
    //     saveToStorage(updated);
    //     setSaving(false);
    //     setShowUpgrade(false);
    //     onUpgrade(selectedPlan);
    // };

    // const upgradeLabel =
    //     profile?.plan === "pro"
    //         ? "Pro (active)"
    //         : profile?.plan === "business"
    //             ? "Business (active)"
    //             : "Free";

    if (loading) return null;

    const styles = {
        /* full-screen modal wrapper */
        page: {
            minHeight: "100vh",
            width: "100vw",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            boxSizing: "border-box"
        },

        /* payment card */
        card: {
            width: "100%",
            maxWidth: "420px",
            minWidth: "280px",
            background: "#fff",
            borderRadius: "16px",
            padding: "clamp(16px, 4vw, 24px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            boxSizing: "border-box"
        },

        title: {
            textAlign: "center",
            fontSize: "clamp(18px, 4.5vw, 22px)",
            fontWeight: "600",
            marginBottom: "18px",
            color: "#111827"
        },

        field: {
            marginBottom: "16px"
        },

        label: {
            display: "block",
            fontSize: "clamp(13px, 3.5vw, 14px)",
            fontWeight: "500",
            marginBottom: "6px",
            color: "#374151"
        },

        input: {
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "15px",
            boxSizing: "border-box"
        },

        /* amount counter row */
        counter: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%"
        },

        minus: {
            minWidth: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#e5e7eb",
            fontSize: "20px",
            cursor: "pointer",
            flexShrink: 0
        },

        plus: {
            minWidth: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#0d6e4e",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            flexShrink: 0
        },

        amountInput: {
            flex: 1,
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            fontSize: "clamp(15px, 4vw, 16px)",
            fontWeight: "600",
            minWidth: "80px"
        },

        helper: {
            fontSize: "12px",
            textAlign: "center",
            marginTop: "6px",
            color: "#6b7280"
        },

        submit: {
            width: "100%",
            padding: "14px",
            background: "#084d02",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "clamp(14px, 4vw, 16px)",
            fontWeight: "600",
            cursor: "pointer",
            marginTop: "10px"
        },

        error: {
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px",
            textAlign: "center"
        }
    };





    /* ---------------- render ---------------- */
    return (
        <section id="profile" className="cd-profile" aria-label="Profile panel" style={{
            background: "transparent",
            color: "#333", padding: 20
        }}>
            <header className="cd-profile__head">
                <div className="cd-profile__avatar" aria-hidden>
                    <img
                        src={userhere?.profile}
                        alt={userhere?.name}
                        width={70}
                        height={70}
                        className="img-container"
                    />
                </div>

                <div className="cd-profile__meta">
                    <div className="cd-profile__name" style={{
                        color: "#333",
                        display: "flex",
                        gap: "12px"
                    }}>{userhere?.name}
{/* {alert(userhere?.verified)} */}
                        {!userhere.verified ?
                            <button
                                className="cd-btn cd-btn--upgrade"
                                style={{ background: "green" }}
                                onClick={() => setOpen(!open)}
                            >
                                Get Verified
                            </button> :
                            <VerificationBadge />
                        }


                    </div>
                    <div className="cd-profile__email" style={{ color: "#333" }}>{userhere?.email}</div>

                    <div className="cd-profile__plan" style={{ color: "#333" }}>
                        <span
                            className={`cd-badge ${mybalance?.totalBalance > 0
                                ? "cd-badge--pro"
                                :
                                "cd-badge--business"

                                }`}
                            style={{
                                background: mybalance?.totalBalance > 0 ? "gold" : "red",
                            }}
                        >
                            {mybalance?.totalBalance > 0 ? "pro" : "free"}
                        </span>


                        <button
                            className="cd-btn cd-btn--upgrade"
                            style={{ background: "green" }}
                            onClick={() => setShowUpgrade(true)}
                        >
                            Top Up Account
                        </button>

                    </div>
                </div>

                <div className="cd-profile__actions">
                    {editing ? (
                        <>
                            <button
                                className="cd-btn"
                                onClick={handleSubmit}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                className="cd-btn cd-btn--ghost"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="cd-btn"
                                onClick={startEdit}
                            >
                                Edit
                            </button>
                            <button
                                className="cd-btn cd-btn--danger"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </header>

            <form
                className="cd-profile__form"
                onSubmit={handleSubmit}
                aria-hidden={!editing}
            >
                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>Full name</span>
                    <input
                        className="cd-input"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>Email</span>
                    <input
                        className="cd-input"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                </label>


                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>ID Card Number:</span>
                    <input
                        className="cd-input"
                        type="email"
                        value={form.IDno}
                        style={{ color: "#333" }}
                        onChange={(e) =>
                            setForm({ ...form, IDno: e.target.value })
                        }
                    />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>Company Name</span>
                    <input
                        className="cd-input"
                        type="email"
                        value={form.companyname}
                        onChange={(e) =>
                            setForm({ ...form, companyname: e.target.value })
                        }
                    />
                </label>



                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>Phone Number</span>
                    <input
                        className="cd-input"
                        type="text"
                        value={form.phone}
                        onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                        }
                    />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>Company's Bio</span>
                    <textarea
                        cols={5}
                        rows={6}
                        className="cd-input"
                        type="text"
                        value={form.bio}
                        onChange={(e) =>
                            setForm({ ...form, bio: e.target.value })
                        }
                    />
                </label>



                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>Payment Method :</span>

                    <select name="" id="" className="cd-input" value={form.paymentmethod}
                        onChange={(e) =>
                            setForm({ ...form, paymentmethod: e.target.value })
                        }>
                        <option value="select a payment method">select a payment method</option>
                        <option value="mtnmomo">{"mtnmomo"}</option>
                        <option value="orange">{"orange"}</option>

                    </select>

                </label>




                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#333" }}>Click to Uplooad A Profile photo</span>

                    <div className="cd-image-upload" style={{ cursor: "pointer" }}>
                        <img
                            style={{ height: "90px", width: "110px" }}
                            src={
                                imageFile
                                    ? URL.createObjectURL(imageFile)
                                    : userhere?.profile ||
                                    "https://res.cloudinary.com/dgigs6v72/image/upload/v1700000000/avatar-placeholder.png"
                            }
                            alt="Profile preview"
                            className="cd-image-preview"
                        />

                        <input
                            style={{ display: "none" }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>
                </label>


                {!editing && (
                    <div className="cd-profile__notes" style={{ color: "#fff" }}>
                        <small>Tip: Click Edit to change your name and email.</small>
                    </div>
                )}
            </form>

            <div className="cd-profile__settings">
                <h4 className="cd-profile__section-title">Settings</h4>

                <div className="cd-profile__setting">
                    <div className="cd-profile__setting-info">
                        <div className="cd-profile__setting-title">
                            Notifications
                        </div>
                        <div className="cd-profile__setting-desc">
                            Receive booking updates and offers
                        </div>
                    </div>

                    <button
                        role="switch"
                        aria-checked={notifications}
                        className={`cd-toggle ${notifications ? "is-on" : ""
                            }`}
                        onClick={toggleNotifications}
                    >
                        <span className="cd-toggle__knob" />
                    </button>
                </div>








                <div className="cd-profile__setting">
                    <div className="cd-profile__setting-info">
                        <div className="cd-profile__setting-title">
                            Enable Two Factor Authenticatiion
                        </div>
                        <div className="cd-profile__setting-desc">
                            This allows you to recieve OTP through email or SMS on login
                        </div>
                    </div>

                    <button
                        role="switch"

                        aria-checked={privacy}
                        className={`cd-toggle ${privacy ? "is-on" : ""
                            }`}
                        onClick={togglePrivacy}
                    >
                        <span className="cd-toggle__knob" />
                    </button>
                </div>
            </div>
            {showUpgrade && (
                <div
                    className="cd-modal"
                    role="dialog"
                    aria-modal="true"
                    style={styles.page}
                >
                    <div className="cd-modal__panel cd-modal__panel--small">
                        {/* Modal header */}
                        <div className="cd-modal__head">
                            <h3 style={{ color: "gold" }}>Upgrade To Have Unlimited Access</h3>
                            <button
                                className="cd-dismiss"
                                type="button"
                                onClick={() => setShowUpgrade(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {/* PAYMENT CARD (NO FORM) */}
                        <div style={styles.card}>
                            <h2 style={styles.title}>
                                Dial <strong style={{ color: "gold" }}>*126#</strong> to confirm the payment
                                if you don’t receive the popup please this process will take one minute
                                <br />
                                <strong style={{ color: "gold" }}>please be patient</strong>
                            </h2>

                            {error && <div style={styles.error}>{error}</div>}

                            {/* Phone Number */}
                            <div style={styles.field}>
                                <label style={styles.label}>Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="2376XXXXXXXX"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            {/* Amount Counter */}
                            <div style={styles.field}>
                                <label style={styles.label}>Amount (FCFA)</label>

                                <div style={styles.counter}>
                                    <button
                                        type="button"
                                        onClick={decrement}
                                        style={styles.minus}
                                    >
                                        −
                                    </button>

                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        style={styles.amountInput}
                                    />

                                    <button
                                        type="button"
                                        onClick={increment}
                                        style={styles.plus}
                                    >
                                        +
                                    </button>
                                </div>

                                <p style={styles.helper}>
                                    Step: 500 FCFA · Minimum: 100 FCFA
                                </p>
                            </div>

                            {/* PAY BUTTON */}
                            <button
                                type="button"
                                onClick={handleSubmit1}
                                disabled={paying}
                                style={styles.submit}
                            >
                                {paying
                                    ? "Processing..."
                                    : `Pay ${amount.toLocaleString()} FCFA`}
                            </button>
                        </div>


                    </div>
                </div>
            )}

            {open &&
                <VerifyModal open={open} setOpen={setOpen} email={form?.email} />
            }

        </section>
    );
}
