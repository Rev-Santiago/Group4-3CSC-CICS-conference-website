import React from "react";
import w3schoolsAvatar from '../../assets/img_avatar.png';

const speakers = [
    {
        name: "Dr. Emily Chen",
        title: "Professor of Computer Science",
        affiliation: "Stanford University, USA",
        bio: "Dr. Emily Chen is a renowned expert in artificial intelligence and machine learning. Her groundbreaking work on neural network architectures has been cited in over 500 research papers. She previously served as the Head of Research at Google AI and has been recognized with numerous awards including the ACM SIGAI Outstanding Achievement Award and the National Science Foundation Career Award.",
        talkTitle: "The Future of AI: Challenges and Opportunities in the Next Decade",
        image: w3schoolsAvatar,
    },
    {
        name: "Prof. Rajiv Patel",
        title: "Distinguished Researcher",
        affiliation: "Indian Institute of Technology Delhi, India",
        bio: "Prof. Rajiv Patel is a pioneer in distributed computing systems and cloud architecture. With over 25 years of experience in both academia and industry, he has led major research initiatives that have shaped modern computing infrastructure. He is the author of three books on cloud computing and has founded two successful technology startups. Prof. Patel currently leads the Advanced Distributed Systems Laboratory at IIT Delhi.",
        talkTitle: "Next-Generation Cloud Systems: Beyond Traditional Architectures",
        image: w3schoolsAvatar,
    },
    {
        name: "Dr. Maria Rodriguez",
        title: "Chief Technology Officer",
        affiliation: "TechFuture Corporation, Spain",
        bio: "Dr. Maria Rodriguez bridges the gap between theoretical computer science and practical industry applications. Before joining TechFuture as CTO, she led research teams at Microsoft Research and IBM Watson. Her work on quantum computing algorithms has been instrumental in developing early commercial applications of quantum technology. Dr. Rodriguez holds 28 patents and continues to publish influential papers in top-tier academic journals.",
        talkTitle: "Quantum Computing: From Theory to Commercial Applications",
        image: w3schoolsAvatar,
    },
];

const KeynoteSpeakersPage = () => {
    return (
        <section className="container mx-auto">
            {/* Title */}
            <h2 className="text-3xl text-customRed mb-8 text-center sm:text-left font-semibold">
                Keynote Speakers
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

export default KeynoteSpeakersPage;