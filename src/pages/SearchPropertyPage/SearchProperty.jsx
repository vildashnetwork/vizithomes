// import React, { useEffect, useState } from "react";
// import {
//   biuldingTypes,
//   BottomTabs,
//   Container,
//   Footer,
//   Head,
//   ListingsCard,
//   locations,
//   SideNav,
// } from "../LandingPage/LandingPage";
// import "./sStyles.css";
// import "leaflet/dist/leaflet.css";
// import { data } from "../../data/listingdata";
// import { MapComponent } from "../LandingPage/MapComponent";
// import { PosAnimation } from "leaflet";
// import { cleanString } from "../../utils/cleanString";
// const center = [4.0511, 9.7679];

// import CancelIcon from "@mui/icons-material/Cancel";
// import CloseIcon from "@mui/icons-material/Close";
// import OpenInFullIcon from "@mui/icons-material/OpenInFull";
// import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import InfoIcon from "@mui/icons-material/Info";
// import { femaleSharp, shapes } from "ionicons/icons";

// // import { Header } from '../LandingPage/LandingPage'
// SideNav;
// BottomTabs;
// Footer;
// Container;
// MapComponent;
// cleanString;

// // ListingsCard
// // useState
// export const propertyTypes = biuldingTypes;
// export const amenities = {
//   // Critical Infrastructure & Utilities
//   utilities: [
//     "Backup Generator ",
//     "Water Reservoir",
//     "24/7 Running Water ",
//     "Air Conditioning",
//     "WIFI/ Internet Connection",
//     "Balcony",
//   ],

//   //security
//   security: [
//     "24/7 Security With Guard",
//     "Fenced/Walled Compound",
//     "Gated Access ",
//     "Parking Space",
//   ],

//   //interior features
//   interiorFeatures: [
//     "Furnished",
//     "Fitted Kitchen",
//     "Hot Water Heater ",
//     "High-Speed Internet Access",
//   ],

//   //lifestyle
//   lifestyle: ["Swimming Pool", "Pet-Friendly ", "Near Park/Green Space"],
// };
// export function Switcher({ callback, size, defaultValue }) {
//   let state = "row";
//   let lighting = "#9b9a9aff";
//   let colorBack = "#444";
//   if (defaultValue === true) {
//     state = "row-reverse";
//     lighting = "#fff";
//     colorBack = "#0db397ff";
//   } else if (defaultValue === false) {
//     state = "row";
//     lighting = "#9b9a9aff";
//     colorBack = "#444";
//   }

//   const [direction, setDirection] = useState(state);
//   const [justify, setJustify] = useState("");
//   const [light, setLight] = useState(lighting);
//   const [lighttedBack, setLightedBackgroung] = useState(colorBack);
//   let idealSize = size || 30;

//   const togglerContainerStyles = {
//     width: `${50}px`,
//     padding: `${idealSize / 19}px`,
//     boxShadow: "  0 0  2px 1px #202020ff  ",
//     display: "inline-flex",
//     borderRadius: `${idealSize / 4}px`,
//     backgroundColor: lighttedBack,
//     flexDirection: direction,
//     justifyContent: justify,
//     alignItems: "center",
//   };

//   const dynamicStyles = {
//     width: `${idealSize / 2}px`,
//     height: `${idealSize / 2}px`,
//     borderRadius: "50%",
//     border: "none",
//     backgroundColor: light,
//     cursor: "pointer",

//     //  alignSelf:alignment
//   };
//   return (
//     <div className="switch" style={togglerContainerStyles}>
//       <button
//         className="internal-toggler"
//         onClick={() => {
//           callback();
//           if (direction === "row-reverse") {
//             setDirection("");
//             setJustify("center");
//             setLight("#9b9a9aff");
//             setLightedBackgroung("#444");
//             setTimeout(() => setJustify(""), 60);
//           } else {
//             setDirection("row-reverse");
//             setJustify("center");
//             setTimeout(() => setJustify(""), 60);
//             setLight("#ffffffff");
//             setLightedBackgroung("#026151ff");
//           }
//         }}
//         style={dynamicStyles}
//       ></button>
//     </div>
//   );
// }
// const SearchProperty = () => {
//   //
//   const [listingsData, setListingsData] = useState({
//     listings: data,
//     locations,
//   });
//   const [mapview, setmapview] = useState(true);
//   const [mapFull, setMapFull] = useState(true);
//   const [showInfo, setShowInfo] = useState(false);
//   //filter states
//   //! FILTER STATES

//   const [filters, setFilters] = useState({
//     backupgenerator: false,
//     waterreservoir: false,
//     runningwater: false,
//     airconditioning: false,
//     wifiinternetconnection: false,
//     securitywithguard: false,
//     fencedwalledcompound: false,
//     gatedacces: false,
//     parkingspace: false,
//     furnished: false,
//     fittedkitchen: false,
//     hotwaterheater: false,
//     highpeedinternetaccess: false,
//   });
//   const [propertyTypeFilter, setPropertyTypeFilter] = useState({
//     apartment: false,
//     guesthouse: false,
//     hotel: false,
//     modernroom: false,
//     studio: false,
//   });
//   // prefer useeffect for any change
//   // useEffect(setPropertyTypeFilter,[propertyTypeFilter])
//   //
//   const mapContainerStyles = {
//     height: mapFull ? "85vh" : "40vh",
//     padding: "10px",
//     // width: "35%",
//     borderRadius: "0px",
//     position: "fixed",
//     // top: "70px",
//     right: "0px",
//     bottom: 0,
//     left: 0,
//     display: mapview ? "block" : "none",
//     backgroundColor: "rgba(252, 252, 252, 1)",
//     borderTop: "1px solid black",
//     boxShadow: "0 0 2px 4px black",
//     zIndex: 10001,
//   };
//   const customMapStyles = {
//     height: mapFull ? "85vh" : "40vh",
//     width: "100%",
//     borderRadius: "0px",
//   };

//   const BtnContainerStyles = {
//     position: "absolute",
//     top: "3px",
//     right: "2px",
//     padding: "13px",
//     backgroundColor: "rgba(255, 255, 255, 0)",
//     color: "black",
//     zIndex: 100000000,
//     // fontSize: "40px",
//     border: "none",
//     cursor: "pointer",
//     display: "flex",
//     gap: "3px",
//     alignItems: "flex-start",
//   };
//   const btnStyle = {
//     backgroundColor: "rgba(255, 255, 255, 1)",
//     border: "none",
//     cursor: "pointer",
//     padding: "5px",
//     boxShadow: "0 0 2px black",
//     borderRadius: "2px",
//   };
//   const infoContainer = {
//     position: "absolute",
//     top: "3px",
//     right: "100px",
//     padding: "13px",
//     backgroundColor: "rgba(255, 255, 255, 1)",
//     color: "black",
//     zIndex: 100000000,
//     // fontSize: "40px",
//     border: "none",
//     cursor: "pointer",
//     display: showInfo ? "flex" : "none",
//     flexDirection: "column",
//     gap: "3px",
//   };
//   const infoBtnStyles = {
//     backgroundColor: "rgba(255, 255, 255, 0)",
//     border: "none",
//     cursor: "pointer",
//     // padding:"5px",
//     // boxShadow:"0 0 2px black",
//     borderRadius: "2px",
//     display: showInfo ? "none" : "inline-block",
//     color: "#00ccffff",
//     // fontSize: "20px"
//   };
//   function switchOthersFilter(str, util) {
//     str = cleanString(util);
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [str]: !prevFilters[str],
//     }));
//     console.log(filters);
//   }
//   function filterPropertyByAmenities() {
//     // const amenities = []
//     const activeFilters = Object.entries(filters)
//       .filter(([key, value]) => value === true)
//       .map(([key]) => key);
//     return activeFilters;
//   }
//   function includeAmenities(listings, data) {
//     listings.push(data);

//     if (filterPropertyByAmenities.length > 0) {
//       const cleanedFilter = filterPropertyByAmenities.map(cleanString);

//       const hasMatchingAmenity = data.amenities.some((amenity) =>
//         cleanedFilter.includes(cleanString(amenity))
//       );

//       if (!hasMatchingAmenity) {
//         listings.pop(); // remove last item
//       }
//     }
//   }
//   function filterBuildingsByPreference() {
//     let listings = [];
//     let locations = [];
//     let selections = filterPropertyByAmenities();

//     function addParameterAmenities(currData) {
//       if (selections.length > 0) {
//         const matches = selections.some((item) =>
//           currData.amenities.some((keyword) =>
//             item.includes(cleanString(keyword))
//           )
//         );
//         if (matches) {
//           // alert(currData.amenities)
//           listings.push(currData);
//         }
//       } else {
//         listings.push(currData);
//       }
//     }
//     // console.log(data)

//     data.forEach((data) => {
//       if (
//         data.isAvailable &&
//         propertyTypeFilter.apartment &&
//         cleanString(data.type) === "apartment"
//       ) {
//         // if (selections.length > 0){
//         //   const matches = addParameterAmenities(data)
//         //   if(matches){
//         //     alert(data.amenities)
//         //     listings.push(data)
//         //   }
//         // }
//         // else{
//         // listings.push(data)
//         // }
//         addParameterAmenities(data);
//       } else if (
//         data.isAvailable &&
//         propertyTypeFilter.guesthouse &&
//         cleanString(data.type) === "guesthouse"
//       ) {
//         addParameterAmenities(data);
//       } else if (
//         data.isAvailable &&
//         propertyTypeFilter.hotel &&
//         cleanString(data.type) === "hotel"
//       ) {
//         addParameterAmenities(data);
//       } else if (
//         data.isAvailable &&
//         propertyTypeFilter.modernroom &&
//         cleanString(data.type) === "modernroom"
//       ) {
//         addParameterAmenities(data);
//       } else if (
//         data.isAvailable &&
//         propertyTypeFilter.studio &&
//         cleanString(data.type) === "studio"
//       ) {
//         addParameterAmenities(data);
//       } else {
//         const activeBuildingFilters = Object.entries(propertyTypeFilter)
//           .filter(([key, value]) => value === true)
//           .map(([key]) => key);
//         if (activeBuildingFilters.length === 0) {
//           addParameterAmenities(data);
//         }
//       }
//       filterPropertyByAmenities();
//     });

//     //     console.log(data.type)
//     //     if(data.type === undefined){
//     //       console.error("House type is undefined")
//     //       return;
//     //     }
//     //     else{
//     //     if(propertyTypeFilter.apartment === true){
//     //       listings.push(data)
//     //       locations.push(  {    position: [data.location.coordinates.lat, data.location.coordinates.lng],
//     //       // position: [4.0714, 9.6818],
//     //       title: data.title,
//     //       images: [data.image]})
//     //     }
//     //     }

//     //   }
//     // )
//     // console.log(listings)

//     locations = listings.map((data) => {
//       return {
//         position: [
//           data.location.coordinates.lat,
//           data.location.coordinates.lng,
//         ],
//         // position: [4.0714, 9.6818],
//         title: data.title,
//         images: [data.image],
//       };
//     });
//     setListingsData({ listings, locations });

//     // return search;
//   }

//   return (
//     <>
//       <Head />
//       <SideNav />
//       <BottomTabs />
//       <Container>
//         <main className="main">
//           <div>
//             <div className="filter-property-rules">
//               <h2>Filter Property</h2>
//               <div
//                 className="toggle-container"
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   margin: "10px 0",
//                 }}
//               >
//                 <h3>View Search in Map</h3>{" "}
//                 <Switcher
//                   defaultValue={true}
//                   callback={() => {
//                     mapview ? setmapview(false) : setmapview(true);
//                   }}
//                 />
//               </div>

//               <p>Refine Your search criteria</p>
//               <h4>Property Type</h4>
//               <ul>
//                 {propertyTypes.map((propertyType, index) => {
//                   return (
//                     <li>
//                       <label
//                         htmlFor=""
//                         key={index}
//                         onChange={() => {
//                           setPropertyTypeFilter((prevFilters) => ({
//                             ...prevFilters,

//                             [cleanString(propertyType)]:
//                               !prevFilters[cleanString(propertyType)],
//                           }));
//                           console.log(propertyTypeFilter);
//                           // filterBuildingsByPreference()
//                         }}
//                         checked={propertyTypeFilter[propertyType] || false}
//                       >
//                         {/* {let properTypeName=  */}
//                         <input
//                           type="checkbox"
//                           style={{ cursor: "pointer" }}
//                         />{" "}
//                         {propertyType}
//                       </label>
//                     </li>
//                   );
//                 })}
//               </ul>
//               <h4>Others</h4>
//               <h5>Utilities</h5>
//               <ul>
//                 {amenities.utilities.map((util, index) => {
//                   return (
//                     <li key={index}>
//                       {util}{" "}
//                       <Switcher
//                         callback={() => switchOthersFilter(util, util)}
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//               <h5>Security</h5>
//               <ul>
//                 {amenities.security.map((util, index) => {
//                   return (
//                     <li key={index}>
//                       {util}{" "}
//                       <Switcher
//                         callback={() => switchOthersFilter(util, util)}
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//               <h5>Interior Features</h5>
//               <ul>
//                 {amenities.interiorFeatures.map((util, index) => {
//                   return (
//                     <li key={index}>
//                       {util}{" "}
//                       <Switcher
//                         callback={() => switchOthersFilter(util, util)}
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//               <h5>Life Style</h5>
//               <ul>
//                 {amenities.lifestyle.map((util, index) => {
//                   return (
//                     <li key={index}>
//                       {util}{" "}
//                       <Switcher
//                         callback={() => switchOthersFilter(util, util)}
//                       />
//                     </li>
//                   );
//                 })}
//               </ul>
//               <button
//                 className="apply-filter-btn"
//                 onClick={filterBuildingsByPreference}
//               >
//                 Apply Filters
//               </button>
//             </div>
//             <div className="listings-card-container" style={{ width: "100%" }}>
//               {listingsData.listings

//                 // .filter((item) => item.title.toLowerCase().includes("luxury"))
//                 .map((item, index) => {
//                   return (
//                     <ListingsCard
//                       key={index}
//                       id={item.listingId}
//                       image={item.image}
//                       title={item.title}
//                       location={item.location.address}
//                       rent={item.rent}
//                     />
//                   );
//                 })}
//             </div>
//           </div>
//           <div style={mapContainerStyles}>
//             <div style={infoContainer}>
//               <h4>Interactive Map</h4>
//               <p>Click the makers for the makers</p>
//             </div>
//             <div style={BtnContainerStyles}>
//               <button
//                 style={infoBtnStyles}
//                 onClick={() => {
//                   setShowInfo(true);
//                   setTimeout(() => {
//                     setShowInfo(false);
//                   }, 3000);
//                 }}
//               >
//                 <InfoIcon
//                   fontSize="large"
//                   style={{ backgroundColor: "white", borderRadius: "50%" }}
//                 />
//               </button>
//               {!mapFull ? (
//                 <button style={btnStyle} onClick={() => setMapFull(true)}>
//                   <OpenInFullIcon />
//                 </button>
//               ) : (
//                 <button style={btnStyle} onClick={() => setMapFull(false)}>
//                   <CloseFullscreenIcon />
//                 </button>
//               )}
//               <button style={btnStyle} onClick={() => setmapview(false)}>
//                 <CloseIcon />
//               </button>
//             </div>

//             <MapComponent
//               zoom={13}
//               locations={listingsData.locations}
//               center={center}
//               customStyles={customMapStyles}
//             />
//           </div>
//         </main>
//       </Container>

//       <Footer />
//     </>
//   );
// };

// export default SearchProperty;

















import React, { useEffect, useState, useRef } from "react";
import {
  biuldingTypes,
  BottomTabs,
  Container,
  Footer,
  Head,
  ListingsCard,
  SideNav,
} from "../LandingPage/LandingPage";
import "./sStyles.css";
import "leaflet/dist/leaflet.css";
import { data } from "../../data/listingdata";
import { MapComponent } from "../LandingPage/MapComponent";
import { cleanString } from "../../utils/cleanString";
import axios from "axios";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import InfoIcon from "@mui/icons-material/Info";

const center = [4.0511, 9.7679];

export const propertyTypes = biuldingTypes;
export const amenities = {
  utilities: [
    "Backup Generator",
    "Water Reservoir",
    "24/7 Running Water",
    "Air Conditioning",
    "WIFI/ Internet Connection",
    "Balcony",
  ],
  security: [
    "24/7 Security With Guard",
    "Fenced/Walled Compound",
    "Gated Access",
    "Parking Space",
  ],
  interiorFeatures: [
    "Furnished",
    "Fitted Kitchen",
    "Hot Water Heater",
    "High-Speed Internet Access",
  ],
  lifestyle: ["Swimming Pool", "Pet-Friendly", "Near Park/Green Space"],
};

export function Switcher({ callback, size, defaultValue }) {
  const [direction, setDirection] = useState(defaultValue ? "row-reverse" : "row");
  const [justify, setJustify] = useState("");
  const [light, setLight] = useState(defaultValue ? "#fff" : "#9b9a9aff");
  const [lighttedBack, setLightedBackgroung] = useState(defaultValue ? "#0db397ff" : "#444");
  let idealSize = size || 30;

  const togglerContainerStyles = {
    width: `50px`,
    padding: `${idealSize / 19}px`,
    boxShadow: "0 0 2px 1px #202020ff",
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
  const [user, setUser] = useState(null);
  const [listingsData, setListingsData] = useState({ listings: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [mapview, setmapview] = useState(true);
  const [mapFull, setMapFull] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [filters, setFilters] = useState({});
  const [propertyTypeFilter, setPropertyTypeFilter] = useState({
    apartment: false,
    guesthouse: false,
    hotel: false,
    modernroom: false,
    studio: false,
  });

  // --- Verified Sorting Logic (Matches LandingPage) ---
  const fetchAndSortListings = async (rawListings) => {
    try {
      const updatedListings = await Promise.all(
        rawListings.map(async (item) => {
          try {
            const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/me/${item.owner.email}`);
            return { ...item, isVerified: !!res.data.user?.verified };
          } catch (err) {
            return { ...item, isVerified: false };
          }
        })
      );
      return [...updatedListings].sort((a, b) => (a.isVerified === b.isVerified ? 0 : a.isVerified ? -1 : 1));
    } catch (error) {
      return rawListings;
    }
  };

  useEffect(() => {
    const initSearch = async () => {
      // Decode user if possible
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/decode/token/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data.user);
        } catch (e) { console.error(e); }
      }

      const sorted = await fetchAndSortListings(data);
      setListingsData({
        listings: sorted,
        locations: sorted.map(item => ({
          position: [item.location.coordinates.lat, item.location.coordinates.lng],
          title: item.title, images: [item.image]
        }))
      });
      setLoading(false);
    };
    initSearch();
  }, []);

  function switchOthersFilter(util) {
    const key = cleanString(util);
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function filterBuildingsByPreference() {
    setLoading(true);
    let filtered = data.filter(item => item.isAvailable);

    // Filter by Property Type
    const activeBuildingFilters = Object.entries(propertyTypeFilter)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    if (activeBuildingFilters.length > 0) {
      filtered = filtered.filter(item => activeBuildingFilters.includes(cleanString(item.type)));
    }

    // Filter by Amenities (Others)
    const activeAmenityFilters = Object.entries(filters)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    if (activeAmenityFilters.length > 0) {
      filtered = filtered.filter(item => 
        item.amenities.some(amenity => activeAmenityFilters.includes(cleanString(amenity)))
      );
    }

    // Sort the filtered results by verification status
    const sorted = await fetchAndSortListings(filtered);
    
    setListingsData({
      listings: sorted,
      locations: sorted.map(item => ({
        position: [item.location.coordinates.lat, item.location.coordinates.lng],
        title: item.title, images: [item.image]
      }))
    });
    setLoading(false);
  }

  // Styles
  const mapContainerStyles = {
    height: mapFull ? "85vh" : "40vh",
    padding: "10px",
    borderRadius: "0px",
    position: "fixed",
    right: "0px",
    bottom: 0,
    left: 0,
    display: mapview ? "block" : "none",
    backgroundColor: "rgba(252, 252, 252, 1)",
    borderTop: "1px solid black",
    boxShadow: "0 0 2px 4px black",
    zIndex: 10001,
  };

  const customMapStyles = { height: "100%", width: "100%", borderRadius: "0px" };

  return (
    <>
      <Head user={user} />
      <SideNav />
      <BottomTabs />
      <Container>
        <main className="main">
          <div>
            <div className="filter-property-rules">
              <h2>Filter Property</h2>
              <div className="toggle-container" style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
                <h3>View Search in Map</h3>
                <Switcher defaultValue={mapview} callback={() => setmapview(!mapview)} />
              </div>

              <p>Refine Your search criteria</p>
              <h4>Property Type</h4>
              <ul>
                {propertyTypes.map((type, index) => (
                  <li key={index}>
                    <label style={{cursor: 'pointer'}}>
                      <input
                        type="checkbox"
                        checked={propertyTypeFilter[cleanString(type)] || false}
                        onChange={() => {
                          setPropertyTypeFilter(prev => ({
                            ...prev,
                            [cleanString(type)]: !prev[cleanString(type)]
                          }));
                        }}
                      /> {type}
                    </label>
                  </li>
                ))}
              </ul>

              <h4>Amenities & Features</h4>
              {Object.entries(amenities).map(([category, list]) => (
                <div key={category}>
                  <h5 style={{textTransform: 'capitalize', marginTop: '10px'}}>{category}</h5>
                  <ul>
                    {list.map((util, index) => (
                      <li key={index} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px'}}>
                        {util} <Switcher callback={() => switchOthersFilter(util)} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              <button className="apply-filter-btn" onClick={filterBuildingsByPreference}>
                Apply Filters
              </button>
            </div>

            <div className="listings-card-container" style={{ width: "100%" }}>
              {loading ? (
                <p style={{padding: '20px', textAlign: 'center'}}>Sorting verified listings...</p>
              ) : (
                listingsData.listings.map((item, index) => (
                  <ListingsCard
                    key={item.listingId || index}
                    id={item.listingId}
                    image={item.image}
                    title={item.title}
                    location={item.location.address}
                    rent={item.rent}
                    how={item?.how}
                    user={user}
                    isVerified={item.isVerified}
                  />
                ))
              )}
            </div>
          </div>

          <div style={mapContainerStyles}>
            <div style={{
              position: "absolute", top: "10px", right: "100px", padding: "10px",
              backgroundColor: "white", zIndex: 100000, display: showInfo ? "block" : "none",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)"
            }}>
              <h4>Interactive Map</h4>
              <p>Click markers to see details</p>
            </div>

            <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 100000, display: "flex", gap: "5px" }}>
              <button style={{background: 'white', border: 'none', padding: '5px', borderRadius: '4px'}} onClick={() => {
                setShowInfo(true);
                setTimeout(() => setShowInfo(false), 3000);
              }}><InfoIcon color="info" /></button>
              
              <button style={{background: 'white', border: 'none', padding: '5px', borderRadius: '4px'}} onClick={() => setMapFull(!mapFull)}>
                {mapFull ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
              </button>
              
              <button style={{background: 'white', border: 'none', padding: '5px', borderRadius: '4px'}} onClick={() => setmapview(false)}>
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