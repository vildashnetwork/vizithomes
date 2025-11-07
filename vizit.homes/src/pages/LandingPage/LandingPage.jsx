import React, { Children } from "react";
import "./lpStyles.css";
import { Link } from "react-router-dom";
//material ui
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}
//images
import logo from "../../assets/images/logo.png";
import sampleImg from "../../assets/images/header-image.png";

//Icons
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { MapComponent } from "./MapComponent";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import IosShareIcon from "@mui/icons-material/IosShare";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
// import PersonIcon from '@mui/icons-material/Person';
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import ChatIcon from "@mui/icons-material/Chat";
import { data } from "../../data/listingdata";
import { image } from "ionicons/icons";

//Test Data
//?=========
// ===============================================================
///

const center = [4.0511, 9.7679];
const zoom = 12;
const locations = 
  data.map((item) => {
    return {
      position: [item.location.coordinates.lat, item.location.coordinates.lng],
      // position: [4.0714, 9.6818],
      title: item.title,
      images: [item.image],
    };
  })
;

 
const cameroonTowns = [
  "Douala",
  "Nkongsamba",
  "Manjo",
  "Yaoundé",
  "Akonolinga",
  "Bafia",
  "Bafoussam",
  "Dschang",
  "Bandjoun",
  "Bamenda",
  "Bali",
  "Bafut",
  "Limbe",
  "Buea",
  "Kumba",
  "Bertoua",
  "Batouri",
  "Maroua",
  "Kousséri",
  "Ngaoundéré",
  "Banyo",
  "Ebolowa",
  "Ambam",
];
const biuldingTypes = [
  "Apartment",
  "Guest House",
  "Hotel",
  "Modern Room",
  "Studio",
  "3 months",
  "5 months ",
];
const posibleDuration = [
  "3 - 30 Days",
  "3 Months",
  "5 Months ",
  "7 Months",
  "10 Months",
  "1 Year",
  "1 Year, 5 Months",
  "2 Years",
  " More Than 3 Years ",
];
export const links = [
  {
    link: "/home",
    title: "Home",
    icon: <HomeIcon />,
  },
  {
    link: "/search-property",
    title: "Search Properties",
    icon: <TravelExploreIcon />,
  },
  {
    link: "/user/login",
    title: "Profile",
    icon: <PersonIcon />,
  },
  {
    link: "/home",
    title: "Chat",
    icon: <ChatIcon />,
  },
];

function Select({ title, data }) {
  return (
    <div>
      <p style={{ margin: "5px" }}>{title}</p>
      <select name={title} className="opt-select">
        {data.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function RangeSlider() {
  const [value, setValue] = React.useState([0, 500]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <p> Cost / Fees / Rent / Price</p>
      <Slider
        // getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        className="slider-roll"
        // classes={"slider"}
        color="success"
      />
      <div className="flex-between">
        {" "}
        <div>From :{value[0] * 10}k XFA </div>
        <div>To :{value[1] * 10} k XFA</div>
      </div>
      {/* <p>To :{value[1]}XFA</p> */}
    </Box>
  );
}
export function SideNav() {
  return (
    <div className="side-nav" id="side-nav" style={{ display: "none" }}>
      <nav className="pages">
        <ul className="side-nav">
          {links.map((item, key) => {
            return (
              <Link key={key} to={item.link} className="link">
                <li
                  className={window.location.pathname === item.link ? "on" : ""}
                  onClick={() => {
                    window.location.pathname = item.link;
                  }}
                >
                  {item.icon}
                  <div className="title">{item.title}</div>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
export function BottomTabs() {
  return (
    <nav className="bottom-tabs">
      {links.map((item, key) => {
        return (
          <Link key={key} to={item.link} className="link">
            <li
              className={window.location.pathname === item.link ? "on" : ""}
              onClick={() => {
                window.location.pathname = item.link;
              }}
            >
              {item.icon}
              {/* <div className="title">{item.title}</div> */}
            </li>
          </Link>
        );
      })}
    </nav>
  );
}
export function Head() {
  const profile = logo ? (
    <img src={logo} alt="" width={50} height={50} className="img-container" />
  ) : (
    <PersonIcon style={{ fontSize: "40px" }} />
  );
  return (
    <div className="lpHead">
      <div className="logo-container">
        <button
          onClick={() => {
            let nav = document.getElementById("side-nav");
            if (nav.style.display == "none") {
              nav.style.display = "flex";
            } else {
              nav.style.display = "none";
            }
          }}
        >
          <MenuIcon />
        </button>
        <img
          src={logo}
          alt="What will show if image fails to load"
          width={100}
          height={100}
          // style={{ marginTop: -32 }}
        />
      </div>

      <div className="links-container">
        <nav className="pages">
          <ul className="topnav-links flex-row">
            {links.map((item, key) => {
              return (
                <Link key={key} to={item.link} className="link">
                  <li
                    className={
                      window.location.pathname === item.link ? "on" : ""
                    }
                    onClick={() => {
                      window.location.pathname = item.link;
                    }}
                  >
                    <div className="title">{item.title}</div>
                  </li>
                </Link>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="right-top">
        <div className="search-input">
          <SearchIcon />
          {/* <div className = "img-container"> */}

          <input
            type="text"
            className="input-search"
            placeholder="Search Location, Property type, "
          />
          {/* </div> */}
        </div>
        <div>{profile}</div>
      </div>
    </div>
  );
}
export function Container({ children }) {
  return (
    <div className="container">
      {children}
      {/*divs */}
    </div>
  );
}
export function Header() {
  return (
    <>
      <Head />
      <div className="header">
        <div className="header-main">
          <p className="header-caption">Discover Your Perfect Home</p>
          <p className="header-description">
            Explore verified listings, connect with owners, and find your dream
            rental effortlessly.
          </p>
          <div className="search-filter-card">
            <div className="filter-container">
              <Select title="Location" data={cameroonTowns} />
              <RangeSlider />
              <Select title="Building Type" data={biuldingTypes} />
              <Select title="Duration Of Stay" data={posibleDuration} />
              {/* <Select title = "Location" data ={cameroonTowns}/> */}
            </div>

            <button className="search-button">
              <SearchIcon></SearchIcon>
              <p>Find My vizits</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export function ListingsCard({ image, title, location, rent }) {
  return (
    <div className="listings-card">
      <div className="listing-card-img-container">
        <img src={image} alt="" width={500} />
      </div>
      <div className="listings-description">
        <p className="listing-title">{title}</p>
        <div className="listing-cost">
          <span className="listing-price-fcfa">{rent}</span> /month
        </div>
        <div className="location">
          <LocationOnIcon className="icon-xs" />
          <p className="location-literal"> {location}</p>
        </div>
        <button className="details-btn">View Details</button>
      </div>
    </div>
  );
}
export function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="vizit-socials">
          <h3>Discover your next home with vizit.</h3>
          <ul>
            <a href="http://facebook.com">
              <FacebookIcon />
            </a>
            <a href="http://x.com">
              <XIcon />
            </a>
            <a href="http://instagram.com">
              <InstagramIcon />
            </a>
            <a href="http://linkedin.com">
              <LinkedInIcon />
            </a>
          </ul>
        </div>
        <div className="company-links">
          <h3>Company</h3>
          <ul className="links">
            <li>
              <Link to=" ">About Us</Link>
            </li>
            <li>
              <Link to="">Careers</Link>
            </li>
            <li>
              <Link to="">Press</Link>
            </li>
          </ul>
        </div>
        <div className="resources-links">
          <h3>Resources</h3>
          <ul className="links">
            <li>
              <Link to=" ">Blog</Link>
            </li>
            <li>
              <Link to="">FAQ</Link>
            </li>
            <li>
              <Link to="">Support</Link>
            </li>
          </ul>
        </div>
        <div className="legal-links">
          {/* legal */}
          <h3>Legal</h3>
          <ul className="links">
            <li>
              <Link to=" " style={{ whiteSpace: "nowrap" }}>
                Terms of service
              </Link>
            </li>
            <li>
              <Link to="">Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div className="advertiseme-links">
          <h3>Spread the Word</h3>
          <button className="share-btn">
            <IosShareIcon />
            Share Vizit
          </button>
        </div>
      </div>
    </footer>
  );
}
function SectionHeader({ title, description }) {
  return (
    <>
      <p className="section-title">{title}</p>
      <p style={{ textAlign: "center", color: "#333" }}>{description}</p>
    </>
  );
}
function LandingPage() {
  return (
    <>
      <Header></Header>
      <SideNav />
      <SectionHeader
        title="Vizit Verified Listings"
        description="Explore Vizit's top verified listings around Cameroon "
      />

      <div className="listings-card-container">
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
      <SectionHeader
        title="Explore Popular Housing Zones"
        description="Navigate through our interactive map to discover prime locations and their available properties in Douala. "
      />
      <div className="map-container">
        <div className="map-main">
          <MapComponent zoom={zoom} locations={locations} center={center} />
        </div>
      </div>
      <BottomTabs />
      <Footer />
    </>
    
  );
  
}

export default LandingPage;
