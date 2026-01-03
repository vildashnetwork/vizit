import React, { useEffect, useRef, useState } from "react";
import "./style.css"
import { useNavigate } from "react-router-dom";
function MainPage({ onRoleSelect = () => { } }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const drawerRef = useRef(null);
    const heroRef = useRef(null);
    const navigate = useNavigate()
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
                    <span className="mp-brand-text" style={{ cursor: "pointer" }}
                        title="Home Tab"
                        onClick={() => {
                            window.location.href = "#home"

                        }
                        }>Vizit.homes
                    </span>

                </div>

                <div className="mp-actions">
                    <button
                        className="mp-cta-mini mp-cta-mini--owner"
                        onClick={() => {
                            onRoleSelect("owner")
                            navigate("/owner/login")

                        }}
                        title="Quick Owner"
                    >
                        <ion-icon name="business" />
                        <span className="mp-tooltip">Owner</span>
                    </button>

                    <button
                        className="mp-cta-mini mp-cta-mini--client"
                        onClick={() => {
                            onRoleSelect("client")
                            navigate("/user/login")

                        }}
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
                            navigate("/owner/login")
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
                            navigate("/user/login")

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
                                <span className="mp-hero-title-main">Vizit.homes</span>
                                <span className="mp-hero-title-sub">Smart Property Platform</span>
                            </h1>

                            <p className="mp-hero-sub">
                                Looking for a home dont worry Visit.Homes Gat you, whether you want to rent and
                                Apartment or buy a house or book hotels closer to you we Gat you on that
                                <br />
                                <span className="mp-hero-highlight">Whether you want rent or book appartment we dey here for you
                                    from Buea, Limbe, Douala, Yaounde And all over Cameroon.
                                </span>
                            </p>

                            <div className="mp-cta-row">
                                <button
                                    className="mp-btn mp-btn--owner mp-btn--large mp-btn--glow"
                                    onClick={() => {
                                        onRoleSelect("owner");
                                        navigate("/owner/login")
                                    }}
                                >
                                    <div className="mp-btn-glow" />
                                    <ion-icon name="business" />
                                    <span>Login as Owner</span>
                                </button>

                                <button
                                    className="mp-btn mp-btn--client mp-btn--large mp-btn--glow"
                                    onClick={() => {
                                        onRoleSelect("client")
                                        navigate("/user/login")
                                    }}
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
                                <div className="mp-stat">
                                    <span className="mp-stat-number">24+</span>
                                    <span className="mp-stat-label">Number Of Users</span>
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
                                icon: "home-outline",
                                title: "Find Your Perfect Home",
                                description:
                                    "Explore verified listings of apartments, guest houses, hotels, and estates across Cameroon. Whether in Yaoundé, Douala, or Buea — your next home is just a click away."
                            },
                            {
                                icon: "business-outline",
                                title: "Empower Property Owners",
                                description:
                                    "Owners can list, manage, and showcase their properties with high-quality images and descriptions. Get discovered by thousands of verified clients actively looking for homes."
                            },
                            {
                                icon: "map-outline",
                                title: "Location-Based Search",
                                description:
                                    "Easily search for available homes near your preferred city or neighborhood. Vizit.Homes uses smart mapping to show you what’s available close to you."
                            },
                            {
                                icon: "shield-checkmark-outline",
                                title: "Verified & Secure Listings",
                                description:
                                    "Every property is reviewed before going live. Enjoy peace of mind knowing that you’re connecting with real owners and verified listings."
                            },
                            {
                                icon: "chatbubbles-outline",
                                title: "Direct Owner-Client Chat",
                                description:
                                    "No middlemen. Chat directly with property owners, ask questions, and book viewings instantly through our secure in-app messaging."
                            },
                            {
                                icon: "stats-chart-outline",
                                title: "Smart Insights for Owners",
                                description:
                                    "Monitor how your property is performing with real-time statistics — views, interest rates, and inquiries — all on one clean dashboard."
                            },
                            {
                                icon: "card-outline",
                                title: "Flexible Payment Options",
                                description:
                                    "From daily rentals to long-term stays, Vizit.Homes supports multiple payment methods to make transactions simple and transparent."
                            },
                            {
                                icon: "earth-outline",
                                title: "Built for Cameroon",
                                description:
                                    "Our mission is to digitize the real estate market in Cameroon — connecting owners, clients, and agents under one reliable and trusted platform."
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
                            'data:image/jpeg;base64,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',
                            'data:image/jpeg;base64,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',
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl2DDssL5AkISDCvJiXC_dJGl-lA2usf1AQQ&s',
                            'data:image/jpeg;base64,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'
                        ].map((img, index) => (
                            <div
                                key={index}
                                className="mp-gallery-item"
                                style={{ backgroundImage: `url("${img}")` }}
                            >
                                <div className="mp-gallery-overlay">
                                    <h4>Modern Apartment {index + 2}</h4>
                                    <p>{(3000 + index * 1000).toLocaleString()}FCFA/month</p>
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
                                quote: "Vizit.homes made finding my apartment in Douala so easy! The platform connected me with verified landlords and I found my perfect 3-bedroom in just 2 weeks.",
                                author: "Jean Mbarga",
                                role: "Tenant in Douala",
                                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                            },
                            {
                                quote: "As a property owner in Yaoundé, Vizit.homes has helped me manage my rentals efficiently. The booking system is seamless and I've increased my occupancy rate by 35%.",
                                author: "Samuel Eto'o",
                                role: "Property Owner",
                                avatar: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=150&q=80"
                            },
                            {
                                quote: "Moving to Buea was stress-free thanks to Vizit.homes. The virtual tours saved me multiple trips and the agents were incredibly helpful throughout the process.",
                                author: "David Nganou",
                                role: "Client in Buea",
                                avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80"
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
                                <span className="mp-brand-text">Vizit.homes</span>
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
                        <p>© {new Date().getFullYear()} Vizit.homes · Built with love for better living</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}

export default MainPage;