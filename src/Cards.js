import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from './assests/Logo.png';
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
        title: 'CRM',
        icon: <i className="fas fa-chart-line"></i>,
        image: 'path-to-crm-image.jpg'
    },
    {
        title: 'Asset Management',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-asset-management-image.jpg'
    },
    {
        title: 'HRMS',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-asset-management-image.jpg'
    },
    {
        title: 'UCS',
        icon: <i className="fas fa-chart-line"></i>,
        image: 'path-to-ucs-image.jpg'
    },

];

const CardPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const [availableBtn, setAvailableBtn] = useState();
    const cardTitles = ['CRM', 'HRMS', 'ASM', 'UCS'];

    useEffect(() => {
        const getUserAccessibleCard = async () => {
            try {
                console.log(cardTitles, userId);
                const token = localStorage.getItem("token");

                let response = await fetch("http://intranet.higherindia.net:3006/access/verify-access", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
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
                console.log("Available:", availableButton);
                setAvailableBtn(availableButton);
            } catch (error) {
                alert(error.message);
            }
        };
        getUserAccessibleCard();
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('UserId:', userId);
        if (userId) {
            const fetchUserData = async () => {
                try {
                    console.log('Fetching data for userId:', userId);
                    const response = await axios.get(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
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
        const handlePopState = () => {
            navigate('/');
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                navigate('/');
                return;
            }
            try {
                const response = await axios.post('http://intranet.higherindia.net:3006/verify-token', { token });
                console.log('Token is valid:', response.data);
                navigate('/Cards');
            } catch (error) {
                console.error('Token verification failed:', error.response ? error.response.data : error.message);
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                navigate('/');
            }
        };
        verifyToken();
    }, [token, navigate]);

    const getTitle = (value) => {
        switch (value) {
            case "CRM": return "CRM"
            case "ASM": return "Asset Management"
            case "HRMS": return "HRMS"
            case "UCS": return "UCS"
            default: return "None"
        }
    }

    const getPageName = (value) => {
        switch (value) {
            case "CRM": return "Profile"
            case "HRMS": return "HRMS"
            case "ASM": return "assets";
            case "UCS": return "UCS"
            default: return null
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            {/*************************  Header Start  ******************************/}
            <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                <h1 className="text-white text-3xl font-bold">
                    <div>
                        <img src={logo} alt="Logo" className="w-30 h-10" />
                    </div>
                </h1>
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
                            className="bg-white flex items-center p-2 rounded-full ">
                            <FaSignOutAlt className="text-black mr-2" size={20} />
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