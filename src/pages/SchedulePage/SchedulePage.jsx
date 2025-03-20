import React, { useEffect, useState } from "react";

const SchedulePage = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/schedule");
                const result = await response.json();

                console.log("Fetched Schedule Data:", result); // Debugging

                if (result.data) {
                    const today = new Date();
                    const todayInMS = today.setHours(0, 0, 0, 0); // Strip time part for comparison
                    console.log("Today's date in MS:", todayInMS); // Debugging

                    const filteredData = result.data.filter(day => {
                        const eventDate = new Date(day.date).setHours(0, 0, 0, 0); // Set to midnight for clean comparison
                        console.log(`Comparing ${eventDate} with ${todayInMS}`); // Debugging
                        return eventDate >= todayInMS;
                    });

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

    const handleAddToCalendar = (event) => {
        if (!event || !event.time || !event.program || !event.date) {
            console.error("Invalid event data:", event);
            return;
        }
    
        const eventDate = new Date(event.date);
        if (isNaN(eventDate)) {
            console.error("Invalid date format:", event.date);
            return;
        }
    
        // Extract start and end times
        const timeParts = event.time.split(" - ");
        if (timeParts.length !== 2) {
            console.error("Invalid time format:", event.time);
            return;
        }
    
        const startTime = timeParts[0]; // e.g., "02:00 PM"
        const endTime = timeParts[1]; // e.g., "04:00 PM"
    
        const convertTo24Hour = (timeString) => {
            let [time, modifier] = timeString.split(" ");
            let [hours, minutes] = time.split(":").map(Number);
    
            if (modifier === "PM" && hours !== 12) {
                hours += 12;
            } else if (modifier === "AM" && hours === 12) {
                hours = 0;
            }
    
            return { hours, minutes };
        };
    
        // Convert start time
        const start = convertTo24Hour(startTime);
        eventDate.setHours(start.hours, start.minutes, 0);
    
        // Convert end time
        const end = convertTo24Hour(endTime);
        const endDate = new Date(eventDate);
        endDate.setHours(end.hours, end.minutes, 0);
    
        const uid = `${event.program.replace(/\s+/g, "-")}-${eventDate.getTime()}@conference.com`;
    
        // Generate .ics file content
        const icsData = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "BEGIN:VEVENT",
            `SUMMARY:${event.program}`,
            `DTSTART:${eventDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DTEND:${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `UID:${uid}`,
            `LOCATION:${event.location || "Not specified"}`, 
            `DESCRIPTION:Speaker - ${event.speaker || "N/A"}`, 
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
    

    return (
        <section className="mx-auto px-10 pb-10">
            <h5 className="text-xl text-customRed mb-4">Announcements</h5>
            <p className="text-black mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum.
            </p>

            <h2 className="text-2xl mb-6 text-center">Schedule Details</h2>
            <p className="text-center text-gray-600">*Works only with iCalendar and Outlook</p>

            {loading ? (
                <p className="text-center">Loading schedule...</p>
            ) : scheduleData.length > 0 ? (
                scheduleData.map((day, index) => (
                    <div key={index} className="mb-10">
                        <h6 className="text-xl text-center mb-4">{formatDate(day.date)}</h6>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr className="bg-customRed text-white">
                                        <th className="border border-black p-2 w-1/4">Time</th>
                                        <th className="border border-black p-2 w-1/2">Programme</th>
                                        <th className="border border-black p-2 w-1/4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.events.map((event, i) => (
                                        <tr key={i} className="border border-black text-center">
                                            <td className="border border-black p-2">{event.time}</td>
                                            <td className="border border-black p-2 whitespace-pre-line">{event.program}</td>
                                            <td className="border border-black p-2">
                                                <button
                                                    onClick={() => handleAddToCalendar({ ...event, date: day.date })}
                                                    className="bg-customRed text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out hover:bg-red-700 shadow-md flex items-center justify-center gap-2 w-full"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="w-5 h-5 text-white"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Add to Calendar
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
        </section>
    );
};

export default SchedulePage;
