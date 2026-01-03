import React, { useEffect, useState } from "react";
import "./client.css";
import HouseSearch from "./pages/ClientsPage/Searchhouse";
import ProfilePanel from "./pages/ClientsPage/Profile";
import axios from "axios";
import { PropertyCard } from "./Clients/PropertyCard";
import PropertyDetail from "./Clients/Details";
import ChatApp from "./Clients/Chats/App";
import ReelsApp from "./Clients/Reel/App";


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
    const [selectedid, setselectedid] = useState("")
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filter, setFilter] = useState("all");
    const [likedProperties, setLikedProperties] = useState(new Set());
    const [showBookingModal, setShowBookingModal] = useState(null);
    const [userhere, setuser] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const decoding = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    console.warn("No token found")
                    setLoading(false)
                    return
                }

                const data = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/user/decode/token/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                if (data.status === 200) {
                    setuser(data.data.user)

                }
            } catch (error) {
                console.error("Failed to decode token:", error)
            } finally {
                setLoading(false)
            }
        }
        decoding()
    }, [])


    useEffect(() => {
        const getall = async () => {
            try {
                const res = await axios.get("https://vizit-backend-hubw.onrender.com/api/house/houses")
                if (res) {
                    setProperties(res.data.houses)
                }
            } catch (error) {
                console.log(error);

            }
        }
        getall()
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



    return (
        <div className="cd-root">



            <aside className="cd-sidebar" aria-label="Main navigation">


                {/* BRAND (optional keep) */}
                <div className="cd-sidebar__brand" style={{ marginTop: 26 }}>
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
                        <ion-icon name="chatbox-ellipses-outline"></ion-icon><span>Chats</span>
                    </button>

                    <button className={`cd-sidebar__item ${activeTab === 'profile' ? 'is-active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <ion-icon name="person" /> <span>Profile</span>
                    </button>



                    <button className={`cd-sidebar__item ${activeTab === 'view_details' ? 'is-active' : ''}`} onClick={() => setActiveTab('view_details')}>
                        <ion-icon name="eye-outline"></ion-icon> <span>view details</span>
                    </button>



                    <button className={`cd-sidebar__item ${activeTab === 'Reels' ? 'is-active' : ''}`} onClick={() => setActiveTab('Reels')}>
                        <ion-icon name="videocam-outline"></ion-icon> <span>Reels</span>
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
                        <div className="cd-profile__avatar" onClick={() => setActiveTab('profile')} style={{ cursor: "pointer" }} aria-hidden>
                            <img
                                src={userhere?.profile}
                                alt={userhere?.name}
                                width={40}
                                height={40}
                                className="img-container "
                            />
                        </div>
                        <span className="cd-welcome short">{userhere.name}</span>
                        <button className="cd-link" onClick={onLogout}>Logout</button>
                    </div>

                </div>
            </header>

            <nav className="cd-filterbar" aria-label="Property filters" >
                <div className="cd-filterbar__inner">
                    {[
                        { key: "all", label: "All", icon: "home" },
                        { key: "Hotel", label: "Hotels", icon: "business" },
                        { key: "motel", label: "Motels", icon: "bed" },
                        { key: "Guest House", label: "Guest_Houses", icon: "home-outline" },
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


            <main className="cd-main" role="main">
                {(() => {
                    switch (activeTab) {
                        case "feed": {
                            return (
                                <div className="cd-list">
                                    {filteredProperties.length > 0 ? (
                                        filteredProperties.map((p) => (
                                            <PropertyCard key={p.id} property={p}
                                                setselectedid={setselectedid}
                                                setActiveTab={setActiveTab}
                                                handleLike={handleLike}
                                                setShowBookingModal={setShowBookingModal}
                                                likedProperties={likedProperties} />
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
                            return (

                                <ChatApp setActiveTab={setActiveTab} />

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
                                <ProfilePanel userhere={userhere} />
                            );
                        }

                        case "Reels": {
                            // local state for toggles (you can lift these to top-level if needed)
                            return (
                                <ReelsApp setActiveTab={setActiveTab} />
                            );
                        }

                        case "view_details": {
                            if (!selectedid) {
                                return (
                                    <div className="cd-empty">
                                        <h3>No property selected</h3>
                                    </div>
                                );
                            }

                            return <PropertyDetail propertyId={selectedid} currentUser={userhere} OwnerId={properties?.owner?.id} />;
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
                        { key: "saved", label: "Chats", emoji: "chatbox-ellipses-outline" },
                        { key: "profile", label: "Profile", emoji: "person" },
                        { key: "view_details", label: "view details", emoji: "eye-outline" },
                        { key: "Reels", label: "Reels", emoji: "videocam-outline" }

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











