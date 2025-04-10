import React, { useEffect, useState } from "react";

const SchedulePage = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${BACKEND_URL}/api/schedule`);
                const result = await response.json();

                if (result.data) {
                    const today = new Date().toISOString().split("T")[0];
                    const filteredData = result.data.filter(day => day.date >= today);
                    setScheduleData(filteredData);
                } else {
                    setScheduleData([]);
                }
            } catch (error) {
                console.error("Error fetching schedule:", error);
                setScheduleData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const scrollToDate = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleAddToCalendar = (event) => {
        if (!event || !event.time || !event.program || !event.date) {
            console.error("Invalid event data:", event);
            return;
        }

        const eventDate = new Date(event.date);
        const timeParts = event.time.split(" - ");

        const convertTo24Hour = (timeString) => {
            let [time, modifier] = timeString.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return { hours, minutes };
        };

        const start = convertTo24Hour(timeParts[0]);
        eventDate.setHours(start.hours, start.minutes, 0);

        const end = convertTo24Hour(timeParts[1]);
        const endDate = new Date(eventDate);
        endDate.setHours(end.hours, end.minutes, 0);

        const uid = `${event.program.replace(/\s+/g, "-")}-${eventDate.getTime()}@conference.com`;

        const formatICSTime = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        const icsData = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Conference Schedule//EN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            `SUMMARY:${event.program}`,
            `DTSTART:${formatICSTime(eventDate)}`,
            `DTEND:${formatICSTime(endDate)}`,
            `UID:${uid}`,
            `LOCATION:${event.venue || "Not specified"}`,
            `DESCRIPTION:Venue - ${event.venue || "TBA"} | Online Room - ${event.online_room_link || "N/A"}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");

        const blob = new Blob([icsData], { type: "text/calendar" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${event.program}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAddToGoogleCalendar = (event) => {
        if (!event || !event.program || !event.time) {
            console.error("Invalid event data:", event);
            return;
        }

        const { program, time, venue, online_room_link, date } = event;

        console.log("Event Data:", event); // Debugging

        const [startTime, endTime] = time.split(" - ");

        const formatTime = (timeStr) => {
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;
            return `${hours.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}00`;
        };

        const eventDate = new Date(date);
        const formattedDate = eventDate.toISOString().split("T")[0].replace(/-/g, "");

        const formattedStartTime = `${formattedDate}T${formatTime(startTime)}`;
        const formattedEndTime = `${formattedDate}T${formatTime(endTime)}`;


        const details = `Venue: ${venue || "TBA"}\nOnline Room: ${online_room_link || "N/A"}`;

        const googleCalendarURL = new URL("https://calendar.google.com/calendar/render");
        googleCalendarURL.searchParams.append("action", "TEMPLATE");
        googleCalendarURL.searchParams.append("text", program);
        googleCalendarURL.searchParams.append("dates", `${formattedStartTime}/${formattedEndTime}`);
        googleCalendarURL.searchParams.append("details", details.split("\n").join("\n"));
        // Correct line break encoding
        googleCalendarURL.searchParams.append("location", venue || "");
        googleCalendarURL.searchParams.append("ctz", "Asia/Manila");

        window.open(googleCalendarURL.toString(), "_blank");
    };

    return (
        <section className="container mx-auto pb-10">
            <h5 className="text-xl text-customRed mb-4">Announcements</h5>
            <p className="text-black mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum.
            </p>

            <h2 className="text-2xl mb-6 text-center">Schedule Details</h2>

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

            <p className="text-center text-gray-600">*Works with Google Calendar, iCalendar, and Outlook</p>

            {loading ? (
                <p className="text-center">Loading schedule...</p>
            ) : scheduleData.length > 0 ? (
                scheduleData.map((day, index) => (
                    <div key={index} id={`date-${index}`} className="mb-10">
                        <h6 className="text-xl text-center mb-4">{formatDate(day.date)}</h6>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr className="bg-customRed text-white">
                                        <th className="border border-black p-2 w-1/4">Time</th>
                                        <th className="border border-black p-2 w-1/2">Programme</th>
                                        <th className="border border-black p-2 w-1/4">Add to Calendar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.events
                                        .slice() // Create a shallow copy to avoid mutating state
                                        .sort((a, b) => {
                                            const timeTo24Hour = (time) => {
                                                const [hourMin, modifier] = time.split(" ");
                                                let [hours, minutes] = hourMin.split(":").map(Number);
                                                if (modifier === "PM" && hours !== 12) hours += 12;
                                                if (modifier === "AM" && hours === 12) hours = 0;
                                                return hours * 60 + minutes; // Convert to minutes for easy sorting
                                            };
                                            return timeTo24Hour(a.time.split(" - ")[0]) - timeTo24Hour(b.time.split(" - ")[0]);
                                        })
                                        .map((event, i) => (
                                            <tr key={i} className="border border-black text-center">
                                                <td className="border border-black p-2">{event.time}</td>
                                                <td className="border border-black p-2">{event.program}</td>
                                                <td className="border p-2 flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAddToCalendar({ ...event, date: day.date })}
                                                        className="bg-customRed hover:bg-customDarkRed text-white px-4 py-2 rounded-lg"
                                                    >
                                                        iCalendar
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddToGoogleCalendar({ ...event, date: day.date })}
                                                        className="bg-customBlue hover:bg-customDarkBlue text-white px-4 py-2 rounded-lg "
                                                    >
                                                        Google Calendar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center">No upcoming events available.</p>
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

export default SchedulePage;
