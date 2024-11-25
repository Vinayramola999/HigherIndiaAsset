import { Box } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ApplyLeave from './ApplyLeave';
import BalanceLeave from './BalanceLeave';
import LeaveApproval from './LeaveApproval';
import LeavePolicy from './LeavePolicy';
import { FaHome ,FaSignOutAlt } from 'react-icons/fa';
import Holiday from './Holiday';
import AllBalances from './AllBalances';
import Sidebar from '../Sidebar/HRMSidebar';
import CalenderLeave from './CalenderLeave';
import ProfileDropdown from '../ProfileDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const userId = localStorage.getItem('userId');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState({ show: false, id: null });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);

    const [formData, setFormData] = useState({
        leave_type: '',
        description: '',
        allocation_type: '',
        allocation: '',
        carry_forward: false,
        carry_forward_type: '',
        constraint_type: '',
        value: '',
        percentage: '',
        max_requests: ''
    });

    const handleHome = () => {
        navigate('/Cards');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        let cleanedFormData = { ...formData };

        if (cleanedFormData.carry_forward) {
            if (!cleanedFormData.carry_forward_type || !cleanedFormData.percentage) {
                setError('Carry Forward Type and Value are required when Carry Forward is Yes.');
                return;
            }
        } else {
            delete cleanedFormData.carry_forward_type; // Remove carry_forward_type
            delete cleanedFormData.percentage; // Remove percentage
        }

        const apiUrl = `${process.env.URL}/leave/leave-types`; // Ensure this URL is correct
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add token to the Authorization header
                },
                body: JSON.stringify(cleanedFormData),
            });

            if (response.ok) {
                const data = await response.json();

                // Check if response has leave type structure
                if (data && data.id) {
                    setLeaves(prevLeaves => [...prevLeaves, data]); // Assuming data returned is the new leave

                    // Reset modal and form
                    setIsAddModalOpen(false);
                    setFormData({
                        leave_type: '',
                        description: '',
                        allocation_type: '',
                        allocation: '',
                        constraint_type: '',
                        value: '',
                        carry_forward: false,
                        carry_forward_type: '',
                        percentage: '',
                        max_requests: ''
                    });
                    setError(''); // Clear any previous error messages
                } else {
                    console.error('Invalid response structure:', data);
                    setError('Failed to add leave. Please try again.');
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to add leave:', errorData.message || 'Unknown error');
                setError(errorData.message || 'Failed to create leave type. Please try again.');
            }
        } catch (error) {
            console.error('Error occurred while adding leave:', error);
            setError('An error occurred while creating leave type. Please check the console for more details.');
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && !formData.leave_type) {
            setError("Leave Type is required.");
            return;
        }
        setError('');
        setCurrentStep(currentStep + 1);
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const getToken = () => {
        const token = localStorage.getItem('token');
        return token;
    };
    const token = getToken();
    console.log('Retrieved token:', token);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            const fetchUserData = async () => {
                try {
                    console.log('Fetching data for userId:', userId);
                    const response = await axios.get(`http://higherindia.net:3006/users/id_user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('API Response:', response);
                    if (response.data) {
                        const user = response.data;
                        console.log('User:', user);
                        setUserData(user);
                    } else {
                        console.log('No user data found');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    },
        [token, userId]);

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleFormReset = () => {
        // Reset form fields here (depending on your form structure)
        setFormData({
            field1: '',
            field2: '',
            // Add other fields here
        });
    };

    const fetchLeaves = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        try {
            const response = await fetch('http://higherindia.net:3006/leave/leave-types', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to the Authorization header
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch leaves');
            }

            const data = await response.json();
            if (data.leave_types && Array.isArray(data.leave_types)) {
                setLeaves(data.leave_types);
            } else {
                console.error('Fetched data is not in the expected format:', data);
                setLeaves([]);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
            setLeaves([]);
        }
    };

    const confirmDelete = (id) => {
        setShowDeleteConfirm({ show: true, id });
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        try {
            await axios.delete(`http://higherindia.net:3006/leave/leave-types/${showDeleteConfirm.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Leave type with ID ${showDeleteConfirm.id} deleted successfully`);
            setShowDeleteConfirm({ show: false, id: null });
        } catch (error) {
            console.error("Error deleting leave type:", error);
        }
    };

    const handleLeaveClick = (leave) => {
        setSelectedLeave(leave);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedLeave(null);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="leave_type">
                                Leave Type<span className='text-red-600'>*</span>
                            </label>
                            <input
                                type="text"
                                id="leave_type"
                                name="leave_type"
                                value={formData.leave_type}
                                onChange={handleChange}
                                className={`w-full border border-gray-300 rounded-md p-2 ${error ? 'border-red-500' : ''}`}
                                placeholder="Enter Leave Type"
                                required
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Description"
                            />
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="allocation_type">Allocation Type *</label>
                            <select
                                id="allocation_type"
                                name="allocation_type"
                                value={formData.allocation_type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            >
                                <option value="">Select Allocation Type</option>
                                <option value="yearly">Yearly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="allocation">Allocation *</label>
                            <input
                                type="number"
                                id="allocation"
                                name="allocation"
                                value={formData.allocation}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Allocation"
                                required
                            />
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="constraint_type" className="block text-sm font-medium text-gray-700">
                                Constraint Type *
                            </label>
                            <select
                                id="constraint_type"
                                name="constraint_type"
                                value={formData.constraint_type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            >
                                <option value="">Select Constraint Type</option>
                                <option value="min">Minimum</option>
                                <option value="max">Maximum</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                                Value *
                            </label>
                            <input
                                type="number"
                                id="value"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Enter Allocation"
                                required
                            />
                        </div>
                    </>
                );
            case 4:
                return (
                    <>
                        <div className="mb-4">
                            <label htmlFor="max_requests">
                                Set maximum number of leave request you can apply according to allocation type <span className='text-red-600'>*</span>
                            </label>
                            <input
                                type="text"
                                id="max_requests"
                                name="max_requests"
                                value={formData.max_requests}
                                onChange={handleChange}
                                className={`w-full border border-gray-300 rounded-md p-2 ${error ? 'border-red-500' : ''}`}
                                placeholder="Enter Requests"
                                required
                            />
                        </div>

                    </>
                );
            case 5:
                return (
                    <>
                        <div className="mb-4">
                            <label>Carry Forward *</label>
                            <select
                                id="carry_forward"
                                name="carry_forward"
                                value={formData.carry_forward}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            >
                                <option value="">Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        {formData.carry_forward === 'true' && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="carry_forward_type">Carry Forward Type *</label>
                                    <select
                                        id="carry_forward_type"
                                        name="carry_forward_type"
                                        value={formData.carry_forward_type}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Percentage">Percentage</option>
                                        <option value="Value">Value</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="percentage">Carry Forward Value *</label>
                                    <input
                                        type="number"
                                        id="percentage"
                                        name="percentage"
                                        value={formData.percentage}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Value"
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className='flex'>
            <Sidebar />
            <div className='p-6 w-full'>
                {/* Header */}
                {/* <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                    <button
                        onClick={handleHome}
                        type="button"
                        className="flex items-center p-2 rounded-full">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-2xl font-bold">Leave Management</h1>
                    {userData && (
                        <>
                            <button
                                onClick={toggleDropdown}
                                type="button"
                                className="bg-white flex items-center rounded-full mr-10"
                            >
                                <span className="text-black font-semibold">
                                    <div className="bg-white rounded-3xl p-2 flex items-center">
                                        <div className="flex flex-col">
                                            <h3 className="text-[18px] font-semibold text-custome-black">
                                                {userData.first_name} {userData.last_name}
                                            </h3>
                                        </div>
                                    </div></span>
                            </button>
                        </>
                    )}
                </div>*/}

                {/*  <div className=" ml-[61%] w-[50%] fixed">
                    {isDropdownOpen && <ProfileDropdown className="absolute z-10" />}
                </div>
                {/*END*/}

                {/*************************  Header Start  ******************************/}
                <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                    <button onClick={handleHome} className="flex items-center p-2 rounded-full ">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-2xl font-bold">Leave Management</h1>
                    {userData && (
                        <div className="ml-auto flex items-center gap-4">
                            <div className="bg-white rounded-3xl p-2 flex items-center">
                                <h3 className="text-lg font-semibold text-black">
                                    {userData.first_name} {userData.last_name}
                                </h3>
                            </div>
                            <button onClick={handleLogout} className="bg-white flex items-center p-2 rounded-full ">
                                <FaSignOutAlt className="text-black mr-2" size={20} />
                            </button>
                        </div>
                    )}
                </div>
                {/*************************  Header End  ******************************/}
                <Box>
                    <div className="flex justify-left font-semibold  mt-3 border-gray-300">
                        <button
                            className={`px-6 py-2 text-14px font- relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 0 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(0)}
                        >
                            Create Leave
                        </button>
                        <button
                            className={`px-6 py-2 text-14px font-semibold relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 1 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(1)}
                        >
                            Apply Leave
                        </button>
                        <button
                            className={`px-6 py-2 text-14px font-semibold relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 2 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(2)}
                        >
                            Balance Leave
                        </button>
                        <button
                            className={`px-6 py-2 text-14px font-semibold relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 3 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(3)}
                        >
                            Leave Approval
                        </button>
                        <button
                            className={`px-6 py-2 text-14px font-semibold relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 4 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(4)}
                        >
                            Leave Policy
                        </button>
                        <button
                            className={`px-6 py-2 text-14px font-semibold relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 5 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(5)}
                        >
                            Year Setup
                        </button>
                        <button
                            className={`px-6 py-2 text-14px font-semibold relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 6 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(6)}
                        >
                            Holidays
                        </button>
                        <button
                            className={`px-6 py-2 text-14px font-semibold relative focus:outline-none transition duration-300 rounded-t-md ${tabValue === 7 ? 'bg-white text-blue-600 border-l border-t border-r border-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            onClick={() => setTabValue(7)}
                        >
                            All Balances
                        </button>
                    </div>

                    <div className="p-6 border-l border-r border-gray-300 bg-white">
                        {tabValue === 0 && <div>
                            <div className='justify-between flex'>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue"
                                >
                                    Create Leave
                                </button>
                            </div>

                            {/* Add Modal */}
                            {isAddModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white rounded-lg p-4 w-96">

                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="text-black font-bold text-xl"
                                                onClick={() => {
                                                    setIsAddModalOpen(false);  // Close the modal
                                                    handleFormReset();         // Clear the form when canceled
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <h2 className="text-lg font-bold">Add Leave </h2>
                                        <form onSubmit={(e) => e.preventDefault()}>
                                            {renderStep()}
                                            <div className="flex justify-between mt-4">
                                                {/* Hide Previous button in step 1 */}
                                                {currentStep > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={prevStep}
                                                        className="bg-gray-300 px-4 py-2 rounded">
                                                        Previous
                                                    </button>
                                                )}
                                                {currentStep < 5 ? (
                                                    <button
                                                        type="button" // Ensure this is a button type
                                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                                        onClick={nextStep}>
                                                        Next
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="submit"
                                                        className="bg-green-500 text-white px-4 py-2 rounded"

                                                        onClick={() => {
                                                            setIsAddModalOpen(false);
                                                            handleFormReset();
                                                            handleSubmit();
                                                        }}
                                                    >
                                                        Submit
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Leaves Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto border-collapse border-gray-200">
                                    <thead>
                                        <tr className="border-b border-gray-700 bg-gray-200">
                                            <th className='p-2'>ID</th>
                                            <th className="p-2">Leave Type</th>
                                            <th className="p-2">Description</th>
                                            <th className="p-2">Allocation Type</th>
                                            <th className="p-2">Allocation</th>
                                            <th className="p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaves.map((leave) => (
                                            <tr key={leave.id} className={`bg-${leave.id % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                                                <td className="border p-2 text-center">{leave.id}</td>
                                                <td
                                                    className="border p-2 cursor-pointer text-center text-blue-600"
                                                    onClick={() => handleLeaveClick(leave)}
                                                >
                                                    {leave.leave_type}
                                                </td>
                                                <td className="border p-2 text-center">{leave.description}</td>
                                                <td className="border p-2 text-center">{leave.allocation_type}</td>
                                                <td className="border p-2 text-center">{leave.allocation}</td>
                                                <td className="border p-2 text-center">
                                                    <button
                                                        onClick={() => confirmDelete(leave.id)}
                                                        className="text-red-600"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Popup for Leave Details */}
                                {isPopupOpen && selectedLeave && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="bg-white p-6 rounded-md shadow-lg w-96">
                                            <h2 className="text-xl font-semibold mb-4">Leave Type Details</h2>
                                            <p><strong>Leave Type:</strong> {selectedLeave.leave_type}</p>
                                            <p><strong>Description:</strong> {selectedLeave.description}</p>
                                            <p><strong>Allocation Type:</strong> {selectedLeave.allocation_type}</p>
                                            <p><strong>Allocation:</strong> {selectedLeave.allocation}</p>
                                            <p><strong>Constraint Type:</strong> {selectedLeave.constraint_type}</p>
                                            <p><strong>Value:</strong> {selectedLeave.value}</p>
                                            <p><strong>Maximum Requests:</strong> {selectedLeave.max_requests || 'NA'}</p>
                                            <p><strong>Carry Forward:</strong> {selectedLeave.carry_forward ? 'Yes' : 'No'}</p>
                                            <p><strong>Carry Forward Type:</strong> {selectedLeave.carry_forward_type}</p>
                                            <p><strong>Percentage:</strong> {selectedLeave.percentage || 'NA'}</p>
                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={closePopup}
                                                    className="bg-gray-300 px-4 py-2 rounded"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delete Confirmation Popup */}
                                {showDeleteConfirm.show && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="bg-white p-6 rounded-md shadow-lg w-96">
                                            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                                            <p>Are you sure you want to delete this leave type?</p>
                                            <div className="flex justify-between mt-4">
                                                <button
                                                    onClick={() => setShowDeleteConfirm({ show: false, id: null })}
                                                    className="bg-gray-300 px-4 py-2 rounded"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>}

                        {tabValue === 1 && <div><ApplyLeave /></div>}
                        {tabValue === 2 && <div><BalanceLeave /></div>}
                        {tabValue === 3 && <div><LeaveApproval /></div>}
                        {tabValue === 4 && <div><LeavePolicy /></div>}
                        {tabValue === 5 && <div><CalenderLeave /></div>}
                        {tabValue === 6 && <div><Holiday /></div>}
                        {tabValue === 7 && <div><AllBalances /></div>}
                    </div>
                </Box >
            </div >
        </div >
    );
};
export default LeaveManagement;