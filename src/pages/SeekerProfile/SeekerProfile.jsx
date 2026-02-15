import React, { useEffect, useState } from "react";
import {
  BottomTabs,
  Container,
  Footer,
  Head,
  SectionHeader,
  SideNav,
} from "../LandingPage/LandingPage";
import ReelsPage from "./OwnerAddreels"
import "./spStyles.css";
import { data } from "../../data/listingdata";
import { flex, width } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import dayjs from "dayjs";
import { Ratings } from "../PropertyDetails/PropertyDetails";
import axios from "axios";
import toast from "react-hot-toast"
import ProfilePanel from "./Profile"
//?JHGKEWHGKJWGHKJH
//toDO
//!EX
Link;
function SaveListingCard({ img, title, location, price, id }) {
  const navigate = useNavigate();

  const [lloadremove, setloadremove] = useState(false)
  const deletesaved = async (propId) => {
    const confirmed = window.confirm("Are you sure you want to remove this property from saved listings?");

    if (!confirmed) return;

    try {
      setloadremove(true)
      const UserId = localStorage.getItem("userId")
      const res = await
        axios.put(`https://vizit-backend-hubw.onrender.com/api/user/remove/saved/house/${UserId}`,
          {
            houseId: propId
          }
        )
      if (res.status == 200) {
        toast.success("House removed from saved")
        navigate(`/property/${propId}`)
      }

    } catch (error) {
      toast.error("Failed to remove house");
      console.error(error);

    } finally {
      setloadremove(false)
    }
  }


  return (
    <div
      style={{
        minWidth: "150px",
        //  border:"solid 2px"
      }}
      className="saved-listing-card"
    >


      <img
        src={img}
        alt={`image of  ${title}`}
        width={100}
        className="saved-listing-card-img"
      />
      <div className="saved-listing-card-description">
        <h4>{title}</h4>

        <p
          style={{
            display: "flex",
            alignItems: "center",
            color: "#333333a1",
            textShadow: "0 0  1px #00000054",
          }}
        >
          {" "}
          <LocationOnOutlinedIcon
            fontSize="small"
            style={{ color: "#007e77ff" }}
          />
          {location.replace("Cameroon", "")}
        </p>
        <p className="saved-listing-price-tag">{price}/ Month</p>
        <div
          className="btns"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link className="details-btn-saved-listing" to={`/property/${id}`}>
            View Details
          </Link>
          <button
            className="remove-saved-listing"
            style={{ cursor: "pointer" }}
            onClick={() => {
              deletesaved(id)
            }}
          >
            {lloadremove ? "removing.." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
function TabNavigator({ buttonList, callback, array, customstyles }) {
  customstyles = {};
  return (
    <div className="tab-navigator-container" style={{ position: "sticky" }}>
      {buttonList.map((buttonObj, key) => {
        return (
          <button
            key={key}
            style={{
              backgroundColor: buttonObj.style ? "#00474DFF" : "white",
              color: buttonObj.style ? "white" : "",
              fontSize: "1.1em",
            }}
            onClick={() => {
              // Create a copy of the array to avoid mutating state directly
              let newArray = array.map((_, i) => i === key);

              console.log(newArray);

              callback(newArray);
            }}
          >
            <span className="do-not-show">{buttonObj.title}</span>
          </button>
        );
      })}
    </div>
  );
}

function SeekerProfile() {
  const [currentNavigation, setCurrentNavigation] = useState([
    true,
    false,
    false,
  ]);
  const [currentReviewSort, setCurrentReviewSort] = useState([
    true,
    false,
    false,
  ]);
  const [user, setuser] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")

  const decoding = async () => {
    try {
      if (!token) {
        console.warn("No token found")
        setLoading(false)
        return
      }

      const res = await axios.get(
        "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setuser(res.data.user);
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
      const res = await axios.get(`https://vizit-backend-hubw.onrender.com/api/apointment/user/${userId}`)
      console.log('====================================');
      console.log("userId", userId);
      console.log('====================================');
      if (res.status == 200) {
        setsampleAppointmentData(res.data);
        console.log('====================================');
        console.log("sampleAppointmentData", sampleAppointmentData);
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
  }, [token])


  //get saved houuses

  const [HouseIds, setHouseIds] = useState([])

  const savedhouses = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const res = await
        axios.get(`https://vizit-backend-hubw.onrender.com/api/user/saved/houses/${userId}`);

      if (res.status == 200) {
        setHouseIds(res.data.savedHouses)
      }

    } catch (error) {
      console.error(error);

    }
  }
  useEffect(() => {
    savedhouses().then(() => {
      if (!HouseIds) return;
    })
  }, [token])

  const [filteredHouse, setFilteredHouse] = useState([])
  const filterdatabyHouseIds = async () => {
    try {
      if (HouseIds.length > 0) {
        const filtered = data.filter((item) => HouseIds.includes(item.listingId));
        setFilteredHouse(filtered);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    filterdatabyHouseIds();
  }, [HouseIds]);
  //filter listing of only this listingId 

  const [onlyspecific, setOnlyspecific] = useState(null);

  useEffect(() => {
    if (sampleAppointmentData.length > 0) {
      const filtered = data.find(
        (item) => item.listingId === sampleAppointmentData[0]?.listingId
      );
      setOnlyspecific(filtered);
    }
  }, [sampleAppointmentData]);


  const [loaddelete, setloaddelte] = useState(false)

  const deleteapp = async (id) => {
    try {
      setloaddelte(true)
      const res = await axios.delete(`https://vizit-backend-hubw.onrender.com/api/apointment/${id}`)

      if (res.status == 200) {
        toast.success(res?.data)
      }

    } catch (error) {
      console.log('====================================');
      console.log(error);
      toast.error(error)
      console.log('====================================');
    } finally {
      setloaddelte(false)
    }
  }


  // const deletesaved = async ()=>{
  //   try {
  //     const res
  //   } catch (error) {
  //     console.error(error);

  //   }
  // }

  return (
    <>
      <Head  user = {user}/>
      <SideNav />
      <Container>
        <SectionHeader
          title={"Seeker Profile Dashboard"}
          description={
            "Manage Your saved properties, track your reviewing appointments  and Manage Your feedback."
          }
        />
        <ReelsPage />
        <div className="skp-flex-row">
          <TabNavigator
            array={currentNavigation}
            callback={setCurrentNavigation}
            buttonList={[
              { title: "Saved Listings", style: currentNavigation[0] },
              { title: "Appointments", style: currentNavigation[1] },
              // { title: "My Reviews & Ratings", style: currentNavigation[2] },
            ]}
          />
        </div>
        <div
          className="hoho"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <main
            style={{
              backgroundColor: "",
              padding: "30px 10px ",
              borderTop: "solid 2px #333",
              width: "80vw",
              display: currentNavigation[0] ? "grid" : "block",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "30px",
              margin: "10px 0px",
              overflowX: currentNavigation[1] ? "scroll" : "",

              // display:"flex"B
            }}
          >
            {currentNavigation[0] ? (
              filteredHouse.map((listing, i) => {
                return (
                  <SaveListingCard
                    key={i}
                    img={listing.image}
                    title={listing.title}
                    location={listing.location.address}
                    price={listing.rent}
                    id={listing.listingId}
                  />
                );
              })

            ) : currentNavigation[1] ? (
              // <TabNavigator
              //   array={currentReviewSort}
              //   callback={setCurrentReviewSort}
              //   buttonList={[
              //     { title: "Saved Listings", style: currentReviewSort[0] },
              //     { title: "Appointments", style: currentReviewSort[1] },
              //     { title: "My Reviews & Ratings", style: currentReviewSort[2] },
              //   ]}
              // />
              <div style={{ width: "100%" }}>
                <table>
                  <thead>
                    <tr>
                      <th>Property Name</th>
                      <th> Date and Time</th>
                      <th> Status</th>
                      <th> Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleAppointmentData.map((item) => {
                      return (
                        <tr
                          className="table-row"
                          style={{
                            border: "2px solid black",
                          }}
                        >
                          <td>
                            <h4>{onlyspecific?.title}</h4>
                            <p
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "#444",
                              }}
                            >
                              <span className="desktop-only">
                                <LocationOnOutlinedIcon fontSize="small" />{" "}
                                {onlyspecific?.location?.address?.replace("Cameroon", "")}
                              </span>
                            </p>
                          </td>
                          <td>
                            {item?.date} | {" "} {" "}
                            {item?.time}
                          </td>
                          <td>{item?.status}</td>
                          <td>
                            <div
                              style={{
                                // border:"solid 2px red",
                                display: "flex",
                                gap: "10px",
                                justifyContent: "start",
                              }}
                            >
                              <button
                                className="btn-actions btn-danger"
                                onClick={() => {
                                  deleteapp(item._id)
                                }}
                              >
                                {loaddelete ? "deleting.." : "Delete Appointment"}
                              </button>
                              {/* <button
                                className="btn-actions btn-neutral"
                                onClick={() => {
                                  alert("Appointment Has been Rescheduled");
                                }}
                              >
                                Reschedule
                              </button> */}
                              {/* <button
                                className="btn-actions btn-success"
                                onClick={() => {
                                  alert(
                                    "Appointment Has been marked as Completed"
                                  );
                                }}
                              >
                                Mark as Completed{" "}
                              </button> */}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rating-and-reviews">
                {data.map((item, index) => {
                  return (
                    <div className="review-card">
                      <img src={item.image} alt={"yoooo"} width={150} />
                      <div className="ratings-and-reviews-data">
                        <div>
                          <h4>{item.title}</h4>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              color: "rgba(20, 20, 20, 1)",
                            }}
                          >
                            <LocationOnOutlinedIcon fontSize="small" />{" "}
                            {item.location.address.replace(", Cameroon", "")}
                          </div>
                        </div>

                        <p className="comment-comment">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Necessitatibus eaque tenetur quasi id minus
                          obcaecati corporis ut cumque architecto at, iusto
                          voluptatem tempore, expedita molestiae officia?
                          Consectetur eaque tempore soluta.
                        </p>
                      </div>
                      <div className="review-ratings">
                        <div className="ratings">
                          <Ratings
                            method="get"
                            size={"large"}
                            count={item.reviews.entries[0].rating}
                          />
                        </div>
                        <div className="action-buttons-comment">
                          <button
                            className="btn-neutral"
                            onClick={() => {
                              alert("Review Edited Successfully");
                            }}
                          >
                            Edit Review
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => {
                              alert("Review Edited Successfully");
                            }}
                          >
                            Delete Review
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </Container>
      <ProfilePanel userhere={user} />
      <Footer />
      <BottomTabs />
    </>
  );
}

export default SeekerProfile;
