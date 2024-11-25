import axios from 'axios';
import * as XLSX from 'xlsx';
import {
    validateFirstName,
    validateLastName,
    validatePhone,
    validateRole,
    validateEmail,
} from '../Components/validate';
import Header from './Usermng1';
import { saveAs } from 'file-saver';
import excel from '../assests/excel.png';
import Sidebar from '../Sidebar/HRMSidebar';
import SuccessModal from '../SuccessModal';
import UserDetailsPopup from './UserDetailsPop';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, } from '@fortawesome/free-solid-svg-icons';

const UserTable = () => {
    const [departments, setDepartments] = useState([]);
    const [subdepartments, setSubDepartments] = useState([]);
    const [managers] = useState([])
    const [domains, setDomains] = useState([]);
    const [success, setSuccess] = useState(false);
    const [locations, setLocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [designations, setDesignations] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', color: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredSubDepartments, setFilteredSubDepartments] = useState([]);
    const [formErrors, setFormErrors] = useState({
        first_name: null,
        last_name: null,
        phone_no: null,
        email: null,
        location: null,
        location_id: null,
        emp_id: null,
        user_status: null,
        desig_id: null,
        designation: null,
        manager_id: null,
        gender: null,
        manager_name: null,
        sub_id: null,
        dept_id: null,
    });
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_no: '',
        email: '',
        location_id: '',
        sub_id: '',
        dept_name: '',
        role: '',
        location: '',
        emp_id: '',
        desig_id: '',
        designation: '',
        manager_id: '',
        user_status: 'active',
        gender: '',
        dept_id: '',
    });
    const initialFormData = {
        first_name: '',
        last_name: '',
        phone_no: '',
        email: '',
        dom_id: '',
        emp_id: '',
        manager_id: '',
        dept_id: '',
        sub_id: '',
        location_id: '',
        gender: '',
        desig_id: '',
        user_status: '',
    };

    const handleDelete = async (user_id) => {
        try {
            const response = await fetch('http://intranet.higherindia.net:3006/users', {
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

    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchDepartments();
        fetchDesignations();
        fetchLocation();
        fetchUsers();
        fetchDomains();
        fetchSubDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }
            const response = await axios.get('http://intranet.higherindia.net:3006/departments', {
                headers: {
                    Authorization: `Bearer ${token}`  // Add the token to the Authorization header
                }
            });
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchSubDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }

            // Make a GET request to the sub-department API
            const response = await axios.get('http://intranet.higherindia.net:3006/sub_dept/sub_dept', {
                headers: {
                    Authorization: `Bearer ${token}` // Pass token in Authorization header
                }
            });

            // Set the sub-departments to state or handle as needed
            setSubDepartments(response.data); // Assuming response.data contains the list of sub-departments
        } catch (error) {
            console.error('Error fetching sub-departments:', error);
        }
    };

    const fetchDesignations = async () => {
        try {
            const token = localStorage.getItem('token');  // Retrieve the token from localStorage
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }

            const response = await axios.get('http://intranet.higherindia.net:3006/designation', {
                headers: {
                    Authorization: `Bearer ${token}`  
                }
            });
            setDesignations(response.data);
        } catch (error) {
            console.error('Error fetching designations:', error);
        }
    };

    const fetchLocation = async () => {
        try {
            const token = localStorage.getItem('token');  // Retrieve the token from localStorage
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }

            const response = await axios.get('http://intranet.higherindia.net:3006/loc', {
                headers: {
                    Authorization: `Bearer ${token}`  // Add the token to the Authorization header
                }
            });
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const fetchDomains = async () => {
        try {
            const token = localStorage.getItem('token');  // Retrieve the token from localStorage
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }

            const response = await axios.get('http://intranet.higherindia.net:3006/domain', {
                headers: {
                    Authorization: `Bearer ${token}`  // Add the token to the Authorization header
                }
            });
            setDomains(response.data);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }
            const response = await axios.get('http://intranet.higherindia.net:3006/users/getusers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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

    // const handleSignUp = async (e) => {
    //     e.preventDefault();
    //     console.log(formData);
    //     if (!isFormValid()) {
    //         setNotification({ message: 'Please provide all required details.', color: 'red' });
    //         return;
    //     }
    //     try {
    //         const selectedDept = subdepartments.find(dept => dept.sub_id === formData.sub_id);
    //         const selectedDept1 = departments.find(dept => dept.dept_id === formData.dept_id);
    //         const selectedLocation = locations.find(location => location.location_id === formData.location_id);
    //         const selectedDesignation = designations.find(designation => designation.desig_id === formData.desig_id);
    //         const selectedManager = managers.find(manager => manager.manager_id === formData.manager_id);
    //         const email = `${formData.email}@${formData.email_part2}`;

    //         // Payload to send to backend
    //         const payload = {
    //             first_name: formData.first_name,
    //             last_name: formData.last_name,
    //             phone_no: formData.phone_no,
    //             email,
    //             sub_id: formData.sub_id,
    //             dept_id: formData.dept_id,
    //             location: formData.location_id,
    //             emp_id: formData.emp_id,
    //             gender: formData.gender,
    //             designation: formData.desig_id,
    //             manager_id: parseInt(formData.manager_id, 10),
    //             user_status: formData.user_status,
    //         };
    //         console.log('Sending payload:', payload);
    //         // First API call for registration
    //         const response = await axios.post('http://intranet.higherindia.net:3006/signup', payload, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         if (response.data.message === 'User registered successfully.') {
    //             setNotification({ message: 'Registration successful.', color: 'green' });
    //             setUsers((prevUsers) => [
    //                 ...prevUsers,
    //                 {
    //                     ...formData,
    //                     sub_id: formData.sub_id,
    //                     dept_id: formData.dept_id,
    //                     location: formData.location_id,
    //                     designation: formData.desig_id,
    //                     manager_id: formData.manager_id,
    //                 }
    //             ]);

    //             const user_id = response.data.userId;
    //             const leaveBalancePayload = { user_id };

    //             // Second API call for leave balance
    //             const leaveBalanceResponse = await axios.post('http://intranet.higherindia.net:3006/leave/balance', leaveBalancePayload, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`, // Include token here
    //                 },
    //             });

    //             console.log('Leave balance response:', leaveBalanceResponse.data);

    //         } else if (response.data.message === 'Email already exists.') {
    //             setNotification({ message: 'Email already exists.', color: 'red' });
    //         } else {
    //             setNotification({ message: 'Registration failed. Please try again.', color: 'red' });
    //         }
    //         setSuccess(true);  // Set success to true

    //     } catch (error) {
    //         console.error('Error during registration:', error);
    //         if (error.response) {
    //             console.error('Error response data:', error.response.data);
    //         }
    //         setSuccess(false); 

    //     }
    // };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const errors = {};
        let allFieldsEmpty = true;

        // Validate First Name
        if (!formData.first_name.trim()) {
            errors.first_name = "First Name is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Last Name
        if (!formData.last_name.trim()) {
            errors.last_name = "Last Name is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Phone Number
        if (!formData.phone_no.trim()) {
            errors.phone_no = "Phone Number is required.";
        } else if (!/^\d{10}$/.test(formData.phone_no.trim())) {
            errors.phone_no = "Phone Number must be 10 digits.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Email
        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else {
            allFieldsEmpty = false;
        }

        if (!formData.email_part2) {
            errors.email_part2 = "Email domain is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Employee ID
        if (!formData.emp_id.trim()) {
            errors.emp_id = "Employee ID is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Manager
        if (!formData.manager_id) {
            errors.manager_id = "Manager selection is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Department
        if (!formData.dept_id) {
            errors.dept_id = "Department is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Sub-Department
        if (!formData.sub_id) {
            errors.sub_id = "Verticals selection is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Location
        if (!formData.location_id) {
            errors.location_id = "Location is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Gender
        if (!formData.gender.trim()) {
            errors.gender = "Gender is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate Designation
        if (!formData.desig_id) {
            errors.desig_id = "Designation is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Validate User Status
        if (!formData.user_status.trim()) {
            errors.user_status = "User status is required.";
        } else {
            allFieldsEmpty = false;
        }

        // Set global error if all fields are empty
        if (allFieldsEmpty) {
            setFormErrors({ global: "All fields are required." });
            return;
        }
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        try {
            const email = `${formData.email}@${formData.email_part2}`;

            // Payload to send to backend
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_no: formData.phone_no,
                email,
                sub_id: formData.sub_id,
                dept_id: formData.dept_id,
                location: formData.location_id,
                emp_id: formData.emp_id,
                gender: formData.gender,
                designation: formData.desig_id,
                manager_id: parseInt(formData.manager_id, 10),
                user_status: formData.user_status,
            };

            console.log("Sending payload:", payload);

            const response = await axios.post('http://intranet.higherindia.net:3006/signup', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === 'User registered successfully.') {
                setNotification({ message: 'Registration successful.', color: 'green' });

                setUsers((prevUsers) => [
                    ...prevUsers,
                    {
                        ...formData,
                        sub_id: formData.sub_id,
                        dept_id: formData.dept_id,
                        location: formData.location_id,
                        designation: formData.desig_id,
                        manager_id: formData.manager_id,
                    },
                ]);

                const leaveBalancePayload = { user_id: response.data.userId };
                const leaveBalanceResponse = await axios.post(
                    'http://intranet.higherindia.net:3006/leave/balance',
                    leaveBalancePayload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('Leave balance response:', leaveBalanceResponse.data);
            } else if (response.data.message === 'Email already exists.') {
                setNotification({ message: 'Email already exists.', color: 'red' });
            } else {
                setNotification({ message: 'Registration failed. Please try again.', color: 'red' });
            }
        } catch (error) {
            console.error('Error during registration:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
            setNotification({ message: 'An error occurred. Please try again later.', color: 'red' });
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user); // Set the selected user's details
        setIsPopupOpen(true); // Open the popup
    };

    const closePopup = () => {
        setIsPopupOpen(false); // Close the popup
        setSelectedUser(null); // Clear the selected user
    };

    const isFormValid = () => {
        return (
            formData.first_name &&
            formData.last_name &&
            formData.phone_no &&
            formData.email &&
            formData.sub_id &&
            formData.dept_id &&
            formData.emp_id &&
            formData.user_status &&
            formData.location_id &&
            formData.desig_id &&
            formData.gender &&
            !Object.values(formErrors).some((error) => error !== null)
        );
    };

    const handleDepartmentChange = (e) => {
        const selectedDeptId = e.target.value;
        setFormData({
            ...formData,
            dept_id: selectedDeptId,
            sub_id: "",
        });
        const filtered = subdepartments.filter(
            (subDept) => subDept.dept_id === parseInt(selectedDeptId)
        );
        setFilteredSubDepartments(filtered);
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

    // const handleEdit = async (userId) => {
    //     const token = localStorage.getItem('token');
    //     const response = await fetch(`http://intranet.higherindia.net:3006/users`, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({
    //             first_name: formData.first_name,
    //             last_name: formData.last_name,
    //             phone_no: formData.phone_no,
    //             email: formData.email,
    //             emp_id: formData.emp_id,
    //             manager_id: formData.manager_id,
    //             sub_id: formData.sub_id,
    //             dept_id: formData.dept_id,
    //             desig_id: formData.desig_id,
    //             user_status: formData.user_status,
    //             location_id: formData.location_id,
    //             gender: formData.gender,
    //         }),
    //     });
    //     const updatedUser = await response.json();
    //     setFormData(updatedUser);
    //     setIsModalOpen(true);
    // };

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

    const resetFormData = () => {
        setFormData(initialFormData);
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
        if (userId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://intranet.higherindia.net:3006/users', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log("All Users:", response.data);
                    setUserData(response.data);
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
                const response = await axios.post('http://intranet.higherindia.net:3006/verify-token', { token });
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
    //END 

    return (
        <div className='flex'>
            <Sidebar />
            <div className='p-6 w-full'>
                <Header />

                <div className='justify-between flex mt-3'>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue "
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
                            {formErrors.global && <div className="error-message bg-red-300 text-red-500 text-[14px] items-center mb-4 p-3 text-center border rounded">{formErrors.global}</div>}

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
                                            <span className="text-red-500 text-[10px]">{formErrors.first_name}</span>
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
                                            <span className="text-red-500 text-[10px]">{formErrors.last_name}</span>
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
                                            <span className="text-red-500 text-[10px]">{formErrors.phone_no}</span>
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
                                                <span className="text-red-500 text-[10px]">{formErrors.email}</span>
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
                                                <span className="text-red-500 text-[10px]">{formErrors.email_part2}</span>
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
                                            <span className="text-red-500 text-[10px]">{formErrors.emp_id}</span>
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
                                            <span className="text-red-500 text-[10px]">{formErrors.manager_id}</span>
                                        )}
                                    </div>

                                </div>
                                {/* Department and Sub-Department */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="dept_id">
                                            Department <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="dept_id"
                                            value={formData.dept_id}
                                            onChange={handleDepartmentChange}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.dept_id} value={dept.dept_id}>
                                                    {dept.dept_name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.dept_id && <span className="text-red-500 text-[10px]">{formErrors.dept_id}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="sub_id">
                                            Verticals <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="sub_id"
                                            value={formData.sub_id}
                                            onChange={(e) => setFormData({ ...formData, sub_id: e.target.value })}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                            disabled={!formData.dept_id}
                                        >
                                            <option value="">Select Verticals</option>
                                            {filteredSubDepartments.length > 0 ? (
                                                filteredSubDepartments.map((subDept) => (
                                                    <option key={subDept.sub_id} value={subDept.sub_id}>
                                                        {subDept.sub_dept_name}
                                                    </option>
                                                ))
                                            ) : formData.dept_id ? (
                                                <option value="">No verticals available</option>
                                            ) : (
                                                <option value="">Please select a department first</option>
                                            )}


                                        </select>
                                        {formErrors.sub_id && <span className="text-red-500 text-[10px]">{formErrors.sub_id}</span>}
                                    </div>
                                </div>
                                {/*Gender and Location*/}
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
                                            <span className="text-red-500 text-[10px]">{formErrors.location_id}</span>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="gender">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="gender"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                        {formErrors.gender && (
                                            <span className="text-red-500 text-10px">{formErrors.gender}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Designation And Status */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
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
                                            <span className="text-red-500 text-[10px]">{formErrors.designation_id}</span>
                                        )}
                                    </div>
                                    <div >
                                        <label htmlFor="user_status">
                                            User Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <label className="mr-4 mt-2">
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
                                            <label className='mt-2'>
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
                                            <span className="text-red-500 text-[10px]">{formErrors.user_status}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Submit Button */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <button
                                        onClick={() => {
                                            setFormData({
                                                first_name: '',
                                                last_name: '',
                                                phone_no: '',
                                                email: '',
                                                emp_id: '',
                                                manager_id: '',
                                                dept_id: '',
                                                sub_id: '',
                                                location_id: '',
                                                gender: '',
                                                desig_id: '',
                                                user_status: '',
                                                dom_id: ''
                                            });
                                            setFormErrors({});
                                            setIsAddModalOpen(false);
                                        }}
                                        className="mt-4 bg-gray-500  text-white px-4 py-2 rounded-lg w-2/3 ml-5  "
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg w-2/3 ml-10"
                                    >
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <SuccessModal
                    success={success}
                    setSuccess={setSuccess}
                    message="Domain Added Successfully!"
                />

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-3xl w-[553px]">
                            <h2 className="text-xl font-bold mb-4">Edit User</h2>
                            <form>
                                {/* First Name and Last Name */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
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
                                {/* Department and Sub-Department */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="dept_id">
                                            Department <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="dept_id"
                                            value={formData.dept_id}
                                            onChange={handleDepartmentChange}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.dept_id} value={dept.dept_id}>
                                                    {dept.dept_name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.dept_id && <span className="text-red-500">{formErrors.dept_id}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="sub_id">
                                            Verticals <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="sub_id"
                                            value={formData.sub_id}
                                            onChange={(e) => setFormData({ ...formData, sub_id: e.target.value })}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                            disabled={!formData.dept_id}
                                        >
                                            <option value="">Select Verticals</option>
                                            {filteredSubDepartments.length > 0 ? (
                                                filteredSubDepartments.map((subDept) => (
                                                    <option key={subDept.sub_id} value={subDept.sub_id}>
                                                        {subDept.sub_dept_name}
                                                    </option>
                                                ))
                                            ) : formData.dept_id ? (
                                                <option value="">No verticals available</option>
                                            ) : (
                                                <option value="">Please select a department first</option>
                                            )}


                                        </select>
                                        {formErrors.sub_id && <span className="text-red-500">{formErrors.sub_id}</span>}
                                    </div>
                                </div>
                                {/*Gender and Location*/}
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
                                    <div>
                                        <label htmlFor="gender">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="gender"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                        {formErrors.gender && (
                                            <span className="text-red-500">{formErrors.gender}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Designation And Status */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
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
                                    <div >
                                        <label htmlFor="user_status">
                                            User Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <label className="mr-4 mt-2">
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
                                            <label className='mt-2'>
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
                                <div className="flex justify-center items-center mt-6">
                                    <button
                                        className="bg-blue-600 text-white p-2 w-full rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white p-2 w-full rounded-md"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-3xl w-[553px]">
                            <h2 className="text-xl font-bold mb-4">Edit User</h2>
                            <form>
                                {/* First Name and Last Name */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="first_name">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="first_name"
                                            value={selectedUser.first_name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                            placeholder="First Name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="last_name">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="last_name"
                                            value={selectedUser.last_name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                            placeholder="Last Name"
                                        />
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
                                            value={selectedUser.phone_no}
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
                                                value={selectedUser.email}
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
                                            value={selectedUser.emp_id}
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
                                            value={selectedUser.manager_id}
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
                                {/* Department and Sub-Department */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="dept_id">
                                            Department <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="dept_id"
                                            value={selectedUser.dept_id}
                                            onChange={handleDepartmentChange}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.dept_id} value={dept.dept_id}>
                                                    {dept.dept_name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.dept_id && <span className="text-red-500">{formErrors.dept_id}</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="sub_id">
                                            Verticals <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="sub_id"
                                            value={selectedUser.sub_id}
                                            onChange={(e) => setFormData({ ...formData, sub_id: e.target.value })}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                            disabled={!formData.dept_id}
                                        >
                                            <option value="">Select Verticals</option>
                                            {filteredSubDepartments.length > 0 ? (
                                                filteredSubDepartments.map((subDept) => (
                                                    <option key={subDept.sub_id} value={subDept.sub_id}>
                                                        {subDept.sub_dept_name}
                                                    </option>
                                                ))
                                            ) : formData.dept_id ? (
                                                <option value="">No verticals available</option>
                                            ) : (
                                                <option value="">Please select a department first</option>
                                            )}


                                        </select>
                                        {formErrors.sub_id && <span className="text-red-500">{formErrors.sub_id}</span>}
                                    </div>
                                </div>
                                {/*Gender and Location*/}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="location_id">Location <span className="text-red-500">*</span></label>
                                        <select
                                            id="location_id"
                                            value={selectedUser.location_id} // Use location_id for the value
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
                                    <div>
                                        <label htmlFor="gender">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="gender"
                                            value={selectedUser.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            className="w-full border border-gray-700 rounded-md p-2"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                        {formErrors.gender && (
                                            <span className="text-red-500">{formErrors.gender}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Designation And Status */}
                                <div className="grid gap-4 mb-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="desig_id">Designation <span className="text-red-500">*</span></label>
                                        <select
                                            id="desig_id"
                                            value={selectedUser.desig_id}
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
                                    <div >
                                        <label htmlFor="user_status">
                                            User Status <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex items-center">
                                            <label className="mr-4 mt-2">
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
                                            <label className='mt-2'>
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
                                <div className="flex justify-center items-center mt-6">
                                    <button
                                        className="bg-blue-600 text-white p-2 w-full rounded-md"
                                        onClick={() => setIsModalOpen(false)} // close the modal on cancel
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white p-2 w-full rounded-md"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/***************  USER TABLE ************/}
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4">S.no.</th>
                                <th className="py-2 px-4">Employee ID</th>
                                <th className="py-2 px-4">User Name</th>
                                <th className="py-2 px-4">Phone Number</th>
                                <th className="py-2 px-4">Email</th>
                                <th className="py-2 px-4">Department</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="py-4 text-center">No users found</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={index} className={`bg-${index % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4">{user.emp_id}</td>
                                        <td
                                            className="p-4 text-blue-500 cursor-pointer underline"
                                            onClick={() => handleUserClick(user)}
                                        >
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td className="p-4">{user.phone_no}</td>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">{user.dept_name || 'No Department'}</td>
                                        <td className="p-4">
                                            <button
                                                className="text-red-500 hover:text-red-700 mr-2"
                                                onClick={() => handleDelete(user.user_id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            <button
                                                className="text-blue-500 hover:text-blue-700 mr-2"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsModalOpen(true);
                                                }}
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

                {isPopupOpen && (
                    <UserDetailsPopup user={selectedUser} onClose={closePopup} />
                )}

            </div>
        </div>
    );
};
export default UserTable;
