





import React, { Children, useEffect, useRef, useState } from "react";
import "./lpStyles.css";
import { Link, useNavigate } from "react-router-dom";
import PayToViewModal from "./handlePayment.jsx"
//material ui
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import VerificationBadge from "../Owners/Dashboard/Badge"
import RedVerificationBadge from "./Badge"
//images
import logo from "../../assets/images/logo.png";
import sampleImg from "../../assets/images/header-image.png";
import { useLocation, NavLink } from "react-router-dom";
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
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import ChatIcon from "@mui/icons-material/Chat";
import { data } from "../../data/listingdata";
import { cleanString } from "../../utils/cleanString";
import Modal from "../Owners/Components/Modal"
import axios from "axios";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

function valuetext(value) {
  return `${value}°C`;
}

const center = [4.0511, 9.7679];
const zoom = 12;
export const locations = data.map((item) => {
  return {
    position: [item.location.coordinates.lat, item.location.coordinates.lng],
    title: item.title,
    images: [item.image],
  };
});

const cameroonTowns = [
  "Douala", "Nkongsamba", "Manjo", "Yaoundé", "Akonolinga", "Bafia", "Bafoussam",
  "Dschang", "Bandjoun", "Bamenda", "Bali", "Bafut", "Limbe", "Buea", "Kumba",
  "Bertoua", "Batouri", "Maroua", "Kousséri", "Ngaoundéré", "Banyo", "Ebolowa", "Ambam",
];

export const biuldingTypes = [
  "Apartment", "Guest House", "Hotel", "Modern Room", "Studio",
];

const posibleDuration = [
  "3 - 30 Days", "3 Months", "5 Months ", "7 Months", "10 Months",
  "1 Year", "1 Year, 5 Months", "2 Years", " More Than 3 Years ",
];

export const links = [
  { link: "/", title: "Home", icon: <HomeIcon /> },
  { link: "/profile", title: "Profile", icon: <PersonIcon /> },
  { link: "/user/chat", title: "Chat", icon: <ChatIcon /> },
  { link: "/user/reel", title: "Reels", icon: <VideoLibraryIcon /> },
  { link: "/search-property", title: "Search Properties", icon: <TravelExploreIcon /> },
];

// Re-added the missing Container export
export function Container({ children }) {
  return (
    <div className="container">
      {children}
    </div>
  );
}

function Select({ title, data, onChange, id, value }) {
  return (
    <div>
      <p style={{ margin: "5px" }}>{title}</p>
      <select name={title} className="opt-select" id={id} defaultValue={value} onChange={onChange}>
        {data.map((item, index) => (
          <option key={index} value={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

export function RangeSlider() {
  const [value, setValue] = React.useState([0, 500]);
  const handleChange = (event, newValue) => setValue(newValue);
  return (
    <Box>
      <p> Cost / Fees / Rent / Price</p>
      <Slider value={value} onChange={handleChange} valueLabelDisplay="auto" getAriaValueText={valuetext} className="slider-roll" color="success" />
      <div className="flex-between">
        <div>From :{value[0] * 10}k XFA </div>
        <div>To :{value[1] * 10} k XFA</div>
      </div>
    </Box>
  );
}

export function SideNav() {
  const navigate = useNavigate();
  return (
    <div className="side-nav" id="side-nav" style={{ display: "none" }}>
      <nav className="pages">
        <ul className="side-nav">
          {links.map((item, key) => (
            <Link key={key} to={item.link} className="link">
              <li className={window.location.pathname === item.link ? "on" : ""} onClick={() => navigate(item.link)}>
                {item.icon}
                <div className="title">{item.title}</div>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function BottomTabs() {
  return (
    <nav className="bottom-tabs">
      {links.slice(0, 5).map((item, key) => (
        <NavLink key={key} to={item.link} className={({ isActive }) => `link ${isActive ? "on" : ""}`}>
          <li>{item.icon}</li>
        </NavLink>
      ))}
    </nav>
  );
}

export function Head({ carryOutSearch, user }) {
  const [openit, setopen] = useState(false);
  const check = localStorage.getItem("token") ? true : false;
  const profile = user?.profile ? (
    <img src={user?.profile} alt="" width={50} height={50} className="img-container" />
  ) : (
    <PersonIcon style={{ fontSize: "40px" }} />
  );

  return (
    <div className="lpHead">
      <div className="logo-container">
        <button onClick={() => {
          let nav = document.getElementById("side-nav");
          nav.style.display = nav.style.display === "none" ? "flex" : "none";
        }}>
          <MenuIcon />
        </button>
        <img src={logo} alt="Logo" width={100} height={100} />
      </div>
      <div className="links-container">
        <nav className="pages">
          <ul className="topnav-links flex-row">
            {links.map((item, key) => (
              <li key={key}>
                <NavLink to={item.link} className={({ isActive }) => `link ${isActive ? "on" : "off"}`}>
                  <div className="title">{item.title}</div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="right-top">
        <div className="search-input">
          <SearchIcon />
          <input type="text" className="input-search" id="rxt-search-input" placeholder="Search Location, Property type..." onChange={carryOutSearch} />
        </div>
        {check ? profile : <button className="details-btn loginin" onClick={() => setopen(!openit)}>LogIn </button>}
        {openit && (
          <div className="auth-overlay" onClick={() => setopen(!openit)}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
              <button className="auth-close" onClick={() => setopen(!openit)}>×</button>
              <h2>Welcome</h2>
              <p>Please login or create an account to continue</p>
              <div className="auth-actions">
                <a href="/user/login" className="auth-btn primary">Login / SignUp As A House Seeker</a>
                <a href="/owner/login" className="auth-btn secondary">Login / SignUp As A House Owner</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Header({ carryOutSearch, changeRegion, user }) {
  return (
    <>
      <Head carryOutSearch={carryOutSearch} user={user} />
      <div className="header">
        <div className="header-main">
          <p className="header-caption">Discover Your Perfect Home</p>
          <p className="header-description">Explore verified listings, connect with owners, and find your dream rental effortlessly.</p>
          <div className="search-filter-card">
            <div className="filter-container">
              <Select title="Location" data={cameroonTowns} id={"rxt-location-select"} value={cameroonTowns[0]} onChange={changeRegion} />
              <RangeSlider />
              <Select title="Building Type" data={biuldingTypes} />
              <Select title="Duration Of Stay" data={posibleDuration} />
            </div>
            <button className="search-button">
              <SearchIcon />
              <p>Find My vizits</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ListingsCard({ image, title, location, rent, id, how, user, isVerified }) {
  const [openit, setopen] = useState(false);
  const checkuser = !!user;
  const splted = location.split(/[0#&\(=*]/);
  const result = splted[0] + "  " + (splted[5] ? "Around  " + splted[5] + " " + splted[6] : "");

// alert(user?.email)



const [me, setme] = useState([])
    const [loadme, setloadme] = useState(false)
     const fetchLatestTransaction = async () => {
            try {
                setloadme(true)
                const res = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/user/me/${user.email}`
                );
                if (res.data) {

                    setme(res.data.user)
                }
            } catch (error) {
                console.error("Error fetching latest transaction:", error);

            } finally {
                setloadme(false)
            }
        };
    useEffect(() => {
        if (!user?.email) return;
       
        fetchLatestTransaction()
    }, [user?.email]);


const [Open , setisOpen] = useState(false)
const onClose = ()=>{
  setisOpen(!Open)
}

  return (
    <div className="listings-card">
      <div className="listing-card-img-container">
        {isVerified ? (
          <div className="badge-top-right">
            <VerificationBadge />
            <p>Vizit Verified</p>
          </div>
        ) : (
          <div className="badge-top-right" style={{ background: "rgba(136, 82, 82, 0.85)" }}>
            <RedVerificationBadge />
            <p> Not Vizit Verified</p>
          </div>
        )}
        <img src={image} onClick={() => checkuser ?
      ( me.haspay?
          (window.location = `/property/${id}`) :
          setisOpen(!Open)
      )
          :
           setopen(!openit)
           
           } alt="" width={500} style={{ cursor: "pointer" }} />
      </div>
      <div className="listings-description">
        <p className="listing-title">{title}</p>
        <div className="listing-cost">
          <span className="listing-price-fcfa">{rent.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} XFA </span> /{how}
        </div>
        <div className="location">
          <LocationOnIcon className="icon-xs" />
          <p className="location-literal">{result}</p>
        </div>
        <Link 
  className="details-btn" 
  to={checkuser && me.haspay ? `/property/${id}` : "#"} 
  onClick={(e) => {
    if (!checkuser) {
      // State 1: Not logged in
      e.preventDefault();
      setopen(true);
    } else if (!me.haspay) {
      // State 2: Logged in but hasn't paid
      e.preventDefault();
      setisOpen(true);
    }
    // State 3: Logged in and has paid (navigation happens automatically via 'to')
  }}
>
  View Details
</Link>
        {openit && (
          <div className="auth-overlay" onClick={() => setopen(!openit)}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
              <button className="auth-close" onClick={() => setopen(!openit)}>×</button>
              <h2>Welcome</h2>
              <div className="auth-actions">
                <a href="/user/login" className="auth-btn primary">Login / SignUp As A House Seeker</a>
                <a href="/owner/login" className="auth-btn secondary">Login / SignUp As A House Owner</a>
              </div>
            </div>
          </div>
        )}
      </div>

        { Open &&
     <PayToViewModal userId={me?._id} onClose = {onClose} isOpen={Open} onRefreshUser={fetchLatestTransaction}/>
    }
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
            <a href="http://facebook.com"><FacebookIcon /></a>
            <a href="http://x.com"><XIcon /></a>
            <a href="http://instagram.com"><InstagramIcon /></a>
            <a href="http://linkedin.com"><LinkedInIcon /></a>
          </ul>
        </div>
        <div className="legal-links">
          <h3>Legal</h3>
          <ul className="links">
            <li><Link to=" ">Terms of service</Link></li>
            <li><Link to="">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function SectionHeader({ title, description }) {
  return (
    <>
      <p className="section-title">{title}</p>
      <p style={{ textAlign: "center", color: "#333" }}>{description}</p>
    </>
  );
}

function LandingPage() {
  const role = localStorage.getItem("role");
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listingsData, setListingsData] = useState({ listings: [], locations: [] });

  const fetchAndSortListings = async (rawListings) => {
    try {
      const updatedListings = await Promise.all(
        rawListings.map(async (item) => {
          try {
            const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/me/${item.owner.email}`);
            return { ...item, isVerified: res.data.user?.verified || false };
          } catch (err) {
            return { ...item, isVerified: false };
          }
        })
      );
      return updatedListings.sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0));
    } catch (error) {
      return rawListings;
    }
  };

  useEffect(() => {
    if (role === "owner") {
      window.location.href = "/dashboard";
    } else {
      const initPage = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/decode/token/user`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) setuser(res.data.user);
          }
        } catch (e) { console.error(e); }

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
      initPage();
    }
  }, [role]);

  async function carryOutSearch() {
    let inputTex = cleanString(document.getElementById("rxt-search-input").value);
    if (inputTex === "") {
      const sorted = await fetchAndSortListings(data);
      setListingsData({ listings: sorted, locations: sorted.map(i => ({ position: [i.location.coordinates.lat, i.location.coordinates.lng], title: i.title, images: [i.image] })) });
      return;
    }

    let searchArray = data.filter(item => 
      cleanString(item.location.address).includes(inputTex) ||
      cleanString(item.title).includes(inputTex) ||
      cleanString(item.type).includes(inputTex)
    );

    const sortedSearchResults = await fetchAndSortListings(searchArray);
    setListingsData({
      listings: sortedSearchResults,
      locations: sortedSearchResults.map(item => ({
        position: [item.location.coordinates.lat, item.location.coordinates.lng],
        title: item.title, images: [item.image]
      }))
    });
  }

  const [open, isopen] = useState(false);
  const currentelement = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => isopen(entry.isIntersecting), { threshold: 0.1 });
    if (currentelement.current && !user) observer.observe(currentelement.current);
    return () => observer.disconnect();
  }, [user]);

  return (
    <>
      <Header carryOutSearch={carryOutSearch} changeRegion={() => {}} user={user} />
      <SideNav />
      <SectionHeader title="Vizit Verified Listings" description="Explore Vizit's top verified listings around Cameroon " />
      
      <div className="listings-card-container">
        {loading ? <p>Loading sorted listings...</p> : 
          listingsData.listings.map((item, index) => (
            <ListingsCard
              key={item.listingId || index}
              id={item.listingId}
              image={item.image}
              ownerEmail={item.owner.email}
              title={item.title}
              location={item.location.address}
              rent={item.rent}
              how={item?.how}
              user={user}
              isVerified={item.isVerified}
            />
          ))
        }
      </div>

      <SectionHeader title="Explore Popular Housing Zones" description="Navigate through our interactive map..." />
      <div className="map-container">
        <div className="map-main" ref={currentelement}>
          <MapComponent zoom={zoom} locations={listingsData.locations} center={center} />
        </div>
      </div>
  
      <BottomTabs user={user} />
      <Footer user={user} />
    </>
  );
}

export default LandingPage;