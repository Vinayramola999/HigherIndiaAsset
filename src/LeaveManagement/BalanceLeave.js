import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeavesTable = () => {
    const [leaves, setLeaves] = useState([]);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [userData, setUserData] = useState(null);

    const fetchLeaveBalance = async () => {
        if (!userId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://higherindia.net:3006/leave/balance/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setLeaves(data.leave_balance);
            } else {
                console.error('Error fetching leave balance:', data.message);
            }
        } catch (error) {
            console.error('Error fetching leave balance:', error);
        }
    };    

    useEffect(() => {
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://higherindia.net:3006/users/id_user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const user = response.data[0];
                    setUserData(user);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [token, userId]);

    useEffect(() => {
        fetchLeaveBalance();
    }, [userId]); 

    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
            {leaves.length > 0 ? (
                leaves.map((leave, index) => (
                    <div key={leave.id} className="bg-white shadow-md rounded-lg p-4 border h-48 w-64"> {/* Adjust height and width here */}
                        <h2 className="text-lg font-semibold text-custome-blue">{leave.leave_type}</h2>
                        <p className="mt-2"><strong>Allocation Type:</strong> {leave.allocation_type}</p>
                        <p className="mt-1"><strong>Balance:</strong> {leave.balance}</p>
                        <p className="mt-1"><strong>Previous Balance:</strong> {leave.previous_balance}</p>
                        <p className="mt-1"><strong>Total Balance:</strong> {leave.total_balance}</p>
                    </div>
                ))
            ) : (
                <p className="text-center col-span-full p-4">No data available</p>
            )}
        </div>
    );
};

export default LeavesTable;
