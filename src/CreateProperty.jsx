import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./CreatePropertyForm.css";

const API_BASE = "https://vizit-backend-hubw.onrender.com/api/house";
export default function CreateHouseForm({ onCreated }) {
    const [formData, setFormData] = useState({
        title: "",
        type: "Apartment",
        rent: "",
        address: "",
        lat: "",
        lng: "",
        bedrooms: 1,
        bathrooms: 1,
        area_sqm: 50,
        amenities: "",
        description: "",
        media: [],
    });
    const [how, sethow] = useState("")
    const [dragOver, setDragOver] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const fileInputRef = useRef(null);



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


    const amenityOptions = [
        "WiFi", "Parking", "Pool", "Gym", "AC", "Heating",
        "Laundry", "Dishwasher", "Pet Friendly", "Balcony",
        "Garden", "Security", "Elevator", "Furnished", "Fireplace"
    ];

    const propertyTypes = [
        { value: "Apartment", icon: <ion-icon name="add-circle-outline"></ion-icon> },
        { value: "Guest House", icon: <ion-icon name="alarm-outline"></ion-icon> },
        { value: "Hotel", icon: <ion-icon name="archive-outline"></ion-icon> },
        { value: "Modern Room", icon: <ion-icon name="car-outline"></ion-icon> },
        { value: "Studio", icon: <ion-icon name="gift-outline"></ion-icon> },
        { value: "Villa", icon: <ion-icon name="hardware-chip-outline"></ion-icon> },
        { value: "Penthouse", icon: <ion-icon name="heart-circle-outline"></ion-icon> },
        { value: "Townhouse", icon: <ion-icon name="golf-outline"></ion-icon> }
    ];




    const steps = ["Basic Info", "Details", "Amenities", "Media", "Review"];

    const handleChange = (key, value) =>
        setFormData((fd) => ({ ...fd, [key]: value }));

    const handleAmenityToggle = (amenity) => {
        setSelectedAmenities(prev => {
            if (prev.includes(amenity)) {
                return prev.filter(a => a !== amenity);
            } else {
                return [...prev, amenity];
            }
        });
    };
    const [uploading, setuploading] = useState(false)
    const handleImageUpload = async (files) => {
        try {
            setuploading(true)
            const uploads = await Promise.all(
                Array.from(files).map(async (file) => {
                    const isVideo = file.type.startsWith("video");
                    const uploadPreset = isVideo ? "vizit-video" : "vizit-image";

                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", uploadPreset);

                    const res = await axios.post(
                        `https://api.cloudinary.com/v1_1/dgigs6v72/${isVideo ? "video" : "image"}/upload`,
                        data
                    );

                    return {
                        url: res.data.secure_url,
                        type: isVideo ? "video" : "image",
                    };
                })
            );

            setFormData((fd) => ({
                ...fd,
                media: [...(fd.media || []), ...uploads], // ✅ EXTRA SAFE
            }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload media.");
        } finally {
            setuploading(false)
        }
    };


    const handleDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        await handleImageUpload(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleImageUpload(files);
    };




















    ///c


    const [permission, setLocationPermission] = useState(false)

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setFormData((prev) => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude,
                }));

                console.log(`Latitude: ${latitude} | Longitude: ${longitude}`);
            },
            (error) => {
                console.error("Error getting location:", error);
                console.log("Failed to get location. Make sure location access is allowed.");
            },
            {
                enableHighAccuracy: true,
            }
        );
    };


    useEffect(() => {
        getLocation()

    }, [formData.lat, formData.lng])

    //  const getOSMAddress = async (
    //     lat: number,
    //     lon: number
    //   ): Promise<string | null> => {
    //     try {
    //       const response = await fetch(
    //         `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=28065c9b690540718c37d7f07710a51c`
    //       );
    //       const data = await response.json();
    //       return data.features[0]?.properties?.address_line2 ?? null;
    //     } catch (error) {
    //       console.error('Error fetching address:', error);
    //       return null;
    //     }
    //   };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.rent || !formData.address) {
            alert("Title, Rent, and Address are required");
            return;
        }

        if (formData.media.length === 0) {
            alert("Please upload at least one image or video");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                owner: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    profile: user.profile,
                },
                type: formData.type,
                title: formData.title,
                rent: Number(formData.rent),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area_sqm: Number(formData.area_sqm),
                location: {
                    address: formData.address,
                    coordinates: {
                        lat: Number(formData.lat) || 0,
                        lng: Number(formData.lng) || 0,
                    },
                },
                amenities: selectedAmenities,
                description: formData.description,
                how: how,
                reviews: {
                    images: formData.media.map(m => m.url),
                },
                minimumduration: "1 day",
                isAvalable: true,
                image: formData.media[0]?.url || "",
            };
            console.log(payload);

            const res = await axios.post(
                "https://vizit-backend-hubw.onrender.com/api/house/houses",
                payload
            );

            alert("House created successfully");

            onCreated?.(res.data.house ?? payload);

            // RESET FORM
            setFormData({
                title: "",
                type: "Apartment",
                rent: "",
                address: "",
                lat: "",
                lng: "",
                bedrooms: 1,
                bathrooms: 1,
                area_sqm: 50,
                description: "",
                media: [],
            });

            setSelectedAmenities([]);
            setActiveStep(0);
        } catch (err) {
            console.error("Create house failed:", err);
            alert(
                err?.response?.data?.message ||
                "Failed to create house. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const nextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };
    const removeMedia = (index) => {
        setFormData((fd) => ({
            ...fd,
            media: fd.media.filter((_, i) => i !== index),
        }));
    };
    return (
        <div className="billion-dollar-container">
            <div className="split-layout">
                {/* Left Side - Visual Preview */}
                <div className="preview-side">
                    <div className="preview-overlay">
                        <div className="preview-content">
                            <h1 className="preview-title">Create Your <span className="highlight">Premium</span> Listing</h1>
                            <p className="preview-subtitle">Join thousands of property owners maximizing their returns with our platform</p>

                            {/* <div className="preview-stats">
                                <div className="stat-item">
                                    <div className="stat-number">24.7%</div>
                                    <div className="stat-label">Higher Rental Income</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">3.2x</div>
                                    <div className="stat-label">Faster Booking</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number">99%</div>
                                    <div className="stat-label">Occupancy Rate</div>
                                </div>

                            </div> */}

                            <div className="preview-card">
                                <div className="card-image">
                                    <div className="image-placeholder">
                                        <div className="property-badge">
                                            <span className="badge-icon">⭐</span>
                                            <span>Premium Listing</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <h3>{formData.title || "Your Property Title"}</h3>
                                    <div className="property-meta">
                                        <span className="meta-item">
                                            <i className="icon"><ion-icon name="bed-outline"></ion-icon></i> {formData.bedrooms} bed
                                        </span>
                                        <span className="meta-item">
                                            <i className="icon"><ion-icon name="bonfire-outline"></ion-icon></i> {formData.bathrooms} bath
                                        </span>
                                        <span className="meta-item">
                                            <i className="icon"><ion-icon name="pencil-outline"></ion-icon></i> {formData.area_sqm} sqm
                                        </span>
                                    </div>
                                    <div className="property-price">
                                        {formData.rent ? `XAF ${parseInt(formData.rent).toLocaleString()}/${how}` : "Set your price"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="form-side">
                    <div className="form-container">
                        <div className="form-header">
                            <h2>Create New Property</h2>
                            <p>Fill in the details to list your property</p>
                        </div>

                        {/* Progress Steps */}
                        <div className="progress-steps">

                            {steps.map((step, index) => (
                                <div key={index} className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}>
                                    <div className="step-circle">{index + 1}</div>
                                    <div className="step-label">{step}</div>
                                    {index < steps.length - 1 && <div className="step-connector"></div>}
                                </div>
                            ))}

                        </div>

                        <form className="newton-form" onSubmit={handleSubmit}>
                            {/* Step 1: Basic Info */}
                            {activeStep === 0 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-text">Property Title *</span>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => handleChange("title", e.target.value)}
                                                className="form-input"
                                                placeholder="Luxury Apartment with Ocean View"
                                                required
                                            />
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-text">Property Type</span>
                                            <div className="property-type-grid">
                                                {propertyTypes.map((type) => (
                                                    <button
                                                        key={type.value}
                                                        type="button"
                                                        className={`type-option ${formData.type === type.value ? 'selected' : ''}`}
                                                        onClick={() => handleChange("type", type.value)}
                                                    >
                                                        <span className="type-icon icon">{type.icon}</span>
                                                        <span className="type-name">{type.value}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-text">Monthly Rent (XAF) *</span>
                                            <div className="input-with-icon">
                                                <span className="input-icon"><ion-icon name="card-outline"></ion-icon></span>
                                                <input
                                                    type="number"
                                                    value={formData.rent}
                                                    onChange={(e) => handleChange("rent", e.target.value)}
                                                    className="form-input"
                                                    placeholder="250000"
                                                    required
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-text">Monthly Rent (XAF) *</span>
                                            <div className="input-with-icon">
                                                <span className="input-icon">
                                                    <ion-icon name="calendar-outline"></ion-icon>
                                                </span>


                                                <select className="form-input"
                                                    style={{ cursor: "pointer" }}
                                                    value={how} onChange={(e) => sethow(e.target.value)}
                                                    required>
                                                    <option value="select a payment plan">select a payment plan</option>
                                                    <option value="month">month</option>
                                                    <option value="day">day</option>
                                                    <option value="night">night</option>
                                                </select>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-text">Full Address *</span>
                                            <div className="input-with-icon">
                                                <span className="input-icon"><ion-icon name="compass-outline"></ion-icon></span>
                                                <input
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => handleChange("address", e.target.value)}
                                                    className="form-input"
                                                    placeholder="123 Luxury Street, Douala, Cameroon"
                                                    required
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {activeStep === 1 && (
                                <div className="form-step">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <span className="label-text">Bedrooms</span>
                                                <div className="counter-input">
                                                    <button
                                                        type="button"
                                                        className="counter-btn"
                                                        onClick={() => handleChange("bedrooms", Math.max(1, formData.bedrooms - 1))}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="counter-value">{formData.bedrooms}</span>
                                                    <button
                                                        type="button"
                                                        className="counter-btn"
                                                        onClick={() => handleChange("bedrooms", formData.bedrooms + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <span className="label-text">Bathrooms</span>
                                                <div className="counter-input">
                                                    <button
                                                        type="button"
                                                        className="counter-btn"
                                                        onClick={() => handleChange("bathrooms", Math.max(1, formData.bathrooms - 1))}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="counter-value">{formData.bathrooms}</span>
                                                    <button
                                                        type="button"
                                                        className="counter-btn"
                                                        onClick={() => handleChange("bathrooms", formData.bathrooms + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-text">Area (square meters)</span>
                                            <div className="range-input">
                                                <input
                                                    type="range"
                                                    min="20"
                                                    max="500"
                                                    value={formData.area_sqm}
                                                    onChange={(e) => handleChange("area_sqm", e.target.value)}
                                                    className="range-slider"
                                                />
                                                <div className="range-value">{formData.area_sqm} sqm</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-text">Description</span>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => handleChange("description", e.target.value)}
                                                className="form-textarea"
                                                rows={5}
                                                placeholder="Describe your property in detail... What makes it special?"
                                            />
                                            <div className="char-count">{formData.description.length}/500</div>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Amenities */}
                            {activeStep === 2 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <span className="label-text">Select Amenities</span>
                                        <div className="amenities-grid">
                                            {amenityOptions.map((amenity) => (
                                                <button
                                                    key={amenity}
                                                    type="button"
                                                    className={`amenity-option ${selectedAmenities.includes(amenity) ? 'selected' : ''}`}
                                                    onClick={() => handleAmenityToggle(amenity)}
                                                >
                                                    <span className="amenity-checkbox">
                                                        {selectedAmenities.includes(amenity) ? '✓' : '+'}
                                                    </span>
                                                    <span className="amenity-name">{amenity}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Media */}
                            {activeStep === 3 && (
                                <div className="form-step">
                                    <div className="form-group">
                                        <span className="label-text">Upload Property Photos</span>
                                        <p className="sub-label">Drag & drop images or click to browse</p>

                                        <div
                                            className={`image-dropzone ${dragOver ? "dragging" : ""}`}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                setDragOver(true);
                                            }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <div className="dropzone-content">
                                                <div className="dropzone-icon"><ion-icon name="cloud-upload-outline"></ion-icon></div>
                                                <h3>Add Property Photos</h3>
                                                <p>Upload up to 20 photos. High-quality images get more views.</p>
                                                <button type="button" className="browse-btn">
                                                    {uploading ? "uplaoding media... " : "Browse Files"}
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileSelect}
                                                    style={{ display: 'none' }}

                                                    multiple
                                                    accept="image/*,video/*"

                                                />

                                            </div>
                                        </div>

                                        {/* {formData.images.length > 0 && (
                                            <div className="image-preview-grid">
                                                {formData.images.map((img, i) => (
                                                    <div key={i} className="image-preview-item">
                                                        <img src={img} alt={`Preview ${i}`} />
                                                        <button
                                                            type="button"
                                                            className="remove-image-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeImage(i);
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                        {i === 0 && <div className="primary-badge">Primary</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )} */}





                                        {formData.media.length > 0 && (
                                            <div className="image-preview-grid">
                                                {formData.media.map((item, i) => (
                                                    <div key={i} className="image-preview-item">
                                                        {item.type === "image" ? (
                                                            <img src={item.url} alt={`Media ${i}`} />
                                                        ) : (
                                                            <video src={item.url} controls />
                                                        )}

                                                        <button
                                                            type="button"
                                                            className="remove-image-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeMedia(i);
                                                            }}
                                                        >
                                                            ×
                                                        </button>

                                                        {i === 0 && <div className="primary-badge">Primary</div>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}




                                    </div>
                                </div>
                            )}

                            {/* Step 5: Review */}
                            {activeStep === 4 && (
                                <div className="form-step">
                                    <div className="review-section">
                                        <h3 className="review-title">Review Your Listing</h3>

                                        <div className="review-card">
                                            <div className="review-item">
                                                <span className="review-label">Property Title:</span>
                                                <span className="review-value">{formData.title}</span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">Property Type:</span>
                                                <span className="review-value">{formData.type}</span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">{how} Rent:</span>
                                                <span className="review-value">XAF {parseInt(formData.rent || 0).toLocaleString()}</span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">Address:</span>
                                                <span className="review-value">{formData.address}</span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">How people will pay:</span>
                                                <span className="review-value">per {how}</span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">Bed/Bath:</span>
                                                <span className="review-value">{formData.bedrooms} bed, {formData.bathrooms} bath</span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">Area:</span>
                                                <span className="review-value">{formData.area_sqm} sqm</span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">Amenities:</span>
                                                <span className="review-value">
                                                    {selectedAmenities.length > 0
                                                        ? selectedAmenities.join(', ')
                                                        : 'None selected'}
                                                </span>
                                            </div>
                                            <div className="review-item">
                                                <span className="review-label">Photos:</span>
                                                <span className="review-value">{formData.media.length} uploaded</span>
                                            </div>
                                        </div>

                                        <div className="terms-agreement">
                                            <input type="checkbox" id="terms" required />
                                            <label htmlFor="terms" style={{ color: "#fff" }}>
                                                I agree to the terms of service and confirm that I have the right to list this property
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="form-navigation">
                                {activeStep > 0 && (
                                    <button type="button" className="nav-btn prev-btn" onClick={prevStep}>
                                        ← Previous
                                    </button>
                                )}

                                {activeStep < steps.length - 1 ? (
                                    <button type="button" className="nav-btn next-btn" onClick={nextStep}>
                                        Next →
                                    </button>
                                ) : (
                                    <button type="submit" className="submit-btn" disabled={submitting}>
                                        {submitting ? (
                                            <>
                                                <span className="spinner"></span>
                                                Creating Listing...
                                            </>
                                        ) : (
                                            'Publish Listing '
                                        )}
                                        <ion-icon name="subway-outline"></ion-icon>
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
















