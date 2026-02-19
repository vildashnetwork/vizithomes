import React, { useEffect, useState } from "react";
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
import axios from "axios";
import toast from "react-hot-toast";

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
export const inputGroupContainerStyles = {
  width: "100%",
  display: "flex",
  gap: "10px",
  alignItems: "center",
  padding: "10px 15px",
  border: "solid 1px #afafafff",
  borderRadius: "5px",
};
export const inputInContainerStyles = {
  border: "none",
  outline: "none",
  accentColor: "green"
};
export const labelStyles = {
  display: "block",
  width: "100%",
  padding: "10px 0",
};





function Appointments() {
  //   const sampleAppointmentData = [
  // {
  //   property: "Sunnyvale Loft - Unit 4B",
  //   contact: "John Doe",
  //   date: "Oct 24",
  //   time: "2:00 PM",
  //   status: "confirmed",
  // },
  // ];
  const [user, setuser] = useState(null)
  const [loading, setLoading] = useState(true)

  const decoding = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("No token found")
        setLoading(false)
        return
      }

      const data = await axios.get(
        `https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (data.status === 200) {
        setuser(data.data.res)
        console.log(loading ? "loading..." : user);

      }
    } catch (error) {
      console.error("Failed to decode token:", error)
    } finally {
      setLoading(false)
    }
  }

  const [sampleAppointmentData, setsampleAppointmentData] = useState([])

  const [loadfetch, setloadfetch] = useState(false)
  const fetchapointment = async () => {
    try {
      setloadfetch(true)

      const userId = localStorage.getItem("userId")
      const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/apointment/owner/${userId}`)
      console.log('====================================');
      console.log("user id oh", user?._id);
      console.log('====================================');
      if (res.status == 200) {
        setsampleAppointmentData(res.data);
        console.log('====================================');
        console.log(sampleAppointmentData);
        console.log('====================================');
      }
      // apoitments
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    } finally {
      setloadfetch(false)
    }
  }
  useEffect(() => {
    decoding().then(() => {
      fetchapointment()
    })
  }, [])

 

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
    if (i >= start && i < sampleAppointmentData?.length) {
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
    if (limit <= sampleAppointmentData?.length) {
      setLimit((prev) => prev + 1);
    }
  }
  function AppointmentCard({ appointment }) {

    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showDetailsModal, setDetailsModal] = useState(false);
    const [loadconfirm, setloadconfirm] = useState(false)
    const [reason, setreason] = useState()

    const [localDate, setLocalDate] = useState(appointment.date || "");
    const [localTime, setLocalTime] = useState(appointment.time || "");

    async function savereschedule(id) {
      try {
        setloadconfirm(true)
        const res = await axios.put(`https://vizit-backend-hubw.onrender.com/api/apointment/${id}`,
          {
            date: localDate,
            time: localTime,
            reason: reason
          }
        )
        if (res.status == 200) {
          toast.success("apointment confirmed successfully")
          fetchapointment()
        }
      } catch (error) {
        console.log('====================================');
        console.log(error);
        toast.error(error)
        console.log('====================================');
      } finally {
        setloadconfirm(false)
      }
    }

    const [usern, setusern] = useState("")
    const [myprofile, setmyprofile] = useState("")
    // get users by thier email
    useEffect(() => {
      if (!appointment?.userID) return;
      let isMounted = true;

      const fetchusers = async () => {
        try {
          const getuser = await axios.get(
            `https://vizit-backend-hubw.onrender.com/api/user/onlyme/${appointment?.userID}`
          );
          // alert(getuser?.data?.getuser?.email)
          if (!getuser?.data?.getuser?.email) return;

          const res = await axios.get(
            `https://vizit-backend-hubw.onrender.com/api/user/me/${getuser?.data?.getuser?.email}`
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
    }, [appointment?.userID]);

    async function handleConfirmAppointment(id) {
      try {
        setloadconfirm(true)
        const res = await axios.put(`https://vizit-backend-hubw.onrender.com/api/apointment/${id}`,
          {
            status: "confirmed"
          }
        )
        if (res.status == 200) {
          toast.success("apointment confirmed successfully")
          fetchapointment()
        }
      } catch (error) {
        console.log('====================================');
        console.log(error);
        toast.error(error)
        console.log('====================================');
      } finally {
        setloadconfirm(false)
      }
    }

    function handleDetailsPopup() {
      setDetailsModal(true);
    }

    function handleAppointmentReschedule() {
      setShowRescheduleModal(!showRescheduleModal);
    }


    if (loadfetch) {
      return (
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
      )
    }



    return (
      <div className="apt-card">




        <div className="apt-card-left">
          <div className="apt-card-img-cont">
            {/* //!! Change this to insert the id of the building */}
            <img src={myprofile} alt="image :)" />

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
              <PersonIcon /> {usern}
            </h5>
            <p className="apt-date-time">
              <EventNoteIcon />
              {appointment?.date} | {" "} {" "}
              {appointment?.time}
            </p>
          </div>
        </div>



        <div className="apt-controls">
          {appointment.status == "void" && (
            <>
              <button
                className="confirm-btn"
                onClick={() => handleConfirmAppointment(appointment?._id)}
                disabled={loadconfirm}
              >
                <CheckIcon /> {loadconfirm ? "processing.." : "Confirm"}
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

                    <input
                      type="date"
                      value={localDate}
                      onChange={(e) => setLocalDate(e.target.value)}
                      style={modalInputStyles}
                    />

                    <input
                      type="time"
                      value={localTime}
                      onChange={(e) => setLocalTime(e.target.value)}
                      style={modalInputStyles}
                    />


                    <p style={{ width: "100%" }}>Reason (max 50 words)</p>
                    <textarea type="text" value={reason}
                      onChange={(e) => setreason(e.target.value)}
                      style={modalInputStyles} />
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
                        onClick={() => setShowRescheduleModal(!showRescheduleModal)}
                      >
                        Cancel
                      </button>
                      <button
                        style={{
                          backgroundColor: "#014631ff",
                          animation: "smothcolor linear 10s infinite;",
                        }}
                        onClick={() => {
                          savereschedule(appointment?._id)
                        }}
                      >
                        {loadconfirm ? "loading.." : "Save"}
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
          // buttonText={"Add manual appointment"}
          btnFunction={handleAddNewAppointment}
        ></PageTitle>
        {newAppointmentModal && (
          <Modal justification={"flex-end"}>
            {/* <div style={modalMain}>
              <h3 style={{ width: "100%" }}> Add a New Appointment </h3>
              <div>

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
                    alert(JSON.stringify({
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
            </div> */}
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
              loadfetch ?
                <div className="nothing-found">loading..</div>
                :
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




















