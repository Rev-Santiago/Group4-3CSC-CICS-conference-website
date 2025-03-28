import React from "react";

const AdminPartnersPage = () => {
    return (
        <section className="admin-contacts">
            
            {/* Contacts Section */}
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Contacts</h1>
                <div className="rounded">
                    <div>
                        <label className="block font-bold mt-3 mb-3">Main Contact:</label>
                        <div className="flex-row flex mb-3">
                            <label className="block mt-3 mr-5">Name:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex">
                            <label className="block mt-3 mr-5">Email:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex mt-3">
                            <label className="block mt-3 mr-5">Telephone:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold mt-3 mb-3">Person 1:</label>
                        <div className="flex-row flex mb-3">
                            <label className="block mt-3 mr-5">Name:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex ">
                            <label className="block mt-3 mr-5">Email:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex mt-3">
                            <label className="block mt-3 mr-5">Telephone:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold mt-3 mb-3">Person 2:</label>
                        <div className="flex-row flex mb-3">
                            <label className="block mt-3 mr-5">Name:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex ">
                            <label className="block mt-3 mr-5">Email:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex mt-3">
                            <label className="block mt-3 mr-5">Telephone:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold mt-3 mb-3">Person 3:</label>
                        <div className="flex-row flex mb-3">
                            <label className="block mt-3 mr-5">Name:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex ">
                            <label className="block mt-3 mr-5">Email:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                        <div className="flex-row flex mt-3">
                            <label className="block mt-3 mr-5">Telephone:</label>
                            <input type="text" className="border border-black w-full p-2 rounded"/>
                        </div>
                    </div>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 mt-5 rounded">Add Contacts</button> 
            </div>
        </section>
    );
};

export default AdminPartnersPage;
