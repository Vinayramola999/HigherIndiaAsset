import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leaveToDelete, setLeaveToDelete] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
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
            delete cleanedFormData.carry_forward_type; 
            delete cleanedFormData.percentage; 
        }
        const apiUrl = 'http://higherindia.net:3006/leave/leave-types'; 
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedFormData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.id) {
                    setLeaves(prevLeaves => [...prevLeaves, data]); 
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

    const handleDelete = async (id) => {
        try {
            await axios({
                method: 'delete',
                url: 'http://higherindia.net:3006/leave',
                data: { id },
            });
            setLeaves(leaves.filter(leave => leave.leave_id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting leave:', error);
            alert('Failed to delete leave.');
        }
    };

    const confirmDelete = (leave) => {
        setLeaveToDelete(leave);
        setIsDeleteModalOpen(true);
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

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleFormReset = () => {
        setFormData({
            field1: '',
            field2: '',
            // Add other fields here
        });
    };

    const fetchLeaves = async () => {
        try {
            const response = await fetch('http://higherindia.net:3006/leave/leave-types');
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

            <div className='p-6 w-full'>
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

                        {isDeleteModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg p-4 w-96">
                                    <h2 className="text-lg font-bold">Confirm Delete</h2>
                                    <p>Are you sure you want to delete this leave?</p>
                                    <div className="flex justify-between mt-4">
                                        <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded">
                                            Cancel
                                        </button>
                                        <button onClick={() => handleDelete(leaveToDelete.leave_id)} className="bg-red-500 text-white px-4 py-2 rounded">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Leaves Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border-gray-200">
                                <thead>
                                    <tr className="border-b border-gray-700 bg-white">
                                        {/* <th className="border border-gray-200 p-2">ID</th> */}
                                        <th className=" p-2">Leave Type</th>
                                        <th className=" p-2">Description</th>
                                        <th className=" p-2">Allocation Type</th>
                                        <th className=" p-2">Allocation</th>
                                        <th className='p-2'>Constraint Type</th>
                                        <th className=" p-2">Value</th>
                                        <th className='p-2'>Maximum Requests</th>
                                        <th className=" p-2">Carry Forward</th>
                                        <th className=" p-2">Carry Forward Type</th>
                                        <th className=" p-2">Values</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((leave) => (
                                        <tr key={leave.id} className={`bg-${leave.id % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                                            {/* <td className="border border-gray-200 p-2">{leave.id}</td> */}
                                            <td className="border bg-white p-2">{leave.leave_type}</td>
                                            <td className="border bg-white p-2">{leave.description}</td>
                                            <td className="border bg-white p-2">{leave.allocation_type}</td>
                                            <td className="border bg-white p-2">{leave.allocation}</td>
                                            <td className="border bg-white p-2">{leave.constraint_type}</td>
                                            <td className='border bg-white p-2'>{leave.value}</td>
                                            <td className='border bg-white p-2'>{leave.max_requests || 'NA'}</td>
                                            <td className="border bg-white p-2">{leave.carry_forward ? 'Yes' : 'No'}</td>
                                            <td className="border bg-white p-2">{leave.carry_forward_type}</td>
                                            <td className="border bg-white p-2">{leave.percentage || 'NA'}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>}
                </div>
            </div >
        </div >
    );
};
export default LeaveManagement;