import React, { useState } from "react";
import Header from "../Components/Header/Header";
import PageTitle from "../Components/PageTitle";
import "./Appointments.css";
import { Container, Footer } from "../../LandingPage/LandingPage";
import { cleanString } from "../../../utils/cleanString";
import { data } from "../../../data/listingdata";

import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function AppointmentCard({ appointment }) {
  return (
    <div className="apt-card">
      <div className="apt-card-left">
        <div className="apt-card-img-cont">
          {/* //!! Change this to insert the id of the building */}
          <img src={data[0].image} alt="image :)" />

          {appointment.status == "void" && (
            <>
              <button className={`batch void`}>
                {" "}
                <MoreHorizIcon />
                Action
              </button>
            </>
          )}
          {appointment.status == "confirmed" && (
            <>
              <button className={`batch confirmed`}>
                {" "}
                <CheckCircleIcon /> Confirmed
              </button>
            </>
          )}
          {appointment.status == "cancelled" && (
            <>
              <button className={`batch cancelled`}>
                <CancelIcon /> cancelled
              </button>
            </>
          )}
        </div>
        <div className="apt-details">
          <h3 className="apt-house-title">{appointment.property}</h3>
          <h5 className="apt-seeker">
            {" "}
            <PersonIcon /> {appointment.contact}
          </h5>
          <p className="apt-date-time">
            <EventNoteIcon />
            {appointment.date} | {appointment.time}
          </p>
        </div>
      </div>

      <div className="apt-controls">
        {appointment.status == "void" && (
          <>
            <button className="confirm-btn">
              {" "}
              <CheckIcon /> Confirm
            </button>
            <button className="reschedule-btn">
              <EditCalendarIcon /> Reschedule
            </button>
          </>
        )}
        {appointment.status == "confirmed" && (
          <>
            <button className="view-details">
              {" "}
              <OpenInNewIcon /> View Details
            </button>
            <button
              className="reschedule-btn"
              style={{ padding: 0, boxShadow: "none" }}
            >
              <WatchLaterIcon />{" "}
            </button>
          </>
        )}
        {appointment.status == "cancelled" && (
          <>
            <p className="cancelled">Cancelled By Seeker</p>
          </>
        )}
      </div>
    </div>
  );
}
const sampleAppointmentData = [
  {
    property: "Sunnyvale Loft - Unit 4B",
    contact: "John Doe",
    date: "Oct 24",
    time: "2:00 PM",
    status: "confirmed",
  },
  {
    property: "Highland Manor Estate",
    contact: "Sarah Williams",
    date: "Oct 25",
    time: "10:30 AM",
    status: "cancelled",
  },
  {
    property: "Downtown Studio",
    contact: "Michael Chen",
    date: "Oct 26",
    time: "4:00 PM",
    status: "void",
  },
  {
    property: "Lakeside Cabin",
    contact: "Emily Davis",
    date: "Oct 22",
    time: "1:00 PM",
    status: "void",
  },
  {
    property: "Highland Manor Estate",
    contact: "Sarah Williams",
    date: "Oct 25",
    time: "10:30 AM",
    status: "cancelled",
  },
  {
    property: "Downtown Studio",
    contact: "Michael Chen",
    date: "Oct 26",
    time: "4:00 PM",
    status: "void",
  },
  {
    property: "Lakeside Cabin",
    contact: "Emily Davis",
    date: "Oct 22",
    time: "1:00 PM",
    status: "void",
  },
];
function Appointments() {
  const [filter, setFilter] = useState([
    { title: "All Requests", active: true },
    { title: "Upcoming", active: false },
    { title: "Pending", active: false },
    { title: "Past", active: false },
  ]);
  const [limit, setLimit] = useState(3);
  const [start, setStart] = useState(0);

  let [appToDisplay, setAppToDisplay] = useState([]);

  for (let i = appToDisplay.length; i <= limit - 1; i++) {
    if (i >= start && i < sampleAppointmentData.length) {
      appToDisplay.push(sampleAppointmentData[i]);
      if (i > 2) {
        setStart((prev) => prev + 1);
      }
    }
  }
  const [appointments, setAppointments] = useState(appToDisplay);
  function changeFilter(nextCurrent) {
    let arr = [];
    filter.map((filt) => {
      if (cleanString(filt.title) == cleanString(nextCurrent)) {
        filt.active = true;
        arr.push(filt);
        let newApts = [];

        if (cleanString(filt.title) == "pending")
          newApts = appToDisplay.filter((apt) => apt.status == "void");

        if (cleanString(filt.title) == "upcoming")
          newApts = appToDisplay.filter((apt) => apt.status == "confirmed");
        if (cleanString(filt.title) == cleanString("All Requests"))
          newApts = appToDisplay.filter((apt) => apt.status !== " ");

        if (cleanString(filt.title) == cleanString("Past"))
          newApts = appToDisplay.filter(
            (apt) =>
              // !! TODO : add dayjs to find past date

              apt.status == "past"
          );

        setAppointments(newApts);
      } else {
        filt.active = false;
        arr.push(filt);
      }
    });
    setFilter(arr);
  }
  function BtnIcon({ inlineText }) {
    switch (cleanString(inlineText)) {
      case cleanString("All Requests"):
        return <CalendarMonthIcon />;
      case cleanString("Upcoming"):
        return <WatchLaterIcon />;
      case cleanString("Pending"):
        return <CheckCircleIcon />;
      case cleanString("Past"):
        return <HistoryIcon />;
      default:
        return <CalendarMonthIcon />;
    }
  }
  function loadMore() {
    if (limit <= sampleAppointmentData.length) {
      setLimit((prev) => prev + 1);
    }
  }

  return (
    <div>
      <Header />
      <Container>
        <PageTitle
          title={"Your Appointments"}
          subTitle={"Manage property Viewings and seeker requests"}
          buttonText={"Add manual appointment"}
        >
          <button>Hello</button>
        </PageTitle>
        <div className="appointments">
          <div className="filters">
            {filter.map((_, _i) => {
              return (
                <button
                  key={_i}
                  className={`filter-btn ${_.active ? "active" : " "}`}
                  onClick={() => changeFilter(_.title)}
                >
                  <BtnIcon inlineText={_.title} />
                  {_.title}
                </button>
              );
            })}
          </div>

          <div className="apt-card-container">
            {appointments.map((apt, _) => {
              return <AppointmentCard appointment={apt} key={_} />;
            })}
          </div>
          <div className="btn-load-cont">
            {appointments.length >= 1 ? (
              <button
                // disabled
                className="btn-load"
                onClick={() => {
                  
                  loadMore();

                }}
              >
                Load more Appointments <ExpandMoreIcon />
              </button>
            ) : (
              <div className="nothing-found">No Appointments Found Here :</div>
            )}
          </div>
        </div>
      </Container>
      <Footer></Footer>
    </div>
  );
}

export default Appointments;
