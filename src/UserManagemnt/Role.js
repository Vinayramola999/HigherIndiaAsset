import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/HRMSidebar';
import excel from '../assests/excel.png';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const RoleTable = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [newRoleDescription, setNewRoleDescription] = useState(''); // State for description
    const [newRoleAccess, setNewRoleAccess] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('UserId:', userId); // Check if userId is valid
        if (userId) {
            const fetchUserData = async () => {
                try {
                    console.log('Fetching data for userId:', userId); // Log before API call
                    const response = await axios.get(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log('API Response:', response); // Log the full API response
                    if (response.data) {
                        const user = response.data; // Directly use response.data because it's an object
                        console.log('User:', user); // Log the user object
                        setUserData(user); // Update state with user data
                    } else {
                        console.log('No user data found');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    },
        [token, userId]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        const token = localStorage.getItem('token');  // Retrieve the token
        try {
            const response = await axios.get('http://intranet.higherindia.net:3006/role', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Add token to headers
                }
            });
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleAddRole = async () => {
        const token = localStorage.getItem('token');  // Retrieve the token
        if (!newRoleName) {
            alert('Role name is required');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://intranet.higherindia.net:3006/role', {
                role: newRoleName,
                description: newRoleDescription,
                access: newRoleAccess,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Add token to headers
                }
            });
            setRoles([...roles, response.data.role]);
            setNewRoleName('');
            setNewRoleDescription('');
            setNewRoleAccess('');
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding role:', error);
            alert('Failed to add role.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');  // Retrieve the token
        try {
            await axios({
                method: 'delete',
                url: 'http://intranet.higherindia.net:3006/role',
                data: { id },
                headers: {
                    Authorization: `Bearer ${token}`,  // Add token to headers
                }
            });
            setRoles(roles.filter(role => role.role_id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting role:', error);
            alert('Failed to delete role.');
        }
    };

    const confirmDelete = (role) => {
        setRoleToDelete(role);
        setIsDeleteModalOpen(true);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(roles);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Roles');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Roles.xlsx');
    };

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
            navigate('/Role');
        } catch (error) {
            console.error('Token verification failed:', error.response ? error.response.data : error.message);
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            navigate('/');
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleHome = () => {
        navigate('/Cards');
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 w-full">
                {/* Header */}
                <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                    <button onClick={handleHome} className="flex items-center p-2 rounded-full ">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-2xl font-bold">Role</h1>
                    {userData && (
                        <div className="ml-auto flex items-center gap-4">
                            <div className="bg-white rounded-3xl p-2 flex items-center">
                                <h3 className="text-lg font-semibold text-black">
                                    {userData.first_name} {userData.last_name}
                                </h3>
                            </div>
                            <button onClick={handleLogout} className="bg-white flex items-center p-2 rounded-full ">
                                <FaSignOutAlt className="text-black mr-2" size={20} />
                            </button>
                        </div>
                    )}
                </div>
                {/* End */}

                <div className="flex justify-between mt-4">
                    <button onClick={() => setIsAddModalOpen(true)}
                        className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue">
                        Add Role
                    </button>
                    <button onClick={handleDownloadExcel} className="text-green-500">
                        <img src={excel} alt="logo" className="mr-5 w-8 h-8" />
                    </button>
                </div>

                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Add Role</h2>
                            {/* <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddRole();
                                }}>
                                <div className="mb-4">
                                    <label htmlFor="role">Role Name *</label>
                                    <input
                                        type="text"
                                        id="role"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Role Name"
                                        required
                                    />
                                </div>
                                <div className="flex">
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50' : ''}`}
                                        disabled={loading}>
                                        {loading ? 'Adding...' : 'Add Role'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-5">
                                        Cancel
                                    </button>
                                </div>
                            </form> */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddRole();
                                }}>
                                <div className="mb-4">
                                    <label htmlFor="role">Role Name *</label>
                                    <input
                                        type="text"
                                        id="role"
                                        value={newRoleName}
                                        onChange={(e) => setNewRoleName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Role Name"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        id="description"
                                        value={newRoleDescription}
                                        onChange={(e) => setNewRoleDescription(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Role Description"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="access">Access</label>
                                    <input
                                        type="text"
                                        id="access"
                                        value={newRoleAccess}
                                        onChange={(e) => setNewRoleAccess(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Role Access"
                                    />
                                </div>
                                <div className="flex">
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50' : ''}`}
                                        disabled={loading}>
                                        {loading ? 'Adding...' : 'Add Role'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-5">
                                        Cancel
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                            <p>
                                Are you sure you want to delete the role: <strong>{roleToDelete?.role}</strong>?
                            </p>
                            <div className="flex justify-between mt-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                    Cancel
                                </button>
                                <button onClick={() => handleDelete(roleToDelete.role_id)} className="bg-red-500 text-white px-4 py-2 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Role</th>
                                <th className="py-2 px-4 border-b">Description</th> {/* Added Description column */}
                                <th className="py-2 px-4 border-b">Access</th> {/* Added Access column */}
                                <th className="py-2 px-4 text-center border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role, index) => (
                                <tr key={index} className={`bg-${index % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                                    <td className="py-2 px-4 border-b">{role.role_id}</td>
                                    <td className="py-2 px-4 border-b">{role.role}</td>
                                    <td className="py-2 px-4 border-b">{role.description || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b">{role.access || 'N/A'}</td>
                                    <td className="py-2 px-4 text-center border-b">
                                        <button onClick={() => confirmDelete(role)} className="text-red-600">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default RoleTable;