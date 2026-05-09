import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import Home from "../pages/Home";
import SupportUnits from "../pages/SupportUnits";
import CreateSupportUnit from "../pages/CreateSupportUnit";
import type { JSX } from "react";
import Donations from "../pages/SupportUnits/Donations";
import Missions from "../pages/SupportUnits/Missions";
import DonationDetails from "../pages/SupportUnits/Donations/Details";
import MissionDetails from "../pages/SupportUnits/Missions/Details";
import EditSupportUnit from "../pages/EditSupportUnit";
import Candidatures from "../pages/Candidatures";
import Certificates from "../pages/Certificates";
import Settings from "../pages/Settings";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/support-units" element={<SupportUnits />} />
          <Route path="/candidatures" element={<Candidatures />} />
          <Route path="/support-units/new" element={<CreateSupportUnit />} />
          <Route path="/support-units/:id/edit" element={<EditSupportUnit />} />
          <Route path="/support-units/:id/donations" element={<Donations />} />
          <Route path="/support-units/:id/missions" element={<Missions />} />
          <Route
            path="/support-units/:id/donations/:donationId"
            element={<DonationDetails />}
          />
          <Route
            path="/support-units/:id/missions/:missionId"
            element={<MissionDetails />}
          />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
