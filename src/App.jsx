


import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import ResetPassword from "./pages/SeekerProfile/Resetpass.jsx";


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
import { Toaster } from "react-hot-toast";

/* ================= PROTECTED ROUTES ================= */

function ProtectedOwner({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "owner") {
    return <Navigate to="/" replace />;
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
  useEffect(() => {
    const storedRole = localStorage.getItem("role");

    async function decodeTokenAndConnect() {
      try {
        const token = localStorage.getItem("token");
        if (!token || !storedRole) {
          setLoading(false);
          return;
        }

        const endpoint =
          storedRole === "owner"
            ? "https://vizit-backend-hubw.onrender.com/api/owner/decode/token/owner"
            : "https://vizit-backend-hubw.onrender.com/api/user/decode/token/user";

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userna =
            storedRole === "owner"
              ? response.data?.res
              : response.data?.user;
          setuser(userna)

          const userId =
            storedRole === "owner"
              ? response.data?.res?._id
              : response.data?.user?._id;

          connectSocket(userId);

        }
      } catch (err) {
        console.error("Token decode failed:", err);
      } finally {
        setLoading(false);
      }
    }

    decodeTokenAndConnect();

    const onStorageChange = (e) => {
      if (e.key === "role") {
        setRole(e.newValue);
      }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [role]);

  const setAppRole = (newRole) => {
    if (newRole) {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    }
    setRole(newRole);
  };

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






        {/* OWNER ROUTES */}

        <Route path="/chat" element={
          <ProtectedOwner>
            <AdminChatApp />
          </ProtectedOwner>

        } />
        <Route
          path="/dashboard"
          element={
            <ProtectedOwner>
              <Dashboard />
            </ProtectedOwner>
          }
        />

        <Route
          path="/createproperty"
          element={
            <ProtectedOwner>
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
            <ProtectedOwner>
              <Reviews />
            </ProtectedOwner>
          }
        />
        <Route
          path="/listings"
          element={
            <ProtectedOwner>
              <Listings />
            </ProtectedOwner>
          }
        />
        <Route
          path="/calender"
          element={
            <ProtectedOwner>
              <Calender />
            </ProtectedOwner>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedOwner>
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
            <ProtectedOwner>
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
