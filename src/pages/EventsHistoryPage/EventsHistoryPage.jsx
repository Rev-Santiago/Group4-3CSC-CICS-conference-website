import React, { useEffect, useState } from "react";

const EventsHistoryPage = () => {
  const [allEvents, setAllEvents] = useState([]); // Store all events
  const [filteredEvents, setFilteredEvents] = useState([]); // Store filtered results
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    year: '',
    month: '',
    search: ''
  });
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  // Pagination settings
  const itemsPerPage = 1;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Apply filters whenever filters change or events are loaded
  useEffect(() => {
    applyFilters();
  }, [filters, allEvents]);

  // Fetch all events once
  const fetchAllEvents = () => {
    setIsLoading(true);
    fetch(`${BACKEND_URL}/api/events-history?page=1&limit=1000`) // Large limit to get all events
      .then((res) => res.json())
      .then((data) => {
        const events = data.data || [];
        setAllEvents(events);
        
        // Extract unique years and months for filter options
        const years = new Set();
        const months = new Set();
        
        events.forEach(event => {
          if (event.date) {
            const date = new Date(event.date);
            years.add(date.getFullYear());
            months.add(date.getMonth() + 1); // getMonth() returns 0-11, we want 1-12
          }
        });

        setAvailableYears(Array.from(years).sort((a, b) => b - a)); // Sort descending
        setAvailableMonths(Array.from(months).sort((a, b) => a - b)); // Sort ascending
        
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        alert("Something went wrong while fetching the events.");
        setIsLoading(false);
      });
  };

  // Apply filters to events
  const applyFilters = () => {
    let filtered = [...allEvents];

    // Apply year filter
    if (filters.year) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === parseInt(filters.year);
      });
    }

    // Apply month filter
    if (filters.month) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return (eventDate.getMonth() + 1) === parseInt(filters.month);
      });
    }

    // Apply search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(event => {
        // Search in event programs, speakers, categories, and venues
        return event.events && event.events.some(item => {
          return (item.program && item.program.toLowerCase().includes(searchTerm)) ||
                 (item.speaker && item.speaker.toLowerCase().includes(searchTerm)) ||
                 (item.category && item.category.toLowerCase().includes(searchTerm)) ||
                 (item.venue && item.venue.toLowerCase().includes(searchTerm));
        });
      });
    }

    console.log("Applied filters:", filters);
    console.log("Filtered events:", filtered);
    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Calculate pagination for filtered results
  const getPaginatedEvents = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredEvents.length / itemsPerPage);
  };

  const handleFilterChange = (filterType, value) => {
    console.log(`Changing ${filterType} to:`, value);
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    console.log("Clearing all filters");
    setFilters({ year: '', month: '', search: '' });
  };

  const formatDate = (isoString) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoString));
  };

  const paginatedEvents = getPaginatedEvents();
  const totalPages = getTotalPages();

  return (
    <div className="container mx-auto">
      <h5 className="text-xl text-customRed mb-4">Announcements</h5>
      <p className="text-black mb-8">
        The Computing and Information Systems Conference (CICS) has a rich history of bringing together leading researchers, practitioners, and industry professionals. Below you can explore our previous events and their detailed programs.
      </p>

      <h5 className="text-2xl text-center mb-8">Previous Events</h5>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h4 className="text-lg font-medium mb-3 text-gray-700">Filter Events</h4>
        <div className="flex flex-wrap gap-4 items-end justify-between">
          {/* Left side - Date filters */}
          <div className="flex flex-wrap gap-4 items-end">
            {/* Year Filter */}
            <div className="flex flex-col">
              <label htmlFor="year-filter" className="text-sm font-medium text-gray-600 mb-1">
                Year
              </label>
              <select
                id="year-filter"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex flex-col">
              <label htmlFor="month-filter" className="text-sm font-medium text-gray-600 mb-1">
                Month
              </label>
              <select
                id="month-filter"
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
              >
                <option value="">All Months</option>
                {availableMonths.map(month => (
                  <option key={month} value={month}>
                    {monthNames[month - 1]}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex flex-col">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Right side - Search bar */}
          <div className="flex flex-col min-w-0 flex-1">
            <label htmlFor="search-filter" className="text-sm font-medium text-gray-600 mb-1">
              Search Events
            </label>
            <div className="relative">
              <input
                id="search-filter"
                type="text"
                placeholder="Search programs, speakers, categories..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customRed focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.year || filters.month || filters.search) && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.year && (
              <span className="inline-flex items-center px-2 py-1 bg-customRed text-white text-xs rounded-full">
                Year: {filters.year}
                <button
                  onClick={() => handleFilterChange('year', '')}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.month && (
              <span className="inline-flex items-center px-2 py-1 bg-customRed text-white text-xs rounded-full">
                Month: {monthNames[filters.month - 1]}
                <button
                  onClick={() => handleFilterChange('month', '')}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 bg-customRed text-white text-xs rounded-full">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredEvents.length} of {allEvents.length} events
            {(filters.year || filters.month || filters.search) && (
              <span className="ml-1">
                (filtered by {[
                  filters.year && `year ${filters.year}`,
                  filters.month && `month ${monthNames[filters.month - 1]}`,
                  filters.search && `search "${filters.search}"`
                ].filter(Boolean).join(', ')})
              </span>
            )}
          </div>
        )}
      </div>

      {isLoading && <p className="text-center text-gray-600 my-8">Loading events...</p>}

      {paginatedEvents.length > 0 ? (
        paginatedEvents.map((event, index) => (
          <div key={index} className="mb-12">
            <h6 className="text-lg text-center mb-6 font-medium">{formatDate(new Date(event.date))}</h6>
            <div className="w-full overflow-x-auto shadow-md mb-6">
              <table className="w-full border-collapse border-2 border-black">
                <thead>
                  <tr className="bg-customRed text-white">
                    <th className="w-1/6 py-3 px-4 border-2 border-black text-left font-semibold">Time</th>
                    <th className="w-4/6 py-3 px-4 border-2 border-black text-left font-semibold">Program</th>
                    <th className="w-1/6 py-3 px-4 border-2 border-black text-left font-semibold">Venue</th>
                  </tr>
                </thead>
                <tbody>
                  {event.events && event.events.length > 0 ? (
                    event.events.map((item, idx) => (
                      <tr 
                        key={idx} 
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-4 px-4 border-2 border-black min-h-[50px]">{item.time}</td>
                        <td className="py-4 px-4 border-2 border-black min-h-[50px]">
                          <p className="text-gray-800 font-medium">{item.program}</p>
                          {item.speaker && <p className="text-gray-700 mt-1">Speaker: {item.speaker}</p>}
                          {item.category && <p className="text-gray-600 mt-1 italic">Category: {item.category}</p>}
                        </td>
                        <td className="py-4 px-4 border-2 border-black min-h-[50px]">{item.venue}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 px-4 border-2 border-black text-center text-gray-600">
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
        !isLoading && (
          <p className="text-center text-gray-600 my-8">
            {(filters.year || filters.month || filters.search) ? 
              "No events found matching the selected filters." : 
              "No events available."
            }
          </p>
        )
      )}

      {/* Pagination Controls */}
      {!isLoading && paginatedEvents.length > 0 && totalPages > 1 && (
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
      )}
    </div>
  );
};

export default EventsHistoryPage;