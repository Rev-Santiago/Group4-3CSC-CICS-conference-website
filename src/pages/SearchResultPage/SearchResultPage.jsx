import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SearchResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            // Use the environment variable for the backend URL
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
            
            setIsLoading(true);
            setError(null);
            
            try {
                console.log(`Fetching from: ${BACKEND_URL}/api/search?query=${searchQuery}`);
                const response = await axios.get(`${BACKEND_URL}/api/search?query=${searchQuery}`);
                console.log("Search response:", response.data);
                setResults(response.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
                console.error("Error details:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status
                });
                setError("Failed to fetch search results. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery) {
            fetchResults();
        }
    }, [searchQuery]);

    // Manual mapping for title to route redirection
    const titleToRouteMap = {
        "Welcome to UST CICS Conference Website": "/",
        "Call For Papers/Tracks": "/call-for-papers",
        "Call For Papers/Submission Guidelines": "/call-for-papers",
        "Schedule/Announcements": "/schedule",
        "Conference Partners": "/partners",
        "Event History/Announcements": "/event-history",
        "Registration and Fees/Conference Fees": "/registration-and-fees",
        "Registration and Fees/Payment Guidelines": "/registration-and-fees",
        "Registration and Fees/Presentation Video": "/registration-and-fees",
        "Publication/Conference Proceedings": "/publication",
        "Publication/Previous Conference Publications": "/publication",
        "Schedule/Schedule Details": "/schedule",
        "Venue/Announcements": "/venue",
        "Venue/Venue Details": "/venue",
        "Speakers/Keynote Speakers": "/keynote-speakers",
        "Speakers/Invited Speakers": "/invited-speakers"
    };

    // Function to handle redirection when a result is clicked
    const handleResultClick = (result) => {
        // Look up the route in the mapping
        const route = titleToRouteMap[result.title];
        
        if (route) {
            console.log(`Navigating to: ${route} from title: ${result.title}`);
            navigate(route);
        } else {
            console.warn(`No route mapping found for title: ${result.title}`);
            // Default to home page if no mapping is found
            navigate('/');
        }
    };

    return (
        <div className="container mx-auto mb-8">
            <h1 className="text-2xl font-bold mb-6">Search results for "{searchQuery}"</h1>
            
            {isLoading && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customRed"></div>
                </div>
            )}
            
            {error && (
                <div className="text-red-600 bg-red-100 rounded mb-4">
                    {error}
                </div>
            )}
            
            {!isLoading && !error && results.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600">No results found for "{searchQuery}"</p>
                    <p className="text-gray-500 mt-2">Try using different keywords or check your spelling.</p>
                </div>
            )}
            
            <div className="space-y-6">
                {results.map((result, index) => (
                    <div key={index} className="">
                        <a 
                            onClick={() => handleResultClick(result)}
                            className="text-customRed text-lg font-semibold hover:underline cursor-pointer block"
                        >
                            {result.title}
                        </a>
                        {result.content && (
                            <p className="text-gray-700 mt-2">
                                {result.content.length > 200 
                                    ? `${result.content.substring(0, 200)}...` 
                                    : result.content}
                            </p>
                        )}
                        <button 
                            onClick={() => handleResultClick(result)}
                            className="mt-3 text-sm text-customRed hover:text-red-800 font-medium flex items-center"
                        >
                            View details
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResultPage;