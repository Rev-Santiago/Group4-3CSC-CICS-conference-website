import React from "react";
import w3schoolsAvatar from '../../assets/img_avatar.png'

const speakers = [
    {
        name: "Dr. Jessica Thompson",
        title: "Associate Professor of Cybersecurity",
        affiliation: "University of California, Berkeley, USA",
        bio: "Dr. Thompson specializes in network security, vulnerability assessment, and blockchain technology. Her recent research focuses on developing more robust security protocols for IoT devices in smart city environments. She has published extensively in IEEE Security & Privacy and serves as an advisor to several cybersecurity startups. Before joining UC Berkeley, she worked as a security consultant for major financial institutions.",
        talkTitle: "Securing the Smart City: New Approaches to IoT Security",
        image: w3schoolsAvatar, 
    },
    {
        name: "Prof. Takashi Yamamoto",
        title: "Head of Data Science Department",
        affiliation: "Tokyo Institute of Technology, Japan",
        bio: "Prof. Yamamoto is a leading figure in big data analytics and predictive modeling. His work combines statistical methods with machine learning to solve complex problems in urban planning and transportation. He has led several government-funded projects on smart transportation systems and has collaborated with Toyota and Honda on autonomous vehicle data analysis. His contributions to the field earned him the Japanese Society for Artificial Intelligence Award in 2021.",
        talkTitle: "Predictive Analytics for Urban Mobility: Lessons from Tokyo",
        image: w3schoolsAvatar, 
    },
    {
        name: "Dr. Sophia Nkosi",
        title: "Senior Researcher",
        affiliation: "University of Cape Town & Microsoft Research, South Africa",
        bio: "Dr. Nkosi's work bridges theoretical computer science and practical applications in developing regions. Her pioneering research on low-resource computing environments has helped bring digital solutions to rural communities across Africa. She leads the Microsoft Research initiative on AI for Social Good in Africa and has developed several open-source tools for data collection in limited connectivity settings. Dr. Nkosi holds five patents and has been recognized with the ACM Eugene L. Lawler Award for Humanitarian Contributions.",
        talkTitle: "Computing in Resource-Constrained Environments: Challenges and Innovations",
        image: w3schoolsAvatar, 
    },
];

const InvitedSpeakersPage = () => {
    return (
        <section className="container mx-auto">
            {/* Title */}
            <h2 className="text-3xl text-customRed mb-8 text-center sm:text-left font-semibold">
                Invited Speakers
            </h2>

            {speakers.map((speaker, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 pb-8 border-b border-gray-200"
                >
                    {/* Image */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                        <img
                            src={speaker.image}
                            alt={`${speaker.name}`}
                            className="w-full h-full object-cover rounded-md shadow-md"
                        />
                    </div>

                    {/* Speaker Info */}
                    <div className="flex-grow text-center sm:text-left">
                        <h3 className="text-2xl font-semibold text-gray-800">{speaker.name}</h3>
                        <p className="text-lg text-customRed">{speaker.title}</p>
                        <p className="text-gray-600 mb-3">{speaker.affiliation}</p>
                        
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Talk: {speaker.talkTitle}</h4>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {speaker.bio}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default InvitedSpeakersPage;