import React, { useState } from "react";
import {
  BottomTabs,
  Container,
  Footer,
  Head,
  ListingsCard,
  locations,
  SideNav,
} from "../LandingPage/LandingPage";
import "./sStyles.css";
import { data } from "../../data/listingdata";
import { MapComponent } from "../LandingPage/MapComponent";
import { PosAnimation } from "leaflet";
const center = [4.0511, 9.7679];

import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
// import { Header } from '../LandingPage/LandingPage'
SideNav;
BottomTabs;
Footer;
Container;
MapComponent;

// ListingsCard
// useState
const SearchProperty = () => {

  const [mapview,setmapview] = useState(true);
  const [mapFull,setMapFull] = useState(false)
  const mapContainerStyles = {
    height: mapFull ? "85vh" :"40vh",
    padding:"10px",
    // width: "35%",
    borderRadius: "0px",
    position: "fixed",
    // top: "70px",
    right: "0px",
    bottom: 0,
    left:0,
    display: mapview ? "block" : "none",
    backgroundColor:"rgba(252, 252, 252, 1)",
    borderTop: "1px solid black",
    boxShadow:"0 0 2px 4px black",
    zIndex:10001
    
    
  };
  const customMapStyles = 
    { height: '100%', width: '100%',borderRadius:"0px"  } 
  
  const BtnContainerStyles ={
    position:"absolute",
    top:"3px",
    right:"2px",
    padding:"13px",
    backgroundColor: "rgba(255, 255, 255, 0)",
    color:"black",
    zIndex:100000000,
    // fontSize: "40px",
    border:"none",
    cursor:"pointer",
    display:"flex",
    gap:"3px",
    



  }
  const btnStyle ={
     backgroundColor: "rgba(255, 255, 255, 1)",
      border:"none",
      cursor:"pointer",
      padding:"5px",
      boxShadow:"0 0 2px black",
      borderRadius:"2px"

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
              <h3>Filter Property</h3>
              <p>Refine Your search criteria</p>
            </div>
            <div className="listings-card-container" style={{ width: "100%" }}>
              {data.map((item, index) => {
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
          <div  style={mapContainerStyles}>
            <div style={BtnContainerStyles} >
           {
            !mapFull ? <button style={btnStyle}  onClick={()=>setMapFull(true)}><OpenInFullIcon/></button> : <button style={btnStyle}  onClick={()=>setMapFull(false)}><CloseFullscreenIcon/></button> 
           } 
            <button style={btnStyle}  onClick={()=>setmapview(false)}><CloseIcon/></button>
            </div>

            <MapComponent
              zoom={13}
              locations={locations}
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
