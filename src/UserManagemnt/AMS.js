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
//     // Check if a customer API is selected
//     const isCustomerApiSelected = (apiName) => selectedCustomerApis.includes(apiName);
//     // Check if a contact API is selected
//     const isContactApiSelected = (apiName) => selectedContactApis.includes(apiName);

//     const [isCrmChecked, setIsCrmChecked] = useState(false);
//     const [isAsmChecked, setIsAsmChecked] = useState(false);
//     const [isUCSChecked, setIsUCSChecked] = useState(false);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [selectedCustomerApis, setSelectedCustomerApis] = useState([]);
//     const [selectedContactApis, setSelectedContactApis] = useState([]);
//     //for each states
//     const [isHRMSChecked, setIsHRMSChecked] = useState(false);
//     const [isORGChecked, setIsORGChecked] = useState(false);
//     const [isUMCChecked, setIsUMCChecked] = useState(false);
//     const [isLeaveManagementChecked, setIsLeaveManagementChecked] = useState(false);


//     // ORG child states
//     const [isLocationChecked, setIsLocationChecked] = useState(false);
//     const [isDeptChecked, setIsDeptChecked] = useState(false);
//     const [isDomainChecked, setIsDomainChecked] = useState(false);
//     const [isDesignationChecked, setIsDesignationChecked] = useState(false);

//     // User Management child states
//     const [isRoleChecked, setIsRoleChecked] = useState(false);
//     const [isUMChecked, setIsUMChecked] = useState(false);
//     const [hasAmsAccess, setHasAmsAccess] = useState(false);

//     // Leave Management Child states
//     const [isPolicyChecked, setIsPolicyChecked] = useState(false);
//     const [isLeavePolicyChecked, setIsLeavePolicyChecked] = useState(false);
//     const [isYearSetupChecked, setIsYearSetupChecked] = useState(false);
//     const [isHolidaysChecked, setIsHolidaysChecked] = useState(false);
//     const [isLeaveOptionChecked, setIsLeaveOptionChecked] = useState(false);
//     const [isCreateLeaveChecked, setIsCreateLeaveChecked] = useState(false);
//     const [isApplyLeaveChecked, setIsApplyLeaveChecked] = useState(false);
//     const [isBalanceLeaveChecked, setIsBalanceLeaveChecked] = useState(false);
//     const customerApis = [
//         { name: 'create_customer', label: 'Add Customer' },
//         { name: 'update_customer', label: 'Update Customer' },
//         { name: 'delete_customer', label: 'Delete Customer' },
//         { name: 'all_customer', label: 'View Customers' },
//     ];
//     const contactApis = [
//         { name: 'create_contact', label: 'Add Contact' },
//         { name: 'update_contact', label: 'Update Contact' },
//         { name: 'delete_contact', label: 'Delete Contact' },
//         { name: 'all_contact', label: 'View Contacts' },
//     ];

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

//     const handleCrmCheckboxChange = () => {
//         setIsCrmChecked(!isCrmChecked);
//         if (!isCrmChecked) {
//             setSelectedCustomerApis(customerApis.map(api => api.name));
//             setSelectedContactApis(contactApis.map(api => api.name));
//         } else {
//             setSelectedCustomerApis([]);
//             setSelectedContactApis([]);
//         }
//     };

//     const handleSelectAllCustomerApis = (checked) => {
//         if (checked) {
//             setSelectedCustomerApis(customerApis.map(api => api.name));
//         } else {
//             setSelectedCustomerApis([]);
//         }
//     };

//     const handleSelectAllContactApis = (checked) => {
//         if (checked) {
//             setSelectedContactApis(contactApis.map(api => api.name));
//         } else {
//             setSelectedContactApis([]);
//         }
//     };

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
//                 setIsHRMSChecked(apiAccessNames.includes('HRMS'));
//                 setIsDeptChecked(apiAccessNames.includes('Dept'));
//                 setIsAsmChecked(apiAccessNames.includes('ASM'));
//                 setIsUCSChecked(apiAccessNames.includes('UCS'));
//                 setIsLocationChecked(apiAccessNames.includes('Location'));
//                 setIsORGChecked(apiAccessNames.includes('ORG'));
//                 setIsUMCChecked(apiAccessNames.includes('UMC'));
//                 setIsDesignationChecked(apiAccessNames.includes('Designation'));
//                 setIsDomainChecked(apiAccessNames.includes('Domain'));
//                 setIsRoleChecked(apiAccessNames.includes('Role'));
//                 setIsUMChecked(apiAccessNames.includes('UM'));
//                 setIsLeaveManagementChecked(apiAccessNames.includes('Leave'));

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
//             setIsHRMSChecked(false);
//             setIsDeptChecked(false);
//             setIsAsmChecked(false);
//             setIsUCSChecked(false);
//             setIsLocationChecked(false);
//             setIsORGChecked(false);
//             setIsUMCChecked(false);
//             setIsDesignationChecked(false);
//             setIsDomainChecked(false);
//             setIsRoleChecked(false);
//             setIsUMChecked(false);
//             setIsLeaveManagementChecked(false);
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

//     const handleApiAccessChange = async (apiName) => {
//         if (apiName === 'update_access') {
//             setHasAmsAccess(!hasAmsAccess);
//             try {
//                 if (!hasAmsAccess) {
//                     await axios.get('http://intranet.higherindia.net:3006/access',
//                         {
//                             headers: {
//                                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                             },
//                         });
//                 }
//             } catch (error) {
//                 console.error('Error updating API access for update_access:', error.response ? error.response.data : error.message);
//                 showModal('Error updating API access for update_access.');
//             }
//         } else {
//             setApiAccess((prev) =>
//                 prev.includes(apiName)
//                     ? prev.filter((name) => name !== apiName)
//                     : [...prev, apiName]
//             );
//             try {
//                 if (!apiAccess.includes(apiName)) {
//                     await axios.get('http://intranet.higherindia.net:3006/access', {
//                         user_id: selectedEmail,
//                         api_name: apiName,
//                     }, {
//                         headers: {
//                             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                         },
//                     });
//                     if (apiName === 'CRM') {
//                         setIsCrmChecked(prev => !prev);
//                     } else if (apiName === 'Dept') {
//                         setIsDeptChecked(prev => !prev);
//                     } else if (apiName === 'ASM') {
//                         setIsAsmChecked(prev => !prev);
//                     } else if (apiName === 'HRMS') {
//                         setIsHRMSChecked(prev => !prev);
//                     } else if (apiName === 'UCS') {
//                         setIsUCSChecked(prev => !prev);
//                     } else if (apiName === 'ORG') {
//                         setIsORGChecked(prev => !prev);
//                     } else if (apiName === 'Location') {
//                         setIsLocationChecked(prev => !prev);
//                     } else if (apiName === 'Designation') {
//                         setIsDesignationChecked(prev => !prev);
//                     } else if (apiName === 'Domain') {
//                         setIsDomainChecked(prev => !prev);
//                     } else if (apiName === 'Role') {
//                         setIsRoleChecked(prev => !prev);
//                     } else if (apiName === 'UM') {
//                         setIsUMChecked(prev => !prev);
//                     } else if (apiName === 'Leave') {
//                         setIsLeaveManagementChecked(prev => !prev);
//                     } else if (apiName === 'UMC') {
//                         setIsUMCChecked(prev => !prev);
//                     }
//                     else {
//                         if (apiName === 'CRM') {
//                             setIsCrmChecked(prev => !prev);
//                         } else if (apiName === 'Dept') {
//                             setIsDeptChecked(prev => !prev);
//                         } else if (apiName === 'ASM') {
//                             setIsAsmChecked(prev => !prev);
//                         } else if (apiName === 'HRMS') {
//                             setIsHRMSChecked(prev => !prev);
//                         } else if (apiName === 'UCS') {
//                             setIsUCSChecked(prev => !prev);
//                         } else if (apiName === 'ORG') {
//                             setIsORGChecked(prev => !prev);
//                         } else if (apiName === 'Location') {
//                             setIsLocationChecked(prev => !prev);
//                         } else if (apiName === 'Designation') {
//                             setIsDesignationChecked(prev => !prev);
//                         } else if (apiName === 'Domain') {
//                             setIsDomainChecked(prev => !prev);
//                         } else if (apiName === 'Role') {
//                             setIsRoleChecked(prev => !prev);
//                         } else if (apiName === 'Leave') {
//                             setIsLeaveManagementChecked(prev => !prev);
//                         } else if (apiName === 'UM') {
//                             setIsUMChecked(prev => !prev);
//                         } else if (apiName === 'UMC') {
//                             setIsUMCChecked(prev => !prev);
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error(`Error updating API access for ${apiName}:`, error.response ? error.response.data : error.message);
//                 showModal('Error updating API access.');
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
//     //     try {
//     //         console.log(token)
//     //         const response = await axios.put('http://intranet.higherindia.net:3006/access/update_access',
//     //             {
//     //                 user_id: selectedEmail,
//     //                 api_access: [...apiAccess, ...(hasAmsAccess ? ['update_access'] : [])],
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
//     //         if (error.response && error.response.status === 403) {
//     //             showModal('You do not have permission to perform this action.');
//     //         } else if (error.response && error.response.status === 404) {
//     //             showModal('User not found. Please check the email entered.');
//     //         } else {
//     //             showModal('Error updating API access.');
//     //         }
//     //     }
//     // };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('token');
//         if (!token) {
//             showModal('Token does not exist.');
//             return;
//         }
//         try {
//             console.log(token);
//             const response = await axios.put(
//                 'http://intranet.higherindia.net:3006/access/update_access',
//                 {
//                     user_id: selectedEmail,
//                     api_access: [...apiAccess, ...(hasAmsAccess ? ['update_access'] : [])],
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`,
//                     },
//                 }
//             );
//             if (response.status === 200) {
//                 showModal('User Updated Successfully!');
//             } else if (response.data.error === "User not found. Please check the email entered.") {
//                 showModal('User not found. Please check the email entered.');
//             } else {
//                 showModal(`Error: ${response.data.error}`);
//             }
//         } catch (error) {
//             const { response } = error;
//             if (response) {
//                 if (response.status === 403) {
//                     showModal('You do not have permission to perform this action.');
//                 } else if (response.status === 404) {
//                     showModal('User not found. Please check the email entered.');
//                 } else {
//                     showModal('Error updating API access.');
//                 }
//             } else {
//                 showModal('Error updating API access.');
//             }
//         }
//     };

//     // const handleSubmit = async (e) => { 
//     //     e.preventDefault();
//     //     const token = localStorage.getItem('token');
//     //     if (!token) {
//     //         showModal('Token does not exist.');
//     //         return;
//     //     }
//     //     try {
//     //         console.log(token);
//     //         const payload = {
//     //             user_id: selectedEmail,
//     //             api_access: [
//     //                 selectedApiAccess,
//     //                 ...apiAccess,
//     //                 ...(hasAmsAccess ? ['update_access'] : []),
//     //                 // ...(selectedRoles || []),
//     //                 // ...(apiAccess.includes('UMC') ? [] : ['UMC']),
//     //                 // ...(apiAccess.includes('Role') ? [] : ['Role']),
//     //                 // ...(apiAccess.includes('UM') ? [] : ['UM']),
//     //                 // ...(apiAccess.includes('Location') ? [] : ['Location']),
//     //                 // ...(apiAccess.includes('Dept') ? [] : ['Dept']),
//     //                 // ...(apiAccess.includes('Domain') ? [] : ['Domain']),
//     //                 // ...(apiAccess.includes('Designation') ? [] : ['Designation']),
//     //                 // ...(apiAccess.includes('ASM') ? [] : ['ASM']),                   
//     //             ]
//     //         };
//     //         console.log('Payload:', payload);

//     //         const response = await axios.put(
//     //             'http://intranet.higherindia.net:3006/access/update_access',
//     //             payload,
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
//     //                 showModal('Error updating access.');
//     //             }
//     //         } else {
//     //             showModal('Error updating access.');
//     //         }
//     //     }
//     // };

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

//     // Handle ORG checkbox
//     const handleORGChange = () => {
//         const newORGChecked = !isORGChecked;
//         setIsORGChecked(newORGChecked);
//         setIsLocationChecked(newORGChecked);
//         setIsDeptChecked(newORGChecked);
//         setIsDomainChecked(newORGChecked);
//     };
//     // Handle User Management checkbox
//     const handleUserManagementChange = () => {
//         const newUserManagementChecked = !isUMCChecked;
//         setIsUMCChecked(newUserManagementChecked);
//         setIsRoleChecked(newUserManagementChecked);
//         setIsUMChecked(newUserManagementChecked);
//         setHasAmsAccess(newUserManagementChecked);
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
//                 navigate('/AMS');
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

//                             <div className='flex '>
//                                 <div className="w-1/2 border-solid border-gray-300 rounded-lg p-4 overflow-y-auto h-[450px]">
//                                     {/*CRM */}
//                                     <div className="mt-[3%] mb-[2%]">
//                                         <label className="flex items-center">
//                                             <input
//                                                 type="checkbox"
//                                                 onChange={handleCrmCheckboxChange}
//                                                 checked={isCrmChecked}
//                                                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                             />
//                                             <span className="text-blue-600 text-lg font-bold ml-5">CRM</span>
//                                         </label>

//                                         {isCrmChecked && (
//                                             <div className="flex flex-col gap-4">
//                                                 <h2 className="text-blue-600 text-[16px] mr-[66%] font-medium">Customer's Info:</h2>
//                                                 <div className="grid grid-cols-2 gap-4 ml-[5%]">
//                                                     <label className="flex items-center">
//                                                         <input
//                                                             type="checkbox"
//                                                             onChange={(e) => handleSelectAllCustomerApis(e.target.checked)}
//                                                             checked={customerApis.every(api => isCustomerApiSelected(api.name))}
//                                                             className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                         />
//                                                         <span className="ml-2">Select All</span>
//                                                     </label>
//                                                     {customerApis.map((api, index) => (
//                                                         <label key={index} className="flex items-center">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 value={api.name}
//                                                                 onChange={() => handleApiAccessChange(api.name, true)}
//                                                                 checked={isCustomerApiSelected(api.name)}
//                                                                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                             />
//                                                             <span className="ml-2">{api.label}</span>
//                                                         </label>
//                                                     ))}
//                                                 </div>

//                                                 <h2 className="text-blue-600 text-[16px] mr-[60%] font-medium">Customer's Contact :</h2>
//                                                 <div className="grid grid-cols-2 gap-4 ml-[4%]">
//                                                     <label className="flex items-center">
//                                                         <input
//                                                             type="checkbox"
//                                                             onChange={(e) => handleSelectAllContactApis(e.target.checked)}
//                                                             checked={contactApis.every(api => isContactApiSelected(api.name))}
//                                                             className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                         />
//                                                         <span className="ml-2">Select All</span>
//                                                     </label>
//                                                     {contactApis.map((api, index) => (
//                                                         <label key={index} className="flex items-center">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 value={api.name}
//                                                                 onChange={() => handleApiAccessChange(api.name, false)}
//                                                                 checked={isContactApiSelected(api.name)}
//                                                                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                             />
//                                                             <span className="ml-2">{api.label}</span>
//                                                         </label>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div>
//                                         {/* HRMS */}
//                                         <div className="mt-[2%]">
//                                             <label className="flex items-center">
//                                                 <input
//                                                     type="checkbox"
//                                                     onChange={() => handleApiAccessChange('HRMS')}
//                                                     checked={isHRMSChecked}
//                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                 />
//                                                 <span className="text-blue-600 text-lg font-bold ml-5">HRMS</span>
//                                             </label>
//                                         </div>

//                                         {/* ORG under HRMS */}
//                                         {isHRMSChecked && (
//                                             <div className="ml-5 mt-[2%]">
//                                                 <label className="flex items-center">
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={handleORGChange}
//                                                         checked={isORGChecked}
//                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                     />
//                                                     <span className="text-blue-600 text-[16px] ml-5">Organization Set up</span>
//                                                 </label>

//                                                 {/* ORG children (Location, Department, Domain) */}
//                                                 {isORGChecked && (
//                                                     <div>
//                                                         <div className='flex justify-evenly mt-[2%]'>
//                                                             <label className="flex items-center">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() => setIsLocationChecked(!isLocationChecked)}
//                                                                     checked={isLocationChecked}
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                 />
//                                                                 <span className="text-black-600 text-s ml-5">Location</span>
//                                                             </label>
//                                                             <label className="flex items-center">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() => setIsDeptChecked(!isDeptChecked)}
//                                                                     checked={isDeptChecked}
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                 />
//                                                                 <span className="text-black-600 text-s ml-5">Department</span>
//                                                             </label>
//                                                         </div>
//                                                         <div className='flex justify-evenly mt-[2%]'>
//                                                             <label className="flex items-center">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() => setIsDomainChecked(!isDomainChecked)}
//                                                                     checked={isDomainChecked}
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                 />
//                                                                 <span className="text-black-600 text-s ml-5">Domain</span>
//                                                             </label>
//                                                             <label className="flex items-center">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() => setIsDesignationChecked(!isDesignationChecked)}
//                                                                     checked={isDesignationChecked}
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                 />
//                                                                 <span className="text-black-600 text-s ml-5">Designation</span>
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}

//                                         {/* User Management under HRMS */}
//                                         {isHRMSChecked && (
//                                             <div className="mt-[2%] ml-5">
//                                                 <label className="flex items-center">
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={handleUserManagementChange}
//                                                         checked={isUMCChecked}
//                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                     />
//                                                     <span className="text-blue-600 text-[16px] ml-5">User Management Card</span>
//                                                 </label>
//                                                 {/* User Management children (Role, Add User, Access Management) */}
//                                                 {isUMCChecked && (
//                                                     <div>
//                                                         <div className="flex justify-evenly ml-[-2%] mt-[2%]">
//                                                             <label className="flex items-center">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() => setIsRoleChecked(!isRoleChecked)}
//                                                                     checked={isRoleChecked}
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                 />
//                                                                 <span className="text-black-600 text-s ml-4">Role</span>
//                                                             </label>
//                                                             <label className="flex items-center">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() => setIsUMChecked(!isUMChecked)}
//                                                                     checked={isUMChecked}
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                 />
//                                                                 <span className="text-black-600 text-s ml-5">Add User</span>
//                                                             </label>
//                                                         </div>
//                                                         <div className="flex justify-evenly ml-[-29%] mt-[2%]">
//                                                             <label className="flex items-center">
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     onChange={() => setHasAmsAccess(!hasAmsAccess)}
//                                                                     checked={hasAmsAccess}
//                                                                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                 />
//                                                                 <span className="ml-2">Access Management</span>
//                                                             </label>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}

//                                         {/*  Leave Management */}
//                                         {isHRMSChecked && (
//                                             <div className="mt-[2%] ml-5">
//                                                 <label className="flex items-center">
//                                                     <input
//                                                         type="checkbox"
//                                                         onChange={() => setIsLeaveManagementChecked(!isLeaveManagementChecked)}
//                                                         checked={isLeaveManagementChecked}
//                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                     />
//                                                     <span className="text-blue-600 text-[16px] ml-5">Leave Management</span>
//                                                 </label>

//                                                 {isLeaveManagementChecked && (
//                                                     <div className="ml-5 mt-[2%]">
//                                                         {/* Policy Option */}
//                                                         <label className="flex items-center">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 onChange={() => setIsPolicyChecked(!isPolicyChecked)}
//                                                                 checked={isPolicyChecked}
//                                                                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                             />
//                                                             <span className="text-blue-600 text-[16px] ml-5">Policy</span>
//                                                         </label>

//                                                         {isPolicyChecked && (
//                                                             <div className="ml-10 mt-[1%]">
//                                                                 <label className="flex items-center">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         onChange={() => setIsLeavePolicyChecked(!isLeavePolicyChecked)}
//                                                                         checked={isLeavePolicyChecked}
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                     <span className="ml-2">Leave Policy</span>
//                                                                 </label>
//                                                                 <label className="flex items-center">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         onChange={() => setIsYearSetupChecked(!isYearSetupChecked)}
//                                                                         checked={isYearSetupChecked}
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                     <span className="ml-2">Year Setup</span>
//                                                                 </label>
//                                                                 <label className="flex items-center">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         onChange={() => setIsHolidaysChecked(!isHolidaysChecked)}
//                                                                         checked={isHolidaysChecked}
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                     <span className="ml-2">Holidays</span>
//                                                                 </label>
//                                                             </div>
//                                                         )}

//                                                         {/* Leave Option */}
//                                                         <label className="flex items-center mt-3">
//                                                             <input
//                                                                 type="checkbox"
//                                                                 onChange={() => setIsLeaveOptionChecked(!isLeaveOptionChecked)}
//                                                                 checked={isLeaveOptionChecked}
//                                                                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                             />
//                                                             <span className="text-blue-600 text-[16px] ml-5">Leave</span>
//                                                         </label>

//                                                         {isLeaveOptionChecked && (
//                                                             <div className="ml-10 mt-[1%]">
//                                                                 <label className="flex items-center">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         onChange={() => setIsCreateLeaveChecked(!isCreateLeaveChecked)}
//                                                                         checked={isCreateLeaveChecked}
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                     <span className="ml-2">Create Leave</span>
//                                                                 </label>
//                                                                 <label className="flex items-center">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         onChange={() => setIsApplyLeaveChecked(!isApplyLeaveChecked)}
//                                                                         checked={isApplyLeaveChecked}
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                     <span className="ml-2">Apply Leave</span>
//                                                                 </label>
//                                                                 <label className="flex items-center">
//                                                                     <input
//                                                                         type="checkbox"
//                                                                         onChange={() => setIsBalanceLeaveChecked(!isBalanceLeaveChecked)}
//                                                                         checked={isBalanceLeaveChecked}
//                                                                         className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                                                     />
//                                                                     <span className="ml-2">Balance Leave</span>
//                                                                 </label>
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/***************Asset Management System and UCS*********************/}
//                                     <div className="mt-[2%]">
//                                         <label className="flex items-center">
//                                             <input
//                                                 type="checkbox"
//                                                 onChange={() => handleApiAccessChange('ASM')}
//                                                 checked={isAsmChecked}
//                                                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                             />
//                                             <span className="text-indigo-500 text-lg font-bold ml-5">Asset Management System</span>
//                                         </label>
//                                     </div>
//                                     <div className="mt-[2%]">
//                                         <label className="flex items-center">
//                                             <input
//                                                 type="checkbox"
//                                                 onChange={() => handleApiAccessChange('UCS')}
//                                                 checked={isUCSChecked}
//                                                 className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                                             />
//                                             <span className="text-blue-600 text-lg font-bold ml-5">UCS</span>
//                                         </label>
//                                     </div>
//                                 </div>
//                                 {/***  ROLE  ***/}
//                                 <div className='ml-[5%] mt-5'>
//                                     <label className="block text-[18px] font-bold text-blue-600 mb-2">
//                                         Select Role(s):
//                                     </label>
//                                     <div className="flex flex-col">
//                                         {roles.map((role, index) => (
//                                             <div key={index} className="flex items-center mb-2">
//                                                 <input type="checkbox"
//                                                     id={`role-${role.role_id}`}
//                                                     checked={selectedRoles.includes(role.role_id)}
//                                                     onChange={() => handleRoleChange(role.role_id)}
//                                                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                                                 />
//                                                 <label
//                                                     htmlFor={`role-${role.role_id}`}
//                                                     className="ml-2 block text-sm text-gray-800"
//                                                 >
//                                                     {role.role}
//                                                 </label>
//                                             </div>
//                                         ))}
//                                     </div>
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
    const isCustomerApiSelected = (apiName) => selectedCustomerApis.includes(apiName);
    const isContactApiSelected = (apiName) => selectedContactApis.includes(apiName);

    const [isCrmChecked, setIsCrmChecked] = useState(false);
    const [isAsmChecked, setIsAsmChecked] = useState(false);
    const [isUCSChecked, setIsUCSChecked] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCustomerApis, setSelectedCustomerApis] = useState([]);
    const [selectedContactApis, setSelectedContactApis] = useState([]);

    //for each states
    const [isHRMSChecked, setIsHRMSChecked] = useState(false);
    const [isORGChecked, setIsORGChecked] = useState(false);
    const [isUMCChecked, setIsUMCChecked] = useState(false);
    const [isLMCChecked, setIsLMCChecked] = useState(false);

    // ORG child states
    const [isDeptChecked, setIsDeptChecked] = useState(false);
    const [isLocationChecked, setIsLocationChecked] = useState(false);
    const [isDesignationChecked, setIsDesignationChecked] = useState(false);
    const [isDomainChecked, setIsDomainChecked] = useState(false);

    // User Management child states
    const [isRoleChecked, setIsRoleChecked] = useState(false);
    const [isUserChecked, setIsUserChecked] = useState(false);
    const [hasAmsAccess, setHasAmsAccess] = useState(false);

    // Leave Management Child states
    const [isCreateChecked, setIsCreateChecked] = useState(false);
    const [isApplyChecked, setIsApplyChecked] = useState(false);
    const [isBalanceChecked, setIsBalanceChecked] = useState(false);
    const [isApprovalChecked, setIsApprovalChecked] = useState(false);
    const [isPolicyChecked, setIsPolicyChecked] = useState(false);
    const [isYearSetUpChecked, setIsYearSetUpChecked] = useState(false);
    const [isHolidayChecked, setIsHolidayChecked] = useState(false);
    const [isAllBalanceChecked, setIsAllBalanceChecked] = useState(false);

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

    const customerApis = [
        { name: 'create_customer', label: 'Add Customer' },
        { name: 'update_customer', label: 'Update Customer' },
        { name: 'delete_customer', label: 'Delete Customer' },
        { name: 'all_customer', label: 'View Customers' },
    ];
    const contactApis = [
        { name: 'create_contact', label: 'Add Contact' },
        { name: 'update_contact', label: 'Update Contact' },
        { name: 'delete_contact', label: 'Delete Contact' },
        { name: 'all_contact', label: 'View Contacts' },
    ];

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

    const handleCrmCheckboxChange = () => {
        setIsCrmChecked(!isCrmChecked);
        if (!isCrmChecked) {
            setSelectedCustomerApis(customerApis.map(api => api.name));
            setSelectedContactApis(contactApis.map(api => api.name));
        } else {
            setSelectedCustomerApis([]);
            setSelectedContactApis([]);
        }
    };

    const handleHRMSCheckboxChange = () => {
        setIsHRMSChecked(!isHRMSChecked);
    };

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

                setIsHRMSChecked(apiAccessNames.includes('HRMS'));
                setIsORGChecked(apiAccessNames.includes('ORG'));
                setIsUMCChecked(apiAccessNames.includes('UMC'));
                setIsLMCChecked(apiAccessNames.includes('LMC'));


                setIsDeptChecked(apiAccessNames.includes('Dept'));
                setIsDomainChecked(apiAccessNames.includes('Domain'));
                setIsDesignationChecked(apiAccessNames.includes('Designation'));
                setIsLocationChecked(apiAccessNames.includes('Location'));


                setIsRoleChecked(apiAccessNames.includes('ROle'));
                setIsUserChecked(apiAccessNames.includes('User'));
                setHasAmsAccess(apiAccessNames.includes('AMS'));

                setIsCreateChecked(apiAccessNames.includes('Create'));
                setIsApplyChecked(apiAccessNames.includes('Apply'));
                setIsBalanceChecked(apiAccessNames.includes('Balance'));
                setIsApprovalChecked(apiAccessNames.includes('Approval'));
                setIsPolicyChecked(apiAccess.includes('Policy'));
                setIsYearSetUpChecked(apiAccess.includes('YearSet'));
                setIsHolidayChecked(apiAccess.includes('Holiday'));
                setIsAllBalanceChecked(apiAccess.includes('AllBalance'));

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
            setIsHRMSChecked(false);
            setIsORGChecked(false);
            setIsUMCChecked(false);
            setIsPolicyChecked(false);
            setSelectedRoles([]);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                // Fetch all available roles
                const roleResponse = await axios.get('http://intranet.higherindia.net:3006/role', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setRoles(roleResponse.data);

                // Fetch the selected roles for the user
                const userResponse = await axios.get('http://intranet.higherindia.net:3006/access', {
                    params: { user_id: selectedEmail },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                // Assuming user roles have role_id property
                const userRoles = userResponse.data.map((role) => role.role_id);
                setSelectedRoles(userRoles); // Set selected roles
            } catch (error) {
                console.error('Error fetching roles or user access:', error.message);
                showModal('Error fetching roles or user roles.');
            }
        };
        if (selectedEmail) {
            fetchRoles();
        }
    }, [selectedEmail]);

    // useEffect(() => {
    //     const fetchRoles = async () => {
    //         try {
    //             const response = await axios.get('http://intranet.higherindia.net:3006/role', {
    //                 headers: {
    //                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //                 },
    //             });

    //             console.log("API Response:", response.data);

    //             if (response.status === 200) {
    //                 const fetchedRoles = response.data.roles || []; // Default to an empty array
    //                 setRoles(fetchedRoles);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching roles:', error.response ? error.response.data : error.message);
    //         }
    //     };

    //     fetchRoles();
    // }, []);

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

        HRMS: setIsHRMSChecked,
        ORG: setIsORGChecked,
        UMC: setIsUMCChecked,
        LMC: setIsLMCChecked,

        Dept: setIsDeptChecked,
        Domain: setIsDomainChecked,
        Designation: setIsDesignationChecked,
        Location: setIsLocationChecked,


        Role: setIsRoleChecked,
        User: setIsUserChecked,
        AMS: setHasAmsAccess,

        Create: setIsCreateChecked,
        Apply : setIsApplyChecked,
        Balance: setIsBalanceChecked,
        Approval: setIsApprovalChecked,
        Policy: setIsPolicyChecked, 
        YearSet: setIsYearSetUpChecked, 
        Holiday : setIsHolidayChecked,
        AllBalance: setIsAllBalanceChecked,
    };

    // const handleApiAccessChange = async (apiName) => {
    //     // Special case for 'update_access' API
    //     if (apiName === 'update_access') {
    //         setHasAmsAccess((prev) => !prev);
    //         // If toggling on 'update_access', make an API call
    //         if (!hasAmsAccess) {
    //             try {
    //                 const response = await axios.get('http://intranet.higherindia.net:3006/access', {
    //                     headers: {
    //                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //                     },
    //                 });
    //                 console.log("API response for 'update_access':", response.data);
    //             } catch (error) {
    //                 console.error('Error updating API access for update_access:', error.response ? error.response.data : error.message);
    //                 showModal('Error updating API access for update_access.');
    //             }
    //         }
    //     } else {
    //         setApiAccess((prev) =>
    //             prev.includes(apiName)
    //                 ? prev.filter((name) => name !== apiName) // Remove API if it’s already selected
    //                 : [...prev, apiName] // Add API if it’s not already selected
    //         );

    //         try {
    //             if (!apiAccess.includes(apiName)) {
    //                 const response = await axios.get('http://intranet.higherindia.net:3006/access', {
    //                     params: {
    //                         user_id: selectedEmail,
    //                         api_name: apiName,
    //                     },
    //                     headers: {
    //                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //                     },
    //                 });
    //                 console.log(`API response for '${apiName}':`, response.data);

    //                 // Toggle the specific permission using `permissionMap` if available
    //                 if (permissionMap[apiName]) {
    //                     permissionMap[apiName]((prev) => !prev);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error(`Error updating API access for ${apiName}:`, error.response ? error.response.data : error.message);
    //             showModal(`Error updating API access for ${apiName}.`);
    //         }
    //     }
    // };

    const handleApiAccessChange = async (apiName, isRole = false) => {
        if (isRole) {
            // Handle roles specifically
            setSelectedRoles((prev) =>
                prev.includes(apiName)
                    ? prev.filter((role) => role !== apiName) // Remove role if already selected
                    : [...prev, apiName] // Add role if not already selected
            );

            try {
                const response = await axios.get('http://intranet.higherindia.net:3006/access', {
                    params: {
                        user_id: selectedEmail,
                        role_name: apiName, // Pass role name to backend
                    },
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                console.log(`API response for role '${apiName}':`, response.data);
            } catch (error) {
                console.error(`Error updating role access for ${apiName}:`, error.response ? error.response.data : error.message);
                showModal(`Error updating role access for ${apiName}.`);
            }
            return; // Skip further execution for roles
        }

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
        setSelectedRoles((prev) =>
            prev.includes(roleId)
                ? prev.filter((id) => id !== roleId) // Remove role if already selected
                : [...prev, roleId] // Add role if not already selected
        );
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         showModal('Token does not exist.');
    //         return;
    //     }
    //     const selectedApiAccess = [];
    //     if (isCrmChecked) selectedApiAccess.push('CRM');
    //     if (isCreateCustomer) selectedApiAccess.push('create_customer');
    //     if (isEditCustomer) selectedApiAccess.push('update_customer');
    //     if (isDeleteCustomer) selectedApiAccess.push('delete_customer');
    //     if (isAllCustomer) selectedApiAccess.push('all_customer');
    //     if (isCreateContact) selectedApiAccess.push('create_contact');
    //     if (isEditContact) selectedApiAccess.push('update_contact');
    //     if (isDeleteContact) selectedApiAccess.push('delete_contact');
    //     if (isAllContact) selectedApiAccess.push('all_contact');

    //     if (isHRMSChecked) selectedApiAccess.push('HRMS');
    //     if (isORGChecked) selectedApiAccess.push('ORG');
    //     if (isUMCChecked) selectedApiAccess.push('UMC');
    //     if (isLMCChecked) selectedApiAccess.push('LMC');

    //     if (isDeptChecked) selectedApiAccess.push('Dept');
    //     if (isDomainChecked) selectedApiAccess.push('Domain');
    //     if (isDesignationChecked) selectedApiAccess.push('Designation');
    //     if (isLocationChecked) selectedApiAccess.push('Location');


    //     if (isRoleChecked) selectedApiAccess.push('Role');
    //     if (isUserChecked) selectedApiAccess.push('User');
    //     if (hasAmsAccess) selectedApiAccess.push('AMS');

    //     if (isCreateChecked) selectedApiAccess.push('Create');
    //     if (isLeaveChecked) selectedApiAccess.push('Leave');
    //     if (isApprovalChecked) selectedApiAccess.push('Approval');
    //     if (isPolicyChecked) selectedApiAccess.push('Policy');
    //     if (isBalanceChecked) selectedApiAccess.push('Balance');

    //     if (isLeavePolicyChecked) selectedApiAccess.push('Policy');
    //     if (isYearSetUpChecked) selectedApiAccess.push('Policy');
    //     if (isHolidayChecked) selectedApiAccess.push('Policy');

    //     if (isApplyLeaveChecked) selectedApiAccess.push('Leave');
    //     if (isBalLeaveChecked) selectedApiAccess.push('Leave');

    //     if (isAsmChecked) selectedApiAccess.push('ASM');
    //     if (isUCSChecked) selectedApiAccess.push('UCS');
    //     try {
    //         const response = await axios.put(
    //             'http://intranet.higherindia.net:3006/access/update_access',
    //             {
    //                 user_id: selectedEmail,
    //                 api_access: selectedApiAccess,  // Send only the selected values
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         if (response.status === 200) {
    //             showModal('User Updated Successfully!');
    //         } else if (response.data.error === "User not found. Please check the email entered.") {
    //             showModal('User not found. Please check the email entered.');
    //         } else {
    //             showModal(`Error: ${response.data.error}`);
    //         }
    //     } catch (error) {
    //         const { response } = error;
    //         if (response) {
    //             if (response.status === 403) {
    //                 showModal('You do not have permission to perform this action.');
    //             } else if (response.status === 404) {
    //                 showModal('User not found. Please check the email entered.');
    //             } else {
    //                 showModal('Error updating API access.');
    //             }
    //         } else {
    //             showModal('Error updating API access.');
    //         }
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            showModal('Token does not exist.');
            return;
        }

        // Collecting selected API access
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

        if (isHRMSChecked) selectedApiAccess.push('HRMS');
        if (isORGChecked) selectedApiAccess.push('ORG');
        if (isUMCChecked) selectedApiAccess.push('UMC');
        if (isLMCChecked) selectedApiAccess.push('LMC');

        if (isDeptChecked) selectedApiAccess.push('Dept');
        if (isDomainChecked) selectedApiAccess.push('Domain');
        if (isDesignationChecked) selectedApiAccess.push('Designation');
        if (isLocationChecked) selectedApiAccess.push('Location');

        if (isRoleChecked) selectedApiAccess.push('Role');
        if (isUserChecked) selectedApiAccess.push('User');
        if (hasAmsAccess) selectedApiAccess.push('AMS');

        if (isCreateChecked) selectedApiAccess.push('Create');
        if (isApplyChecked) selectedApiAccess.push('Apply');
        if (isBalanceChecked) selectedApiAccess.push('Balance');
        if (isApprovalChecked) selectedApiAccess.push('Approval');
        if (isPolicyChecked) selectedApiAccess.push('Policy');
        if (isYearSetUpChecked) selectedApiAccess.push('YearSet');
        if (isHolidayChecked) selectedApiAccess.push('Holiday');
        if (isAllBalanceChecked) selectedApiAccess.push('AllBalance');

        if (isAsmChecked) selectedApiAccess.push('ASM');
        if (isUCSChecked) selectedApiAccess.push('UCS');

        const selectedRoleNames = roles
            .filter((role) => selectedRoles.includes(role.role_id))
            .map((role) => role.role); // Extracting role names

        selectedApiAccess.push(...selectedRoleNames);
        try {
            const response = await axios.put(
                'http://intranet.higherindia.net:3006/access/update_access',
                {
                    user_id: selectedEmail,
                    api_access: selectedApiAccess, // Send names instead of IDs
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
                navigate('/AMS');
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

                            <div className='flex '>
                                <div className="w-1/2 border-solid border-gray-300 rounded-lg p-4 overflow-y-auto h-[450px]">
                                    {/****CRM ****/}
                                    <div className="w-1/2 border-solid border-gray-300 rounded-lg  overflow-y-auto ">
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
                                            <div className="ml-5 mt-[2%] ">
                                                <div>
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


                                    {/**********************************HRMS  OPTIONS ****************** */}
                                    <div >
                                        {/* HRMS Section */}
                                        <div className="mt-[2%]">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleHRMSCheckboxChange}
                                                    checked={isHRMSChecked}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-blue-600 text-lg font-bold ml-5">HRMS</span>
                                            </label>
                                        </div>

                                        {/* HRMS Details */}
                                        {isHRMSChecked && (
                                            <div className="ml-5 mt-[2%]">
                                                <div>
                                                    <div className="ml-5">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                onChange={() => setIsORGChecked(!isORGChecked)}
                                                                checked={isORGChecked}
                                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2">Organization Set up</span>
                                                        </label>

                                                        {isORGChecked && (
                                                            <div className="ml-5 mt-3">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsDeptChecked(!isDeptChecked)}
                                                                        checked={isDeptChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Dept</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsLocationChecked(!isLocationChecked)}
                                                                        checked={isLocationChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Location</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsDesignationChecked(!isDesignationChecked)}
                                                                        checked={isDesignationChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Designation</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsDomainChecked(!isDomainChecked)}
                                                                        checked={isDomainChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Domain</span>
                                                                </label>
                                                            </div>
                                                        )}


                                                        <label className="flex items-center mt-2">
                                                            <input
                                                                type="checkbox"
                                                                onChange={() => setIsUMCChecked(!isUMCChecked)}
                                                                checked={isUMCChecked}
                                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2">User Management Card </span>
                                                        </label>
                                                        {isUMCChecked && (
                                                            <div className="ml-5 mt-3">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsRoleChecked(!isRoleChecked)}
                                                                        checked={isRoleChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Role</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsUserChecked(!isUserChecked)}
                                                                        checked={isUserChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Users</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setHasAmsAccess(!hasAmsAccess)}
                                                                        checked={hasAmsAccess}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Access Management</span>
                                                                </label>
                                                            </div>
                                                        )}

                                                        <label className="flex items-center mt-2">
                                                            <input
                                                                type="checkbox"
                                                                onChange={() => setIsLMCChecked(!isLMCChecked)}
                                                                checked={isLMCChecked}
                                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                            />
                                                            <span className="ml-2">Leave Management Card</span>
                                                        </label>
                                                        {isLMCChecked && (
                                                            <div className="ml-5 mt-3">
                                                                <label className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsCreateChecked(!isCreateChecked)}
                                                                        checked={isCreateChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Create Leave</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsApplyChecked(!isApplyChecked)}
                                                                        checked={isApplyChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Apply Leave</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsBalanceChecked(!isBalanceChecked)}
                                                                        checked={isBalanceChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Balance Leave</span>
                                                                </label>


                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsApprovalChecked(!isApprovalChecked)}
                                                                        checked={isApprovalChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Leave Approval</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsPolicyChecked(!isPolicyChecked)}
                                                                        checked={isPolicyChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Leave Policy</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsYearSetUpChecked(!isYearSetUpChecked)}
                                                                        checked={isYearSetUpChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Year Setup</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsHolidayChecked(!isHolidayChecked)}
                                                                        checked={isHolidayChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">Holidays</span>
                                                                </label>
                                                                <label className="flex items-center mt-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={() => setIsAllBalanceChecked(!isAllBalanceChecked)}
                                                                        checked={isAllBalanceChecked}
                                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2">All Balance </span>
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/***************Asset Management System and UCS*********************/}
                                    <div className="mt-[2%]">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleApiAccessChange('ASM')}
                                                checked={isAsmChecked}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-indigo-500 text-lg font-bold ml-5">Asset Management System</span>
                                        </label>
                                    </div>
                                    <div className="mt-[2%]">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                onChange={() => handleApiAccessChange('UCS')}
                                                checked={isUCSChecked}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-blue-600 text-lg font-bold ml-5">UCS</span>
                                        </label>
                                    </div>
                                </div>
                                {/***  ROLE  ***/}
                                {/* <div className='ml-[5%] mt-5'>
                                    <label className="block text-[18px] font-bold text-blue-600 mb-2">
                                        Select Role(s):
                                    </label>
                                    <div className="flex flex-col">
                                        {roles.map((role, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <input type="checkbox"
                                                    id={`role-${role.role_id}`}
                                                    checked={selectedRoles.includes(role.role_id)}
                                                    onChange={() => handleRoleChange(role.role_id)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label
                                                    htmlFor={`role-${role.role_id}`}
                                                    className="ml-2 block text-sm text-gray-800"
                                                >
                                                    {role.role}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                                <div className="ml-[5%] mt-5">
                                    <label className="block text-[18px] font-bold text-blue-600 mb-2">
                                        Select Role(s):
                                    </label>
                                    <div className="flex flex-col">
                                        {roles.map((role) => (
                                            <div key={role.role_id} className="flex items-center mb-2">
                                                {/* Checkbox */}
                                                <input
                                                    type="checkbox"
                                                    id={`role-${role.role_id}`}
                                                    checked={selectedRoles.includes(role.role_id)} // Check if this role is selected
                                                    onChange={() => handleRoleChange(role.role_id)} // Toggle role selection
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                {/* Role Name */}
                                                <label
                                                    htmlFor={`role-${role.role_id}`}
                                                    className="ml-2 block text-sm text-gray-800"
                                                >
                                                    {role.role}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
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

