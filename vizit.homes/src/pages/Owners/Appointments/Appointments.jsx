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
import ApartmentIcon from "@mui/icons-material/Apartment";
import TodayIcon from "@mui/icons-material/Today";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Modal from "../Components/Modal";

  export const modalMain = {
    display: "flex",
    flexDirection: "column",
    // border:"solid 2px red",
    justifyContent: "flex-start",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    // overflowY: "scroll"
  };
  export  const inputGroupContainerStyles = {
    width: "100%",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "10px 15px",
    border: "solid 1px #afafafff",
    borderRadius: "5px",
  };
  export  const inputInContainerStyles = {
    border: "none",
    outline: "none",
    accentColor:"green"
  };
  export const labelStyles = {
    display: "block",
    width: "100%",
    padding: "10px 0",
  };
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
  const [newAppointmentModal, setNewAppointmentModal] = useState(false);

  // ! new appointment  variables ::
  // ?for any time an owner wants to add  an appointment
  const [nAproperty, setNAProperty] = useState(""); //
  const [nAcontact, setNAContact] = useState(""); //
  const [nADate, setNADate] = useState(""); //
  const [nATime, setNATime] = useState(""); //

  const [appToDisplay, setAppToDisplay] = useState([]);

  for (let i = appToDisplay.length; i <= limit - 1; i++) {
    if (i >= start && i < sampleAppointmentData.length) {
      appToDisplay.push(sampleAppointmentData[i]);
      if (i > 2) {
        setStart((prev) => prev + 1);
      }
    }
  }
  const [appointments, setAppointments] = useState(appToDisplay);
  const modalInputStyles = {
    display: "block",
    // cursor:"pointer",
    width: "100%",
    padding: "5px 10px",
    font: "inherit",
    borderRadius: "5px",
    border: "solid 1px black",
    outline: "none",
    resize: "vertical",
  };




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
  function AppointmentCard({ appointment }) {
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showDetailsModal, setDetailsModal] = useState(false);

    function handleConfirmAppointment() {
      alert("appointment confirmed ");
    }

    function handleDetailsPopup() {
      setDetailsModal(true);
    }

    function handleAppointmentReschedule() {
      setShowRescheduleModal(true);
    }
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
              <button
                className="confirm-btn"
                onClick={handleConfirmAppointment}
              >
                {" "}
                <CheckIcon /> Confirm
              </button>
              <button
                className="reschedule-btn"
                onClick={handleAppointmentReschedule}
              >
                <EditCalendarIcon /> Reschedule
              </button>
              {showRescheduleModal && (
                <Modal justification={"flex-end"}>
                  <div style={modalMain}>
                    <p>Set a new date for this appointment</p>
                    <input type="date" style={modalInputStyles}></input>
                    <p style={{ width: "100%" }}>Time</p>
                    <input type="time" style={modalInputStyles}></input>
                    <p style={{ width: "100%" }}>Reason (max 50 words)</p>
                    <textarea type="text" style={modalInputStyles} />
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        padding: "10px 5px 2px 5px",
                        width: "100%",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#e64016ff",
                        }}
                        onClick={() => setShowRescheduleModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        style={{
                          backgroundColor: "#014631ff",
                          animation: "smothcolor linear 10s infinite;",
                        }}
                        onClick={() => {
                          alert("Request to save goes here");
                          setShowRescheduleModal(false);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </Modal>
              )}
            </>
          )}
          {appointment.status == "confirmed" && (
            <>
              <button className="view-details" onClick={handleDetailsPopup}>
                {" "}
                <OpenInNewIcon /> View Details
              </button>
              {showDetailsModal && (
                <Modal>
                  <div style={modalMain}>
                    <h3>Details</h3>
                    <div style={{ width: "100%" }}>
                      <ApartmentIcon style={{ color: "#014631ff" }} />{" "}
                      {appointment.property}
                    </div>
                    <div style={{ width: "100%" }}>
                      <PersonIcon style={{ color: "#014631ff" }} />{" "}
                      {appointment.contact}
                    </div>
                    <div style={{ width: "100%" }}>
                      <TodayIcon style={{ color: "#014631ff" }} />{" "}
                      {appointment.date}
                    </div>
                    <div style={{ width: "100%" }}>
                      <ScheduleIcon style={{ color: "#014631ff" }} />{" "}
                      {appointment.time}
                    </div>

                    <button
                      style={{
                        backgroundColor: "#014631ff",
                        animation: "smothcolor linear 10s infinite;",
                        borderRadius: "10px",
                        width: "100%",
                        justifyContent: "center",
                      }}
                      onClick={() => setDetailsModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </Modal>
              )}
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
  function handleAddNewAppointment() {
    setNewAppointmentModal(prev => !prev);
  }

  return (
    <div>
      <Header />
      <Container>
        <PageTitle
          title={"Your Appointments"}
          subTitle={"Manage property Viewings and seeker requests"}
          buttonText={"Add manual appointment"}
          btnFunction={handleAddNewAppointment}
        ></PageTitle>
        {newAppointmentModal && (
          <Modal justification={"flex-end"}>
            <div style={modalMain}>
              <h3 style={{ width: "100%" }}> Add a New Appointment </h3>
              <div>
                {/* property: "Sunnyvale Loft - Unit 4B", contact: "John Doe", date:
                "Oct 24", time: "2:00 PM", status: "confirmed", */}

                <label htmlFor="" style={labelStyles}>
                  Property
                </label>
                <div style={inputGroupContainerStyles}>
                  <ApartmentIcon style={{ color: "#035e4aff" }} />
                  <select
                    type="text"
                    style={inputInContainerStyles}
                    onChange={(e) => setNAProperty(e.target.value)}
                  >
                    <option value="nothing">
                      {" "}
                      Select The Building Concerned
                    </option>
                    <option value={"options to the buildings by owner"}>
                      Owner Building One
                    </option>
                  </select>
                </div>
                <label htmlFor="" style={labelStyles}>
                  contact
                </label>
                <div style={inputGroupContainerStyles}>
                  <PersonIcon style={{ color: "#035e4aff" }} />
                  <input
                    type="text"
                    style={inputInContainerStyles}
                    placeholder="Involved Party"
                    onChange={(e) => setNAContact(e.target.value)}
                  />
                </div>
                <label htmlFor="" style={labelStyles}>
                  Date of appointment
                </label>
                <div style={inputGroupContainerStyles}>
                  <TodayIcon style={{ color: "#035e4aff" }} />
                  <input
                    type="date"
                    style={inputInContainerStyles}
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
                    onChange={(e) => setNATime(e.target.value)}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px 5px 2px 5px",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  style={{
                    backgroundColor: "#e64016ff",
                    padding: "10px 15px",
                    border: "none",
                    color: "white",
                    borderRadius: "8px",
                  }}
                  onClick={() => setNewAppointmentModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    backgroundColor: "#014631ff",
                    animation: "smothcolor linear 10s infinite",
                    padding: "10px 15px",
                    border: "none",
                    color: "white",
                    borderRadius: "8px",
                  }}
                  onClick={() => {
                    alert( JSON.stringify({
                      "property": nAproperty,
                      "contact": nAcontact,
                      "date": nADate,
                      "time": nATime,
                      "status": "confirmed",
                    }));
                    setNewAppointmentModal(false);
                    //update the state after ~_~
                  
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
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
              <div className="nothing-found">No Appointments Found Here </div>
            )}
          </div>
        </div>
      </Container>
      <Footer></Footer>
    </div>
  );
}

export default Appointments;
