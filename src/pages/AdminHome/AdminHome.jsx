import React from "react";

const AdminHome = () => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Home</h1>

            {/* Image Carousel Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Image Carousel</h2>
                <div className="flex items-center gap-2 my-2">
                    <input type="file" className="border border-black p-2" />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">Remove</button>
                </div>
                <div className="w-full border border-black p-4 h-40 flex items-center justify-center">
                    <p className="text-gray-500">Uploaded images will appear here</p>
                </div>
            </div>

            {/* Text Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Text</h2>
                <div>
                    <label className="block font-semibold mt-3">Title:</label>
                    <input type="text" className="border border-black w-full p-2 rounded" />
                </div>
                <div>
                    <label className="block font-semibold">Body:</label>
                    <textarea className="border border-black w-full p-2 rounded" />
                </div>
            </div>

            {/* Accordion Section */}
            <div>
                <h2 className="text-xl font-semibold mb-3">Accordion</h2>
                <div className="rounded">
                    <div className="p-2  cursor-pointer">Track 1: </div>
                    <input type="text" className="border border-black w-full p-2 rounded mb-1" />
                    <textarea className="border border-black w-full p-2 rounded" />
                    <div className="p-2 cursor-pointer">Track 2: </div>
                    <input type="text" className="border border-black w-full p-2 rounded mb-1" />
                    <textarea className="border border-black w-full p-2 rounded" />
                    <div className="p-2 cursor-pointer">Track 3: </div>
                    <input type="text" className="border border-black w-full p-2 rounded mb-1" />
                    <textarea className="border border-black w-full p-2 rounded" />
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
