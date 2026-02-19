


import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ResetPassword from "./pages/SeekerProfile/Resetpass.jsx";
import RoleConflictPage from "./Failed.jsx";
import KYCForm from "./KYCForm.jsx";
import MainPage from "./MainPage";
import OwnerLoginLanding from "./pages/Auth/Ownerlogin";
import UserAuthLanding from "./pages/Auth/Userlogin";
import ClientDashboard from "./ClientsDash";
import OwnerDashboard from "./OwnersDASH";
import LandingPage from "./pages/LandingPage/LandingPage";
import SearchProperty from "./pages/SearchPropertyPage/SearchProperty";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import SeekerProfile from "./pages/SeekerProfile/SeekerProfile";
import Chat from "./pages/Shared/Chat/Chat";
import Dashboard from "./pages/Owners/Dashboard/Dashboard";
import Listings from "./pages/Owners/Listings/Listings";
import Calender from "./pages/Owners/Calender/Calender";
import Appointments from "./pages/Owners/Appointments/Appointments";
import Reviews from "./pages/Owners/Reviews/Reviews";
import { connectSocket } from "./realTimeConnect/socketconnect";
import AdminReelsApp from "./pages/Owners/Reel/App"
import AdminChatApp from "./pages/Owners/Chats/App"
import UserChatApp from "./pages/Chats/App"
import UserReelsApp from "./pages/Reel/App"
import CreateHouseForm from "./pages/Owners/Listings/CreateProperty";
import VideoCallPage from "./pages/Chats/components/ChatMain/Videocall/Videocall"
import AccountBlocked from "./Suspend.jsx";
import { Toaster } from "react-hot-toast";

/* ================= PROTECTED ROUTES ================= */

// function ProtectedOwner({ children }) {
//   const role = localStorage.getItem("role");
//   if (role !== "owner") {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// }

const ProtectedOwner = ({ user, children }) => {
  // If we are still loading, don't redirect anywhere yet
  if (!user || Object.keys(user).length === 0) {
     return null; // Or a small spinner
  }
  
  // If the user isn't approved, send to KYC
  if (user.status !== "approved") {
    return <Navigate to="/kyc" replace />;
  }
  
  return children;
}

function ProtectedUser({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "user") {
    return <Navigate to="/" replace />;
  }
  return children;
}

/* ================= MAIN APP ================= */

export default function App() {
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [loading, setLoading] = useState(true);
  const [iscall, setiscall] = useState(false)

  const [user, setuser] = useState([])
 





  const setAppRole = (newRole) => {
    if (newRole) {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    }
    setRole(newRole);
  };

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();



useEffect(() => {
  const storedRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  async function decodeTokenAndConnect() {
    if (!token || !storedRole) {
      setLoading(false);
      return;
    }

    try {
      const endpoint = storedRole === "owner"
          ? "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner"
          : "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const userData = storedRole === "owner" ? response.data?.res : response.data?.user;
        
        if (userData) {
          setuser(userData); // Update state
          connectSocket(userData._id);

          // Handle Banned Status
          const status = userData?.accountstatus?.toLowerCase();
          if (["suspended", "deactivated", "blocked"].includes(status)) {
            navigate("/banned", { replace: true });
          }
        }
      }
    } catch (err) {
      console.error("Auth failed:", err);
      // Optional: if unauthorized, clear localstorage and go to login
    } finally {
      setLoading(false); // Stop showing the black "Loading..." screen
    }
  }

  decodeTokenAndConnect();
}, [role]); // Only re-run if role changes





  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token) {
      // Save token securely
      localStorage.setItem("token", token);
      if (role == "seeker") {
        localStorage.setItem("role", "user");
      } else {
        localStorage.setItem("role", "owner");
      }



      // Decode token to get email (optional)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.email;

      console.log("Token:", token);
      console.log("Email:", email);
      console.log("Role:", role);

      // Redirect based on role
      if (role === "owner") {
        navigate("/kyc");
      } else {
        navigate("/");
      }
    }
  }, [searchParams, navigate]);





  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000aa",
          color: "#fff",
          zIndex: 9999,
        }}
      >
        Loading...
      </div>
    );
  }

  let remoteUserId = localStorage.getItem("remoteUserId")
  let remoteUserName = localStorage.getItem("remoteUserName")


  // if (iscall) {
  //   return <VideoCallPage
  //     remoteUserId={remoteUserId}
  //     remoteUserName={remoteUserName}
  //     setiscall={setiscall}
  //   />
  // }
  return (
    <>


      <Toaster position="bottom-left" reverseOrder={false} />

      <VideoCallPage
        remoteUserId={remoteUserId}
        remoteUserName={remoteUserName}
        setiscall={setiscall}
      />
      {/* <VideoCallPage
        remoteUserId={user?._id}
        remoteUserName={user?.name}
      /> */}
      <Routes>
        <Route path="/" element={<LandingPage onRoleSelect={setAppRole} />} />

        <Route path="/search-property" element={
          <SearchProperty />
        } />
        <Route path="/property/:propertyId" element={
          <PropertyDetails />
        } />
        <Route path="/video-call" element={
          <VideoCallPage />
        } />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/kyc" element={<KYCForm />} />

        <Route path="/login-failed" element={<RoleConflictPage />} />
        <Route path="/banned" element={<AccountBlocked reason={user?.reason} nav={user?.accountstatus} />} />









        {/* OWNER ROUTES */}

        <Route path="/chat" element={
          <ProtectedOwner>
            <AdminChatApp />
          </ProtectedOwner>

        } />
        <Route 
  path="/dashboard" 
  element={
    <ProtectedOwner user={user}>
      <Dashboard />
    </ProtectedOwner>
  } 
/>

        <Route
          path="/createproperty"
          element={
            <ProtectedOwner  user={user}>
              <CreateHouseForm />
            </ProtectedOwner>
          }
        />
        <Route
          path="/reels"
          element={

            <AdminReelsApp />

          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedOwner   user={user}>
              <Reviews />
            </ProtectedOwner>
          }
        />
        <Route
          path="/listings"
          element={
            <ProtectedOwner   user={user}>
              <Listings />
            </ProtectedOwner>
          }
        />
        <Route
          path="/calender"
          element={
            <ProtectedOwner  user={user}>
              <Calender />
            </ProtectedOwner>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedOwner  user={user}>
              <Appointments />
            </ProtectedOwner>
          }
        />

        <Route
          path="/owner/login"
          element={<OwnerLoginLanding onLogin={() => setAppRole("owner")} />}
        />
        <Route
          path="/owner/home"
          element={
            <ProtectedOwner  user={user}>
              <OwnerDashboard onLogout={() => setAppRole(null)} />
            </ProtectedOwner>
          }
        />

        {/* USER ROUTES */}
        <Route
          path="/user/login"
          element={<UserAuthLanding onLogin={() => setAppRole("user")} />}
        />




        <Route path="/profile" element={
          <ProtectedUser>
            <SeekerProfile />
          </ProtectedUser>
        } />

        <Route path="/user/chat" element={
          <ProtectedUser>
            <UserChatApp />
          </ProtectedUser>
        } />

        <Route path="/user/reel" element={
          <ProtectedUser>
            <UserReelsApp />
          </ProtectedUser>
        } />
        <Route
          path="/user/home"
          element={
            <ProtectedUser>
              <ClientDashboard onLogout={() => setAppRole(null)} />
            </ProtectedUser>
          }
        />
      </Routes>
    </>
  );
}
