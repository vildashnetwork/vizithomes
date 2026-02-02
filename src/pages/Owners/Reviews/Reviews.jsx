










// src/pages/Reviews/Reviews.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../Components/Header/Header";
import { Container, Footer } from "../../LandingPage/LandingPage";
import PageTitle from "../Components/PageTitle";
import { Ratings } from "../../PropertyDetails/PropertyDetails";

import ReplyIcon from "@mui/icons-material/Reply";
import SendIcon from "@mui/icons-material/Send";
import SouthIcon from "@mui/icons-material/South";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";

import { cleanString } from "../../../utils/cleanString";
import "./Reviews.css";

const API_BASE = "https://vizit-backend-hubw.onrender.com/api/house/houses";
const DECODE_OWNER = "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner";

/* ============================
   Small icon helper (unchanged)
============================ */
function BtnIcon({ inlineText }) {
  switch (cleanString(inlineText)) {
    case cleanString("All Reviews"):
      return <SouthIcon />;
    case cleanString("Newest First"):
      return <AutoModeIcon />;
    case cleanString("Unanswered"):
      return <MarkChatUnreadIcon />;
    default:
      return null;
  }
}

/* ============================
   Reviews Page (full)
============================ */
export default function Reviews() {
  const navigate = useNavigate();

  // owner info
  const [currentUser, setCurrentUser] = useState(null);
  const [decodingLoading, setDecodingLoading] = useState(true);

  // reviews & UI
  const [reviews, setReviews] = useState([]);
  const [reviewsInView, setReviewsInView] = useState([]);
  const [filter, setFilter] = useState([
    { title: "All Reviews", active: true },
    { title: "Newest First", active: false },
    { title: "Unanswered", active: false },
  ]);
  const [stats, setStats] = useState({
    total: 0,
    mean: 0,
    stars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loadingHouses, setLoadingHouses] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------------------
     Decode owner token (get currentUser)
     - uses the same decode endpoint you already use in your code
  --------------------------- */
  useEffect(() => {
    let mounted = true;

    async function decodeOwner() {
      try {
        setDecodingLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setDecodingLoading(false);
          return;
        }

        const res = await axios.get(DECODE_OWNER, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;
        if (res.status === 200 && res.data?.res) {
          setCurrentUser(res.data.res);
        }
      } catch (err) {
        console.error("Failed to decode token:", err);
      } finally {
        if (mounted) setDecodingLoading(false);
      }
    }

    decodeOwner();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------------------------
     Load houses -> filter by owner -> flatten reviews
  --------------------------- */
  const loadOwnerReviews = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      setLoadingHouses(true);
      setError(null);

      const res = await axios.get(API_BASE);
      const houses = res.data?.houses || [];

      // Filter houses owned by current owner (strict equality)
      const ownedHouses = houses.filter((h) => h.owner?.id === currentUser._id);

      // Flatten reviews and attach property metadata for UI
      const flattened = ownedHouses.flatMap((house) =>
        (house.reviews?.entries || []).map((entry) => ({
          ...entry,
          propertyId: house._id,
          propertyTitle: house.title,
          propertyImage: house.image,
          ownerId: house.owner?.id,
        }))
      );

      setReviews(flattened);
      setReviewsInView(flattened);
      computeStats(flattened);
    } catch (err) {
      console.error("Failed to fetch houses:", err);
      setError("Failed to load reviews. Check network or try again later.");
    } finally {
      setLoadingHouses(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadOwnerReviews();
  }, [currentUser, loadOwnerReviews]);

  /* ---------------------------
     Stats helper
  --------------------------- */
  function computeStats(arr) {
    const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    arr.forEach((r) => {
      const val = Number(r.rating) || 0;
      if (val >= 1 && val <= 5) stars[val] += 1;
      sum += val;
    });
    const total = arr.length;
    setStats({
      total,
      mean: total ? Math.round(sum / total) : 0,
      stars,
    });
  }

  function percentage(value) {
    if (!stats.total) return 0;
    return Math.ceil((value / stats.total) * 100);
  }

  /* ---------------------------
     Filter handling
  --------------------------- */
  function changeFilter(selected) {
    setFilter((prev) => prev.map((f) => ({ ...f, active: f.title === selected })));

    if (cleanString(selected) === cleanString("Unanswered")) {
      setReviewsInView(reviews.filter((r) => !r.replies || r.replies.length === 0));
    } else if (cleanString(selected) === cleanString("Newest First")) {
      setReviewsInView([...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } else {
      setReviewsInView(reviews);
    }
  }

  /* ---------------------------
     Reply handling (integrates with your backend)
     - endpoint used: POST `${API_BASE}/review/reply/${propertyId}`
     - payload: { reviewId, userId, isAdmin: true, text, name, email, profileImg }
     - includes Authorization header from localStorage.token
     - on success: updates the particular review in local state using server response
  --------------------------- */
  async function handleReply(reviewId, propertyId, text, setLocalLoading) {
    if (!text || !text.trim()) {
      alert("Please enter a reply before posting.");
      return;
    }

    try {
      if (setLocalLoading) setLocalLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be authenticated to reply.");
        return;
      }

      const payload = {
        reviewId,
        userId: currentUser?._id,
        isAdmin: true,
        text: text.trim(),
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        profileImg: currentUser?.profile || "",
      };

      const url = `${API_BASE}/review/reply/${propertyId}`;
      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // server may return updated review as res.data.review or res.data (handle both)
      const updatedReview = res.data?.review ?? res.data;

      if (!updatedReview) {
        throw new Error("Unexpected server response.");
      }

      // update local reviews state
      setReviews((prev) => {
        const next = prev.map((r) => {
          if ((r._id && r._id === reviewId) || (r.id && r.id === reviewId)) {
            // keep property metadata but replace review content with server version
            return {
              ...nextReviewPreserveMeta(r, updatedReview),
            };
          }
          return r;
        });
        // update derived view
        setReviewsInView(next);
        computeStats(next);
        return next;
      });
    } catch (err) {
      console.error("Reply failed:", err);
      alert(err.response?.data?.message || err.message || "Reply failed");
    } finally {
      if (setLocalLoading) setLocalLoading(false);
    }
  }

  // helper to preserve property metadata when replacing a review with updatedReview from server
  function nextReviewPreserveMeta(oldReview, updatedReview) {
    return {
      ...updatedReview,
      // preserve metadata fields attached by parent
      propertyId: oldReview.propertyId,
      propertyTitle: oldReview.propertyTitle,
      propertyImage: oldReview.propertyImage,
      ownerId: oldReview.ownerId,
    };
  }

  /* ---------------------------
     Individual Review Card - uses parent handleReply
     - prevents reply UI if a reply already exists
  --------------------------- */
  function ReviewCard({ r }) {
    const [text, setText] = useState("");
    const [localLoading, setLocalLoading] = useState(false);

    const alreadyReplied = Array.isArray(r.replies) && r.replies.length > 0;
    const ownerReplyText = alreadyReplied ? r.replies[0]?.text : null;
    //start

    const [usern, setusern] = useState("")
    const [myprofile, setmyprofile] = useState("")
    // get users by thier email
    useEffect(() => {
      if (!r?.id) return;
      let isMounted = true;

      const fetchusers = async () => {
        try {
          const getuser = await axios.get(
            `https://vizit-backend-hubw.onrender.com/api/user/onlyme/${r.id}`
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
    }, [r?.id]);


    //stop
    return (
      <div className="comment-review-card">
        <div className="user-profile">
          <div className="profile-details">
            <img src={myprofile} alt="" />
            <div>
              <h3>{usern}</h3>
              <p>reviewed “{r.propertyTitle || "Property"}”</p>
            </div>
          </div>


          <div className="user-rating">


            <p className="time">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
            <Ratings method="get" count={Number(r.rating) || 0} size="small" />


            <button className="button view-property-btn" onClick={() => navigate(`/property/${r.propertyId}`)}>
              View Property
            </button>

          </div>
        </div>

        <div className="review-comment">{r.comment}</div>


        {/* Reply UI: disabled when owner already replied */}
        {!alreadyReplied ? (
          <div className="review-reply-container">
            <p className="reply-btn">
              <ReplyIcon /> Reply to Review
            </p>

            <textarea
              placeholder="Reply to review"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={500}
            />

            <div className="send">
              <p>{text.length}/500</p>
              <button
                className="button"
                onClick={() => handleReply(r._id || r.id, r.propertyId, text, setLocalLoading)}
                disabled={localLoading}
              >
                {localLoading ? "Posting..." : "Post Reply"} <SendIcon />
              </button>
            </div>
          </div>
        ) : (
          <div className="reply-box">
            <span>Reply <ReplyIcon fontSize="small" /></span>
            <div className="reply-content">{ownerReplyText}</div>
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------
     Render
  --------------------------- */
  return (
    <div className="reviews">
      <Header />

      <Container>
        <PageTitle
          title="My Reviews & Ratings"
          subTitle="View analytics and respond to guest feedback"
        />

        {/* show error */}
        {error && <div className="mozart-error">{error}</div>}

        {/* Summary */}
        <div className="current-rating">
          <div className="summary">
            <div className="recap">
              <p className="count">{stats.mean}</p>
              <Ratings method="get" count={stats.mean} size="medium" />
              <span>Based on {stats.total} ratings</span>
            </div>

            <div className="insites">
              {[5, 4, 3, 2, 1].map((n) => (
                <div className="slider-container" key={n}>
                  <span className="number">{n}</span>
                  <div className="inner-shower">
                    <div className="indicator" style={{ width: `${percentage(stats.stars[n])}%` }} />
                  </div>
                  <div className="percentage">{percentage(stats.stars[n])}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
            {filter.map((f, i) => (
              <button key={i} className={`button ${f.active ? "active" : ""}`} onClick={() => changeFilter(f.title)}>
                <BtnIcon inlineText={f.title} />{f.title}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="comment-review-card-cont">
          {decodingLoading || loadingHouses ? (
            <div style={{ textAlign: "center", padding: 20 }}>Loading...</div>
          ) : reviewsInView.length ? (

            reviewsInView.slice() // prevents mutating original array (important in React)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((r) => <ReviewCard key={r._id || r.id} r={r} />)
          ) : (
            <p style={{ textAlign: "center" }}>Nothing to Display Here (:</p>
          )}
        </div>
      </Container>

      <Footer />
    </div>
  );
}
