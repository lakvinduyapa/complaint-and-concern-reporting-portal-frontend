import { useEffect, useState } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

const SessionWarningModal = () => {
  const { sessionWarning, extendSession, logout } = useAdminAuth();
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!sessionWarning) {
      setTimeLeft(300);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionWarning]);

  if (!sessionWarning) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-3">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          Session Timeout Warning
        </h3>

        <p className="text-gray-600 text-center text-sm mb-4">
          Your session will expire due to inactivity in:
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-3xl font-bold text-red-600">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
          <p className="text-sm text-red-600 mt-1">minutes remaining</p>
        </div>

        <p className="text-gray-600 text-center text-sm mb-6">
          Click "Continue Session" to stay logged in, or you'll be automatically logged out.
        </p>

        <div className="flex gap-3">
          <button
            onClick={logout}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
          >
            Logout Now
          </button>
          <button
            onClick={extendSession}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm"
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarningModal;
