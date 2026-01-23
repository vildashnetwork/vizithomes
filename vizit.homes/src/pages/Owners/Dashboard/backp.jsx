import React, { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import { Container, Footer } from "../../LandingPage/LandingPage";
import "./Dashboard.css";

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Radar, Line, Bar, Doughnut, Pie } from "react-chartjs-2";

import AddIcon from "@mui/icons-material/Add";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OnwnerSetting from "./OwnersSettings";
//!! TODO :: MAKE THIS FUNCTIONS FETCH ACTUAL DATA FROM BACKEND
const businessStreams = [
    {
        label: "Jan",
        value: 42,
    },
    {
        label: "Feb",
        value: 37,
    },
    {
        label: "Mac",
        value: 20,
    },
    {
        label: "Apr",
        value: 24,
    },
    {
        label: "May",
        value: 37,
    },
    {
        label: "Jun",
        value: 25,
    },
    {
        label: "Jul",
        value: 42,
    },
    {
        label: "Aug",
        value: 39,
    },
    {
        label: "Sep",
        value: 29,
    },
    {
        label: "Oct",
        value: 45,
    },
    {
        label: "Nov",
        value: 38,
    },
    {
        label: "Dec",
        value: 21,
    },
];
const businessStreams1 = [
    {
        label: "Digital Products",
        value: 42,
    },
    {
        label: "Client Services",
        value: 37,
    },
    {
        label: "Partnerships",
        value: 20,
    },
    {
        label: "Digital Products",
        value: 29,
    },
    {
        label: "Client Services",
        value: 27,
    },
    {
        label: "Partnerships",
        value: 17,
    },
    {
        label: "Digital Products",
        value: 48,
    },
    {
        label: "Client Services",
        value: 39,
    },
    {
        label: "Partnerships",
        value: 29,
    },
    {
        label: "Digital Products",
        value: 40,
    },
    {
        label: "Client Services",
        value: 15,
    },
    {
        label: "Partnerships",
        value: 3,
    },
];
const sampleActivities = [
    {
        color: "blue",
        iconName: "message",
        title: "New Inquiry Received",
        message: "John Smith inquired about the downtown apartment listing",
        time: "5 minutes ago",
    },
    {
        color: "green",
        iconName: "appointment",
        title: "Property Viewing Scheduled",
        message: "Viewing scheduled for 123 Main St at 2:00 PM tomorrow",
        time: "30 minutes ago",
    },
    {
        color: "purple",
        iconName: "payment",
        title: "Rent Payment Received",
        message: "Jane Doe paid $1,500 for unit #304",
        time: "1 hour ago",
    },
    {
        color: "orange",
        iconName: "listing",
        title: "New Listing Published",
        message: "Lakeview Villa published to marketplace",
        time: "2 hours ago",
    },
    {
        color: "blue",
        iconName: "message",
        title: "Tenant Message",
        message: "Michael reported a leaky faucet in unit #205",
        time: "3 hours ago",
    },
    {
        color: "red",
        iconName: "appointment",
        title: "Inspection Reminder",
        message: "Annual safety inspection scheduled for Friday",
        time: "5 hours ago",
    },
    {
        color: "green",
        iconName: "payment",
        title: "Security Deposit Returned",
        message: "$2,000 deposit returned to previous tenant",
        time: "1 day ago",
    },
    {
        color: "purple",
        iconName: "listing",
        title: "Listing Updated",
        message: "Price reduced for suburban family home",
        time: "1 day ago",
    },
    {
        color: "orange",
        iconName: "message",
        title: "Maintenance Update",
        message: "HVAC repair completed at commercial building",
        time: "2 days ago",
    },
    {
        color: "blue",
        iconName: "appointment",
        title: "Lease Signing",
        message: "New lease agreement signed for office space",
        time: "2 days ago",
    },
    {
        color: "green",
        iconName: "payment",
        title: "Mortgage Payment",
        message: "Monthly mortgage payment processed",
        time: "3 days ago",
    },
    {
        color: "red",
        iconName: "listing",
        title: "Listing Expired",
        message: "90-day listing period ended for warehouse property",
        time: "3 days ago",
    },
    {
        color: "purple",
        iconName: "message",
        title: "Broker Inquiry",
        message: "Commercial broker interested in joint venture",
        time: "4 days ago",
    },
    {
        color: "orange",
        iconName: "appointment",
        title: "Contractor Meeting",
        message: "Met with renovation contractor for estimates",
        time: "5 days ago",
    },
    {
        color: "blue",
        iconName: "payment",
        title: "Utility Bill Paid",
        message: "Water and electricity bills paid for all properties",
        time: "1 week ago",
    },
    {
        color: "green",
        iconName: "listing",
        title: "Virtual Tour Created",
        message: "3D virtual tour added to luxury condo listing",
        time: "1 week ago",
    },
    {
        color: "red",
        iconName: "message",
        title: "Tenant Feedback",
        message: "Positive feedback received from new tenants",
        time: "1 week ago",
    },
    {
        color: "purple",
        iconName: "appointment",
        title: "Tax Assessment",
        message: "Annual property tax assessment completed",
        time: "2 weeks ago",
    },
    {
        color: "orange",
        iconName: "payment",
        title: "Insurance Premium",
        message: "Property insurance premium paid",
        time: "2 weeks ago",
    },
    {
        color: "blue",
        iconName: "listing",
        title: "Property Sold",
        message: "Industrial park property sold for $2.5M",
        time: "3 weeks ago",
    },
];

defaults.maintainAspectRatio = false;
defaults.plugins.title.display = true;
defaults.plugins.title.color = "black";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.align = "start";

function Dashboard() {

    const navigate = useNavigate()
    function ActivityCard({ color, iconName, title, message, time }) {
        console.log(color, iconName, title, message, time);
        function Icon() {
            switch (iconName) {
                case "message":
                    return <EmailIcon className={`ii ${color}-icon`} />;

                case "appointment":
                    return <CalendarMonthIcon className={`ii ${color}-icon`} />;
                case "payment":
                    return <PaymentsIcon className={`ii ${color}-icon`} />;
                case "listing":
                    return <RealEstateAgentIcon className={`ii ${color}-icon`} />;

                default:
                    return <EmailIcon className={`ii ${color}-icon`} />;
            }
        }
        return (
            <div className="item">
                <div className="icon">
                    <div className={`${color}-box`}>
                        <Icon></Icon>
                    </div>
                </div>
                <div className="info">
                    <h3>{title}</h3>
                    <p>{message}</p>
                    <p className="time-ago">{time}</p>
                </div>
            </div>
        );
    }
    //!! TODO : FETCH THE REAL VALUES HERE

    // let activeListingsDemo = "0";
    let pendingAptDemo = 3;
    let unreadMsgDemo = 10;
    let monthsProfitDemo = 2000000;

    const [actListLim, setActListLim] = useState(4);
    const [expandBtnTxt, setExpandBtnTxt] = useState("View All");
    const [activeListings, setActiveListings] = useState("");
    const [pendingApt, setPendingApt] = useState(pendingAptDemo);
    const [unreadMsg, setUnreadMsg] = useState(unreadMsgDemo);
    const [monthsProfit, setMonthsProfit] = useState(monthsProfitDemo);
    const [listingsdate, setlistingsdate] = useState("")
    const [user, setuser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        decoding()
    }, [])

    const [properties, setpropertype] = useState(null)
    const [loadfetch, setloadfetch] = useState(false);


    useEffect(() => {
        if (!user?._id) return;
        //fetch property per user
        const fetchHouses = async () => {
            try {

                const res = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/house/houses/getting/${user._id}`
                );

                const housesData = Array.isArray(res.data.houses)
                    ? res.data.houses
                    : [];

                const filteravaliable = housesData.filter((item) => item.isAvalable === true)

                setActiveListings(filteravaliable?.length)
                const currentDate = new Date();

                const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);


                const filterbydate = housesData.filter((item) => new Date(item.createdAt) >= firstDayOfMonth);


                setlistingsdate(filterbydate.length)

                setpropertype(housesData);

            } catch (error) {
                console.error("Failed to fetch houses", error);
                setpropertype([]);

            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, [user?._id]);



    const [listingsdate1, setlistingsdate1] = useState(0);
    const [sampleAppointmentData, setsampleAppointmentData] = useState([]);

    const fetchapointment = async () => {
        try {
            setloadfetch(true);

            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.warn("No userId found in localStorage");
                return;
            }

            const res = await axios.get(
                `https://vizit-backend-hubw.onrender.com/api/apointment/owner/${userId}`
            );

            if (res.status === 200 && Array.isArray(res.data)) {
                // Store all appointments
                setsampleAppointmentData(res.data);

                // Date filtering (current month)
                const now = new Date();
                const firstDayOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1
                );

                const filteredByDate = res.data.filter(
                    (item) =>
                        item.createdAt &&
                        new Date(item.createdAt) >= firstDayOfMonth
                );

                setlistingsdate1(filteredByDate.length);
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setloadfetch(false);

        }
    };

    useEffect(() => {
        fetchapointment();
    }, []);











    //data
    const [data, setData] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    /* ============================
       DECODE OWNER
    ============================ */
    useEffect(() => {
        const decodeUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await axios.get(
                    "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (res.status === 200) {
                    setCurrentUser(res.data.res);
                }
            } catch (err) {
                console.error("Decode failed", err);
            }
        };

        decodeUser();
    }, []);


    /* ============================
       FETCH & BUILD ACTIVITIES
    ============================ */
    useEffect(() => {
        if (!currentUser?._id) return;

        const loadActivities = async () => {
            try {
                setLoading(true);


                /* ----------------------------
              Last Messages
             ---------------------------- */
                /* ----------------------------
                   Last Messages (LATEST PER USER)
                ---------------------------- */
                const res = await axios.get(
                    `https://vizit-backend-hubw.onrender.com/api/messages/user/${currentUser._id}`
                );

                if (!Array.isArray(res.data)) return;

                // unread count (unchanged)
                const unread = res.data.filter(
                    (m) =>
                        String(m.receiverId) === String(currentUser._id) &&
                        m.readistrue === false
                ).length;

                setUnreadMsg(unread);

                /* ----------------------------
                   GROUP BY CONVERSATION
                ---------------------------- */
                const latestMessageMap = {};

                res.data.forEach((msg) => {
                    const otherUserId =
                        String(msg.senderId) === String(currentUser._id)
                            ? msg.receiverId
                            : msg.senderId;

                    if (
                        !latestMessageMap[otherUserId] ||
                        new Date(msg.createdAt) >
                        new Date(latestMessageMap[otherUserId].createdAt)
                    ) {
                        latestMessageMap[otherUserId] = msg;
                    }
                });

                /* ----------------------------
                   BUILD ACTIVITY ITEMS
                ---------------------------- */
                const messageActivities = Object.values(latestMessageMap)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((msg) => ({
                        iconName: "message",
                        title:
                            String(msg.senderId) === String(currentUser._id)
                                ? "Message Sent"
                                : "New Message",
                        message: msg.text
                            ? msg.text
                            : msg.image
                                ? "📷 Image"
                                : msg.video
                                    ? "🎥 Video"
                                    : msg.audio
                                        ? "🎧 Audio"
                                        : "Message",
                        time: msg.createdAt,
                    }));















                /* ----------------------------
                   FETCH HOUSES
                ---------------------------- */
                const housesRes = await axios.get(
                    "https://vizit-backend-hubw.onrender.com/api/house/houses"
                );

                const ownedHouses =
                    housesRes.data?.houses?.filter(
                        (h) => h.owner?.id === currentUser._id
                    ) || [];

                /* ----------------------------
                   PROPERTY ACTIVITIES
                ---------------------------- */
                const propertyActivities = ownedHouses.map((house) => ({
                    iconName: "home",
                    title: "New Property Listed",
                    message: `You listed "${house.title}"`,
                    time: house.createdAt,
                }));

                /* ----------------------------
                   REVIEW ACTIVITIES
                ---------------------------- */
                const reviewActivities = ownedHouses.flatMap((house) =>
                    (house.reviews?.entries || []).map((rev) => ({
                        iconName: "star",
                        title: "New Review",
                        message: `${rev.name} rated "${house.title}" ${rev.rating}★`,
                        time: rev.createdAt,
                    }))
                );

                /* ----------------------------
                   REPLY ACTIVITIES
                ---------------------------- */
                const replyActivities = ownedHouses.flatMap((house) =>
                    (house.reviews?.entries || [])
                        .filter((r) => r.replies?.length)
                        .map((r) => ({
                            iconName: "reply",
                            title: "Replied to Review",
                            message: `You replied to a review on "${house.title}"`,
                            time: r.replies[0].createdAt || r.updatedAt,
                        }))
                );

                /* ----------------------------
                   FETCH APPOINTMENTS
                ---------------------------- */
                const userId = localStorage.getItem("userId");

                let appointmentActivities = [];
                if (userId) {
                    const appointmentRes = await axios.get(
                        `https://vizit-backend-hubw.onrender.com/api/apointment/owner/${userId}`
                    );

                    appointmentActivities = (appointmentRes.data || []).map((a) => ({
                        iconName: "calendar",
                        title: "New Appointment",
                        message: `${a.name || "Someone"} booked an appointment`,
                        time: a.createdAt,
                    }));
                }

                /* ----------------------------
                   MERGE & SORT
                ---------------------------- */
                const merged = [
                    ...propertyActivities,
                    ...reviewActivities,
                    ...replyActivities,
                    ...appointmentActivities,
                    ...messageActivities,
                ].sort((a, b) => new Date(b.time) - new Date(a.time));

                setData(merged);
            } catch (err) {
                console.error("Failed to load activities", err);
            } finally {
                setLoading(false);
            }
        };

        loadActivities();
    }, [currentUser]);


















    //chat





    const MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",]
    function ReviewsAppointmentsChart() {
        const [chartStats, setChartStats] = useState(null);
        const [currentUser, setCurrentUser] = useState(null);
        const [loading, setLoading] = useState(false);

        /* ============================
           DECODE OWNER
        ============================ */
        useEffect(() => {
            const decodeOwner = async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) return;

                    const res = await axios.get(
                        "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );

                    if (res.status === 200) {
                        setCurrentUser(res.data.res);
                    }
                } catch (err) {
                    console.error("Failed to decode owner", err);
                }
            };

            decodeOwner();
        }, []);

        /* ============================
           FETCH & BUILD STATS
        ============================ */
        useEffect(() => {
            if (!currentUser?._id) return;

            const buildStats = async () => {
                try {
                    setLoading(true);

                    const reviewCounts = Array(12).fill(0);
                    const appointmentCounts = Array(12).fill(0);

                    /* ----------------------------
                       FETCH HOUSES + REVIEWS
                    ---------------------------- */
                    const housesRes = await axios.get(
                        "https://vizit-backend-hubw.onrender.com/api/house/houses"
                    );

                    const ownedHouses =
                        housesRes.data?.houses?.filter(
                            (h) => h.owner?.id === currentUser._id
                        ) || [];

                    ownedHouses.forEach((house) => {
                        (house.reviews?.entries || []).forEach((review) => {
                            const date = new Date(review.createdAt);
                            const month = date.getMonth();
                            reviewCounts[month] += 1;
                        });
                    });

                    /* ----------------------------
                       FETCH APPOINTMENTS
                    ---------------------------- */
                    const userId = localStorage.getItem("userId");
                    if (userId) {
                        const appointmentRes = await axios.get(
                            `https://vizit-backend-hubw.onrender.com/api/apointment/owner/${userId}`
                        );

                        (appointmentRes.data || []).forEach((appt) => {
                            const date = new Date(appt.createdAt);
                            const month = date.getMonth();
                            appointmentCounts[month] += 1;
                        });
                    }

                    /* ----------------------------
                       FINAL CHART OBJECT
                    ---------------------------- */
                    setChartStats({
                        labels: MONTHS,
                        datasets: [
                            {
                                label: "Reviews",
                                data: reviewCounts,
                                backgroundColor: "#244531",
                                borderRadius: 10,
                            },
                            {
                                label: "Appointments",
                                data: appointmentCounts,
                                backgroundColor: "#36e37b",
                                borderRadius: 10,
                            },
                        ],
                    });
                } catch (err) {
                    console.error("Failed to build chart stats", err);
                } finally {
                    setLoading(false);
                }
            };

            buildStats();
        }, [currentUser]);

        if (loading) return <p>Loading chart data...</p>;
        if (!chartStats) return null;
        return (
            <Bar
                data={chartStats}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Monthly Reviews & Appointments",
                        },
                        legend: {
                            position: "top",
                        },
                    },
                }}
            />
        );
    }
    //end cht












    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const boxStyle = {
        backgroundColor: "#ffffff",
        padding: "28px 36px",
        borderRadius: "10px",
        textAlign: "center",
        minWidth: "220px",
        boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
    };

    const spinnerStyle = {
        width: "42px",
        height: "42px",
        border: "4px solid #e0e0e0",
        borderTop: "4px solid #111",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
        margin: "0 auto",
    };

    const textStyle = {
        marginTop: "14px",
        fontSize: "14px",
        fontWeight: 500,
        color: "#333",
    };
    if (loadfetch) {
        return (
            <>
                {/* Inline keyframes */}
                <style>
                    {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
                </style>

                <div style={overlayStyle}>
                    <div style={boxStyle}>
                        <div style={spinnerStyle} />
                        <p style={textStyle}>{"Loading..."}</p>
                    </div>
                </div>
            </>
        );
    }











    // let data = [];
    // for (let i = 0; i <= actListLim - 1; i++) {
    //   data.push(sampleActivities[i]);
    // }

    function determineColor(category) {
        switch (category) {
            case "message":
                return "green";

            case "appointment":
                return "blue";
            case "payment":
                return "yellow";
            case "listing":
                return "green";

            default:
                return "green";
        }
    }
    console.log(data);
    console.log("Length", monthsProfit.toString().length);

    return (
        <div>
            <Header />
            <Container>
                <div className="welcome">
                    <div>
                        <h2>Welcome, {user?.name}</h2>
                        <p>What is going on with <span style={{ color: "green", fontWeight: 900 }}> {user?.companyname}</span> properties today ?</p>
                    </div>
                    <div>
                        <button
                            className="button"
                            onClick={() => {
                                navigate("/createproperty")
                            }}
                        >
                            {" "}
                            <AddIcon className="btn-icon" /> Add New Listings
                        </button>
                    </div>
                </div>
                <div className="dash-card-container">
                    <div className="dc">
                        <div className="dc-top">
                            <p>Total Active Listings</p>
                            <div className="dc-icon-cont">
                                <RealEstateAgentIcon className="dc-icon" />
                            </div>
                        </div>
                        <div className="count">{activeListings}</div>
                        <div className="trend">
                            <p className="good">
                                <TrendingUpIcon /> <span className="count-value"
                                    style={{ color: !listingsdate < 1 ? "green" : "red" }}>
                                    +{listingsdate}</span> this month
                            </p>
                        </div>
                    </div>
                    <div className="dc">
                        <div className="dc-top">
                            <p>Pending Appointment</p>
                            <div className="dc-icon-cont">
                                <PendingActionsIcon className="dc-icon" />
                            </div>
                        </div>
                        <div className="count">{sampleAppointmentData?.length}</div>
                        <div className="trend">
                            <p className="good">
                                <TrendingUpIcon /> <span className="count-value"
                                    style={{ color: !listingsdate1 < 1 ? "green" : "red" }}> +{listingsdate1}</span> new
                                appointments
                            </p>
                        </div>
                    </div>
                    <div className="dc">
                        <div className="dc-top">
                            <p>Unread Messages</p>
                            <div className="dc-icon-cont">
                                <EmailIcon className="dc-icon" />
                            </div>
                        </div>
                        <div className="count">{unreadMsg}</div>
                        <div className="trend">
                            <p className="good">
                                <TrendingUpIcon /> <span className="count-value"> +7 </span> new
                                unread
                            </p>
                        </div>
                    </div>
                    <div className="dc">
                        <div className="dc-top">
                            <p>Total Pro Balance</p>
                            <div className="dc-icon-cont">
                                <AttachMoneyIcon className="dc-icon" />
                            </div>
                        </div>
                        <div
                            className="count"
                            style={{
                                fontSize: monthsProfit.toString().length > 9 ? "1.2em" : "2em",
                            }}
                        >
                            XFA {"0.00"}
                        </div>
                        <div className="trend">
                            <p className="bad">
                                <TrendingDownIcon /> <span className="count-value"> -12% </span>{" "}
                                vs last month
                            </p>
                        </div>
                    </div>
                </div>
                <div className="chart-activity">
                    <div className="chart-container">
                        {/* <div className="chart-main"> */}
                        {/* <Bar
              data={{
                labels: businessStreams.map((item) => item.label),
                datasets: [
                  {
                    label: "Page Views",
                    data: businessStreams.map((item) => item.value),
                    backgroundColor: ["#244531"],
                    borderRadius: 10,
                  },
                  {
                    label: "Appointments",
                    data: businessStreams1.map((item) => item.value),
                    backgroundColor: ["#36e37b"],
                    borderRadius: 10,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: "Monthly Performance",
                  },
                },
              }}
            /> */}
                        {/* </div> */}

                        <ReviewsAppointmentsChart />
                    </div>

                    <div className="activity-history">
                        <div className="top">
                            <h2>Recent Activity</h2>
                            <button
                                onClick={() => {
                                    // !! TODO : CHANGE WITH ACTUAL VALUES
                                    if (expandBtnTxt == "View All") {
                                        sampleActivities.length > 20
                                            ? setActListLim(sampleActivities.length / 2 - 1)
                                            : setActListLim(sampleActivities.length - 1);
                                        setExpandBtnTxt("Fewer Items");
                                    } else {
                                        setActListLim(4);
                                        setExpandBtnTxt("View All");
                                    }
                                }}
                            >
                                {expandBtnTxt}
                            </button>
                        </div>
                        <div
                            className="center"
                            style={{
                                overflowY: actListLim > 4 ? "scroll" : "hidden",
                                // border:"solid 2px green"
                            }}
                        >

                            {loading && <p>Loading recent activities...</p>}

                            {!loading && data.length === 0 && (
                                <p>No recent activity available.</p>
                            )}

                            {!loading &&
                                data.map((item, index) => (
                                    <ActivityCard
                                        key={index}
                                        color={determineColor(item.iconName)}
                                        iconName={item.iconName}
                                        title={item.title}
                                        message={item.message}
                                        time={new Date(item.time).toLocaleString()}
                                    />
                                ))}




                        </div>
                    </div>
                </div>
                <OnwnerSetting userhere={name} />

            </Container>
            <Footer />
        </div>
    );
}

export default Dashboard;















































































