import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Mainpage from "./MainPages/Mainpage";
import Header from "./Components/Header";
import Login from "./MainPages/Login";
import Register from "./MainPages/Register";
import Panel from "./Portal/Panel";
import Nav from "./Components/Nav";
import AdminSettings from "./Portal/AdminSettings";
import { Box } from "@mui/material";
import Status from "./MainPages/Status";
import Application from "./ApplicationPages/Application";
import PersonalInformation from "./ApplicationPages/PersonalInformation";
import AbilitiesKnowledge from "./ApplicationPages/AbilitiesKnowledge";
import Education from "./ApplicationPages/Education";
import Vas from "./Portal/Vas";
import Clients from "./Portal/Clients";
import AppImprovement from "./ApplicationPages/AppImprovment";
import HardwareInspect from "./ApplicationPages/HardwareInspect";
import IntroducingYourself from "./ApplicationPages/IntroducingYourself";
import AptitudeTests from "./ApplicationPages/AptitudeTests";
import LegalDocuments from "./ApplicationPages/LegalDocuments";
import AdminLogin from "./Portal/AdminLogin";
import PrivateRoute from "./PrivateRoute";
import PrivateRouteVa from "./PrivateRouteVA";
import PrivateRouteApplication from "./PrivateRouteApplication";
import IsLoggedAdmin from "./IsLoggedAdmin";
import IsLoggedVA from "./IsLoggedVA";
import NotFoundPage from "./Portal/NotFoundPage";
import ClientPage from "./MainPages/ClientPage";
import ChangeLog from "./MainPages/ChangeLog";
import AddTask from "./MainPages/AddTask";
import VaInnerComp from "./Components/VaInnerComp";
import RegisterStepOne from "./MainPages/RegisterStepOne";
import RegisterStepTwo from "./MainPages/RegisterStepTwo";
import RegisterStepOneValid from "./RegisterStepOneValid";
import VideoRecordingComp from "./ApplicationPages/VideoRecordingComp";
import LoginClient from "./clientPortal/LoginClient";
import PanelClient from "./clientPortal/PanelClient";
import RegisterClient from "./clientPortal/RegisterClient";
import IsLoggedClient from "./clientPortal/IsLoggedClient";
import ClientNav from "./Components/ClientNav";
import ClientBilling from "./clientPortal/ClientBilling";
import ClientVas from "./clientPortal/ClientVas";
import RouteValidate from "./clientPortal/RouteValidate";

const App = () => {
  const location = useLocation();

  const showNav = ["/settings", "/panel", "/vas", "/clients"].some((path) =>
    window.location.pathname.includes(path)
  );

  const showClientNav = ["/client/dashboard", "/client/assistants", "/client/billing"].some(
    (path) => window.location.pathname.includes(path)
  );

  useEffect(() => {}, [location]);

  return (
    <Box sx={{ display: "flex", flexDirection: !showNav ? "column" : "row" }}>
      {!showNav && <Header />}
      {showNav && <Nav></Nav>}
      {showClientNav && <ClientNav></ClientNav>}

      <Routes>
        <Route
          path="/client/login"
          element={
            <RouteValidate>
              <LoginClient />
            </RouteValidate>
          }
        />
        <Route
          path="/client/dashboard"
          element={
            <IsLoggedClient>
              <PanelClient />
            </IsLoggedClient>
          }
        />
        <Route
          path="/client/register"
          element={
            <RouteValidate>
              <RegisterClient />
            </RouteValidate>
          }
        />
        <Route
          path="/client/billing"
          element={
            <IsLoggedClient>
              <ClientBilling />{" "}
            </IsLoggedClient>
          }
        />
        <Route
          path="/client/assistants"
          element={
            <IsLoggedClient>
              <ClientVas />
            </IsLoggedClient>
          }
        />
        <Route
          path="/manage/access"
          element={
            <IsLoggedAdmin>
              {" "}
              <AdminLogin />{" "}
            </IsLoggedAdmin>
          }
        />
        <Route
          path="/add-task"
          element={
            <PrivateRoute>
              <AddTask />{" "}
            </PrivateRoute>
          }
        />
        <Route path="/tet" element={<VideoRecordingComp />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/va-selection/:id" element={<ClientPage />} />
        <Route path="/va/:id" element={<VaInnerComp />} />
        <Route
          path="/changelog"
          element={
            <PrivateRoute>
              <ChangeLog />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/panel"
          element={
            <PrivateRoute>
              {" "}
              <Panel />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AdminSettings />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/vas"
          element={
            <PrivateRoute>
              <Vas />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <PrivateRoute>
              {" "}
              <Clients />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path=""
          element={
            <IsLoggedVA>
              {" "}
              <Mainpage />{" "}
            </IsLoggedVA>
          }
        />
        <Route
          path="/login"
          element={
            <IsLoggedVA>
              {" "}
              <Login />{" "}
            </IsLoggedVA>
          }
        />
        <Route
          path="/register"
          element={
            <IsLoggedVA>
              {" "}
              <Register />{" "}
            </IsLoggedVA>
          }
        >
          <Route
            path=""
            element={
              <IsLoggedVA>
                {" "}
                <RegisterStepOne />{" "}
              </IsLoggedVA>
            }
          />
          <Route
            path="step-two"
            element={
              <IsLoggedVA>
                <RegisterStepOneValid>
                  <RegisterStepTwo />
                </RegisterStepOneValid>{" "}
              </IsLoggedVA>
            }
          />
        </Route>
        <Route
          path="/status"
          element={
            <PrivateRouteVa>
              {" "}
              <Status />{" "}
            </PrivateRouteVa>
          }
        />
        <Route
          path="/application"
          element={
            <PrivateRouteVa>
              {" "}
              <PrivateRouteApplication>
                <Application />{" "}
              </PrivateRouteApplication>{" "}
            </PrivateRouteVa>
          }
        >
          <Route
            path=""
            element={
              <PrivateRouteVa>
                {" "}
                <PersonalInformation />{" "}
              </PrivateRouteVa>
            }
          />
          <Route
            path="abilities"
            element={
              <PrivateRouteVa>
                {" "}
                <AbilitiesKnowledge />{" "}
              </PrivateRouteVa>
            }
          />
          <Route
            path="education"
            element={
              <PrivateRouteVa>
                {" "}
                <Education />{" "}
              </PrivateRouteVa>
            }
          />
          <Route
            path="app-improvement"
            element={
              <PrivateRouteVa>
                <AppImprovement />
              </PrivateRouteVa>
            }
          />
          <Route
            path="hardware-inspect"
            element={
              <PrivateRouteVa>
                <HardwareInspect />{" "}
              </PrivateRouteVa>
            }
          />
          <Route
            path="introducing-yourself"
            element={
              <PrivateRouteVa>
                <IntroducingYourself />
              </PrivateRouteVa>
            }
          />
          <Route
            path="aptitude-tests"
            element={
              <PrivateRouteVa>
                <AptitudeTests />{" "}
              </PrivateRouteVa>
            }
          />
          <Route
            path="legal-documents"
            element={
              <PrivateRouteVa>
                <LegalDocuments />
              </PrivateRouteVa>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </Box>
  );
};

export default App;
