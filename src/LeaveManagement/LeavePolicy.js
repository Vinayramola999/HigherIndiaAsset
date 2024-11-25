import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeavePolicy() {
    const [sandwichLeave, setSandwichLeave] = useState('Yes');
    const [applyCondition, setApplyCondition] = useState('false');
    const [leaveSelection, setLeaveSelection] = useState('Leave Left This Year');
    const [fetchedLeaveCondition, setFetchedLeaveCondition] = useState('');
    const [currentCondition, setCurrentCondition] = useState(null);

    useEffect(() => {
        fetchSandwichLeave();
        fetchLeaveDetails();
        fetchApplyCondition();
    }, []);

    const handleSandwichLeave = async () => {
        const token = localStorage.getItem('token'); 
        const enabled = sandwichLeave === 'Yes';
        try {
            const response = await axios.post(
                'http://higherindia.net:3006/leave/sandwich',{ enabled },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add token to Authorization header
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Sandwich Leave Response:', response.data);
            alert('Sandwich Leave condition applied successfully');
        } catch (error) {
            console.error('Error applying Sandwich Leave condition:', error);
            alert('Error applying Sandwich Leave condition');
        }
    };
    
    const fetchSandwichLeave = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await axios.get('http://higherindia.net:3006/leave/sandwich', {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });
            if (response.data && response.data.sandwichLeaveEnabled) {
                setSandwichLeave('Yes');
            } else {
                setSandwichLeave('No');
            }
        } catch (error) {
            console.error('Error fetching Sandwich Leave status:', error);
        }
    };
    
    const handleLeaveDetails = async () => {
        const token = localStorage.getItem('token');
        const leaveValue = leaveSelection === 'Leave Left This Year';
        try {
            const response = await axios.post('http://higherindia.net:3006/set-condition',{ condition: leaveValue },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add token to Authorization header
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Leave Details Response:', response.data);
            alert('Leave details submitted successfully');
        } catch (error) {
            console.error('Error submitting leave details:', error);
            alert('Error submitting leave details');
        }
    };
    
    const fetchLeaveDetails = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        try {
            const response = await axios.get('http://higherindia.net:3006/get-condition', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to Authorization header
                    'Content-Type': 'application/json',
                },
            });
            if (response.data && response.data.currentCondition !== undefined) {
                setCurrentCondition(response.data.currentCondition); 
                setLeaveSelection(response.data.currentCondition ? 'Leave Left This Year' : 'Total Leave');
                setFetchedLeaveCondition(response.data.currentCondition ? 'Leave Left This Year' : 'Total Leave');
                setApplyCondition(response.data.currentCondition.toString());
            }
        } catch (error) {
            console.error('Error fetching leave condition:', error);
        }
    };
    
    const handleApplyCondition = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const conditionValue = applyCondition === 'true';
        try {
            const response = await axios.post(
                'http://higherindia.net:3006/set-lapse',
                { lapse: conditionValue },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add token to Authorization header
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Apply Condition Response:', response.data);
            alert('Condition applied successfully');
        } catch (error) {
            console.error('Error applying condition:', error);
            alert('Error applying condition');
        }
    };
       
    const fetchApplyCondition = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        try {
            const response = await axios.get('http://higherindia.net:3006/get-lapse', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to Authorization header
                    'Content-Type': 'application/json',
                },
            });
            if (response.data && response.data.lapse !== undefined) {
                setApplyCondition(response.data.lapse.toString());
            }
        } catch (error) {
            console.error('Error fetching apply condition:', error);
        }
    };
    
    const handleResetMonthlyLeave = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        try {
            const response = await axios.get('http://higherindia.net:3006/reset-monthly', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to Authorization header
                    'Content-Type': 'application/json',
                },
            });
            console.log('Reset Monthly Leave Response:', response.data);
            alert('Monthly leave reset successfully');
        } catch (error) {
            console.error('Error resetting monthly leave:', error);
            alert('Error resetting monthly leave');
        }
    };
    
    const handleResetYearlyLeave = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        try {
            const response = await axios.get('http://higherindia.net:3006/trigger-update', {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to Authorization header
                    'Content-Type': 'application/json',
                },
            });
            console.log('Reset Yearly Leave Response:', response.data);
            alert('Yearly leave reset successfully');
        } catch (error) {
            console.error('Error resetting yearly leave:', error);
            alert('Error resetting yearly leave');
        }
    };
    
    return (
        <div className="mt-8 space-x-4 flex flex-col">
            <div className="flex justify-between space-x-4 border-b border-gray-500">
                <div className="bg-white w-full flex mb-2">
                    <h2 className="text-lg font-bold">Reset Leave For :</h2>
                    <div className="flex items-center">
                        <button
                            onClick={handleResetMonthlyLeave}
                            className="bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ml-5"
                        >
                            Monthly
                        </button>
                        <button
                            onClick={handleResetYearlyLeave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ml-5"
                        >
                            Yearly
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-between space-x-4 mt-5">
                {/* First Card for Sandwich Leave */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 w-full h-96 flex flex-col">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="sandwichLeave" className="text-gray-700 text-[18px] font-bold mb-2">Sandwich Leave</label>
                        <div className="flex-col items-center">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sandwichLeave"
                                    value="true"
                                    checked={sandwichLeave === 'Yes'}
                                    onChange={() => setSandwichLeave('Yes')}
                                    className="form-radio text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sandwichLeave"
                                    value="false"
                                    checked={sandwichLeave === 'No'}
                                    onChange={() => setSandwichLeave('No')}
                                    className="form-radio text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">No</span>
                            </label>
                        </div>
                    </div>
                    <div className="mt-auto"> {/* Move button to bottom */}
                        <button
                            onClick={handleSandwichLeave}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Second Card for Leave Details */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 w-full h-96 flex flex-col">
                    <h2 className="text-lg font-bold mb-4">Leave Details</h2>
                    <div className="flex flex-col mb-4">
                        <label className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="leaveDetail"
                                value="true"
                                checked={leaveSelection === 'Leave Left This Year'}
                                onChange={() => setLeaveSelection('Leave Left This Year')}
                                className="form-radio text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Leave Left This Year</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="leaveDetail"
                                value="false"
                                checked={leaveSelection === 'Total Leave'}
                                onChange={() => setLeaveSelection('Total Leave')}
                                className="form-radio text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">Total Leave</span>
                        </label>
                    </div>
                    <p className="text-gray-600 mb-4">Carry forward % to be applied on this leave.</p>
                    <div className="mt-auto"> 
                        <button
                            onClick={handleLeaveDetails}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                {/* Third Card for Applying Condition */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 w-full h-96 flex flex-col">
                    <h2 className="text-[18px] font-bold mb-4">Apply Lapse Condition</h2>
                    <div className="flex flex-col mb-4">
                        <div className="flex-col">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="applyCondition"
                                    value="true"
                                    checked={applyCondition === 'true'}
                                    onChange={() => setApplyCondition('true')}
                                    className="form-radio text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">True</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="applyCondition"
                                    value="false"
                                    checked={applyCondition === 'false'}
                                    onChange={() => setApplyCondition('false')}
                                    className="form-radio text-blue-600"
                                />
                                <span className="ml-2 text-gray-700">False</span>
                            </label>
                        </div>
                    </div>
                    <div className="mt-auto"> {/* Move button to bottom */}
                        <button
                            onClick={handleApplyCondition}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Apply Condition
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LeavePolicy;