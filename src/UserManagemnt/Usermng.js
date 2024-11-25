import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../Sidebar/HRMSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import excel from '../assests/excel.png';
import {
    validateFirstName,
    validateLastName,
    validatePhone,
    validateRole,
    validateEmail,
} from '../Components/validate';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const UserTable = () => {
    const [departments, setDepartments] = useState([]);
    const [managers] = useState([])
    const [domains, setDomains] = useState([]);
    const [locations, setLocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', color: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({
        first_name: null,
        last_name: null,
        phone_no: null,
        email: null,
        // password: null,
        dept_id: null,
        location: null,
        role: null,
        location_id: null,
        emp_id: null,
        user_status: null,
        desig_id: null,
        designation: null,
        manager_id: null,

    });
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_no: '',
        email: '',
        // password: '',
        location_id: '',
        dept_id: '',
        dept_name: '',
        role: '',
        location: '',
        emp_id: '',
        desig_id: '',
        designation: '',
        manager_id: '',
        user_status: 'active',
    });

    const handleDelete = async (user_id) => {
        try {
            const response = await fetch('http://higherindia.net:3006/users', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: 'DELETE',
                body: JSON.stringify({ id: user_id }),
            });
            const data = await response.json();
            if (data.message === 'Deleted successfully') {
                setUsers(users.filter(user => user.user_id !== user_id));
            } else {
                console.error('Unexpected response:', data);
                alert('Failed to delete user.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchDesignations();
        fetchLocation();
        fetchUsers();
        fetchDomains();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchDesignations = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/designation');
            setDesignations(response.data);
        } catch (error) {
            console.error('Error fetching designations:', error);
        }
    };

    const fetchLocation = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/loc');
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchDomains = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/domain');
            setDomains(response.data);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/users/getusers');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [id]: (() => {
                switch (id) {
                    case 'first_name':
                        return validateFirstName(value);
                    case 'last_name':
                        return validateLastName(value);
                    case 'phone_no':
                        return validatePhone(value);
                    case 'email':
                        return validateEmail(value);
                    case 'role':
                        return validateRole(value);
                    default:
                        return null;
                }
            })(),
        }));
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log(formData);  
        if (!isFormValid()) {
            setNotification({ message: 'Please provide all required details.', color: 'red' });
            return;
        }
        try {
            const selectedDept = departments.find(dept => dept.dept_id === formData.dept_id);
            const selectedLocation = locations.find(location => location.location_id === formData.location_id);
            const selectedDesignation = designations.find(designation => designation.desig_id === formData.desig_id);
            const selectedManager = managers.find(manager => manager.manager_id === formData.manager_id);
            const email = `${formData.email}${formData.email_part2}`
            // Payload to send to backend
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_no: formData.phone_no,
                email,
                dept_id: formData.dept_id,
                location: formData.location_id,
                emp_id: formData.emp_id,
                role: parseInt(formData.role, 10),
                designation: formData.desig_id,
                manager_id: parseInt(formData.manager_id, 10),
                user_status: formData.user_status,
            };
            console.log('Sending payload:', payload);
            const response = await axios.post('http://higherindia.net:3006/signup', payload);
            if (response.data.message === 'User registered successfully.') {
                setNotification({ message: 'Registration successful.', color: 'green' });
                setUsers((prevUsers) => [
                    ...prevUsers,
                    {
                        ...formData,
                        dept_id: formData.dept_id,
                        location: formData.location_id,
                        designation: formData.desig_id,
                        manager_id: formData.manager_id,
                    }
                ]);
                const user_id = response.data.userId;
                const leaveBalancePayload = {
                    user_id: user_id
                };
                const leaveBalanceResponse = await axios.post('http://higherindia.net:3006/leave/balance', leaveBalancePayload);
                console.log('Leave balance response:', leaveBalanceResponse.data);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else if (response.data.message === 'Email already exists.') {
                setNotification({ message: 'Email already exists.', color: 'red' });
            } else {
                setNotification({ message: 'Registration failed. Please try again.', color: 'red' });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                // if (error.response.data.message.includes('already exists')) {
                //     setError('Employee ID already exists. Please use a different ID.');
                // }
            }
        }
    };

    const isFormValid = () => {
        return (
            formData.first_name &&
            formData.last_name &&
            formData.phone_no &&
            formData.email &&
            formData.dept_id &&
            formData.emp_id &&
            formData.user_status &&
            formData.location_id &&
            formData.desig_id &&
            !Object.values(formErrors).some((error) => error !== null)
        );
    };

    const handleDepartmentChange = (e) => {
        const selectedDeptId = parseInt(e.target.value, 10);
        const selectedDept = departments.find(dept => dept.dept_id === selectedDeptId);
        setFormData({
            ...formData,
            dept_id: selectedDeptId,
            dept_name: selectedDept ? selectedDept.dept_name : '',
        });

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            dept_id: selectedDeptId ? null : 'Department is required.',
        }));
    };

    const handleDesignationChange = (e) => {
        const selectedDesignationId = parseInt(e.target.value, 10);
        const selectedDesignation = designations.find(designation => designation.desig_id === selectedDesignationId);
        setFormData({
            ...formData,
            desig_id: selectedDesignationId,
            designation: selectedDesignation ? selectedDesignation.designation : '',
        });
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            desig_id: selectedDesignationId ? null : 'Designation is required.',
        }));
    };

    const handleDomainChange = (e) => {
        const selectedDomainId = parseInt(e.target.value, 10);
        const selectedDomain = domains.find(domain => domain.dom_id === selectedDomainId);
        if (selectedDomain) {
            setFormData({
                ...formData,
                dom_id: selectedDomainId,
                email_part2: selectedDomain.domain_name,
            });
        } else {
            setFormData({
                ...formData,
                dom_id: '',
                email_part2: '', // Reset domain if not valid
            });
        }
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            email_part2: selectedDomainId ? null : 'Domain is required.',
        }));
    };

    const handleLocationChange = (e) => {
        const selectedLocationId = parseInt(e.target.value, 10);
        const selectedLocation = locations.find(location => location.location_id === selectedLocationId);
        setFormData({
            ...formData,
            location_id: selectedLocationId,
            location: selectedLocation ? selectedLocation.location : '',
        });
        setFormErrors((prevErrors) => ({
            ...prevErrors,
            location_id: selectedLocationId ? null : 'Location is required.',
        }));
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'User Data');

        // Create a buffer and save it as an Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'User Data.xlsx');
    };

    const handleStatusChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            user_status: value,
        }));
    };

    const handleEdit = async (userId) => {
        const response = await fetch(`http://higherindia.net:3006/users/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_no: formData.phone_no,
                email: formData.email,
                emp_id: formData.emp_id,
                manager_id: formData.manager_id,
                dept_id: formData.dept_id,
                desig_id: formData.desig_id,
                user_status: formData.user_status,
                location_id: formData.location_id,
            }),
        });
        const updatedUser = await response.json();
        setFormData(updatedUser);
        setIsModalOpen(true);
    };

    const handleEmailPart1Change = (e) => {
        const value = e.target.value;
        if (value.includes('@')) {
            setFormData((prevData) => ({
                ...prevData,
                email: value.split('@')[0] + '@',
                email_part2: prevData.email_part2
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                email: value
            }));
        }
    };

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
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(`http://higherindia.net:3006/users`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const managers = response.data.filter(user =>
                        user.designation && user.designation.toLowerCase() === 'manager'
                    );
                    console.log("Managers:", managers);
                    setUserData(managers);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUserData();
        }
    }, [userId, token]);

      useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                navigate('/');
                return;
            }
            try {
                const response = await axios.post('http://higherindia.net:3006/verify-token', { token });
                console.log('Token is valid:', response.data);
                navigate('/Usermng');
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
        <div className='flex'>
            <Sidebar />
            <div className='p-6 w-full'>
                {/*************************  Header Start  ******************************/}
                <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                    <button onClick={handleHome} className="flex items-center p-2 rounded-full ">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-2xl font-bold">Users</h1>
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
                {/*************************  Header End  ******************************/}
                <div className='justify-between flex'>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-2xl mb-4 mt-4 "
                    >
                        Add User
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="text-green-500 hover:text-green-500 items-center"
                    >
                        <img src={excel} alt="logo" className='mr-5 w-8 h-8' />
                    </button>
                </div>

                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-3xl w-[553px]">
                            {notification.message && (
                                <div
                                    className={`mb-4 p-3 text-center text-${notification.color}-500 bg-${notification.color}-100 border border-${notification.color}-300 rounded`}
                                >
                                    {notification.message}
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-bold mb-4">Add User</h2>
                            </div>

                            <form onSubmit={handleSignUp}>
                                {/* First Name and Last Name */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="first_name">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700  rounded-md p-2"
                                            placeholder="First Name"
                                        />
                                        {formErrors.first_name && (
                                            <span className="text-red-500">{formErrors.first_name}</span>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="last_name">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700  rounded-md p-2"
                                            placeholder="Last Name"
                                        />
                                        {formErrors.last_name && (
                                            <span className="text-red-500">{formErrors.last_name}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Phone Number and E-mail*/}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="phone_no">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="phone_no"
                                            value={formData.phone_no}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700  rounded-md p-2"
                                            placeholder="Phone Number"
                                        />
                                        {formErrors.phone_no && (
                                            <span className="text-red-500">{formErrors.phone_no}</span>
                                        )}
                                    </div>
                                    <div className='w-3/2 flex'>
                                        <div>
                                            <label htmlFor="email">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="email"
                                                value={formData.email}
                                                onChange={handleEmailPart1Change}
                                                className="w-full border border-gray-700 rounded-md p-2"
                                                placeholder="e.g., gaurav"
                                            />
                                            {formErrors.email && (
                                                <span className="text-red-500">{formErrors.email}</span>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="email_part2">
                                                Domain <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="dom_id"
                                                value={formData.dom_id}
                                                onChange={handleDomainChange}
                                                className="w-full border border-gray-700 rounded-md p-2 h-10"
                                            >
                                                <option value="">Select</option>
                                                {domains.map((domain) => (
                                                    <option key={domain.dom_id} value={domain.dom_id}>
                                                        {domain.domain_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.email_part2 && (
                                                <span className="text-red-500">{formErrors.email_part2}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Employee ID and Manager */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div >
                                        <label htmlFor="emp_id">
                                            Employee ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="emp_id"
                                            value={formData.emp_id}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700  rounded-md p-2"
                                            placeholder="Employee ID"
                                        />
                                        {formErrors.emp_id && (
                                            <span className="text-red-500">{formErrors.emp_id}</span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="manager_id">Manager <span className="text-red-500">*</span></label>
                                        <select
                                            id="manager_id"
                                            value={formData.manager_id}
                                            onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                        >
                                            <option value="">Select Manager</option>
                                            {userData.map((manager) => (
                                                <option key={manager.user_id} value={manager.user_id}>
                                                    {manager.first_name} {manager.last_name}
                                                </option>

                                            ))}
                                        </select>
                                        {formErrors.manager_id && (
                                            <span className="text-red-500">{formErrors.manager_id}</span>
                                        )}
                                    </div>

                                </div>
                                {/* Designation and Department*/}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="dept_id">Department <span className="text-red-500">*</span></label>
                                        <select
                                            id="dept_id"
                                            value={formData.dept_id}
                                            onChange={handleDepartmentChange}
                                            className="w-full border border-gray-700  rounded-md p-2"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.dept_id} value={dept.dept_id}>
                                                    {dept.dept_name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.dept_id && (
                                            <span className="text-red-500">{formErrors.dept_id}</span>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="desig_id">Designation <span className="text-red-500">*</span></label>
                                        <select
                                            id="desig_id"
                                            value={formData.desig_id}
                                            onChange={handleDesignationChange}
                                            className="w-full border border-gray-700  rounded-md p-2"
                                        >
                                            <option value="">Select Designation</option>
                                            {designations.map((designation) => (
                                                <option key={designation.desig_id} value={designation.desig_id}>
                                                    {designation.designation}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.designation_id && (
                                            <span className="text-red-500">{formErrors.designation_id}</span>
                                        )}
                                    </div>
                                </div>
                                {/*Status */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="location_id">Location <span className="text-red-500">*</span></label>
                                        <select
                                            id="location_id"
                                            value={formData.location_id} // Use location_id for the value
                                            onChange={handleLocationChange} // Handle location change
                                            className="w-full border border-gray-700  rounded-md p-2"
                                        >
                                            <option value="">Select Location</option>
                                            {locations.map((location) => (
                                                <option key={location.location_id} value={location.location_id}>
                                                    {location.locality}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.location_id && (
                                            <span className="text-red-500">{formErrors.location_id}</span>
                                        )}

                                    </div>
                                    <div >
                                        <label htmlFor="user_status">
                                            User Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <label className="mr-4">
                                                <input
                                                    type="radio"
                                                    name="user_status"
                                                    value="active"
                                                    checked={formData.user_status === "active"}
                                                    onChange={handleStatusChange}
                                                    className="mr-2"
                                                />
                                                Active
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name="user_status"
                                                    value="inactive"
                                                    checked={formData.user_status === "inactive"}
                                                    onChange={handleStatusChange}
                                                    className="mr-2"
                                                />
                                                Inactive
                                            </label>
                                        </div>
                                        {formErrors.user_status && (
                                            <span className="text-red-500">{formErrors.user_status}</span>
                                        )}
                                    </div>

                                </div>
                                {/* Submit Button */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="mt-4  text-gray-600 px-4 py-2 rounded-lg w-2/3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-2/3"
                                    >
                                        Add User
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/2">
                            <h2 className="text-xl mb-4">Edit User</h2>
                            <form onSubmit={handleSignUp}>
                                {/* Add form fields from your original code */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="first_name">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                            placeholder="First Name"
                                        />
                                        {formErrors.first_name && (
                                            <span className="text-red-500">{formErrors.first_name}</span>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="last_name">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                            placeholder="Last Name"
                                        />
                                        {formErrors.last_name && (
                                            <span className="text-red-500">{formErrors.last_name}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Submit and Cancel Buttons */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)} // Close modal
                                        className="mt-4 text-gray-600 px-4 py-2 rounded-lg w-2/3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-2/3"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto border-b">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                        <thead className=" text-black">
                            <tr>
                                <th className="py-2 px-4">Employee ID</th>
                                <th className="py-2 px-4">User Name</th>
                                <th className="py-2 px-4">Phone Number</th>
                                <th className="py-2 px-4">Email</th>
                                <th className="py-2 px-4">Department</th>
                                {/* <th className="py-2 px-4">User Role</th> */}
                                <th className="py-2 px-4">Location</th>
                                <th className="py-2 px-4">User Status</th>
                                <th className="py-2 px-4">Designation</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-4 text-center">No users found</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.email}>
                                        <td className="py-2 px-4">{user.emp_id}</td>
                                        <td className="py-2 px-4">{user.first_name} {user.last_name}</td>
                                        <td className="py-2 px-4">{user.phone_no}</td>
                                        <td className="py-2 px-4">{user.email}</td>
                                        <td className="py-2 px-4">{user.dept_name}</td>
                                        {/* <td className="px-4 py-2">{user.role}</td> */}
                                        <td className="py-2 px-4">{user.locality}</td>
                                        <td className="py-2 px-4">{user.user_status}</td>
                                        <td className="py-2 px-4">{user.designation}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                className="text-red-500 hover:text-red-700 mr-2"
                                                onClick={() => handleDelete(user.user_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            <button
                                                className="text-blue-500 hover:text-blue-700 mr-2"
                                                onClick={() => handleEdit(user.user_id)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default UserTable;
