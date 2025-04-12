import { useEffect, useState } from "react";
import axios from "axios";

const PublicationPage = () => {
    const [publications, setPublications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPublications = async (page = 1) => {
        try {
            // Make sure to use the environment variable for the backend URL
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/publications?page=${page}&limit=5`);

            const result = await response.json();

            setPublications(result.data);
            setTotalPages(result.totalPages);
            setCurrentPage(result.currentPage);
        } catch (error) {
            console.error("Error fetching publications:", error);
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
        publications.map((pub, index) => (
            <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
                <td className="py-4 px-4 border-2 border-black min-h-[50px]">
                    {new Date(pub.publication_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </td>
                            <td className="py-4 px-4 border-2 border-black min-h-[50px]">
                                {pub.publication_link ? (
                                    <a 
                                        href={pub.publication_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:underline text-blue-700"
                                    >
                                        {pub.publication_description}
                                    </a>
                                ) : (
                                    <span>{pub.publication_description}</span>
                                )}
                            </td>
                        </tr>
                    ))
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

            {/* Pagination Controls */}
            <div className="mt-6 flex justify-center space-x-4">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>

                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </section>
    );
};

export default PublicationPage;
