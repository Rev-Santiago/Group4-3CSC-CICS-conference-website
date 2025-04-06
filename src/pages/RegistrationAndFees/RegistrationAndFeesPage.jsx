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
            <h2 className="text-2xl mb-4">Conference Fees</h2>
            <div className="overflow-x-auto">
                <table className="w-full border border-black text-left">
                    <thead>
                        <tr className="bg-customRed text-white">
                            <th className="p-3 border border-black text-center">Categories</th>
                            <th className="p-3 border border-black text-center">Registration Fees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feesData.map((item, index) => (
                            <tr key={index} className="border border-black">
                                <td className="p-3 border border-black text-center">{item.category}</td>
                                <td className="p-3 border border-black text-center">{item.fee}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment Guidelines Section */}
            <h3 className="text-xl mt-8 mb-4">Payment Guidelines</h3>
            <p className="text-gray-700">
                Each author registration is valid for one accepted paper. The registration fee covers conference proceedings and publications.
                Authors with multiple papers will be charged 50% of the first paper’s registration fee for each additional paper.
                Papers are limited to 6 pages without extra charges; additional pages (up to 2) will incur a fee of PHP [Amount] per page.
            </p>

            <h4 className="text-lg mt-4">For payment:</h4>
            <ul className="list-disc list-inside text-gray-700 mt-2">
                <li>Bank Name: [Bank Name]</li>
                <li>Account Number: [Account Number]</li>
                <li>Account Name: [Account Name]</li>
                <li>Branch: [Branch Name]</li>
                <li>Swift Code: [Swift Code]</li>
            </ul>

            {/* Presentation Video Section */}
            <h3 className="text-xl mt-8 mb-4">Presentation Video</h3>
            <p className="text-gray-700">
                All authors of accepted papers of CICS-Conference Portal 2024 who have registered for presentation are required to upload a
                pre-recorded video of their paper presentation in the EDAS system. The presentation is recorded by the registered presenter
                and will be available during the original dates of the conference. The registered presenter must attend their allocated session.
                The pre-recorded video will be played, and a Q&A session will be held afterward.
            </p>
        </div>
    );
};

export default RegistrationAndFeesPage;
