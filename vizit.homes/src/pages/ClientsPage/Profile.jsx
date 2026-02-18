// ProfilePanel.jsx
import React, { useEffect, useState } from "react";

import "./house-search.css"
const STORAGE_KEY = "vizit_user_profile";

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

export default function ProfilePanel({
    user = { id: "u1", name: "Guest User", email: "guest@example.com", plan: "free" },
    onLogout = () => { },
    onUpgrade = () => { }
}) {
    const [profile, setProfile] = useState(() => loadFromStorage(user));
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: profile.name, email: profile.email });
    const [notifications, setNotifications] = useState(profile.notifications ?? true);
    const [privacy, setPrivacy] = useState(profile.privacy ?? false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // sync local state -> storage
        saveToStorage(profile);
    }, [profile]);

    // handlers
    const startEdit = () => {
        setForm({ name: profile.name, email: profile.email });
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setForm({ name: profile.name, email: profile.email });
    };

    const saveProfile = (e) => {
        e?.preventDefault();
        const updated = { ...profile, name: form.name.trim() || profile.name, email: form.email.trim() || profile.email };
        setProfile(updated);
        setEditing(false);
    };

    const toggleNotifications = () => {
        setNotifications((s) => {
            const next = !s;
            const updated = { ...profile, notifications: next };
            setProfile(updated);
            return next;
        });
    };

    const togglePrivacy = () => {
        setPrivacy((s) => {
            const next = !s;
            const updated = { ...profile, privacy: next };
            setProfile(updated);
            return next;
        });
    };

    const confirmUpgrade = async () => {
        setSaving(true);
        // demo delay to simulate API
        await new Promise((r) => setTimeout(r, 450));
        const updated = { ...profile, plan: selectedPlan };
        setProfile(updated);
        setSaving(false);
        setShowUpgrade(false);
        onUpgrade(selectedPlan);
    };

    const upgradeLabel = profile.plan === "pro" ? "Pro (active)" : profile.plan === "business" ? "Business (active)" : "Free";

    return (
        <section className="cd-profile" aria-label="Profile panel">
            <header className="cd-profile__head">
                <div className="cd-profile__avatar" aria-hidden>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
                        <rect width="24" height="24" rx="8" fill="var(--blue-600)" />
                        <text x="50%" y="55%" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">{(profile.name || "U").slice(0, 1).toUpperCase()}</text>
                    </svg>
                </div>

                <div className="cd-profile__meta">
                    <div className="cd-profile__name">{profile.name}</div>
                    <div className="cd-profile__email">{profile.email}</div>
                    <div className="cd-profile__plan">
                        <span className={`cd-badge ${profile.plan === "pro" ? "cd-badge--pro" : profile.plan === "business" ? "cd-badge--business" : ""}`}>
                            {upgradeLabel}
                        </span>
                        {profile.plan !== "pro" && (
                            <button className="cd-btn cd-btn--upgrade" onClick={() => setShowUpgrade(true)}>
                                Upgrade to Pro
                            </button>
                        )}
                    </div>
                </div>

                <div className="cd-profile__actions">
                    {editing ? (
                        <>
                            <button className="cd-btn" onClick={saveProfile} aria-label="Save profile">Save</button>
                            <button className="cd-btn cd-btn--ghost" onClick={cancelEdit} aria-label="Cancel">Cancel</button>
                        </>
                    ) : (
                        <>
                            <button className="cd-btn" onClick={startEdit} aria-label="Edit profile">Edit</button>
                            <button className="cd-btn cd-btn--danger" onClick={onLogout} aria-label="Logout">Logout</button>
                        </>
                    )}
                </div>
            </header>

            <form className="cd-profile__form" onSubmit={saveProfile} aria-hidden={!editing}>
                <label className="cd-form-row">
                    <span className="cd-form-label">Full name</span>
                    <input className="cd-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label">Email</span>
                    <input className="cd-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </label>

                {!editing && (
                    <div className="cd-profile__notes">
                        <small>Tip: Click Edit to change your name and email.</small>
                    </div>
                )}
            </form>

            <div className="cd-profile__settings" aria-label="Settings">
                <h4 className="cd-profile__section-title">Settings</h4>

                <div className="cd-profile__setting">
                    <div className="cd-profile__setting-info">
                        <div className="cd-profile__setting-title">Notifications</div>
                        <div className="cd-profile__setting-desc">Receive booking updates and offers</div>
                    </div>
                    <div className="cd-toggle-wrap">
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

                <div className="cd-profile__setting">
                    <div className="cd-profile__setting-info">
                        <div className="cd-profile__setting-title">Privacy mode</div>
                        <div className="cd-profile__setting-desc">Hide your profile from public listings</div>
                    </div>
                    <div className="cd-toggle-wrap">
                        <button
                            role="switch"
                            aria-checked={privacy}
                            className={`cd-toggle ${privacy ? "is-on" : ""}`}
                            onClick={togglePrivacy}
                        >
                            <span className="cd-toggle__knob" />
                        </button>
                    </div>
                </div>

                <div className="cd-profile__setting">
                    <div className="cd-profile__setting-info">
                        <div className="cd-profile__setting-title">Storage usage</div>
                        <div className="cd-profile__setting-desc">Manage photos and attachments</div>
                    </div>
                    <div>
                        <div className="cd-progress" aria-hidden>
                            <div className="cd-progress__bar" style={{ width: "28%" }} />
                        </div>
                        <small className="cd-muted">28% used</small>
                    </div>
                </div>
            </div>

            <div className="cd-profile__danger">
                <button
                    className="cd-link cd-link--danger"
                    onClick={() => {
                        if (confirm("Delete local profile data? This only clears demo storage.")) {
                            localStorage.removeItem(STORAGE_KEY);
                            window.location.reload();
                        }
                    }}
                >
                    Delete local data
                </button>
            </div>

            {showUpgrade && (
                <div className="cd-modal" role="dialog" aria-modal="true" aria-label="Upgrade to Pro">
                    <div className="cd-modal__panel cd-modal__panel--small">
                        <div className="cd-modal__head">
                            <h3>Upgrade to Pro</h3>
                            <button className="cd-dismiss" aria-label="Close" onClick={() => setShowUpgrade(false)}>✕</button>
                        </div>

                        <div className="cd-upgrade-plans">
                            <div className={`cd-plan ${selectedPlan === "pro" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("pro")} tabIndex={0}>
                                <div className="cd-plan__title">Pro</div>
                                <div className="cd-plan__price">$6 / month</div>
                                <div className="cd-plan__desc">Priority support, featured listing, 5x storage</div>
                            </div>

                            <div className={`cd-plan ${selectedPlan === "business" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("business")} tabIndex={0}>
                                <div className="cd-plan__title">Business</div>
                                <div className="cd-plan__price">$20 / month</div>
                                <div className="cd-plan__desc">Team seats, analytics, 50GB storage</div>
                            </div>
                        </div>

                        <div className="cd-modal__footer">
                            <button className="cd-btn cd-btn--primary" onClick={confirmUpgrade} disabled={saving}>
                                {saving ? "Upgrading..." : `Upgrade to ${selectedPlan === "pro" ? "Pro" : "Business"}`}
                            </button>
                            <button className="cd-btn cd-btn--ghost" onClick={() => setShowUpgrade(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
