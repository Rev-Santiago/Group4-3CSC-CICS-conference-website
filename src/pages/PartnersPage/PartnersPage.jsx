import React from "react";
import cicsLogoSmall from '../../assets/cics-seal.png'

const partners = [
    {
        name: "Partner 1",
        logo: cicsLogoSmall, // Replace with actual logo URL
    },
    {
        name: "Partner 2",
        logo: cicsLogoSmall, // Replace with actual logo URL
    },
    {
        name: "Partner 3",
        logo: cicsLogoSmall, // Replace with actual logo URL
    },
];

const PartnersPage = () => {
    return (
        <section className="mx-auto px-10 py-10">
            {/* Title */}
            <h2 className="text-3xl text-customRed mb-6 text-center sm:text-left">
                Partners
            </h2>

            {partners.map((partner, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-6 border-b"
                >
                    {/* Logo */}
                    <div className="w-24 h-24 flex-shrink-0">
                        <img
                            src={partner.logo} // Dynamic logo from the array
                            alt={`${partner.name} Logo`}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>

                    {/* Partner Info */}
                    <div className="flex-grow text-center sm:text-left">
                        <h3 className="text-xl">{partner.name}</h3>
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

export default PartnersPage;
