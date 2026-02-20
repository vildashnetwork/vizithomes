







import React, { useEffect, useState } from "react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReferralInterface from "./Referal"
import {
  BottomTabs,
  Container,
  Footer,
  Head,
  SectionHeader,
  SideNav,
} from "../LandingPage/LandingPage";
import ReelsPage from "./OwnerAddreels"
import "./spStyles.css";
import { data } from "../../data/listingdata";
import { Link, useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Ratings } from "../PropertyDetails/PropertyDetails";
import axios from "axios";
import toast from "react-hot-toast"
import ProfilePanel from "./Profile"

/* =====================================================
   SAVE LISTING CARD COMPONENT
===================================================== */
function SaveListingCard({ img, title, location, price, id }) {
  const navigate = useNavigate();
  const [lloadremove, setloadremove] = useState(false);

  const deletesaved = async (propId) => {
    const confirmed = window.confirm("Are you sure you want to remove this property from saved listings?");
    if (!confirmed) return;

    try {
      setloadremove(true);
      const UserId = localStorage.getItem("userId");
      const res = await axios.put(`https://vizit-backend-hubw.onrender.com/api/user/remove/saved/house/${UserId}`, {
        houseId: propId
      });
      if (res.status === 200) {
        toast.success("House removed from saved");
        // Navigation here might be optional if you want to stay on profile
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to remove house");
      console.error(error);
    } finally {
      setloadremove(false);
    }
  };

  return (
    <div style={{ minWidth: "150px" }} className="saved-listing-card">
      <img src={img} alt={title} width={100} className="saved-listing-card-img" />
      <div className="saved-listing-card-description">
        <h4>{title}</h4>
        <p style={{ display: "flex", alignItems: "center", color: "#333333a1", textShadow: "0 0 1px #00000054" }}>
          <LocationOnOutlinedIcon fontSize="small" style={{ color: "#007e77ff" }} />
          {location.replace("Cameroon", "")}
        </p>
        <p className="saved-listing-price-tag">{price}/ Month</p>
        <div className="btns" style={{ display: "flex", justifyContent: "space-between" }}>
          <Link className="details-btn-saved-listing" to={`/property/${id}`}>View Details</Link>
          <button className="remove-saved-listing" style={{ cursor: "pointer" }} onClick={() => deletesaved(id)}>
            {lloadremove ? "removing.." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   TAB NAVIGATOR COMPONENT
===================================================== */
function TabNavigator({ buttonList, callback, array }) {
  return (
    <div className="tab-navigator-container" style={{ position: "sticky" }}>
      {buttonList.map((buttonObj, key) => (
        <button
          key={key}
          style={{
            backgroundColor: buttonObj.style ? "#00474DFF" : "white",
            color: buttonObj.style ? "white" : "",
            fontSize: "1.1em",
          }}
          onClick={() => {
            let newArray = array.map((_, i) => i === key);
            callback(newArray);
          }}
        >
          <span className="do-not-show">{buttonObj.title}</span>
        </button>
      ))}
    </div>
  );
}

/* =====================================================
   MAIN SEEKER PROFILE COMPONENT
===================================================== */
function SeekerProfile() {
  const [currentNavigation, setCurrentNavigation] = useState([true, false, false]);
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mybalance, setmybalance] = useState(null);
  const [loadme, setloadme] = useState(false);
  const [showme, setshowme] = useState(localStorage.getItem("showme") === "true");
  const [sampleAppointmentData, setsampleAppointmentData] = useState([]);
  const [HouseIds, setHouseIds] = useState([]);
  const [filteredHouse, setFilteredHouse] = useState([]);
  const [onlyspecific, setOnlyspecific] = useState(null);
  const [loaddelete, setloaddelte] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [loadsave, setloadsave] = useState(false);

  const token = localStorage.getItem("token");

  // Sync eye-visibility preference
  useEffect(() => {
    localStorage.setItem("showme", showme);
  }, [showme]);

  /* 1. Fetch Appointments */
  const fetchapointment = async (userId) => {
    try {
      const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/apointment/user/${userId}`);
      if (res.status === 200) {
        setsampleAppointmentData(res.data);
        // Find property details for the first appointment for UI display
        if (res.data.length > 0) {
          const filtered = data.find(item => item.listingId === res.data[0]?.listingId);
          setOnlyspecific(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  /* 2. Fetch Saved Houses */
  const savedhouses = async (userId) => {
    try {
      setloadsave(true);
      const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/saved/houses/${userId}`);
      if (res.status === 200) {
        const ids = res.data.savedHouses || [];
        setHouseIds(ids);
        // Filter local data based on retrieved IDs
        const filtered = data.filter((item) => ids.includes(item.listingId));
        setFilteredHouse(filtered);
      }
    } catch (error) {
      console.error("Error fetching saved houses:", error);
    } finally {
      setloadsave(false);
    }
  };

  /* 3. Main Initialization Logic */
  useEffect(() => {
    const initializeData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setloadme(true);

        // A. Decode Token
        const decodeRes = await axios.get(
          "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (decodeRes.status === 200) {
          const userData = decodeRes.data.user;
          setuser(userData);
          console.log("user", userData)

          // B. Fetch Full Profile & Balance
          const profileRes = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/me/${userData.email}`);
          if (profileRes.status === 200) {
            setmybalance(profileRes.data.user);

          }

          // C. Trigger dependent data fetches
          await Promise.all([
            fetchapointment(userData._id),
            savedhouses(userData._id)
          ]);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        if (error.response?.status === 401) toast.error("Session expired. Please login again.");
      } finally {
        setLoading(false);
        setloadme(false);
      }
    };

    initializeData();
  }, [token]);

  /* Action: Delete Appointment */
  const deleteapp = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;
    try {
      setloaddelte(true);
      const res = await axios.delete(`https://vizit-backend-hubw.onrender.com/api/apointment/${id}`);
      if (res.status === 200) {
        toast.success("Deleted successfully");
        fetchapointment(user._id);
      }
    } catch (error) {
      toast.error("Error deleting appointment");
    } finally {
      setloaddelte(false);
    }
  };

  /* Action: Refresh Balance Logic */
  const handleRefresh = async () => {
    if (refresh) return;
    setrefresh(true);
    try {
      await axios.get("https://vizit-backend-hubw.onrender.com/api/reconcile-payments");
      await axios.post(`https://vizit-backend-hubw.onrender.com/api/credit-user/${user?.email}`);
      const updatedUser = await axios.get(`https://vizit-backend-hubw.onrender.com/api/user/me/${user?.email}`);
      setmybalance(updatedUser.data?.user);
      toast.success("Balance Updated");
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setrefresh(false);
    }
  };

  /* Component: Transaction Comparison */
  const TransactionComparison = () => {
    const payments = mybalance?.paymentprscribtion || [];
    if (payments.length < 2) return null;

    const sorted = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latest = sorted[0];
    const previous = sorted[1];
    const percentChange = (((latest.amount - previous.amount) / previous.amount) * 100).toFixed(0);

    return (
      <p className={percentChange < 0 ? "bad" : "good"}>
        {percentChange < 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
        <span className="count-value">{percentChange > 0 ? "+" : ""}{percentChange}%</span>
        vs last transaction
      </p>
    );
  };

  return (
    <>
      <Head user={user} />
      <SideNav />
      <Container>
        <SectionHeader
          title={"Seeker Profile Dashboard"}
          description={"Manage Your saved properties, track your reviewing appointments and Manage Your feedback."}
        />
        <ReelsPage />

        <div className="dash-card-container">
          <div className="dc">
            <div className="dc-top">
              <p>Total Pro Balance</p>
              <div className="dc-icon-cont" style={{ cursor: "pointer" }} onClick={handleRefresh}>
                {refresh ? "..." : <ion-icon name="refresh-outline"></ion-icon>}
              </div>
            </div>
            <div className="count" style={{ fontSize: "2em" }}>
              XAF {showme ? (loadme ? "..." : mybalance?.totalBalance || 0) : "****"}
              <span onClick={() => setshowme(!showme)} style={{ marginLeft: "12px", cursor: "pointer" }}>
                {showme ? <ion-icon name="eye-outline"></ion-icon> : <ion-icon name="eye-off-outline"></ion-icon>}
              </span>
            </div>
            <div className="trend">
              <TransactionComparison />
            </div>
          </div>
        </div>

        <div className="skp-flex-row">
          <TabNavigator
            array={currentNavigation}
            callback={setCurrentNavigation}
            buttonList={[
              { title: "Saved Listings", style: currentNavigation[0] },
              { title: "Appointments", style: currentNavigation[1] },
            ]}
          />
        </div>

        <div className="hoho" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <main style={{
            padding: "30px 10px", borderTop: "solid 2px #333", width: "80vw",
            display: currentNavigation[0] ? "grid" : "block",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "30px", margin: "10px 0px", overflowX: currentNavigation[1] ? "scroll" : ""
          }}>

            {loadsave && <div className="loading-overlay">Loading Saved Houses...</div>}

            {/* TAB 1: SAVED LISTINGS */}
            {currentNavigation[0] && (
              filteredHouse.length > 0 ? (
                filteredHouse.map((listing, i) => (
                  <SaveListingCard
                    key={i}
                    img={listing.image}
                    title={listing.title}
                    location={listing.location.address}
                    price={listing.rent}
                    id={listing.listingId}
                  />
                ))
              ) : <p>No saved houses yet.</p>
            )}

            {/* TAB 2: APPOINTMENTS */}
            {currentNavigation[1] && (
              <div style={{ width: "100%" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th>Date and Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleAppointmentData.map((item, idx) => (
                      <tr key={idx} className="table-row" style={{ border: "2px solid black" }}>
                        <td>
                          <h4>{onlyspecific?.title || "Property"}</h4>
                          <span className="desktop-only">
                            <LocationOnOutlinedIcon fontSize="small" />
                            {onlyspecific?.location?.address?.replace("Cameroon", "")}
                          </span>
                        </td>
                        <td>{item?.date} | {item?.time}</td>
                        <td>{item?.status}</td>
                        <td>
                          <button className="btn-actions btn-danger" onClick={() => deleteapp(item._id)}>
                            {loaddelete ? "..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: REVIEWS (STATIC EXAMPLE) */}
            {currentNavigation[2] && (
              <p>Your reviews and ratings will appear here.</p>
            )}
          </main>
        </div>
      </Container>
      <ProfilePanel userhere={user} />
      <ReferralInterface user={user}/>
      <Footer />
      <BottomTabs />
    </>
  );
}

export default SeekerProfile;