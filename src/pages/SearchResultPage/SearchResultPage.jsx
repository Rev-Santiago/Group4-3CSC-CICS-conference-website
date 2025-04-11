import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function SearchResultPage() {
    const location = useLocation();
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
                setError("Failed to fetch search results. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery) {
            fetchResults();
        }
    }, [searchQuery]);

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Search results for "{searchQuery}"</h1>
            
            {isLoading && (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customRed"></div>
                </div>
            )}
            
            {error && (
                <div className="text-red-600 bg-red-100 p-4 rounded mb-4">
                    {error}
                </div>
            )}
            
            {!isLoading && !error && results.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-600">No results found for "{searchQuery}"</p>
                    <p className="text-gray-500 mt-2">Try using different keywords or check your spelling.</p>
                </div>
            )}
            
            <div>
                {results.map((result, index) => (
                    <div key={index} className="pb-4 mb-4">
                        <a href="#" className="text-customRed text-lg font-semibold hover:underline">
                            {index + 1}. {result.title}
                        </a>
                        <p className="text-gray-700 mt-1">{result.content}</p>
                        {index !== results.length - 1 && (
                            <hr className="my-4 border-gray-300" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResultPage;