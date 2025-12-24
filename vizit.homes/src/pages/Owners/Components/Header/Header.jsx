import React from "react";
import "../../../LandingPage/lpStyles.css";
import logo from "../../../..//assets/images/logo.png";
import { Link } from "react-router-dom";
//

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import IosShareIcon from "@mui/icons-material/IosShare";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RealEstateAgentIcon from '@mui/icons-material/RealEstateAgent';
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ReviewsIcon from '@mui/icons-material/Reviews';

export const links = [
  {
    link: "/dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    link: "/listings",
    title: "Listings",
    icon: <RealEstateAgentIcon />,
  },
  {
    link: "/chat",
    title: "Messages",
    icon: <ChatIcon />,
  },
  {
    // todo Also needs fixing bro !!!!
    link: "/calender",
    title: "Calender",
    icon: <EventNoteIcon />,
  },
  {
    // todo Also needs fixing bro !!!!
    link: "/appointments",
    title: "Appointments",
    icon: <PendingActionsIcon />,
  },
  {
    link: "/reviews",
    title: "Reviews",
    icon: <ReviewsIcon />,
  },
];
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

export function TopNav() {
  // const [listingsData,setListingsData] = useState({listings : data,locations})

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
                      window.location.pathname === item.link ? "on" : "off"
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
            id="rxt-search-input"
            placeholder="Search Location, Property type, house title "
            // onChange={carryOutSearch}
          />
          {/* </div> */}
        </div>
        <div>{profile}</div>
      </div>
    </div>
  );
}
function Header() {
  return (
    <>
      <TopNav />
      <SideNav />
      <BottomTabs />
    </>
  );
}

export default Header;
