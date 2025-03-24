import React, { useEffect, useState } from "react";
import useToken from "../hooks/useToken";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    fetch(`${url}/activity/log/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch activity logs");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setLogs(data.data);
        } else {
          throw new Error("Invalid data format received");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-8">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 mt-20">Activity Log</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 sm:px-6 py-2 sm:py-3 border-b text-left text-xs sm:text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 border-b text-left text-xs sm:text-sm font-medium text-gray-600">IP Address</th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 border-b text-left text-xs sm:text-sm font-medium text-gray-600">Hostname</th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 border-b text-left text-xs sm:text-sm font-medium text-gray-600">More Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-4 sm:px-6 py-3 sm:py-4 border-b text-xs sm:text-sm text-gray-700">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 border-b text-xs sm:text-sm text-gray-700">
                  {log.ip_address || "N/A"}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 border-b text-xs sm:text-sm text-gray-700">
                  {log.hostname || "N/A"}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 border-b text-xs sm:text-sm text-gray-700">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 gap-3 sm:gap-0">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing 1 to {logs.length} of {logs.length} entries
        </p>
        <div className="flex space-x-2">
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
            Previous
          </button>
          <button className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;