// // ProfilePanel.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./house-search.css"
// const STORAGE_KEY = "vizit_user_profile";


// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dgigs6v72/image/upload";
// const CLOUDINARY_PRESET = "vizit-image";
// function loadFromStorage(defaultUser) {
//     try {
//         const raw = localStorage.getItem(STORAGE_KEY);
//         if (!raw) return defaultUser;
//         return { ...defaultUser, ...JSON.parse(raw) };
//     } catch {
//         return defaultUser;
//     }
// }

// function saveToStorage(obj) {
//     try {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
//     } catch { }
// }

// export default function ProfilePanel({
//     userhere,
//     // user = userhere,
//     onLogout = () => { },
//     onUpgrade = () => { },

// }) {
//     const [profile, setProfile] = useState(() => loadFromStorage(userhere));
//     const [editing, setEditing] = useState(false);
//     const [form, setForm] = useState({ name: userhere?.name, email: userhere?.email });
//     const [notifications, setNotifications] = useState(profile.notifications ?? true);
//     const [privacy, setPrivacy] = useState(profile.privacy ?? false);
//     const [showUpgrade, setShowUpgrade] = useState(false);
//     const [selectedPlan, setSelectedPlan] = useState("pro");
//     const [saving, setSaving] = useState(false);
//     const [imageFile, setImageFile] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const uploadImageToCloudinary = async () => {
//         const formData = new FormData();
//         formData.append("file", imageFile);
//         formData.append("upload_preset", CLOUDINARY_PRESET);

//         const res = await axios.post(CLOUDINARY_URL, formData);
//         return res.data.secure_url;
//     };



//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             let imageUrl = user.profile;

//             if (imageFile) {
//                 imageUrl = await uploadImageToCloudinary();
//             }

//             await axios.put(
//                 `https://vizit-backend-hubw.onrender.com/api/user/edt/${user._id}`,
//                 {
//                     name: form.name,
//                     email: form.email,
//                     Notifications: notifications,
//                     profile: imageUrl
//                 }
//             );

//             alert("Profile updated successfully");

//         } catch (error) {
//             console.error(error);
//             alert("Failed to update profile");
//         } finally {
//             setLoading(false);
//         }
//     };





//     useEffect(() => {
//         // sync local state -> storage
//         saveToStorage(profile);
//     }, [profile]);

//     // handlers
//     const startEdit = () => {
//         setForm({ name: profile.name, email: profile.email });
//         setEditing(true);
//     };

//     const cancelEdit = () => {
//         setEditing(false);
//         setForm({ name: profile.name, email: profile.email });
//     };

//     const saveProfile = (e) => {
//         e?.preventDefault();
//         const updated = { ...profile, name: form.name.trim() || profile.name, email: form.email.trim() || profile.email };
//         setProfile(updated);
//         setEditing(false);
//     };

//     const toggleNotifications = () => {
//         setNotifications((s) => {
//             const next = !s;
//             const updated = { ...profile, notifications: next };
//             setProfile(updated);
//             return next;
//         });
//     };

//     const togglePrivacy = () => {
//         setPrivacy((s) => {
//             const next = !s;
//             const updated = { ...profile, privacy: next };
//             setProfile(updated);
//             return next;
//         });
//     };

//     const confirmUpgrade = async () => {
//         setSaving(true);
//         // demo delay to simulate API
//         await new Promise((r) => setTimeout(r, 450));
//         const updated = { ...profile, plan: selectedPlan };
//         setProfile(updated);
//         setSaving(false);
//         setShowUpgrade(false);
//         onUpgrade(selectedPlan);
//     };

//     const upgradeLabel = profile.plan === "pro" ? "Pro (active)" : profile.plan === "business" ? "Business (active)" : "Free";

//     return (
//         <section className="cd-profile" aria-label="Profile panel">
//             <header className="cd-profile__head">
//                 <div className="cd-profile__avatar" aria-hidden>
//                     {/* <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
//                         <rect width="24" height="24" rx="8" fill="var(--blue-600)" />
//                         <text x="50%" y="55%" textAnchor="middle" fontSize="12" fill="white" fontWeight="700">
//                             {(userhere?.name || "U").slice(0, 1).toUpperCase()}</text>
//                     </svg> */}
//                     <img src={userhere?.profile} alt={userhere?.name} width={70} height={70} className="img-container" />

//                 </div>

//                 <div className="cd-profile__meta">
//                     <div className="cd-profile__name">{userhere?.name}</div>
//                     <div className="cd-profile__email">{userhere?.email}</div>
//                     <div className="cd-profile__plan">
//                         <span className={`cd-badge ${profile.plan === "pro" ? "cd-badge--pro" : profile.plan === "business" ? "cd-badge--business" : ""}`}>
//                             {upgradeLabel}
//                         </span>
//                         {profile.plan !== "pro" && (
//                             <button className="cd-btn cd-btn--upgrade" onClick={() => setShowUpgrade(true)}>
//                                 Upgrade to Pro
//                             </button>
//                         )}
//                     </div>
//                 </div>

//                 <div className="cd-profile__actions">
//                     {editing ? (
//                         <>
//                             <button className="cd-btn" onClick={saveProfile} aria-label="Save profile">Save</button>
//                             <button className="cd-btn cd-btn--ghost" onClick={cancelEdit} aria-label="Cancel">Cancel</button>
//                         </>
//                     ) : (
//                         <>
//                             <button className="cd-btn" onClick={startEdit} aria-label="Edit profile">Edit</button>
//                             <button className="cd-btn cd-btn--danger" onClick={onLogout} aria-label="Logout">Logout</button>
//                         </>
//                     )}
//                 </div>
//             </header>

//             <form className="cd-profile__form" onSubmit={saveProfile} aria-hidden={!editing}>
//                 <label className="cd-form-row">
//                     <span className="cd-form-label">Full name</span>
//                     <input className="cd-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//                 </label>

//                 <label className="cd-form-row">
//                     <span className="cd-form-label">Email</span>
//                     <input className="cd-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//                 </label>

//                 {!editing && (
//                     <div className="cd-profile__notes">
//                         <small>Tip: Click Edit to change your name and email.</small>
//                     </div>
//                 )}
//             </form>

//             <div className="cd-profile__settings" aria-label="Settings">
//                 <h4 className="cd-profile__section-title">Settings</h4>

//                 <div className="cd-profile__setting">
//                     <div className="cd-profile__setting-info">
//                         <div className="cd-profile__setting-title">Notifications</div>
//                         <div className="cd-profile__setting-desc">Receive booking updates and offers</div>
//                     </div>
//                     <div className="cd-toggle-wrap">
//                         <button
//                             role="switch"
//                             aria-checked={notifications}
//                             className={`cd-toggle ${notifications ? "is-on" : ""}`}
//                             onClick={toggleNotifications}
//                         >
//                             <span className="cd-toggle__knob" />
//                         </button>
//                     </div>
//                 </div>
//                 {/* 
//                 <div className="cd-profile__setting">
//                     <div className="cd-profile__setting-info">
//                         <div className="cd-profile__setting-title">Privacy mode</div>
//                         <div className="cd-profile__setting-desc">Hide your profile from public listings</div>
//                     </div>
//                     <div className="cd-toggle-wrap">
//                         <button
//                             role="switch"
//                             aria-checked={privacy}
//                             className={`cd-toggle ${privacy ? "is-on" : ""}`}
//                             onClick={togglePrivacy}
//                         >
//                             <span className="cd-toggle__knob" />
//                         </button>
//                     </div>
//                 </div> */}

//                 {/* <div className="cd-profile__setting">
//                     <div className="cd-profile__setting-info">
//                         <div className="cd-profile__setting-title">Storage usage</div>
//                         <div className="cd-profile__setting-desc">Manage photos and attachments</div>
//                     </div>
//                     <div>
//                         <div className="cd-progress" aria-hidden>
//                             <div className="cd-progress__bar" style={{ width: "28%" }} />
//                         </div>
//                         <small className="cd-muted">28% used</small>
//                     </div>
//                 </div> */}
//             </div>

//             {/* <div className="cd-profile__danger">
//                 <button
//                     className="cd-link cd-link--danger"
//                     onClick={() => {
//                         if (confirm("Delete local profile data? This only clears demo storage.")) {
//                             localStorage.removeItem(STORAGE_KEY);
//                             window.location.reload();
//                         }
//                     }}
//                 >
//                     Delete local data
//                 </button>
//             </div> */}

//             {showUpgrade && (
//                 <div className="cd-modal" role="dialog" aria-modal="true" aria-label="Upgrade to Pro">
//                     <div className="cd-modal__panel cd-modal__panel--small">
//                         <div className="cd-modal__head">
//                             <h3>Upgrade to Pro</h3>
//                             <button className="cd-dismiss" aria-label="Close" onClick={() => setShowUpgrade(false)}>✕</button>
//                         </div>

//                         <div className="cd-upgrade-plans">
//                             <div className={`cd-plan ${selectedPlan === "pro" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("pro")} tabIndex={0}>
//                                 <div className="cd-plan__title">Pro</div>
//                                 <div className="cd-plan__price">$6 / month</div>
//                                 <div className="cd-plan__desc">Priority support, featured listing, 5x storage</div>
//                             </div>

//                             <div className={`cd-plan ${selectedPlan === "business" ? "is-selected" : ""}`} onClick={() => setSelectedPlan("business")} tabIndex={0}>
//                                 <div className="cd-plan__title">Business</div>
//                                 <div className="cd-plan__price">$20 / month</div>
//                                 <div className="cd-plan__desc">Team seats, analytics, 50GB storage</div>
//                             </div>
//                         </div>

//                         <div className="cd-modal__footer">
//                             <button className="cd-btn cd-btn--primary" onClick={confirmUpgrade} disabled={saving}>
//                                 {saving ? "Upgrading..." : `Upgrade to ${selectedPlan === "pro" ? "Pro" : "Business"}`}
//                             </button>
//                             <button className="cd-btn cd-btn--ghost" onClick={() => setShowUpgrade(false)}>Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </section>
//     );
// }














// ProfilePanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./house-search.css";

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
export default function ProfilePanel({
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
    });

    const [notifications, setNotifications] = useState(
        userhere?.Notifications ?? true
    );

    const [privacy, setPrivacy] = useState(
        userhere?.privacy ?? false
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
        <section className="cd-profile" aria-label="Profile panel">
            <header className="cd-profile__head">
                <div className="cd-profile__avatar" aria-hidden>
                    <img
                        src={profile?.profile}
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
                    />
                </label>
                <label className="cd-form-row">
                    <span className="cd-form-label">Click to Uplooad A Profile photo</span>

                    <div className="cd-image-upload" style={{ cursor: "pointer" }}>
                        <img
                            style={{ height: "90px", width: "110px" }}
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
                            style={{ display: "none" }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>
                </label>


                {!editing && (
                    <div className="cd-profile__notes">
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
