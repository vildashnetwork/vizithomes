import React, { useEffect, useState } from "react";
import "./owner-dashboard.css";


const StorageManager = {
    get: (k) => {
        try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
    },
    set: (k, v) => {
        try { localStorage.setItem(k, JSON.stringify(v)); } catch { }
    }
};

function OwnerDashboard({ user = { id: "owner1", name: "Owner" }, onLogout = () => { } }) {
    const [activeTab, setActiveTab] = useState("properties");
    const [properties, setProperties] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        const all = StorageManager.get("houselink_properties") || [];
        setProperties(all.filter(p => p.ownerId === user.id));
    }, [user.id]);

    // Create form component (inner)
    function CreatePropertyForm({ onClose }) {
        const [formData, setFormData] = useState({
            title: "",
            type: "hotel",
            price: "",
            address: "",
            amenities: "",
            images: ""
        });
        const [submitting, setSubmitting] = useState(false);

        const handleChange = (k, v) => setFormData(fd => ({ ...fd, [k]: v }));

        const handleSubmit = async (e) => {
            e.preventDefault();
            // basic validation
            if (!formData.title.trim() || !formData.price || !formData.address.trim()) {
                alert("Please provide title, price and address.");
                return;
            }
            setSubmitting(true);
            try {
                const allProperties = StorageManager.get("houselink_properties") || [];
                const newProperty = {
                    id: Date.now().toString(),
                    ownerId: user.id,
                    title: formData.title.trim(),
                    type: formData.type,
                    price: Number(formData.price),
                    location: { address: formData.address.trim() },
                    amenities: formData.amenities
                        .split(",")
                        .map(a => a.trim())
                        .filter(Boolean),
                    images: formData.images
                        .split(",")
                        .map(i => i.trim())
                        .filter(Boolean),
                    available: true,
                    likes: 0,
                    views: 0,
                    bookings: 0,
                    createdAt: new Date().toISOString()
                };
                allProperties.push(newProperty);
                StorageManager.set("houselink_properties", allProperties);

                // update local list
                setProperties(allProperties.filter(p => p.ownerId === user.id));
                onClose?.();
            } catch (err) {
                console.error(err);
                alert("Failed to create property.");
            } finally {
                setSubmitting(false);
            }
        };

        return (
            <div className="od-modal" role="dialog" aria-modal="true" aria-label="Create Property">
                <div className="od-modal__panel">
                    <header className="od-modal__header">
                        <h3>Create New Property</h3>
                        <button className="od-btn-close" onClick={onClose} aria-label="Close">✕</button>
                    </header>

                    <form className="od-form" onSubmit={handleSubmit}>
                        <label>
                            <div className="od-label">Title</div>
                            <input
                                value={formData.title}
                                onChange={e => handleChange("title", e.target.value)}
                                required
                                className="od-input"
                                placeholder="e.g. Cozy Douala Apartment"
                            />
                        </label>

                        <label>
                            <div className="od-label">Type</div>
                            <select value={formData.type} onChange={e => handleChange("type", e.target.value)} className="od-input">
                                <option value="hotel">Hotel</option>
                                <option value="motel">Motel</option>
                                <option value="guesthouse">Guest House</option>
                                <option value="apartment">Apartment</option>
                                <option value="estate">Estate</option>
                            </select>
                        </label>

                        <label>
                            <div className="od-label">Price per night (USD)</div>
                            <input
                                value={formData.price}
                                onChange={e => handleChange("price", e.target.value)}
                                required
                                type="number"
                                step="0.01"
                                className="od-input"
                            />
                        </label>

                        <label>
                            <div className="od-label">Address</div>
                            <input
                                value={formData.address}
                                onChange={e => handleChange("address", e.target.value)}
                                required
                                className="od-input"
                                placeholder="Street, city"
                            />
                        </label>

                        <label>
                            <div className="od-label">Amenities (comma separated)</div>
                            <input
                                value={formData.amenities}
                                onChange={e => handleChange("amenities", e.target.value)}
                                className="od-input"
                                placeholder="WiFi, Pool, Parking"
                            />
                        </label>

                        <label>
                            <div className="od-label">Images (comma separated URLs)</div>
                            <input
                                value={formData.images}
                                onChange={e => handleChange("images", e.target.value)}
                                className="od-input"
                                placeholder="https://...jpg, https://...jpg"
                            />
                        </label>

                        <div className="od-form__actions">
                            <button type="button" className="od-btn od-btn--muted" onClick={onClose}>Cancel</button>
                            <button type="submit" className="od-btn od-btn--primary" disabled={submitting}>
                                {submitting ? "Creating..." : "Create Property"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // action stubs
    const handleDelete = (id) => {
        if (!window.confirm("Delete this property?")) return;
        const all = StorageManager.get("houselink_properties") || [];
        const next = all.filter(p => p.id !== id);
        StorageManager.set("houselink_properties", next);
        setProperties(next.filter(p => p.ownerId === user.id));
    };

    const handleEdit = (id) => {
        // placeholder - you can implement edit flow (open modal, prefill, save)
        alert("Edit flow not implemented in demo. Property id: " + id);
    };

    // Render
    return (
        <div className="od-root">
            <header className="od-header">
                <div className="od-header__left">
                    <div className="od-logo">HouseLink</div>
                    <div className="od-sub">Owner Dashboard</div>
                </div>

                <div className="od-header__right">
                    <div className="od-welcome">Welcome, <strong>{user.name}</strong></div>
                    <button className="od-logout" onClick={onLogout}>Logout</button>
                </div>
            </header>

            <div className="od-tabs" role="tablist" aria-label="Dashboard tabs">
                {["properties", "analytics", "bookings"].map(tab => (
                    <button
                        key={tab}
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={`od-tab ${activeTab === tab ? "is-active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <main className="od-main">
                {activeTab === "properties" && (
                    <>
                        <div className="od-actions">
                            <h2 className="od-title">My Properties</h2>
                            <button className="od-btn od-btn--primary" onClick={() => setShowCreateForm(true)}>
                                + Add Property
                            </button>
                        </div>

                        {properties.length === 0 ? (
                            <div className="od-empty">
                                <div className="od-empty__icon">🏠</div>
                                <h3>No properties yet</h3>
                                <p>Add your first listing to start receiving bookings.</p>
                                <button className="od-btn od-btn--primary" onClick={() => setShowCreateForm(true)}>Add Your First Property</button>
                            </div>
                        ) : (
                            <section className="od-grid" aria-live="polite">
                                {properties.map(p => (
                                    <article className="od-card" key={p.id}>
                                        <div className="od-card__media">
                                            {p.images && p.images[0] ? (
                                                // image with graceful fallback
                                                <img
                                                    src={p.images[0]}
                                                    alt={p.title}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = "none";
                                                        const placeholder = document.createElement("div");
                                                        placeholder.className = "od-card__media-placeholder";
                                                        placeholder.textContent = "Image unavailable";
                                                        e.target.parentNode.appendChild(placeholder);
                                                    }}
                                                />
                                            ) : (
                                                <div className="od-card__media-placeholder">No image</div>
                                            )}
                                        </div>

                                        <div className="od-card__body">
                                            <h3 className="od-card__title">{p.title}</h3>
                                            <div className="od-card__meta">
                                                <span className="od-type">{p.type}</span>
                                                <span className="od-price">${p.price}/night</span>
                                            </div>

                                            <div className="od-address">{p.location?.address}</div>

                                            <div className="od-stats">
                                                <div className="od-stat"><span className="od-stat-icon">❤</span>{p.likes}</div>
                                                <div className="od-stat"><span className="od-stat-icon">👁️</span>{p.views}</div>
                                                <div className="od-stat"><span className="od-stat-icon">📅</span>{p.bookings}</div>
                                            </div>

                                            <div className="od-card__actions">
                                                <button className="od-btn od-btn--muted" onClick={() => handleEdit(p.id)}>Edit</button>
                                                <button className="od-btn od-btn--danger" onClick={() => handleDelete(p.id)}>Delete</button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </section>
                        )}
                    </>
                )}

                {activeTab === "analytics" && (
                    <section>
                        <h2 className="od-title">Analytics</h2>
                        <div className="od-analytics">
                            <div className="od-analytics__card">
                                <p className="od-analytics__label">Total Properties</p>
                                <p className="od-analytics__value">{properties.length}</p>
                            </div>

                            <div className="od-analytics__card">
                                <p className="od-analytics__label">Total Bookings</p>
                                <p className="od-analytics__value">{properties.reduce((s, p) => s + (p.bookings || 0), 0)}</p>
                            </div>

                            <div className="od-analytics__card">
                                <p className="od-analytics__label">Total Views</p>
                                <p className="od-analytics__value">{properties.reduce((s, p) => s + (p.views || 0), 0)}</p>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === "bookings" && (
                    <section>
                        <h2 className="od-title">Bookings</h2>
                        <div className="od-empty">
                            <div className="od-empty__icon">📭</div>
                            <h3>No bookings yet</h3>
                            <p>Bookings will appear here when guests reserve your properties.</p>
                        </div>
                    </section>
                )}
            </main>

            {showCreateForm && <CreatePropertyForm onClose={() => setShowCreateForm(false)} />}
        </div>
    );
}

export default OwnerDashboard;
