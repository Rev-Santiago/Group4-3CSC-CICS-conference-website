import React, { useEffect, useState } from "react";

const EventsHistoryPage = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 1;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchEvents();
  }, [currentPage]);

  const fetchEvents = () => {
    setIsLoading(true);
     fetch(`${BACKEND_URL}/api/events-history?page=${currentPage}&limit=${limit}`)
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
    <div className="container mx-auto">
      <h5 className="text-xl text-customRed mb-4">Announcements</h5>
      <p className="text-black mb-8">
        The Computing and Information Systems Conference (CICS) has a rich history of bringing together leading researchers, practitioners, and industry professionals. Below you can explore our previous events and their detailed programs.
      </p>

      <h5 className="text-2xl text-center mb-8">Previous Events</h5>

      {isLoading && <p className="text-center text-gray-600 my-8">Loading events...</p>}

      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} className="mb-12">
            <h6 className="text-lg text-center mb-6 font-medium">{formatDate(new Date(event.date))}</h6>
            <div className="w-full overflow-x-auto shadow-md mb-6">
              <table className="w-full border-collapse border-2 border-black">
                <thead>
                  <tr className="bg-customRed text-white">
                    <th className="w-1/2 py-3 px-4 border-2 border-black text-left font-semibold">Time</th>
                    <th className="w-1/2 py-3 px-4 border-2 border-black text-left font-semibold">Program</th>
                  </tr>
                </thead>
                <tbody>
                  {event.schedule && event.schedule.length > 0 ? (
                    event.schedule.map((item, idx) => (
                      <tr 
                        key={idx} 
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-4 px-4 border-2 border-black min-h-[50px]">{item.time}</td>
                        <td className="py-4 px-4 border-2 border-black min-h-[50px]">
                          {item.program && item.program.length > 0 ? (
                            item.program.map((detail, i) => (
                              <p key={i} className="text-gray-800 mb-2 last:mb-0">{detail}</p>
                            ))
                          ) : (
                            <p className="text-gray-600">No program details available</p>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-4 px-4 border-2 border-black text-center text-gray-600">
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
        !isLoading && <p className="text-center text-gray-600 my-8">No events available.</p>
      )}

      <div className="flex justify-center mt-8 mb-10 w-full max-w-4xl mx-auto space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-800">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          Next 
        </button>
      </div>
    </div>
  );
};

export default EventsHistoryPage;
