import React, { useEffect, useState } from "react";
import "./owner-dashboard.css";
import CreatePropertyForm from "./CreateProperty";
import axios from "axios";
import HousePlatter from "./HousePlatter.jsx"
import HouseAnalytics from "./Ownergrph.jsx";
import AdminChatApp from "./Chats/App.jsx";
import ReelsApp from "./Reel/App.jsx";
import AdminReelsApp from "./Reel/App.jsx";
import ReelsPage from "./OwnerAddreels.jsx";
import OnwnerSetting from "./OwnersSettings.jsx";
const StorageManager = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
            return [];
        }
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
};

function OwnerDashboard({

    onLogout = () => { },
}) {
    const [activeTab, setActiveTab] = useState("properties");
    const [properties, setProperties] = useState([]);

    const [user, setuser] = useState(null)
    const [loading, setLoading] = useState(true)

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
                    `https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                if (data.status === 200) {
                    setuser(data.data.res)
                    console.log(loading ? "loading..." : user);

                }
            } catch (error) {
                console.error("Failed to decode token:", error)
            } finally {
                setLoading(false)
            }
        }
        decoding()
    }, [])

    const refreshProperties = () => {
        const all = StorageManager.get("houselink_properties");
        setProperties(all.filter((p) => p.ownerId === user.id));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this property?")) return;
        const all = StorageManager.get("houselink_properties");
        const next = all.filter((p) => p.id !== id);
        StorageManager.set("houselink_properties", next);
        refreshProperties();
    };

    const handleEdit = (id) => {
        alert("Edit flow not implemented yet. Property ID: " + id);
    };

    return (
        <div className="od-root">
            {/* HEADER */}
            <header className="od-header">
                <div className="od-header__left">
                    <div className="od-logo">VIZIT</div>
                </div>

                <div className="od-header__right">

                    <div className="od-welcome">
                        <div className="round">
                            <img className="round-profile" src={user?.profile} alt={user?.name} />
                        </div>
                        <span> <strong>{user?.name || "loading.."}</strong></span>
                    </div>
                    <button className="od-logout" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* TABS */}
            <div className="od-tabs" role="tablist">
                {["properties", "analytics", "Chats", "create", "Reels", "Addreels", "OnwnerSetting"].map((tab) => (
                    <button
                        key={tab}
                        role="tab"
                        aria-selected={activeTab === tab}
                        className={`od-tab ${activeTab === tab ? "is-active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "create" ? "Create_Property" : tab}
                    </button>
                ))}
            </div>

            {/* MAIN */}
            <main className="od-main">
                {activeTab === "properties" && (
                    <>
                        <HousePlatter user={user} />

                    </>
                )}

                {activeTab === "analytics" && (
                    <HouseAnalytics />
                )}


                {activeTab === "Addreels" && (
                    <ReelsPage userhere={user} />
                )}

                {activeTab === "Reels" && (
                    <AdminReelsApp setActiveTab={setActiveTab} />
                )}
                {activeTab === "OnwnerSetting" && (
                    <OnwnerSetting userhere={user} />
                )}


                {activeTab === "Chats" && (
                    <AdminChatApp setActiveTab={setActiveTab} />
                )}

                {activeTab === "create" && (
                    <CreatePropertyForm

                        onCreated={() => {
                            refreshProperties();
                            setActiveTab("properties");
                        }}
                    />
                )}
            </main>
        </div>
    );
}

export default OwnerDashboard;
