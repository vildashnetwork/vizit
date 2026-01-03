import React, { useEffect, useState } from "react";
import {
  biuldingTypes,
  BottomTabs,
  Container,
  Footer,
  Head,
  ListingsCard,
  locations,
  SideNav,
} from "../LandingPage/LandingPage";
import "./sStyles.css";
import "leaflet/dist/leaflet.css";
import { data } from "../../data/listingdata";
import { MapComponent } from "../LandingPage/MapComponent";
import { PosAnimation } from "leaflet";
import { cleanString } from "../../utils/cleanString";
const center = [4.0511, 9.7679];

import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import { femaleSharp, shapes } from "ionicons/icons";

// import { Header } from '../LandingPage/LandingPage'
SideNav;
BottomTabs;
Footer;
Container;
MapComponent;
cleanString;

// ListingsCard
// useState
export const propertyTypes = biuldingTypes;
export const amenities = {
  // Critical Infrastructure & Utilities
  utilities: [
    "Backup Generator ",
    "Water Reservoir",
    "24/7 Running Water ",
    "Air Conditioning",
    "WIFI/ Internet Connection",
    "Balcony",
  ],

  //security
  security: [
    "24/7 Security With Guard",
    "Fenced/Walled Compound",
    "Gated Access ",
    "Parking Space",
  ],

  //interior features
  interiorFeatures: [
    "Furnished",
    "Fitted Kitchen",
    "Hot Water Heater ",
    "High-Speed Internet Access",
  ],

  //lifestyle
  lifestyle: ["Swimming Pool", "Pet-Friendly ", "Near Park/Green Space"],
};
export function Switcher({ callback, size, defaultValue }) {
  let state = "row";
  let lighting = "#9b9a9aff";
  let colorBack = "#444";
  if (defaultValue === true) {
    state = "row-reverse";
    lighting = "#fff";
    colorBack = "#0db397ff";
  } else if (defaultValue === false) {
    state = "row";
    lighting = "#9b9a9aff";
    colorBack = "#444";
  }

  const [direction, setDirection] = useState(state);
  const [justify, setJustify] = useState("");
  const [light, setLight] = useState(lighting);
  const [lighttedBack, setLightedBackgroung] = useState(colorBack);
  let idealSize = size || 30;

  const togglerContainerStyles = {
    width: `${50}px`,
    padding: `${idealSize / 19}px`,
    boxShadow: "  0 0  2px 1px #202020ff  ",
    display: "inline-flex",
    borderRadius: `${idealSize / 4}px`,
    backgroundColor: lighttedBack,
    flexDirection: direction,
    justifyContent: justify,
    alignItems: "center",
  };

  const dynamicStyles = {
    width: `${idealSize / 2}px`,
    height: `${idealSize / 2}px`,
    borderRadius: "50%",
    border: "none",
    backgroundColor: light,
    cursor: "pointer",

    //  alignSelf:alignment
  };
  return (
    <div className="switch" style={togglerContainerStyles}>
      <button
        className="internal-toggler"
        onClick={() => {
          callback();
          if (direction === "row-reverse") {
            setDirection("");
            setJustify("center");
            setLight("#9b9a9aff");
            setLightedBackgroung("#444");
            setTimeout(() => setJustify(""), 60);
          } else {
            setDirection("row-reverse");
            setJustify("center");
            setTimeout(() => setJustify(""), 60);
            setLight("#ffffffff");
            setLightedBackgroung("#026151ff");
          }
        }}
        style={dynamicStyles}
      ></button>
    </div>
  );
}
const SearchProperty = () => {
  //
  const [listingsData, setListingsData] = useState({ listings: data, locations })
  const [mapview, setmapview] = useState(true);
  const [mapFull, setMapFull] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  //filter states
  //! FILTER STATES

  const [filters, setFilters] = useState({
    backupgenerator: false,
    waterreservoir: false,
    runningwater: false,
    airconditioning: false,
    wifiinternetconnection: false,
    securitywithguard: false,
    fencedwalledcompound: false,
    gatedacces: false,
    parkingspace: false,
    furnished: false,
    fittedkitchen: false,
    hotwaterheater: false,
    highpeedinternetaccess: false,
  });
  const [propertyTypeFilter, setPropertyTypeFilter] = useState({
    apartment: false,
    guesthouse: false,
    hotel: false,
    modernroom: false,
    studio: false,
  });
  // prefer useeffect for any change
  // useEffect(setPropertyTypeFilter,[propertyTypeFilter])
  //
  const mapContainerStyles = {
    height: mapFull ? "85vh" : "40vh",
    padding: "10px",
    // width: "35%",
    borderRadius: "0px",
    position: "fixed",
    // top: "70px",
    right: "0px",
    bottom: 0,
    left: 0,
    display: mapview ? "block" : "none",
    backgroundColor: "rgba(252, 252, 252, 1)",
    borderTop: "1px solid black",
    boxShadow: "0 0 2px 4px black",
    zIndex: 10001,
  };
  const customMapStyles = {
    height: mapFull ? "85vh" : "40vh",
    width: "100%",
    borderRadius: "0px",
  };

  const BtnContainerStyles = {
    position: "absolute",
    top: "3px",
    right: "2px",
    padding: "13px",
    backgroundColor: "rgba(255, 255, 255, 0)",
    color: "black",
    zIndex: 100000000,
    // fontSize: "40px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    gap: "3px",
    alignItems: "flex-start",
  };
  const btnStyle = {
    backgroundColor: "rgba(255, 255, 255, 1)",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    boxShadow: "0 0 2px black",
    borderRadius: "2px",
  };
  const infoContainer = {
    position: "absolute",
    top: "3px",
    right: "100px",
    padding: "13px",
    backgroundColor: "rgba(255, 255, 255, 1)",
    color: "black",
    zIndex: 100000000,
    // fontSize: "40px",
    border: "none",
    cursor: "pointer",
    display: showInfo ? "flex" : "none",
    flexDirection: "column",
    gap: "3px",
  };
  const infoBtnStyles = {
    backgroundColor: "rgba(255, 255, 255, 0)",
    border: "none",
    cursor: "pointer",
    // padding:"5px",
    // boxShadow:"0 0 2px black",
    borderRadius: "2px",
    display: showInfo ? "none" : "inline-block",
    color: "#00ccffff",
    // fontSize: "20px"
  };
  function switchOthersFilter(str, util) {
    str = cleanString(util);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [str]: !prevFilters[str],

    }));
    console.log(filters)
  }
  function filterPropertyByAmenities() {
    // const amenities = []
    const activeFilters = Object.entries(filters)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    return activeFilters;
  }
  function includeAmenities(listings, data) {
    listings.push(data);

    if (filterPropertyByAmenities.length > 0) {
      const cleanedFilter = filterPropertyByAmenities.map(cleanString);

      const hasMatchingAmenity = data.amenities.some((amenity) =>
        cleanedFilter.includes(cleanString(amenity))
      );

      if (!hasMatchingAmenity) {
        listings.pop(); // remove last item
      }
    }

  }
  function filterBuildingsByPreference() {
    let listings = [];
    let locations = [];
    let selections = filterPropertyByAmenities();

    function addParameterAmenities(currData) {

      if (selections.length > 0) {
        const matches = selections.some(item => currData.amenities.some(keyword => item.includes(cleanString(keyword))));
        if (matches) {
          // alert(currData.amenities)
          listings.push(currData)
        }
      }
      else {
        listings.push(currData)
      }
    }
    // console.log(data)

    data.forEach((data) => {


      if (data.isAvailable && propertyTypeFilter.apartment && cleanString(data.type) === "apartment") {

        // if (selections.length > 0){
        //   const matches = addParameterAmenities(data)
        //   if(matches){
        //     alert(data.amenities)
        //     listings.push(data)
        //   }
        // }
        // else{
        // listings.push(data)
        // }
        addParameterAmenities(data)
      }
      else if (data.isAvailable && propertyTypeFilter.guesthouse && cleanString(data.type) === "guesthouse") {
        addParameterAmenities(data)
      }
      else if (data.isAvailable && propertyTypeFilter.hotel && cleanString(data.type) === "hotel") {
        addParameterAmenities(data)
      }
      else if (data.isAvailable && propertyTypeFilter.modernroom && cleanString(data.type) === "modernroom") {

        addParameterAmenities(data)
      }
      else if (data.isAvailable && propertyTypeFilter.studio && cleanString(data.type) === "studio") {
        addParameterAmenities(data)
      }
      else {
        const activeBuildingFilters = Object.entries(propertyTypeFilter)
          .filter(([key, value]) => value === true)
          .map(([key]) => key);
        if (activeBuildingFilters.length === 0) {
          addParameterAmenities(data)
        }

      }
      filterPropertyByAmenities();
    })


    //     console.log(data.type)
    //     if(data.type === undefined){
    //       console.error("House type is undefined")
    //       return;
    //     }
    //     else{
    //     if(propertyTypeFilter.apartment === true){
    //       listings.push(data)
    //       locations.push(  {    position: [data.location.coordinates.lat, data.location.coordinates.lng],
    //       // position: [4.0714, 9.6818],
    //       title: data.title,
    //       images: [data.image]})
    //     }
    //     }


    //   }
    // )
    // console.log(listings)


    locations = listings.map((data) => {
      return {
        position: [data.location.coordinates.lat, data.location.coordinates.lng],
        // position: [4.0714, 9.6818],
        title: data.title,
        images: [data.image]
      }
    })
    setListingsData({ listings, locations });

    // return search;

  }

  return (
    <>
      <Head />
      <SideNav />
      <BottomTabs />
      <Container>

        <main className="main">
          <div>
            <div className="filter-property-rules">
              <h2>Filter Property</h2>
              <div
                className="toggle-container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "10px 0",
                }}
              >
                <h3>View Search in Map</h3>{" "}
                <Switcher
                  defaultValue={true}
                  callback={() => {
                    mapview ? setmapview(false) : setmapview(true);
                  }}
                />
              </div>

              <p>Refine Your search criteria</p>
              <h4>Property Type</h4>
              <ul>
                {propertyTypes.map((propertyType, index) => {
                  return (
                    <li>
                      <label
                        htmlFor=""
                        key={index}

                        onChange={() => {
                          setPropertyTypeFilter((prevFilters) => ({
                            ...prevFilters,

                            [cleanString(propertyType)]:
                              !prevFilters[cleanString(propertyType)],
                          }));
                          console.log(propertyTypeFilter);
                          // filterBuildingsByPreference()

                        }}
                        checked={propertyTypeFilter[propertyType] || false}
                      >
                        {/* {let properTypeName=  */}
                        <input
                          type="checkbox"
                          style={{ cursor: "pointer" }}
                        />{" "}
                        {propertyType}
                      </label>
                    </li>
                  );
                })}
              </ul>
              <h4>Others</h4>
              <h5>Utilities</h5>
              <ul>
                {amenities.utilities.map((util, index) => {
                  return (
                    <li key={index}>
                      {util}{" "}
                      <Switcher
                        callback={() => switchOthersFilter(util, util)}
                      />
                    </li>
                  );
                })}
              </ul>
              <h5>Security</h5>
              <ul>
                {amenities.security.map((util, index) => {
                  return (
                    <li key={index}>
                      {util}{" "}
                      <Switcher
                        callback={() => switchOthersFilter(util, util)}
                      />
                    </li>
                  );
                })}
              </ul>
              <h5>Interior Features</h5>
              <ul>
                {amenities.interiorFeatures.map((util, index) => {
                  return (
                    <li key={index}>
                      {util}{" "}
                      <Switcher
                        callback={() => switchOthersFilter(util, util)}
                      />
                    </li>
                  );
                })}
              </ul>
              <h5>Life Style</h5>
              <ul>
                {amenities.lifestyle.map((util, index) => {
                  return (
                    <li key={index}>
                      {util}{" "}
                      <Switcher
                        callback={() => switchOthersFilter(util, util)}
                      />
                    </li>
                  );
                })}
              </ul>
              <button className="apply-filter-btn" onClick={filterBuildingsByPreference}>Apply Filters</button>
            </div>
            <div className="listings-card-container" style={{ width: "100%" }}>
              {listingsData.listings

                // .filter((item) => item.title.toLowerCase().includes("luxury"))
                .map((item, index) => {
                  return (
                    <ListingsCard
                      key={index}
                      id={item.listingId}
                      image={item.image}
                      title={item.title}
                      location={item.location.address}
                      rent={item.rent}
                    />
                  );
                })}
            </div>
          </div>

          <div style={mapContainerStyles}>
            <div style={infoContainer}>
              <h4>Interactive Map</h4>
              <p>Click the makers for the makers</p>
            </div>
            <div style={BtnContainerStyles}>
              <button
                style={infoBtnStyles}
                onClick={() => {
                  setShowInfo(true);
                  setTimeout(() => {
                    setShowInfo(false);
                  }, 3000);
                }}
              >
                <InfoIcon
                  fontSize="large"
                  style={{ backgroundColor: "white", borderRadius: "50%" }}
                />
              </button>
              {!mapFull ? (
                <button style={btnStyle} onClick={() => setMapFull(true)}>
                  <OpenInFullIcon />
                </button>
              ) : (
                <button style={btnStyle} onClick={() => setMapFull(false)}>
                  <CloseFullscreenIcon />
                </button>
              )}
              <button style={btnStyle} onClick={() => setmapview(false)}>
                <CloseIcon />
              </button>
            </div>

            <MapComponent
              zoom={13}
              locations={listingsData.locations}
              center={center}
              customStyles={customMapStyles}
            />
          </div>
        </main>

      </Container>

      <Footer />
    </>
  );
};

export default SearchProperty;
