import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
  CheckCircle2,
} from "lucide-react";

import toast from "react-hot-toast";

import useAuthStore from "../hooks/useAuth";

export default function ChangePasswordPage() {

  const navigate =
    useNavigate();

  /*
  ──────────────────────────────────────
  AUTH STORE
  ──────────────────────────────────────
  */

  const user =
    useAuthStore(
      (state) => state.user
    );

  const changePassword =
    useAuthStore(
      (state) =>
        state.changePassword
    );

  const changeEmail =
    useAuthStore(
      (state) =>
        state.changeEmail
    );

  /*
  ──────────────────────────────────────
  PASSWORD STATE
  ──────────────────────────────────────
  */

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    passwordLoading,
    setPasswordLoading,
  ] = useState(false);

  /*
  ──────────────────────────────────────
  EMAIL STATE
  ──────────────────────────────────────
  */

  const [
    newEmail,
    setNewEmail,
  ] = useState(
    user?.email || ""
  );

  const [
    emailPassword,
    setEmailPassword,
  ] = useState("");

  const [
    showEmailPassword,
    setShowEmailPassword,
  ] = useState(false);

  const [
    emailLoading,
    setEmailLoading,
  ] = useState(false);

  /*
  ──────────────────────────────────────
  KEEP EMAIL IN SYNC
  ──────────────────────────────────────
  */

  useEffect(() => {

    if (user?.email) {
      setNewEmail(
        user.email
      );
    }

  }, [user?.email]);

  /*
  ──────────────────────────────────────
  CHANGE PASSWORD
  ──────────────────────────────────────
  */

  const handlePasswordSubmit =
    async (event) => {

      event.preventDefault();

      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {

        toast.error(
          "Please fill in every password field"
        );

        return;
      }

      /*
      Backend requires minimum
      12 characters.
      */

      if (
        newPassword.length < 6
      ) {

        toast.error(
          "New password must contain at least 6 characters"
        );

        return;
      }

      if (
        newPassword !==
        confirmPassword
      ) {

        toast.error(
          "New passwords do not match"
        );

        return;
      }

      if (
        currentPassword ===
        newPassword
      ) {

        toast.error(
          "New password must be different from the current password"
        );

        return;
      }

      setPasswordLoading(
        true
      );

      try {

        await changePassword({
          currentPassword,
          newPassword,
          confirmPassword,
        });

        toast.success(
          "Password changed successfully"
        );

        setCurrentPassword(
          ""
        );

        setNewPassword(
          ""
        );

        setConfirmPassword(
          ""
        );

        /*
        Return to dashboard after
        successful password change.
        */

        setTimeout(() => {

          navigate(
            "/dashboard"
          );

        }, 500);

      } catch (err) {

        toast.error(
          err.response?.data?.error ||
            "Could not change password"
        );

      } finally {

        setPasswordLoading(
          false
        );
      }
    };

  /*
  ──────────────────────────────────────
  CHANGE EMAIL
  ──────────────────────────────────────
  */

  const handleEmailSubmit =
    async (event) => {

      event.preventDefault();

      const normalizedEmail =
        newEmail
          .trim()
          .toLowerCase();

      /*
      EMPTY EMAIL
      */

      if (
        !normalizedEmail
      ) {

        toast.error(
          "Please enter your email address"
        );

        return;
      }

      /*
      BASIC EMAIL VALIDATION
      */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          normalizedEmail
        )
      ) {

        toast.error(
          "Please enter a valid email address"
        );

        return;
      }

      /*
      SAME EMAIL
      */

      if (
        normalizedEmail ===
        user?.email?.trim().toLowerCase()
      ) {

        toast.error(
          "This is already your current email"
        );

        return;
      }

      /*
      CURRENT PASSWORD REQUIRED
      */

      if (
        !emailPassword
      ) {

        toast.error(
          "Please enter your current password"
        );

        return;
      }

      setEmailLoading(
        true
      );

      try {

        await changeEmail({
          newEmail:
            normalizedEmail,

          currentPassword:
            emailPassword,
        });

        /*
        SUCCESS
        */

        toast.success(
          "Email changed successfully"
        );

        /*
        Clear authorization password.
        */

        setEmailPassword(
          ""
        );

        /*
        New email is already reflected
        through Zustand.
        */

        setNewEmail(
          normalizedEmail
        );

      } catch (err) {

        console.error(
          "CHANGE EMAIL ERROR:",
          err
        );

        toast.error(
          err.response?.data?.error ||
            "Could not change email"
        );

      } finally {

        setEmailLoading(
          false
        );
      }
    };

  /*
  ──────────────────────────────────────
  RENDER
  ──────────────────────────────────────
  */

  return (
    <div
      className="
        min-h-screen

        bg-slate-50

        px-4
        py-8

        dark:bg-slate-950

        sm:px-6
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-2xl
        "
      >

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
          className="
            mb-8

            inline-flex
            items-center
            gap-2

            rounded-xl

            px-3
            py-2

            text-sm
            font-medium

            text-slate-600

            transition

            hover:bg-slate-200
            hover:text-slate-900

            dark:text-slate-300
            dark:hover:bg-slate-800
            dark:hover:text-white
          "
        >
          <ArrowLeft
            size={17}
          />

          Back to dashboard
        </button>

        {/* HEADER */}

        <div
          className="
            mb-6
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                flex
                h-14
                w-14

                items-center
                justify-center

                rounded-2xl

                bg-gradient-to-br
                from-indigo-600
                to-violet-600

                text-white

                shadow-lg
                shadow-indigo-500/20
              "
            >
              <UserRound
                size={25}
              />
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-bold

                  text-slate-900
                  dark:text-white
                "
              >
                Account Settings
              </h1>

              <p
                className="
                  mt-1

                  text-sm

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Manage your email and
                password
              </p>

            </div>

          </div>

        </div>

        {/* ACCOUNT INFORMATION */}

        <div
          className="
            mb-6

            overflow-hidden

            rounded-3xl

            border
            border-slate-200

            bg-white

            shadow-xl
            shadow-slate-200/50

            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20
          "
        >

          <div
            className="
              border-b
              border-slate-200
              dark:border-slate-800

              px-6
              py-5

              sm:px-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10

                  items-center
                  justify-center

                  rounded-xl

                  bg-indigo-50

                  dark:bg-indigo-500/10
                "
              >
                <UserRound
                  size={19}
                  className="
                    text-indigo-600
                    dark:text-indigo-400
                  "
                />
              </div>

              <div>

                <h2
                  className="
                    font-bold

                    text-slate-900
                    dark:text-white
                  "
                >
                  Account
                </h2>

                <p
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  Your current account
                  information
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              grid
              gap-4

              p-6

              sm:grid-cols-2
              sm:p-8
            "
          >

            {/* NAME */}

            <div
              className="
                rounded-2xl

                bg-slate-50

                p-4

                dark:bg-slate-950
              "
            >

              <p
                className="
                  text-xs
                  font-medium

                  text-slate-500
                "
              >
                Name
              </p>

              <p
                className="
                  mt-1

                  font-semibold

                  text-slate-900
                  dark:text-white
                "
              >
                {user?.name ||
                  "Not set"}
              </p>

            </div>

            {/* ROLE */}

            <div
              className="
                rounded-2xl

                bg-slate-50

                p-4

                dark:bg-slate-950
              "
            >

              <p
                className="
                  text-xs
                  font-medium

                  text-slate-500
                "
              >
                Role
              </p>

              <p
                className="
                  mt-1

                  font-semibold

                  text-slate-900
                  dark:text-white
                "
              >
                {user?.role
                  ?.replace(
                    "_",
                    " "
                  ) ||
                  "User"}
              </p>

            </div>

            {/* CURRENT EMAIL */}

            <div
              className="
                rounded-2xl

                bg-slate-50

                p-4

                sm:col-span-2

                dark:bg-slate-950
              "
            >

              <p
                className="
                  text-xs
                  font-medium

                  text-slate-500
                "
              >
                Current email
              </p>

              <p
                className="
                  mt-1

                  font-semibold

                  text-slate-900
                  dark:text-white

                  break-all
                "
              >
                {user?.email}
              </p>

            </div>

          </div>

        </div>

        {/* CHANGE EMAIL */}

        <div
          className="
            mb-6

            overflow-hidden

            rounded-3xl

            border
            border-slate-200

            bg-white

            shadow-xl
            shadow-slate-200/50

            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20
          "
        >

          {/* EMAIL HEADER */}

          <div
            className="
              border-b
              border-slate-200

              bg-gradient-to-r
              from-emerald-600
              to-teal-600

              px-6
              py-6

              text-white

              sm:px-8
            "
          >

            <div
              className="
                mb-4

                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                bg-white/15
              "
            >
              <Mail
                size={25}
              />
            </div>

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Change email
            </h2>

            <p
              className="
                mt-2

                text-sm

                text-emerald-100
              "
            >
              Update the email address
              associated with your
              account.
            </p>

          </div>

          {/* EMAIL FORM */}

          <form
            onSubmit={
              handleEmailSubmit
            }
            className="
              space-y-5

              p-6

              sm:p-8
            "
          >

            {/* NEW EMAIL */}

            <div>

              <label
                htmlFor="newEmail"
                className="
                  mb-2
                  block

                  text-sm
                  font-semibold

                  text-slate-700
                  dark:text-slate-200
                "
              >
                New email address
              </label>

              <div
                className="
                  relative
                "
              >

                <Mail
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400
                  "
                />

                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(event) =>
                    setNewEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={
                    emailLoading
                  }
                  className="
                    h-12
                    w-full

                    rounded-xl

                    border
                    border-slate-300

                    bg-white

                    pl-11
                    pr-4

                    text-slate-900

                    outline-none

                    transition

                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/15

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                  placeholder="you@example.com"
                />

              </div>

            </div>

            {/* CURRENT PASSWORD */}

            <div>

              <label
                htmlFor="emailPassword"
                className="
                  mb-2
                  block

                  text-sm
                  font-semibold

                  text-slate-700
                  dark:text-slate-200
                "
              >
                Current password
              </label>

              <div
                className="
                  relative
                "
              >

                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400
                  "
                />

                <input
                  id="emailPassword"
                  type={
                    showEmailPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    emailPassword
                  }
                  onChange={(event) =>
                    setEmailPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  disabled={
                    emailLoading
                  }
                  className="
                    h-12
                    w-full

                    rounded-xl

                    border
                    border-slate-300

                    bg-white

                    pl-11
                    pr-12

                    text-slate-900

                    outline-none

                    transition

                    focus:border-emerald-500
                    focus:ring-4
                    focus:ring-emerald-500/15

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowEmailPassword(
                      (value) =>
                        !value
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2

                    -translate-y-1/2

                    rounded-lg

                    p-2

                    text-slate-500

                    hover:bg-slate-100

                    dark:hover:bg-slate-800
                  "
                  aria-label="Show or hide current password"
                >
                  {showEmailPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>

              </div>

            </div>

            {/* SECURITY MESSAGE */}

            <div
              className="
                rounded-xl

                border
                border-amber-200

                bg-amber-50

                px-4
                py-3

                text-xs

                text-amber-800

                dark:border-amber-500/20
                dark:bg-amber-500/10
                dark:text-amber-300
              "
            >

              <div
                className="
                  flex
                  gap-2
                "
              >

                <ShieldCheck
                  size={16}
                  className="
                    mt-0.5
                    shrink-0
                  "
                />

                <p>
                  Your current password
                  is required to
                  authorize an email
                  change.
                </p>

              </div>

            </div>

            {/* EMAIL SUBMIT */}

            <button
              type="submit"
              disabled={
                emailLoading
              }
              className="
                flex
                h-12
                w-full

                items-center
                justify-center
                gap-2

                rounded-xl

                bg-emerald-600

                font-semibold

                text-white

                transition

                hover:bg-emerald-700

                focus:outline-none
                focus:ring-4
                focus:ring-emerald-500/30

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <Mail
                size={18}
              />

              {emailLoading
                ? "Updating email..."
                : "Update email"}

            </button>

          </form>

        </div>

        {/* CHANGE PASSWORD */}

        <div
          className="
            overflow-hidden

            rounded-3xl

            border
            border-slate-200

            bg-white

            shadow-xl
            shadow-slate-200/50

            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20
          "
        >

          {/* PASSWORD HEADER */}

          <div
            className="
              border-b
              border-slate-200

              bg-gradient-to-r
              from-indigo-600
              to-violet-600

              px-6
              py-7

              text-white

              dark:border-slate-800

              sm:px-8
            "
          >

            <div
              className="
                mb-4

                flex
                h-12
                w-12

                items-center
                justify-center

                rounded-2xl

                bg-white/15
              "
            >
              <ShieldCheck
                size={25}
              />
            </div>

            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Change password
            </h2>

            <p
              className="
                mt-2

                text-sm

                text-indigo-100
              "
            >
              Update the password
              for{" "}
              <span className="font-semibold">
                {user?.email}
              </span>
            </p>

          </div>

          {/* PASSWORD FORM */}

          <form
            onSubmit={
              handlePasswordSubmit
            }
            className="
              space-y-5

              p-6

              sm:p-8
            "
          >

            {/* CURRENT PASSWORD */}

            <div>

              <label
                htmlFor="currentPassword"
                className="
                  mb-2
                  block

                  text-sm
                  font-semibold

                  text-slate-700
                  dark:text-slate-200
                "
              >
                Current password
              </label>

              <div
                className="
                  relative
                "
              >

                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400
                  "
                />

                <input
                  id="currentPassword"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    currentPassword
                  }
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                  disabled={
                    passwordLoading
                  }
                  className="
                    h-12
                    w-full

                    rounded-xl

                    border
                    border-slate-300

                    bg-white

                    pl-11
                    pr-12

                    text-slate-900

                    outline-none

                    transition

                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/15

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      (value) =>
                        !value
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2

                    -translate-y-1/2

                    rounded-lg

                    p-2

                    text-slate-500

                    hover:bg-slate-100

                    dark:hover:bg-slate-800
                  "
                  aria-label="Show or hide current password"
                >
                  {showCurrentPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>

              </div>

            </div>

            {/* NEW PASSWORD */}

            <div>

              <label
                htmlFor="newPassword"
                className="
                  mb-2
                  block

                  text-sm
                  font-semibold

                  text-slate-700
                  dark:text-slate-200
                "
              >
                New password
              </label>

              <div
                className="
                  relative
                "
              >

                <KeyRound
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2

                    -translate-y-1/2

                    text-slate-400
                  "
                />

                <input
                  id="newPassword"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    newPassword
                  }
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  autoComplete="new-password"
                  disabled={
                    passwordLoading
                  }
                  className="
                    h-12
                    w-full

                    rounded-xl

                    border
                    border-slate-300

                    bg-white

                    pl-11
                    pr-12

                    text-slate-900

                    outline-none

                    transition

                    focus:border-indigo-500
                    focus:ring-4
                    focus:ring-indigo-500/15

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    dark:border-slate-700
                    dark:bg-slate-950
                    dark:text-white
                  "
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      (value) =>
                        !value
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2

                    -translate-y-1/2

                    rounded-lg

                    p-2

                    text-slate-500

                    hover:bg-slate-100

                    dark:hover:bg-slate-800
                  "
                  aria-label="Show or hide new password"
                >
                  {showNewPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>

              </div>

              <p
                className="
                  mt-2

                  text-xs

                  text-slate-500
                  dark:text-slate-400
                "
              >
                Use at least 6
                characters. A
                passphrase is easier
                to remember and
                stronger.
              </p>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="
                  mb-2
                  block

                  text-sm
                  font-semibold

                  text-slate-700
                  dark:text-slate-200
                "
              >
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                disabled={
                  passwordLoading
                }
                className="
                  h-12
                  w-full

                  rounded-xl

                  border
                  border-slate-300

                  bg-white

                  px-4

                  text-slate-900

                  outline-none

                  transition

                  focus:border-indigo-500
                  focus:ring-4
                  focus:ring-indigo-500/15

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                "
                placeholder="Confirm new password"
              />

            </div>

            {/* PASSWORD REQUIREMENTS */}

            <div
              className="
                rounded-2xl

                bg-slate-50

                p-4

                dark:bg-slate-950
              "
            >

              <p
                className="
                  mb-3

                  text-xs
                  font-semibold

                  text-slate-700
                  dark:text-slate-200
                "
              >
                Password requirements
              </p>

              <div
                className="
                  space-y-2
                "
              >

                {/* LENGTH */}

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    text-xs

                    text-slate-600
                    dark:text-slate-400
                  "
                >

                  <CheckCircle2
                    size={15}
                    className={
                      newPassword.length >=
                      6
                        ? "text-emerald-500"
                        : "text-slate-300 dark:text-slate-700"
                    }
                  />

                  At least 6
                  characters

                </div>

                {/* MATCH */}

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    text-xs

                    text-slate-600
                    dark:text-slate-400
                  "
                >

                  <CheckCircle2
                    size={15}
                    className={
                      newPassword &&
                      newPassword ===
                        confirmPassword
                        ? "text-emerald-500"
                        : "text-slate-300 dark:text-slate-700"
                    }
                  />

                  Passwords match

                </div>

                {/* DIFFERENT */}

                <div
                  className="
                    flex
                    items-center
                    gap-2

                    text-xs

                    text-slate-600
                    dark:text-slate-400
                  "
                >

                  <CheckCircle2
                    size={15}
                    className={
                      currentPassword &&
                      newPassword &&
                      currentPassword !==
                        newPassword
                        ? "text-emerald-500"
                        : "text-slate-300 dark:text-slate-700"
                    }
                  />

                  Different from
                  current password

                </div>

              </div>

            </div>

            {/* PASSWORD SUBMIT */}

            <button
              type="submit"
              disabled={
                passwordLoading
              }
              className="
                flex
                h-12
                w-full

                items-center
                justify-center
                gap-2

                rounded-xl

                bg-indigo-600

                font-semibold

                text-white

                transition

                hover:bg-indigo-700

                focus:outline-none
                focus:ring-4
                focus:ring-indigo-500/30

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              <ShieldCheck
                size={18}
              />

              {passwordLoading
                ? "Updating password..."
                : "Update password"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}