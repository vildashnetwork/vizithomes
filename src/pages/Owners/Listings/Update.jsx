// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import { useNavigate,useParams } from "react-router-dom";
// import "./CreatePropertyForm.css";

// const API_BASE = "https://vizit-backend-hubw.onrender.com/api/house";
// export default function UpdateHouseForm({ onCreated }) {

//     const { id } = useParams();
//   const [user, setuser] = useState(null)

//  const [usern, setUser] = useState(null);
//     useEffect(() => {
//         const decodeUser = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) return setLoading(false);

//                 const res = await axios.get(
//                     "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 if (res.status === 200) setUser(res.data.res);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         decodeUser();
//     }, []);





// const [allListings, setAllListings] = useState([]);
//     const [loadfetch, setloadfetch] = useState(false)
//     // ------------------- Fetch Listings -------------------
//     useEffect(() => {
//         if (!user?._id) return;

//         const fetchHouses = async () => {
//             try {
//                 setloadfetch(true)
//                 const res = await axios.get(
//                     `https://vizit-backend-hubw.onrender.com/api/house/houses/${id}`
//                 );
             
// console.log(res.data.house)
               
//                 setAllListings(res.data.house);
//             } catch (err) {
//                 setloadfetch(false)
//                 console.error("Failed to fetch houses", err);
//             } finally {
//                 setloadfetch(false)
//             }
//         };

//         fetchHouses();
//     }, [user?._id]);


// // alert(allListings?.title)

//     const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     title: "",
//     type: "Apartment",
//     rent: "",
//     address: "", // We'll extract this from location.address
//     bedrooms: 1,
//     bathrooms: 1,
//     area_sqm: 0,
//     amenities: [], // This is an array in your data
//     description: "",
//     media: [], // Your data uses 'image' instead of 'media'
// });

// useEffect(() => {
//     if (allListings) {
//         setFormData({
//             title: allListings.title || "",
//             type: allListings.type || "Apartment",
//             rent: allListings.rent || "",
//             address: allListings.location?.address || "", 
//             bedrooms: allListings.bedrooms || 0,
//             bathrooms: allListings.bathrooms || 0,
//             area_sqm: allListings.area_sqm || 0,
//             amenities: allListings.amenities || [],
//             description: allListings.description || "",
//             images: allListings.reviews?.images || [],
//             media: allListings.reviews?.images || [],

//         });
//     }
// }, [allListings]);

//     const [how, sethow] = useState("")
//     const [dragOver, setDragOver] = useState(false);
//     const [submitting, setSubmitting] = useState(false);
//     const [activeStep, setActiveStep] = useState(0);
//     const [selectedAmenities, setSelectedAmenities] = useState([]);
//     const fileInputRef = useRef(null);



  
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         const decoding = async () => {
//             try {
//                 const token = localStorage.getItem("token")
//                 if (!token) {
//                     console.warn("No token found")
//                     setLoading(false)
//                     return
//                 }

//                 const data = await axios.get(
//                     `https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 )
//                 if (data.status === 200) {
//                     setuser(data.data.res)

//                 }
//             } catch (error) {
//                 console.error("Failed to decode token:", error)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         decoding()
//     }, [])











    


//     const amenityOptions = [
//         "WiFi", "Parking", "Pool", "Gym", "AC", "Heating",
//         "Laundry", "Dishwasher", "Pet Friendly", "Balcony",
//         "Garden", "Security", "Elevator", "Furnished", "Fireplace"
//     ];

//     const propertyTypes = [
//         { value: "Apartment", icon: <ion-icon name="add-circle-outline"></ion-icon> },
//         { value: "Guest House", icon: <ion-icon name="alarm-outline"></ion-icon> },
//         { value: "Hotel", icon: <ion-icon name="archive-outline"></ion-icon> },
//         { value: "Modern Room", icon: <ion-icon name="car-outline"></ion-icon> },
//         { value: "Studio", icon: <ion-icon name="gift-outline"></ion-icon> },
//         { value: "Villa", icon: <ion-icon name="hardware-chip-outline"></ion-icon> },
//         { value: "Penthouse", icon: <ion-icon name="heart-circle-outline"></ion-icon> },
//         { value: "Townhouse", icon: <ion-icon name="golf-outline"></ion-icon> }
//     ];




//     const steps = ["Basic Info", "Details", "Amenities", "Media", "Review"];

//     const handleChange = (key, value) =>
//         setFormData((fd) => ({ ...fd, [key]: value }));

//     const handleAmenityToggle = (amenity) => {
//         setSelectedAmenities(prev => {
//             if (prev.includes(amenity)) {
//                 return prev.filter(a => a !== amenity);
//             } else {
//                 return [...prev, amenity];
//             }
//         });
//     };
//     const [uploading, setuploading] = useState(false)
//     const handleImageUpload = async (files) => {
//         try {
//             setuploading(true)
//             const uploads = await Promise.all(
//                 Array.from(files).map(async (file) => {
//                     const isVideo = file.type.startsWith("video");
//                     const uploadPreset = isVideo ? "vizit-video" : "vizit-image";

//                     const data = new FormData();
//                     data.append("file", file);
//                     data.append("upload_preset", uploadPreset);

//                     const res = await axios.post(
//                         `https://api.cloudinary.com/v1_1/dgigs6v72/${isVideo ? "video" : "image"}/upload`,
//                         data
//                     );

//                     return {
//                         url: res.data.secure_url,
//                         type: isVideo ? "video" : "image",
//                     };
//                 })
//             );

//             setFormData((fd) => ({
//                 ...fd,
//                 media: [...(fd.media || []), ...uploads], // ✅ EXTRA SAFE
//             }));
//         } catch (error) {
//             console.error("Upload failed:", error);
//             alert("Failed to upload media.");
//         } finally {
//             setuploading(false)
//         }
//     };


//     const handleDrop = async (e) => {
//         e.preventDefault();
//         setDragOver(false);
//         const files = Array.from(e.dataTransfer.files);
//         await handleImageUpload(files);
//     };

//     const handleFileSelect = (e) => {
//         const files = Array.from(e.target.files);
//         handleImageUpload(files);
//     };




















//     ///c


//     const [permission, setLocationPermission] = useState(false)

//     const getLocation = () => {
//         if (!navigator.geolocation) {
//             alert("Geolocation is not supported by your browser");
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;

//                 setFormData((prev) => ({
//                     ...prev,
//                     lat: latitude,
//                     lng: longitude,
//                 }));

//                 const getOSMAddress = async () => {
//                     try {
//                         const response = await axios.get(
//                             `https://api.geoapify.com/v1/geocode/reverse`,
//                             {
//                                 params: {
//                                     lat: latitude,
//                                     lon: longitude,
//                                     apiKey: "28065c9b690540718c37d7f07710a51c"
//                                 }
//                             }
//                         );

//                         const feature = response.data.features[0];

//                         if (!feature) {
//                             console.warn("No address found");
//                             return;
//                         }

//                         const address = feature.properties.city + ", " +
//                             feature.properties.country + "#" + feature.properties.city +
//                             "&" + feature.properties.town + "(" + feature.properties.country_code +
//                             "=" + feature.properties.municipality + "*" +
//                             feature.properties.iso3166_2 + "0" + feature.properties.street;

                        

//                         handleChange("address", address);

//                         // alert(formData.address)

//                     } catch (error) {
//                         console.error("Reverse geocoding failed:", error);
//                     }
//                 };

//                 getOSMAddress()
//                 // const address = getOSMAddress(latitude, longitude);



//             },
//             (error) => {
//                 console.error("Error getting location:", error);
//             },
//             {
//                 enableHighAccuracy: true,
//             }
//         );
//     };


//     useEffect(() => {
//         getLocation()

//     }, [formData.lat, formData.lng])

   
//     // const getOSMAddress = async (
//     //     lat: number,
//     //     lon: number
//     // ): Promise<string | null> => {
//     //     try {
//     // const response = await fetch(
//     //     `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=28065c9b690540718c37d7f07710a51c`
//     // );
//     // const data = await response.json();
//     // return data.features[0]?.properties?.address_line2 ?? null;
//     //     } catch (error) {
//     //         console.error('Error fetching address:', error);
//     //         return null;
//     //     }
//     // };


    

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.title || !formData.rent || !formData.address) {
//             alert("Title, Rent, and Address are required");
//             return;
//         }

//         if (formData?.media?.length === 0) {
//             alert("Please upload at least one image or video");
//             return;
//         }

//         setSubmitting(true);

//         try {
//             const payload = {
//                 owner: {
//                     id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     phone: user.phone,
//                     location: user.location,
//                     profile: user.profile,
//                 },
//                 type: formData.type,
//                 title: formData.title,
//                 rent: Number(formData.rent),
//                 bedrooms: Number(formData.bedrooms),
//                 bathrooms: Number(formData.bathrooms),
//                 area_sqm: Number(formData.area_sqm),
//                 location: {
//                     address: formData.address,
//                     coordinates: {
//                         lat: Number(formData.lat) || 0,
//                         lng: Number(formData.lng) || 0,
//                     },
//                 },
//                 amenities: selectedAmenities,
//                 description: formData.description,
//                 how: how,
//                 reviews: {
//                     images: formData.media.map(m => m.url),
//                 },
//                 minimumduration: "1 day",
//                 isAvalable: true,
//                 image: formData.media[0]?.url || "",
//             };

//             const res = await axios.post(
//                 "https://vizit-backend-hubw.onrender.com/api/house/houses",
//                 payload
//             );

//             alert("House created successfully");
//             navigate("/listings")
//             onCreated?.(res.data.house ?? payload);

//             // RESET FORM
//             setFormData({
//                 title: "",
//                 type: "Apartment",
//                 rent: "",
//                 address: "",
//                 lat: "",
//                 lng: "",
//                 bedrooms: 1,
//                 bathrooms: 1,
//                 area_sqm: 50,
//                 description: "",
//                 media: [],
//             });

//             setSelectedAmenities([]);
//             setActiveStep(0);
//         } catch (err) {
//             console.error("Create house failed:", err);
//             alert(
//                 err?.response?.data?.message ||
//                 "Failed to create house. Please try again."
//             );
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const nextStep = () => {
//         if (activeStep < steps.length - 1) {
//             setActiveStep(activeStep + 1);
//         }
//     };

//     const prevStep = () => {
//         if (activeStep > 0) {
//             setActiveStep(activeStep - 1);
//         }
//     };

//     const removeImage = (index) => {
//         setFormData(prev => ({
//             ...prev,
//             images: prev.images.filter((_, i) => i !== index)
//         }));
//     };
//     const removeMedia = (index) => {
//         setFormData((fd) => ({
//             ...fd,
//             media: fd.media.filter((_, i) => i !== index),
//         }));
//     };




//     return (
//         <div className="billion-dollar-container">
//             <div className="split-layout">
//                 {/* Left Side - Visual Preview */}
//                 <div className="preview-side">
//                     <div className="preview-overlay">
//                         <div className="preview-content">
//                             {/* <h1 className="preview-title">Create Your <span className="highlight">Premium</span> Listing</h1>
//                             <p className="preview-subtitle">Join thousands of property owners maximizing their returns with our platform</p> */}

//                             {/* <div className="preview-stats">
//                                 <div className="stat-item">
//                                     <div className="stat-number">24.7%</div>
//                                     <div className="stat-label">Higher Rental Income</div>
//                                 </div>
//                                 <div className="stat-item">
//                                     <div className="stat-number">3.2x</div>
//                                     <div className="stat-label">Faster Booking</div>
//                                 </div>
//                                 <div className="stat-item">
//                                     <div className="stat-number">99%</div>
//                                     <div className="stat-label">Occupancy Rate</div>
//                                 </div>

//                             </div> */}

//                             <div className="preview-card">
//                                 <div className="card-image">
//                                     <div className="image-placeholder">
//                                         <div className="property-badge">
//                                             <span className="badge-icon">⭐</span>
//                                             <span>Premium Listing</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="card-details">
//                                     <h3>{formData.title || "Your Property Title"}</h3>
//                                     <div className="property-meta">
//                                         <span className="meta-item">
//                                             <i className="icon"><ion-icon name="bed-outline"></ion-icon></i> {formData.bedrooms} bed
//                                         </span>
//                                         <span className="meta-item">
//                                             <i className="icon"><ion-icon name="bonfire-outline"></ion-icon></i> {formData.bathrooms} bath
//                                         </span>
//                                         <span className="meta-item">
//                                             <i className="icon"><ion-icon name="pencil-outline"></ion-icon></i> {formData.area_sqm} sqm
//                                         </span>
//                                     </div>
//                                     <div className="property-price">
//                                         {formData.rent ? `XAF ${parseInt(formData.rent).toLocaleString()}/${how}` : "Set your price"}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Side - Form */}
//                 <div className="form-side">
//                     <div className="form-container">
//                         <div className="form-header">
//                             <h2>Create New Property</h2>
//                             <p>Fill in the details to list your property</p>
//                         </div>

//                         {/* Progress Steps */}
//                         <div className="progress-steps">

//                             {steps.map((step, index) => (
//                                 <div key={index} className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}>
//                                     <div className="step-circle">{index + 1}</div>
//                                     <div className="step-label">{step}</div>
//                                     {index < steps.length - 1 && <div className="step-connector"></div>}
//                                 </div>
//                             ))}

//                         </div>

//                         <form className="newton-form" onSubmit={handleSubmit}>
//                             {/* Step 1: Basic Info */}
//                             {activeStep === 0 && (
//                                 <div className="form-step">
//                                     <div className="form-group">
//                                         <label className="form-label">
//                                             <span className="label-text">Property Title *</span>
//                                             <input
//                                                 type="text"
//                                                 value={formData.title}
//                                                 onChange={(e) => handleChange("title", e.target.value)}
//                                                 className="form-input"
//                                                 placeholder="Luxury Apartment with Ocean View"
//                                                 required
//                                             />
//                                         </label>
//                                     </div>

//                                     <div className="form-group">
//                                         <label className="form-label">
//                                             <span className="label-text">Property Type</span>
//                                             <div className="property-type-grid">
//                                                 {propertyTypes.map((type) => (
//                                                     <button
//                                                         key={type.value}
//                                                         type="button"
//                                                         className={`type-option ${formData.type === type.value ? 'selected' : ''}`}
//                                                         onClick={() => handleChange("type", type.value)}
//                                                     >
//                                                         <span className="type-icon icon">{type.icon}</span>
//                                                         <span className="type-name">{type.value}</span>
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </label>
//                                     </div>

//                                     <div className="form-group">
//                                         <label className="form-label">
//                                             <span className="label-text">Monthly Rent (XAF) *</span>
//                                             <div className="input-with-icon">
//                                                 <span className="input-icon"><ion-icon name="card-outline"></ion-icon></span>
//                                                 <input
//                                                     type="number"
//                                                     value={formData.rent}
//                                                     onChange={(e) => handleChange("rent", e.target.value)}
//                                                     className="form-input"
//                                                     placeholder="250000"
//                                                     required
//                                                 />
//                                             </div>
//                                         </label>
//                                     </div>

//                                     <div className="form-group">
//                                         <label className="form-label">
//                                             <span className="label-text">Monthly Rent (XAF) *</span>
//                                             <div className="input-with-icon">
//                                                 <span className="input-icon">
//                                                     <ion-icon name="calendar-outline"></ion-icon>
//                                                 </span>


//                                                 <select className="form-input"
//                                                     style={{ cursor: "pointer" }}
//                                                     value={how} onChange={(e) => sethow(e.target.value)}
//                                                     required>
//                                                     <option value="select a payment plan">select a payment plan</option>
//                                                     <option value="month">month</option>
//                                                     <option value="day">day</option>
//                                                     <option value="night">night</option>
//                                                 </select>
//                                             </div>
//                                         </label>
//                                     </div>

//                                     <div className="form-group">
//                                         <label className="form-label">
//                                             <span className="label-text">Full Address *</span>
//                                             <div className="input-with-icon">
//                                                 <span className="input-icon"><ion-icon name="compass-outline"></ion-icon></span>
//                                                 <input
//                                                     type="text"
//                                                     value={formData.address}
//                                                     onChange={(e) => handleChange("address", e.target.value)}
//                                                     className="form-input"
//                                                     placeholder="123 Luxury Street, Douala, Cameroon"
//                                                     required
//                                                     disabled={true}
//                                                 />
//                                             </div>
//                                         </label>
//                                     </div>

//                                 </div>
//                             )}

//                             {/* Step 2: Details */}
//                             {activeStep === 1 && (
//                                 <div className="form-step">
//                                     <div className="form-row">
//                                         <div className="form-group">
//                                             <label className="form-label">
//                                                 <span className="label-text">Bedrooms</span>
//                                                 <div className="counter-input">
//                                                     <button
//                                                         type="button"
//                                                         className="counter-btn"
//                                                         onClick={() => handleChange("bedrooms", Math.max(1, formData.bedrooms - 1))}
//                                                     >
//                                                         -
//                                                     </button>
//                                                     <span className="counter-value">{formData.bedrooms}</span>
//                                                     <button
//                                                         type="button"
//                                                         className="counter-btn"
//                                                         onClick={() => handleChange("bedrooms", formData.bedrooms + 1)}
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                             </label>
//                                         </div>

//                                         <div className="form-group">
//                                             <label className="form-label">
//                                                 <span className="label-text">Bathrooms</span>
//                                                 <div className="counter-input">
//                                                     <button
//                                                         type="button"
//                                                         className="counter-btn"
//                                                         onClick={() => handleChange("bathrooms", Math.max(1, formData.bathrooms - 1))}
//                                                     >
//                                                         -
//                                                     </button>
//                                                     <span className="counter-value">{formData.bathrooms}</span>
//                                                     <button
//                                                         type="button"
//                                                         className="counter-btn"
//                                                         onClick={() => handleChange("bathrooms", formData.bathrooms + 1)}
//                                                     >
//                                                         +
//                                                     </button>
//                                                 </div>
//                                             </label>
//                                         </div>
//                                     </div>

//                                     <div className="form-group">
//                                         <label className="form-label">
//                                             <span className="label-text">Area (square meters)</span>
//                                             <div className="range-input">
//                                                 <input
//                                                     type="range"
//                                                     min="20"
//                                                     max="500"
//                                                     value={formData.area_sqm}
//                                                     onChange={(e) => handleChange("area_sqm", e.target.value)}
//                                                     className="range-slider"
//                                                 />
//                                                 <div className="range-value">{formData.area_sqm} sqm</div>
//                                             </div>
//                                         </label>
//                                     </div>

//                                     <div className="form-group">
//                                         <label className="form-label">
//                                             <span className="label-text">Description</span>
//                                             <textarea
//                                                 value={formData.description}
//                                                 onChange={(e) => handleChange("description", e.target.value)}
//                                                 className="form-textarea"
//                                                 rows={5}
//                                                 placeholder="Describe your property in detail... What makes it special?"
//                                             />
//                                             <div className="char-count">{formData.description.length}/500</div>
//                                         </label>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Step 3: Amenities */}
//                             {activeStep === 2 && (
//                                 <div className="form-step">
//                                     <div className="form-group">
//                                         <span className="label-text">Select Amenities</span>
//                                         <div className="amenities-grid">
//                                             {amenityOptions.map((amenity) => (
//                                                 <button
//                                                     key={amenity}
//                                                     type="button"
//                                                     className={`amenity-option ${selectedAmenities.includes(amenity) ? 'selected' : ''}`}
//                                                     onClick={() => handleAmenityToggle(amenity)}
//                                                 >
//                                                     <span className="amenity-checkbox">
//                                                         {selectedAmenities.includes(amenity) ? '✓' : '+'}
//                                                     </span>
//                                                     <span className="amenity-name">{amenity}</span>
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Step 4: Media */}
//                             {activeStep === 3 && (
//                                 <div className="form-step">
//                                     <div className="form-group">
//                                         <span className="label-text">Upload Property Photos</span>
//                                         <p className="sub-label">Drag & drop images or click to browse</p>

//                                         <div
//                                             className={`image-dropzone ${dragOver ? "dragging" : ""}`}
//                                             onDragOver={(e) => {
//                                                 e.preventDefault();
//                                                 setDragOver(true);
//                                             }}
//                                             onDragLeave={() => setDragOver(false)}
//                                             onDrop={handleDrop}
//                                             onClick={() => fileInputRef.current.click()}
//                                         >
//                                             <div className="dropzone-content">
//                                                 <div className="dropzone-icon"><ion-icon name="cloud-upload-outline"></ion-icon></div>
//                                                 <h3>Add Property Photos</h3>
//                                                 <p>Upload up to 20 photos. High-quality images get more views.</p>
//                                                 <button type="button" className="browse-btn">
//                                                     {uploading ? "uplaoding media... " : "Browse Files"}
//                                                 </button>
//                                                 <input
//                                                     type="file"
//                                                     ref={fileInputRef}
//                                                     onChange={handleFileSelect}
//                                                     style={{ display: 'none' }}

//                                                     multiple
//                                                     accept="image/*,video/*"

//                                                 />

//                                             </div>
//                                         </div>

//                                         {/* {formData.images.length > 0 && (
//                                             <div className="image-preview-grid">
//                                                 {formData.images.map((img, i) => (
//                                                     <div key={i} className="image-preview-item">
//                                                         <img src={img} alt={`Preview ${i}`} />
//                                                         <button
//                                                             type="button"
//                                                             className="remove-image-btn"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 removeImage(i);
//                                                             }}
//                                                         >
//                                                             ×
//                                                         </button>
//                                                         {i === 0 && <div className="primary-badge">Primary</div>}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )} */}





//                                         {formData.media.length > 0 && (
//                                             <div className="image-preview-grid">
//                                                 {formData.media.map((item, i) => (
//                                                     <div key={i} className="image-preview-item">
//                                                         {item.type === "image" ? (
//                                                             <img src={item.url} alt={`Media ${i}`} />
//                                                         ) : (
//                                                             <video src={item.url} controls />
//                                                         )}

//                                                         <button
//                                                             type="button"
//                                                             className="remove-image-btn"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 removeMedia(i);
//                                                             }}
//                                                         >
//                                                             ×
//                                                         </button>

//                                                         {i === 0 && <div className="primary-badge">Primary</div>}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}




//                                     </div>
//                                 </div>
//                             )}

//                             {/* Step 5: Review */}
//                             {activeStep === 4 && (
//                                 <div className="form-step">
//                                     <div className="review-section" style={{ flexDirection: "column" }}>
//                                         <h3 className="review-title">Review Your Listing</h3>

//                                         <div className="review-card" style={{ flexDirection: "column" }}>
//                                             <div className="review-item">
//                                                 <span className="review-label">Property Title:</span>
//                                                 <span className="review-value">{formData.title}</span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">Property Type:</span>
//                                                 <span className="review-value">{formData.type}</span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">{how} Rent:</span>
//                                                 <span className="review-value">XAF {parseInt(formData.rent || 0).toLocaleString()}</span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">Address:</span>
//                                                 <span className="review-value">{formData.address}</span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">How people will pay:</span>
//                                                 <span className="review-value">per {how}</span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">Bed/Bath:</span>
//                                                 <span className="review-value">{formData.bedrooms} bed, {formData.bathrooms} bath</span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">Area:</span>
//                                                 <span className="review-value">{formData.area_sqm} sqm</span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">Amenities:</span>
//                                                 <span className="review-value">
//                                                     {selectedAmenities.length > 0
//                                                         ? selectedAmenities.join(', ')
//                                                         : 'None selected'}
//                                                 </span>
//                                             </div>
//                                             <div className="review-item">
//                                                 <span className="review-label">Photos:</span>
//                                                 <span className="review-value">{formData.media.length} uploaded</span>
//                                             </div>
//                                         </div>

//                                         <div className="terms-agreement">
//                                             <input type="checkbox" id="terms" required />
//                                             <label htmlFor="terms" style={{ color: "#fff" }}>
//                                                 I agree to the terms of service and confirm that I have the right to list this property
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Navigation Buttons */}
//                             <div className="form-navigation">
//                                 {activeStep > 0 && (
//                                     <button type="button" className="nav-btn prev-btn" onClick={prevStep}>
//                                         ← Previous
//                                     </button>
//                                 )}

//                                 {activeStep < steps.length - 1 ? (
//                                     <button type="button" className="nav-btn next-btn" onClick={nextStep}>
//                                         Next →
//                                     </button>
//                                 ) : (
//                                     <button type="submit" className="submit-btn" disabled={submitting}>
//                                         {submitting ? (
//                                             <>
//                                                 <span className="spinner"></span>
//                                                 Creating Listing...
//                                             </>
//                                         ) : (
//                                             'Publish Listing '
//                                         )}
//                                         <ion-icon name="subway-outline"></ion-icon>
//                                     </button>
//                                 )}
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
















import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./CreatePropertyForm.css";

const API_BASE = "https://vizit-backend-hubw.onrender.com/api/house";

export default function UpdateHouseForm({ onUpdated }) {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [how, setHow] = useState("");
    const [houseData, setHouseData] = useState(null);
    const [fetchLoading, setFetchLoading] = useState(true);
    
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        type: "Apartment",
        rent: "",
        address: "",
        lat: "",
        lng: "",
        bedrooms: 1,
        bathrooms: 1,
        area_sqm: 50,
        amenities: [],
        description: "",
        media: [],
        how: "month"
    });

    const amenityOptions = [
        "WiFi", "Parking", "Pool", "Gym", "AC", "Heating",
        "Laundry", "Dishwasher", "Pet Friendly", "Balcony",
        "Garden", "Security", "Elevator", "Furnished", "Fireplace"
    ];

    const propertyTypes = [
        { value: "Apartment", icon: <ion-icon name="business-outline"></ion-icon> },
        { value: "Guest House", icon: <ion-icon name="home-outline"></ion-icon> },
        { value: "Hotel", icon: <ion-icon name="bed-outline"></ion-icon> },
        { value: "Modern Room", icon: <ion-icon name="desktop-outline"></ion-icon> },
        { value: "Studio", icon: <ion-icon name="color-palette-outline"></ion-icon> },
        { value: "Villa", icon: <ion-icon name="leaf-outline"></ion-icon> },
        { value: "Penthouse", icon: <ion-icon name="trending-up-outline"></ion-icon> },
        { value: "Townhouse", icon: <ion-icon name="grid-outline"></ion-icon> }
    ];

    const steps = ["Basic Info", "Details", "Amenities", "Media", "Review"];

    // Decode user token
    useEffect(() => {
        const decodeUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    navigate("/login");
                    return;
                }

                const res = await axios.get(
                    "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.status === 200) setUser(res.data.res);
            } catch (err) {
                console.error("Failed to decode token:", err);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        decodeUser();
    }, [navigate]);

    // Fetch house data
    useEffect(() => {
        const fetchHouse = async () => {
            if (!id) return;
            
            try {
                setFetchLoading(true);
                const res = await axios.get(`${API_BASE}/houses/${id}`);
                const house = res.data.house;
                setHouseData(house);
                
                // Extract location data
                const locationParts = house.location?.address?.split('#') || [];
                const address = house.location?.address || "";
                
                setFormData({
                    title: house.title || "",
                    type: house.type || "Apartment",
                    rent: house.rent || "",
                    address: address,
                    lat: house.location?.coordinates?.lat || "",
                    lng: house.location?.coordinates?.lng || "",
                    bedrooms: house.bedrooms || 1,
                    bathrooms: house.bathrooms || 1,
                    area_sqm: house.area_sqm || 50,
                    amenities: house.amenities || [],
                    description: house.description || "",
                    media: house.reviews?.images?.map(url => ({ url, type: "image" })) || [],
                    how: house.how || "month"
                });
                
                setHow(house.how || "month");
            } catch (err) {
                console.error("Failed to fetch house:", err);
                alert("Failed to load house data");
                navigate("/listings");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchHouse();
    }, [id, navigate]);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const handleImageUpload = async (files) => {
        try {
            setUploading(true);
            const uploads = await Promise.all(
                Array.from(files).map(async (file) => {
                    const isVideo = file.type.startsWith("video");
                    const uploadPreset = isVideo ? "vizit-video" : "vizit-image";

                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", uploadPreset);

                    const res = await axios.post(
                        `https://api.cloudinary.com/v1_1/dgigs6v72/${isVideo ? "video" : "image"}/upload`,
                        data
                    );

                    return {
                        url: res.data.secure_url,
                        type: isVideo ? "video" : "image",
                    };
                })
            );

            setFormData(prev => ({
                ...prev,
                media: [...(prev.media || []), ...uploads],
            }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload media.");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        await handleImageUpload(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleImageUpload(files);
    };

    const removeMedia = (index) => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter((_, i) => i !== index),
        }));
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setFormData(prev => ({
                    ...prev,
                    lat: latitude,
                    lng: longitude,
                }));

                const getOSMAddress = async () => {
                    try {
                        const response = await axios.get(
                            `https://api.geoapify.com/v1/geocode/reverse`,
                            {
                                params: {
                                    lat: latitude,
                                    lon: longitude,
                                    apiKey: "28065c9b690540718c37d7f07710a51c"
                                }
                            }
                        );

                        const feature = response.data.features[0];
                        if (!feature) return;

                        const address = feature.properties.city + ", " +
                            feature.properties.country + "#" + feature.properties.city +
                            "&" + feature.properties.town + "(" + feature.properties.country_code +
                            "=" + feature.properties.municipality + "*" +
                            feature.properties.iso3166_2 + "0" + feature.properties.street;

                        handleChange("address", address);
                    } catch (error) {
                        console.error("Reverse geocoding failed:", error);
                    }
                };

                getOSMAddress();
            },
            (error) => {
                console.error("Error getting location:", error);
            },
            {
                enableHighAccuracy: true,
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.rent || !formData.address) {
            alert("Title, Rent, and Address are required");
            return;
        }

        if (formData?.media?.length === 0) {
            alert("Please upload at least one image or video");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                owner: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    profile: user.profile,
                },
                type: formData.type,
                title: formData.title,
                rent: String(formData.rent),
                how: how,
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                area_sqm: Number(formData.area_sqm),
                location: {
                    address: formData.address,
                    coordinates: {
                        lat: Number(formData.lat) || 0,
                        lng: Number(formData.lng) || 0,
                    },
                },
                amenities: formData.amenities,
                description: formData.description,
                minimumduration: "1 day",
                isAvalable: true,
                image: formData.media[0]?.url || "",
                reviews: {
                    images: formData.media.map(m => m.url),
                },
            };

            const res = await axios.put(
                `${API_BASE}/houses/${id}`,
                payload
            );

            alert("House updated successfully");
            onUpdated?.(res.data.house);
            navigate("/listings");
        } catch (err) {
            console.error("Update house failed:", err);
            alert(
                err?.response?.data?.message ||
                "Failed to update house. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const nextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    if (loading || fetchLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // return (
    //     <div className="billion-dollar-container">
    //         <div className="split-layout">
    //             {/* Left Side - Visual Preview */}
    //             <div className="preview-side">
    //                 <div className="preview-overlay">
    //                     <div className="preview-content">
    //                         <div className="preview-card">
    //                             <div className="card-image">
    //                                 <div className="image-placeholder">
    //                                     {formData.media[0] ? (
    //                                         <img 
    //                                             src={formData.media[0].url} 
    //                                             alt="Property preview" 
    //                                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    //                                         />
    //                                     ) : (
    //                                         <div className="property-badge">
    //                                             <span className="badge-icon">🏠</span>
    //                                             <span>Update Listing</span>
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                             <div className="card-details">
    //                                 <h3>{formData.title || "Your Property Title"}</h3>
    //                                 <div className="property-meta">
    //                                     <span className="meta-item">
    //                                         <i className="icon"><ion-icon name="bed-outline"></ion-icon></i> {formData.bedrooms} bed
    //                                     </span>
    //                                     <span className="meta-item">
    //                                         <i className="icon"><ion-icon name="water-outline"></ion-icon></i> {formData.bathrooms} bath
    //                                     </span>
    //                                     <span className="meta-item">
    //                                         <i className="icon"><ion-icon name="square-outline"></ion-icon></i> {formData.area_sqm} sqm
    //                                     </span>
    //                                 </div>
    //                                 <div className="property-price">
    //                                     {formData.rent ? `XAF ${parseInt(formData.rent).toLocaleString()}/${how}` : "Set your price"}
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Right Side - Form */}
    //             <div className="form-side">
    //                 <div className="form-container">
    //                     <div className="form-header">
    //                         <h2>Update Property Listing</h2>
    //                         <p>Edit your property details below</p>
    //                     </div>

    //                     {/* Progress Steps */}
    //                     <div className="progress-steps">
    //                         {steps.map((step, index) => (
    //                             <div key={index} className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}>
    //                                 <div className="step-circle">{index + 1}</div>
    //                                 <div className="step-label">{step}</div>
    //                                 {index < steps.length - 1 && <div className="step-connector"></div>}
    //                             </div>
    //                         ))}
    //                     </div>

    //                     <form className="newton-form" onSubmit={handleSubmit}>
    //                         {/* Step 1: Basic Info */}
    //                         {activeStep === 0 && (
    //                             <div className="form-step">
    //                                 <div className="form-group">
    //                                     <label className="form-label">
    //                                         <span className="label-text">Property Title *</span>
    //                                         <input
    //                                             type="text"
    //                                             value={formData.title}
    //                                             onChange={(e) => handleChange("title", e.target.value)}
    //                                             className="form-input"
    //                                             placeholder="Luxury Apartment with Ocean View"
    //                                             required
    //                                         />
    //                                     </label>
    //                                 </div>

    //                                 <div className="form-group">
    //                                     <label className="form-label">
    //                                         <span className="label-text">Property Type</span>
    //                                         <div className="property-type-grid">
    //                                             {propertyTypes.map((type) => (
    //                                                 <button
    //                                                     key={type.value}
    //                                                     type="button"
    //                                                     className={`type-option ${formData.type === type.value ? 'selected' : ''}`}
    //                                                     onClick={() => handleChange("type", type.value)}
    //                                                 >
    //                                                     <span className="type-icon icon">{type.icon}</span>
    //                                                     <span className="type-name">{type.value}</span>
    //                                                 </button>
    //                                             ))}
    //                                         </div>
    //                                     </label>
    //                                 </div>

    //                                 <div className="form-group">
    //                                     <label className="form-label">
    //                                         <span className="label-text">Rent Amount (XAF) *</span>
    //                                         <div className="input-with-icon">
    //                                             <span className="input-icon"><ion-icon name="cash-outline"></ion-icon></span>
    //                                             <input
    //                                                 type="number"
    //                                                 value={formData.rent}
    //                                                 onChange={(e) => handleChange("rent", e.target.value)}
    //                                                 className="form-input"
    //                                                 placeholder="250000"
    //                                                 required
    //                                             />
    //                                         </div>
    //                                     </label>
    //                                 </div>

    //                                 <div className="form-group">
    //                                     <label className="form-label">
    //                                         <span className="label-text">Payment Period *</span>
    //                                         <div className="input-with-icon">
    //                                             <span className="input-icon">
    //                                                 <ion-icon name="calendar-outline"></ion-icon>
    //                                             </span>
    //                                             <select
    //                                                 className="form-input"
    //                                                 style={{ cursor: "pointer" }}
    //                                                 value={how}
    //                                                 onChange={(e) => setHow(e.target.value)}
    //                                                 required
    //                                             >
    //                                                 <option value="month">per month</option>
    //                                                 <option value="day">per day</option>
    //                                                 <option value="night">per night</option>
    //                                             </select>
    //                                         </div>
    //                                     </label>
    //                                 </div>

    //                                 <div className="form-group">
    //                                     <label className="form-label">
    //                                         <span className="label-text">Full Address *</span>
    //                                         <div className="input-with-icon">
    //                                             <span className="input-icon"><ion-icon name="location-outline"></ion-icon></span>
    //                                             <input
    //                                                 type="text"
    //                                                 value={formData.address}
    //                                                 onChange={(e) => handleChange("address", e.target.value)}
    //                                                 className="form-input"
    //                                                 placeholder="123 Luxury Street, Douala, Cameroon"
    //                                                 required
    //                                             />
    //                                         </div>
    //                                     </label>
    //                                     <button 
    //                                         type="button" 
    //                                         onClick={getLocation} 
    //                                         className="location-btn"
    //                                         style={{ marginTop: '10px' }}
    //                                     >
    //                                         <ion-icon name="navigate-outline"></ion-icon> Get Current Location
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                         )}

    //                         {/* Step 2: Details */}
    //                         {activeStep === 1 && (
    //                             <div className="form-step">
    //                                 <div className="form-row">
    //                                     <div className="form-group">
    //                                         <label className="form-label">
    //                                             <span className="label-text">Bedrooms</span>
    //                                             <div className="counter-input">
    //                                                 <button
    //                                                     type="button"
    //                                                     className="counter-btn"
    //                                                     onClick={() => handleChange("bedrooms", Math.max(1, formData.bedrooms - 1))}
    //                                                 >
    //                                                     -
    //                                                 </button>
    //                                                 <span className="counter-value">{formData.bedrooms}</span>
    //                                                 <button
    //                                                     type="button"
    //                                                     className="counter-btn"
    //                                                     onClick={() => handleChange("bedrooms", formData.bedrooms + 1)}
    //                                                 >
    //                                                     +
    //                                                 </button>
    //                                             </div>
    //                                         </label>
    //                                     </div>

    //                                     <div className="form-group">
    //                                         <label className="form-label">
    //                                             <span className="label-text">Bathrooms</span>
    //                                             <div className="counter-input">
    //                                                 <button
    //                                                     type="button"
    //                                                     className="counter-btn"
    //                                                     onClick={() => handleChange("bathrooms", Math.max(1, formData.bathrooms - 1))}
    //                                                 >
    //                                                     -
    //                                                 </button>
    //                                                 <span className="counter-value">{formData.bathrooms}</span>
    //                                                 <button
    //                                                     type="button"
    //                                                     className="counter-btn"
    //                                                     onClick={() => handleChange("bathrooms", formData.bathrooms + 1)}
    //                                                 >
    //                                                     +
    //                                                 </button>
    //                                             </div>
    //                                         </label>
    //                                     </div>
    //                                 </div>

    //                                 <div className="form-group">
    //                                     <label className="form-label">
    //                                         <span className="label-text">Area (square meters)</span>
    //                                         <div className="range-input">
    //                                             <input
    //                                                 type="range"
    //                                                 min="20"
    //                                                 max="500"
    //                                                 value={formData.area_sqm}
    //                                                 onChange={(e) => handleChange("area_sqm", e.target.value)}
    //                                                 className="range-slider"
    //                                             />
    //                                             <div className="range-value">{formData.area_sqm} sqm</div>
    //                                         </div>
    //                                     </label>
    //                                 </div>

    //                                 <div className="form-group">
    //                                     <label className="form-label">
    //                                         <span className="label-text">Description</span>
    //                                         <textarea
    //                                             value={formData.description}
    //                                             onChange={(e) => handleChange("description", e.target.value)}
    //                                             className="form-textarea"
    //                                             rows={5}
    //                                             placeholder="Describe your property in detail... What makes it special?"
    //                                             maxLength={500}
    //                                         />
    //                                         <div className="char-count">{formData.description.length}/500</div>
    //                                     </label>
    //                                 </div>
    //                             </div>
    //                         )}

    //                         {/* Step 3: Amenities */}
    //                         {activeStep === 2 && (
    //                             <div className="form-step">
    //                                 <div className="form-group">
    //                                     <span className="label-text">Select Amenities</span>
    //                                     <div className="amenities-grid">
    //                                         {amenityOptions.map((amenity) => (
    //                                             <button
    //                                                 key={amenity}
    //                                                 type="button"
    //                                                 className={`amenity-option ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
    //                                                 onClick={() => handleAmenityToggle(amenity)}
    //                                             >
    //                                                 <span className="amenity-checkbox">
    //                                                     {formData.amenities.includes(amenity) ? '✓' : '+'}
    //                                                 </span>
    //                                                 <span className="amenity-name">{amenity}</span>
    //                                             </button>
    //                                         ))}
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         )}

    //                         {/* Step 4: Media */}
    //                         {activeStep === 3 && (
    //                             <div className="form-step">
    //                                 <div className="form-group">
    //                                     <span className="label-text">Upload Property Photos</span>
    //                                     <p className="sub-label">Drag & drop images or click to browse</p>

    //                                     <div
    //                                         className={`image-dropzone ${dragOver ? "dragging" : ""}`}
    //                                         onDragOver={(e) => {
    //                                             e.preventDefault();
    //                                             setDragOver(true);
    //                                         }}
    //                                         onDragLeave={() => setDragOver(false)}
    //                                         onDrop={handleDrop}
    //                                         onClick={() => fileInputRef.current.click()}
    //                                     >
    //                                         <div className="dropzone-content">
    //                                             <div className="dropzone-icon">
    //                                                 <ion-icon name="cloud-upload-outline"></ion-icon>
    //                                             </div>
    //                                             <h3>Add Property Photos</h3>
    //                                             <p>Upload up to 20 photos. High-quality images get more views.</p>
    //                                             <button type="button" className="browse-btn">
    //                                                 {uploading ? "Uploading media..." : "Browse Files"}
    //                                             </button>
    //                                             <input
    //                                                 type="file"
    //                                                 ref={fileInputRef}
    //                                                 onChange={handleFileSelect}
    //                                                 style={{ display: 'none' }}
    //                                                 multiple
    //                                                 accept="image/*,video/*"
    //                                             />
    //                                         </div>
    //                                     </div>

    //                                     {formData.media.length > 0 && (
    //                                         <div className="image-preview-grid">
    //                                             {formData.media.map((item, i) => (
    //                                                 <div key={i} className="image-preview-item">
    //                                                     {item.type === "image" ? (
    //                                                         <img src={item.url} alt={`Media ${i}`} />
    //                                                     ) : (
    //                                                         <video src={item.url} controls />
    //                                                     )}

    //                                                     <button
    //                                                         type="button"
    //                                                         className="remove-image-btn"
    //                                                         onClick={(e) => {
    //                                                             e.stopPropagation();
    //                                                             removeMedia(i);
    //                                                         }}
    //                                                     >
    //                                                         ×
    //                                                     </button>

    //                                                     {i === 0 && <div className="primary-badge">Primary</div>}
    //                                                 </div>
    //                                             ))}
    //                                         </div>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                         )}

    //                         {/* Step 5: Review */}
    //                         {activeStep === 4 && (
    //                             <div className="form-step">
    //                                 <div className="review-section" style={{ flexDirection: "column" }}>
    //                                     <h3 className="review-title">Review Your Listing</h3>

    //                                     <div className="review-card" style={{ flexDirection: "column" }}>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Property Title:</span>
    //                                             <span className="review-value">{formData.title}</span>
    //                                         </div>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Property Type:</span>
    //                                             <span className="review-value">{formData.type}</span>
    //                                         </div>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Rent:</span>
    //                                             <span className="review-value">XAF {parseInt(formData.rent || 0).toLocaleString()}/{how}</span>
    //                                         </div>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Address:</span>
    //                                             <span className="review-value">{formData.address}</span>
    //                                         </div>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Bed/Bath:</span>
    //                                             <span className="review-value">{formData.bedrooms} bed, {formData.bathrooms} bath</span>
    //                                         </div>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Area:</span>
    //                                             <span className="review-value">{formData.area_sqm} sqm</span>
    //                                         </div>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Amenities:</span>
    //                                             <span className="review-value">
    //                                                 {formData.amenities.length > 0
    //                                                     ? formData.amenities.join(', ')
    //                                                     : 'None selected'}
    //                                             </span>
    //                                         </div>
    //                                         <div className="review-item">
    //                                             <span className="review-label">Photos:</span>
    //                                             <span className="review-value">{formData.media.length} uploaded</span>
    //                                         </div>
    //                                     </div>

    //                                     <div className="terms-agreement">
    //                                         <input type="checkbox" id="terms" required />
    //                                         <label htmlFor="terms" style={{ color: "#fff" }}>
    //                                             I confirm that the information provided is accurate and I have the right to update this listing
    //                                         </label>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         )}

    //                         {/* Navigation Buttons */}
    //                         <div className="form-navigation">
    //                             {activeStep > 0 && (
    //                                 <button type="button" className="nav-btn prev-btn" onClick={prevStep}>
    //                                     ← Previous
    //                                 </button>
    //                             )}

    //                             {activeStep < steps.length - 1 ? (
    //                                 <button type="button" className="nav-btn next-btn" onClick={nextStep}>
    //                                     Next →
    //                                 </button>
    //                             ) : (
    //                                 <button type="submit" className="submit-btn" disabled={submitting}>
    //                                     {submitting ? (
    //                                         <>
    //                                             <span className="spinner"></span>
    //                                             Updating Listing...
    //                                         </>
    //                                     ) : (
    //                                         'Update Listing '
    //                                     )}
    //                                     <ion-icon name="checkmark-done-outline"></ion-icon>
    //                                 </button>
    //                             )}
    //                         </div>
    //                     </form>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );



return (
    <div className="tesla-container">
        <div className="rolex-layout">
            {/* Left Side - Visual Preview */}
            <div className="louisvuitton-side">
                <div className="ferrari-overlay">
                    <div className="gucci-content">
                        <div className="bentley-preview-card">
                            <div className="mercedes-card-image">
                                <div className="audi-placeholder">
                                    {formData.media[0] ? (
                                        <img 
                                            src={formData.media[0].url} 
                                            alt="Property preview" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="porsche-badge">
                                            <span className="lamborghini-badge-icon">🏠</span>
                                            <span>Update Listing</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="rollsroyce-card-details">
                                <h3>{formData.title || "Your Property Title"}</h3>
                                <div className="bugatti-property-meta">
                                    <span className="astonmartin-meta-item">
                                        <i className="gap-icon"><ion-icon name="bed-outline"></ion-icon></i> {formData.bedrooms} bed
                                    </span>
                                    <span className="astonmartin-meta-item">
                                        <i className="gap-icon"><ion-icon name="water-outline"></ion-icon></i> {formData.bathrooms} bath
                                    </span>
                                    <span className="astonmartin-meta-item">
                                        <i className="gap-icon"><ion-icon name="square-outline"></ion-icon></i> {formData.area_sqm} sqm
                                    </span>
                                </div>
                                <div className="maserati-property-price">
                                    {formData.rent ? `XAF ${parseInt(formData.rent).toLocaleString()}/${how}` : "Set your price"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="apple-form-side">
                <div className="microsoft-container">
                    <div className="google-header">
                        <h2>Update Property Listing</h2>
                        <p>Edit your property details below</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="amazon-progress-steps">
                        {steps.map((step, index) => (
                            <div key={index} className={`netflix-step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}>
                                <div className="disney-circle">{index + 1}</div>
                                <div className="hbo-label">{step}</div>
                                {index < steps.length - 1 && <div className="sony-connector"></div>}
                            </div>
                        ))}
                    </div>

                    <form className="nike-form" onSubmit={handleSubmit}>
                        {/* Step 1: Basic Info */}
                        {activeStep === 0 && (
                            <div className="adidas-step">
                                <div className="puma-group">
                                    <label className="underarmour-label">
                                        <span className="newbalance-text">Property Title *</span>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleChange("title", e.target.value)}
                                            className="vans-input"
                                            placeholder="Luxury Apartment with Ocean View"
                                            required
                                        />
                                    </label>
                                </div>

                                <div className="puma-group">
                                    <label className="underarmour-label">
                                        <span className="newbalance-text">Property Type</span>
                                        <div className="zara-property-grid">
                                            {propertyTypes.map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    className={`hm-option ${formData.type === type.value ? 'selected' : ''}`}
                                                    onClick={() => handleChange("type", type.value)}
                                                >
                                                    <span className="uniqlo-icon gap-icon">{type.icon}</span>
                                                    <span className="levis-name">{type.value}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </label>
                                </div>

                                <div className="puma-group">
                                    <label className="underarmour-label">
                                        <span className="newbalance-text">Rent Amount (XAF) *</span>
                                        <div className="timberland-icon-wrapper">
                                            <span className="northface-icon"><ion-icon name="cash-outline"></ion-icon></span>
                                            <input
                                                type="number"
                                                value={formData.rent}
                                                    style={{
    color: "#00976a", // Solid dark green for readability
    border: "2px solid #10ca8c", // The bright green from your gradient
   
  }}
                                                   onChange={(e) => handleChange("rent", e.target.value)}
                                                className="vans-input"
                                                placeholder="250000"
                                                required
                                            />
                                        </div>
                                    </label>
                                </div>

                                <div className="puma-group">
                                    <label className="underarmour-label">
                                        <span className="newbalance-text">Payment Period *</span>
                                        <div className="timberland-icon-wrapper">
                                            <span className="northface-icon">
                                                <ion-icon name="calendar-outline"></ion-icon>
                                            </span>
                                           <select
  className="vans-input"
  value={how}
  onChange={(e) => sethow(e.target.value)}
  required
  style={{ 
    cursor: "pointer",
    color: "#00976a", 
    border: "2px solid #10ca8c",
   
  }}
>
     <option value="">-- select a payment plan --</option>

  <option value="month">per month</option>
  <option value="day">per day</option>
  <option value="night">per night</option>
</select>
                                        </div>
                                    </label>
                                </div>

                                <div className="puma-group">
                                    <label className="underarmour-label">
                                        <span className="newbalance-text">Full Address *</span>
                                        <div className="timberland-icon-wrapper">
                                            <span className="northface-icon"><ion-icon name="location-outline"></ion-icon></span>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                                className="vans-input"
                                                placeholder="123 Luxury Street, Douala, Cameroon"
                                                required
                                            />
                                        </div>
                                    </label>
                                    <button 
                                        type="button" 
                                        onClick={getLocation} 
                                        className="movado-location"
                                        style={{ marginTop: '10px' }}
                                    >
                                        <ion-icon name="navigate-outline"></ion-icon> Get Current Location
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {activeStep === 1 && (
                            <div className="adidas-step">
                                <div className="reebok-row">
                                    <div className="puma-group">
                                        <label className="underarmour-label">
                                            <span className="newbalance-text">Bedrooms</span>
                                            <div className="ck-counter">
                                                <button
                                                    type="button"
                                                    className="ralphlauren-btn"
                                                    onClick={() => handleChange("bedrooms", Math.max(1, formData.bedrooms - 1))}
                                                >
                                                    -
                                                </button>
                                                <span className="tommy-value">{formData.bedrooms}</span>
                                                <button
                                                    type="button"
                                                    className="ralphlauren-btn"
                                                    onClick={() => handleChange("bedrooms", formData.bedrooms + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="puma-group">
                                        <label className="underarmour-label">
                                            <span className="newbalance-text">Bathrooms</span>
                                            <div className="ck-counter">
                                                <button
                                                    type="button"
                                                    className="ralphlauren-btn"
                                                    onClick={() => handleChange("bathrooms", Math.max(1, formData.bathrooms - 1))}
                                                >
                                                    -
                                                </button>
                                                <span className="tommy-value">{formData.bathrooms}</span>
                                                <button
                                                    type="button"
                                                    className="ralphlauren-btn"
                                                    onClick={() => handleChange("bathrooms", formData.bathrooms + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="puma-group">
                                    <label className="underarmour-label">
                                        <span className="newbalance-text">Area (square meters)</span>
                                        <div className="boss-range">
                                            <input
                                                type="range"
                                                min="20"
                                                max="500"
                                                value={formData.area_sqm}
                                                onChange={(e) => handleChange("area_sqm", e.target.value)}
                                                className="dolce-slider"
                                            />
                                            <div className="gabbana-value">{formData.area_sqm} sqm</div>
                                        </div>
                                    </label>
                                </div>

                                <div className="puma-group">
                                    <label className="underarmour-label">
                                        <span className="newbalance-text">Description</span>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                            className="fendi-textarea"
                                                style={{
    color: "#00976a", // Solid dark green for readability
    border: "2px solid #10ca8c", // The bright green from your gradient
   
  }}
                                               rows={5}
                                            placeholder="Describe your property in detail... What makes it special?"
                                            maxLength={500}
                                        />
                                        <div className="versace-count">{formData.description.length}/500</div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Amenities */}
                        {activeStep === 2 && (
                            <div className="adidas-step">
                                <div className="puma-group">
                                    <span className="newbalance-text">Select Amenities</span>
                                    <div className="prada-amenities-grid">
                                        {amenityOptions.map((amenity) => (
                                            <button
                                                key={amenity}
                                                type="button"
                                                className={`miumiu-option ${formData.amenities.includes(amenity) ? 'selected' : ''}`}
                                                onClick={() => handleAmenityToggle(amenity)}
                                            >
                                                <span className="fendi-checkbox">
                                                    {formData.amenities.includes(amenity) ? '✓' : '+'}
                                                </span>
                                                <span className="kenzo-name">{amenity}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Media */}
                        {activeStep === 3 && (
                            <div className="adidas-step">
                                <div className="puma-group">
                                    <span className="newbalance-text">Upload Property Photos</span>
                                    <p className="converse-sub-label">Drag & drop images or click to browse</p>

                                    <div
                                        className={`omega-dropzone ${dragOver ? "dragging" : ""}`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setDragOver(true);
                                        }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <div className="tagheuer-content">
                                            <div className="breitling-icon">
                                                <ion-icon name="cloud-upload-outline"></ion-icon>
                                            </div>
                                            <h3>Add Property Photos</h3>
                                            <p>Upload up to 20 photos. High-quality images get more views.</p>
                                            <button type="button" className="hublot-btn">
                                                {uploading ? "Uploading media..." : "Browse Files"}
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                                multiple
                                                accept="image/*,video/*"
                                            />
                                        </div>
                                    </div>

                                    {formData.media.length > 0 && (
                                        <div className="patek-grid">
                                            {formData.media.map((item, i) => (
                                                <div key={i} className="audemars-item">
                                                    {item.type === "image" ? (
                                                        <img src={item.url} alt={`Media ${i}`} />
                                                    ) : (
                                                        <video src={item.url} controls />
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="richardmille-remove-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeMedia(i);
                                                        }}
                                                    >
                                                        ×
                                                    </button>

                                                    {i === 0 && <div className="vacheron-badge">Primary</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Review */}
                        {activeStep === 4 && (
                            <div className="adidas-step">
                                <div className="jaeger-review-section" style={{ flexDirection: "column" }}>
                                    <h3 className="iwc-title">Review Your Listing</h3>

                                    <div className="blancpain-card" style={{ flexDirection: "column" }}>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Property Title:</span>
                                            <span className="piaget-value">{formData.title}</span>
                                        </div>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Property Type:</span>
                                            <span className="piaget-value">{formData.type}</span>
                                        </div>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Rent:</span>
                                            <span className="piaget-value">XAF {parseInt(formData.rent || 0).toLocaleString()}/{how}</span>
                                        </div>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Address:</span>
                                            <span className="piaget-value">{formData.address}</span>
                                        </div>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Bed/Bath:</span>
                                            <span className="piaget-value">{formData.bedrooms} bed, {formData.bathrooms} bath</span>
                                        </div>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Area:</span>
                                            <span className="piaget-value">{formData.area_sqm} sqm</span>
                                        </div>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Amenities:</span>
                                            <span className="piaget-value">
                                                {formData.amenities.length > 0
                                                    ? formData.amenities.join(', ')
                                                    : 'None selected'}
                                            </span>
                                        </div>
                                        <div className="glashutte-item">
                                            <span className="panerai-label">Photos:</span>
                                            <span className="piaget-value">{formData.media.length} uploaded</span>
                                        </div>
                                    </div>

                                    <div className="girard-agreement">
                                        <input type="checkbox" id="terms" required />
                                        <label htmlFor="terms" style={{ color: "#fff" }}>
                                            I confirm that the information provided is accurate and I have the right to update this listing
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="baume-navigation">
                            {activeStep > 0 && (
                                <button type="button" className="frederique-btn oris-prev" onClick={prevStep}>
                                    ← Previous
                                </button>
                            )}

                            {activeStep < steps.length - 1 ? (
                                <button type="button" className="frederique-btn hamilton-next" onClick={nextStep}>
                                    Next →
                                </button>
                            ) : (
                                <button type="submit" className="longines-submit" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <span className="tissot-spinner"></span>
                                            Updating Listing...
                                        </>
                                    ) : (
                                        'Update Listing '
                                    )}
                                    <ion-icon name="checkmark-done-outline"></ion-icon>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
);
}