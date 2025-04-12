import React, { useEffect, useState, useRef } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { motion, AnimatePresence } from "framer-motion";

const VenuePage = () => {
    const [venueData, setVenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedDateLabel, setSelectedDateLabel] = useState("Jump to Date");

    const dateDropdownRef = useRef(null);
    const categoryDropdownRef = useRef(null);

    // ✅ Use environment variable for backend URL
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

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/category`);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            let categoryList = await response.json();

            const cleaned = Array.from(
                new Set(
                    categoryList
                        .filter(c => typeof c === 'string' && c.trim() !== '')
                        .map(c => c.trim())
                )
            );

            setCategories(cleaned);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const scrollToDate = (id, label) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setSelectedDateLabel(label);
            setIsDateDropdownOpen(false);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setIsCategoryDropdownOpen(false);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Use the correct endpoint from your server code
                const response = await fetch(`${BACKEND_URL}/api/schedule`);
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                const result = await response.json();
                console.log("Fetched schedule data:", result);

                // Check if the expected data structure exists
                if (result && result.data && Array.isArray(result.data)) {
                    setVenueData(result.data);
                } else {
                    throw new Error("Unexpected data format from /api/schedule");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
        fetchCategories();
    }, [BACKEND_URL]); // ✅ dependency for environment changes

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };


    // Updated to filter by category field
    const filteredVenueData = selectedCategory
        ? venueData.map(day => ({
            ...day,
            events: day.events.filter(event =>
                event.category && event.category.toLowerCase() === selectedCategory.toLowerCase()
            )
        })).filter(day => day.events.length > 0)
        : venueData;

    // Custom dropdown component - UPDATED with zIndex parameter
    const CustomDropdown = ({ label, options, onSelect, isOpen, setIsOpen, selectedValue, reference, zIndex = "z-40", className = "" }) => (
        <div className={`relative inline-block text-left ${className}`} ref={reference}>
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
                        // UPDATED CLASSES for dropdown menu positioning and added zIndex
                        className={`absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto ${zIndex}`}
                        style={{ 
                            // For mobile view - position dropdown above the button when on small screens
                            [`@media (max-width: 768px)`]: {
                                bottom: '100%',
                                top: 'auto',
                                marginBottom: '8px',
                                marginTop: '0'
                            }
                        }}
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

    // Updated Event table component with speaker column
    const EventTable = ({ events }) => (
        <div className="overflow-x-auto shadow-lg">
            <table className="w-full border-collapse bg-white border border-black">
                <thead>
                    <tr>
                        <th className="bg-customRed border border-black text-white px-6 py-2 text-left text-sm uppercase tracking-wider border-b-2 w-1/6">
                            Time
                        </th>
                        <th className="bg-customRed border border-black text-white px-6 py-2 text-left text-sm uppercase tracking-wider border-b-2 w-2/6">
                            Programme
                        </th>
                        <th className="bg-customRed border border-black text-white px-6 py-2 text-left text-sm uppercase tracking-wider border-b-2 w-1/6">
                            Venue
                        </th>
                        <th className="bg-customRed border border-black text-white px-6 py-2 text-left text-sm uppercase tracking-wider border-b-2 w-1/6">
                            Online Room
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black">
                    {events.map((event, i) => (
                        <motion.tr
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ backgroundColor: "rgba(183, 21, 47, 0.05)" }}
                            className="hover:bg-gray-50 transition-colors duration-150"
                        >
                            <td className="px-6 py-2 border border-black whitespace-nowrap text-sm font-medium text-gray-900">
                                {event.time}
                            </td>
                            <td className="px-6 py-4 border border-black whitespace-normal text-sm text-gray-900">
                                <div>
                                    <p className="font-medium"> Title: {event.program}</p>
                                    {event.speaker && (
                                        <p className="text-gray-600 mt-1">
                                            <span className="font-medium">Speaker:</span> {event.speaker}
                                        </p>
                                    )}
                                    {event.category && (
                                        <span className="text-gray-600 mt-1">
                                            <p className="font-medium"> Theme: {event.category}</p>
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm text-gray-900">
                                {event.venue || "TBA"}
                            </td>
                            <td className="px-6 py-4 border border-black whitespace-nowrap text-sm">
                                {event.online_room_link ? (
                                    <a
                                        href={event.online_room_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-customRed hover:text-red-800 inline-flex items-center transition-colors duration-200 font-medium"
                                    >
                                        Join Here
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                ) : (
                                    <span className="text-gray-500">N/A</span>
                                )}
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Format date options for dropdown
    const dateOptions = venueData.map((day, idx) => ({
        value: `date-${idx}`,
        label: formatDate(day.date)
    }));

    // Format category options for dropdown
    const categoryOptions = [
        { value: "", label: "All Categories" },
        ...categories.map(category => ({ value: category, label: category }))
    ];

    return (
        <section className="container mx-auto pb-10">
            <motion.h5
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xl text-customRed mb-4"
            >
                Announcements
            </motion.h5>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-black mb-6"
            >
                <span className="font-medium">Note:</span> COVID-19 safety protocols will be enforced in all venue spaces.
                Masks are recommended in crowded indoor sessions, and hand sanitizing stations will be available throughout the venue.
            </motion.p>

            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl mb-8 text-center font-semibold"
            >
                Venue Details
            </motion.h2>

            {!loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    // UPDATED: Added better spacing for mobile
                    className="flex flex-col md:flex-row items-center justify-center mb-10 gap-6"
                >
                    {venueData.length > 0 && (
                        <div className="flex flex-col justify-center gap-2 mb-8 md:mb-0 relative">
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
                                className="date-dropdown"
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
                                className="category-dropdown"
                            />
                        </div>
                    )}
                </motion.div>
            )}

            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customRed"></div>
                </div>
            ) : venueData.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-gray-50 rounded-lg shadow-sm"
                >
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No upcoming events</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no events scheduled at this time.</p>
                </motion.div>
            ) : (
                filteredVenueData.map((day, index) => (
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
                            <h6 className="text-xl text-center mx-4 px-4 py-2 text-black rounded-full">
                                {formatDate(day.date)}
                            </h6>
                            <div className="h-0.5 bg-gray-200 flex-grow max-w-xs"></div>
                        </div>

                        <EventTable events={day.events} />
                    </motion.div>
                ))
            )}

            {/* Back to top */}
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
        </section>
    );
};

export default VenuePage;
