import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

export default function AdminUserManagementPage() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleRemove = () => {
        handleMenuClose();
    };

    return (
        <section>
            {/* Page Header */}
            <div className="bg-white rounded-lg p-6 mb-6 max-w-6xl mx-auto relative">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">User Management Overview</h1>
                        <p className="text-sm text-gray-500 mt-1">View, edit, and manage all users in the system.</p>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Role: Super Admin</span>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="p-6 bg-white rounded-lg w-full max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <h1 className="text-xl font-semibold">
                        All users <span className="text-gray-400">44</span>
                    </h1>
                    <div className="flex gap-2 flex-wrap">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ring-lightGray"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.65 10.5A6.15 6.15 0 1110.5 4.35a6.15 6.15 0 016.15 6.15z" />
                                </svg>
                            </span>
                        </div>
                        <button className="border px-4 py-2 rounded-md text-sm font-medium">Filters</button>
                        <button className="bg-customRed text-white px-4 py-2 rounded-md text-sm font-medium">+ Add user</button>
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="w-full overflow-x-auto rounded-lg">
                    <div className="min-w-[768px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 px-4 py-2 bg-customRed border border-b-0 text-sm font-medium text-white">
                            <div className="col-span-1">
                                <input type="checkbox" />
                            </div>
                            <div className="col-span-3">User name</div>
                            <div className="col-span-4">Access</div>
                            <div className="col-span-2">Last active</div>
                            <div className="col-span-1">Date added</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Table Rows */}
                        {[...Array(8)].map((_, idx) => (
                            <div key={idx} className="grid grid-cols-12 items-center px-4 py-3 border border-t-0 hover:bg-gray-50">
                                <div className="col-span-1">
                                    <input type="checkbox" />
                                </div>
                                <div className="col-span-3 flex items-center gap-3">
                                    <img src="/avatar-placeholder.png" alt="avatar" className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="font-medium">User Name</div>
                                        <div className="text-sm text-gray-500">user@email.com</div>
                                    </div>
                                </div>
                                <div className="col-span-4 flex gap-2 flex-wrap">
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Admin</span>
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Event Management</span>
                                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Page Edit</span>
                                </div>
                                <div className="col-span-2 text-sm text-gray-700">Mar 4, 2024</div>
                                <div className="col-span-1 text-sm text-gray-700">July 4, 2022</div>
                                <div className="col-span-1 flex justify-end">
                                    <IconButton onClick={(e) => handleMenuOpen(e)} size="small">
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        PaperProps={{
                                            sx: { boxShadow: 1 },
                                        }}
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => { console.log("Promote to Super Admin"); handleMenuClose(); }}>
                                            Promote to Super Admin
                                        </MenuItem>
                                        <MenuItem onClick={() => { console.log("Delete"); handleMenuClose(); }}>
                                            Remove
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-6 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                            key={n}
                            className="w-8 h-8 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-100"
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
