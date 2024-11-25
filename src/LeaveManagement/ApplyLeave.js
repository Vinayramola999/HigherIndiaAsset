import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CreateLeave = ({ closeModal }) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [leave_type, setLeaveType] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [managerId, setManagerId] = useState('');
    const [userData, setUserData] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            leave_type,
            start_date,
            end_date,
            reason,
            manager_id: managersid,
            user_id: userId,
        };
        try {
            const response = await axios.post('http://higherindia.net:3006/leave/leave-requests', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Leave submitted successfully:', response.data);
            alert('Leave submitted successfully!');
            resetForm();
            closeModal();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message;
                if (errorMessage === "Leave request violates overlapping condition with existing leave.") {
                    alert("Error: Your leave request overlaps with an existing leave request.");
                } else {
                    alert("Failed to submit leave: " + errorMessage);
                }
            } else {
                console.error('Error submitting leave:', error);
                alert('Failed to submit leave: ' + (error.message || 'An unexpected error occurred.'));
            }
        }
    };
    

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://higherindia.net:3006/users`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log("Response Data:", response.data);
                    const managers = response.data.filter(user =>
                        user.designation && user.designation.toLowerCase() === 'manager'
                    );
                    setUserData(managers); // Set the filtered user data
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [userId, token]);

    const resetForm = () => {
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
        setManagerId('');
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/leave/leave-types', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.data && Array.isArray(response.data.leave_types)) {
                const types = response.data.leave_types.map(item => item.leave_type);
                setLeaveTypes(types);
            } else {
                console.error('Unexpected response structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching leave types:', error);
        }
    };

    const [managersid, setManagersId] = useState();
    const fetchLeave = async () => {
        if (!userId || !token) return;
        try {
            const response = await axios.get(`http://higherindia.net:3006/leave/leave-requests/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setManagersId(response.data.leave_requests[0].manager_id);
            console.log("first 😊", response.data.leave_requests[0].manager_id)
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };
    
    useEffect(() => {
        fetchLeave();
        fetchLeaveTypes();
    }, [userId, token]);

    // console.log('managersid 👍👍', managersid)
    return (
        <form
            onSubmit={handleSubmit}
            className="flex overflow-hidden flex-col px-5 pt-2.5 pb-7 bg-white rounded-lg shadow-sm border-stone-300 max-w-[553px] modal-container"
        >
            <div className="flex justify-end border-b">
                <button
                    type="button"
                    className="text-black font-bold text-xl"
                    onClick={closeModal}
                >
                    &times;
                </button>
            </div>

            <div className="max-md:max-w-full">
                <div className="flex gap-5 max-md:flex-col">
                    <div className="flex flex-col w-6/12 max-md:w-full">
                        {/* <FormField label="Manager ID" value={manager_id} onChange={(e) => setManagerId(e.target.value)} /> */}
                        <div className="mb-1 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Manager ID</label>
                            <div class="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-full"> {managersid || "Loading..."} </div>
                            {/* <select
                                value={managerId}
                                onChange={(e) => setManagerId(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-full"
                            >
                                <option value="">Select Manager ID</option>
                                {userData.map(manager => (
                                    <option key={manager.user_id} value={manager.user_id}>
                                        {manager.user_id}
                                    </option>
                                ))}
                            </select> */}
                        </div>
                        <div className="flex flex-col mt-4 w-full">
                            <label htmlFor="startDate" className="mb-2 text-gray-700 font-semibold">
                                Start Date
                            </label>
                            <input
                                id="start_date"
                                type="date"
                                value={start_date}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-full"
                            />
                        </div>
                        <div className="flex flex-col mt-4 w-full">
                            <label className="font-medium text-sm mb-1">Reason</label>
                            <textarea
                                className="h-32 w-full border rounded-lg p-2 resize-none"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter the reason for leave"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col w-6/12 max-md:w-full">
                        {/* <FormField label="Leave Type" value={leave_type} onChange={(e) => setLeaveType(e.target.value)} /> */}
                        <div className="mb-1 mt-4">
                            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                            <select
                                value={leave_type}
                                onChange={(e) => setLeaveType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-full"
                            >
                                <option value="">Select a leave type</option>
                                {leaveTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}

                            </select>
                        </div>

                        <div className="flex flex-col mt-4">
                            <label htmlFor="endDate" className="mb-2 text-gray-700 font-semibold">
                                End Date
                            </label>
                            <input
                                id="end_date"
                                type="date"
                                value={end_date}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-6 self-end mt-6 text-sm whitespace-nowrap">
                <button
                    type="button"
                    className="px-14 py-3 text-black border border-solid border-neutral-400 rounded-[30px] max-md:px-5"
                    onClick={closeModal}
                >
                    Cancel
                </button>
                <button type="submit" className="px-14 py-3 bg-zinc-500 text-white rounded-[30px] max-md:px-5">
                    Submit
                </button>
            </div>
        </form>
    );
};

const LeavesTable = ({ leaves, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
            <thead>
                <tr>
                    <th className="border bg-white p-2">S.no.</th>
                    <th className="border bg-white p-2">Manager ID</th>
                    <th className="border bg-white p-2">Leave Type</th>
                    <th className="border bg-white p-2">Start Date</th>
                    <th className="border bg-white p-2">End Date</th>
                    <th className="border bg-white p-2">Reason</th>
                    <th className="border bg-white p-2">Status</th>
                    <th className="border bg-white p-2">Action</th>
                </tr>
            </thead>
            <tbody>
                {leaves.length > 0 ? (
                    leaves.map((leave, index) => (
                        <tr key={leave.id} className={index % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{leave.manager_id}</td>
                            <td className="border p-2">{leave.leave_type}</td>
                            <td className="border p-2">{leave.start_date}</td>
                            <td className="border p-2">{leave.end_date}</td>
                            <td className="border p-2">{leave.reason}</td>
                            <td className="border p-2">{leave.status}</td>
                            <td className="border p-2 text-center">
                                <button className="text-red-600" onClick={() => onDelete(leave.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="text-center py-4">No leaves available</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

// Main Leave Management Component
const LeaveManagement = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [leaves, setLeaves] = useState([]);
    const [managersid, setManagersId] = useState();
    
    // Fetch Leaves
    const fetchLeaves = async () => {
        if (!userId || !token) return;
        try {
            const response = await axios.get(`http://higherindia.net:3006/leave/leave-requests/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeaves(response.data.leave_requests || []);
            setManagersId(response.data.leave_requests[0].manager_id);
            console.log("first ", response.data.leave_requests[0].manager_id)
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    // Delete Leave Request
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://higherindia.net:3006/leave/leave-requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Leave deleted successfully!');
            fetchLeaves(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting leave:', error);
            alert('Failed to delete leave: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [userId, token]);

    return (
        <div className="p-0">
            <button
                className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue"
                onClick={() => setIsAddModalOpen(true)}
            >
                Apply Leave
            </button>

            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-black opacity-50 absolute inset-0 z-40" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative z-50">
                        <CreateLeave closeModal={() => setIsAddModalOpen(false)} />
                    </div>
                </div>
            )}

            <LeavesTable leaves={leaves} onDelete={handleDelete} />
        </div>
    );
};
export default LeaveManagement;