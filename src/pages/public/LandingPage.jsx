import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0156A6] rounded-3xl p-6 md:p-10 overflow-hidden shadow-xl text-white border border-[#0156A6] min-h-[calc(100vh-180px)] flex items-center">
      <div className="w-full max-w-none">
        <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white border border-white/20 mb-5">
          SLTMobitel IAU Portal
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-5xl">
          Internal Affairs Unit complaint portal
        </h1>

        <p className="mt-4 max-w-3xl text-base md:text-lg text-white/85 leading-relaxed">
          Choose an entry point below to report a complaint, track an existing case, or access the admin portal.
        </p>

        <div className="mt-10 grid gap-5 xl:grid-cols-3 items-stretch w-full">
          <button
            type="button"
            onClick={() => navigate("/report")}
            className="w-full h-full min-h-[220px] text-left rounded-3xl border border-transparent p-7 flex flex-col justify-start transition-all duration-300 shadow-sm hover:shadow-lg bg-gradient-to-r from-[#1f6fb5] to-[#3ac25a] text-white"
          >
            <h2 className="text-2xl font-bold text-white">Report</h2>
            <p className="mt-3 text-base leading-relaxed text-white/90 max-w-sm">
              Start a new complaint submission and move into the report form.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/track-complaint")}
            className="w-full h-full min-h-[220px] text-left rounded-3xl border border-transparent p-7 flex flex-col justify-start transition-all duration-300 shadow-sm hover:shadow-lg bg-gradient-to-r from-[#1f6fb5] to-[#3ac25a] text-white"
          >
            <h2 className="text-2xl font-bold text-white">Tracking</h2>
            <p className="mt-3 text-base leading-relaxed text-white/90 max-w-sm">
              Check the status of an existing complaint using your CRN.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="w-full h-full min-h-[220px] text-left rounded-3xl border border-transparent p-7 flex flex-col justify-start transition-all duration-300 shadow-sm hover:shadow-lg bg-gradient-to-r from-[#1f6fb5] to-[#3ac25a] text-white"
          >
            <h2 className="text-2xl font-bold text-white">Admin</h2>
            <p className="mt-3 text-base leading-relaxed text-white/90 max-w-sm">
              Access the admin portal to review complaints and reports.
            </p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
