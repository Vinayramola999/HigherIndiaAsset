import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        title: 'Add Role',
        icon: <i className="fas fa-user"></i>,
        image: 'path-to-user-management-image.jpg'
    },
    {
        title: 'Access Management',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-asset-management-image.jpg'
    },
    {
        title: 'Add User',
        icon: <i className="fas fa-user"></i>,
        image: 'path-to-user-management-image.jpg'
    }
];

const CardPage = () => {
    const [availableBtn, setAvailableBtn] = useState();
    const cardTitles = ['UM', 'Role', 'update_access'];

    useEffect(() => {
        const getUserAccessibleCard = async () => {
            try {
                console.log(cardTitles, userId);
                let response = await fetch("http://higherindia.net:3006/access/verify-access", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        user_id: parseInt(userId),
                        pages: cardTitles
                    })
                })
                let data = await response.json();
                let availableButton = {};
                Object.entries(data).forEach(([key, value]) => {
                    if (value) {
                        availableButton[key] = key;
                    }
                })
                console.log("Available:", availableButton);
                setAvailableBtn(availableButton);
            } catch (error) {
                alert(error.message)
            }
        }
        getUserAccessibleCard();
    }, [])

    const getTitle = (value) => {
        switch (value) {
            case "UM": return "Add User"
            case "Role": return "Add Role"
            case "update_access": return "Access Management"
            default: return "None"
        }
    }

    const getPageName = (value) => {
        switch (value) {
            case "UM": return "Usermng"
            case "Role": return "Role"
            case "update_access": return "AMS"
            default: return null
        }
    }

    //TOKEN AND USERPROFILE  START  
    const userId = localStorage.getItem('userId');
    const [userData, setUserData] = useState('');
    const navigate = useNavigate();
    const getToken = () => {
        const token = localStorage.getItem('token');
        return token;
    };
    const token = getToken();
    console.log('Retrieved token:', token);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('UserId:', userId);
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
    }, [token, userId]);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                navigate('/');
                return;
            }
            try {
                const response = await axios.post('http://higherindia.net:3006/verify-token', { token });
                console.log('Token is valid:', response.data);
                navigate('/UMC');
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
    //END 

    return (
        <div className="p-6 bg-white min-h-screen">
            {/*************************  Header Start  ******************************/}
            <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                <button
                    onClick={handleHome}
                    type="button"
                    className="flex items-center p-2 rounded-full ">
                    <FaHome className="text-white mr-2" size={25} />
                </button>
                <h1 className="text-white text-2xl font-bold">User Management</h1>
                {userData && (
                    <div className="ml-auto flex items-center gap-4">
                        <div className="bg-white rounded-3xl p-2 flex items-center">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-custome-black">
                                    {userData.first_name} {userData.last_name}
                                </h3>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="bg-white flex items-center p-2 rounded-full ">
                            <FaSignOutAlt className="text-black mr-2" size={20} />
                            <span className="text-black font-semibold"></span>
                        </button>
                    </div>
                )}
            </div>
            {/*************************  Header End  ******************************/}

            <div className="bg-white rounded-lg p-6">
                <div className="flex flex-wrap justify-center gap-6">
                    {availableBtn && Object.entries(availableBtn).map(([key, value]) => {
                        return <Card
                            title={getTitle(value)}
                            icon={<i className="fas fa-users"></i>}
                            bgColor="bg-blue-500"
                            onClick={() => navigate(`/${getPageName(value)}`)}
                        />
                    })
                    }
                </div>
            </div>
        </div>
    );
};
export default CardPage;