import React from "react";

const publications = [
    { date: "15 August 2024 (Initial); 15 September 2024 (Final); 30 September 2024 (Hard Extension)", description: "Paper Submission" },
    { date: "30 September 2024 (First Batch); 15 October 2024 (Final); 31 October 2024 (Hard Extension)", description: "Full-Paper Acceptance" },
    { date: "15 November 2024", description: "Camera-Ready Submission" },
    { date: "1 October 2024 - 31 October 2024", description: "Early Bird Registration" },
    { date: "1 November 2024 - 15 November 2024", description: "Normal Registration" },
    { date: "5 - 7 December 2024", description: "Conference Date" },
];

const PublicationPage = () => {
    return (
        <section className="mx-auto px-10 pb-10">
            {/* Title */}
            <h2 className="text-2xl mb-4">Publication</h2>

            {/* Conference Proceedings */}
            <h3 className="text-xl text-customRed mb-2">Conference Proceedings</h3>
            <p className="text-gray-700 mb-4">
                Accepted and peer-reviewed conference papers will be published as part of the IET Conference Proceedings. The proceedings will be featured in the IET Digital Library, IEEE Xplore, and indexed in databases such as Ei Compendex, IET Inspec, and Scopus. Authors are required to use either the
                <a href="#" className="text-blue-600 underline"> IET Word Template </a> or
                <a href="#" className="text-blue-600 underline"> IET LaTeX Template </a> for their submissions.
            </p>
            <p className="text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.
            </p>
            <p className="text-gray-700 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.
            </p>

            {/* Previous Conference Publications */}
            <h3 className="text-xl text-center mb-4">Previous Conference Publications</h3>
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-customRed text-white">
                            <th className="py-2 px-4 border border-gray-300">Date</th>
                            <th className="py-2 px-4 border border-gray-300">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publications.map((pub, index) => (
                            <tr key={index} className="border border-gray-300">
                                <td className="py-2 px-4 border border-gray-300 text-center">{pub.date}</td>
                                <td className="py-2 px-4 border border-gray-300 text-center">{pub.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default PublicationPage;
