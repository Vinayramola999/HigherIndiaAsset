import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaHome } from 'react-icons/fa';
import axios from 'axios';

const Card = ({ title, icon, onClick }) => (
    <button
        className="relative flex flex-col items-center justify-center w-[200px] h-[150px] bg-blue-500 rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 cursor-pointer text-gray-700"
        onClick={() => onClick(title)}
    >
        <div className="absolute top-0 right-0 w-full h-full rounded-tl-[100px] shadow-lg bg-gradient-to-r bg-white">
        </div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="text-4xl mb-2 text-black">{icon}</div>
            <h3 className="text-lg font-semibold">{title}</h3>
        </div>
    </button>
);

const cardData = [
    {
        title: 'Organization Set Up',
        icon: <i className="fas fa-chart-line"></i>,
        image: 'path-to-crm-image.jpg'
    },
    {
        title: 'User Management',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-asset-management-image.jpg'
    },
    {
        title: 'Leave Management',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-asset-management-image.jpg'
    },
    {
        title: 'User Data',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-asset-management-image.jpg'
    },
];

const CardPage = () => {
    const [availableBtn, setAvailableBtn] = useState();
    const userId = localStorage.getItem('userId');
    const cardTitles = ['ORG', 'UMC', 'Leave', 'UserData'];

    const navigate = useNavigate();
    const location = useLocation();  // Get the current location from React Router

    useEffect(() => {
        const getUserAccessibleCard = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the token from localStorage
                if (!token) {
                    throw new Error('Token not found. Please log in again.');
                }
    
                let response = await fetch("http://intranet.higherindia.net:3006/access/verify-access", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`  // Add the token to the Authorization header
                    },
                    body: JSON.stringify({
                        user_id: parseInt(userId),
                        pages: cardTitles
                    })
                });
    
                let data = await response.json();
                let availableButton = {};
                Object.entries(data).forEach(([key, value]) => {
                    if (value) {
                        availableButton[key] = key;
                    }
                });
    
                setAvailableBtn(availableButton);
            } catch (error) {
                alert(error.message);
            }
        };
    
        getUserAccessibleCard();
    }, [userId]);

    const getTitle = (value) => {
        switch (value) {
            case "ORG": return "Organization Set Up"
            case "UMC": return "User Management"
            case "Leave": return "Leave Management"
            case "UserData": return "User Data"
            default: return "None"
        }
    }

    const getPageName = (value) => {
        switch (value) {
            case "ORG": return "Cards1"
            case "UMC": return "UMC"
            case "Leave": return "Leave"
            case "UserData": return "UserData"
            default: return null
        }
    }

    // Fetching user data
    const [userData, setUserData] = useState('');
    const getToken = () => {
        const token = localStorage.getItem('token');
        return token;
    };
    const token = getToken();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.data) {
                        setUserData(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [token]);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                navigate('/');
                return;
            }
            try {
                const response = await axios.post('http://intranet.higherindia.net:3006/verify-token', { token });
                navigate('/HRMS');
            } catch (error) {
                console.error('Token verification failed:', error.response ? error.response.data : error.message);
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                navigate('/');
            }
        };
        verifyToken();
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleHome = () => {
        navigate('/Cards');
    };

    // Handle back button popstate event
    useEffect(() => {
        const handlePopState = () => {
            if (location.pathname !== '/Cards') {
                navigate('/Cards', { replace: true });  // Make sure it's replaced in the history stack
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [location, navigate]);

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
                    <FaHome className="text-white mr-2" size={25} />
                </button>
                <h1 className="text-white text-2xl font-bold">HRMS</h1>
                {userData && (
                    <div className="ml-auto flex items-center gap-4">
                        <div className="bg-white rounded-3xl p-2 flex items-center">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-black">
                                    {userData.first_name} {userData.last_name}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="bg-white flex items-center p-2 rounded-full "
                        >
                            <FaSignOutAlt className="text-black mr-2" size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg p-6">
                <div className="flex flex-wrap justify-center gap-6">
                    {availableBtn && Object.entries(availableBtn).map(([key, value]) => (
                        <Card
                            key={key} // Add the unique key prop here
                            title={getTitle(value)}
                            icon={<i className="fas fa-users"></i>}
                            bgColor="bg-blue-500"
                            onClick={() => navigate(`/${getPageName(value)}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CardPage;
