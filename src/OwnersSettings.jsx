
// ProfilePanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const STORAGE_KEY = "vizit_user_profile";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dgigs6v72/image/upload";
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
export default function OnwnerSetting({
    userhere,
    onLogout = () => { },
    onUpgrade = () => { },
}) {
    const [profile, setProfile] = useState(() =>
        loadFromStorage(userhere)
    );

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: userhere?.name || "",
        email: userhere?.email || "",
        location: userhere?.location || "",
        companyname: userhere?.companyname || "",
        bio: userhere?.bio || "",
        phone: userhere?.phone || "",
        IDno: userhere?.IDno || "",
        paymentmethod: userhere?.paymentmethod || "",

    });



    const [notifications, setNotifications] = useState(
        userhere?.Notifications ?? true
    );

    const [privacy, setPrivacy] = useState(
        userhere?.enabletwofactor ?? false
    );

    const [showUpgrade, setShowUpgrade] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

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
        e.preventDefault();
        if (!userhere?._id) return;

        setLoading(true);

        try {
            let imageUrl = profile.profile;

            if (imageFile) {
                imageUrl = await uploadImageToCloudinary();
            }

            await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/owner/edit/${userhere._id}`,
                {
                    name: form.name,
                    email: form.email,
                    location: form.location,
                    companyname: form.companyname,
                    bio: form.bio,
                    phone: form.phone,
                    IDno: form.IDno,
                    Notifications: notifications,
                    enabletwofactor: privacy,
                    profile: imageUrl,

                }
            );

            const updatedProfile = {
                ...profile,
                name: form.name,
                email: form.email,
                location: form.location,
                companyname: form.companyname,
                bio: form.bio,
                phone: form.phone,
                IDno: form.IDno,
                Notifications: notifications,
                enabletwofactor: privacy,
                profile: imageUrl,
            };
            setProfile(updatedProfile);
            saveToStorage(updatedProfile);
            setEditing(false);
            setImageFile(null);

            alert("Profile updated successfully");

            window.location.reload()

        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- sync storage ---------------- */
    useEffect(() => {
        saveToStorage(profile);
    }, [profile]);

    /* ---------------- ui handlers ---------------- */
    const startEdit = () => {
        setForm({ name: profile.name, email: profile.email });
        setEditing(true);
    };

    const cancelEdit = () => {
        setForm({ name: profile.name, email: profile.email });
        setImageFile(null);
        setEditing(false);
    };

    const toggleNotifications = () => {
        const next = !notifications;
        setNotifications(next);
        setProfile((p) => ({ ...p, Notifications: next }));
    };

    const togglePrivacy = () => {
        const next = !privacy;
        setPrivacy(next);
        setProfile((p) => ({ ...p, privacy: next }));
    };

    const confirmUpgrade = async () => {
        setSaving(true);
        await new Promise((r) => setTimeout(r, 450));
        const updated = { ...profile, plan: selectedPlan };
        setProfile(updated);
        saveToStorage(updated);
        setSaving(false);
        setShowUpgrade(false);
        onUpgrade(selectedPlan);
    };

    const upgradeLabel =
        profile.plan === "pro"
            ? "Pro (active)"
            : profile.plan === "business"
                ? "Business (active)"
                : "Free";

    /* ---------------- render ---------------- */
    return (
        <section className="cd-profile" aria-label="Profile panel" style={{
            background: "transparent",
            color: "#fff", padding: 20
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
                    <div className="cd-profile__name" style={{ color: "#fff" }}>{userhere?.name}</div>
                    <div className="cd-profile__email" style={{ color: "#fff" }}>{userhere?.email}</div>

                    <div className="cd-profile__plan" style={{ color: "#fff" }}>
                        <span
                            className={`cd-badge ${profile.plan === "pro"
                                ? "cd-badge--pro"
                                : profile.plan === "business"
                                    ? "cd-badge--business"
                                    : ""
                                }`}
                        >
                            {upgradeLabel}
                        </span>

                        {profile.plan !== "pro" && (
                            <button
                                className="cd-btn cd-btn--upgrade"
                                onClick={() => setShowUpgrade(true)}
                            >
                                Upgrade to Pro
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
                    <span className="cd-form-label" style={{ color: "#fff" }}>Full name</span>
                    <input
                        className="cd-input"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#fff" }}>Email</span>
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
                    <span className="cd-form-label" style={{ color: "#fff" }}>ID Card Number:</span>
                    <input
                        className="cd-input"
                        type="email"
                        value={form.IDno}
                        onChange={(e) =>
                            setForm({ ...form, IDno: e.target.value })
                        }
                    />
                </label>

                <label className="cd-form-row">
                    <span className="cd-form-label" style={{ color: "#fff" }}>Company Name</span>
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
                    <span className="cd-form-label" style={{ color: "#fff" }}>Phone Number</span>
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
                    <span className="cd-form-label" style={{ color: "#fff" }}>Company's Bio</span>
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
                    <span className="cd-form-label" style={{ color: "#fff" }}>Payment Method :</span>

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
                    <span className="cd-form-label" style={{ color: "#fff" }}>Click to Uplooad A Profile photo</span>

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
                >
                    <div className="cd-modal__panel cd-modal__panel--small">
                        <div className="cd-modal__head">
                            <h3>Upgrade to Pro</h3>
                            <button
                                className="cd-dismiss"
                                onClick={() => setShowUpgrade(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="cd-upgrade-plans">
                            <div
                                className={`cd-plan ${selectedPlan === "pro"
                                    ? "is-selected"
                                    : ""
                                    }`}
                                onClick={() => setSelectedPlan("pro")}
                            >
                                <div className="cd-plan__title">Pro</div>
                                <div className="cd-plan__price">
                                    $6 / month
                                </div>
                            </div>

                            <div
                                className={`cd-plan ${selectedPlan === "business"
                                    ? "is-selected"
                                    : ""
                                    }`}
                                onClick={() => setSelectedPlan("business")}
                            >
                                <div className="cd-plan__title">
                                    Business
                                </div>
                                <div className="cd-plan__price">
                                    $20 / month
                                </div>
                            </div>
                        </div>

                        <div className="cd-modal__footer">
                            <button
                                className="cd-btn cd-btn--primary"
                                onClick={confirmUpgrade}
                                disabled={saving}
                            >
                                {saving
                                    ? "Upgrading..."
                                    : "Confirm Upgrade"}
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
