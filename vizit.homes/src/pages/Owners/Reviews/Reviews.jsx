// import React, { useState } from "react";
// import Header from "../Components/Header/Header";
// import { Container, Footer } from "../../LandingPage/LandingPage";
// import PageTitle from "../Components/PageTitle";
// import { Ratings } from "../../PropertyDetails/PropertyDetails";
// import "./Reviews.css";
// import { data } from "../../../data/listingdata";

// import ReplyIcon from "@mui/icons-material/Reply";
// import SendIcon from "@mui/icons-material/Send";
// import SouthIcon from "@mui/icons-material/South";
// import AutoModeIcon from "@mui/icons-material/AutoMode";
// import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
// import { cleanString } from "../../../utils/cleanString";
// // Single review data
// const sampleReview = {
//   seeker: "John Doe",
//   stayedAtBuilding: "Skyline Apartments",
//   timeOfReview: "2 weeks ago",
//   reviewComment:
//     "Great location and excellent amenities! The staff was very helpful and the apartment was clean and well-maintained. Would definitely recommend.",
//   existingReply: null, // or a reply string if it exists
//   rating: 4, // optional, for Ratings component
// };

// // Multiple reviews data
// const sampleReviews = [
//   {
//     id: 1,
//     seeker: "Alice Johnson",
//     stayedAtBuilding: "Riverside Tower",
//     timeOfReview: "3 days ago",
//     reviewComment:
//       "Beautiful view of the river from the balcony. The apartment was modern and had all necessary appliances. The neighborhood is quiet and safe.",
//     existingReply:
//       "Thank you for your feedback, Alice! We're glad you enjoyed your stay.",
//     rating: 5,
//   },
//   {
//     id: 2,
//     seeker: "Michael Chen",
//     stayedAtBuilding: "City Center Lofts",
//     timeOfReview: "1 week ago",
//     reviewComment:
//       "Good value for money. The location is perfect for exploring downtown. However, the walls are a bit thin so you can hear neighbors occasionally.",
//     existingReply: null,
//     rating: 3,
//   },
//   {
//     id: 3,
//     seeker: "Sarah Williams",
//     stayedAtBuilding: "Gardenview Complex",
//     timeOfReview: "1 month ago",
//     reviewComment:
//       "Loved the community garden and pool area. Maintenance was prompt when we had an issue with the AC. Would stay here again!",
//     existingReply:
//       "We appreciate your kind words, Sarah! Looking forward to hosting you again.",
//     rating: 5,
//   },
//   {
//     id: 4,
//     seeker: "Robert Garcia",
//     stayedAtBuilding: "Mountain View Apartments",
//     timeOfReview: "2 months ago",
//     reviewComment:
//       "The apartment was spacious and well-furnished. Parking was a bit challenging during weekends, but overall a good experience.",
//     existingReply: null,
//     rating: 4,
//   },
// ];

// // Example with avatar images
// const sampleReviewsWithAvatars = [
//   {
//     id: 1,
//     seeker: "Alex Johnson",
//     stayedAtBuilding: "Skyline Tower Apartments",
//     timeOfReview: "3 days ago",
//     reviewComment:
//       "Absolutely loved my stay! The view from the 25th floor was breathtaking. The apartment was clean, modern, and had all the amenities I needed. The concierge service was exceptional.",
//     existingReply:
//       "Thank you Alex! We're delighted you enjoyed the views and our concierge service. We hope to welcome you back soon!",
//     image: "https://randomuser.me/api/portraits/men/32.jpg",
//     theirRating: 5,
//   },
//   {
//     id: 2,
//     seeker: "Maria Garcia",
//     stayedAtBuilding: "Riverside Lofts",
//     timeOfReview: "1 week ago",
//     reviewComment:
//       "Good location near restaurants and public transport. The apartment was comfortable but the kitchen could use better lighting. The building gym is well-equipped though!",
//     existingReply: null, // No reply yet - shows reply form
//     image: "https://randomuser.me/api/portraits/women/44.jpg",
//     theirRating: 4,
//   },
//   {
//     id: 3,
//     seeker: "James Wilson",
//     stayedAtBuilding: "City Center Residences",
//     timeOfReview: "2 weeks ago",
//     reviewComment:
//       "The apartment was exactly as advertised. Great downtown location, easy check-in process. However, the street noise at night was louder than expected. Earplugs helped!",
//     existingReply:
//       "Hi James, thanks for your honest feedback. We'll look into noise reduction solutions for the street-facing units.",
//     image: "https://randomuser.me/api/portraits/men/67.jpg",
//     theirRating: 5,
//   },
//   {
//     id: 4,
//     seeker: "Sophie Chen",
//     stayedAtBuilding: "Gardenview Complex",
//     timeOfReview: "1 month ago",
//     reviewComment:
//       "Beautiful community garden and friendly neighbors. Perfect for pet owners - my dog loved the dog park. The apartment maintenance team was very responsive when our AC had issues.",
//     existingReply:
//       "We're so glad you and your furry friend enjoyed our amenities, Sophie! Our maintenance team is available 24/7.",
//     image: "https://randomuser.me/api/portraits/women/28.jpg",
//     theirRating: 3,
//   },
//   {
//     id: 5,
//     seeker: "David Miller",
//     stayedAtBuilding: "Lakeside Apartments",
//     timeOfReview: "2 months ago",
//     reviewComment:
//       "Disappointed with the cleanliness upon arrival. Found dust in corners and the refrigerator wasn't cleaned from previous tenant. Location is good but expected better for the price.",
//     existingReply: null, // No reply - management can reply using the form
//     image: "https://randomuser.me/api/portraits/men/51.jpg",
//     theirRating: 5,
//   },

//   {
//     id: 6,
//     seeker: "Olivia Thompson",
//     stayedAtBuilding: "Harbor View Residences",
//     timeOfReview: "Just now",
//     reviewComment:
//       "This was my second stay and it was just as wonderful as the first! The sunset views over the harbor are incredible. Management is very professional and helpful.",
//     existingReply:
//       "Welcome back Olivia! We're thrilled you chose to stay with us again. Those harbor sunsets never get old!",
//     image: "https://randomuser.me/api/portraits/women/33.jpg",
//     theirRating: 2,
//   },
//   {
//     id: 7,
//     seeker: "Olivia Thompson",
//     stayedAtBuilding: "Harbor View Residences",
//     timeOfReview: "Just now",
//     reviewComment:
//       "This was my second stay and it was just as wonderful as the first! The sunset views over the harbor are incredible. Management is very professional and helpful.",
//     existingReply:
//       "Welcome back Olivia! We're thrilled you chose to stay with us again. Those harbor sunsets never get old!",
//     image: "https://randomuser.me/api/portraits/women/33.jpg",
//     theirRating: 2,
//   },
// ];

// function BtnIcon({ inlineText }) {
//   switch (cleanString(inlineText)) {
//     case cleanString("All Reviews"):
//       return <SouthIcon />;
//     case cleanString("Newest First"):
//       return <AutoModeIcon />;
//     case cleanString("Unanswered"):
//       return <MarkChatUnreadIcon />;
//   }
// }

// function Reviews() {
//   function RatingPerValue({ value, percentage }) {
//     return (
//       <div className="slider-container">
//         <span className="number">{value}</span>
//         <div className="inner-shower">
//           <div
//             className="indicator"
//             style={{
//               width: `${percentage}%`,
//             }}
//           ></div>
//         </div>
//         <div className="percentage" style={{ width: "40px" }}>
//           {percentage}%
//         </div>
//       </div>
//     );
//   }

//   function ReviewCard({
//     seeker,
//     stayedAtBuilding,
//     timeOfReview,
//     reviewComment,
//     existingReply,
//     image,
//     theirRating,
//   }) {
//     const [text, setText] = useState("");
//     const [characterCount, setCharacterCount] = useState(text.length);
//     const [reply, setReply] = useState(existingReply);

//     return (
//       <div className="comment-review-card">
//         <div className="user-profile">
//           <div className="profile-details">
//             <div>
//               <img src={image || data[0].image} alt="" />
//             </div>
//             <div>
//               <h3>{seeker}</h3>
//               <p>stayed at "{stayedAtBuilding}"</p>
//             </div>
//           </div>
//           <div className="user-rating">
//             <p className="time">{timeOfReview}</p>
//             <Ratings method={"get"} size={"small"} count={theirRating} />
//           </div>
//         </div>
//         <div className="review-comment">{reviewComment}</div>
//         {!reply && (
//           <div className="review-reply-container">
//             <p className="reply-btn">
//               {" "}
//               <ReplyIcon />
//               <span>Reply to Review</span>
//             </p>
//             <textarea
//               id="textarea"
//               type="text"
//               placeholder="Reply to review"
//               value={text}
//               onChange={(e) => {
//                 if (e.nativeEvent.data === null) {
//                   setText(e.target.value);
//                   setCharacterCount(text.length);
//                   console.log(e.nativeEvent.data);
//                 }
//                 if (text.length - 1 !== 500) {
//                   setText(e.target.value);
//                   setCharacterCount(text.length);
//                 }
//               }}
//             />
//             <div className="send">
//               <p>{characterCount}/500</p>
//               <button
//                 className="button"
//                 onClick={() => {
//                   setReply(text);
//                 }}
//               >
//                 {" "}
//                 Post Reply <SendIcon />
//               </button>
//             </div>
//           </div>
//         )}
//         {reply && (
//           <div
//             className=""
//             style={{
//               // borderLeft:"2px solid grey",
//               paddingLeft: "20px",
//             }}
//           >
//             <span
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 fontSize: "12px",
//                 fontStyle: "italic",
//               }}
//             >
//               Reply <ReplyIcon fontSize="small" />
//             </span>
//             {
//               <div
//                 style={{
//                   borderLeft: "2px solid grey",
//                   paddingInline: "10px",
//                   backgroundColor: "rgba(95, 95, 95, 0.02)",
//                   padding: "10px ",
//                   // borderRadius:"5px"
//                 }}
//               >
//                 {reply}
//               </div>
//             }
//           </div>
//         )}
//       </div>
//     );
//   }
//   const [filter, setFilter] = useState([
//     { title: "All Reviews", active: true },
//     { title: "Newest First", active: false },
//     { title: "Unanswered", active: false },
//   ]);
//   function getRatingPerDigit(digit) {
//     let init = 0;
//     for (let i = 0; i <= sampleReviewsWithAvatars.length - 1; i++) {
//       if (sampleReviewsWithAvatars[i].theirRating === digit) {
//         init += 1;
//       }
//     }
//     return init;
//   }

//   function formatRating(rating) {
//     return Math.ceil((rating / sampleReviewsWithAvatars.length) * 100);
//   }
//   const [stars5, setStars5] = useState(getRatingPerDigit(5));
//   const [stars4, setStars4] = useState(getRatingPerDigit(4));
//   const [stars3, setStars3] = useState(getRatingPerDigit(3));
//   const [stars2, setStars2] = useState(getRatingPerDigit(2));
//   const [stars1, setStars1] = useState(getRatingPerDigit(1));

//   const [reviewsInView, setReviewsInView] = useState(sampleReviewsWithAvatars);

//   const [totalReviews, setTotalReviews] = useState(
//     sampleReviewsWithAvatars.length
//   );

//   const [meanRating, setMeanRatings] = useState(
//     Math.floor(
//       (1 * stars1 + 2 * stars2 + stars3 * 3 + stars4 * 4 + stars5 * 5) /
//         totalReviews
//     )
//   );

//   function changeFilter(nextCurrent) {
//     let arr = [];
//     filter.map((filt) => {
//       if (cleanString(filt.title) == cleanString(nextCurrent)) {
//         filt.active = true;
//         arr.push(filt);
//         let newRevs = [];

//         if (cleanString(filt.title) === cleanString("Unanswered"))
//           newRevs = sampleReviewsWithAvatars.filter(
//             (review) => review.existingReply === null
//           );
//         if (cleanString(filt.title) === cleanString("Newest First"))
//           // newRevs = sampleReviewsWithAvatars.sort((review,next) => review);
//           console.log("TODO : FIX THIS PLEASE ME :(");

//         if (cleanString(filt.title) == cleanString("All Reviews"))
//           newRevs = sampleReviewsWithAvatars;
//         setReviewsInView(newRevs);
//       } else {
//         filt.active = false;
//         arr.push(filt);
//       }
//     });
//     setFilter(arr);
//   }
//   return (
//     <div className="reviews">
//       <Header />
//       <Container>
//         <PageTitle
//           title={"My Reviews & Ratings"}
//           subTitle={"View analytics and respond to guess feedback"}
//         ></PageTitle>
//         <div className="current-rating">
//           <div className="summary">
//             <div className="recap">
//               <p className="count">{meanRating}</p>
//               <Ratings method={"get"} count={meanRating} size={"medium"} />
//               <span>Based on {totalReviews} ratings </span>
//             </div>
//             <div className="insites">
//               <RatingPerValue value={5} percentage={formatRating(stars5)} />
//               <RatingPerValue value={4} percentage={formatRating(stars4)} />
//               <RatingPerValue value={3} percentage={formatRating(stars3)} />
//               <RatingPerValue value={2} percentage={formatRating(stars2)} />
//               <RatingPerValue value={1} percentage={formatRating(stars1)} />
//             </div>
//           </div>
//           <div className="filters">
//             {filter.map((_, _i) => {
//               return (
//                 <button
//                   key={_i}
//                   className={`button ${_.active ? "active" : " "}`}
//                   onClick={() => changeFilter(_.title)}
//                 >
//                   <BtnIcon inlineText={_.title} />
//                   {_.title}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="comment-review-card-cont">
//           {reviewsInView.length >= 1 &&
//             reviewsInView.map((review) => (
//               <ReviewCard
//                 key={review.id}
//                 seeker={review.seeker}
//                 stayedAtBuilding={review.stayedAtBuilding}
//                 timeOfReview={review.timeOfReview}
//                 reviewComment={review.reviewComment}
//                 existingReply={review.existingReply}
//                 image={review.image}
//                 theirRating={review.theirRating}
//               />
//             ))}
//           {reviewsInView.length < 1 && (
//             <p style={{ display: "flex", justifyContent: "center" }}>
//               Nothing to Display Here (:
//             </p>
//           )}
//         </div>
//       </Container>
//       <Footer />
//     </div>
//   );
// }

// export default Reviews;













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

    return (
      <div className="comment-review-card">
        <div className="user-profile">
          <div className="profile-details">
            <img src={r.profileImg || r.propertyImage || ""} alt="" />
            <div>
              <h3>{r.name || "Guest"}</h3>
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
            reviewsInView.map((r) => <ReviewCard key={r._id || r.id} r={r} />)
          ) : (
            <p style={{ textAlign: "center" }}>Nothing to Display Here (:</p>
          )}
        </div>
      </Container>

      <Footer />
    </div>
  );
}
