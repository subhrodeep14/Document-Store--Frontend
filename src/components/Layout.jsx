// src/components/Layout.jsx

import { useEffect, useState } from "react";

import {
  Shield,
  Moon,
  Sun,
  LogOut,
  User,
  Bell,
  Search,
  Menu,
} from "lucide-react";

import {
  Building2,
  LayoutDashboard,
} from "lucide-react";

import SwitchCompanyDropdown from "./company/SwitchCompanyDropdown";

import { motion } from "framer-motion";

import logo from "../public/logo.png";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import toast from "react-hot-toast";

import useAuthStore from "../hooks/useAuth";

export default function Layout({
  children,
  onSearch,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  const { user, logout } =
    useAuthStore();

  const activeCompany =
    useAuthStore(
      (s) => s.activeCompany
    );

  const displayName =
    user?.name?.trim()
      ? user.name
      : user?.email?.split("@")[0] ||
        "User";

  const isAdmin =
    user?.role === "ADMIN";

  const isSuperAdmin =
    user?.role ===
    "SUPER_ADMIN";

  const [isDark, setIsDark] =
    useState(() => {
      return (
        localStorage.getItem(
          "theme"
        ) === "dark"
      );
    });

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  /*
  ─────────────────────────────────────
  DARK MODE
  ─────────────────────────────────────
  */

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [isDark]);

  /*
  ─────────────────────────────────────
  LOGOUT
  ─────────────────────────────────────
  */

  const handleLogout =
    async () => {
      try {
        await logout();

        toast.success(
          "Logged out"
        );

        navigate("/login");
      } catch {
        toast.error(
          "Logout failed"
        );
      }
    };

  /*
  ─────────────────────────────────────
  PROFILE
  ─────────────────────────────────────
  */

  const handleProfile =
    () => {
      navigate("/profile");
    };

  return (
    <div
      className="
        min-h-screen

        bg-slate-100
        dark:bg-[#020617]

        transition-colors
        duration-300

        overflow-x-hidden
      "
    >
      {/* BACKGROUND */}

      <div
        className="
          fixed
          inset-0

          overflow-hidden

          pointer-events-none
        "
      >
        <div
          className="
            absolute
            top-[-120px]
            left-[-120px]

            w-[300px]
            h-[300px]

            bg-indigo-500/10

            rounded-full

            blur-3xl
          "
        />

        <div
          className="
            absolute
            bottom-[-120px]
            right-[-120px]

            w-[300px]
            h-[300px]

            bg-violet-500/10

            rounded-full

            blur-3xl
          "
        />
      </div>

      {/* APP */}

      <div className="relative z-10">

        {/* NAVBAR */}

        <motion.header
          initial={{
            opacity: 0,
            y: -14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            sticky
            top-0
            z-50

            h-[74px]

            border-b
            border-slate-200/70
            dark:border-slate-800/70

            bg-white/70
            dark:bg-slate-950/70

            backdrop-blur-xl
          "
        >
          <div
            className="
              h-full

              px-5
              lg:px-8

              flex
              items-center
              justify-between
            "
          >

            {/* LEFT */}

            <div className="flex items-center gap-4">

              {/* MOBILE MENU */}

              {/*
              <button
                onClick={() =>
                  setMobileMenu(
                    !mobileMenu
                  )
                }
                className="
                  lg:hidden

                  w-10
                  h-10

                  rounded-2xl

                  bg-slate-100
                  dark:bg-slate-800

                  flex
                  items-center
                  justify-center
                "
              >
                <Menu
                  size={18}
                  className="
                    text-slate-600
                    dark:text-slate-300
                  "
                />
              </button>
              */}

              {/* LOGO */}

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
                className="
                  flex
                  items-center
                  gap-4

                  rounded-2xl

                  px-3
                  py-2

                  hover:bg-white/70
                  dark:hover:bg-slate-800/60

                  transition-all
                  duration-300
                "
              >

                {/* LOGO */}

                <div className="relative">

                  {/* Glow */}

                  <div
                    className="
                      absolute
                      inset-0

                      rounded-2xl

                      bg-indigo-500/30

                      blur-2xl
                    "
                  />

                  <div
                    className="
                      relative

                      w-20
                      h-14

                      rounded-2xl

                      bg-white

                      text-emerald-700

                      dark:bg-emerald-200

                      border
                      border-slate-200
                      dark:border-slate-700

                      shadow-xl
                      shadow-indigo-500/10

                      flex
                      items-center
                      justify-center

                      overflow-hidden
                    "
                  >
                    <img
                      src={logo}
                      alt="MemoFlow"
                      className="
                        w-full
                        h-full
                        object-contain
                        p-1
                      "
                    />
                  </div>
                </div>

                {/* TEXT */}

                <div className="text-left">

                  <h1
                    className="
                      text-xl
                      font-extrabold

                      tracking-tight

                      text-slate-900
                      dark:text-white
                    "
                  >
                    MemoFlow
                  </h1>

                  <p
                    className="
                      text-xs

                      font-medium

                      text-slate-500
                      dark:text-slate-400

                      tracking-wide
                    "
                  >
                    Digital Dispatch Register
                  </p>

                </div>

              </motion.button>

            </div>

            {/* RIGHT */}

            <div
              className="
                flex
                items-center
                gap-3

                bg-white/40
                dark:bg-slate-900/40

                px-3
                py-2

                rounded-2xl

                border
                border-slate-200/60
                dark:border-slate-800/60
              "
            >

              {/* COMPANY SWITCHER */}

              {(isAdmin ||
                isSuperAdmin) && (
                <div className="hidden lg:block">
                  <SwitchCompanyDropdown />
                </div>
              )}

              {/* COMPANY PANEL */}

              {(isAdmin ||
                isSuperAdmin) && (
                <button
                  onClick={() =>
                    navigate(
                      location.pathname ===
                        "/admin/companies"
                        ? "/dashboard"
                        : "/admin/companies"
                    )
                  }
                  className="
                    hidden
                    md:flex

                    h-10
                    px-4

                    rounded-xl

                    bg-indigo-600

                    text-white

                    text-xs
                    font-semibold

                    items-center
                    gap-2

                    hover:bg-indigo-700

                    transition-all
                  "
                >
                  <LayoutDashboard
                    size={14}
                  />

                  {location.pathname ===
                  "/admin/companies"
                    ? "Dashboard"
                    : "Company Panel"}
                </button>
              )}

              {/* ROLE */}

              <div
                className="
                  hidden
                  xl:flex

                  h-10
                  px-3

                  rounded-xl

                  bg-violet-50
                  dark:bg-violet-500/10

                  items-center
                  gap-2

                  text-xs
                  font-semibold

                  text-violet-700
                  dark:text-violet-300
                "
              >
                <Shield size={14} />

                {user?.role?.replace(
                  "_",
                  " "
                )}
              </div>

              {/* ACTIVE COMPANY */}

              {activeCompany && (
                <div
                  className="
                    hidden
                    xl:flex

                    h-10
                    px-3

                    rounded-xl

                    bg-emerald-50
                    dark:bg-emerald-500/10

                    items-center
                    gap-2

                    text-xs
                    font-semibold

                    text-emerald-700
                    dark:text-emerald-300
                  "
                >
                  <Building2
                    size={13}
                  />

                  {activeCompany.name}
                </div>
              )}

              {/* DARK MODE */}

              <button
                onClick={() =>
                  setIsDark(
                    (v) => !v
                  )
                }
                className="
                  w-11
                  h-11

                  rounded-2xl

                  bg-slate-100
                  dark:bg-slate-800

                  flex
                  items-center
                  justify-center

                  hover:bg-slate-200
                  dark:hover:bg-slate-700

                  transition-all
                "
                title={
                  isDark
                    ? "Light mode"
                    : "Dark mode"
                }
              >
                {isDark ? (
                  <Sun
                    size={18}
                    className="text-yellow-400"
                  />
                ) : (
                  <Moon
                    size={18}
                    className="text-blue-400"
                  />
                )}
              </button>

              {/* USER / PROFILE */}

              <button
                onClick={
                  handleProfile
                }
                className="
                  group

                  hidden
                  md:flex

                  items-center
                  gap-3

                  rounded-2xl

                  px-2
                  py-1.5

                  text-left

                  hover:bg-slate-100
                  dark:hover:bg-slate-800

                  transition-all
                  duration-200

                  cursor-pointer
                "
                title="My Profile"
              >

                {/* AVATAR */}

                <div className="relative">

                  <div
                    className="
                      absolute
                      inset-0

                      rounded-2xl

                      bg-indigo-500/20

                      blur-lg

                      opacity-0
                      group-hover:opacity-100

                      transition-opacity
                    "
                  />

                  <div
                    className="
                      relative

                      w-11
                      h-11

                      rounded-2xl

                      bg-gradient-to-br
                      from-indigo-600
                      via-violet-600
                      to-purple-600

                      text-white

                      flex
                      items-center
                      justify-center

                      font-bold
                      text-sm

                      shadow-lg
                      shadow-indigo-500/20
                    "
                  >
                    {displayName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                </div>

                {/* USER INFO */}

                <div className="hidden xl:block">

                  <p
                    className="
                      text-sm
                      font-semibold

                      text-slate-800
                      dark:text-white
                    "
                  >
                    {displayName}
                  </p>

                  <p
                    className="
                      text-xs

                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {user?.role?.replace(
                      "_",
                      " "
                    )}
                  </p>

                </div>

                {/* PROFILE ICON */}

                <User
                  size={15}
                  className="
                    hidden
                    xl:block

                    text-slate-400
                    dark:text-slate-500

                    group-hover:text-indigo-500

                    transition-colors
                  "
                />

              </button>

              {/* LOGOUT */}

              <button
                onClick={
                  handleLogout
                }
                className="
                  w-11
                  h-11

                  rounded-2xl

                  bg-red-50
                  dark:bg-red-500/10

                  flex
                  items-center
                  justify-center

                  hover:bg-red-100
                  dark:hover:bg-red-500/20

                  transition-all
                "
                title="Logout"
              >
                <LogOut
                  size={18}
                  className="
                    text-red-500
                  "
                />
              </button>

            </div>
          </div>
        </motion.header>

        {/* MOBILE SEARCH */}

        {/*
        {onSearch && (
          <div className="lg:hidden">
            ...
          </div>
        )}
        */}

        {/* CONTENT */}

        <main
          className="
            p-4
            lg:p-6
          "
        >
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
          >
            {children}
          </motion.div>
        </main>

      </div>
    </div>
  );
}