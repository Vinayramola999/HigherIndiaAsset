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
        title: 'Department',
        icon: <i className="fas fa-building"></i>,
        image: 'path-to-department-image.jpg'
    },
    {
        title: 'Office Location',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-location-management-image.jpg'
    },
    {
        title: 'Domain',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-location-management-image.jpg'
    },
    {
        title: 'Designation',
        icon: <i className="fas fa-cogs"></i>,
        image: 'path-to-location-management-image.jpg'
    },
];


const CardPage = () => {
    const [availableBtn, setAvailableBtn] = useState();
    const userId = localStorage.getItem('userId');
    const cardTitles = ['Dept', 'Location', 'Designation', 'Domain'];

    useEffect(() => {
        const getUserAccessibleCard = async () => {
            try {
                const token = localStorage.getItem('token'); // Get the token from localStorage
                if (!token) {
                    throw new Error('Token not found. Please log in again.');
                }

                console.log(cardTitles, userId);
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

                console.log("Available:", availableButton);
                setAvailableBtn(availableButton);
            } catch (error) {
                alert(error.message);
            }
        };

        getUserAccessibleCard();
    }, [userId]);

    const getTitle = (value) => {
        switch (value) {
            case "Dept": return "Department"
            case "Location": return "Office Location"
            case "Designation": return "Designation"
            case "Domain": return "Domain"
            default: return "None"
        }
    }
    const getPageName = (value) => {
        switch (value) {
            case "Dept": return "Departments"
            case "Location": return "Location"
            case "Designation": return "Designation"
            case "Domain": return "Domain"
            default: return null
        }
    }



    //TOKEN AND USERPROFILE  START  
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

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                navigate('/');
                return;
            }
            try {
                const response = await axios.post('http://intranet.higherindia.net:3006/verify-token', { token });
                console.log('Token is valid:', response.data);
                navigate('/Cards1');
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

    useEffect(() => {
        const handlePopState = () => {
            navigate('/HRMS');
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className="p-6 bg-white min-h-screen">
            {/*************************  Header Start  ******************************/}
            <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
                    <FaHome className="text-white mr-2" size={25} />
                </button>
                <h1 className="text-white text-2xl font-bold">Organization Set Up</h1>
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