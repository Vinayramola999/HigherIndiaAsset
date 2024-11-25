import React, { useEffect, useState } from 'react';
import Sidebar from "./Sidebar/HRMSidebar";
import axios from 'axios';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './Components/ChangePassword';

// Fetch user profile including location
const fetchUserProfileLocation = async (userId) => {
    const response = await fetch(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    const data = await response.json();
    return data[0];
};

// Fetch available locations
const fetchLocation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Token is missing. Please log in again.');
    }
    try {
        const response = await fetch('http://intranet.higherindia.net:3006/loc', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch location');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching location:', error.message);
        throw error;  // Rethrow or handle as needed
    }
};


const ProfilePage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const userId = localStorage.getItem('userId');
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [matchedLocation, setMatchedLocation] = useState(null);
    const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);

    useEffect(() => {
        const getUserProfileAndLocation = async () => {
            try {
                const userProfile = await fetchUserProfileLocation(userId);
                const locations = await fetchLocation();

                const userLocation = locations.find(
                    (loc) => loc.locality === userProfile.location
                );

                setMatchedLocation(userLocation);
                setProfile({ ...userProfile, ...userLocation });
                setUpdatedProfile({ ...userProfile, ...userLocation }); // Initialize updatedProfile with fetched data
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getUserProfileAndLocation();
    }, [userId]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prev) => ({ ...prev, [name]: value })); // Update the corresponding field
    };

    const handleClosePopup = () => {
        setChangePasswordVisible(false);
    };

    const getToken = () => {
        const token = localStorage.getItem('token');
        return token;
    };
    const token = getToken();
    console.log('Retrieved token:', token);

    const verifyToken = async () => {
        if (!token) {
            navigate('/');
            return;
        }
        try {
            const response = await axios.post('http://intranet.higherindia.net:3006/verify-token', {
                token: token
            });
            console.log('Token is valid:', response.data);
            navigate('/Profile');
        } catch (error) {
            console.error('Token verification failed:', error.response ? error.response.data : error.message);
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            navigate('/');
        }
    };

    const handleChangePasswordClick = () => {
        setChangePasswordVisible(true);
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    const handleHome = () => {
        navigate('/Cards');
    };

    return (
        <div className='flex'>
            <Sidebar />
            <div className='p-6 w-full'>
                {/*************************  Header Start  ******************************/}
                <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg relative">
                    <button
                        onClick={handleHome}
                        type="button"
                        className="flex items-center p-2 rounded-full ">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-[24px] font-bold">Profile</h1>

                </div>
                <div className="w-full  mt-5 mx-auto p-6 bg-white shadow-lg rounded-lg">
                    {/* Profile Header */}
                    <section className="flex justify-between items-center border-b pb-4 mb-6">
                        <div className="flex items-center">

                            <div className="ml-6">
                                <h1 className="text-2xl font-semibold">
                                    {profile.first_name} {profile.last_name}
                                </h1>
                                <p className="text-gray-500">{profile.email}</p>
                                <p className="text-gray-500">{profile.user_status}</p>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={ChangePassword}
                            className="hidden"
                            id="file-input"
                        />
                        <label
                            onClick={handleChangePasswordClick}
                            className="cursor-pointer text-blue-500 text-[14px] font-bold flex items-center hover:text-blue-700"
                        >
                            Change Password
                        </label>
                    </section>

                    {isChangePasswordVisible && (
                        <ChangePassword
                            email={profile.email}
                            onClose={handleClosePopup}
                            className="relative"
                        />
                    )}

                    {/* Personal Information Section */}
                    <section className="border rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[18px] font-medium text-blue-500">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <div>
                                <h3 className="text-gray-500">First Name</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={updatedProfile.first_name || ''}
                                        onChange={handleProfileChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <p>{profile.first_name}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-500">Last Name</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={updatedProfile.last_name || ''}
                                        onChange={handleProfileChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <p>{profile.last_name}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-500">Employee Id</h3>
                                <p>{profile.emp_id}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500">Email address</h3>
                                <p>{profile.email}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500">Phone</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="phone_no"
                                        value={updatedProfile.phone_no || ''}
                                        onChange={handleProfileChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <p>{profile.phone_no}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-500">Role</h3>
                                <p>{profile.role}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500">Department</h3>
                                <p>{profile.dept_name}</p>
                            </div>
                            <div>
                                <h3 className="text-gray-500">User's status</h3>
                                <p>{profile.user_status}</p>
                            </div>
                        </div>
                        {/* {editMode && (
                            <button
                                onClick={handleSaveChanges}
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Save Changes
                            </button>
                        )} */}
                    </section>

                    {/* Address Section */}
                    <section className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[18px] font-medium text-blue-600">Address</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                            <div>
                                <h3 className="text-gray-500">Locality</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="locality"
                                        value={updatedProfile.locality || ''}
                                        onChange={handleProfileChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <p>{profile.locality}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-500">State</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="state"
                                        value={updatedProfile.state || ''}
                                        onChange={handleProfileChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <p>{profile.state}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-500">Country</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="country"
                                        value={updatedProfile.country || ''}
                                        onChange={handleProfileChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <p>{profile.country}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-gray-500">Pincode</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={updatedProfile.pincode || ''}
                                        onChange={handleProfileChange}
                                        className="border rounded p-1 w-full"
                                    />
                                ) : (
                                    <p>{profile.code}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>


        </div>
    );
};
export default ProfilePage;