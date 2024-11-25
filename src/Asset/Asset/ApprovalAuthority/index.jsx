




import React, { useState, useEffect } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Sidebar/HRMSidebar';
import axios from 'axios';

const RequestTable = ({ type, requests, onUpdateStatus , onResubmit }) => {
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
                    placeholder={`Search ${type}...`}
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
                                                                onClick={() => onResubmit(request.categoryId, request.receiverId)}  // Trigger Resubmission modal
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
    const [isModalOpen, setIsModalOpen] = useState(false);  // For modal visibility
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // To store the category ID
    const [description, setDescription] = useState(''); // To store the description input
    const [receiverId, setReceiverId] = useState(null); // To store the receiver ID
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const handleResubmission = (categoryId) => {
        // Find the category from the requests array
        const category = requests.categoryRequests.find((request) => request.categoryId === categoryId);
        
        if (category) {
            // Fetch the receiverId (createdBy) from the category data
            const receiverId = category.createdBy;  // 'createdBy' is the user who created the category
            
            // Store the categoryId and receiverId for later use
            setSelectedCategoryId(categoryId);
            setReceiverId(receiverId);
            setIsModalOpen(true);  // Open the modal for description input
        } else {
            console.error('Category not found');
            alert('Category not found');
        }
    };
    

    const handleSubmitResubmission = async () => {
        if (!description) {
            alert("Description is required");
            return;
        }
    
        // Prepare the payloads for both APIs
        const updateStatusPayload = {
            category_id: selectedCategoryId,
            user_id: userId,
            new_status: 'Resubmitted', // Set the status as 'Resubmitted'
        };
    
        const amsLogPayload = {
            sender_id: userId,         // Sender ID (userId)
            receiver_id: receiverId,   // Receiver ID (receiverId)
            category_id: selectedCategoryId,  // Category ID
            status: 'Draft',   // Status is 'Resubmitted'
            description: description, // The description from the modal
        };
    
        try {
            // Step 1: Update the category status (first API call)
            const updateStatusResponse = await axios.put('http://higherindia.net:3006/assets/update-category-status', updateStatusPayload);
            if (updateStatusResponse.status === 200) {
                console.log('Category status updated successfully');
    
                // Step 2: Once the first API completes, call the AMSlog API (second API call)
                const amslogResponse = await axios.post('http://higherindia.net:3006/AMSlog', amsLogPayload);
                if (amslogResponse.status === 200) {
                    console.log('AMS log created successfully');
                    
                    // Close the modal after both APIs succeed
                    setIsModalOpen(false);
                    fetchCategoryRequests(); // Refresh the category requests
                }
            }
        } catch (error) {
            console.error("Error processing resubmission:", error);
            alert("There was an error processing the request. Please try again.");
        }
    };
    
    
    const fetchCategoryRequests = async () => {
        try {
            const response = await axios.get('http://higherindia.net:9898/api/categories/fetch');
            setRequests((prev) => ({
                ...prev,
                categoryRequests: response.data,
            }));
        } catch (error) {
            console.error("Error fetching category requests:", error);
        }
    };
    const updateCategoryStatus = async (categoryId, status, receiverId, description) => {
        if (!categoryId || !status) {
            console.error("categoryId is missing. Ensure it is being fetched correctly.");
            return;
        }
        const userId = parseInt(localStorage.getItem('userId'), 10); // Assuming userId is stored in localStorage
      // Fetch current status of the category before attempting the update
      const currentStatus = await getCurrentCategoryStatus(categoryId); // A function to fetch current status from the backend

      // If the current status is Resubmitted, allow transition only to Draft
    if (currentStatus === 'Resubmitted' && status === 'Resubmitted') {
        alert("Invalid transition from 'Resubmitted' to 'Resubmitted'. Please select a valid status.");
        return;  // Block transition from Resubmitted to Resubmitted
    }

    if (currentStatus === 'Resubmitted' && status !== 'Draft') {
        alert("You can only transition from 'Resubmitted' to 'Draft'.");
        return;  // Prevent transition from Resubmitted to any other status
    }
        try {
            // Step 1: Update the category status via the update-category-status API
            const updateStatusResponse = await axios.put('http://higherindia.net:3006/assets/update-category-status', {
                category_id: categoryId,
                new_status: status,
                user_id: userId,
            });
    
            if (updateStatusResponse.status === 200) {
                // Step 2: Only if the status is 'Resubmitted', call the AMSlog API
                if (status === 'Resubmitted' && description&& receiverId) {
                    const amsLogPayload = {
                        User_id: userId, // Assuming userId is the sender
                        createdBy: receiverId, // Receiver ID (you can set this dynamically)
                        category_id: categoryId,
                        status: status,
                        description: description, // Description provided in the resubmission
                    };
    
                    // Call AMSlog API with the payload
                    await axios.post('http://higherindia.net:3006/AMSlog', amsLogPayload);
                }
    
                // Step 3: Refresh requests after the status update (AMSlog will only be called if Resubmitted)
                fetchCategoryRequests();
            } else {
                console.error("Failed to update category status.");
            }
        } catch (error) {
            console.error("Error updating category status:", error);
            alert("There was an error updating the category status.");
        }
    };
    // Helper function to get the current category status (you may need to implement it based on your data structure)
const getCurrentCategoryStatus = async (categoryId) => {
    try {
        const response = await axios.get(`http://higherindia.net:9898/api/categories/fetch/${categoryId}`);
        return response.data.status;  // Return the current status of the category
    } catch (error) {
        console.error("Error fetching current category status:", error);
        return null;
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
            await axios.post('http://43.204.140.118:3006/verify-token', { token });
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
                    onResubmit={handleResubmission}  // Pass the handler to table
                />
            </div>

        
            {/* Modal for Resubmission */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-xl font-bold mb-4">Resubmit Request</h2>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={handleSubmitResubmission}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApprovalAuthority;

