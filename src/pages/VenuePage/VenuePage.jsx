import React, { useEffect, useState } from "react";

const VenuePage = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Use environment variable for backend URL
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const scrollToDate = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/events`);
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                const data = await response.json();
                console.log("Fetched data:", data);
                if (!Array.isArray(data)) {
                    throw new Error("Expected an array from /api/events");
                }
                const today = new Date().toISOString().split("T")[0];
                const upcomingEvents = data.filter(event => event.date >= today);
                setScheduleData(upcomingEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [BACKEND_URL]); // ✅ dependency for environment changes

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <section className="container mx-auto pb-10">
            <h5 className="text-xl text-customRed mb-4">Announcements</h5>

            <p className="text-black mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum.
                In facilisis ex nec ligula egestas, eget viverra odio feugiat.
            </p>

            <h2 className="text-2xl mb-6 text-center">Venue Details</h2>

            {/* Dropdown + Button */}
            {!loading && scheduleData.length > 0 && (
                <div className="flex justify-center items-center gap-2 mb-6">
                    <select
                        onChange={(e) => scrollToDate(e.target.value)}
                        className="border border-gray-400 rounded p-2 text-gray-700"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Jump to Date
                        </option>
                        {scheduleData.map((day, idx) => (
                            <option key={idx} value={`date-${idx}`}>
                                {formatDate(day.date)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {loading ? (
                <p className="text-center">Loading events...</p>
            ) : scheduleData.length === 0 ? (
                <p className="text-center">No upcoming events.</p>
            ) : (
                scheduleData.map((day, index) => (
                    <div key={index} className="mb-10">
                        <h6 className="text-xl text-center mb-4">{formatDate(day.date)}</h6>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr className="bg-customRed text-white">
                                        <th className="border border-black p-2 w-1/5">Time</th>
                                        <th className="border border-black p-2 w-2/5">Programme</th>
                                        <th className="border border-black p-2 w-1/5">Venue</th>
                                        <th className="border border-black p-2 w-1/5">Online Room</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.events.map((event, i) => (
                                        <tr key={i} className="border border-black text-center">
                                            <td className="border border-black p-2">{event.time}</td>
                                            <td className="border border-black p-2">{event.program}</td>
                                            <td className="border border-black p-2">{event.venue || "TBA"}</td>
                                            <td className="border border-black p-2">
                                                {event.online_room_link ? (
                                                    <a
                                                        href={event.online_room_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Join Here
                                                    </a>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
            {/* Back to top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-6 right-6 bg-customRed text-white px-4 py-2 rounded-full shadow-lg hover:bg-customDarkRed"
            >
                ▲
            </button>
        </section>
    );
};

export default VenuePage;