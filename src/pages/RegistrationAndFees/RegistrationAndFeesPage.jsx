import React from "react";

const RegistrationAndFeesPage = () => {
    // Table data stored in an array for easy updates
    const feesData = [
        { category: "Student", fee: "PHPXXXX" },
        { category: "Regular", fee: "PHPXXXX" },
        { category: "Additional Paper", fee: "XX% of registration fee" },
    ];

    return (
        <div className="container mx-auto pb-10">
            {/* Conference Fees Section */}
            <h2 className="text-2xl font-semibold my-6">Conference Fees</h2>

            <div className="w-full overflow-x-auto shadow-md mb-8">
                <table className="w-full border-collapse border-2 border-black">
                    <thead>
                        <tr className="bg-customRed text-white">
                            <th className="py-3 px-4 border-2 border-black text-left font-semibold w-1/2">Categories</th>
                            <th className="py-3 px-4 border-2 border-black text-left font-semibold w-1/2">Registration Fees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feesData.map((item, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                            >
                                <td className="py-4 px-4 border-2 border-black min-h-[50px]">{item.category}</td>
                                <td className="py-4 px-4 border-2 border-black min-h-[50px]">{item.fee}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment Guidelines Section */}
            <div className="bg-white rounded-lg mb-8">
                <h3 className="text-xl text-customRed font-semibold mb-4">Payment Guidelines</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Each author registration is valid for one accepted paper. The registration fee covers conference proceedings and publications.
                    Authors with multiple papers will be charged 50% of the first paper's registration fee for each additional paper.
                    Papers are limited to 6 pages without extra charges; additional pages (up to 2) will incur a fee of PHP [Amount] per page.
                </p>

                <h4 className="text-lg font-medium mt-6 mb-3">For payment:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                    <li>Bank Name: [Bank Name]</li>
                    <li>Account Number: [Account Number]</li>
                    <li>Account Name: [Account Name]</li>
                    <li>Branch: [Branch Name]</li>
                    <li>Swift Code: [Swift Code]</li>
                </ul>
                <p className="text-gray-700 mt-4 leading-relaxed">
                    To continue your payment <a href="https://your-payment-link.com" className="text-blue-600 hover:underline">click here</a>
                </p>
            </div>

            {/* Presentation Video Section */}
            <div className="bg-white rounded-lg">
                <h3 className="text-xl text-customRed font-semibold mb-4">Presentation Video</h3>
                <p className="text-gray-700 leading-relaxed">
                    All authors of accepted papers of CICS-Conference Portal 2024 who have registered for presentation are required to upload a
                    pre-recorded video of their paper presentation in the EDAS system. The presentation is recorded by the registered presenter
                    and will be available during the original dates of the conference. The registered presenter must attend their allocated session.
                    The pre-recorded video will be played, and a Q&A session will be held afterward.
                </p>
            </div>
        </div>
    );
};

export default RegistrationAndFeesPage;