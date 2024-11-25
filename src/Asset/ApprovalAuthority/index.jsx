import React, { useState, useEffect } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Sidebar/HRMSidebar';
import axios from 'axios';

const RequestTable = ({ type, requests, onUpdateStatus }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const requestData = {
        Asset: requests.assetRequests,
        Category: requests.categoryRequests,
        Workflow: requests.workflowRequests,
    }[type] || [];

    const filteredRequests = requestData.filter((request) => {
        const name =
            type === 'Asset' ? request.assetName : type === 'Category' ? request.categoriesname : request.workflowName;
        // const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = (name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        const matchesDate =
            (!startDate || new Date(request.createdAt) >= new Date(startDate)) &&
            (!endDate || new Date(request.createdAt) <= new Date(endDate));
        return matchesSearch && matchesDate;
    });

    const formatDate = (date) => new Date(date).toLocaleDateString();

    return (
        <div className="bg-white rounded-lg p-4 shadow-md mt-4 w-full h-full">
            <div className="flex flex-col md:flex-row mb-4 space-y-2 md:space-y-0 md:space-x-2">
                <input
                    type="date"
                    className="border border-gray-300 rounded-lg p-2 w-full md:w-48"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={'Search ${type}...'}
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full md:w-1/2 lg:w-[20%]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <div className="max-h-[70vh] overflow-y-auto">
                    <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead className="sticky top-0 bg-gray-200">
                            <tr className="bg-blue-600 text-white">
                                <th className="py-2 px-4 text-left">Sr. No.</th>
                                <th className="py-2 px-4 text-left">{type} Name</th>
                                <th className="py-2 px-4 text-left">Created Date</th>
                                <th className="py-2 px-4 text-left">Workflow Name</th>
                                <th className="py-2 px-4 text-left">Status</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request, index) => (
                                    <tr key={request.category_id} className="hover:bg-gray-100">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4">{request.categoriesname}</td>
                                        <td className="py-2 px-4">
                                            {request.createdAt ? formatDate(request.createdAt) : ''}
                                        </td>
                                        <td className="py-2 px-4">{request.workflowname}</td>
                                        <td className="py-2 px-4">{request.status}</td>
                                        <td className="py-2 px-4">
                                            {type === 'Category' && (
                                                <>
                                                    {request.status === 'Draft' && (
                                                        <>
                                                            <button
                                                                className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition m-1"
                                                                onClick={() => onUpdateStatus(request.categoryId, 'Active')}
                                                            >
                                                                Active
                                                            </button>
                                                            <button
                                                                className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition m-1"
                                                                onClick={() => onUpdateStatus(request.categoryId, 'Resubmitted')}
                                                            >
                                                                Resubmitted
                                                            </button>
                                                        </>
                                                    )}
                                                    {request.status === 'Active' && (
                                                        <button
                                                            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition m-1"
                                                            onClick={() => onUpdateStatus(request.categoryId, 'Inactive')}
                                                        >
                                                            Inactive
                                                        </button>
                                                    )}
                                                    {request.status === 'Inactive' && (
                                                        <button
                                                            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition m-1"
                                                            onClick={() => onUpdateStatus(request.categoryId, 'Active')}
                                                        >
                                                            Active
                                                        </button>
                                                    )}
                                                    {request.status === 'Resubmitted' && (
                                                        <button
                                                            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition m-1"
                                                            onClick={() => onUpdateStatus(request.categoryId, 'Draft')}
                                                        >
                                                            Draft
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-gray-600">
                                        No matching requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ApprovalAuthority = () => {
    const [activeTab, setActiveTab] = useState('Category');
    const [requests, setRequests] = useState({
        assetRequests: [],
        categoryRequests: [],
        workflowRequests: [],
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const fetchCategoryRequests = async () => {
        try {
            const response = await axios.get('https://intranet.higherindia.net:8443/api/categories/fetch');
            setRequests((prev) => ({
                ...prev,
                categoryRequests: response.data,
            }));
        } catch (error) {
            console.error("Error fetching category requests:", error);
        }
    };

    const updateCategoryStatus = async (categoryId, status) => {
        if (!categoryId) {
            console.error("categoryId is missing. Ensure it is being fetched correctly.");
            return;
        }

        try {
            await axios.put('https://intranet.higherindia.net:8443/assets/update-category-status', {
                category_id: categoryId,
                user_id: userId,
                new_status: status,
            });
            fetchCategoryRequests(); // Refresh requests after status update
        } catch (error) {
            console.error("Error updating category status:", error);
        }
    };

    useEffect(() => {
        fetchCategoryRequests();
    }, []);

    const verifyToken = async () => {
        if (!token) {
            navigate('/');
            return;
        }
        try {
            await axios.post('http://intranet.higherindia.net:3006/verify-token', { token });
            navigate('/Approval');
        } catch (error) {
            console.error('Token verification failed:', error.message);
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate('/');
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar />
            <div className="p-6 flex flex-col w-full">
                <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg mb-6">
                    <button onClick={() => navigate('/Cards')} type="button" className="flex items-center p-2 rounded-full">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-2xl font-bold">Approval Authority</h1>
                    <button onClick={handleLogout} type="button" className="bg-white flex items-center p-2 rounded-full">
                        <FaSignOutAlt className="text-black mr-2" size={20} />
                    </button>
                </div>
                
                <div className="flex justify-left space-x-6 mb-0">
                    {['Asset', 'Category', 'Workflow'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative text-lg font-semibold pb-2 transition-all duration-300 ${
                                activeTab === tab ? 'text-blue-600' : 'text-gray-600'
                            }`}
                        >
                            {tab} Requests
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full transition-all duration-300"></span>
                            )}
                        </button>
                    ))}
                </div>

                <RequestTable
                    type={activeTab}
                    requests={requests}
                    onUpdateStatus={updateCategoryStatus}
                />
            </div>
        </div>
    );
};

export default ApprovalAuthority;