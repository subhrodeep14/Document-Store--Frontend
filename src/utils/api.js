
import axios from "axios";

import useAuthStore from "../hooks/useAuth";

/*
──────────────────────────────────────
AXIOS
──────────────────────────────────────
*/

const api = axios.create({
  baseURL:
    import.meta.env
      .VITE_API_URL ||
    "http://localhost:5001/api",

  withCredentials: true,
});

/*
──────────────────────────────────────
REQUEST INTERCEPTOR
──────────────────────────────────────
*/

api.interceptors.request.use(
  (config) => {
    /*
    TOKEN
    */

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*
    ACTIVE COMPANY
    FROM ZUSTAND
    */

        const {
      activeCompany,
      user,
    } = useAuthStore.getState();

    if (
      user?.role === "SUPER_ADMIN" &&
      activeCompany?.id
    ) {
      config.headers["x-company-id"] =
        activeCompany.id;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/*
──────────────────────────────────────
AUTH
──────────────────────────────────────
*/

/*
──────────────────────────────────────
AUTH
──────────────────────────────────────
*/

export const authApi = {
  login: (data) =>
    api.post(
      "/auth/login",
      data
    ),

  register: (data) =>
    api.post(
      "/auth/register",
      data
    ),

  me: () =>
    api.get("/auth/me"),

  changePassword: (data) =>
    api.post(
      "/auth/change-password",
      data
    ),

  changeEmail: (data) =>
    api.post(
      "/auth/change-email",
      data
    ),

  logout: () =>
    api.post(
      "/auth/logout"
    ),
};

/*
──────────────────────────────────────
ENTRY
──────────────────────────────────────
*/

export const entryApi = {
  create: (data) =>
    api.post(
      "/entry/create",
      data
    ),

  getAll: (params) =>
    api.get("/entry", {
      params,
    }),

  search: (params) =>
    api.get(
      "/entry/search",
      {
        params,
      }
    ),

  getByDate: (
  date,
  year
) =>
  api.get(
    "/entry/by-date",
    {
      params: {
        date,
        year,
      },
    }
  ),

 getAvailableSlNumbers:
  (year) =>
    api.get(
      "/entry/sl-numbers",
      {
        params: {
          year,
        },
      }
    ),
  searchCompanies: (
    query
  ) =>
    api.get(
      "/entry/companies/search",
      {
        params: {
          q: query,
        },
      }
    ),

  searchPurposes: (
    query
  ) =>
    api.get(
      "/purposes/search",
      {
        params: {
          q: query,
        },
      }
    ),
updateEntry: (
  id,
  data
) =>
  api.put(
    `/entry/${id}`,
    data
  ),
  uploadFile: (
    id,
    formData
  ) =>
    api.post(
      `/entry/upload-file/${id}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    ),
    getRegisterSettings:
  (year) =>
    api.get(
      "/entry/register-settings",
      {
        params: {
          year,
        },
      }
    ),
importRegister: (formData) =>
  api.post(
    "/import/register",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  ),
increaseRegisterRows:
  (year) =>
    api.post(
      "/entry/register-settings/increase",
      {
        year,
      }
    ),

  deleteFile: (id) =>
    api.delete(
      `/entry/delete-file/${id}`
    ),

  delete: (id) =>
    api.delete(
      `/entry/${id}`
    ),
};

/*
──────────────────────────────────────
COMPANY
──────────────────────────────────────
*/

export const companyApi = {
  getAll: () =>
    api.get("/companies"),

  create: (data) =>
    api.post(
      "/companies/create",
      data
    ),

  search: (query) =>
    api.get(
      "/companies/search",
      {
        params: {
          q: query,
        },
      }
    ),

  regenerateAdminCode: (
    companyId
  ) =>
    api.patch(
      `/companies/${companyId}/regenerate-admin-code`
    ),

  regenerateEmployeeCode: (
    companyId
  ) =>
    api.patch(
      `/companies/${companyId}/regenerate-employee-code`
    ),
};

/*
──────────────────────────────────────
PURPOSE
──────────────────────────────────────
*/

export const purposeApi = {
  getAll: () =>
    api.get("/purposes"),

  create: (data) =>
    api.post(
      "/purposes",
      data
    ),
};

/*
──────────────────────────────────────
MEMO
──────────────────────────────────────
*/

export const memoApi = {
  getAll: (params) =>
    api.get("/memos", {
      params,
    }),

  create: (data) =>
    api.post(
      "/memos/create",
      data
    ),

  search: (params) =>
    api.get(
      "/memos/search",
      {
        params,
      }
    ),

  getByDate: (date) =>
    api.get(
      "/memos/by-date",
      {
        params: {
          date,
        },
      }
    ),
};

/*
──────────────────────────────────────
ACTIVITY
──────────────────────────────────────
*/

export const activityApi = {
  getAll: (params) =>
    api.get(
      "/activities",
      {
        params,
      }
    ),

  create: (data) =>
    api.post(
      "/activities/create",
      data
    ),
};

/*
──────────────────────────────────────
FILES
──────────────────────────────────────
*/

export const fileApi = {
  upload: (formData) =>
    api.post(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    ),

  getAll: () =>
    api.get("/files"),
};

/*
──────────────────────────────────────
CALENDAR
──────────────────────────────────────
*/

export const calendarApi = {
  getAll: () =>
    api.get("/calendar"),
};



/*
──────────────────────────────────────
EXPORT
──────────────────────────────────────
*/

export default api;

