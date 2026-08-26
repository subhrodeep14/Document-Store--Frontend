import { create } from "zustand";

import {
  authApi,
} from "../utils/api";

/*
──────────────────────────────────────
COMPANY HELPER
──────────────────────────────────────
*/

const getActiveCompany = (
  user
) => {

  /*
  ──────────────────────────────────────
  SUPER ADMIN
  ──────────────────────────────────────

  Super Admin does not belong permanently
  to a company.

  The backend provides the currently
  selected company through:

  user.activeCompany
  */

  if (
    user?.activeCompany
  ) {
    return {
      id:
        user.activeCompany.id,

      name:
        user.activeCompany.name,

      code:
        user.activeCompany.code,
    };
  }

  /*
  ──────────────────────────────────────
  NORMAL USER
  ──────────────────────────────────────

  ADMIN and EMPLOYEE users belong to
  their own company.

  The backend provides it through:

  user.company
  */

  if (
    user?.company
  ) {
    return {
      id:
        user.company.id,

      name:
        user.company.name,

      code:
        user.company.code,
    };
  }

  /*
  No company available.
  */

  return null;
};

/*
──────────────────────────────────────
AUTH STORE
──────────────────────────────────────
*/

const useAuthStore = create(
  (set) => ({

    /*
    ──────────────────────────────────────
    AUTH STATE
    ──────────────────────────────────────
    */

    user: null,

    isLoading: true,

    isAuthenticated: false,

    /*
    ──────────────────────────────────────
    ACTIVE COMPANY
    ──────────────────────────────────────
    */

    activeCompany: null,

    /*
    ──────────────────────────────────────
    SET ACTIVE COMPANY
    ──────────────────────────────────────
    */

    setActiveCompany: (
      company
    ) => {

      set({
        activeCompany:
          company,
      });
    },

    /*
    ──────────────────────────────────────
    INITIALIZE
    ──────────────────────────────────────
    */

    initialize: async () => {

      try {

        /*
        Get current authenticated
        user from backend.
        */

        const res =
          await authApi.me();

        const user =
          res.data.user;

        /*
        Determine active company.

        SUPER_ADMIN:
          user.activeCompany

        ADMIN / EMPLOYEE:
          user.company
        */

        const activeCompany =
          getActiveCompany(
            user
          );

        set({

          user,

          activeCompany,

          isAuthenticated: true,

          isLoading: false,

        });

      } catch (err) {

        console.error(
          "AUTH INIT ERROR:",
          err
        );

        /*
        Clear old frontend token.
        */

        localStorage.removeItem(
          "token"
        );

        /*
        Reset authentication.
        */

        set({

          user: null,

          activeCompany: null,

          isAuthenticated: false,

          isLoading: false,

        });
      }
    },

    /*
    ──────────────────────────────────────
    REGISTER
    ──────────────────────────────────────
    */

    register: async ({
      email,
      password,
      name,
      accessCode,
    }) => {

      /*
      Register through backend.
      */

      const res =
        await authApi.register({

          email,

          password,

          name,

          accessCode,

        });

      const {
        token,
        user,
      } = res.data;

      /*
      Temporary compatibility with
      current JWT frontend setup.

      We will remove localStorage
      authentication later when we
      completely move to httpOnly cookies.
      */

      if (
        token
      ) {

        localStorage.setItem(
          "token",
          token
        );
      }

      /*
      Determine active company.

      Normal registered users will
      have user.company.
      */

      const activeCompany =
        getActiveCompany(
          user
        );

      set({

        user,

        activeCompany,

        isAuthenticated: true,

        isLoading: false,

      });

      return res.data;
    },

    /*
    ──────────────────────────────────────
    LOGIN
    ──────────────────────────────────────
    */

    login: async (
      email,
      password
    ) => {

      /*
      Login through backend.
      */

      const res =
        await authApi.login({

          email,

          password,

        });

      const {
        token,
        user,
      } = res.data;

      /*
      Temporary compatibility with
      current JWT frontend setup.
      */

      if (
        token
      ) {

        localStorage.setItem(
          "token",
          token
        );
      }

      /*
      Determine active company.

      SUPER_ADMIN:
        Backend gives us
        user.activeCompany.

      ADMIN / EMPLOYEE:
        Backend gives us
        user.company.
      */

      const activeCompany =
        getActiveCompany(
          user
        );

      set({

        user,

        activeCompany,

        isAuthenticated: true,

        isLoading: false,

      });

      return res.data;
    },

    /*
    ──────────────────────────────────────
    CHANGE PASSWORD
    ──────────────────────────────────────
    */

    changePassword: async (
      data
    ) => {

      const res =
        await authApi.changePassword(
          data
        );

      /*
      Backend returns a fresh JWT.
      */

      if (
        res.data.token
      ) {

        localStorage.setItem(
          "token",
          res.data.token
        );
      }

      /*
      If backend returns updated user,
      keep Zustand synchronized.
      */

      if (
        res.data.user
      ) {

        const activeCompany =
          getActiveCompany(
            res.data.user
          );

        set({

          user:
            res.data.user,

          activeCompany,

          isAuthenticated: true,

        });
      }

      return res.data;
    },

    /*
    ──────────────────────────────────────
    CHANGE EMAIL
    ──────────────────────────────────────
    */

    changeEmail: async ({
      newEmail,
      currentPassword,
    }) => {

      const res =
        await authApi.changeEmail({

          newEmail,

          currentPassword,

        });

      const {
        token,
        user,
      } = res.data;

      /*
      Store fresh token if backend
      returns one.
      */

      if (
        token
      ) {

        localStorage.setItem(
          "token",
          token
        );
      }

      /*
      Update Zustand immediately.
      */

      if (
        user
      ) {

        const activeCompany =
          getActiveCompany(
            user
          );

        set({

          user,

          activeCompany,

          isAuthenticated: true,

          isLoading: false,

        });
      }

      return res.data;
    },

    /*
    ──────────────────────────────────────
    LOGOUT
    ──────────────────────────────────────
    */

    logout: async () => {

      try {

        await authApi.logout();

      } catch (err) {

        console.error(
          "LOGOUT ERROR:",
          err
        );
      }

      /*
      Remove frontend token.
      */

      localStorage.removeItem(
        "token"
      );

      /*
      Reset authentication.
      */

      set({

        user: null,

        activeCompany: null,

        isAuthenticated: false,

        isLoading: false,

      });
    },
  })
);

export default useAuthStore;