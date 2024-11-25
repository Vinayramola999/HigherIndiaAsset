import axios from 'axios';
import Modal from 'react-modal';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../Sidebar/HRMSidebar';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from "../ProfileDropdown";
import React, { useState, useEffect } from 'react';
Modal.setAppElement('#root');
const UpdateAccess = () => {
    const [emails, setEmails] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [apiAccess, setApiAccess] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    // Check if a contact API is selected
    const isContactApiSelected = (apiName) => selectedContactApis.includes(apiName);

    const [isAsmChecked, setIsAsmChecked] = useState(false);
    const [isUCSChecked, setIsUCSChecked] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCustomerApis, setSelectedCustomerApis] = useState([]);
    const [selectedContactApis, setSelectedContactApis] = useState([]);
    const [hasAmsAccess, setHasAmsAccess] = useState(false);
    const [isCrmChecked, setIsCrmChecked] = useState(false);

    const [selectedApis, setSelectedApis] = useState([]);

    //CRM's Customer Info 
    const [isCreateCustomer, setIsCreateCustomer] = useState(false);
    const [isEditCustomer, setIsEditCustomer] = useState(false);
    const [isDeleteCustomer, setIsDeleteCustomer] = useState(false);
    const [isAllCustomer, setIsAllCustomer] = useState(false);

    //CRM's Contact Info
    const [isCreateContact, setIsCreateContact] = useState(false);
    const [isEditContact, setIsEditContact] = useState(false);
    const [isDeleteContact, setIsDeleteContact] = useState(false);
    const [isAllContact, setIsAllContact] = useState(false);

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get('http://intranet.higherindia.net:3006/users/email_users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setEmails(response.data);
            } catch (error) {
                showModal('Error fetching emails.');
            }
        };
        fetchEmails();
    }, []);

    const handleEmailChange = async (e) => {
        const userId = e.target.value;
        setSelectedEmail(userId);
        if (userId) {
            try {
                // Fetch API access
                const response = await axios.get('http://intranet.higherindia.net:3006/access', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const filteredAccess = response.data.filter(access => access.user_id === parseInt(userId));
                const apiAccessNames = filteredAccess.map(access => access.api_name);
                setApiAccess(apiAccessNames);
                setHasAmsAccess(apiAccessNames.includes('update_access'));
                setIsCrmChecked(apiAccessNames.includes('CRM'));
                setIsCreateCustomer(apiAccessNames.includes('create_customer'));
                setIsEditCustomer(apiAccessNames.includes('update_customer'));
                setIsDeleteCustomer(apiAccessNames.includes('delete_customer'));
                setIsAllCustomer(apiAccessNames.includes('all_customer'));
                setIsCreateContact(apiAccessNames.includes('create_contact'));
                setIsEditContact(apiAccessNames.includes('update_contact'));
                setIsDeleteContact(apiAccessNames.includes('delete_contact'));
                setIsAllContact(apiAccessNames.includes('all_contact'));
                setIsAsmChecked(apiAccessNames.includes('ASM'));
                setIsUCSChecked(apiAccessNames.includes('UCS'));
                const roleResponse = await axios.get(`http://intranet.higherindia.net:3006/role`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const userRoles = roleResponse.data.map(role => role.role_id);
                setSelectedRoles(userRoles);
            } catch (error) {
                showModal('Error fetching data for the selected user.');
            }
        } else {
            setApiAccess([]);
            setHasAmsAccess(false);
            setIsCrmChecked(false);
            setIsAsmChecked(false);
            setIsUCSChecked(false);
            setSelectedRoles([]);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://intranet.higherindia.net:3006/role', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Error fetching roles.');
                }
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                showModal('Error fetching roles.');
            }
        };

        fetchRoles();
    }, []);

    const permissionMap = {
        CRM: setIsCrmChecked,
        create_customer: setIsCreateCustomer,
        update_customer: setIsEditCustomer,
        delete_customer: setIsDeleteCustomer,
        all_customer: setIsAllCustomer,
        create_contact: setIsCreateContact,
        update_contact: setIsEditContact,
        delete_contact: setIsDeleteContact,
        all_contact: setIsAllContact,
        ASM: setIsAsmChecked,
        UCS: setIsUCSChecked,

    };
    const handleApiAccessChange = async (apiName) => {
        // Special case for 'update_access' API
        if (apiName === 'update_access') {
            setHasAmsAccess((prev) => !prev);
            // If toggling on 'update_access', make an API call
            if (!hasAmsAccess) {
                try {
                    const response = await axios.get('http://intranet.higherindia.net:3006/access', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    console.log("API response for 'update_access':", response.data);
                } catch (error) {
                    console.error('Error updating API access for update_access:', error.response ? error.response.data : error.message);
                    showModal('Error updating API access for update_access.');
                }
            }
        } else {
            setApiAccess((prev) =>
                prev.includes(apiName)
                    ? prev.filter((name) => name !== apiName) // Remove API if it’s already selected
                    : [...prev, apiName] // Add API if it’s not already selected
            );

            try {
                if (!apiAccess.includes(apiName)) {
                    const response = await axios.get('http://intranet.higherindia.net:3006/access', {
                        params: {
                            user_id: selectedEmail,
                            api_name: apiName,
                        },
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    console.log(`API response for '${apiName}':`, response.data);

                    // Toggle the specific permission using `permissionMap` if available
                    if (permissionMap[apiName]) {
                        permissionMap[apiName]((prev) => !prev);
                    }
                }
            } catch (error) {
                console.error(`Error updating API access for ${apiName}:`, error.response ? error.response.data : error.message);
                showModal(`Error updating API access for ${apiName}.`);
            }
        }
    };

    const handleRoleChange = (roleId) => {
        setSelectedRoles((prevSelectedRoles) =>
            prevSelectedRoles.includes(roleId)
                ? prevSelectedRoles.filter((id) => id !== roleId)
                : [...prevSelectedRoles, roleId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            showModal('Token does not exist.');
            return;
        }
        const selectedApiAccess = [];
        if (isCrmChecked) selectedApiAccess.push('CRM');
        if (isCreateCustomer) selectedApiAccess.push('create_customer');
        if (isEditCustomer) selectedApiAccess.push('update_customer');
        if (isDeleteCustomer) selectedApiAccess.push('delete_customer');
        if (isAllCustomer) selectedApiAccess.push('all_customer');
        if (isCreateContact) selectedApiAccess.push('create_contact');
        if (isEditContact) selectedApiAccess.push('update_contact');
        if (isDeleteContact) selectedApiAccess.push('delete_contact');
        if (isAllContact) selectedApiAccess.push('all_contact');

        if (isAsmChecked) selectedApiAccess.push('ASM');
        if (isUCSChecked) selectedApiAccess.push('UCS');
        // Add any other selected values as needed

        try {
            const response = await axios.put(
                'http://intranet.higherindia.net:3006/access/update_access',
                {
                    user_id: selectedEmail,
                    api_access: selectedApiAccess,  // Send only the selected values
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                showModal('User Updated Successfully!');
            } else if (response.data.error === "User not found. Please check the email entered.") {
                showModal('User not found. Please check the email entered.');
            } else {
                showModal(`Error: ${response.data.error}`);
            }
        } catch (error) {
            const { response } = error;
            if (response) {
                if (response.status === 403) {
                    showModal('You do not have permission to perform this action.');
                } else if (response.status === 404) {
                    showModal('User not found. Please check the email entered.');
                } else {
                    showModal('Error updating API access.');
                }
            } else {
                showModal('Error updating API access.');
            }
        }
    };

    const addUser = () => {
        navigate('/Signup');
    };

    const back = () => {
        navigate('/HRMS');
    };

    const showModal = (message) => {
        setModalMessage(message);
        setIsModalOpen(true);
    };

    const customerApis = [
        { name: 'create_customer', label: 'Add Customer' },
        { name: 'update_customer', label: 'Update Customer' },
        { name: 'delete_customer', label: 'Delete Customer' },
        { name: 'all_customer', label: 'View Customers' },
    ];

    const handleCrmCheckboxChange = () => {
        setIsCrmChecked(!isCrmChecked);
        if (!isCrmChecked) {
            setSelectedApis(prev => [...prev, ...customerApis.map(api => api.name)]);
        } else {
            setSelectedApis(prev => prev.filter(api => !customerApis.map(a => a.name).includes(api)));
        }
    };

    const isCustomerApiSelected = (apiName) => selectedApis.includes(apiName);

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
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
                navigate('/AMS1');
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
                    <h1 className="text-white text-2xl font-bold">Access Privilege</h1>
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

                <div className="flex justify-between mt-4">
                    <button
                        className="bg-gray-700 text-white px-4 py-2 rounded-2xl"
                        onClick={addUser}
                    >
                        Add User
                    </button>
                </div>

                <div className=" ml-[61%] w-[50%] fixed">
                    {isDropdownOpen && <ProfileDropdown className="absolute z-10" />}
                </div>

                <div className='position-fixed'>
                    <div className="bg-white ">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col mt-5 ml-5 w-[200px]">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 mt-5">
                                    Select Email:
                                </label>
                                <select
                                    id="email"
                                    value={selectedEmail}
                                    onChange={handleEmailChange}
                                    required
                                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select an email</option>
                                    {emails.map((user, index) => (
                                        <option key={index} value={user.user_id}>
                                            {user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex'>
                                <div className="w-1/2 border-solid border-gray-300 rounded-lg p-4 overflow-y-auto h-[450px]">
                                    {/* CRM Section */}
                                    <div className="mt-[2%]">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                onChange={handleCrmCheckboxChange}
                                                checked={isCrmChecked}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-blue-600 text-lg font-bold ml-5">CRM</span>
                                        </label>
                                    </div>

                                    {/* Customer's Info under CRM */}
                                    {isCrmChecked && (
                                        <div className="ml-5 mt-[2%]">
                                            <h2 className="text-blue-600 text-[16px] font-medium">Customer's Info:</h2>
                                            <div className="ml-5">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsCreateCustomer(!isCreateCustomer)}
                                                        checked={isCreateCustomer}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">Create Customer</span>
                                                </label>
                                                <label className="flex items-center mt-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsEditCustomer(!isEditCustomer)}
                                                        checked={isEditCustomer}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">Edit Customer</span>
                                                </label>
                                                <label className="flex items-center mt-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsDeleteCustomer(!isDeleteCustomer)}
                                                        checked={isDeleteCustomer}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">Delete Customer</span>
                                                </label>
                                                <label className="flex items-center mt-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsAllCustomer(!isAllCustomer)}
                                                        checked={isAllCustomer}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">View All Customers</span>
                                                </label>
                                            </div>

                                            {/* Customer's Contact under CRM */}
                                            <h2 className="text-blue-600 text-[16px] font-medium mt-4">Customer's Contact:</h2>
                                            <div className="ml-5">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsCreateContact(!isCreateContact)}
                                                        checked={isCreateContact}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">Create Contact</span>
                                                </label>
                                                <label className="flex items-center mt-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsEditContact(!isEditContact)}
                                                        checked={isEditContact}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">Edit Contact</span>
                                                </label>
                                                <label className="flex items-center mt-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsDeleteContact(!isDeleteContact)}
                                                        checked={isDeleteContact}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">Delete Contact</span>
                                                </label>
                                                <label className="flex items-center mt-2">
                                                    <input
                                                        type="checkbox"
                                                        onChange={() => setIsAllContact(!isAllContact)}
                                                        checked={isAllContact}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <span className="ml-2">View All Contacts</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none"
                                >
                                    Submit
                                </button>
                                <button
                                    onClick={back}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md ml-4 focus:outline-none"
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </div>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="Modal"
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                            <h2 className="text-lg font-bold mb-4">{modalMessage}</h2>
                            <button
                                onClick={closeModal}
                                className="bg-blue-600 hover:bg-blue-700 ml-[35%] text-white font-bold py-2 px-4 rounded focus:outline-none"
                            >
                                Okay
                            </button>
                        </div>
                    </Modal>
                </div>
            </div >
        </div >
    );
};
export default UpdateAccess;



// import axios from 'axios';
// import Modal from 'react-modal';
// import { FaHome, FaSignOutAlt } from 'react-icons/fa';
// import Sidebar from '../Sidebar/HRMSidebar';
// import { useNavigate } from 'react-router-dom';
// import ProfileDropdown from "../ProfileDropdown";
// import React, { useState, useEffect } from 'react';
// Modal.setAppElement('#root');
// const UpdateAccess = () => {
//     const [emails, setEmails] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [selectedRoles, setSelectedRoles] = useState([]);
//     const [selectedEmail, setSelectedEmail] = useState('');
//     const [apiAccess, setApiAccess] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalMessage, setModalMessage] = useState('');
//     // Check if a contact API is selected
//     const isContactApiSelected = (apiName) => selectedContactApis.includes(apiName);

//     const [isAsmChecked, setIsAsmChecked] = useState(false);
//     const [isUCSChecked, setIsUCSChecked] = useState(false);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [selectedCustomerApis, setSelectedCustomerApis] = useState([]);
//     const [selectedContactApis, setSelectedContactApis] = useState([]);
//     const [hasAmsAccess, setHasAmsAccess] = useState(false);
//     const [isCrmChecked, setIsCrmChecked] = useState(false);

//     const [selectedApis, setSelectedApis] = useState([]);

//     //CRM's Customer Info 
//     const [isCreateCustomer, setIsCreateCustomer] = useState(false);
//     const [isEditCustomer, setIsEditCustomer] = useState(false);
//     const [isDeleteCustomer, setIsDeleteCustomer] = useState(false);
//     const [isAllCustomer, setIsAllCustomer] = useState(false);

//     //CRM's Contact Info
//     const [isCreateContact, setIsCreateContact] = useState(false);
//     const [isEditContact, setIsEditContact] = useState(false);
//     const [isDeleteContact, setIsDeleteContact] = useState(false);
//     const [isAllContact, setIsAllContact] = useState(false);


//     const [isUserChecked, setIsUserChecked] = useState(false);
//     const [isAdminChecked, setIsAdminChecked] = useState(false);
//     const [isApproverChecked, setIsApproverChecked] = useState(false);
//     const [isInitiatorChecked, setIsInitiatorChecked] = useState(false);
//     const [isSuperChecked, setIsSuperChecked] = useState(false);

//     useEffect(() => {
//         const fetchEmails = async () => {
//             try {
//                 const response = await axios.get('http://intranet.higherindia.net:3006/users/email_users', {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 setEmails(response.data);
//             } catch (error) {
//                 showModal('Error fetching emails.');
//             }
//         };
//         fetchEmails();
//     }, []);

//     const handleEmailChange = async (e) => {
//         const userId = e.target.value;
//         setSelectedEmail(userId);
//         if (userId) {
//             try {
//                 // Fetch API access
//                 const response = await axios.get('http://intranet.higherindia.net:3006/access', {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 const filteredAccess = response.data.filter(access => access.user_id === parseInt(userId));
//                 const apiAccessNames = filteredAccess.map(access => access.api_name);
//                 setApiAccess(apiAccessNames);
//                 setHasAmsAccess(apiAccessNames.includes('update_access'));
//                 setIsCrmChecked(apiAccessNames.includes('CRM'));
//                 setIsCreateCustomer(apiAccessNames.includes('create_customer'));
//                 setIsEditCustomer(apiAccessNames.includes('edit_customer'));
//                 setIsDeleteCustomer(apiAccessNames.includes('delete_cutomer'));
//                 setIsAllCustomer(apiAccessNames.includes('all_customer'));
//                 setIsCreateContact(apiAccessNames.includes('create_contact'));
//                 setIsEditContact(apiAccessNames.includes('edit_contact'));
//                 setIsDeleteContact(apiAccessNames.includes('delete_contact'));
//                 setIsAllContact(apiAccessNames.includes('all_contact'));
//                 setIsAsmChecked(apiAccessNames.includes('ASM'));
//                 setIsUCSChecked(apiAccessNames.includes('UCS'));
//                 const roleResponse = await axios.get(`http://intranet.higherindia.net:3006/role`, {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 const userRoles = roleResponse.data.map(role => role.role_id);
//                 setSelectedRoles(userRoles);
//             } catch (error) {
//                 showModal('Error fetching data for the selected user.');
//             }
//         } else {
//             setApiAccess([]);
//             setHasAmsAccess(false);
//             setIsCrmChecked(false);
//             setIsAsmChecked(false);
//             setIsUCSChecked(false);
//             setSelectedRoles([]);
//         }
//     };

//     const toggleDropdown = () => {
//         setIsDropdownOpen((prev) => !prev);
//     };

//     useEffect(() => {
//         const fetchRoles = async () => {
//             try {
//                 const response = await fetch('http://intranet.higherindia.net:3006/role', {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 if (!response.ok) {
//                     throw new Error('Error fetching roles.');
//                 }
//                 const data = await response.json();
//                 setRoles(data);
//             } catch (error) {
//                 showModal('Error fetching roles.');
//             }
//         };

//         fetchRoles();
//     }, []);

//     useEffect(() => {
//         const fetchRoles = async () => {
//             const token = localStorage.getItem('token');
//             try {
//                 const response = await axios.get(
//                     'http://intranet.higherindia.net:3006/access/get_roles',
//                     {
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 if (response.status === 200) {
//                     const roles = response.data.roles; // Adjust based on API response structure
//                     setIsUserChecked(roles.includes('user'));
//                     setIsAdminChecked(roles.includes('admin'));
//                     setIsApproverChecked(roles.includes('approver'));
//                     setIsInitiatorChecked(roles.includes('initiator'));
//                     setIsSuperChecked(roles.includes('super'));
//                 } else {
//                     console.error('Error fetching roles:', response.data.message);
//                 }
//             } catch (error) {
//                 console.error('Error fetching roles:', error);
//             }
//         };

//         fetchRoles();
//     }, []);






//     const permissionMap = {
//         CRM: setIsCrmChecked,
//         create_customer: setIsCreateCustomer,
//         edit_customer: setIsEditCustomer,
//         delete_customer: setIsDeleteCustomer,
//         all_customer: setIsAllCustomer,
//         create_contact: setIsCreateContact,
//         edit_contact: setIsEditContact,
//         delete_contact: setIsDeleteContact,
//         all_contact: setIsAllContact,
//         ASM: setIsAsmChecked,
//         UCS: setIsUCSChecked,


//     };
//     const handleApiAccessChange = async (apiName) => {
//         // Special case for 'update_access' API
//         if (apiName === 'update_access') {
//             setHasAmsAccess((prev) => !prev);
//             // If toggling on 'update_access', make an API call
//             if (!hasAmsAccess) {
//                 try {
//                     const response = await axios.get('http://intranet.higherindia.net:3006/access', {
//                         headers: {
//                             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                         },
//                     });
//                     console.log("API response for 'update_access':", response.data);
//                 } catch (error) {
//                     console.error('Error updating API access for update_access:', error.response ? error.response.data : error.message);
//                     showModal('Error updating API access for update_access.');
//                 }
//             }
//         } else {
//             setApiAccess((prev) =>
//                 prev.includes(apiName)
//                     ? prev.filter((name) => name !== apiName) // Remove API if it’s already selected
//                     : [...prev, apiName] // Add API if it’s not already selected
//             );

//             try {
//                 if (!apiAccess.includes(apiName)) {
//                     const response = await axios.get('http://intranet.higherindia.net:3006/access', {
//                         params: {
//                             user_id: selectedEmail,
//                             api_name: apiName,
//                         },
//                         headers: {
//                             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                         },
//                     });
//                     console.log(`API response for '${apiName}':`, response.data);

//                     // Toggle the specific permission using `permissionMap` if available
//                     if (permissionMap[apiName]) {
//                         permissionMap[apiName]((prev) => !prev);
//                     }
//                 }
//             } catch (error) {
//                 console.error(`Error updating API access for ${apiName}:`, error.response ? error.response.data : error.message);
//                 showModal(`Error updating API access for ${apiName}.`);
//             }
//         }
//     };

//     const handleRoleChange = (roleId) => {
//         setSelectedRoles((prevSelectedRoles) =>
//             prevSelectedRoles.includes(roleId)
//                 ? prevSelectedRoles.filter((id) => id !== roleId)
//                 : [...prevSelectedRoles, roleId]
//         );
//     };

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     const token = localStorage.getItem('token');
//     //     if (!token) {
//     //         showModal('Token does not exist.');
//     //         return;
//     //     }
//     //     const selectedApiAccess = [];

//     //     if (isAsmChecked) selectedApiAccess.push('ASM');
//     //     if (isUCSChecked) selectedApiAccess.push('UCS');
//     //     // Add any other selected values as needed

//     //     try {
//     //         const response = await axios.put(
//     //             'http://intranet.higherindia.net:3006/access/update_access',
//     //             {
//     //                 user_id: selectedEmail,
//     //                 api_access: selectedApiAccess,  // Send only the selected values
//     //             },
//     //             {
//     //                 headers: {
//     //                     'Content-Type': 'application/json',
//     //                     'Authorization': `Bearer ${token}`,
//     //                 },
//     //             }
//     //         );

//     //         if (response.status === 200) {
//     //             showModal('User Updated Successfully!');
//     //         } else if (response.data.error === "User not found. Please check the email entered.") {
//     //             showModal('User not found. Please check the email entered.');
//     //         } else {
//     //             showModal(`Error: ${response.data.error}`);
//     //         }
//     //     } catch (error) {
//     //         const { response } = error;
//     //         if (response) {
//     //             if (response.status === 403) {
//     //                 showModal('You do not have permission to perform this action.');
//     //             } else if (response.status === 404) {
//     //                 showModal('User not found. Please check the email entered.');
//     //             } else {
//     //                 showModal('Error updating API access.');
//     //             }
//     //         } else {
//     //             showModal('Error updating API access.');
//     //         }
//     //     }
//     // };


//     const handleSubmit = async () => {
//         const token = localStorage.getItem('token');
//         const selectedRoles = [];
//         if (isUserChecked) selectedRoles.push('user');
//         if (isAdminChecked) selectedRoles.push('admin');
//         if (isApproverChecked) selectedRoles.push('approver');
//         if (isInitiatorChecked) selectedRoles.push('initiator');
//         if (isSuperChecked) selectedRoles.push('super');

//         try {
//             const response = await axios.put(
//                 'http://intranet.higherindia.net:3006/access/update_access',
//                 { roles: selectedRoles },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             if (response.status === 200) {
//                 alert('Roles updated successfully!');
//             } else {
//                 alert(`Error updating roles: ${response.data.message}`);
//             }
//         } catch (error) {
//             console.error('Error updating roles:', error);
//             alert('Error updating roles.');
//         }
//     };



//     const addUser = () => {
//         navigate('/Signup');
//     };

//     const back = () => {
//         navigate('/HRMS');
//     };

//     const showModal = (message) => {
//         setModalMessage(message);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setModalMessage('');
//     };

//     //TOKEN AND USERPROFILE  START  
//     const userId = localStorage.getItem('userId');
//     const [userData, setUserData] = useState('');
//     const navigate = useNavigate();
//     const getToken = () => {
//         const token = localStorage.getItem('token');
//         return token;
//     };
//     const token = getToken();
//     console.log('Retrieved token:', token);
//     useEffect(() => {
//         const userId = localStorage.getItem('userId');
//         console.log('UserId:', userId);
//         if (userId) {
//             const fetchUserData = async () => {
//                 try {
//                     console.log('Fetching data for userId:', userId);
//                     const response = await axios.get(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     console.log('API Response:', response);
//                     if (response.data) {
//                         const user = response.data;
//                         console.log('User:', user);
//                         setUserData(user);
//                     } else {
//                         console.log('No user data found');
//                     }
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             };
//             fetchUserData();
//         }
//     }, [token, userId]);
//     useEffect(() => {
//         const verifyToken = async () => {
//             if (!token) {
//                 navigate('/');
//                 return;
//             }
//             try {
//                 const response = await axios.post('http://intranet.higherindia.net:3006/verify-token', { token });
//                 console.log('Token is valid:', response.data);
//                 navigate('/AMS1');
//             } catch (error) {
//                 console.error('Token verification failed:', error.response ? error.response.data : error.message);
//                 localStorage.removeItem('token');
//                 localStorage.removeItem('tokenExpiry');
//                 navigate('/');
//             }
//         };
//         verifyToken();
//     }, [token, navigate]);
//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         navigate('/');
//     };
//     const handleHome = () => {
//         navigate('/Cards');
//     };
//     //END

//     return (
//         <div className='flex'>
//             <Sidebar />
//             <div className='p-6 w-full'>
//                 {/*************************  Header Start  ******************************/}
//                 <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
//                     <button onClick={handleHome} className="flex items-center p-2 rounded-full ">
//                         <FaHome className="text-white mr-2" size={25} />
//                     </button>
//                     <h1 className="text-white text-2xl font-bold">Access Privilege</h1>
//                     {userData && (
//                         <div className="ml-auto flex items-center gap-4">
//                             <div className="bg-white rounded-3xl p-2 flex items-center">
//                                 <h3 className="text-lg font-semibold text-black">
//                                     {userData.first_name} {userData.last_name}
//                                 </h3>
//                             </div>
//                             <button onClick={handleLogout} className="bg-white flex items-center p-2 rounded-full ">
//                                 <FaSignOutAlt className="text-black mr-2" size={20} />
//                             </button>
//                         </div>
//                     )}
//                 </div>
//                 {/*************************  Header End  ******************************/}

//                 <div className="flex justify-between mt-4">
//                     <button
//                         className="bg-gray-700 text-white px-4 py-2 rounded-2xl"
//                         onClick={addUser}
//                     >
//                         Add User
//                     </button>
//                 </div>

//                 <div className=" ml-[61%] w-[50%] fixed">
//                     {isDropdownOpen && <ProfileDropdown className="absolute z-10" />}
//                 </div>

//                 <div className='position-fixed'>
//                     <div className="bg-white ">
//                         <form onSubmit={handleSubmit}>
//                             <div className="flex flex-col mt-5 ml-5 w-[200px]">
//                                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 mt-5">
//                                     Select Email:
//                                 </label>
//                                 <select
//                                     id="email"
//                                     value={selectedEmail}
//                                     onChange={handleEmailChange}
//                                     required
//                                     className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 >
//                                     <option value="">Select an email</option>
//                                     {emails.map((user, index) => (
//                                         <option key={index} value={user.user_id}>
//                                             {user.email}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <div className='ml-[5%] mt-5'>
//                                 <label className="block text-[18px] font-bold text-blue-600 mb-2">
//                                     Select Role(s):
//                                 </label>
//                                 <div>
//                                     <label>
//                                         <input
//                                             type="checkbox"
//                                             checked={isUserChecked}
//                                             onChange={(e) => handleRoleChange('user', e.target.checked)}
//                                         />
//                                         user
//                                     </label>
//                                 </div>
//                                 <div>
//                                     <label>
//                                         <input
//                                             type="checkbox"
//                                             checked={isAdminChecked}
//                                             onChange={(e) => handleRoleChange('admin', e.target.checked)}
//                                         />
//                                         admin
//                                     </label>
//                                 </div>
//                                 <div>
//                                     <label>
//                                         <input
//                                             type="checkbox"
//                                             checked={isApproverChecked}
//                                             onChange={(e) => handleRoleChange('approver', e.target.checked)}
//                                         />
//                                         approver
//                                     </label>
//                                 </div>
//                                 <div>
//                                     <label>
//                                         <input
//                                             type="checkbox"
//                                             checked={isInitiatorChecked}
//                                             onChange={(e) => handleRoleChange('initiator', e.target.checked)}
//                                         />
//                                         initiator
//                                     </label>
//                                 </div>
//                                 <div>
//                                     <label>
//                                         <input
//                                             type="checkbox"
//                                             checked={isSuperChecked}
//                                             onChange={(e) => handleRoleChange('super', e.target.checked)}
//                                         />
//                                         super
//                                     </label>
//                                 </div>
//                             </div>



//                             <div className="flex justify-center mt-6">
//                                 <button
//                                     type="submit"
//                                     className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none"
//                                 >
//                                     Submit
//                                 </button>
//                                 <button
//                                     onClick={back}
//                                     className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md ml-4 focus:outline-none"
//                                 >
//                                     Back
//                                 </button>
//                             </div>
//                         </form>
//                     </div>

//                     <Modal
//                         isOpen={isModalOpen}
//                         onRequestClose={closeModal}
//                         contentLabel="Modal"
//                         className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
//                     >
//                         <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
//                             <h2 className="text-lg font-bold mb-4">{modalMessage}</h2>
//                             <button
//                                 onClick={closeModal}
//                                 className="bg-blue-600 hover:bg-blue-700 ml-[35%] text-white font-bold py-2 px-4 rounded focus:outline-none"
//                             >
//                                 Okay
//                             </button>
//                         </div>
//                     </Modal>
//                 </div>
//             </div >
//         </div >
//     );
// };
// export default UpdateAccess;