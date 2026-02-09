import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BottomTabs,
  Container,
  Footer,
  Head,
  SideNav,
} from "../LandingPage/LandingPage";
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


import TodayIcon from "@mui/icons-material/Today";
import ScheduleIcon from "@mui/icons-material/Schedule";
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
import PetsIcon from '@mui/icons-material/Pets';
import ParkIcon from '@mui/icons-material/Park';
import toast from "react-hot-toast"
import ReviewRatingSection from "./Review"
//for the rating
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import StarHalfOutlinedIcon from "@mui/icons-material/StarHalfOutlined";
import StarIcon from "@mui/icons-material/Star";
// import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";
import axios from "axios";

export const inputGroupContainerStyles = {
  width: "100%",
  display: "flex",
  gap: "10px",
  alignItems: "center",
  padding: "10px 15px",
  border: "solid 1px #afafafff",
  borderRadius: "5px",
  marginBottom: "20px"
};
export const inputInContainerStyles = {
  border: "none",
  outline: "none",
  accentColor: "green",

};
export const labelStyles = {
  display: "block",
  width: "100%",
  padding: "10px 0",
};
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

export function findIcon(str, size) {
  function check(sStr, Tstr) {
    return cleanString(sStr).includes(Tstr);
  }
  let iicon;

  if (check(str, "air")) {
    iicon = <AcUnitOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "wifi") || check(str, "internet")) {
    iicon = <WifiIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "water") || check(str, "wateravailability")) {
    iicon = <LocalDrinkOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "security") || check(str, "protection")) {
    iicon = <SecurityIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "balcony")) {
    iicon = <BalconyIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "parking")) {
    iicon = (
      <LocalParkingOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />
    );
  } else if (check(str, "garden")) {
    iicon = <YardOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "gym") || check(str, "fitness")) {
    iicon = (
      <FitnessCenterOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />
    );
  } else if (check(str, "fence") || check(str, "gate")) {
    iicon = <FenceIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "furnished") || check(str, "complete")) {
    iicon = <ImagesearchRollerIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "kitchen")) {
    iicon = <KitchenIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "generator") || check(str, "solar")) {
    iicon = <TungstenOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "hotwater") || check(str, "heater")) {
    iicon = <HotTubOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "pool") || check(str, "swimming")) {
    iicon = <PoolOutlinedIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "pet") || check(str, "animal")) {
    iicon = <PetsIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else if (check(str, "near") || check(str, "green")) {
    iicon = <ParkIcon fontSize={size ? size : "large"} className="icons-green" />;
  } else {
    iicon = <CropOriginalIcon fontSize={size ? size : "large"} className="icons-green" />;
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
  const [imageIndex, setImageIndex] = useState(0);
  const [nADate, setNADate] = useState(""); //
  const [nATime, setNATime] = useState(""); //
  let property = data.filter((data) => data.listingId === propertyId);
  let house = property[0];
  const navigate = useNavigate()

  let detailsImageContainer = {};

  function increaseIndex() {
    if (imageIndex === 9) {
      setImageIndex(-1);
    }
    setImageIndex((p) => p + 1);
  }
  function decreaseIndex() {
    if (imageIndex === 0) {
      setImageIndex(10);
    }
    setImageIndex((p) => p - 1);
  }
  // useEffect(()=>{
  //     let publicInterval = setInterval(increaseIndex,5000)
  // })

  const [user, setUser] = useState({})
  const token = localStorage.getItem("token");

  const decodeToken = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    decodeToken();
  }, [decodeToken]);



  const [loadbook, setloadbook] = useState(false)


  const [isAdmin, setisAdmin] = useState(false)
  const BookHome = async () => {
    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    const newAppointment = {
      listingId: propertyId,
      contact: user.name,
      status: "void",
      ownerID: house?.owner?.id,
      userID: user?._id,
      date: nADate,
      time: nATime
    };

    try {
      setloadbook(true);
      const res = await axios.post(
        "https://vizit-backend-hubw.onrender.com/api/apointment",
        newAppointment
      );
      if (res.status == 201) {
        toast.success("Booking done successfully");
        setopen(false);

      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setloadbook(false);
    }
  };


  const [open, setopen] = useState(false)

  const role = localStorage.getItem("role")

  useEffect(() => {
    if (role == "owner") {
      setisAdmin(true)
    } else {
      setisAdmin(false)
    }
  }, [role])
  const [loadsave, setloadsave] = useState(false)

  console.log('====================================');
  console.log("fisrt", user?._id);
  console.log('====================================');

  console.log('====================================');
  console.log("second", propertyId);
  console.log('====================================');
  const savehouse = async (e) => {
    // e.preventDefault();

    try {
      setloadsave(true);

      const res = await axios.put(
        `https://vizit-backend-hubw.onrender.com/api/user/save/house/${user?._id}`,
        {
          houseId: propertyId,
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save house";

      toast.error(message);
      console.error("Save house error:", error);
    } finally {
      setloadsave(false);
    }
  };



  //add user chat ids
  const [loadadd, setloadadd] = useState(false)
  const adduserchat = async (chatId) => {
    if (!chatId) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setloadadd(true);

      // 1️⃣ Add chat to logged-in user
      const resUser = await axios.put(
        `https://vizit-backend-hubw.onrender.com/api/user/add/chat/id/${userId}`,
        { chatId }
      );

      // 2️⃣ Add chat to owner / second user
      const resOwner = await axios.put(
        `https://vizit-backend-hubw.onrender.com/api/owner/add/chat/id/${chatId}`,
        { chatId: userId }
      );

      // 3️⃣ Success handling
      if (resUser.status === 200 && resOwner.status === 200) {
        toast.success("Chat opened successfully");
        navigate(`/user/chat?auth=${chatId}`);
      }

    } catch (error) {
      console.error("Add chat error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to open chat"
      );
    } finally {
      setloadadd(false);
    }
  };




  //start

  const [usern, setusern] = useState("")
  const [myprofile, setmyprofile] = useState("")
  // get users by thier email
  useEffect(() => {
    if (!house?.owner?.email) return;
    let isMounted = true;

    const fetchusers = async () => {
      try {


        const res = await axios.get(
          `https://vizit-backend-hubw.onrender.com/api/user/me/${house?.owner?.email}`
        );

        if (!isMounted) return;

        setusern(res.data?.user?.name || "");
        setmyprofile(res.data?.user?.profile || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchusers();

    return () => {
      isMounted = false;
    };
  }, [house?.owner?.email]);


  //stop
  return (
    <div>


      <Head />
      <SideNav />
      <Container>
        <div className="details-main" style={{ display: "flex" }}>



          <div style={{ flex: "85%" }}>
            <div
              className="property-details-image-container"
              style={{
                // padding:"20px",
                borderRadius: "20px",
                backgroundImage: `url(${imageIndex === 0 ? house.image : house.images[imageIndex]
                  })`,
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
                  {data[0].images.map((image, index) => {
                    return (
                      <button
                        className={`dots `}
                        key={index}
                        style={{
                          opacity: index === imageIndex ? "1" : ".4",
                          display: "block",
                        }}
                        onClick={() => {
                          setImageIndex(index);
                        }}
                      ></button>
                    );
                  })}
                </div>
              </div>
            </div>
            <h2 className="details-sub-heading">{house.title}</h2>
            <h4 className="details-location">
              <LocationOnIcon />
              {
                (() => {
                  const parts = house.location.address?.split(/[0#&\(=*]/) || [];

                  const firstPart = parts[0]?.replace(/^0+/, ""); // remove leading zeros if any
                  const aroundPart = parts[5] ? "  Around " + parts[5] : "";
                  const extraPart = parts[6] ? " " + parts[6] : "";

                  return firstPart + aroundPart + extraPart;
                })()
              }

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



            <div className="rem block">
              <div class="facebook-panel">
                <div class="fb-header"></div>

                <div class="user-section">
                  <div class="fb-avatar">
                    <img src={house?.owner?.profile} alt="" />
                    {/* <i class="fas fa-user"></i> */}
                  </div>

                  <div class="fb-user-info">
                    <div class="fb-user-name">
                      {house?.owner?.name}

                      <span class="verified-text">
                        <div class="fb-verified">
                          <i class="fas fa-check"></i>
                        </div>
                      </span>
                    </div>
                    <div class="fb-user-subtitle">{house?.owner?.email}</div>
                  </div>
                </div>

                <div class="fb-menu">
                  {/* <a onClick={() => setopen(true)} class="fb-menu-item active">
                    <div class="fb-menu-icon">
                      <i class="far fa-calendar-check"></i>
                    </div>
                    <div class="fb-menu-text">Book a Visit</div>
                  </a> */}

                  <a onClick={() => savehouse()} class="fb-menu-item active">
                    <div class="fb-menu-icon">
                      <i class="far fa-calendar-check"></i>
                    </div>
                    <div class="fb-menu-text">{loadsave ? "saving the list.." : "Save This Listing"}</div>
                  </a>

                  <a onClick={() => adduserchat(house?.owner?.id)}
                    class="fb-menu-item">
                    <div class="fb-menu-icon">
                      <i class="fas fa-comment-dots"></i>
                    </div>
                    <div class="fb-menu-text">{loadadd ? "Openning Chat.." : "Chat with Owner"}</div>
                  </a>
                </div>

                <button class="fb-button primary" onClick={() => setopen(true)}>Book a Visit</button>
              </div>




              {
                open &&
                <div className="auth-overlay" onClick={() => setopen(!open)}>
                  <div
                    className="auth-modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="auth-close" onClick={() => setopen(!open)}>
                      ×
                    </button>

                    <h2>Book For This House</h2>
                    <p>If You Are Interest Please Click On The Book Button Bellow</p>

                    <label htmlFor="" style={labelStyles}>
                      Date of appointment
                    </label>
                    <div style={inputGroupContainerStyles}>
                      <TodayIcon style={{ color: "#035e4aff" }} />
                      <input
                        type="date"
                        style={inputInContainerStyles}
                        value={nADate}
                        onChange={(e) => setNADate(e.target.value)}
                      />
                    </div>
                    <label htmlFor="" style={labelStyles}>
                      Time of appointment
                    </label>
                    <div style={inputGroupContainerStyles}>
                      <ScheduleIcon style={{ color: "#035e4aff" }} />
                      <input
                        type="time"
                        style={inputInContainerStyles}
                        value={nATime}
                        onChange={(e) => setNATime(e.target.value)}
                      />
                    </div>
                    <div className="auth-actions">
                      <button
                        type="button"
                        className="auth-btn primary"
                        style={{ border: "none", outline: "none" }}
                        onClick={BookHome}
                        disabled={loadbook}
                      >
                        {loadbook ? "Placing Your Booking..." : "Book This House Now"}

                      </button>


                      <a onClick={() => adduserchat(house?.owner?.id)} className="auth-btn secondary" style={{ cursor: "pointer" }}>
                        {loadadd ? "Opening Chat.." : "Chat With Owner"}
                      </a>
                    </div>
                  </div>
                </div>
              }
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


            {
              !user ?

                <div className="description-card">
                  <h4 className="details-sub-heading">Ratings &amp; Reviews</h4>
                  <div className="ratings-and-text-title">
                    <Ratings
                      method="get"
                      count={house.reviews.overallRating}
                      size={window.innerWidth >= 425 ? "large" : "medium"}
                    />
                    <p className="rating-overall">
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
                                backgroundImage: `url(${!entry.profileImg
                                  ? defaultProfile
                                  : entry.profileImg
                                  })`,
                              }}
                            ></div>
                            <div className="name-and-rating">
                              <p>{entry.name}</p>
                              <Ratings
                                method="get"
                                count={entry.rating}
                                size="small"
                              />
                            </div>
                          </div>
                          <div className="comment-content">{entry.comment}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                :

                <div className="description-card">
                  <ReviewRatingSection
                    propertyId={propertyId}
                    currentUser={user}
                    isAdmin={isAdmin} />
                </div>

            }



          </div>

          <div className="rem">
            <div class="facebook-panel">
              <div class="fb-header"></div>

              <div class="user-section">
                <div class="fb-avatar">
                  <img src={myprofile} alt="" />
                  {/* <i class="fas fa-user"></i> */}
                </div>

                <div class="fb-user-info">
                  <div class="fb-user-name">
                    {usern}

                    <span class="verified-text">
                      <div class="fb-verified">
                        <i class="fas fa-check"></i>
                      </div>
                    </span>
                  </div>
                  <div class="fb-user-subtitle">{house?.owner?.email}</div>
                </div>
              </div>

              <div class="fb-menu">
                {/* <a onClick={() => setopen(true)} class="fb-menu-item active">
                  <div class="fb-menu-icon">
                    <i class="far fa-calendar-check"></i>
                  </div>
                  <div class="fb-menu-text">Book a Visit</div>
                </a> */}

                <a onClick={() => savehouse()} class="fb-menu-item active">
                  <div class="fb-menu-icon">
                    <i class="far fa-calendar-check"></i>
                  </div>
                  <div class="fb-menu-text">{loadsave ? "saving the list.." : "Save This Listing"}</div>
                </a>

                <a onClick={() => adduserchat(house?.owner?.id)} class="fb-menu-item">
                  <div class="fb-menu-icon">
                    <i class="fas fa-comment-dots"></i>
                  </div>
                  <div class="fb-menu-text">{loadadd ? "Openning Chat.." : "Chat with Owner"}</div>
                </a>
              </div>

              <button class="fb-button primary" onClick={() => setopen(true)}>Book a Visit</button>
            </div>




            {
              open &&
              <div className="auth-overlay" onClick={() => setopen(!open)}>
                <div
                  className="auth-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="auth-close" onClick={() => setopen(!open)}>
                    ×
                  </button>

                  <h2>Book For This House</h2>
                  <p>If You Are Interest Please Click On The Book Button Bellow</p>

                  <label htmlFor="" style={labelStyles}>
                    Date of appointment
                  </label>
                  <div style={inputGroupContainerStyles}>
                    <TodayIcon style={{ color: "#035e4aff" }} />
                    <input
                      type="date"
                      style={inputInContainerStyles}
                      value={nADate}
                      onChange={(e) => setNADate(e.target.value)}
                    />
                  </div>
                  <label htmlFor="" style={labelStyles}>
                    Time of appointment
                  </label>
                  <div style={inputGroupContainerStyles}>
                    <ScheduleIcon style={{ color: "#035e4aff" }} />
                    <input
                      type="time"
                      style={inputInContainerStyles}
                      value={nATime}
                      onChange={(e) => setNATime(e.target.value)}
                    />
                  </div>
                  <div className="auth-actions">
                    <button
                      type="button"
                      className="auth-btn primary"
                      style={{ border: "none", outline: "none" }}
                      onClick={BookHome}
                      disabled={loadbook}
                    >
                      {loadbook ? "Placing Your Booking..." : "Book This House Now"}
                    </button>
                    <a onClick={() => adduserchat(house?.owner?.id)} className="auth-btn secondary" style={{ cursor: "pointer" }}>
                      {loadadd ? "Opening Chat.." : " Chat With Owner"}
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>



        </div>

        <button className="start-discussion-with-owner-button" onClick={() => setopen(true)} style={{}}>
          <div class="fb-menu-icon shine">
            <i class="fas fa-comment-dots"></i>
          </div>
        </button>
      </Container>
      <BottomTabs></BottomTabs>
      <Footer />
    </div>
  );
}

export default PropertyDetails;
