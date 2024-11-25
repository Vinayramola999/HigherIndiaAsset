import React, { useEffect, useState } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [userData, setUserData] = useState(null);
    const getToken = () => {
        const token = localStorage.getItem('token');
        return token;
    };
    const token = getToken();
    console.log('Retrieved token:', token);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        console.log('UserId:', userId);
        if (userId) {
            const fetchUserData = async () => {
                try {
                    console.log('Fetching data for userId:', userId);
                    const response = await axios.get(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
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
    }, [token, userId]);


    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleHome = () => {
        navigate('/Cards');
    };

    return (
        <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
            {/* Home Button */}
            <button onClick={handleHome} className="flex items-center p-2 rounded-full">
                <FaHome className="text-white mr-2" size={25} />
            </button>

            {/* Page Title */}
            <h1 className="text-white text-2xl font-bold">Users</h1>

            {/* User Info and Logout */}
            {userData && (
                <div className="ml-auto flex items-center gap-4">
                    <div className="bg-white rounded-3xl p-2 flex items-center">
                        <h3 className="text-lg font-semibold text-black">
                            {userData.first_name} {userData.last_name}
                        </h3>
                    </div>
                    <button onClick={handleLogout} className="bg-white flex items-center p-2 rounded-full">
                        <FaSignOutAlt className="text-black mr-2" size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
