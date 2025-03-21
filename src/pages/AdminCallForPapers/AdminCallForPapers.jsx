import React from "react";

const AdminCallForPapers = () => {
    return (
        <section className="admin-call-for-papers">

            {/* Tracks Section */}
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Call For Papers</h1>
                <div className="rounded">
                    <div className="p-2  cursor-pointer">Track 1: </div>
                    <input type="text" className="border border-black w-full p-2 rounded mb-1"/>
                    <textarea className="border border-black w-full p-2 rounded" />
                    <div className="p-2 cursor-pointer">Track 2: </div>
                    <input type="text" className="border border-black w-full p-2 rounded mb-1"/>
                    <textarea className="border border-black w-full p-2 rounded" />
                    <div className="p-2 cursor-pointer">Track 3: </div>
                    <input type="text" className="border border-black w-full p-2 rounded mb-1"/>
                    <textarea className="border border-black w-full p-2 rounded" />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Tracks</button> 
                </div>

                {/* Submission Guidelines Section */}
                <div>
                    <h2 className="text-xl font-semibold mt-3">Submission Guidelines</h2>
                    <textarea className="border border-black w-full p-2 rounded" />
                </div>
            </div>
        </section>
    );
}

export default AdminCallForPapers;