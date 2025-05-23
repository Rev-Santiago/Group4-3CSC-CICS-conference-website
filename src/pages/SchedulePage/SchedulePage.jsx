import React, { useEffect, useState, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { motion, AnimatePresence } from "framer-motion";

const SchedulePage = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState("Jump to Date");
    const [isVisible, setIsVisible] = useState(false);

    const dateDropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    // Use environment variable for backend URL
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
                setIsDateDropdownOpen(false);
            }
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // ✅ FIXED: Removed date filtering to show all events including past ones
    const fetchSchedule = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/schedule`);
            const result = await response.json();

            if (result.data) {
                // ✅ No longer filtering by date - shows all events
                setScheduleData(result.data);

                // Extract categories from all events
                const allCategories = new Set();
                result.data.forEach(day => {
                    day.events.forEach(event => {
                        if (event.category && typeof event.category === 'string' && event.category.trim() !== '') {
                            allCategories.add(event.category.trim());
                        }
                    });
                });
                setCategories(Array.from(allCategories));
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

    useEffect(() => {
        fetchSchedule();
    }, [BACKEND_URL]);

    // Add periodic refresh every 30 seconds to catch new events
    useEffect(() => {
        const interval = setInterval(() => {
            fetchSchedule();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [BACKEND_URL]);

    // Add event listener for storage changes (if events are added in another tab)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'eventAdded') {
                fetchSchedule();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const scrollToDate = (id, label) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setSelectedDateLabel(label);
            setIsDateDropdownOpen(false);
        }
    };

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Add event listener
        window.addEventListener('scroll', toggleVisibility);

        // Clear event listener on component unmount
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    useEffect(() => {
        if (categories.length === 0) {
            setCategories(['Conference', 'Workshop', 'Keynote', 'Innovation']);
        }
    }, [categories]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsCategoryDropdownOpen(false);
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
        googleCalendarURL.searchParams.append("location", venue || "");
        googleCalendarURL.searchParams.append("ctz", "Asia/Manila");

        window.open(googleCalendarURL.toString(), "_blank");
    };

    // Custom dropdown component
    const CustomDropdown = ({ label, options, onSelect, isOpen, setIsOpen, selectedValue, reference, zIndex }) => (
        <div className={`relative inline-block text-left ${zIndex}`} ref={reference}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-56 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-black rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-customRed focus:ring-opacity-50 transition-all duration-200"
            >
                <span className="truncate">{selectedValue || label}</span>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-2 -mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </motion.svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto`}
                    >
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {options.map((option, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ backgroundColor: "#F3F4F6" }}
                                    whileTap={{ backgroundColor: "#E5E7EB" }}
                                    onClick={() => onSelect(option.value, option.label)}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                >
                                    {option.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Filter schedule data based on selected category
    const filteredScheduleData = selectedCategory
        ? scheduleData.map(day => ({
            ...day,
            events: day.events.filter(event =>
                event.category && event.category.toLowerCase() === selectedCategory.toLowerCase()
            )
        })).filter(day => day.events.length > 0)
        : scheduleData;

    // Format date options for dropdown
    const dateOptions = scheduleData.map((day, idx) => ({
        value: `date-${idx}`,
        label: formatDate(day.date)
    }));

    // Format category options for dropdown
    const categoryOptions = [
        { value: "", label: "All Categories" },
        ...categories.map(category => ({ value: category, label: category }))
    ];

    // Sort events by time function
    const sortEventsByTime = (events) => {
        return events
            .slice()
            .sort((a, b) => {
                const timeTo24Hour = (time) => {
                    const [hourMin, modifier] = time.split(" ");
                    let [hours, minutes] = hourMin.split(":").map(Number);
                    if (modifier === "PM" && hours !== 12) hours += 12;
                    if (modifier === "AM" && hours === 12) hours = 0;
                    return hours * 60 + minutes; // Convert to minutes for easy sorting
                };
                return timeTo24Hour(a.time.split(" - ")[0]) - timeTo24Hour(b.time.split(" - ")[0]);
            });
    };

    return (
        <section className="container mx-auto pb-10">
            <motion.h5
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xl text-customRed mb-4 "
            >
                Announcements
            </motion.h5>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-black mb-6"
            >
                Schedule updates will be posted here and sent to registered participants via email.
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl mb-8 text-center font-semibold"
            >
                Schedule Details
            </motion.h2>

            {!loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-col md:flex-row items-center justify-center mb-6 gap-6"
                >
                    {scheduleData.length > 0 && (
                        <div className="flex flex-col justify-center gap-2 relative">
                            <label className="text-gray-700 font-medium mb-1 text-center md:text-left">Select a Date</label>
                            <CustomDropdown
                                label="Jump to Date"
                                options={dateOptions}
                                onSelect={(value, label) => scrollToDate(value, label)}
                                isOpen={isDateDropdownOpen}
                                setIsOpen={setIsDateDropdownOpen}
                                selectedValue={selectedDateLabel}
                                reference={dateDropdownRef}
                                zIndex="z-50" // Higher z-index for date dropdown
                            />
                        </div>
                    )}

                    {categories.length > 0 && (
                        <div className="flex flex-col justify-center gap-2 relative">
                            <label className="text-gray-700 font-medium mb-1 text-center md:text-left">Select a Category</label>
                            <CustomDropdown
                                label="All Categories"
                                options={categoryOptions}
                                onSelect={(value) => handleCategorySelect(value)}
                                isOpen={isCategoryDropdownOpen}
                                setIsOpen={setIsCategoryDropdownOpen}
                                selectedValue={selectedCategory || "All Categories"}
                                reference={categoryDropdownRef}
                                zIndex="z-40" // Lower z-index for category dropdown
                            />
                        </div>
                    )}
                </motion.div>
            )}

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center text-gray-600 mb-8 italic"
            >
                *Works with Google Calendar, iCalendar, and Outlook
            </motion.p>

            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customRed"></div>
                </div>
            ) : scheduleData.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-gray-50 rounded-lg shadow-sm"
                >
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming events</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no events scheduled at this time.</p>
                </motion.div>
            ) : (
                filteredScheduleData.map((day, index) => (
                    <motion.div
                        key={index}
                        id={`date-${index}`}
                        className="mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <div className="flex items-center justify-center mb-6">
                            <div className="h-0.5 bg-gray-200 flex-grow max-w-xs"></div>
                            <h6 className="text-xl text-center mx-4  px-4 py-2 text-black rounded-full">
                                {formatDate(day.date)}
                            </h6>
                            <div className="h-0.5 bg-gray-200 flex-grow max-w-xs"></div>
                        </div>

                        <div className="overflow-x-auto shadow-lg ">
                            <table className="w-full border-collapse bg-white border border-black divide-y divide-black">
                                <thead>
                                    <tr>
                                        <th className="bg-customRed text-white px-6 py-2 text-left text-sm  uppercase tracking-wider border-b-2 border-r border-black w-1/4">
                                            Time
                                        </th>
                                        <th className="bg-customRed text-white px-6 py-2 text-left text-sm  uppercase tracking-wider border-b-2 border-r border-black w-1/2">
                                            Programme
                                        </th>
                                        <th className="bg-customRed text-white px-6 py-2 text-left text-sm  uppercase tracking-wider border-b-2 border-black w-1/4">
                                            Add to Calendar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black">
                                    {sortEventsByTime(day.events).map((event, i) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ backgroundColor: "rgba(183, 21, 47, 0.05)" }}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-black">
                                                {event.time}
                                            </td>
                                            <td className="px-6 py-2 whitespace-normal text-sm text-gray-900 border-r border-black">
                                                <div>
                                                    <p className="font-medium">{event.program}</p>
                                                    {event.speaker && (
                                                        <p className="text-gray-600 mt-1">
                                                            <span className="font-medium">Speaker:</span> {event.speaker}
                                                        </p>
                                                    )}
                                                    {event.category && (
                                                        <p className="text-gray-600 mt-1">
                                                            <span className="font-medium">Category:</span> {event.category}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm">
                                                <div className="flex flex-col sm:flex-row justify-start gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleAddToCalendar({ ...event, date: day.date })}
                                                        className="inline-flex items-center justify-center bg-customRed hover:bg-customDarkRed text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-colors duration-200"
                                                    >
                                                        <i className="fas fa-calendar-alt mr-2"></i>
                                                        iCalendar
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleAddToGoogleCalendar({ ...event, date: day.date })}
                                                        className="inline-flex items-center justify-center bg-customBlue hover:bg-customDarkBlue text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-colors duration-200"
                                                    >
                                                        <i className="fab fa-google mr-2"></i>
                                                        Google
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ))
            )}

            {/* Back to top */}
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 bg-customRed text-white p-3 rounded-full shadow-lg hover:bg-customDarkRed transition-colors duration-200 z-20"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 21a.75.75 0 01-.75-.75V5.56l-4.72 4.72a.75.75 0 11-1.06-1.06l6-6a.75.75 0 011.06 0l6 6a.75.75 0 01-1.06 1.06L12.75 5.56v14.69c0 .41-.34.75-.75.75z"
                            clipRule="evenodd"
                        />
                    </svg>
                </motion.button>
            )}
        </section>
    );
};

export default SchedulePage;