// import React, { useEffect, useState } from "react";
// import "../../../LandingPage/lpStyles.css";
// import logo from "../../../..//assets/images/logo.png";
// import { Link } from "react-router-dom";
// import { NavLink } from "react-router-dom";
// //

// import SearchIcon from "@mui/icons-material/Search";
// import PersonIcon from "@mui/icons-material/Person";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import XIcon from "@mui/icons-material/X";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import IosShareIcon from "@mui/icons-material/IosShare";
// import MenuIcon from "@mui/icons-material/Menu";
// import HomeIcon from "@mui/icons-material/Home";
// import TravelExploreIcon from "@mui/icons-material/TravelExplore";
// import ChatIcon from "@mui/icons-material/Chat";
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import EventNoteIcon from '@mui/icons-material/EventNote';
// import RealEstateAgentIcon from '@mui/icons-material/RealEstateAgent';
// import PendingActionsIcon from "@mui/icons-material/PendingActions";
// import ReviewsIcon from '@mui/icons-material/Reviews';
// import axios from "axios";

// export const links = [
//   {
//     link: "/dashboard",
//     title: "Dashboard",
//     icon: <DashboardIcon />,
//   },
//   {
//     link: "/listings",
//     title: "Listings",
//     icon: <RealEstateAgentIcon />,
//   },
//   {
//     link: "/chat",
//     title: "Messages",
//     icon: <ChatIcon />,
//   },
//   {
//     // todo Also needs fixing bro !!!!
//     link: "/calender",
//     title: "Calender",
//     icon: <EventNoteIcon />,
//   },
//   {
//     // todo Also needs fixing bro !!!!
//     link: "/appointments",
//     title: "Appointments",
//     icon: <PendingActionsIcon />,
//   },
//   {
//     link: "/reviews",
//     title: "Reviews",
//     icon: <ReviewsIcon />,
//   },
// ];
// export function SideNav() {
//   return (
//     <div className="side-nav" id="side-nav" style={{ display: "none" }}>
//       <nav className="pages">
//         <ul className="side-nav">
//           {links.map((item, key) => (
//             <NavLink
//               key={key}
//               to={item.link}
//               className={({ isActive }) =>
//                 `link ${isActive ? "on" : "off"}`
//               }
//             >
//               <li>
//                 <div className="title">{item.title}</div>
//               </li>
//             </NavLink>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// }
// export function BottomTabs() {
//   return (
//     <nav className="bottom-tabs">
//       {links.map((item, key) => {
//         return (
//           <Link key={key} to={item.link} className="link">
//             <li
//               className={window.location.pathname === item.link ? "on" : ""}
//               onClick={() => {
//                 window.location.pathname = item.link;
//               }}
//             >
//               {item.icon}
//               {/* <div className="title">{item.title}</div> */}
//             </li>
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }

// export function TopNav({ search }) {
//   // const [listingsData,setListingsData] = useState({listings : data,locations})


//   const [user, setuser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const decoding = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         if (!token) {
//           console.warn("No token found")
//           setLoading(false)
//           return
//         }

//         const data = await axios.get(
//           `https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         )
//         if (data.status === 200) {
//           setuser(data.data.res)
//           console.log(loading ? "loading..." : user);

//         }
//       } catch (error) {
//         console.error("Failed to decode token:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     decoding()
//   }, [])
//   const profile = logo ? (
//     <img src={user?.profile} alt="" width={50} height={50} className="img-container" />
//   ) : (
//     <PersonIcon style={{ fontSize: "40px" }} />
//   );
//   return (
//     <div className="lpHead">
//       <div className="logo-container">
//         <button
//           onClick={() => {
//             let nav = document.getElementById("side-nav");
//             if (nav.style.display == "none") {
//               nav.style.display = "flex";
//             } else {
//               nav.style.display = "none";
//             }
//           }}
//         >
//           <MenuIcon />
//         </button>
//         <img
//           src={logo}
//           alt="What will show if image fails to load"
//           width={100}
//           height={100}

//         // style={{ marginTop: -32 }}
//         />
//       </div>

//       <div className="links-container">
//         <nav className="pages">
//           <ul className="topnav-links flex-row">
//             {links.map((item, key) => {
//               return (
//                 <Link key={key} to={item.link} className="link">
//                   <li
//                     className={
//                       window.location.pathname === item.link ? "on" : "off"
//                     }
//                     onClick={() => {
//                       window.location.pathname = item.link;
//                     }}
//                   >
//                     <div className="title">{item.title}</div>
//                   </li>
//                 </Link>
//               );
//             })}
//           </ul>
//         </nav>
//       </div>
//       <div className="right-top"
//         style={
//           {
//             justifyContent: "flex-end",
//             paddingInlineEnd: "40px"
//           }
//         }
//       >
//         {
//           search &&
//           <div className="search-input">
//             <SearchIcon />
//             {/* <div className = "img-container"> */}

//             <input
//               type="text"
//               className="input-search"
//               id="rxt-search-input"
//               placeholder="Search Location, Property type, house title "
//             // onChange={carryOutSearch}
//             />
//             {/* </div> */}
//           </div>
//         }

//         <div>{profile}</div>
//       </div>
//     </div>
//   );
// }
// function Header() {
//   return (
//     <>
//       <TopNav />
//       <SideNav />
//       <BottomTabs />
//     </>
//   );
// }

// export default Header;
















import React, { useEffect, useState } from "react";
import "../../../LandingPage/lpStyles.css";
import logo from "../../../../assets/images/logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ReviewsIcon from "@mui/icons-material/Reviews";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import axios from "axios";


/* ---------------- LINKS CONFIG ---------------- */

export const links = [
  { link: "/dashboard", title: "Dashboard", icon: <DashboardIcon /> },


  { link: "/listings", title: "Listings", icon: <RealEstateAgentIcon /> },
  // { link: "/calender", title: "Calendar", icon: <EventNoteIcon /> },
  { link: "/appointments", title: "Appointments", icon: <PendingActionsIcon /> },
  { link: "/reels", title: "Reels", icon: <VideoLibraryIcon /> },
  { link: "/chat", title: "Messages", icon: <ChatIcon /> },
  { link: "/reviews", title: "Reviews", icon: <ReviewsIcon /> },

];

/* ---------------- SIDE NAV ---------------- */

export function SideNav() {
  return (
    <div className="side-nav" id="side-nav" style={{ display: "none" }}>
      <nav className="pages">
        <ul className="side-nav">
          {links.map((item, key) => (
            <li key={key}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `link ${isActive ? "on" : "off"}`
                }
              >
                <div className="title">{item.title}</div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/* ---------------- BOTTOM TABS ---------------- */

export function BottomTabs() {
  return (
    <nav className="bottom-tabs">
      {links.map((item, key) => (
        <NavLink
          key={key}
          to={item.link}
          className={({ isActive }) => `link ${isActive ? "on" : ""}`}
        >
          <li>{item.icon}</li>
        </NavLink>
      ))}
    </nav>
  );
}

/* ---------------- TOP NAV ---------------- */

export function TopNav({ search }) {

  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;

    const targetId = hash.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [hash]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    const decoding = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await axios.get(
          "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200) setUser(res.data.res);
      } catch (err) {
        console.error("Token decode failed:", err);
      } finally {
        setLoading(false);
      }
    };

    decoding();
  }, []);

  const profile = user?.profile ? (
    <img
      src={user.profile}
      alt="profile"
      width={50}
      height={50}
      className="img-container"
      style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard#profile")} />
  ) : (
    <PersonIcon style={{ fontSize: 40 }} />
  );


  return (
    <div className="lpHead">
      <div className="logo-container">
        <button
          onClick={() => {
            const nav = document.getElementById("side-nav");
            nav.style.display = nav.style.display === "flex" ? "none" : "flex";
          }}
        >
          <MenuIcon />
        </button>

        <img src={logo} alt="Logo" width={100} height={100} />
      </div>

      <div className="links-container">
        <nav className="pages">
          <ul className="topnav-links flex-row">
            {links.map((item, key) => (
              <li key={key}>
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `link ${isActive ? "on" : "off"}`
                  }
                >
                  <div className="title">{item.title}</div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className="right-top"
        style={{ justifyContent: "flex-end", paddingInlineEnd: "40px" }}
      >
        {search && (
          <div className="search-input">
            <SearchIcon />
            <input
              type="text"
              className="input-search"
              placeholder="Search Location, Property type, house title"
            />
          </div>
        )}

        <div>{profile}</div>
      </div>
    </div>
  );
}

/* ---------------- HEADER ---------------- */

export default function Header() {
  return (
    <>
      <TopNav />
      <SideNav />
      <BottomTabs />
    </>
  );
}
