import React, { useEffect, useState } from "react";
import Header, { SideNav } from "../Components/Header/Header";
import { Container, Footer } from "../../LandingPage/LandingPage";
import "./Listings.css";
import AddIcon from "@mui/icons-material/Add";
import SouthIcon from "@mui/icons-material/South";
import CheckIcon from "@mui/icons-material/Check";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import BarChartIcon from "@mui/icons-material/BarChart";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import PageTitle from "../Components/PageTitle";
import axios from "axios";
import { cleanString } from "../../../utils/cleanString";
import Modal from "../Components/Modal";
import CreateHouseForm from "./CreateProperty";
import { useNavigate } from "react-router-dom";

function Listings() {
  const navigate = useNavigate()
  const [opemodal, setopenmodal] = useState(false)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allListings, setAllListings] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState([
    { title: "All Status", active: true },
    { title: "Active", active: false },
    { title: "Draft", active: false },
    { title: "Rented", active: false },
  ]);

  // ------------------- Decode user -------------------
  useEffect(() => {
    const decodeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await axios.get(
          "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200) setUser(res.data.res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    decodeUser();
  }, []);

  const [loadfetch, setloadfetch] = useState(false)
  // ------------------- Fetch Listings -------------------
  useEffect(() => {
    if (!user?._id) return;

    const fetchHouses = async () => {
      try {
        setloadfetch(true)
        const res = await axios.get(
          `https://vizit-backend-hubw.onrender.com/api/house/houses/getting/${user._id}`
        );
        const housesData = Array.isArray(res.data.houses) ? res.data.houses : [];

        // Normalize isAvailable
        const normalized = housesData.map(h => ({ ...h, isAvailable: !!h.isAvalable }));

        setAllListings(normalized);
        setFilteredData(normalized);
      } catch (err) {
        setloadfetch(false)
        console.error("Failed to fetch houses", err);
      } finally {
        setloadfetch(false)
      }
    };

    fetchHouses();
  }, [user?._id]);

  // ------------------- Filter function -------------------
  function changeFilter(title) {
    setFilter(prev => prev.map(f => ({ ...f, active: cleanString(f.title) === cleanString(title) })));

    let result;
    switch (cleanString(title)) {
      case "active":
        result = allListings.filter(l => l.isAvailable);
        break;
      case "rented":
        result = allListings.filter(l => !l.isAvailable);
        break;
      case "draft":
        result = allListings.filter(l => l.status === "draft");
        break;
      default:
        result = allListings;
    }

    setFilteredData(result);
  }

  // ------------------- BtnIcon function -------------------
  function BtnIcon({ inlineText }) {
    switch (cleanString(inlineText)) {
      case "allstatus":
        return <SouthIcon />;
      case "active":
        return <CheckIcon />;
      case "draft":
        return <SaveAsIcon />;
      case "rented":
        return <ReceiptIcon />;
      default:
        return <CalendarMonthIcon />;
    }
  }
  const [loadingdel, setloadingdel] = useState(false)
  // ------------------- Listing Card JSX -------------------
  function ListingCard({ listing, loadfetch }) {
    const handleDelete = async () => {
      try {
        setloadingdel(true);
        const response = await axios.delete(
          `https://vizit-backend-hubw.onrender.com/api/house/houses/${listing?._id}`
        );
        if (response.status === 200) {
          alert(response.data.message);
          setAllListings(prev => prev.filter(l => l._id !== listing._id));
          setFilteredData(prev => prev.filter(l => l._id !== listing._id));
        }
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete listing");
      } finally {
        setloadingdel(false);
      }
    };

    return (
      <tr>
        <td className="table-data">
          <div className="property-details">
            <img src={listing.image} alt={listing.title} />
            <div>
              <h3>{listing.title}</h3>
              <p>{listing.location.address}</p>
            </div>
          </div>
        </td>
        <td className="table-data">
          <h3>{listing.rent}</h3>
          <p>/{listing?.how}</p>
        </td>
        <td className="table-data">
          {listing.isAvailable ? (
            <div className="batch">
              <FiberManualRecordIcon style={{ fontSize: "small" }} /> Active
            </div>
          ) : (
            <div className="batch" style={{ color: "red" }}>
              <FiberManualRecordIcon style={{ fontSize: "small" }} /> Taken
            </div>
          )}
        </td>
        <td className="table-data">
          {(() => {
            const now = new Date();
            const updated = new Date(listing.updatedAt);
            const diffMs = now - updated;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            if (diffMins < 1) return "just now";
            if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
            if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
            return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
          })()}
        </td>
        <td className="table-data">
          <div className="actions">
            <button><BarChartIcon /></button>
            <button disabled={loadingdel} onClick={handleDelete}>
              {loadingdel ? "Deleting..." : <DeleteIcon />}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="listings">
      <Header />
      <Container>
        <PageTitle
          title="My Listings"
          subTitle="Manage and track your property portfolio"
        />


        <div className="search-filter">
          <div>
            <button
              className="button"
              style={{ background: "green" }}
              onClick={() => navigate("/createproperty")}
            >
              {" "}
              <AddIcon className="btn-icon" />
              Add New Listings
            </button>
          </div>
          <div className="search">
            <SearchIcon />
            <input type="search" placeholder="Search name or location ..." />
          </div>


          <div className="filters">
            {filter.map((f, i) => (
              <button
                key={i}
                className={`filter-btn ${f.active ? "active" : ""}`}
                onClick={() => changeFilter(f.title)}
              >
                <BtnIcon inlineText={f.title} /> {f.title}
              </button>
            ))}
          </div>
        </div>
        {loadfetch && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent overlay
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999, // make sure it's on top of everything
              flexDirection: "column",
            }}
          >
            {/* Spinner */}
            <div
              style={{
                border: "6px solid #f3f3f3", // light gray
                borderTop: "6px solid #014631", // your primary color
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                animation: "spin 1s linear infinite",
                marginBottom: "20px",
              }}
            ></div>
            {/* Loading text */}
            <p style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>
              Loading...
            </p>

            {/* Keyframes animation */}
            <style>
              {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
            </style>
          </div>
        )}

        {filteredData.length > 0 ? (
          <div className="listing-table">
            <table className="table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>

                {

                  filteredData.map(listing => (
                    <ListingCard listing={listing} key={listing._id} loadfetch={loadfetch} />
                  ))

                }
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: "50px 30px", display: "flex", justifyContent: "center" }}>
            No listings found :(
          </div>
        )}





      </Container>
      <Footer />


    </div>
  );
}

export default Listings;
