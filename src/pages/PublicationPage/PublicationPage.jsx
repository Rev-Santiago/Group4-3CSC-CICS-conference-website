import { useEffect, useState } from "react";
import axios from "axios";

const PublicationPage = () => {
    const [publications, setPublications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPublications = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/publications?page=${page}&limit=5`);
            setPublications(response.data.data);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
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
            <h2 className="text-2xl mb-4">Publication</h2>

            <h3 className="text-xl text-customRed mb-2">Conference Proceedings</h3>
            <p className="text-gray-700 mb-4">
                Accepted and peer-reviewed conference papers will be published as part of the IET Conference Proceedings.
            </p>

            <h3 className="text-xl text-center mb-4">Previous Conference Publications</h3>
            <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-customRed text-white">
                            <th className="py-2 px-4 border border-gray-300 w-1/4">Date</th>
                            <th className="py-2 px-4 border border-gray-300 w-3/4">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publications.length > 0 ? (
                            publications.map((pub, index) => (
                                <tr key={index} className="border border-gray-300">
                                    <td className="py-2 px-4 border border-gray-300 text-center min-h-[50px]">
                                        {new Date(pub.publication_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300 text-center min-h-[50px]">
                                        {pub.publication_description}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="py-2 px-4 border border-gray-300 text-center min-h-[50px]">
                                    No publications available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-center space-x-4">
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
