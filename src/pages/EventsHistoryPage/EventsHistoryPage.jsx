import React, { useEffect, useState } from "react";

const EventsHistoryPage = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 1;

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = () => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/events-history?page=${currentPage}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.data || []);
        setTotalPages(data.totalPages || 1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        alert("Something went wrong while fetching the events.");
        setIsLoading(false);
      });
  };

  const formatDate = (isoString) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoString));
  };

  return (
    <div className="mx-auto">
      <h5 className="text-xl text-customRed mb-4">Announcements</h5>
      <p className="text-black mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum.
      </p>

      <h5 className="text-2xl text-center mb-6">Previous Events</h5>

      {isLoading && <p className="text-center text-gray-600">Loading events...</p>}

      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} className="mb-10">
            <h6 className="text-lg text-center mb-4">{formatDate(new Date(event.date))}</h6>
            <div className="border border-black rounded-none overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-customRed text-white">
                    <th className="w-1/2 py-3 border-r-2 border-black text-center">Time</th>
                    <th className="w-1/2 py-3 text-center">Program</th>
                  </tr>
                </thead>
                <tbody>
                  {event.schedule && event.schedule.length > 0 ? (
                    event.schedule.map((item, idx) => (
                      <tr key={idx} className="border-t border-black">
                        <td className="w-1/2 py-3 text-center border-r-2 border-black">{item.time}</td>
                        <td className="w-1/2 py-3 text-center">
                          {item.program && item.program.length > 0 ? (
                            item.program.map((detail, i) => (
                              <p key={i} className="text-gray-800">{detail}</p>
                            ))
                          ) : (
                            <p className="text-gray-600">No program details available</p>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center text-gray-600 py-3">
                        No schedule available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No events available.</p>
      )}

      <div className="flex justify-center mt-6 mb-10">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-6 py-2 mx-2 text-white font-semibold rounded-md transition-all duration-300 ${
            currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-customRed hover:bg-red-800 shadow-md hover:shadow-lg"
          }`}
        >
          ◀ Previous
        </button>

        <span className="px-6 py-2 border border-gray-400 rounded-md bg-white font-semibold shadow-sm">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-6 py-2 mx-2 text-white font-semibold rounded-md transition-all duration-300 ${
            currentPage === totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-customRed hover:bg-red-800 shadow-md hover:shadow-lg"
          }`}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default EventsHistoryPage;
