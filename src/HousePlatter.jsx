import { useEffect, useState } from "react";
import "./HousePlatter.css";
import axios from "axios";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


import {
    ToggleButton,
    ToggleButtonGroup,
    Button,
    Stack,
    Divider,
    Tooltip
} from "@mui/material";
import ReviewRatingSection from "./Clients/Review";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";





import SquareFootIcon from "@mui/icons-material/SquareFoot";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";

import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import WifiIcon from "@mui/icons-material/Wifi";
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
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";
import PoolOutlinedIcon from "@mui/icons-material/PoolOutlined";

//for the rating
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarIcon from "@mui/icons-material/Star";
import { cleanString } from "./utils/cleanString";
import { MapComponent } from "./pages/LandingPage/MapComponent";
import { Switch, FormControlLabel } from "@mui/material";
import { toggle } from "ionicons/icons";

const HousePlatter = ({ user }) => {
    const [houses, setHouses] = useState([]);
    const [filteredHouses, setFilteredHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allowsave, setallowsave] = useState(false)


    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: 5000000,
        bedrooms: 0,
        propertyType: "all"
    });
    const [sortBy, setSortBy] = useState("featured");
    const [selectedHouse, setSelectedHouse] = useState(null);

    //



    const [imageIndex, setImageIndex] = useState(0)
    const [actionMode, setActionMode] = useState("view");

    const handleActionChange = (_, value) => {
        if (value !== null) setActionMode(value);
    };


    function Ratings({ method, size, count }) {
        let ratings;
        const ar = [1, 2, 3, 4, 5];
        // count.toString().contains(".")
        let prev = Math.floor(count);
        if (method == "get") {
            if (count > 0) {
                ratings = (
                    <div>
                        {ar.map((item) => {
                            if (item <= count) {
                                return (
                                    <StarIcon fontSize={size} style={{ color: "#88661bff" }} />
                                );
                            } else {
                                return (
                                    <StarOutlineOutlinedIcon
                                        fontSize={size}
                                    ></StarOutlineOutlinedIcon>
                                );
                            }
                        })}
                    </div>
                );
            } else {
                ratings = (
                    <div>
                        {ar.map((item) => {
                            return (
                                <StarOutlineOutlinedIcon
                                    fontSize={size}
                                ></StarOutlineOutlinedIcon>
                            );
                        })}
                    </div>
                );
            }
        }

        return ratings;
    }


    const [userhere, setuser] = useState([])
    const [loading1, setLoading1] = useState(false)
    useEffect(() => {
        const decoding = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    console.warn("No token found")
                    setLoading1(false)
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
                    console.log('====================================');
                    console.log(data.data.res);
                    console.log('====================================');
                }
            } catch (error) {
                console.error("Failed to decode token:", error)
            } finally {
                setLoading1(false)
            }
        }
        decoding()
    }, [])

    const [isAdmin, setisAdmin] = useState(false)

    useEffect(() => {
        const check = () => {
            const compare = filteredHouses?.owner?.id == userhere._id
            if (compare) {
                setisAdmin(true)
            } else {
                setisAdmin(false)
            }
        }
        check()

    }, [])
    //

    // useEffect(() => {
    //     const fetchHouses = async () => {
    //         try {
    //             // const res = await axios.get("https://vizit-backend-hubw.onrender.com/api/house/houses");

    //             const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/house/houses/getting/${user?._id}`)

    //             const housesData = Array.isArray(res.data.houses)
    //                 ? res.data.houses
    //                 : [];



    //             console.log("filterbyowner", housesData)
    //             setHouses(housesData);
    //             setFilteredHouses(housesData);
    //         } catch (error) {
    //             console.error("Failed to fetch houses", error);
    //             setHouses([]);
    //             setFilteredHouses([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchHouses();
    // }, []);







    useEffect(() => {
        if (!user?._id) return;

        const fetchHouses = async () => {
            try {
                const res = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/house/houses/getting/${user._id}`
                );

                const housesData = Array.isArray(res.data.houses)
                    ? res.data.houses
                    : [];

                setHouses(housesData);
                setFilteredHouses(housesData);
            } catch (error) {
                console.error("Failed to fetch houses", error);
                setHouses([]);
                setFilteredHouses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, [user?._id]);






    useEffect(() => {
        let result = [...houses];

        // Apply filters
        if (filters.propertyType !== "all") {
            result = result.filter(house => house.type === filters.propertyType);
        }

        if (filters.bedrooms > 0) {
            result = result.filter(house => house.bedrooms >= filters.bedrooms);
        }

        result = result.filter(house =>
            house.rent >= filters.minPrice && house.rent <= filters.maxPrice
        );

        // Apply sorting
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.rent - b.rent);
                break;
            case "price-high":
                result.sort((a, b) => b.rent - a.rent);
                break;
            case "bedrooms":
                result.sort((a, b) => b.bedrooms - a.bedrooms);
                break;
            case "featured":
                result.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? -1 : 1);
                break;
            default:
                break;
        }

        setFilteredHouses(result);
    }, [filters, sortBy, houses]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            minPrice: 0,
            maxPrice: 5000000,
            bedrooms: 0,
            propertyType: "all"
        });
        setSortBy("featured");
    };



    const [toggles, setToggles] = useState({
        // preview: false,
        favorite: false,
        compare: false,
    });
    const [allow, setallow] = useState(false)

    useEffect(() => {
        if (!selectedHouse) return;
        setallow(selectedHouse.reviews.canEdit)
        setToggles({
            // preview: !!selectedHouse.disable,
            favorite: !!selectedHouse.isAvalable,
            compare: !!selectedHouse.isAvalable,
        });
    }, [selectedHouse]);



    const [boolsave, setboolsave] = useState(false)
    const saveSettings = async () => {
        try {
            setboolsave(true);

            const payload = {
                // disable: toggles.preview,
                isAvalable: toggles.compare,
            };

            const res = await axios.put(
                `https://vizit-backend-hubw.onrender.com/api/house/houses/update/${selectedHouse._id}`,
                payload
            );

            alert(res.data.message);
            window.location.reload()
        } catch (error) {
            console.error(error);
            alert("Failed to save changes");
        } finally {
            setboolsave(false);
        }
    };


    const totalValue = houses?.reduce((sum, house) => sum + house.rent, 0) * 120;

    if (loading) {
        return (
            <div className="bisque-bisque-loader">
                <div className="consomme-spinner">
                    <div className="foie-gras-ring"></div>
                    <div className="caviar-dots">
                        <div className="caviar-dot"></div>
                        <div className="caviar-dot"></div>
                        <div className="caviar-dot"></div>
                    </div>
                </div>
                <p className="bisque-text">Loading Portfolio...</p>
            </div>
        );
    }






    function increaseIndex() {
        if (imageIndex > selectedHouse.reviews.images.length) {
            setImageIndex(0)
        }
        setImageIndex(p => p + 1)
    }
    function decreaseIndex() {
        if (imageIndex < selectedHouse.reviews.images.length) {
            setImageIndex(selectedHouse.reviews.images.length)
        }
        setImageIndex(p => p - 1)
    }

    function findIcon(str) {
        function check(sStr, Tstr) {
            return cleanString(sStr).includes(Tstr);
        }
        let iicon;

        if (check(str, "air")) {
            iicon = <AcUnitOutlinedIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "wifi") || check(str, "ac")) {
            iicon = <WifiIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "runningwater") || check(str, "wateravailability")) {
            iicon = <LocalDrinkOutlinedIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "security") || check(str, "protection")) {
            iicon = <SecurityIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "balcony")) {
            iicon = <BalconyIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "parking")) {
            iicon = (
                <LocalParkingOutlinedIcon fontSize="large" className="icons-green" />
            );
        } else if (check(str, "garden")) {
            iicon = <YardOutlinedIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "gym") || check(str, "fitness")) {
            iicon = (
                <FitnessCenterOutlinedIcon fontSize="large" className="icons-green" />
            );
        } else if (check(str, "fence") || check(str, "gate")) {
            iicon = <FenceIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "furnished") || check(str, "complete")) {
            iicon = <ImagesearchRollerIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "kitchen")) {
            iicon = <KitchenIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "generator") || check(str, "solar")) {
            iicon = <TungstenOutlinedIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "hotwater") || check(str, "heater")) {
            iicon = <HotTubOutlinedIcon fontSize="large" className="icons-green" />;
        } else if (check(str, "pool") || check(str, "swimming")) {
            iicon = <PoolOutlinedIcon fontSize="large" className="icons-green" />;
        } else {
            iicon = <CropOriginalIcon fontSize="large" className="icons-green" />;
        }

        return iicon;
    }


    const handleChange = (key) => (event) => {
        setToggles((prev) => ({
            ...prev,
            [key]: event.target.checked,
        }));
    };












    const settingallow = async () => {
        try {
            setallowsave(true)
            const res = await axios.put(`https://vizit-backend-hubw.onrender.com/api/house/checkingoh/${selectedHouse?._id}`, {
                allow
            })
            if (res.status == 200) {
                alert(res.data.message)
            } else {
                alert(res.data.message)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setallowsave(false)
        }
    }



    return (
        <div className="truffle-tower-container">

            {/* Header Section */}

            <header className="caviar-header">
                <div className="blue-cheese-title">
                    <h1 className="beluga-title">HELLO, {user?.companyname}</h1>
                    <p className="sapphire-subtitle">Go through your house collection</p>
                </div>

                {/* <div className="escargot-stats">
                    <div className="boursin-stat">
                        <span className="stat-label">Total Portfolio Value</span>
                        <span className="stat-value">${(totalValue / 1000000).toFixed(1)}B</span>
                    </div>
                    <div className="boursin-stat">
                        <span className="stat-label">Properties</span>
                        <span className="stat-value">{houses.length}</span>
                    </div>
                    <div className="boursin-stat">
                        <span className="stat-label">Avg. Monthly Rent</span>
                        <span className="stat-value">${(houses.reduce((sum, house) => sum + house.rent, 0) / houses.length).toLocaleString()}</span>
                    </div>
                </div> */}


            </header>

            <div className="paella-layout">
                <aside className="ratatouille-sidebar">
                    <div className="gazpacho-filter-card">
                        <h3 className="frittata-filter-title">FILTER PROPERTIES</h3>

                        <div className="bruschetta-filter-group">
                            <label className="prosciutto-label">Property Type</label>
                            <select
                                className="risotto-select"
                                value={filters.propertyType}
                                onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                            >

                                <option value="all">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Hotel">Hotel</option>

                                <option value="Guest House">Guest House</option>
                                <option value="Modern Room">Modern Room</option>
                                <option value="Studio">Studio</option>
                                <option value="Villa">Villa</option>
                                <option value="Penthouse">Penthouse</option>
                                <option value="Townhouse">Townhouse</option>

                            </select>
                        </div>

                        <div className="bruschetta-filter-group">
                            <label className="prosciutto-label">Bedrooms (min)</label>
                            <div className="gnocchi-slider-container">
                                <span className="gnocchi-slider-value">{filters.bedrooms}+</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={filters.bedrooms}
                                    onChange={(e) => handleFilterChange("bedrooms", parseInt(e.target.value))}
                                    className="gnocchi-slider"
                                />
                            </div>
                        </div>

                        <div className="bruschetta-filter-group">
                            <label className="prosciutto-label">Price Range</label>
                            <div className="tartare-price-range">
                                <span className="tartare-price-min">{filters.minPrice.toLocaleString()}frs</span>
                                <span className="tartare-price-max">{filters.maxPrice.toLocaleString()}frs</span>
                            </div>
                            <div className="gnocchi-slider-container dual">
                                <input
                                    type="range"
                                    min="0"
                                    max="500000"
                                    step="10000"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange("minPrice", parseInt(e.target.value))}
                                    className="gnocchi-slider"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="500000"
                                    step="10000"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange("maxPrice", parseInt(e.target.value))}
                                    className="gnocchi-slider"
                                />
                            </div>
                        </div>

                        <div className="bruschetta-filter-group">
                            <label className="prosciutto-label">Sort By</label>
                            <select
                                className="risotto-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="featured">Featured First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="bedrooms">Most Bedrooms</option>
                            </select>
                        </div>

                        <button className="bouillabaisse-reset-btn" onClick={resetFilters}>
                            Reset Filters
                        </button>
                    </div>

                    <div className="gazpacho-filter-card">
                        <h3 className="frittata-filter-title">PORTFOLIO HIGHLIGHTS</h3>
                        <div className="mousseline-highlight">
                            <span className="mousseline-label">Most Expensive</span>
                            <span className="mousseline-value">
                                {Math.max(...houses.map(h => h.rent)).toLocaleString()}frs/mo
                            </span>
                        </div>
                        <div className="mousseline-highlight">
                            <span className="mousseline-label">Largest Property</span>
                            <span className="mousseline-value">
                                {Math.max(...houses.map(h => h.area_sqm))} sqm
                            </span>
                        </div>
                        <div className="mousseline-highlight">
                            <span className="mousseline-label">Avg. Monthly Rent</span>
                            <span className="mousseline-value">
                                {(houses.reduce((sum, house) => sum + house.rent, 0) / houses.length).toLocaleString()}frs
                            </span>
                        </div>
                    </div>
                </aside>



                <main className="osso-buco-main">
                    <div className="carpaccio-grid-header">
                        <h2 className="carpaccio-title">PREMIUM PROPERTIES <span className="carpaccio-count">({filteredHouses.length})</span></h2>
                        <div className="gelato-view-toggle">
                            <button className="gelato-view-btn active">Grid</button>
                            <button className="gelato-view-btn">List</button>
                            <button className="gelato-view-btn">Map</button>
                        </div>
                    </div>

                    {filteredHouses.length === 0 ? (
                        <div className="baba-ganoush-empty">
                            <div className="baba-ganoush-icon" style={{ color: "#fff" }}><ion-icon name="home-outline"></ion-icon></div>
                            <h3 className="baba-ganoush-title">No properties match your filters</h3>
                            <p className="baba-ganoush-text">Try adjusting your search criteria</p>
                            <button className="baba-ganoush-btn" onClick={resetFilters}>Reset All Filters</button>
                        </div>
                    ) : (
                        <section className="platter-table">
                            {filteredHouses.map((house) => (
                                <article
                                    key={house._id}
                                    className={`golden-lasagna ${house.featured ? 'featured' : ''}`}
                                    onClick={() => setSelectedHouse(house)}
                                >
                                    {house.featured && <div className="tagliatelle-featured">FEATURED</div>}
                                    <div
                                        className="saffron-cover"
                                        style={{ backgroundImage: `url(${house.image})` }}
                                    />

                                    <div className="truffle-content">
                                        <div className="carbonara-header">
                                            <h2 className="carbonara-title">{house.title}</h2>
                                            <span className="carbonara-type">{house.type.toUpperCase()}</span>
                                        </div>

                                        <p className="olive-location">
                                            <ion-icon name="location-outline"></ion-icon> {house.location.address}
                                        </p>
                                        <p className="carbonara-header">
                                            {house.isAvalable ?
                                                <span style={{ color: "green" }}>avaliable</span>
                                                : <span style={{ color: "red" }}>taken</span>}
                                        </p>

                                        <div className="herb-stats">
                                            <span className="herb-stat-item"> <i className="icon"><ion-icon name="bed-outline"></ion-icon></i>  {house.bedrooms} Beds</span>
                                            <span className="herb-stat-item"> <i className="icon"><ion-icon name="bonfire-outline"></ion-icon></i> {house.bathrooms} Baths</span>
                                            <span className="herb-stat-item"><i className="icon"><ion-icon name="pencil-outline"></ion-icon></i> {house.area_sqm} sqm</span>
                                        </div>

                                        <div className="caviar-footer">
                                            <div className="caviar-price">
                                                <span className="price-tag">
                                                    {Number(house.rent).toLocaleString()}FCFA/{house.how}
                                                </span>
                                                <span className="price-note">Annual: {(house.rent * 12).toLocaleString()}frs</span>
                                            </div>

                                            <button className="reserve-button">
                                                Explore Space
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </section>
                    )}
                </main>
            </div>

            {/* Selected Property Modal */}
            {selectedHouse && (
                <div className="fondue-modal-overlay" onClick={() => setSelectedHouse(null)}>


                    <div className="fondue-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="fondue-close" onClick={() => setSelectedHouse(null)}>✕</button>

                        {/* <div className="fondue-modal-image" style={{ backgroundImage: `url(${selectedHouse.image})` }}></div> */}

                        <div
                            className="property-details-image-container"
                            style={{
                                borderRadius: "20px",
                                backgroundImage: `url(${selectedHouse?.reviews?.images?.[imageIndex] || selectedHouse?.image
                                    })`,
                            }}
                        >

                            <div className="nav-btns-container" >
                                <button
                                    onClick={decreaseIndex}><ArrowBackIosNewIcon /></button>
                                <button
                                    onClick={increaseIndex}
                                ><ArrowForwardIosIcon /></button>
                            </div>
                            <div className="dots">
                                <div className="dots-container">
                                    {selectedHouse.reviews.images.map((image, index) => {
                                        return <button className={`dots `}
                                            key={index}
                                            style={{
                                                opacity: index === imageIndex ? "1" : ".4",
                                                display: "block"
                                            }}
                                            onClick={() => { setImageIndex(index) }}

                                        ></button>
                                    })}
                                </div>


                            </div>

                        </div>



                        <div className="fondue-modal-content">
                            <h2 className="fondue-modal-title">{selectedHouse.title}</h2>
                            <p className="fondue-modal-location">{selectedHouse.location.address}</p>

                            <div className="fondue-modal-stats">
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Bedrooms</span>
                                    <span className="fondue-stat-value">{selectedHouse.bedrooms}</span>
                                </div>
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Bathrooms</span>
                                    <span className="fondue-stat-value">{selectedHouse.bathrooms}</span>
                                </div>
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Area</span>
                                    <span className="fondue-stat-value">{selectedHouse.area_sqm} sqm</span>
                                </div>
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Monthly Rent</span>
                                    <span className="fondue-stat-value">{selectedHouse.rent.toLocaleString() + " "}FCFA</span>
                                </div>
                            </div>

                            {/* 
                            <div className="fondue-modal-stats">
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Bedrooms</span>
                                    <span className="fondue-stat-value">{selectedHouse.bedrooms}</span>
                                </div>
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Bathrooms</span>
                                    <span className="fondue-stat-value">{selectedHouse.bathrooms}</span>
                                </div>
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Area</span>
                                    <span className="fondue-stat-value">{selectedHouse.area_sqm} sqm</span>
                                </div>
                                <div className="fondue-stat">
                                    <span className="fondue-stat-label">Monthly Rent</span>
                                    <span className="fondue-stat-value">{selectedHouse.rent.toLocaleString() + " "}FCFA</span>
                                </div>
                            </div> */}


                            <p className="fondue-modal-description">
                                {selectedHouse.description}
                            </p>

                            <div className=" card-container" style={{ padding: "15px" }}>
                                {selectedHouse.amenities.map((amenity, index) => {
                                    return (
                                        <div className="amenity-card" key={index}>
                                            {findIcon(amenity)} <p>{amenity}</p>
                                        </div>
                                    );
                                })}
                            </div>


                            <MapComponent
                                center={[
                                    selectedHouse.location.coordinates.lat,
                                    selectedHouse.location.coordinates.lng,
                                ]}
                                zoom={23}
                                locations={[
                                    {
                                        position: [
                                            selectedHouse.location.coordinates.lat,
                                            selectedHouse.location.coordinates.lng,
                                        ],
                                        // position: [4.0714, 9.6818],
                                        title: selectedHouse.title,
                                        images: [selectedHouse.image],
                                    },
                                ]}
                            />


                            {/* suppy */}
                            {/* 
                            <div className="description-card" style={{ background: "transparent" }}>
                                <h4 className="details-sub-heading">Ratings &amp; Reviews</h4>
                                <div className="ratings-and-text-title">
                                    <Ratings
                                        method="get"
                                        count={selectedHouse.reviews.overallRating}
                                        size={window.innerWidth >= 425 ? "large" : "medium"}
                                    />
                                    <p
                                        className="rating-overall"
                                    >

                                        {selectedHouse.reviews.overallRating} out of 5 (
                                        {selectedHouse.reviews.totalReviews} Reviews)
                                    </p>
                                </div>
                                <div className="comments-container">
                                    {selectedHouse.reviews.entries.map((entry, index) => {
                                        return (
                                            <div className="comment-card" key={index}>
                                                <div className="comment-profile-info">
                                                    <div
                                                        className="comment-profile-img-container"
                                                        style={{
                                                            backgroundImage: `url(${!entry.profileImg ? " " : entry.profileImg})`
                                                        }}
                                                    >
                                                    </div>
                                                    <div className="name-and-rating">
                                                        <p>{entry.name}</p>
                                                        <Ratings
                                                            method="get"
                                                            count={entry.rating}
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="comment-content">
                                                    {entry.comment}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>


                            </div> */}

                            <ReviewRatingSection allowalladmins={allow} propertyId={selectedHouse?._id} currentUser={userhere} isAdmin={isAdmin} />
                            {/* actions  */}

                            {/* actions */}
                            <section className="luxury-action-section" style={{ color: "#ffff", fontSize: "1rem" }} >
                                <Divider sx={{ mb: 3 }} style={{ color: "#ffff" }} />
                                <Stack spacing={3} style={{ color: "#ffff" }} >


                                    {/* <FormControlLabel
                                        control={
                                            <Switch
                                                checked={toggles.preview}
                                                onChange={handleChange("preview")}
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label="Disable This Post (This will stop it from displaying on thr seekers site)"
                                    /> */}
                                    {/* <FormControlLabel
                                        label="Save"
                                        color="#ffff"
                                        control={
                                            <Switch
                                                checked={toggles.favorite}
                                                onChange={handleChange("favorite")}
                                                color="secondary"
                                                size="small"
                                            />
                                        }

                                    /> */}
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={toggles.compare}
                                                onChange={handleChange("compare")}
                                                color="success"
                                                size="small"
                                            />
                                        }
                                        label="Is this house still avaliable "
                                    />
                                    <button style={{
                                        borderRadius: "14px",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        background:
                                            "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                                        width: 70,
                                        height: 30,
                                        border: "none",
                                        outline: "none",
                                        cursor: "pointer",
                                        color: "#fff"
                                    }

                                    }
                                        onClick={saveSettings}
                                        disabled={boolsave}
                                    >{boolsave ? "saving.." : "save"}</button>




                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={allow}
                                                onChange={(e) => setallow(e.target.checked)}
                                                color="success"
                                                size="small"
                                            />

                                        }
                                        label="allow all owners to reply to post"
                                    />
                                    <button style={{
                                        borderRadius: "14px",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        background:
                                            "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                                        width: 70,
                                        height: 30,
                                        border: "none",
                                        outline: "none",
                                        cursor: "pointer",
                                        color: "#fff"
                                    }

                                    }
                                        onClick={settingallow}
                                        disabled={allowsave}
                                    >{allowsave ? "saving.." : "save"}</button>



                                    <Stack direction="row" spacing={2} style={{ marginBottom: 40 }}>
                                        <Tooltip title="Schedule a private viewing">
                                            <Button
                                                fullWidth
                                                size="small"
                                                variant="contained"
                                                startIcon={<EventAvailableIcon />}
                                                sx={{
                                                    borderRadius: "14px",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    fontSize: 12,
                                                    padding: "6px 12px",
                                                    background:
                                                        "linear-gradient(135deg, #0f2027, #203a43, #2c5364)"
                                                }}
                                                disabled={true}
                                            >
                                                Edit Info
                                            </Button>
                                        </Tooltip>

                                        <Tooltip title="Download property brochure">
                                            <Button
                                                fullWidth
                                                size="small"
                                                variant="outlined"
                                                startIcon={<ion-icon name="trash-bin-outline"></ion-icon>}
                                                sx={{
                                                    borderRadius: "14px",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    fontSize: 12,
                                                    padding: "6px 12px",
                                                    borderColor: "rgba(255,255,255,0.3)",
                                                    color: "#fff"
                                                }}
                                            >
                                                Delete House
                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                </Stack>
                            </section>



                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="tiramisu-footer">
                <div className="tiramisu-content">
                    <p className="tiramisu-text">© {Date().toLocaleString()} {user?.companyname} </p>
                    <div className="tiramisu-links">
                        <a href="#" className="tiramisu-link">Privacy Policy</a>
                        <a href="#" className="tiramisu-link">Terms of Service</a>
                        <a href="#" className="tiramisu-link">Contact Portfolio Manager</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HousePlatter;