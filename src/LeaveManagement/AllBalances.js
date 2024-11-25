import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const LeaveBalance = () => {
    const [leaveData, setLeaveData] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [updatedBalance, setUpdatedBalance] = useState(0);
    const [leaveTypeFilter, setLeaveTypeFilter] = useState('');
    const [userNameFilter, setUserNameFilter] = useState('');
    const [updatedPreviousBalance, setUpdatedPreviousBalance] = useState(0);

    // Fetch all available leave types for the dropdown filter
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

    // Fetch leave data with optional filters
    const fetchLeaveData = async (typeFilter = '', nameFilter = '') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await axios.get('http://higherindia.net:3006/leave/balance', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    leaveType: typeFilter,
                    userName: nameFilter,
                },
            });
            setLeaveData(response.data.leave_types || []);
        } catch (error) {
            console.error('Error fetching leave data', error);
        }
    };

    const openModal = (leave) => {
        setSelectedLeave(leave);
        setUpdatedBalance(leave.balance);
        setUpdatedPreviousBalance(leave.previous_balance);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLeave(null);
    };

    useEffect(() => {
        fetchLeaveData(leaveTypeFilter, userNameFilter);
        fetchLeaveTypes();
        fetchLeaveData();
    }, [leaveTypeFilter, userNameFilter]);

    const handleUpdate = async () => {
        if (selectedLeave) {
            const { id } = selectedLeave;
            const token = localStorage.getItem('token');
            
            try {
                await axios.put(
                    `http://higherindia.net:3006/leave/leave-balances/${id}`,
                    {
                        balance: updatedBalance,
                        previous_balance: updatedPreviousBalance,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                fetchLeaveData(leaveTypeFilter, userNameFilter); // Refresh data after update
                closeModal();
            } catch (error) {
                console.error('Error updating balance', error);
            }
        }
    };    

    return (
        <div className="overflow-x-auto">
            <h2 className="text-[16px] font-bold mb-4">Leave Balance</h2>
            <div className="mb-4 flex gap-4">
                <select
                    value={leaveTypeFilter}
                    onChange={(e) => setLeaveTypeFilter(e.target.value)}
                    className="border border-gray-600 bg-gray-200 rounded-md p-2"
                >
                    <option value=""> Leave Type</option>
                    {leaveTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>            
            </div>

            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 border-b">
                        <th className="p-2 text-left">S.no.</th>
                        <th className="p-2 text-left">User Id</th>
                        <th className="p-2 text-left">Leave Type</th>
                        <th className="p-2 text-left">Previous Balance</th>
                        <th className="p-2 text-left">Balance</th>
                        <th className="p-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveData.map((leave, index) => (
                        <tr key={leave.id} className="border-b hover:bg-gray-50">
                            <td className="border p-2">{index + 1}</td>
                            <td className="p-2">{leave.user_id}</td>
                            <td className="p-2">{leave.leave_type}</td>
                            <td className="p-2">{leave.previous_balance}</td>
                            <td className="p-2">{leave.balance}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => openModal(leave)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal max-w-sm mx-auto my-auto rounded-md shadow-lg"
                overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
                <div className="bg-white p-4">
                    <h2 className="text-xl font-semibold mb-4">Edit Leave Balance</h2>
                    {selectedLeave && (
                        <div>
                            <label className="block mb-2">
                                Leave Type: <strong>{selectedLeave.leave_type}</strong>
                            </label>
                            <label className="block mb-2">
                                Previous Balance:
                                <input
                                    type="number"
                                    value={updatedPreviousBalance}
                                    onChange={(e) => setUpdatedPreviousBalance(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </label>
                            <label className="block mb-2">
                                Current Balance:
                                <input
                                    type="number"
                                    value={updatedBalance}
                                    onChange={(e) => setUpdatedBalance(e.target.value)}
                                    className="border border-gray-300 p-2 rounded w-full"
                                />
                            </label>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};
Modal.setAppElement('#root');
export default LeaveBalance;
