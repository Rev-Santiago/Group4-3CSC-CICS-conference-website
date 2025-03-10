import React from "react";

const scheduleData = [
    {
        date: "December 10, 2024",
        events: [
            {
                time: "9:00 AM - 10:00 AM GMT+8",
                program: "Auditorium",
            },
            {
                time: "11:00 AM - 12:00 NN GMT+8",
                program: "Cafeteria",
            },
        ],
    },
    {
        date: "December 11, 2024",
        events: [
            {
                time: "9:00 AM - 10:00 AM GMT+8",
                program: "Auditorium",
            },
            {
                time: "11:00 AM - 12:00 NN GMT+8",
                program: "Cafeteria",
            },
        ],
    },
];

const VenuePage = () => {
    return (
        <section className="mx-auto px-10 pb-10">
            <h5 className="text-xl text-customRed mb-4">Announcements</h5>

            {/* Announcement Paragraph */}
            <p className="text-black mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum.
                In facilisis ex nec ligula egestas, eget viverra odio feugiat. Donec est lectus, posuere eget elit at,
                sodales semper turpis. Sed volutpat erat ac venenatis pellentesque. Sed tincidunt sit amet felis eget euismod.
                Quisque faucibus vulputate lacus, eget auctor risus interdum a.
            </p>

            <h2 className="text-2xl mb-6 text-center">Venue Details</h2>
            {scheduleData.map((day, index) => (
                <div key={index} className="mb-10">
                    <h6 className="text-xl text-center mb-4">{day.date}</h6>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-customRed text-white">
                                    <th className="border border-black p-2">Time</th>
                                    <th className="border border-black p-2">Programme</th>
                                </tr>
                            </thead>
                            <tbody>
                                {day.events.map((event, i) => (
                                    <tr key={i} className="border border-black text-center">
                                        <td className="border border-black p-2">{event.time}</td>
                                        <td className="border border-black p-2 whitespace-pre-line">{event.program}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default VenuePage;
