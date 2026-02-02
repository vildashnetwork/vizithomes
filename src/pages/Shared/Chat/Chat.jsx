import React, { useEffect, useRef, useState } from "react";
import {
  BottomTabs,
  Container,
  Footer,
  Head,
  SideNav,
} from "../../LandingPage/LandingPage";
import Header from "../../Owners/Components/Header/Header";
import "./Chat.css";
useRef;
import EditSquareIcon from "@mui/icons-material/EditSquare";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SendIcon from "@mui/icons-material/Send";
import { data } from "../../../data/listingdata";
function Chat({ userType }) {
  Head;
  Container;
  useEffect;
  SideNav;
  BottomTabs;

  const [nextView, setNextView] = useState(1);
  const [width, setWidth] = useState(window.innerWidth);
  const [sampleName, setSampleName] = useState(
    "Sarah Jetshjgkhdsgjgsdj jklaskhskj "
  );
  const [openEmojis, setOpenEmojis] = useState(false);
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function ChatListItem() {
    return (
      <div
        className="list-chat"
        role="button"
        autoFocus
        onClick={() => {
          setNextView(2);
        }}
      >
        <div className="left">
          <img src={data[0].image} alt="" />
           <div className="status"></div>
        </div>
       
        <div className="center">
          <div>
            <h3>
              {sampleName.length >= 15
                ? sampleName.substring(0, 10) + " ..."
                : sampleName}
            </h3>
            <p className="from"> {data[0].title}</p>
          </div>
          <div>
            <p>
              {data[0].reviews.entries[0].comment.length >= 15
                ? data[0].reviews.entries[0].comment.substring(0, 15) + " ..."
                : data[0].reviews.entries[0].comment}
              {}
            </p>
          </div>
        </div>
        <div className="right">
          <p className="time animated">12:30</p>
        </div>
      </div>
    );
  }

  function ChatHeader() {
    return (
      <div className="chat-header">
        <button
          className="transparent"
          onClick={() => {
            setNextView(1);
            console.log(nextView);
          }}
          style={{
            display: width < 650 ? "flex" : "none",
          }}
        >
          <ArrowBackIcon />
        </button>
        <div
          className="contact"
          role="button"
          autoFocus
          onClick={() => {
            setNextView(2);
          }}
        >
          <div className="user-info">
            <div className="left">
              <img src={data[0].image} alt="" />
               <div className="status"></div>
            </div>

            <div className="">
              <div>
                <h3>
                  {sampleName.length >= 15
                    ? sampleName.substring(0, 10) + " ..."
                    : sampleName}
                </h3>
                <p className="from"> {data[0].title}</p>
              </div>
            </div>
          </div>

          <div className="quick-icons">
            <button className="transparent">
              <VideocamIcon fontSize="small" />
            </button>
            <button className="transparent">
              <CallIcon fontSize="small" />
            </button>
            <button className="transparent">
              <MoreVertIcon fontSize="small" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleRenderOnPhone() {}

  return (
    <div>
      {!userType == "owner" && (
        <>
          <Head />
          <SideNav />
          <BottomTabs />
        </>
      )}
      {userType == "owner" && (
        <>
          <Header />
        </>
      )}
      <Container>
        <div className="chat">
          <div
            className="chat-list"
            style={{
              display:
                width > 650 ? "block" : nextView === 2 ? "none" : "block",
            }}
          >
            <div className="title">
              <h2> Messages</h2>
              <EditSquareIcon className="animated" />
            </div>

            <div className="list">
              <ChatListItem />
              <ChatListItem />
              <ChatListItem />
              <ChatListItem />
              <ChatListItem />
              <ChatListItem />
              <ChatListItem />
              <ChatListItem />
            </div>
          </div>
          <div
            className={`${`conversation ${
              nextView == 1 ? "show-in-phone" : width < 630 && "computer-only"
            }`} `}
            style={{
              display:
                width > 650
                  ? "block"
                  : nextView === 2
                  ? width < 650
                    ? "block"
                    : "none"
                  : "none",
            }}
          >
            <ChatHeader />
            <div className="chat-main">
              <div className="message">
                <img src={data[0].image} alt="" />
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message own">
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message">
                <img src={data[0].image} alt="" />
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message own">
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message">
                <img src={data[0].image} alt="" />
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message own">
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message">
                <img src={data[0].image} alt="" />
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message own">
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message">
                <img src={data[0].image} alt="" />
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message own">
                <div className="texts">
                  <img
                    src="https://unsplash.com/photos/a-young-girl-eating-a-fresh-peach-outdoors-BvZYHz9TeCk"
                    alt=""
                  />
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message">
                <img src={data[0].image} alt="" />
                <div className="texts">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div className="message own">
                <div className="texts">
                  <img src="/image.png" alt="" />
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Sint possimus nemo itaque laudantium modi impedit maxime
                    laboriosam officia quidem alias!
                  </p>
                  <span>2 m ago</span>
                </div>
              </div>
              <div ref={endRef}></div>
            </div>
            <div className="chat-footer">
              <div className="message-box">
                <button className="transparent"><ControlPointIcon fontSize="small" /></button>
                <textarea
                  name="message"
                  id=""
                  className="message-area transparent"
                  placeholder="Type a message"
                />{" "}
                <SentimentSatisfiedAltIcon fontSize="small" />{" "}
                <button className="transparent always-active">
                  <SendIcon />
                </button>
              </div>
              <p>Press Enter to send , Shift + Enter for new line</p>
            </div>
          </div>
        </div>
      </Container>
      {/* <Footer /> */}
    </div>
  );
}

export default Chat;
