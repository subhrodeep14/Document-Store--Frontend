import { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import useAuthStore from "./hooks/useAuth";

import ImportRegisterPage from "./pages/ImportRegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CompanyManagementPage from "./pages/CompanyManagementPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

/*
──────────────────────────────────────
FULL SCREEN LOADER
──────────────────────────────────────
*/

function FullScreenLoader() {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center

        bg-slate-50
        dark:bg-slate-950
      "
    >
      <div
        className="
          h-10
          w-10

          animate-spin

          rounded-full

          border-[3px]
          border-indigo-600
          border-t-transparent
        "
      />
    </div>
  );
}

/*
──────────────────────────────────────
PROTECTED ROUTE
──────────────────────────────────────
*/

function ProtectedRoute({
  children,
}) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuthStore();

  /*
  Wait for authentication
  initialization.
  */

  if (isLoading) {
    return (
      <FullScreenLoader />
    );
  }

  /*
  User is not logged in.
  */

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

/*
──────────────────────────────────────
PUBLIC ROUTE
──────────────────────────────────────
*/

function PublicRoute({
  children,
}) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuthStore();

  /*
  Wait for authentication
  initialization.
  */

  if (isLoading) {
    return (
      <FullScreenLoader />
    );
  }

  /*
  Already logged in.
  */

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

/*
──────────────────────────────────────
APP
──────────────────────────────────────
*/

export default function App() {

  const initialize =
    useAuthStore(
      (state) =>
        state.initialize
    );

  /*
  Initialize authentication
  when application starts.
  */

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>

      {/* TOASTS */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,

          style: {
            background: "#fff",
            color: "#27272a",
            border:
              "1px solid #e4e4e7",
            borderRadius: "14px",
            fontSize: "13px",
            boxShadow:
              "0 10px 30px rgb(0 0 0 / 0.08)",
          },
        }}
      />

      {/* ROUTES */}

      <Routes>

        {/* ─────────────────────────────
            LOGIN
        ───────────────────────────── */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* ─────────────────────────────
            DASHBOARD
        ───────────────────────────── */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ─────────────────────────────
            ACCOUNT SETTINGS
           
            This page contains:
            - Change email
            - Change password
        ───────────────────────────── */}

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/account-settings"
  element={
    <ProtectedRoute>
      <div className="p-10 text-2xl">
        ACCOUNT SETTINGS ROUTE WORKS
      </div>
    </ProtectedRoute>
  }
/>

<Route
  path="/change-password"
  element={
    <ProtectedRoute>
      <ChangePasswordPage />
    </ProtectedRoute>
  }
/>

        {/* ─────────────────────────────
            COMPANY MANAGEMENT
        ───────────────────────────── */}

        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute>
              <CompanyManagementPage />
            </ProtectedRoute>
          }
        />

        {/* ─────────────────────────────
            IMPORT REGISTER
        ───────────────────────────── */}

        <Route
          path="/admin/import-register"
          element={
            <ProtectedRoute>
              <ImportRegisterPage />
            </ProtectedRoute>
          }
        />

        {/* ─────────────────────────────
            ROOT
        ───────────────────────────── */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* ─────────────────────────────
            UNKNOWN ROUTE
        ───────────────────────────── */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}