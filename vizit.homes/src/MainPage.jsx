import React, { useEffect, useRef, useState } from "react";
import "./style.css"
function MainPage({ onRoleSelect = () => { } }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const drawerRef = useRef(null);
    const heroRef = useRef(null);

    // Enhanced scroll lock + focus trap
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "";
        document.body.style.paddingRight = drawerOpen ? "calc(window.innerWidth - document.documentElement.clientWidth)px" : "";

        function onKey(e) {
            if (e.key === "Escape" && drawerOpen) setDrawerOpen(false);

            if (drawerOpen && e.key === "Tab") {
                const root = drawerRef.current;
                if (!root) return;
                const focusable = Array.from(
                    root.querySelectorAll(
                        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    )
                );
                if (!focusable.length) {
                    e.preventDefault();
                    return;
                }
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [drawerOpen]);

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Enhanced drawer focus management
    useEffect(() => {
        if (!drawerOpen) return;
        const root = drawerRef.current;
        if (!root) return;
        const firstFocusable = root.querySelector(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) firstFocusable.focus();
    }, [drawerOpen]);

    // Mouse move parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!heroRef.current) return;
            const { clientX, clientY } = e;
            const { left, top, width, height } = heroRef.current.getBoundingClientRect();
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;

            heroRef.current.style.transform = `
                perspective(1000px)
                rotateX(${y * 2}deg)
                rotateY(${x * 2}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
        };

        const hero = heroRef.current;
        if (hero) {
            hero.addEventListener("mousemove", handleMouseMove);
        }

        return () => {
            if (hero) {
                hero.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, []);

    return (
        <div className="mp-root">
            {/* Enhanced background layers */}
            <div className="mp-bg mp-bg--gradient" />
            <div className="mp-bg mp-bg--particles" />
            <div className="mp-bg mp-bg--noise" />
            <div className="mp-bg mp-bg--overlay" />

            {/* Floating particles */}
            <div className="mp-particles">
                {[...Array(15)].map((_, i) => (
                    <div key={i} className="mp-particle" style={{
                        '--delay': `${i * 0.5}s`,
                        '--duration': `${15 + i * 2}s`,
                        '--size': `${20 + i * 3}px`,
                        left: `${Math.random() * 100}%`
                    }} />
                ))}
            </div>

            {/* Enhanced top bar */}
            <header className="mp-topbar" role="banner">
                <div className="mp-brand">
                    <div className="mp-brand-icon">
                        <div className="mp-brand-glow" />
                        <ion-icon name="home-outline" />
                    </div>
                    <span className="mp-brand-text">HouseLink</span>
                </div>

                <div className="mp-actions">
                    <button
                        className="mp-cta-mini mp-cta-mini--owner"
                        onClick={() => onRoleSelect("owner")}
                        title="Quick Owner"
                    >
                        <ion-icon name="business" />
                        <span className="mp-tooltip">Owner</span>
                    </button>

                    <button
                        className="mp-cta-mini mp-cta-mini--client"
                        onClick={() => onRoleSelect("client")}
                        title="Quick Client"
                    >
                        <ion-icon name="person" />
                        <span className="mp-tooltip">Client</span>
                    </button>

                    <button
                        className="mp-menu-toggle"
                        aria-expanded={drawerOpen}
                        aria-controls="mp-drawer"
                        aria-label={drawerOpen ? "Close menu" : "Open menu"}
                        onClick={() => setDrawerOpen((s) => !s)}
                    >
                        <div className="mp-menu-bars">
                            <span className={`mp-menu-bar ${drawerOpen ? 'mp-menu-bar--1' : ''}`} />
                            <span className={`mp-menu-bar ${drawerOpen ? 'mp-menu-bar--2' : ''}`} />
                            <span className={`mp-menu-bar ${drawerOpen ? 'mp-menu-bar--3' : ''}`} />
                        </div>
                    </button>
                </div>
            </header>

            {/* Enhanced slide-out drawer */}
            <nav
                id="mp-drawer"
                ref={drawerRef}
                className={`mp-drawer ${drawerOpen ? "is-open" : ""}`}
                aria-hidden={!drawerOpen}
                aria-label="Main menu"
            >
                <div className="mp-drawer-header">
                    <h2>Navigation</h2>
                </div>
                <ul className="mp-drawer-list">
                    {[
                        { icon: "home-outline", label: "Home", href: "#home" },
                        { icon: "sparkles-outline", label: "Features", href: "#features" },
                        { icon: "images-outline", label: "Gallery", href: "#gallery" },
                        { icon: "chatbubbles-outline", label: "Testimonials", href: "#testimonials" },
                        { icon: "mail-outline", label: "Contact", href: "#contact" }
                    ].map((item, index) => (
                        <li key={item.label}>
                            <a
                                href={item.href}
                                onClick={() => setDrawerOpen(false)}
                                style={{ '--delay': `${index * 0.1}s` }}
                            >
                                <div className="mp-drawer-icon">
                                    <ion-icon name={item.icon} />
                                </div>
                                <span>{item.label}</span>
                                <div className="mp-drawer-arrow">
                                    <ion-icon name="chevron-forward" />
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="mp-drawer-cta">
                    <button
                        className="mp-btn mp-btn--owner mp-btn--glow"
                        onClick={() => {
                            setDrawerOpen(false);
                            onRoleSelect("owner");
                        }}
                    >
                        <div className="mp-btn-glow" />
                        <ion-icon name="business" />
                        <span>Owner Login</span>
                    </button>
                    <button
                        className="mp-btn mp-btn--client mp-btn--glow"
                        onClick={() => {
                            setDrawerOpen(false);
                            onRoleSelect("client");
                        }}
                    >
                        <div className="mp-btn-glow" />
                        <ion-icon name="person" />
                        <span>Client Login</span>
                    </button>
                </div>
            </nav>

            {/* Enhanced main content */}
            <main className="mp-stage" id="home">
                {/* Enhanced hero section */}
                <section className="mp-hero-section">
                    <div ref={heroRef} className="mp-hero-card">
                        <div className="mp-hero-left">
                            <div className="mp-hero-badge">
                                <div className="mp-badge-glow" />
                                <ion-icon name="home" />
                            </div>

                            <h1 className="mp-hero-title">
                                <span className="mp-hero-title-main">HouseLink</span>
                                <span className="mp-hero-title-sub">Smart Property Platform</span>
                            </h1>

                            <p className="mp-hero-sub">
                                Discover, list and manage properties with next-generation UX.
                                <span className="mp-hero-highlight"> AI-powered matching.</span>
                            </p>

                            <div className="mp-cta-row">
                                <button
                                    className="mp-btn mp-btn--owner mp-btn--large mp-btn--glow"
                                    onClick={() => onRoleSelect("owner")}
                                >
                                    <div className="mp-btn-glow" />
                                    <ion-icon name="business" />
                                    <span>Login as Owner</span>
                                </button>

                                <button
                                    className="mp-btn mp-btn--client mp-btn--large mp-btn--glow"
                                    onClick={() => onRoleSelect("client")}
                                >
                                    <div className="mp-btn-glow" />
                                    <ion-icon name="person" />
                                    <span>Login as Client</span>
                                </button>
                            </div>

                            <div className="mp-stats">
                                <div className="mp-stat">
                                    <span className="mp-stat-number">500+</span>
                                    <span className="mp-stat-label">Properties</span>
                                </div>
                                <div className="mp-stat">
                                    <span className="mp-stat-number">98%</span>
                                    <span className="mp-stat-label">Satisfaction</span>
                                </div>
                                <div className="mp-stat">
                                    <span className="mp-stat-number">24/7</span>
                                    <span className="mp-stat-label">Support</span>
                                </div>
                            </div>
                        </div>

                        <aside className="mp-hero-right">
                            <div className="mp-media-stack">
                                <div
                                    className="mp-media mp-media--top"
                                    style={{
                                        backgroundImage:
                                            'url("https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80")',
                                    }}
                                />
                                <div
                                    className="mp-media mp-media--middle"
                                    style={{
                                        backgroundImage:
                                            'url("https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80")',
                                    }}
                                />
                                <div
                                    className="mp-media mp-media--bottom"
                                    style={{
                                        backgroundImage:
                                            'url("https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80")',
                                    }}
                                />
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Enhanced features */}
                <section id="features" className="mp-features">
                    <div className="mp-section-header">
                        <h2 className="mp-section-title">Smart Features</h2>
                        <p className="mp-section-subtitle">Everything you need for modern property management</p>
                    </div>
                    <div className="mp-features-grid">
                        {[
                            {
                                icon: "search",
                                title: "AI-Powered Search",
                                description: "Smart filters, maps and saved searches with machine learning recommendations.",
                                active: activeFeature === 0
                            },
                            {
                                icon: "receipt-outline",
                                title: "Smart Management",
                                description: "Automated listing optimization, pricing suggestions, and performance analytics.",
                                active: activeFeature === 1
                            },
                            {
                                icon: "chatbubbles-outline",
                                title: "Instant Connect",
                                description: "Real-time messaging, video tours, and automated booking coordination.",
                                active: activeFeature === 2
                            }
                        ].map((feature, index) => (
                            <article
                                key={feature.title}
                                className={`mp-feature ${feature.active ? 'is-active' : ''}`}
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div className="mp-feature-glow" />
                                <div className="mp-feature-icon">
                                    <div className="mp-feature-icon-bg" />
                                    <ion-icon name={feature.icon} />
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <div className="mp-feature-arrow">
                                    <ion-icon name="chevron-forward" />
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Enhanced gallery */}
                <section id="gallery" className="mp-gallery">
                    <div className="mp-section-header">
                        <h2 className="mp-section-title">Featured Properties</h2>
                        <p className="mp-section-subtitle">Discover amazing spaces curated for you</p>
                    </div>
                    <div className="mp-gallery-grid">
                        {[
                            'https://images.unsplash.com/photo-1576675788081-0a9a5fa1b9e3?auto=format&fit=crop&w=1000&q=80',
                            'https://images.unsplash.com/photo-1505692794403-53f8fb6a051e?auto=format&fit=crop&w=1000&q=80',
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
                            'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1000&q=80'
                        ].map((img, index) => (
                            <div
                                key={index}
                                className="mp-gallery-item"
                                style={{ backgroundImage: `url("${img}")` }}
                            >
                                <div className="mp-gallery-overlay">
                                    <h4>Modern Apartment {index + 1}</h4>
                                    <p>${(1500 + index * 200).toLocaleString()}/month</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Enhanced testimonials */}
                <section id="testimonials" className="mp-testimonials">
                    <div className="mp-section-header">
                        <h2 className="mp-section-title">Trusted by Thousands</h2>
                        <p className="mp-section-subtitle">See what our community says</p>
                    </div>
                    <div className="mp-testimonial-grid">
                        {[
                            {
                                quote: "HouseLink made listing my guest house effortless — bookings rose 40% in the first month! The AI pricing suggestions are incredibly accurate.",
                                author: "Ada Lovelace",
                                role: "Property Owner",
                                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80"
                            },
                            {
                                quote: "Found my dream apartment in 3 days. The virtual tours and instant messaging made the process smooth and stress-free. Highly recommended!",
                                author: "Paul Reynolds",
                                role: "Tenant",
                                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                            },
                            {
                                quote: "As a real estate agent, HouseLink has transformed how I manage listings. The analytics and automation save me 10+ hours weekly.",
                                author: "Maria Garcia",
                                role: "Real Estate Agent",
                                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
                            }
                        ].map((testimonial, index) => (
                            <blockquote key={index} className="mp-testimonial">
                                <div className="mp-testimonial-content">
                                    <p>{testimonial.quote}</p>
                                </div>
                                <div className="mp-testimonial-author">
                                    <img src={testimonial.avatar} alt={testimonial.author} />
                                    <div>
                                        <cite>{testimonial.author}</cite>
                                        <span>{testimonial.role}</span>
                                    </div>
                                </div>
                            </blockquote>
                        ))}
                    </div>
                </section>

                {/* Enhanced footer */}
                <footer id="contact" className="mp-footer">
                    <div className="mp-footer-content">
                        <div className="mp-footer-brand">
                            <div className="mp-brand">
                                <div className="mp-brand-icon">
                                    <ion-icon name="home-outline" />
                                </div>
                                <span className="mp-brand-text">HouseLink</span>
                            </div>
                            <p>Modern property management reimagined</p>
                        </div>
                        <div className="mp-footer-links">
                            <div className="mp-footer-column">
                                <h4>Platform</h4>
                                <a href="#features">Features</a>
                                <a href="#testimonials">Testimonials</a>
                                <a href="#pricing">Pricing</a>
                            </div>
                            <div className="mp-footer-column">
                                <h4>Support</h4>
                                <a href="#help">Help Center</a>
                                <a href="#contact">Contact</a>
                                <a href="#community">Community</a>
                            </div>
                            <div className="mp-footer-column">
                                <h4>Legal</h4>
                                <a href="#privacy">Privacy</a>
                                <a href="#terms">Terms</a>
                                <a href="#cookies">Cookies</a>
                            </div>
                        </div>
                    </div>
                    <div className="mp-footer-bottom">
                        <p>© {new Date().getFullYear()} HouseLink · Built with ❤️ for better living</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default MainPage;