import React, { useState } from "react";
import Header from "../Header/Header";
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
  let activeListingsDemo = 4
  let pendingAptDemo = 3
  let unreadMsgDemo = 10
  let monthsProfitDemo = 2000000

  const [actListLim, setActListLim] = useState(4);
  const [expandBtnTxt ,setExpandBtnTxt] = useState("View All");
  const [activeListings,setActiveListings] = useState(activeListingsDemo)
  const [pendingApt,setPendingApt] = useState(pendingAptDemo)
  const [unreadMsg,setUnreadMsg] = useState(unreadMsgDemo)
  const [monthsProfit,setMonthsProfit] = useState(monthsProfitDemo)
  




  let data = [];
  for (let i = 0; i <= actListLim -1; i++) {
    data.push(sampleActivities[i]);
  }

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
  console.log("Length",monthsProfit.toString().length)
  return (
    <div>
      <Header />
      <Container>
        <div className="welcome">
          <div>
            <h2>Welcome, {"John"}</h2>
            <p>What is going on with your properties today ?</p>
          </div>
          <div>
            <button className="button"
            onClick={
                ()=>{
                    // !! TODO IMPORT ADD NEW LISTING FUNCTION AND USE HERE
                }
            }
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
                <TrendingUpIcon /> <span className="count-value">+1 </span> new
                Listing
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
            <div className="count">{pendingApt}</div>
            <div className="trend">
              <p className="good">
                <TrendingUpIcon /> <span className="count-value"> +2 </span> new
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
              <p>This Month's Profit</p>
              <div className="dc-icon-cont">
                <AttachMoneyIcon className="dc-icon" />
              </div>
            </div>
            <div className="count" style={{
                fontSize: monthsProfit.toString().length > 9 ? "1.2em" : "2em"
            }}>XFA  {monthsProfit.toLocaleString()}</div>
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
            <Bar
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
            />
            {/* </div> */}
          </div>

          <div className="activity-history">
            <div className="top">
              <h2>Recent Activity</h2>
              <button
              
                onClick={() => {

                  
                    // !! TODO : CHANGE WITH ACTUAL VALUES
                  if(expandBtnTxt == "View All"){
                  sampleActivities.length > 20 ?
                   setActListLim((sampleActivities.length / 2) -1 )
                   : setActListLim(sampleActivities.length -1);
                    setExpandBtnTxt("Fewer Items")
                  }
                  else{
                    setActListLim(4)
                    setExpandBtnTxt("View All")
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
              {data.map((item) => {
                return (
                  <ActivityCard
                    color={determineColor(item.iconName)}
                    iconName={item.iconName}
                    title={item.title}
                    message={item.message}
                    time={item.time}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default Dashboard;
