import React from "react";
import cicsLogoSmall from '../../assets/cics-seal.png'

const speakers = [
    {
        name: "Speaker 1",
        image: cicsLogoSmall, 
    },
    {
        name: "Speaker 2",
        image: cicsLogoSmall, 
    },
    {
        name: "Speaker 3",
        image: cicsLogoSmall, 
    },
];

const InvitedSpeakersPage = () => {
    return (
        <section className="container mx-auto">
            {/* Title */}
            <h2 className="text-3xl text-customRed mb-6 text-center sm:text-left">
                Invited Speakers
            </h2>

            {speakers.map((speaker, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-6 border-b"
                >
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                        <img
                            src={speaker.image} // Dynamic image from the array
                            alt={`${speaker.name} Image`}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {/* speaker Info */}
                    <div className="flex-grow text-center sm:text-left">
                        <h3 className="text-xl">{speaker.name}</h3>
                        <p className="text-gray-700">Lorem ipsum dolor sit amet</p>
                        <p className="text-gray-500">consectetur adipiscing elit</p>
                        <p className="mt-2 text-gray-700">
                            Vivamus molestie elit id lobortis vestibulum. In facilisis ex nec ligula egestas, eget viverra odio feugiat.
                            Donec est lectus, posuere eget elit at, sodales semper turpis. Sed volutpat erat ac venenatis pellentesque.
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default InvitedSpeakersPage;
