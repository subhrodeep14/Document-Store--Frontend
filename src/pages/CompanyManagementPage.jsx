
// src/pages/CompanyManagementPage.jsx

import {
  Building2,
  ShieldCheck,
  Users,
  Search,
  UserCog,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";



import toast from "react-hot-toast";

import useAuthStore from "../hooks/useAuth";
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";
import {
  companyApi,
} from "../utils/api";

import Layout from "../components/Layout";

import CompanyCard from "../components/company/CompanyCard";

import CreateCompanyModal from "../components/company/CreateCompanyModal";

import SwitchCompanyDropdown from "../components/company/SwitchCompanyDropdown";

export default function CompanyManagementPage() {
  const user = useAuthStore( (s) => s.user );
  const activeCompany = useAuthStore( (s) => s.activeCompany );
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);

      const res = await companyApi.getAll();

      setCompanies(res.data.companies || []);
    } catch (err) {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    return (
      c.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      c.code
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="space-y-5">
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-[28px]

            border
            border-slate-200/70
            dark:border-slate-800

            bg-white/80
            dark:bg-slate-950/70

            backdrop-blur-xl

            p-5

            shadow-[0_10px_40px_rgba(0,0,0,0.06)]
          "
        >
          <div className="flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">
            {/* LEFT */}

            <div>
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-12
                    h-12

                    rounded-2xl

                    bg-gradient-to-br
                    from-indigo-600
                    to-violet-600

                    flex
                    items-center
                    justify-center
                  "
                >
                  <Building2
                    size={22}
                    className="text-white"
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
                    Company Management
                  </h1>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    Manage companies and access verification codes
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex flex-wrap gap-3">

  <SwitchCompanyDropdown
    companies={companies}
  />

  {/* ACCOUNT SETTINGS */}

  <button
    type="button"
    onClick={() =>
      navigate(
        "/change-password"
      )
    }
    className="
      h-11
      px-5

      rounded-2xl

      border
      border-slate-200
      dark:border-slate-700

      bg-white
      dark:bg-slate-900

      hover:bg-slate-50
      dark:hover:bg-slate-800

      text-slate-700
      dark:text-slate-200

      text-sm
      font-semibold

      flex
      items-center
      justify-center
      gap-2

      transition-all

      hover:shadow-sm
    "
  >
    <UserCog
      size={17}
    />

    Account Settings
  </button>

  {/* CREATE COMPANY */}

  {user?.role ===
    "SUPER_ADMIN" && (
    <button
      type="button"
      onClick={() =>
        setShowCreate(true)
      }
      className="
        h-11
        px-5

        rounded-2xl

        bg-gradient-to-r
        from-indigo-600
        to-violet-600

        hover:opacity-90

        text-white
        text-sm
        font-semibold

        flex
        items-center
        justify-center

        transition-all
      "
    >
      Create Company
    </button>
  )}

</div>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div
              className="
                rounded-2xl
                p-4

                bg-indigo-50
                dark:bg-indigo-500/10
              "
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-indigo-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Role
                  </p>

                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {user?.role}
                  </h3>
                </div>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                p-4

                bg-emerald-50
                dark:bg-emerald-500/10
              "
            >
              <div className="flex items-center gap-3">
                <Building2 className="text-emerald-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Total Companies
                  </p>

                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {companies.length}
                  </h3>
                </div>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                p-4

                bg-amber-50
                dark:bg-amber-500/10
              "
            >
              <div className="flex items-center gap-3">
                <Users className="text-amber-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Active Companies
                  </p>

                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {companies.length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SEARCH */}

        <div
          className="
            relative

            rounded-2xl

            border
            border-slate-200
            dark:border-slate-800

            bg-white
            dark:bg-slate-950
          "
        >
          <Search
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
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search companies..."
            className="
              w-full
              h-12

              bg-transparent

              pl-11
              pr-4

              text-sm

              outline-none
            "
          />
        </div>

        
{loading && (
  <div
    className="
      rounded-[28px]

      border
      border-slate-200
      dark:border-slate-800

      bg-white
      dark:bg-slate-950

      p-10

      flex
      items-center
      justify-center
    "
  >
    <div
      className="
        w-8
        h-8

        rounded-full

        border-2
        border-indigo-500
        border-t-transparent

        animate-spin
      "
    />
  </div>
)}



        {/* GRID */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            2xl:grid-cols-3

            gap-4
          "
        >
{!loading &&
  filteredCompanies.map(
    (company) => (
      <CompanyCard
        key={company.id}
        company={company}
        refresh={
          fetchCompanies
        }
      />
    )
  )}


        </div>

        {/* EMPTY */}

        {!loading &&
          filteredCompanies.length === 0 && (
            <div
              className="
                rounded-[28px]

                border
                border-dashed
                border-slate-300
                dark:border-slate-700

                p-12

                text-center
              "
            >
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                No Companies Found
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Try changing the search keyword
              </p>
            </div>
          )}

        {/* MODAL */}

        <AnimatePresence>
          {showCreate && (
            <CreateCompanyModal
              onClose={() =>
                setShowCreate(false)
              }
              onSuccess={() => {
                fetchCompanies();
                setShowCreate(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}


