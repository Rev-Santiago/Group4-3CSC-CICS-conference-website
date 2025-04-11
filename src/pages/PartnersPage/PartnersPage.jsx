import React from "react";
import cicsLogoSmall from '../../assets/cics-seal.png'

const partners = [
    {
        name: "TechInnovate Solutions",
        type: "Industry Partner",
        location: "Silicon Valley, USA",
        description: "TechInnovate Solutions is a leading technology company specializing in cloud computing infrastructure and enterprise software solutions. With a global presence in over 30 countries, they have been instrumental in supporting academic research through their University Relations Program. For CICS 2025, they're providing cloud credits, technical resources, and sponsoring the Best Paper Award.",
        partnership: "Primary Technology Sponsor",
        logo: cicsLogoSmall,
    },
    {
        name: "Global Research Institute",
        type: "Academic Partner",
        location: "London, UK",
        description: "The Global Research Institute is an internationally recognized research organization dedicated to advancing computer science and information technology. Their collaboration with universities worldwide has resulted in numerous breakthrough publications. For this conference, they're providing access to their research databases and co-organizing the AI and Machine Learning track.",
        partnership: "Research Collaborator",
        logo: cicsLogoSmall,
    },
    {
        name: "NextGen Systems",
        type: "Industry Sponsor",
        location: "Tokyo, Japan",
        description: "NextGen Systems is an innovative hardware manufacturer focused on high-performance computing solutions and advanced networking infrastructure. Their contributions to open-source hardware design have transformed the computing landscape. As a sponsor of CICS 2025, they're providing demonstration equipment for workshops and funding the student travel grants program.",
        partnership: "Workshop Sponsor & Equipment Provider",
        logo: cicsLogoSmall,
    },
];

const PartnersPage = () => {
    return (
        <section className="container mx-auto">
            {/* Title */}
            <h2 className="text-3xl text-customRed mb-8 text-center sm:text-left font-bold">
                Conference Partners
            </h2>
            
            <p className="text-gray-700 mb-8">
                CICS 2025 is proud to collaborate with leading organizations from industry and academia. 
                Our partners provide essential support, resources, and expertise that make this conference possible.
            </p>

            {partners.map((partner, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 pb-8 border-b border-gray-200"
                >
                    {/* Logo */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 bg-gray-100 p-2 rounded-md shadow-md flex items-center justify-center">
                        <img
                            src="https://shop.raceya.fit/wp-content/uploads/2020/11/logo-placeholder.jpg"
                            alt={`${partner.name} Logo`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Partner Info */}
                    <div className="flex-grow text-center sm:text-left">
                        <h3 className="text-2xl font-semibold text-gray-800">{partner.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 mb-2">
                            <span className="bg-customRed bg-opacity-10 text-customRed px-3 py-1 rounded-full text-sm font-medium">
                                {partner.type}
                            </span>
                            <span className="text-gray-500">{partner.location}</span>
                        </div>
                        <p className="text-customRed font-medium mb-3">{partner.partnership}</p>
                        
                        <div className="mt-3">
                            <p className="text-gray-700 leading-relaxed">
                                {partner.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}     
        </section>
    );
};

export default PartnersPage;