import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./house-search.css";

const STORAGE_KEY = "vizit_user_profile";

const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dgigs6v72/image/upload";
const CLOUDINARY_PRESET = "vizit-image";


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
/* ---------------- storage helpers ---------------- */
function loadFromStorage(defaultUser) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultUser;
        return { ...defaultUser, ...JSON.parse(raw) };
    } catch {
        return defaultUser;
    }
}

function saveToStorage(obj) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch { }
}

/* ---------------- component ---------------- */
export default function ProfilePanel({
    userhere,
    onLogout = () => { 
        localStorage.clear()
        window.location.reload()
    },
    onUpgrade = () => { },
}) {

        const [error, setError] = useState("");
    // Fixed: Initialize profile as the object, not an array [userhere]
    const [profile, setProfile] = useState(() => loadFromStorage(userhere));

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: profile?.name || "",
        email: profile?.email || "",
    });

    const [notifications, setNotifications] = useState(
        profile?.Notifications ?? true
    );

    const [showUpgrade, setShowUpgrade] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    /* ---------------- cloudinary ---------------- */
    const uploadImageToCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", CLOUDINARY_PRESET);

        const res = await axios.post(CLOUDINARY_URL, formData);
        return res.data.secure_url;
    };

    /* ---------------- backend submit ---------------- */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!userhere?._id) return;

        setLoading(true);

        try {
            let imageUrl = profile?.profile;

            if (imageFile) {
                imageUrl = await uploadImageToCloudinary();
            }

            await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/user/edt/${userhere._id}`,
                {
                    name: form.name,
                    email: form.email,
                    Notifications: notifications,
                    profile: imageUrl,
                }
            );

            const updatedProfile = {
                ...profile,
                name: form.name,
                email: form.email,
                Notifications: notifications,
                profile: imageUrl,
            };

            setProfile(updatedProfile);
            saveToStorage(updatedProfile);
            setEditing(false);
            setImageFile(null);

            alert("Profile updated successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- sync storage ---------------- */
    useEffect(() => {
        if (profile) saveToStorage(profile);
    }, [profile]);

    /* ---------------- ui handlers ---------------- */
    const startEdit = () => {
        setForm({
            name: profile?.name || "",
            email: profile?.email || "",
        });
        setEditing(true);
    };

    const cancelEdit = () => {
        setForm({
            name: profile?.name || "",
            email: profile?.email || "",
        });
        setImageFile(null);
        setEditing(false);
    };

    const toggleNotifications = () => {
        const next = !notifications;
        setNotifications(next);
        setProfile((p) => ({ ...p, Notifications: next }));
    };

    const confirmUpgrade = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 450));

        const updated = { ...profile, plan: selectedPlan };
        setProfile(updated);
        saveToStorage(updated);

        setSaving(false);
        setShowUpgrade(false);
        onUpgrade(selectedPlan);
    };

    const upgradeLabel =
        profile?.plan === "pro"
            ? "Pro (active)"
            : profile?.plan === "business"
                ? "Business (active)"
                : "Free";













                //start
const increment = () => setAmount(prev => prev + 500);
    const decrement = () => setAmount(prev => (prev > 500 ? prev - 500 : 500));
    const [paying, setPaying] = useState(false)
    
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState(50);
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


                //end
    /* ---------------- render ---------------- */
    return (
        <section className="cd-profile" aria-label="Profile panel" style={{ marginBottom: "100px" }}>
            <header className="cd-profile__head">
                <div className="cd-profile__avatar">
                    <img
                        src={profile?.profile || "https://res.cloudinary.com/dgigs6v72/image/upload/v1700000000/avatar-placeholder.png"}
                        alt={profile?.name}
                        width={70}
                        height={70}
                        className="img-container"
                    />
                </div>

                <div className="cd-profile__meta">
                    <div className="cd-profile__name">{profile?.name}</div>
                    <div className="cd-profile__email">{profile?.email}</div>

                    <div className="cd-profile__plan">
                        <span
                            className={`cd-badge ${profile?.plan === "pro"
                                ? "cd-badge--pro"
                                : profile?.plan === "business"
                                    ? "cd-badge--business"
                                    : ""
                                }`}
                        >
                            {upgradeLabel}
                        </span>

                        {(profile?.plan !== "pro" && profile?.plan !== "business") && (
                            <button
                                className="cd-btn cd-btn--upgrade"
                                onClick={() => setShowUpgrade(true)}
                                style={{ background: "green", marginLeft: "10px" }}
                            >
                                  Top Up Account
                            </button>
                        )}
                    </div>
                </div>

                <div className="cd-profile__actions">
                    {editing ? (
                        <>
                            <button
                                className="cd-btn"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save"}
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
                            <button className="cd-btn" onClick={startEdit}>
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
                style={{ display: editing ? "block" : "none" }}
            >
                <label className="cd-form-row">
                    <span className="cd-form-label">Full name</span>
                    <input
                        className="cd-input"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label">Email</span>
                    <input
                        className="cd-input"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        disabled
                    />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label">
                        Click to Upload Profile Photo
                    </span>

                    <div
                        className="cd-image-upload"
                        style={{ cursor: "pointer", marginTop: "10px" }}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <img
                            style={{ height: "90px", width: "110px", objectFit: "cover", borderRadius: "8px" }}
                            src={
                                imageFile
                                    ? URL.createObjectURL(imageFile)
                                    : profile?.profile ||
                                    "https://res.cloudinary.com/dgigs6v72/image/upload/v1700000000/avatar-placeholder.png"
                            }
                            alt="Profile preview"
                            className="cd-image-preview"
                        />

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) =>
                                setImageFile(e.target.files?.[0] || null)
                            }
                        />
                    </div>
                </label>
            </form>

            {!editing && (
                <div className="cd-profile__notes" style={{ marginTop: "10px" }}>
                    <small>
                        Tip: Click Edit to change your name, email, or profile photo.
                    </small>
                </div>
            )}

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
                        className={`cd-toggle ${notifications ? "is-on" : ""}`}
                        onClick={toggleNotifications}
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
        </section>
    );
}