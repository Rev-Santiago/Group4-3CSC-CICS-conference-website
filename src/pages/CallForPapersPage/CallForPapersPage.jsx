import React from "react";

const CallForPapersPage = () => {
    return (
        <section className="call-for-paper">
            <div className="container mx-auto pb-6 text-gray-900">
                <h1 className="text-3xl">Submission Link</h1>

                {/* Submission Button */}
                <div className="mt-4">
                    <button className="bg-customRed text-white py-2 px-6 rounded-md shadow-md">
                        EDAS Submission Link for CICS
                    </button>
                </div>

                {/* Tracks Section */}
                <section className="mt-8">
                    <h2 className="text-2xl">Tracks</h2>

                    {/* Track 1 */}
                    <div className="mt-4">
                        <h3 className="text-xl text-customRed">Track 1: Innovative Computing and Emerging Technologies</h3>
                        <p className="text-gray-700 mt-2">
                            High-Performance Computing; Cloud and Edge Computing; Artificial Intelligence; Quantum Computing; Blockchain Technology; Cybersecurity and Digital Forensics;
                            Augmented Reality (AR) and Virtual Reality (VR); Internet of Things (IoT); Software Development and Engineering; Distributed Systems; Data Analytics and Visualization;
                            Green Computing.
                        </p>
                    </div>

                    {/* Track 2 */}
                    <div className="mt-6">
                        <h3 className="text-xl text-customRed">Track 2: Data Science and Intelligent Systems</h3>
                        <p className="text-gray-700 mt-2">
                            Big Data Analytics; Machine Learning; Deep Learning Applications; Natural Language Processing; Data Mining; Smart Systems; Predictive Analytics; Decision Support Systems;
                            Computer Vision; Robotic Process Automation; Hybrid Intelligent Systems; Neural Network Applications; Advanced Algorithms.
                        </p>
                    </div>

                    {/* Track 3 */}
                    <div className="mt-6">
                        <h3 className="text-xl text-customRed">Track 3: Sustainable Technology and Smart Innovations</h3>
                        <p className="text-gray-700 mt-2">
                            Renewable Energy Technologies; Smart Cities and Smart Grids; Environmental Informatics; Energy Management Systems; Green Energy Solutions; Automation and Control Systems;
                            Nanotechnology; Embedded Systems; Green Materials and Sensors; Low Power Electronics; Environmental Monitoring and Data Integration; Technological Solutions for Sustainability.
                        </p>
                    </div>
                </section>

                {/* Submission Guidelines */}
                <section className="mt-8">
                    <h2 className="text-2xl">Submission Guidelines</h2>
                    <p className="text-gray-700 mt-2">
                        All authors should use the IET Proceedings Template (Word) or IET Proceedings Template (Latex) for submission.
                    </p>
                </section>
            </div>
        </section>
    );
}

export default CallForPapersPage;