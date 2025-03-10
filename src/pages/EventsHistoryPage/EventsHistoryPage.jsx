import React from "react";

const events = [
  {
    date: "December 10, 2023",
    schedule: [
      { time: "9:00 AM - 10:00 AM GMT+8", program: ["Event Name", "Speaker", "Other Details"] },
      { time: "11:00 AM - 12:00 NN GMT+8", program: ["Lunch Break"] },
    ],
  },
  {
    date: "December 11, 2023",
    schedule: [
      { time: "9:00 AM - 10:00 AM GMT+8", program: ["Event Name", "Speaker", "Other Details"] },
      { time: "11:00 AM - 12:00 NN GMT+8", program: ["Lunch Break"] },
    ],
  },
];

const EventsHistoryPage = () => {
  return (
    <div className="mx-auto px-10">
      {/* Announcements Title */}
      <h5 className="text-xl text-customRed mb-4">Announcements</h5>

      {/* Announcement Paragraph */}
      <p className="text-black mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus molestie elit id lobortis vestibulum. 
        In facilisis ex nec ligula egestas, eget viverra odio feugiat. Donec est lectus, posuere eget elit at, 
        sodales semper turpis. Sed volutpat erat ac venenatis pellentesque. Sed tincidunt sit amet felis eget euismod. 
        Quisque faucibus vulputate lacus, eget auctor risus interdum a.
      </p>

      {/* Previous Events Title */}
      <h5 className="text-2xl text-center mb-6">Previous Events</h5>

      {events.map((event, index) => (
        <div key={index} className="mb-10">
          {/* Event Date */}
          <h6 className="text-lg text-center mb-4">{event.date}</h6>

          {/* Event Table */}
          <div className="border border-black rounded-none overflow-hidden">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="bg-customRed text-white">
                  <th className="w-1/2 py-3 border-r-2 border-black text-center">Time</th>
                  <th className="w-1/2 py-3 text-centerd">Program</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {event.schedule.map((item, idx) => (
                  <tr key={idx} className="border-t border-black">
                    <td className="w-1/2 py-3 text-center border-r-2 border-black">{item.time}</td>
                    <td className="w-1/2 py-3 text-center">
                      {item.program.map((detail, i) => (
                        <p key={i} className="text-gray-800">{detail}</p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsHistoryPage;
