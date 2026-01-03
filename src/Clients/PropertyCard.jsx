
// import React from "react";
// import { cleanString } from "../utils/cleanString";
// import SquareFootIcon from "@mui/icons-material/SquareFoot";
// import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
// import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
// import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";

// import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
// import CropOriginalIcon from "@mui/icons-material/CropOriginal";
// import WifiIcon from "@mui/icons-material/Wifi";
// import SecurityIcon from "@mui/icons-material/Security";
// import BalconyIcon from "@mui/icons-material/Balcony";
// import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined";
// import YardOutlinedIcon from "@mui/icons-material/YardOutlined";
// import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
// import FenceIcon from "@mui/icons-material/Fence";
// import ImagesearchRollerIcon from "@mui/icons-material/ImagesearchRoller";
// import KitchenIcon from "@mui/icons-material/Kitchen";
// import TungstenOutlinedIcon from "@mui/icons-material/TungstenOutlined";
// import HotTubOutlinedIcon from "@mui/icons-material/HotTubOutlined";
// import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
// import PoolOutlinedIcon from "@mui/icons-material/PoolOutlined";

// //for the rating
// import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
// import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
// import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
// import StarIcon from "@mui/icons-material/Star";
// // import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


// export const PropertyCard = ({ property, handleLike, setShowBookingModal, likedProperties, setselectedid, setActiveTab }) => {

//     function findIcon(str) {
//         function check(sStr, Tstr) {
//             return cleanString(sStr).includes(Tstr);
//         }
//         let iicon;

//         if (check(str, "air")) {
//             iicon = <AcUnitOutlinedIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "wifi") || check(str, "ac")) {
//             iicon = <WifiIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "runningwater") || check(str, "wateravailability")) {
//             iicon = <LocalDrinkOutlinedIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "security") || check(str, "protection")) {
//             iicon = <SecurityIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "balcony")) {
//             iicon = <BalconyIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "parking")) {
//             iicon = (
//                 <LocalParkingOutlinedIcon fontSize="large" className="icons-green" />
//             );
//         } else if (check(str, "garden")) {
//             iicon = <YardOutlinedIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "gym") || check(str, "fitness")) {
//             iicon = (
//                 <FitnessCenterOutlinedIcon fontSize="large" className="icons-green" />
//             );
//         } else if (check(str, "fence") || check(str, "gate")) {
//             iicon = <FenceIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "furnished") || check(str, "complete")) {
//             iicon = <ImagesearchRollerIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "kitchen")) {
//             iicon = <KitchenIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "generator") || check(str, "solar")) {
//             iicon = <TungstenOutlinedIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "hotwater") || check(str, "heater")) {
//             iicon = <HotTubOutlinedIcon fontSize="large" className="icons-green" />;
//         } else if (check(str, "pool") || check(str, "swimming")) {
//             iicon = <PoolOutlinedIcon fontSize="large" className="icons-green" />;
//         } else {
//             iicon = <CropOriginalIcon fontSize="large" className="icons-green" />;
//         }

//         return iicon;
//     }

//     return (
//         <article className="cd-card" aria-labelledby={`p-${property._id}-title`}>

//             <div className="cd-card__media">
//                 <img src={property.image} alt={property.title}
//                     onError={(e) => { e.target.style.display = "none"; }}
//                 />
//             </div>


//             <div className="cd-card__body">
//                 <div className="cd-card__head">
//                     <div>
//                         <h4 id={`p-${property._id}-title`} className="cd-card__title">{property.title}</h4>
//                         <div className="cd-card__meta">{property.type} • {property.location?.city || property.location?.address}</div>
//                     </div>

//                     <div className="cd-card__price">
//                         <div className="cd-card__price-amount">{property.rent + " "}FCFA</div>
//                         <div className="cd-card__price-sub">per {property.how}</div>
//                     </div>
//                 </div>

//                 {property.amenities && property.amenities.length > 0 && (
//                     <div className="cd-card__amenities">
//                         {property.amenities.slice(0, 4).map((a, i) => <span key={i} className="cd-chip">{a}</span>)}
//                         {property.amenities.length > 4 && <span className="cd-more">+{property.amenities.length - 4} more</span>}
//                     </div>
//                 )}

//                 {/* <div className="description-card">
//                     <br />
//                     <div className=" card-container">
//                         {property.amenities.map((amenity, index) => {
//                             return (
//                                 <div className="amenity-card" key={index}>
//                                     {findIcon(amenity)} <p>{amenity}</p>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div> */}


//                 < div className="cd-card__stats">
//                     <button className={`cd-like ${likedProperties.has(property.id) ? "active" : ""}`} onClick={() => handleLike(property.id)} aria-pressed={likedProperties.has(property.id)}>
//                         <ion-icon name={likedProperties.has(property.id) ? "heart" : "heart-outline"}></ion-icon>
//                         <span>{property.likes || 0}</span>
//                     </button>

//                     <div className="cd-views">
//                         <ion-icon name="eye-outline" /> <span>{property.views || 0}</span>
//                     </div>
//                 </div>

//                 <div className="cd-card__actions">
//                     {/* <button className="cd-btn" onClick={() => handleLike(property.id)}>
//                         <ion-icon name={likedProperties.has(property.id) ? "heart" : "heart-outline"} /> {likedProperties.has(property.id) ? "Liked" : "Like"}
//                     </button> */}

//                     <button
//                         className="cd-btn cd-btn--primary"
//                         onClick={() => {
//                             setselectedid(property._id);
//                             setActiveTab("view_details");
//                         }}
//                     >

//                         <ion-icon name="calendar" /> View Details
//                     </button>
//                 </div>
//             </div>
//         </article >
//     );

// }















import React from "react";
import { cleanString } from "../utils/cleanString";

import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import WifiIcon from "@mui/icons-material/Wifi";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import BalconyIcon from "@mui/icons-material/Balcony";
import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined";
import YardOutlinedIcon from "@mui/icons-material/YardOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import FenceIcon from "@mui/icons-material/Fence";
import ImagesearchRollerIcon from "@mui/icons-material/ImagesearchRoller";
import KitchenIcon from "@mui/icons-material/Kitchen";
import TungstenOutlinedIcon from "@mui/icons-material/TungstenOutlined";
import HotTubOutlinedIcon from "@mui/icons-material/HotTubOutlined";
import PoolOutlinedIcon from "@mui/icons-material/PoolOutlined";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";

export const PropertyCard = ({
    property,
    handleLike = () => { },
    setShowBookingModal = () => { },
    likedProperties = new Set(),   // ✅ FIX
    setselectedid = () => { },
    setActiveTab = () => { }
}) => {
    if (!property) return null;

    const propertyId = property._id || property.id;

    const isLiked = likedProperties instanceof Set
        ? likedProperties.has(propertyId)
        : false;

    function findIcon(str = "") {
        const check = (s, t) => cleanString(s).includes(t);

        if (check(str, "air")) return <AcUnitOutlinedIcon className="icons-green" />;
        if (check(str, "wifi")) return <WifiIcon className="icons-green" />;
        if (check(str, "water")) return <LocalDrinkOutlinedIcon className="icons-green" />;
        if (check(str, "security")) return <SecurityIcon className="icons-green" />;
        if (check(str, "balcony")) return <BalconyIcon className="icons-green" />;
        if (check(str, "parking")) return <LocalParkingOutlinedIcon className="icons-green" />;
        if (check(str, "garden")) return <YardOutlinedIcon className="icons-green" />;
        if (check(str, "gym")) return <FitnessCenterOutlinedIcon className="icons-green" />;
        if (check(str, "fence")) return <FenceIcon className="icons-green" />;
        if (check(str, "furnished")) return <ImagesearchRollerIcon className="icons-green" />;
        if (check(str, "kitchen")) return <KitchenIcon className="icons-green" />;
        if (check(str, "generator")) return <TungstenOutlinedIcon className="icons-green" />;
        if (check(str, "hotwater")) return <HotTubOutlinedIcon className="icons-green" />;
        if (check(str, "pool")) return <PoolOutlinedIcon className="icons-green" />;

        return <CropOriginalIcon className="icons-green" />;
    }

    return (
        <article className="cd-card" aria-labelledby={`p-${propertyId}-title`}>
            <div className="cd-card__media">
                <img
                    src={property.image || property.images?.[0]}
                    alt={property.title}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                />
            </div>

            <div className="cd-card__body">
                <div className="cd-card__head">
                    <div>
                        <h4 id={`p-${propertyId}-title`} className="cd-card__title">
                            {property.title}
                        </h4>
                        <div className="cd-card__meta">
                            {property.type} • {property.location?.city || property.location?.address}
                        </div>
                    </div>

                    <div className="cd-card__price">
                        <div className="cd-card__price-amount">
                            {property.rent} FCFA
                        </div>
                        <div className="cd-card__price-sub">
                            per {property.how}
                        </div>
                    </div>
                </div>

                {Array.isArray(property.amenities) && (
                    <div className="cd-card__amenities">
                        {property.amenities.slice(0, 4).map((a, i) => (
                            <span key={`${propertyId}-amenity-${i}`} className="cd-chip">
                                {a}
                            </span>
                        ))}
                        {property.amenities.length > 4 && (
                            <span className="cd-more">
                                +{property.amenities.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                <div className="cd-card__stats">
                    <button
                        className={`cd-like ${isLiked ? "active" : ""}`}
                        onClick={() => handleLike(propertyId)}
                        aria-pressed={isLiked}
                    >
                        <ion-icon name={isLiked ? "heart" : "heart-outline"} />
                        <span>{property.likes || 0}</span>
                    </button>

                    <div className="cd-views">
                        <ion-icon name="eye-outline" />
                        <span>{property.views || 0}</span>
                    </div>
                </div>

                <div className="cd-card__actions">
                    <button
                        className="cd-btn cd-btn--primary"
                        onClick={() => {
                            setselectedid(propertyId);
                            setActiveTab("view_details");
                        }}
                    >
                        <ion-icon name="calendar" />
                        View Details
                    </button>
                </div>
            </div>
        </article>
    );
};
