import React, { useCallback, useState } from "react";
import Header, { SideNav } from "../Components/Header/Header";
import {
  biuldingTypes,
  Container,
  Footer,
} from "../../LandingPage/LandingPage";
import "./Listings.css";
import { useDropzone } from "react-dropzone";

import AddIcon from "@mui/icons-material/Add";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import PageTitle from "../Components/PageTitle";
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
import ApartmentIcon from "@mui/icons-material/Apartment";
import SearchIcon from "@mui/icons-material/Search";
import SouthIcon from "@mui/icons-material/South";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import BedIcon from "@mui/icons-material/Bed";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CurrencyFrancIcon from '@mui/icons-material/CurrencyFranc';
// import SquareFootIcon from '@mui/icons-material/Straighten'
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import BathroomIcon from "@mui/icons-material/Bathroom";
import { cleanString } from "../../../utils/cleanString";
import { data } from "../../../data/listingdata";
import { star } from "ionicons/icons";
import Modal from "../Components/Modal";
import {
  inputGroupContainerStyles,
  inputInContainerStyles,
  labelStyles,
  modalMain,
} from "../Appointments/Appointments";
import { amenities } from "../../SearchPropertyPage/SearchProperty";
import { findIcon } from "../../PropertyDetails/PropertyDetails";
export function btnInFormStyles(bgColor) {
  return {
    padding: "10px 15px",
    border: "none",
    color: "white",
    borderRadius: "8px",
    backgroundColor: bgColor,
  };
}
export function getBtnGroupStyles() {
  return {
    display: "flex",
    gap: "10px",
    padding: "10px 5px 2px 5px",
    width: "100%",
    justifyContent: "flex-end",
  };
}
function Listings() {
  // drag and drop library
  function UploadFile({ fileStorageVariableFunc, multiply }) {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
      // We map the files to add a 'preview' property using URL.createObjectURL
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { "image/*": [] }, // Only accept images
      multiple: multiply, // Set to true if you want multiple uploads
      // console.log()
    });
    console.log(multiply);
    return (
      <div>
        {/* 1. The Dropzone Area */}
        <div
          {...getRootProps()}
          style={{
            width: "300px",
            height: "40px",
            cursor: "pointer",
            border: isDragActive ? "dashed 1px grey" : " solid 1px grey",
            borderRadius: "5px",
            padding: "5px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p
              style={{
                color: "blue",
                fontSize: "medium",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AddIcon />
              Drop the files here ...
            </p>
          ) : (
            <p style={{ color: "grey", display: "flex", alignItems: "center" }}>
              <AddIcon />
              drop image | select file
            </p>
          )}
        </div>

        {/* 2. The Preview Gallery */}
        <div className="images-container">
          <div
            className="flex mt-4 gap-4"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              margin: "20px 0 ",
            }}
          >
            {files.map((file) => (
              <div
                key={file.name}
                style={{
                  width: " 80px",
                  height: " 80px",
                  backgroundImage: `url(${file.preview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  padding: "10px",
                  borderRadius: "10px",
                  // display: lThumbnail === "" ? "flex" : "none"
                }}
              >
                {}
                <img
                  style={{
                    display: "none",
                  }}
                  src={file.preview}
                  className=""
                  onLoad={() => {
                    fileStorageVariableFunc(file);
                    alert(files);
                    URL.revokeObjectURL(file.preview);
                  }} // Clean up memory
                  alt="preview"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  //end library

  function BtnIcon({ inlineText }) {
    switch (cleanString(inlineText)) {
      case cleanString("All Status"):
        return <SouthIcon />;
      case cleanString("Active"):
        return <CheckIcon />;
      case cleanString("Draft"):
        return <SaveAsIcon />;
      case cleanString("Rented"):
        return <ReceiptIcon />;
      default:
        return <CalendarMonthIcon />;
    }
  }

  const [filter, setFilter] = useState([
    { title: "All Status", active: true },
    { title: "Active", active: false },
    { title: "Draft", active: false },
    { title: "Rented", active: false },
  ]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(5);
  const [nextFormGroup, setNextFormGroup] = useState(1);
  const [nextAmenityNav, setNextAmenityNav] = useState(1);

  const [showAddListingModal, setShowAddListingModal] = useState(false);
  function handleAddNewListings() {
    setShowAddListingModal((prev) => !prev);
  }

  function FormNavigation() {
    return (
      <div style={getBtnGroupStyles()}>
        {nextFormGroup >= 2 && (
          <button
            style={btnInFormStyles("#5a5857ff")}
            onClick={() => setNextFormGroup((prev) => prev - 1)}
          >
            Back
          </button>
        )}
        {nextFormGroup <= 5 && (
          <button
            style={btnInFormStyles("#014631ff")}
            type="submit"
            onClick={() => {
              setNextFormGroup((prev) => prev + 1);
            }}
          >
            Next
          </button>
        )}
      </div>
    );
  }
  function AmenityNavigation() {
    return (
      <div style={getBtnGroupStyles()}>
        {nextAmenityNav >= 2 && (
          <button
            style={btnInFormStyles("transparent")}
            onClick={() => setNextAmenityNav((prev) => prev - 1)}
          >
            <KeyboardArrowLeftIcon
              style={{
                color: "black",
              }}
            />
          </button>
        )}
        {nextAmenityNav <= 3 && (
          <button
            style={btnInFormStyles("transparent")}
            type="button"
            onClick={() => {
              setNextAmenityNav((prev) => prev + 1);
            }}
          >
            <ChevronRightIcon
              style={{
                color: "black",
              }}
            />
          </button>
        )}
      </div>
    );
  }

  // const [listingDataToDisplay,setListingsDataToDisplay] = useState([])
  let loadedData = [];
  const [filteredData, setFilteredData] = useState(data);
  for (let i = start; i <= end; i++) {
    if (i <= data.length - 1) {
      loadedData.push(filteredData[i - 1]);
    } else {
      setEnd(i - 1);
      break;
    }
  }

  // setListingsDataToDisplay(loadedData)

  function ListingCard({ listing }) {
    return (
      <tr>
        <td className="table-data">
          <div className="property-details">
            <div>
              <img src={listing.image} alt="" />
            </div>
            <div>
              <h3>{listing.title}</h3>
              <p>{listing.location.address}</p>
            </div>
          </div>
        </td>
        <td className="table-data">
          <div className="property-details">
            <div style={{ display: "flex" }}>
              <h3>{listing.rent}</h3>
            </div>
            <div
              style={{
                display: "block",
              }}
            >
              <p>/Month</p>
            </div>
          </div>
        </td>
        <td className="table-data">
          {listing.isAvailable && (
            <div className="batch">
              <FiberManualRecordIcon style={{ fontSize: "small" }} />
              active
            </div>
          )}
        </td>
        <td className="table-data">2 hours ago</td>
        <td className="table-data">
          <div className="actions">
            <button>
              <BarChartIcon />
            </button>
            <button>
              <ModeEditIcon />
            </button>
            <button>
              <DeleteIcon />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  function changeFilter(nextCurrent) {
    let arr = [];
    filter.map((filt) => {
      if (cleanString(filt.title) == cleanString(nextCurrent)) {
        filt.active = true;
        arr.push(filt);
        let newListings = [];

        if (cleanString(filt.title) == "rented")
          newListings = filteredData.filter(
            (listing) => listing.status == "rented"
          );
        else if (cleanString(filt.title) == "draft")
          newListings = filteredData.filter(
            (listing) => listing.status == "draft"
          );
        else if (cleanString(filt.title) == cleanString("All Status"))
          newListings = data;
        else if (cleanString(filt.title) == cleanString("active"))
          newListings = filteredData.filter(
            (listing) => listing.status == "active"
          );
        else {
          newListings = [];
        }

        setFilteredData(newListings);
      } else {
        filt.active = false;
        arr.push(filt);
      }
    });
    setFilter(arr);
  }
  //form data
  const [lTitle, setLTitle] = useState("");
  const [lThumbnail, setLThumbnail] = useState(null);

  //end form data

  return (
    <div className="listings">
      <Header />
      <Container>
        <PageTitle
          title={"My Listings "}
          subTitle={"Manage and track your property portfolio"}
          buttonText={"Create New Listings"}
          btnFunction={handleAddNewListings}
        />
        {showAddListingModal && (
          <Modal>
            <form action="">
              <div style={modalMain}>
                <h3 style={{ width: "100%", textAlign: "center" }}>
                  Add a New Listing
                </h3>
                <div>
                  <div
                    style={{
                      display: nextFormGroup == 1 ? "block" : "none",
                    }}
                  >
                    <label htmlFor="" style={labelStyles}>
                      Property Title (Name)
                    </label>
                    <div style={inputGroupContainerStyles}>
                      <ApartmentIcon style={{ color: "#035e4aff" }} />
                      <input
                        type="text"
                        style={inputInContainerStyles}
                        placeholder="Listing Title"
                        required
                        // onChange={(e) => setNAContact(e.target.value)}
                      />
                    </div>
                    <label htmlFor="" style={labelStyles}>
                      Property Thumbnail
                    </label>

                    <UploadFile
                      fileStorageVariable={setLThumbnail}
                      multiply={false}
                    />
                    <FormNavigation />
                  </div>

                  <div
                    style={{
                      display: nextFormGroup == 2 ? "block" : "none",
                    }}
                  >
                    <label htmlFor="" style={labelStyles}>
                      Property Images (Max 10)
                    </label>
                    <UploadFile
                      fileStorageVariable={setLThumbnail}
                      multiply={true}
                    />
                    <FormNavigation />
                  </div>

                  <div
                    style={{
                      display: nextFormGroup == 3 ? "block" : "none",
                      width: "300px",
                    }}
                  >
                    <label htmlFor="" style={labelStyles}>
                      Property Type
                    </label>

                    <div style={inputGroupContainerStyles}>
                      <ApartmentIcon style={{ color: "#035e4aff" }} />
                      <select
                        style={inputInContainerStyles}
                        // onChange={(e) => setNAProperty(e.target.value)}
                      >
                        <option value="nothing">
                          Select The Property Type
                        </option>

                        {biuldingTypes.map((_, i) => {
                          return (
                            <option value={_} key={i}>
                              {_}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <label htmlFor="" style={labelStyles}>
                      Rent (Price ) in Francs
                    </label>
                    <div style={inputGroupContainerStyles}>
                      <CurrencyFrancIcon style={{ color: "#035e4aff" }} />
                      <input
                        type="number"
                        style={inputInContainerStyles}
                        placeholder="Listing Rent"
                        required
                        // onChange={(e) => setNAContact(e.target.value)}
                      />
                    </div>
                    <FormNavigation />
                  </div>
                  <div
                    style={{
                      display: nextFormGroup == 4 ? "block" : "none",
                      width: "300px",
                    }}
                  >
                    <label htmlFor="" style={labelStyles}>
                      Number of Bedrooms
                    </label>
                    <div style={inputGroupContainerStyles}>
                      <BedIcon style={{ color: "#035e4aff" }} />
                      <input
                        type="number"
                        style={inputInContainerStyles}
                        placeholder="Bedroom Count"
                        required
                        // onChange={(e) => setNAContact(e.target.value)}
                      />
                    </div>
                    <label htmlFor="" style={labelStyles}>
                      Number of Bathrooms
                    </label>
                    <div style={inputGroupContainerStyles}>
                      <BathroomIcon style={{ color: "#035e4aff" }} />
                      <input
                        type="number"
                        style={inputInContainerStyles}
                        placeholder="Bathroom Count"
                        required
                        // onChange={(e) => setNAContact(e.target.value)}
                      />
                    </div>
                    <FormNavigation />
                  </div>
                  <div
                    style={{
                      display: nextFormGroup == 5 ? "block" : "none",
                      width: "300px",
                    }}
                  >
                    <label htmlFor="" style={labelStyles}>
                      Area Coverage (m <sup style={{ fontSize: "12px" }}>2</sup>
                      )
                    </label>
                    <div style={inputGroupContainerStyles}>
                      <SquareFootIcon style={{ color: "#035e4aff" }} />
                      <input
                        type="number"
                        style={inputInContainerStyles}
                        placeholder="Area Coverage"
                        required
                        // onChange={(e) => setNAContact(e.target.value)}
                      />
                    </div>
                    <label htmlFor="" style={labelStyles}>
                      Available Amenities
                    </label>
                    <div
                      style={{
                        display: nextAmenityNav == 1 ? "block" : "none",
                      }}
                    >
                      <p style={{ color: "grey" }}>Interior Design</p>
                      {amenities.interiorFeatures.map((_, i) => {
                        return (
                          <>
                            <div style={inputGroupContainerStyles} key={i}>
                              {/* <BathroomIcon style={{ color: "#035e4aff" }} /> */}
                              <input
                                type="checkbox"
                                style={inputInContainerStyles}
                                // onChange={(e) => setNAContact(e.target.value)}
                              />
                              {findIcon(_, "small")}
                              <span>{_}</span>
                            </div>
                            <div style={{ height: "5px" }}></div>
                          </>
                        );
                      })}
                      <AmenityNavigation />
                    </div>
                    <div
                      style={{
                        display: nextAmenityNav == 2 ? "block" : "none",
                      }}
                    >
                      <p style={{ color: "grey" }}> Securities</p>
                      {amenities.security.map((_, i) => {
                        return (
                          <>
                            <div style={inputGroupContainerStyles} key={i}>
                              {/* <BathroomIcon style={{ color: "#035e4aff" }} /> */}
                              <input
                                type="checkbox"
                                style={inputInContainerStyles}
                                // onChange={(e) => setNAContact(e.target.value)}
                              />
                              {findIcon(_, "small")}
                              <span>{_}</span>
                            </div>
                            <div style={{ height: "5px" }}></div>
                          </>
                        );
                      })}
                      <AmenityNavigation />
                    </div>
                    <div
                      style={{
                        display: nextAmenityNav == 3 ? "block" : "none",
                      }}
                    >
                      <p style={{ color: "grey" }}>Utilities</p>
                      {amenities.utilities.map((_, i) => {
                        return (
                          <>
                            <div style={inputGroupContainerStyles} key={i}>
                              {/* <BathroomIcon style={{ color: "#035e4aff" }} /> */}
                              <input
                                type="checkbox"
                                style={inputInContainerStyles}
                                // onChange={(e) => setNAContact(e.target.value)}
                              />

                              {findIcon(_, "small")}
                              <span>{_}</span>
                            </div>
                            <div style={{ height: "5px" }}></div>
                          </>
                        );
                      })}
                      <AmenityNavigation />
                    </div>
                    <div
                      style={{
                        display: nextAmenityNav == 4 ? "block" : "none",
                      }}
                    >
                      <p style={{ color: "grey" }}>Lifestyle</p>
                      {amenities.lifestyle.map((_, i) => {
                        return (
                          <>
                            <div style={inputGroupContainerStyles} key={i}>
                              {/* <BathroomIcon style={{ color: "#035e4aff" }} /> */}
                              <input
                                type="checkbox"
                                style={inputInContainerStyles}
                                // onChange={(e) => setNAContact(e.target.value)}
                              />
                              {findIcon(_, "small")}
                              <span>{_}</span>
                            </div>
                            <div style={{ height: "5px" }}></div>
                          </>
                        );
                      })}
                      <AmenityNavigation />
                    </div>

                    <FormNavigation />
                  </div>
                </div>
                <div
                  style={{
                    display: nextFormGroup == 6 ? "block" : "none",
                    width: "300px",
                  }}
                >
                  <label htmlFor="" style={labelStyles}>
                    Property Description
                  </label>
                  <div style={inputGroupContainerStyles}>
                    {/* <BedIcon style={{ color: "#035e4aff" }} /> */}
                    <textarea
                      cols={10}
                      style={{
                        minHeight: "200px",
                        maxHeight: "250px",
                        border: "none",
                        outline: "none",
                        width: "100%",
                        resize: "vertical",
                        font: "inherit",
                      }}
                      placeholder="Basic description of the property"
                      required
                      // onChange={(e) => setNAContact(e.target.value)}
                    />
                  </div>
                  <FormNavigation />
                  <div style={getBtnGroupStyles()}>
                    <button
                      style={btnInFormStyles("#e64016ff")}
                      // onClick={() => setNewAppointmentModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      style={btnInFormStyles("#014631ff")}
                      type="submit"
                      // onClick={() => {
                      // }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        )}
        <div className="search-filter">
          <div className="search">
            <SearchIcon />{" "}
            <input
              type="text"
              name=""
              id=""
              placeholder="Search name or location ..."
              
            />
          </div>
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
        </div>
        {filteredData.length >= 1 ? (
          <div className="listing-table">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <div className="table-header">Property</div>
                    </th>
                    <th>
                      <div className="table-header">Price</div>
                    </th>
                    <th>
                      <div className="table-header">Status</div>
                    </th>
                    <th>
                      <div className="table-header">Last Updated</div>
                    </th>
                    <th>
                      <div className="">Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadedData.map((data) => {
                    return <ListingCard listing={data} key={data.listingId} />;
                  })}
                </tbody>
              </table>
              <div className="navigators">
                <div>
                  Showing {start} - {end} of {data.length} listings
                </div>
                <div>
                  <button
                    onClick={() => {
                      setStart(1);
                      setEnd(5);
                    }}
                    className="table-group"
                  >
                    1
                  </button>
                  <button
                    onClick={() => {
                      setStart(5);
                      setEnd(10);
                    }}
                    className="table-group"
                  >
                    2
                  </button>
                  <button
                    onClick={() => {
                      setStart(10);
                      setEnd(15);
                    }}
                    className="table-group"
                  >
                    3
                  </button>
                  <button
                    onClick={() => {
                      setStart(15);
                      setEnd(20);
                    }}
                    className="table-group"
                  >
                    4
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: " 49px 30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            No listings found :(
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default Listings;
