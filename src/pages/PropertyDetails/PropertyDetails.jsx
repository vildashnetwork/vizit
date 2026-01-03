import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BottomTabs, Container, Footer, Head, SideNav } from "../LandingPage/LandingPage";
import { data } from "../../data/listingdata";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import dayjs from "dayjs";
import { cleanString } from "../../utils/cleanString";
import "./dStyles.css";
import { MapComponent } from "../LandingPage/MapComponent";
import defaultProfile from "../../assets/images/default-profile.png";

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
// import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from "react";
import axios from "axios";
export function Ratings({ method, size, count }) {
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

Head;
Container;
Footer;
cleanString;
MapComponent;
function PropertyDetails() {
  const { propertyId } = useParams();
  const [imageIndex, setImageIndex] = useState(0)









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

  const [isAdmin, setisAdmin] = useState(false)

  useEffect(() => {
    const check = () => {
      const compare = property?.owner?.id == userhere._id
      if (compare) {
        setisAdmin(true)
      } else {
        setisAdmin(false)
      }
    }
    check()

  }, [])

  let property = data.filter((data) => data.listingId === propertyId);
  let house = property[0];
  let detailsImageContainer = {};
  const images = house.images?.length ? house.images : [house.image];

  function increaseIndex() {
    setImageIndex((prev) =>
      prev >= images.length - 1 ? 0 : prev + 1
    );
  }

  function decreaseIndex() {
    setImageIndex((prev) =>
      prev <= 0 ? images.length - 1 : prev - 1
    );
  }

  // useEffect(()=>{
  //     let publicInterval = setInterval(increaseIndex,5000)
  // })

  return (
    <div>
      <Head />
      <SideNav />
      <Container>
        <div className="details-main" style={{}}>


          {/* <div
            className="property-details-image-container"
            style={{
              // padding:"20px",
              borderRadius: "20px",
              backgroundImage: `url(${imageIndex === 0 ? house.image : house.images[imageIndex]})`,

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
                {data[0].images.map((image, index) => {
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

          </div> */}


          <div
            className="property-details-image-container"
            style={{
              borderRadius: "20px",
              backgroundImage: `url(${images[imageIndex]})`,
            }}
          >
            <div className="nav-btns-container">
              <button onClick={decreaseIndex}>
                <ArrowBackIosNewIcon />
              </button>
              <button onClick={increaseIndex}>
                <ArrowForwardIosIcon />
              </button>
            </div>

            <div className="dots">
              <div className="dots-container">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className="dots"
                    style={{ opacity: index === imageIndex ? 1 : 0.4 }}
                    onClick={() => setImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <h2 className="details-sub-heading">{house.title}</h2>
          <h4 className="details-location">
            <LocationOnIcon />
            {house.location.address}
          </h4>
          <br />
          <div className=" card-container">
            <div className="amenity-card flex-row house-must">
              <SquareFootIcon fontSize="large" className="icons-green" />{" "}
              <p>
                {house.area_sqm}{" "}
                <span>
                  m <sup>2</sup>
                </span>
              </p>
            </div>
            <div className="amenity-card flex-row house-must">
              <HotelOutlinedIcon fontSize="large" className="icons-green" />{" "}
              <p>{house.bedrooms} Bed room(s)</p>
            </div>
            <div className="amenity-card flex-row house-must">
              <BathtubOutlinedIcon fontSize="large" className="icons-green" />{" "}
              <p>{house.bathrooms} Bath(s)</p>
            </div>
            <div className="amenity-card flex-row house-must">
              <HistoryToggleOffOutlinedIcon
                fontSize="large"
                className="icons-green"
              />{" "}
              <p>{dayjs(house.postedAt).format("DD/MM/YYYY HH:mm")}</p>
            </div>
          </div>
          <div className="description-card">
            <h4 className="details-sub-heading">Property Description</h4>
            {house.description}
          </div>

          <div className="description-card">
            <h5 className="details-sub-heading">Amenities</h5>
            <br />
            <div className=" card-container">
              {house.amenities.map((amenity, index) => {
                return (
                  <div className="amenity-card" key={index}>
                    {findIcon(amenity)} <p>{amenity}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="description-card">
            <h4 className="details-sub-heading">Explore In Map</h4>
            Explore the Vicinity , Find important loactions closde to this
            Lisiting
            <button
              onClick={() => {
                window.location = `https://www.google.com/maps/@${house.location.coordinates.lat
                  },${house.location.coordinates.lng},${18}z`;
              }}
              style={{
                padding: "8px",
                cursor: "pointer",
                color: "#005345ff",
                backgroundColor: "white",
                margin: "20px 0",
                display: "block",
              }}
            >
              View in google Map
            </button>
          </div>

          <MapComponent
            center={[
              house.location.coordinates.lat,
              house.location.coordinates.lng,
            ]}
            zoom={23}
            locations={[
              {
                position: [
                  house.location.coordinates.lat,
                  house.location.coordinates.lng,
                ],
                // position: [4.0714, 9.6818],
                title: house.title,
                images: [house.image],
              },
            ]}
          />

          <div className="description-card">
            <h4 className="details-sub-heading">Ratings &amp; Reviews</h4>
            <div className="ratings-and-text-title">
              <Ratings
                method="get"
                count={house.reviews.overallRating}
                size={window.innerWidth >= 425 ? "large" : "medium"}
              />
              <p
                className="rating-overall"
              >

                {house.reviews.overallRating} out of 5 (
                {house.reviews.totalReviews} Reviews)
              </p>
            </div>
            <div className="comments-container">
              {house.reviews.entries.map((entry, index) => {
                return (
                  <div className="comment-card" key={index}>
                    <div className="comment-profile-info">
                      <div
                        className="comment-profile-img-container"
                        style={{
                          backgroundImage: `url(${!entry.profileImg ? defaultProfile : entry.profileImg})`
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

          </div>






        </div>
        <button className="start-discussion-with-owner-button"
          style={{


          }}

        >
          Chat With Owner
        </button>

      </Container>
      <BottomTabs></BottomTabs>
      <Footer />
    </div>
  );
}

export default PropertyDetails;
