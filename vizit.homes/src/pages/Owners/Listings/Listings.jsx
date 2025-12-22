import React, { useState } from "react";
import Header, { SideNav } from "../Components/Header/Header";
import { Container } from "../../LandingPage/LandingPage";
import "../Dashboard/Dashboard.css";
import "./Listings.css";

import AddIcon from "@mui/icons-material/Add";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";

function Listings() {
  return (
    <div>
      <Header />

      <Container>
        <div className="welcome">
          <div>
            <h2>My Listings </h2>
            <p>Manage and track your property portfolio</p>
          </div>
          <div>
            <button
              className="button"
              onClick={() => {
                // !! TODO IMPORT ADD NEW LISTING FUNCTION AND USE HERE
              }}
            >
              {" "}
              <AddIcon className="btn-icon" /> Create New Listings
            </button>
          </div>
        </div>
        <PropertyTable />
      </Container>
    </div>
  );
}

export default Listings;
