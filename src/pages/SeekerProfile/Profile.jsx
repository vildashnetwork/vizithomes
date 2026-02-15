import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./house-search.css";

const STORAGE_KEY = "vizit_user_profile";

const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dgigs6v72/image/upload";
const CLOUDINARY_PRESET = "vizit-image";

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
                                Upgrade Plan
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
                <div className="cd-modal" role="dialog" aria-modal="true">
                    <div className="cd-modal__panel cd-modal__panel--small">
                        <div className="cd-modal__head">
                            <h3>Upgrade Account</h3>
                            <button
                                className="cd-dismiss"
                                onClick={() => setShowUpgrade(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="cd-upgrade-plans">
                            <div
                                className={`cd-plan ${selectedPlan === "pro" ? "is-selected" : ""
                                    }`}
                                onClick={() => setSelectedPlan("pro")}
                            >
                                <div className="cd-plan__title">Pro</div>
                                <div className="cd-plan__price">$6 / month</div>
                            </div>

                            <div
                                className={`cd-plan ${selectedPlan === "business"
                                    ? "is-selected"
                                    : ""
                                    }`}
                                onClick={() => setSelectedPlan("business")}
                            >
                                <div className="cd-plan__title">Business</div>
                                <div className="cd-plan__price">$20 / month</div>
                            </div>
                        </div>

                        <div className="cd-modal__footer">
                            <button
                                className="cd-btn cd-btn--primary"
                                onClick={confirmUpgrade}
                                disabled={saving}
                            >
                                {saving ? "Upgrading..." : "Confirm Upgrade"}
                            </button>
                            <button
                                className="cd-btn cd-btn--ghost"
                                onClick={() => setShowUpgrade(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}