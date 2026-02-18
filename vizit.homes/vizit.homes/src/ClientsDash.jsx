import React, { useEffect, useState } from "react";
import "./client.css";
import HouseSearch from "./pages/ClientsPage/Searchhouse";
import ProfilePanel from "./pages/ClientsPage/Profile";


const StorageManager = {
    get: (k) => {
        try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
    },
    set: (k, v) => {
        try { localStorage.setItem(k, JSON.stringify(v)); } catch { }
    }
};

function ClientDashboard({ user = { id: "u1", name: "Guest" }, onLogout = () => { } }) {
    const [activeTab, setActiveTab] = useState("feed");
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filter, setFilter] = useState("all");
    const [likedProperties, setLikedProperties] = useState(new Set());
    const [showBookingModal, setShowBookingModal] = useState(null);

    useEffect(() => {
        const allProperties = StorageManager.get("houselink_properties") || demoProperties();
        setProperties(allProperties);
        setFilteredProperties(allProperties);

        // load liked set
        const likedArr = StorageManager.get("houselink_likes") || [];
        setLikedProperties(new Set(likedArr));
    }, []);

    useEffect(() => {
        if (filter === "all") setFilteredProperties(properties);
        else setFilteredProperties(properties.filter((p) => p.type === filter));
    }, [filter, properties]);

    useEffect(() => {
        // persist likes
        StorageManager.set("houselink_likes", Array.from(likedProperties));
    }, [likedProperties]);

    const handleLike = (propertyId) => {
        const next = new Set(likedProperties);
        if (next.has(propertyId)) {
            next.delete(propertyId);
        } else {
            next.add(propertyId);
        }
        setLikedProperties(next);

        // update likes count in storage
        const all = StorageManager.get("houselink_properties") || [];
        const updated = all.map((p) =>
            p.id === propertyId ? { ...p, likes: next.has(propertyId) ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1) } : p
        );
        StorageManager.set("houselink_properties", updated);
        setProperties(updated);
    };

    // Demo booking modal
    const BookingModal = ({ property, onClose }) => {
        const [bookingData, setBookingData] = useState({
            checkIn: "",
            checkOut: "",
            guests: 1,
            specialRequests: ""
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            const bookings = StorageManager.get("houselink_bookings") || [];
            // calculate days safely
            const inDate = new Date(bookingData.checkIn);
            const outDate = new Date(bookingData.checkOut);
            const days = Math.max(1, Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24)));
            const newBooking = {
                id: Date.now().toString(),
                propertyId: property.id,
                clientId: user.id,
                clientName: user.name,
                propertyTitle: property.title,
                ...bookingData,
                totalPrice: (property.price || 0) * days,
                status: "pending",
                createdAt: new Date().toISOString()
            };
            bookings.push(newBooking);
            StorageManager.set("houselink_bookings", bookings);

            // simple confirmation
            window.alert("Booking request submitted successfully!");
            onClose();
        };


        return (
            <div className="cd-modal" role="dialog" aria-modal="true" aria-label={`Book ${property.title}`}>













                <div className="cd-modal__panel">
                    <div className="cd-modal__header">
                        <h3>Book — {property.title}</h3>
                        <button className="cd-dismiss" aria-label="Close booking" onClick={onClose}>✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="cd-form">
                        <div className="cd-form-row">
                            <label>Check-in</label>
                            <input type="date" value={bookingData.checkIn} onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })} required />
                        </div>

                        <div className="cd-form-row">
                            <label>Check-out</label>
                            <input type="date" value={bookingData.checkOut} onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })} required />
                        </div>

                        <div className="cd-form-row">
                            <label>Guests</label>
                            <select value={bookingData.guests} onChange={(e) => setBookingData({ ...bookingData, guests: Number(e.target.value) })}>
                                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        <div className="cd-form-row">
                            <label>Special requests</label>
                            <textarea rows="3" value={bookingData.specialRequests} onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })} placeholder="Any details..." />
                        </div>

                        <div className="cd-form-footer">
                            <div className="cd-price">Price: <strong>${property.price || 0}</strong> / night</div>
                            <button type="submit" className="cd-btn cd-btn--primary">Submit Booking Request</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const PropertyCard = ({ property }) => (
        <article className="cd-card" aria-labelledby={`p-${property.id}-title`}>
            {property.images && property.images.length > 0 && (
                <div className="cd-card__media">
                    <img src={property.images[0]} alt={property.title} onError={(e) => { e.target.style.display = "none"; }} />
                </div>
            )}

            <div className="cd-card__body">
                <div className="cd-card__head">
                    <div>
                        <h4 id={`p-${property.id}-title`} className="cd-card__title">{property.title}</h4>
                        <div className="cd-card__meta">{property.type} • {property.location?.city || property.location?.address}</div>
                    </div>

                    <div className="cd-card__price">
                        <div className="cd-card__price-amount">${property.price}</div>
                        <div className="cd-card__price-sub">per night</div>
                    </div>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                    <div className="cd-card__amenities">
                        {property.amenities.slice(0, 4).map((a, i) => <span key={i} className="cd-chip">{a}</span>)}
                        {property.amenities.length > 4 && <span className="cd-more">+{property.amenities.length - 4} more</span>}
                    </div>
                )}

                <div className="cd-card__stats">
                    <button className={`cd-like ${likedProperties.has(property.id) ? "active" : ""}`} onClick={() => handleLike(property.id)} aria-pressed={likedProperties.has(property.id)}>
                        <ion-icon name={likedProperties.has(property.id) ? "heart" : "heart-outline"}></ion-icon>
                        <span>{property.likes || 0}</span>
                    </button>

                    <div className="cd-views">
                        <ion-icon name="eye-outline" /> <span>{property.views || 0}</span>
                    </div>
                </div>

                <div className="cd-card__actions">
                    <button className="cd-btn" onClick={() => handleLike(property.id)}>
                        <ion-icon name={likedProperties.has(property.id) ? "heart" : "heart-outline"} /> {likedProperties.has(property.id) ? "Liked" : "Like"}
                    </button>

                    <button className="cd-btn cd-btn--primary" onClick={() => setShowBookingModal(property)}>
                        <ion-icon name="calendar" /> Book Now
                    </button>
                </div>
            </div>
        </article>
    );

    return (
        <div className="cd-root">

            {/* <aside className="cd-sidebar" aria-label="Main navigation">
                <div className="cd-sidebar__brand">
                    <ion-icon name="flag-outline" class="cd-sidebar__brand-icon"></ion-icon>
                    <div className="cd-sidebar__brand-text">

                        <small>Cameroon</small>
                    </div>
                </div>

                <nav className="cd-sidebar__nav" aria-label="Main navigation">
                    <button className={`cd-sidebar__item ${activeTab === 'feed' ? 'is-active' : ''}`} onClick={() => setActiveTab('feed')}>
                        <ion-icon name="home" /> <span>Home</span>
                    </button>
                    <button className={`cd-sidebar__item ${activeTab === 'search' ? 'is-active' : ''}`} onClick={() => setActiveTab('search')}>
                        <ion-icon name="search" /> <span>Search</span>
                    </button>
                    <button className={`cd-sidebar__item ${activeTab === 'saved' ? 'is-active' : ''}`} onClick={() => setActiveTab('saved')}>
                        <ion-icon name="heart" /> <span>Saved</span>
                    </button>
                    <button className={`cd-sidebar__item ${activeTab === 'profile' ? 'is-active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <ion-icon name="person" /> <span>Profile</span>
                    </button>
                </nav>


            </aside> */}


            <aside className="cd-sidebar" aria-label="Main navigation">


                {/* BRAND (optional keep) */}
                <div className="cd-sidebar__brand" style={{ marginTop: 10 }}>
                    <ion-icon name="flag-outline" class="cd-sidebar__brand-icon"></ion-icon>
                    <div className="cd-sidebar__brand-text">
                        <small>Cameroon</small>
                    </div>
                </div>

                {/* NAV */}
                <nav className="cd-sidebar__nav" aria-label="Main navigation">
                    <button className={`cd-sidebar__item ${activeTab === 'feed' ? 'is-active' : ''}`} onClick={() => setActiveTab('feed')}>
                        <ion-icon name="home" /> <span>Home</span>
                    </button>

                    <button className={`cd-sidebar__item ${activeTab === 'search' ? 'is-active' : ''}`} onClick={() => setActiveTab('search')}>
                        <ion-icon name="search" /> <span>Search</span>
                    </button>

                    <button className={`cd-sidebar__item ${activeTab === 'saved' ? 'is-active' : ''}`} onClick={() => setActiveTab('saved')}>
                        <ion-icon name="heart" /> <span>Saved</span>
                    </button>

                    <button className={`cd-sidebar__item ${activeTab === 'profile' ? 'is-active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <ion-icon name="person" /> <span>Profile</span>
                    </button>
                </nav>


            </aside>



            <header className="cd-header">
                <div className="cd-header__inner">
                    <div className="cd-brand">
                        <ion-icon name="home" class="cd-brand__icon"></ion-icon>
                        <span className="cd-brand__title">Vizit.Homes</span>
                    </div>

                    <div className="cd-header__actions">
                        {/* <span className="cd-welcome">Welcome, {user.name}</span> */}
                        <button className="cd-link" onClick={onLogout}>Logout</button>
                    </div>
                </div>
            </header>

            <nav className="cd-filterbar" aria-label="Property filters" >
                <div className="cd-filterbar__inner">
                    {[
                        { key: "all", label: "All", icon: "home" },
                        { key: "hotel", label: "Hotels", icon: "business" },
                        { key: "motel", label: "Motels", icon: "bed" },
                        { key: "guesthouse", label: "Guest_Houses", icon: "home-outline" },
                        { key: "apartment", label: "Apartments", icon: "business-outline" },
                        { key: "estate", label: "Estates", icon: "library" }
                    ].map((t) => (
                        <button
                            key={t.key}
                            className={`cd-filter ${filter === t.key ? "is-active" : ""}`}
                            onClick={() => setFilter(t.key)}
                            aria-pressed={filter === t.key}
                        >
                            <ion-icon name={t.icon}></ion-icon>
                            <span>{t.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* <main className="cd-main">
                {
                    case1 "home":<div className="cd-list">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((p) => <PropertyCard key={p.id} property={p} />)
                    ) : (
                        <div className="cd-empty">
                            <ion-icon name="search-outline" class="cd-empty__icon"></ion-icon>
                            <h3>No properties found</h3>
                            <p>Try changing filters or check back later.</p>
                        </div>
                    )}
                </div>
                break;
                case2 "saved":<div className="cd-list">
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((p) => <PropertyCard key={p.id} property={p} />)
                    ) : (
                        <div className="cd-empty">
                            <ion-icon name="search-outline" class="cd-empty__icon"></ion-icon>
                            <h3>No properties found</h3>
                            <p>Try changing filters or check back later.</p>
                        </div>
                    )}
                </div>
                case2 "profile": <ProfilePanel />
                case2 "search":<HouseSearch
                    properties={properties}
                    onResults={(results) => {
                        setFilteredProperties([...results]);
                    }}
                />

            </main> */}
            <main className="cd-main" role="main">
                {(() => {
                    switch (activeTab) {
                        case "feed": {
                            return (
                                <div className="cd-list">
                                    {filteredProperties.length > 0 ? (
                                        filteredProperties.map((p) => (
                                            <PropertyCard key={p.id} property={p} />
                                        ))
                                    ) : (
                                        <div className="cd-empty">
                                            <ion-icon name="search-outline" className="cd-empty__icon" />
                                            <h3>No properties found</h3>
                                            <p>Try changing filters or check back later.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        case "saved": {
                            const saved = properties.filter((p) => likedProperties.has(p.id));
                            return (
                                <div className="cd-list">
                                    {saved.length > 0 ? (
                                        saved.map((p) => <PropertyCard key={p.id} property={p} />)
                                    ) : (
                                        <div className="cd-empty">
                                            <ion-icon name="heart-dislike-outline" className="cd-empty__icon" />
                                            <h3>No saved properties</h3>
                                            <p>Save properties to view them here.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        case "search": {
                            return (
                                <>
                                    <HouseSearch
                                        properties={properties}
                                        onResults={(results) => {
                                            setFilteredProperties([...results]);
                                        }}
                                        onQuery={(q) => {
                                            // optional: you already console.log elsewhere
                                            console.log("search query:", q);
                                        }}
                                    />
                                    {/* show results right below search (optional) */}
                                    <div style={{ marginTop: 16 }}>
                                        <div className="cd-list">
                                            {filteredProperties.length > 0 ? (
                                                filteredProperties.map((p) => <PropertyCard key={p.id} property={p} />)
                                            ) : (
                                                <div className="cd-empty">
                                                    <ion-icon name="search-outline" className="cd-empty__icon" />
                                                    <h3>No matching properties</h3>
                                                    <p>Try a different search or filter.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            );
                        }

                        case "profile": {
                            // local state for toggles (you can lift these to top-level if needed)
                            return (
                                <ProfilePanel />
                            );
                        }

                        default:
                            return (
                                <div className="cd-empty">
                                    <h3>Unknown tab</h3>
                                </div>
                            );
                    }
                })()}
            </main>

            <footer className="cd-bottomnav" aria-hidden>
                <div className="cd-bottomnav__inner">
                    {[
                        { key: "feed", label: "Home", emoji: "home" },
                        { key: "search", label: "Search", emoji: "search" },
                        { key: "saved", label: "Saved", emoji: "heart" },
                        { key: "profile", label: "Profile", emoji: "person" }
                    ].map((t) => (
                        <button key={t.key} className={`cd-bottomnav__btn ${activeTab === t.key ? "is-active" : ""}`} onClick={() => setActiveTab(t.key)}>
                            <ion-icon name={t.emoji}></ion-icon>
                            <small>{t.label}</small>
                        </button>
                    ))}
                </div>
            </footer>

            {showBookingModal && <BookingModal property={showBookingModal} onClose={() => setShowBookingModal(null)} />}
        </div>
    );
}

/* A simple demo dataset used when StorageManager has no properties */
function demoProperties() {
    const sample = [

        {
            id: "p1",
            title: "Cozy Yaoundé Apartment",
            type: "apartment",
            price: 55,
            likes: 12,
            views: 120,
            location: { city: "Yaoundé", address: "Quartier Elig-Essono" },
            amenities: ["WiFi", "Parking", "Kitchen", "AC"],
            images: ["https://images.unsplash.com/photo-1505691723518-36a1c95b35b1?auto=format&fit=crop&w=1200&q=80"]
        },
        {
            id: "p2",
            title: "Seafront Limbe Guest House",
            type: "guesthouse",
            price: 80,
            likes: 8,
            views: 40,
            location: { city: "Limbe", address: "Beach Road" },
            amenities: ["Breakfast", "Sea view", "Parking"],
            images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"]
        },
        {
            id: "p3",
            title: "Modern Douala Studio",
            type: "hotel",
            price: 70,
            likes: 22,
            views: 230,
            location: { city: "Douala", address: "Bonapriso" },
            amenities: ["Gym", "Pool", "WiFi"],
            images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"]
        }
    ];
    StorageManager.set("houselink_properties", sample);
    return sample;
}

export default ClientDashboard;











