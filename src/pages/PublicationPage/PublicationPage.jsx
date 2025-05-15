import { useEffect, useState } from "react";
import axios from "axios";

const PublicationPage = () => {
    const [publications, setPublications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPublications = async (page = 1) => {
        setLoading(true);
        try {
            // Make sure to use the environment variable for the backend URL
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            
            // Using axios instead of fetch for consistency with admin component
            const response = await axios.get(`${BACKEND_URL}/api/publications`, {
                params: { page, limit: 5 }
            });

            console.log("Raw API Response:", response.data);
            
            // Format publications in the same way as AdminSeeAllPublications
            // This ensures we're handling the same property structure
            const formattedPublications = response.data.data.map(pub => {
                return {
                    id: pub.id,
                    date: pub.publication_date,
                    // Use the exact same property name as in AdminSeeAllPublications
                    publication_description: pub.publication_description,
                    // This matches the property name used in AdminSeeAllPublications
                    publication_link: pub.publication_link
                };
            });
            
            console.log("Formatted publications:", formattedPublications);
            setPublications(formattedPublications);
            setTotalPages(response.data.totalPages || 1);
            setCurrentPage(response.data.currentPage || page);
            setError(null);
        } catch (error) {
            console.error("Error fetching publications:", error);
            setError("Failed to load publications. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublications(currentPage);
    }, [currentPage]);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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
                            {publications.length > 0 ? (
                                publications.map((pub, index) => {
                                    // Log each publication to debug
                                    console.log(`Publication ${index}:`, pub);
                                    console.log(`Has valid link: ${hasValidLink(pub)}, Link: ${pub.publication_link}`);
                                    
                                    return (
                                        <tr
                                            key={index}
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
                                                    // If there's a link, make the description clickable
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
                                                    // Otherwise, just show the text
                                                    <span>{pub.publication_description}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="2" className="py-4 px-4 border-2 border-black text-center min-h-[50px]">
                                        No publications available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && publications.length > 0 && totalPages > 1 && (
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