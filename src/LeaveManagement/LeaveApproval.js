import React, { useState, useEffect } from 'react';
import axios from 'axios';

// LeaveModal Component
const LeaveModal = ({ leave, onClose, onUpdateLeaves }) => {
    const [dateRange,setDateRange]=useState([null, null]);
    if (!leave) return null;

    const handleRequest = async (status) => {
        const id = leave.id;
        const manager_id = leave.manager_id;
        try {
            const token = localStorage.getItem('tokenoken');
            const response = await axios.put(`http://higherindia.net:3006/leave/leave-requests/${id}`, {
                manager_id,
                status
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`${status} response:`, response.data);
            onUpdateLeaves(id, status);
            onClose();
        } catch (error) {
            console.error(`Error on ${status}:`, error);
        }
    };
      
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-[500px]">
                <div className="flex justify-between items-center border-b">
                    <h2 className="text-[16px] font-semibold">Leave Details</h2>
                    <button className="text-black-600 text-lg" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="max-md:max-w-full mt-3">
                    <div className="flex flex-col">
                        <div className="flex flex-col md:flex-row md:space-x-4 max-md:w-full">
                            <div className="flex flex-col flex-1">
                                <label className="block text-sm font-medium text-gray-700 mt-4 md:mt-0">ID</label>
                                <input
                                    type="text"
                                    value={leave.id}
                                    disabled
                                    className="mt-1 p-2 border w-full rounded-lg"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="block text-sm font-medium text-gray-700">User Name</label>
                                <input
                                    type="text"
                                    value={`${leave.employee_first_name} ${leave.employee_last_name}`}
                                    disabled
                                    className="mt-1 p-2 border w-full rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-4 max-md:w-full">
                            <div className="flex flex-col flex-1 w-1/2">
                                <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                                <input
                                    type="text"
                                    value={leave.leave_type}
                                    disabled
                                    className="mt-1 p-2 border w-full rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-4 mt-4 max-md:w-full">
                            <div className="flex flex-col">
                                <label className="mb-1 text-gray-700">Start Date:</label>
                                <input
                                    type="date"
                                    className="border border-gray-600 bg-gray-200 rounded-md p-2"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                />
                            </div>
                            <div className="flex flex-col mt-4">
                                <label className="mb-1 text-gray-700">End Date:</label>
                                <input
                                    type="date"
                                    className="border border-gray-600 bg-gray-200 rounded-md p-2"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-4 max-md:w-full">
                            <div className="flex flex-col flex-1">
                                <label className="block text-sm font-medium text-gray-700">Reason</label>
                                <input
                                    type="text"
                                    value={leave.reason}
                                    disabled
                                    className="mt-1 p-2 border w-full rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {leave.status !== 'rejected' && leave.status !== 'approved' && (
                    <div className="flex justify-between mt-4">
                        <button
                            className="bg-gray-400 text-white py-2 px-4 rounded"
                            onClick={() => handleRequest('rejected')}
                        >
                            Reject
                        </button>
                        <button
                            className="bg-blue-600 text-white py-2 px-4 rounded"
                            onClick={() => handleRequest('approved')}
                        >
                            Approve
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// LeavesTable Component
const LeavesTable = ({ leaves, onLeaveSelect }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
            <thead>
                <tr>
                    <th className="border bg-white p-2">ID</th>
                    <th className="border bg-white p-2">Manager ID</th>
                    <th className="border bg-white p-2">Leave Type</th>
                    <th className="border bg-white p-2">Start Date</th>
                    <th className="border bg-white p-2">End Date</th>
                    <th className="border bg-white p-2">Reason</th>
                    <th className="border bg-white p-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {leaves.length > 0 ? (
                    leaves.map((leave, index) => (
                        <tr key={leave.id} className={`bg-${index % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                            <td className="border border-gray-200 p-2">{leave.id}</td>
                            <td className="border border-gray-200 p-2">
                                <button className="text-blue-600 underline" onClick={() => onLeaveSelect(leave)}>
                                    {leave.manager_id}
                                </button>
                            </td>
                            <td className="border border-gray-200 p-2">{leave.leave_type}</td>
                            <td className="border border-gray-200 p-2">{leave.start_date}</td>
                            <td className="border border-gray-200 p-2">{leave.end_date}</td>
                            <td className="border border-gray-200 p-2">{leave.reason}</td>
                            <td className="border border-gray-200 p-2">{leave.status}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center py-4">
                            No leaves available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

// Main LeaveManagement Component
const LeaveManagement = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const fetchLeaves = async () => {
        if (!userId || !token) return;
        try {
            const response = await axios.get(`http://higherindia.net:3006/leave/manager/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const leaveRequests = response.data.leave_requests;
            setLeaves(Array.isArray(leaveRequests) ? leaveRequests : []);
        } catch (error) {
            console.error('Error fetching leaves:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchLeaves();
        fetchLeaveTypes();
        filterLeaves();
    }, [userId, token]);

    const filterLeaves = () => {
        const filtered = leaves.filter(leave => {
            const matchLeaveType = leaveTypeFilter ? leave.leave_type === leaveTypeFilter : true;
            const matchStatus = statusFilter ? leave.status === statusFilter : true;
            const matchDateRange = dateRange.start && dateRange.end
                ? new Date(leave.start_date) >= new Date(dateRange.start) &&
                new Date(leave.end_date) <= new Date(dateRange.end)
                : true;
            return matchLeaveType && matchStatus && matchDateRange;
        });
        setFilteredLeaves(filtered);
    };

    const handleUserIdClick = (leave) => {
        setSelectedLeave(leave);
    };

    const handleCloseModal = () => {
        setSelectedLeave(null);
    };

    const updateLeaves = (id, status) => {
        setLeaves(prevLeaves =>
            prevLeaves.map(leave =>
                leave.id === id ? { ...leave, status } : leave
            )
        );
    };

    const fetchLeaveTypes = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/leave/leave-types', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLeaveTypes(response.data.leave_types || []);
        } catch (error) {
            console.error('Error fetching leave types:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="p-4">
            <div className="flex space-x-4 mb-4">
                <select
                    className="border border-gray-600 bg-gray-200 rounded-md p-2"
                    value={leaveTypeFilter}
                    onChange={(e) => setLeaveTypeFilter(e.target.value)}
                >
                    <option value="">All Leaves </option>
                    {leaveTypes.map((type) => (
                        <option key={type.id} value={type.leave_type}>
                            {type.leave_type}
                        </option>
                    ))}
                </select>
                <select
                    className="border border-gray-600 bg-gray-200 rounded-md p-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value=""> Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                <input
                    type="date"
                    className="border border-gray-600 bg-gray-200 rounded-md p-2"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
                <input
                    type="date"
                    className="border border-gray-600 bg-gray-200 rounded-md p-2"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
            </div>
            <LeavesTable leaves={filteredLeaves} onLeaveSelect={handleUserIdClick} />
            {selectedLeave && (
                <LeaveModal
                    leave={selectedLeave}
                    onClose={handleCloseModal}
                    onUpdateLeaves={updateLeaves}
                />
            )}
        </div>
    );
};
export default LeaveManagement;