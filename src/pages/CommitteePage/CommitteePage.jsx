import React from "react";

const CommitteePage = () => {
    const committeeData = {
        generalChairs: [
            { name: "Prof. Sarah Johnson", affiliation: "Stanford University, USA" },
            { name: "Prof. Hiroshi Tanaka", affiliation: "Tokyo Institute of Technology, Japan" }
        ],
        programChairs: [
            { name: "Prof. Elena Rodriguez", affiliation: "Technical University of Madrid, Spain" },
            { name: "Prof. David Chen", affiliation: "University of Queensland, Australia" },
            { name: "Prof. Michael Wilson", affiliation: "University of Cambridge, UK" }
        ],
        publicationsChair: [
            { name: "Dr. Amelia Chang", affiliation: "MIT, USA" },
            { name: "Dr. Robert Okafor", affiliation: "University of Cape Town, South Africa" }
        ],
        financeChair: [
            { name: "Dr. Thomas Mueller", affiliation: "Technical University of Munich, Germany" }
        ],
        localArrangements: [
            { name: "Dr. Maria Sanchez", affiliation: "Universidad Nacional Autónoma de México, Mexico" },
            { name: "Dr. Ahmed Hassan", affiliation: "Cairo University, Egypt" }
        ],
        publicityChairs: [
            { name: "Dr. Olivia Kim", affiliation: "Seoul National University, South Korea" },
            { name: "Dr. Sanjay Gupta", affiliation: "Indian Institute of Technology Delhi, India" }
        ],
        workshopChairs: [
            { name: "Prof. Fatima Al-Zahrani", affiliation: "King Abdullah University of Science and Technology, Saudi Arabia" },
            { name: "Prof. Luis Hernandez", affiliation: "University of São Paulo, Brazil" }
        ],
        registrationChair: [
            { name: "Dr. Emma Williams", affiliation: "University of Toronto, Canada" }
        ],
        technicalProgramCommittee: [
            { name: "Prof. Daniel Anderson", affiliation: "ETH Zurich, Switzerland" },
            { name: "Prof. Grace Liu", affiliation: "Peking University, China" },
            { name: "Dr. Vikram Patel", affiliation: "Tata Institute of Fundamental Research, India" },
            { name: "Dr. Nicole Wagner", affiliation: "University of Amsterdam, Netherlands" },
            { name: "Dr. Carlos Martinez", affiliation: "University of Buenos Aires, Argentina" }
        ]
    };

    return (
        <section className="committee">
            <div className="container mx-auto pb-10">
                <h1 className="text-3xl font-bold my-6">Organizing Committee</h1>
                
                <p className="text-gray-700 mb-8">
                    The CICS 2025 conference is organized by an international team of experts from academia and industry,
                    dedicated to creating a valuable and enriching experience for all participants.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Chairs */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">General Chairs</h3>
                        {committeeData.generalChairs.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Program Chairs */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">Program Chairs</h3>
                        {committeeData.programChairs.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Publications Chair */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">Publications Chairs</h3>
                        {committeeData.publicationsChair.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Finance Chair */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">Finance Chair</h3>
                        {committeeData.financeChair.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Local Arrangements */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">Local Arrangements Chairs</h3>
                        {committeeData.localArrangements.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Publicity Chairs */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">Publicity Chairs</h3>
                        {committeeData.publicityChairs.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Workshop Chairs */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">Workshop Chairs</h3>
                        {committeeData.workshopChairs.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>

                    {/* Registration Chair */}
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-customRed">
                        <h3 className="text-xl text-customRed font-semibold mb-4">Registration Chair</h3>
                        {committeeData.registrationChair.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technical Program Committee */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-md border-t-4 border-customRed">
                    <h3 className="text-xl text-customRed font-semibold mb-4">Technical Program Committee</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {committeeData.technicalProgramCommittee.map((person, index) => (
                            <div key={index} className="mb-3">
                                <p className="font-medium text-gray-800">{person.name}</p>
                                <p className="text-gray-600 text-sm">{person.affiliation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommitteePage;