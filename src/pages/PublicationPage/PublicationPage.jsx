import { useEffect, useState } from "react";
import axios from "axios";

const PublicationPage = () => {
    const [allPublications, setAllPublications] = useState([]); // Store all publications
    const [filteredPublications, setFilteredPublications] = useState([]); // Store filtered results
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter states
    const [filters, setFilters] = useState({
        year: '',
        month: '',
        search: ''
    });
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);

    // Pagination settings
    const itemsPerPage = 5;

    // Month names for display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Fetch all publications once
    const fetchAllPublications = async () => {
        setLoading(true);
        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            
            // Fetch all publications (increase limit to get everything)
            const response = await axios.get(`${BACKEND_URL}/api/publications`, {
                params: { page: 1, limit: 1000 } // Large limit to get all publications
            });

            console.log("Raw API Response:", response.data);
            
            // Format publications
            const formattedPublications = response.data.data.map(pub => {
                return {
                    id: pub.id,
                    date: pub.publication_date,
                    publication_description: pub.publication_description,
                    publication_link: pub.publication_link
                };
            });
            
            console.log("All formatted publications:", formattedPublications);
            setAllPublications(formattedPublications);
            
            // Extract unique years and months for filter options
            const years = new Set();
            const months = new Set();
            
            formattedPublications.forEach(pub => {
                if (pub.date) {
                    const date = new Date(pub.date);
                    years.add(date.getFullYear());
                    months.add(date.getMonth() + 1); // getMonth() returns 0-11, we want 1-12
                }
            });

            setAvailableYears(Array.from(years).sort((a, b) => b - a)); // Sort descending
            setAvailableMonths(Array.from(months).sort((a, b) => a - b)); // Sort ascending
            
            setError(null);
        } catch (error) {
            console.error("Error fetching publications:", error);
            setError("Failed to load publications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Apply filters to publications
    const applyFilters = () => {
        let filtered = [...allPublications];

        // Apply year filter
        if (filters.year) {
            filtered = filtered.filter(pub => {
                const pubDate = new Date(pub.date);
                return pubDate.getFullYear() === parseInt(filters.year);
            });
        }

        // Apply month filter
        if (filters.month) {
            filtered = filtered.filter(pub => {
                const pubDate = new Date(pub.date);
                return (pubDate.getMonth() + 1) === parseInt(filters.month);
            });
        }

        // Apply search filter
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase().trim();
            filtered = filtered.filter(pub => {
                return pub.publication_description && 
                       pub.publication_description.toLowerCase().includes(searchTerm);
            });
        }

        console.log("Applied filters:", filters);
        console.log("Filtered publications:", filtered);
        setFilteredPublications(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Calculate pagination for filtered results
    const getPaginatedPublications = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredPublications.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        return Math.ceil(filteredPublications.length / itemsPerPage);
    };

    // Load all publications on component mount
    useEffect(() => {
        fetchAllPublications();
    }, []);

    // Apply filters whenever filters change or publications are loaded
    useEffect(() => {
        applyFilters();
    }, [filters, allPublications]);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < getTotalPages()) setCurrentPage(currentPage + 1);
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

    // Helper function to check if link exists and is valid
    const hasValidLink = (publication) => {
        return publication.publication_link && 
               typeof publication.publication_link === 'string' && 
               publication.publication_link.trim() !== '';
    };

    // Helper function to open link safely
    const openLink = (url, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        console.log("Opening URL:", url);
        
        if (url && typeof url === 'string' && url.trim() !== '') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            console.warn("Attempted to open invalid URL:", url);
        }
    };

    const paginatedPublications = getPaginatedPublications();
    const totalPages = getTotalPages();

    return (
        <section className="container mx-auto pb-10">
            <h1 className="text-3xl my-6 font-semibold">Submission Link</h1>

            {/* Submission Button */}
            <div className="my-4">
                <p className="text-gray-700">
                    Submit your papers at:
                </p>
                <button
                    onClick={() => window.open("https://edas.info/login.php?rurl=aHR0cHM6Ly9lZGFzLmluZm8vTjMyMjgxP2M9MzIyODE=", "_blank")}
                    className="bg-customRed text-white py-2 px-6 rounded-md shadow-md hover:bg-customDarkRed"
                >
                    EDAS Submission Link for CICS
                </button>
            </div>

            <h2 className="text-2xl mb-4 mt-8">Publication</h2>

            <h3 className="text-xl text-customRed mb-2">Conference Proceedings</h3>
            <p className="text-gray-700 mb-6">
                Accepted and peer-reviewed conference papers will be published as part of the IET Conference Proceedings.
                The proceedings will be submitted for indexing in major academic databases including IEEE Xplore, Scopus,
                and Web of Science. Authors of selected high-quality papers may be invited to extend their work for
                publication in special issues of renowned international journals.
            </p>

            <h3 className="text-xl text-center mb-6 font-semibold">Previous Conference Publications</h3>

            {/* Filter Controls */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-lg font-medium mb-3 text-gray-700">Filter Publications</h4>
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
                    <div className="flex flex-col min-w-0 flex-1 ">
                        <label htmlFor="search-filter" className="text-sm font-medium text-gray-600 mb-1">
                            Search Publications
                        </label>
                        <div className="relative">
                            <input
                                id="search-filter"
                                type="text"
                                placeholder="Search by description..."
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
                {!loading && (
                    <div className="mt-2 text-sm text-gray-600">
                        Showing {filteredPublications.length} of {allPublications.length} publications
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

            {loading ? (
                <div className="text-center py-4">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-customRed border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2 text-gray-600">Loading publications...</p>
                </div>
            ) : error ? (
                <div className="text-center py-4 text-red-600">{error}</div>
            ) : (
                <div className="w-full overflow-x-auto shadow-md mb-6">
                    <table className="w-full border-collapse border-2 border-black">
                        <thead>
                            <tr className="bg-customRed text-white">
                                <th className="py-3 px-4 border-2 border-black w-1/4 text-left font-semibold">Date</th>
                                <th className="py-3 px-4 border-2 border-black w-3/4 text-left font-semibold">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPublications.length > 0 ? (
                                paginatedPublications.map((pub, index) => {
                                    console.log(`Publication ${index}:`, pub);
                                    console.log(`Has valid link: ${hasValidLink(pub)}, Link: ${pub.publication_link}`);
                                    
                                    return (
                                        <tr
                                            key={pub.id || index}
                                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                        >
                                            <td className="py-4 px-4 border-2 border-black min-h-[50px]">
                                                {new Date(pub.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-4 border-2 border-black min-h-[50px]">
                                                {hasValidLink(pub) ? (
                                                    <a 
                                                        href={pub.publication_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline flex items-center"
                                                        onClick={(e) => openLink(pub.publication_link, e)}
                                                    >
                                                        <span>{pub.publication_description}</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                ) : (
                                                    <span>{pub.publication_description}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="2" className="py-4 px-4 border-2 border-black text-center min-h-[50px]">
                                        {(filters.year || filters.month) ? 
                                            "No publications found matching the selected filters." : 
                                            "No publications available."
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && paginatedPublications.length > 0 && totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
                    >
                        Previous
                    </button>

                    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>

                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
};

export default PublicationPage;