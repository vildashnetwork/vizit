import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainPage from "./MainPage";
// import OwnerLogin from "./owner/OwnerLogin";
// import OwnerDash from "./owner/OwnerDash";
// import UserLogin from "./user/UserLogin";
// import UserDash from "./user/UserDash";
import OwnerLoginLanding from "./pages/Auth/Ownerlogin";
import UserAuthLanding from "./pages/Auth/Userlogin";
import ClientDashboard from "./ClientsDash";
import OwnerDashboard from "./OwnersDASH";
import LandingPage from "./pages/LandingPage/LandingPage";
import SearchProperty from "./pages/SearchPropertyPage/SearchProperty";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";
import SeekerProfile from "./pages/SeekerProfile/SeekerProfile";
import { connectSocket } from "./backendauth/socketconnect"
// Simple protected route for owners


function ProtectedOwner({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "owner") {
    return <Navigate to="/owner/login" replace />;
  }
  return children;
}

// Simple protected route for users
function ProtectedUser({ children }) {
  const role = localStorage.getItem("role");
  if (role !== "user") {
    return <Navigate to="/user/login" replace />;
  }
  return children;
}

export default function App() {
  // keep local copy of role so app re-renders on change
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  // optional: listen for storage changes from other tabs
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "role") setRole(e.newValue);
    }
    connectSocket("klkflk435mjk5ok")

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // helpful function to update role (call this when logging in/out)
  const setAppRole = (newRole) => {
    if (newRole) localStorage.setItem("role", newRole);
    else localStorage.removeItem("role");
    setRole(newRole);
  };
  LandingPage
  SearchProperty
  SeekerProfile
  return (
    <Routes>
      {/* <Route path="/" element={<MainPage onRoleSelect={(r) => setAppRole(r)} />} /> */}
      //!Modified by Achenyu
      <Route path="/" element={<LandingPage onRoleSelect={(r) => setAppRole(r)} />} />
      <Route path="/search-property" element={<SearchProperty onRoleSelect={(r) => setAppRole(r)} />} />
      <Route path="/property/:propertyId" element={<PropertyDetails onRoleSelect={(r) => setAppRole(r)} />} />

      //!Testing purposes only ---need modification in the future
      <Route path="/profile" element={<SeekerProfile onRoleSelect={(r) => setAppRole(r)} />} />

      <Route path="/owner/login" element={<OwnerLoginLanding onLogin={() => setAppRole("owner")} />} />
      <Route
        path="/owner/home"
        element={
          <ProtectedOwner>
            <OwnerDashboard onLogout={() => setAppRole(null)} />
          </ProtectedOwner>
        }
      />

      <Route path="/user/login" element={<UserAuthLanding onLogin={() => setAppRole("user")} />} />
      <Route
        path="/user/home"
        element={
          <ProtectedUser>
            <ClientDashboard onLogout={() => setAppRole(null)} />
          </ProtectedUser>
        }
      />

      {/* Fallback — redirect unknown URLs to home */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}
