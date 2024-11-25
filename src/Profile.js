/*********************NEW CODE*************************** */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './Sidebar/HRMSidebar';
import { FaSignOutAlt, FaHome } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faContactCard } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "./App.css";

const Profile = () => {
    const navigate = useNavigate();
    const [hasAMSAccess, setHasAMSAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [newCustomer, setNewCustomer] = useState({
        customer_name: '',
        landline_num: '',
        email_id: '',
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        tan_number: '',
        gst_number: '',
        pan_no: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [contactDetails, setContactDetails] = useState([]);
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [newContact, setNewContact] = useState({
        contact_person: '',
        email_id: '',
        phone_num: '',
        address: '',
        country: '',
        state: '',
        city: '',
        pincode: '',
        department: '',
        designation: '',
        date_of_start: '',
        date_of_end: '',
        status: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCustomerIndex, setCurrentCustomerIndex] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [gstError, setGstError] = useState('');
    const [panError, setPanError] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditModalOpen1, setIsEditModalOpen1] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userData, setUserData] = useState(null);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');


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
    },
        [token, userId]);

    useEffect(() => {
        verifyToken();
        fetchCustomers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleAddCustomer(e);
    };

    const handleSubmit1 = async (e) => {
        e.preventDefault();
        await handleAddContact(e);
    };

    const fetchCustomers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is missing');
            navigate('/');
            return;
        }
        try {
            console.log('➕', token)
            const response = await fetch('http://intranet.higherindia.net:3006/customers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const sortedData = data.sort((a, b) => a.customerId - b.customerId);
            setCustomers(sortedData);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        }
    };

    useEffect(() => {
        const fetchContactDetails = async () => {
            const token = localStorage.getItem('token');
            setLoadingContacts(true);

            if (!token) {
                console.error('Token is missing');
                navigate('/');
                return;
            }
            try {
                const response = await fetch(`http://intranet.higherindia.net:3006/contacts`, {
                    headers: {
                        'authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setContactDetails(data);
                    } else {
                        console.error('Expected an array but received:', data);
                        setContactDetails([]);
                    }
                } else {
                    console.error('Failed to fetch contact details. Status:', response.status);
                }
            } catch (error) {
                console.error('An error occurred while fetching contact details:', error);
            } finally {
                setLoadingContacts(false);
            }
        };
        fetchContactDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer((prevCustomer) => ({
            ...prevCustomer,
            [name]: value
        }));
    };

    const handleChange1 = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'radio') {
            setNewContact((prevContact) => ({
                ...prevContact,
                [name]: value
            }));
        } else {
            setNewContact((prevContact) => ({
                ...prevContact,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleAddCustomer = async (event) => {
        event.preventDefault();
        const isValidGST = newCustomer.gst_number && validateGST(newCustomer.gst_number);
        const isValidPAN = newCustomer.pan_no && validatePAN(newCustomer.pan_no);

        if (newCustomer.gst_number && !isValidGST) {
            setGstError('Invalid GST Number. It must be a 15-character alphanumeric code.');
        } else {
            setGstError('');
        }

        if (newCustomer.pan_no && !isValidPAN) {
            setPanError('Invalid PAN Number. It must be in the format ABCDE1234F.');
        } else {
            setPanError('');
        }

        if (!isValidGST || !isValidPAN) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('Token does not exist.');
                return;
            }
            const payload = {
                customer_name: newCustomer.customer_name,
                landline_num: newCustomer.landline_num,
                email_id: newCustomer.email_id,
                address: newCustomer.address,
                country: newCustomer.country,
                state: newCustomer.state,
                city: newCustomer.city,
                pincode: newCustomer.pincode,
                tan_number: newCustomer.tan_number,
                gst_number: newCustomer.gst_number,
                pan_no: newCustomer.pan_no,
            };
            const response = await fetch('http://intranet.higherindia.net:3006/customers', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Network response was not ok');
            }

            const result = await response.json();
            if (result.success) {
                alert('Customer added successfully!');
                setIsModalOpen(false); // Close the modal
                fetchCustomers();      // Refresh customer list
                resetForm();           // Reset the form
            } else {
                setErrorMessage(result.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Message:', error.message);
            setErrorMessage('Message: ' + error.message);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        const contactData = {
            customer_id: selectedCustomerId,
            contact_person: newContact.contact_person,
            email_id: newContact.email_id,
            phone_num: newContact.phone_num,
            address: newContact.address,
            country: newContact.country,
            state: newContact.state,
            city: newContact.city,
            pincode: newContact.pincode,
            department: newContact.department,
            designation: newContact.designation,
            date_of_start: newContact.date_of_start,
            date_of_end: newContact.date_of_end,
            status: newContact.status
        };

        try {
            let token = localStorage.getItem('token');
            if (!token) {
                alert('Token does not exist.')
                return;
            }
            const response = await fetch('http://intranet.higherindia.net:3006/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(contactData)
            });

            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }

            if (response.ok) {
                const savedContact = await response.json();
                setContacts([...contacts, savedContact]);
                setNewContact({
                    contact_person: '',
                    email_id: '',
                    phone_num: '',
                    address: '',
                    country: '',
                    state: '',
                    city: '',
                    pincode: '',
                    department: '',
                    designation: '',
                    date_of_start: '',
                    date_of_end: '',
                    status: ''
                });
                setIsModalOpen1(false);
            } else {
                console.error('Failed to save the contact. Status:', response.status);
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }
        } catch (error) {
            console.error('An error occurred while saving the contact:', error);
        }
    };

    const handleEditContact = (contactId) => {
        const contactToEdit = contactDetails.find(contact => contact.contact_id === contactId);

        if (contactToEdit) {
            setEditingContact(contactToEdit);
            setIsEditModalOpen(true);
        }
    };

    const handleDelete = async (contactId) => {
        try {
            console.log(contactId)
            let token = localStorage.getItem('token');
            if (!token) {
                alert('Token does not exist.');
                return;
            }
            const url = `http://intranet.higherindia.net:3006/contacts/${contactId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,

                },
            });

            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }

            if (!response.ok) {
                throw new Error(`Failed to delete contact: ${response.statusText}`);
            }
            setContactDetails(contactDetails.filter(contact => contact.Id !== contactId));
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    };

    const handleEditCustomer = (index) => {
        setNewCustomer(customers[index]);
        setIsEditMode(true);
        setCurrentCustomerIndex(index);
        setIsEditModalOpen1(true);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        let valid = true;
      // Validate GST Number
        if (newCustomer.gst_number && !validateGST(newCustomer.gst_number)) {
            setGstError('Invalid GST Number. It must be a 15-character alphanumeric code.');
            valid = false;
        } else {
            setGstError('');
        }
        // Validate PAN Number
        if (newCustomer.pan_no && !validatePAN(newCustomer.pan_no)) {
            setPanError('Invalid PAN Number. It must be in the format ABCDE1234F.');
            valid = false;
        } else {
            setPanError('');
        }
        if (!valid) return;
        try {
            const customerId = customers[currentCustomerIndex].customer_id;
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token does not exist.');
                return;
            }
            const response = await fetch(`http://intranet.higherindia.net:3006/customers/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer_name: newCustomer.customer_name,
                    landline_num: newCustomer.landline_num,
                    email_id: newCustomer.email_id,
                    address: newCustomer.address,
                    country: newCustomer.country,
                    state: newCustomer.state,
                    city: newCustomer.city,
                    pincode: newCustomer.pincode,
                    gst_number: newCustomer.gst_number,
                    pan_no: newCustomer.pan_no,
                    tan_number: newCustomer.tan_number
                }),
            });

            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            if (result.success) {
                alert('Customer updated successfully!');
                setIsEditModalOpen1(false);
                await fetchCustomers();
                resetForm();
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleOpenDeleteModal = (index) => {
        setCustomerToDelete(index);
        setIsDeleteModalOpen(true);
    };

    // const handleDeleteCustomer = async () => {
    //     try {
    //         const customerId = customers[customerToDelete].customer_id;
    //         let token = localStorage.getItem('token');
    //         if (!token) {
    //             alert('Token does not exist.');
    //             return;
    //         }

    //         const response = await axios.delete(`http://intranet.higherindia.net:3006/customers/${customerId}`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'authorization': `Bearer ${token}`,
    //             }
    //         });

    //         if (response.status === 200) {
    //             fetchCustomers();
    //         } else {
    //             console.error('Failed to delete customer:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('An error occurred while deleting the customer:', error);
    //     }
    //     setIsDeleteModalOpen(false);
    // };

    const handleDeleteCustomer = async () => {
        try {
            const customerId = customers[customerToDelete].customer_id;
            const token = localStorage.getItem('token');
            if (!token) {
                setDeleteErrorMessage('Token does not exist.');
                return;
            }
            const response = await axios.delete(`http://intranet.higherindia.net:3006/customers/${customerId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                fetchCustomers();
                setIsDeleteModalOpen(false); // Close the delete modal
            } else if (response.status === 403) {
                // Extract and handle the specific error message from the response body
                const errorData = response.data; // Assuming response.data contains the error message
                setDeleteErrorMessage(errorData.error || 'Access denied. You do not have permission to access this API.');
            } else {
                // Handle other errors
                setDeleteErrorMessage('Failed to delete customer: ' + response.statusText);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                // Handle 403 error if thrown by axios
                const errorData = error.response.data; // Assuming error.response.data contains the error message
                setDeleteErrorMessage(errorData.error || 'Access denied. You do not have permission to access this API.');
            } else {
                // Handle other errors
                setDeleteErrorMessage('Error: ' + (error.response ? error.response.data.error : error.message));
            }
        }
    };

    const resetForm = () => {
        setNewCustomer({
            customer_name: '',
            landline_num: '',
            email_id: '',
            address: '',
            gst_number: '',
            pan_no: ''
        });
        setIsEditMode(false);
        setCurrentCustomerIndex(null);
    };

    const validateGST = (gst) => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
        return gstRegex.test(gst);
    };

    const validatePAN = (pan) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setIsDetailModalOpen(true);
    };

    const updateContactDetails = async (contactId, updatedContactData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('Token does not exist.');
                return;
            }

            const response = await fetch(`http://intranet.higherindia.net:3006/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedContactData),
            });

            if (response.status === 403) {
                setErrorMessage('Access denied. You do not have permission to access this API.');
                return;
            }

            if (response.ok) {
                const updatedContact = await response.json();
                setContactDetails((prevDetails) =>
                    prevDetails.map((contact) =>
                        contact.contact_id === contactId ? updatedContact : contact
                    )
                );
                setIsEditModalOpen(false); // Close the modal or similar
                setErrorMessage(''); // Clear any existing error messages
            } else {
                const errorData = await response.json();
                if (response.status === 403) {
                    setErrorMessage(errorData.error || 'Access denied. You do not have permission to access this API.');
                } else {
                    setErrorMessage(errorData.message || 'Failed to update contact details');
                }
            }
        } catch (error) {
            console.error('An error occurred while updating the contact details:', error);
            setErrorMessage('Error: ' + error.message);
        }
    };

    useEffect(() => {
        const handlePopState = () => {
            navigate('/Cards');
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    useEffect(() => {
        const checkAMSAccess = async () => {
            setLoading(true);
            try {
                let user_id = localStorage.getItem('userId');
                setUserId(user_id);
                const response = await axios.get('http://intranet.higherindia.net:3006/access', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const userAccess = response.data;
                let userIdData = userAccess.filter(item => item.user_id == user_id);
                const hasAccess = userIdData.some(access => access.api_name === 'create_customer');
                // const hasAccess1 = userIdData.some(access => access.api_name === 'create_contact');
                // const hasAccess2 = userIdData.some(access => access.api_name === 'update_customer');
                // const hasAccess3 = userIdData.some(access => access.api_name === 'delete_customer');
                setHasAMSAccess(hasAccess);
            } catch (error) {
                console.error('Error fetching access rights:', error);
                setHasAMSAccess(false);
            } finally {
                setLoading(false);
            }
        };
        checkAMSAccess();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("tokenExpiry");
        console.log('Token:', localStorage.getItem("token"));
        console.log('User ID:', localStorage.getItem("userId"));
        console.log('Token Expiry:', localStorage.getItem("tokenExpiry"));
        navigate('/');
    };

    const handleHome = () => {
        navigate('/Cards');
    };

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedContact(null);
    };

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='flex'>
                <AdminSidebar />
                <div className="p-6 w-full">

                    {/*************************  Header Start  ******************************/}
                    <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                        <button
                            onClick={handleHome}
                            type="button"
                            className="flex items-center p-2 rounded-full ">
                            <FaHome className="text-white mr-2" size={25} />
                        </button>
                        <h1 className="text-white text-2xl font-bold">Profile</h1>
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
                    {hasAMSAccess && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-2xl mb-4 mt-4 "
                        >
                            Add Customer
                        </button>
                    )}

                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-5 rounded-2xl w-full max-w-[40%] h-[95%] custom-scrollbar overflow-auto">
                                <h2 className="text-2xl font-bold mb-4 ml-7">{isEditMode ? 'Edit Customer' : 'Add Customer'}</h2>
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <form onSubmit={handleAddCustomer} className="grid grid-cols-1 gap-4 w-full">
                                    <div className='ml-7'>
                                        <div className="grid gap-4 mb-4 md:grid-cols-2">

                                            <div className="flex flex-col ">
                                                <label className="mb-2">Customer Name: <span className='text-red-500'>*</span></label>
                                                <input
                                                    type="text"
                                                    name="customer_name"
                                                    value={newCustomer.customer_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                            <div className="flex flex-col ">
                                                <label className="mb-2">Landline Number:<span className='text-red-500'>*</span></label>
                                                <input
                                                    type="text"
                                                    name="landline_num"
                                                    value={newCustomer.landline_num}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-4 md:grid-cols-2">

                                            <div className="flex flex-col ">
                                                <label className="mb-2">E-mail: <span className='text-red-500'>*</span></label>
                                                <input
                                                    type="email"
                                                    name="email_id"
                                                    value={newCustomer.email_id}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                            <div className="flex flex-col ">
                                                <label className="mb-2">Address:</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={newCustomer.address}
                                                    onChange={handleChange}
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-4 md:grid-cols-2">
                                            <div className="flex flex-col ">
                                                <label className="mb-2">Country:<span className='text-red-500'>*</span></label>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={newCustomer.country}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                            <div className="flex flex-col ">
                                                <label className="mb-2">State:<span className='text-red-500'>*</span></label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={newCustomer.state}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-4 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="mb-2">City:<span className='text-red-500'>*</span></label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={newCustomer.city}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="mb-2">Pincode:<span className='text-red-500'>*</span></label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={newCustomer.pincode}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-4 md:grid-cols-2">
                                            <div className="flex flex-col">
                                                <label className="mb-2">GST Number:</label>
                                                <input
                                                    type="text"
                                                    name="gst_number"
                                                    value={newCustomer.gst_number}
                                                    onChange={handleChange}

                                                    className="p-2 border border-black rounded"
                                                />
                                                {gstError && <p className="text-red-500 text-sm">{gstError}</p>}
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="mb-2">PAN Number:</label>
                                                <input
                                                    type="text"
                                                    name="pan_no"
                                                    value={newCustomer.pan_no}
                                                    onChange={handleChange}
                                                    className="p-2 border border-black rounded"
                                                />
                                                {panError && <p className="text-red-500 text-sm">{panError}</p>}
                                            </div>
                                        </div>
                                        <div className="grid gap-4 mb-4 md:grid-cols-2">
                                            <div className="flex flex-col ">
                                                <label className="mb-2">TAN Number:<span className='text-red-500'>*</span></label>
                                                <input
                                                    type="text"
                                                    name="tan_number"
                                                    value={newCustomer.tan_number}
                                                    onChange={handleChange}
                                                    required
                                                    className="p-2 border border-black rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end ">
                                        <button
                                            type="button"
                                            onClick={() => { setIsModalOpen(false); resetForm(); }}
                                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded"
                                            onClick={handleSubmit}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                            Add
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isEditModalOpen1 && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-5 rounded w-full max-w-[30%] h-[80%] custom-scrollbar overflow-auto">
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <h2 className="text-2xl font-bold mb-4 ml-7">Edit Customer</h2>
                                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4 w-full">
                                    <div className='ml-7'>
                                        <h3 className="text-l font-bold mb-4">Customer Details</h3>

                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Customer Name: <span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={newCustomer.customer_name}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Landline Number:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="landline_num"
                                                value={newCustomer.landline_num}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">E-mail: <span className='text-red-500'>*</span></label>
                                            <input
                                                type="email"
                                                name="email_id"
                                                value={newCustomer.email_id}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Address:</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={newCustomer.address}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Country:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={newCustomer.country}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">State:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={newCustomer.state}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">City:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newCustomer.city}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Pincode:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newCustomer.pincode}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">GST Number:</label>
                                            <input
                                                type="text"
                                                name="gst_number"
                                                value={newCustomer.gst_number}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                            {gstError && <p className="text-red-500 text-sm">{gstError}</p>}
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">PAN Number:</label>
                                            <input
                                                type="text"
                                                name="pan_no"
                                                value={newCustomer.pan_no}
                                                onChange={handleChange}
                                                className="p-2 border border-black rounded"
                                            />
                                            {panError && <p className="text-red-500 text-sm">{panError}</p>}
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">TAN Number:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="tan_number"
                                                value={newCustomer.tan_number}
                                                onChange={handleChange}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditModalOpen1(false); resetForm(); }}
                                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded"
                                            onclick={handleEditCustomer}>
                                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isModalOpen1 && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-5 rounded w-full max-w-md h-[80%] overflow-y-auto">
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <h2 className="text-xl font-bold mb-4">Add Contact</h2>
                                <form onSubmit={handleAddContact} className="grid grid-cols-1 gap-4 w-full">
                                    <div>
                                        <h3 className="text-l font-bold mb-4">Contact Person Details</h3>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Contact Person:<text className=' text-red-500'>*</text></label>
                                            <input
                                                type="text"
                                                name="contact_person"
                                                value={newContact.contact_person}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Phone:<span className='text-red-500'>*</span></label>
                                            <input
                                                type="text"
                                                name="phone_num"
                                                value={newContact.phone_num}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">E-mail: <text className=' text-red-500'>*</text></label>
                                            <input
                                                type="email"
                                                name="email_id"
                                                value={newContact.email_id}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Address:<text className=' text-red-500'>*</text></label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={newContact.address}
                                                onChange={handleChange1}
                                                required
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Country:<span className='text-red-600'>*</span></label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={newContact.country}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">State:<span className='text-red-600'>*</span></label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={newContact.state}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">City:<span className='text-red-600'>*</span></label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newContact.city}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Pincode:<span className='text-red-600'>*</span></label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={newContact.pincode}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Department:<span className='text-red-600'>*</span></label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={newContact.department}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Designation:<span className='text-red-600'>*</span></label>
                                            <input
                                                type="text"
                                                name="designation"
                                                value={newContact.designation}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Date of Start:</label>
                                            <input
                                                type="Date"
                                                name="date_of_start"
                                                value={newContact.date_of_start}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Date of End:</label>
                                            <input
                                                type="Date"
                                                name="date_of_end"
                                                value={newContact.date_of_end}
                                                onChange={handleChange1}
                                                className="p-2 border border-black rounded"
                                            />
                                        </div>
                                        <div className="flex flex-col mb-3">
                                            <label className="mb-2">Status:<span className='text-red-500'>*</span></label>
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="active"
                                                    checked={newContact.status === 'active'}
                                                    onChange={handleChange1}
                                                    className="mr-2"
                                                />
                                                <label className="mr-4">Active</label>
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value="inactive"
                                                    checked={newContact.status === 'inactive'}
                                                    onChange={handleChange1}
                                                    className="mr-2"
                                                />
                                                <label>Inactive</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center items-end mt-5 col-span-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white w-40 rounded mr-2 hover:bg-blue-600 hover:font-semibold hover:scale-105 transition-all ease-in-out shadow-md hover:shadow-xl"
                                            onClick={handleSubmit1}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen1(false)}
                                            className="px-4 py-2 bg-red-500 text-white w-40 rounded hover:bg-red-600 hover:font-semibold hover:scale-105 transition-all ease-in-out shadow-md hover:shadow-xl"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-5 rounded w-1/3">
                                {deleteErrorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{deleteErrorMessage}</span>
                                    </div>
                                )}
                                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                                <p>Are you sure you want to delete this customer?</p>
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteCustomer}
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isEditModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                        <strong className="font-bold">Message:</strong>
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold mb-4">Edit Contact</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateContactDetails(editingContact.contact_id, editingContact);
                                    }}
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Contact Person:</label>
                                        <input
                                            type="text"
                                            value={editingContact.contact_person}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, contact_person: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Phone:</label>
                                        <input
                                            type="phone"
                                            value={editingContact.phone_num}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, phone_num: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Email ID:</label>
                                        <input
                                            type="email"
                                            value={editingContact.email_id}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, email_id: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Address:</label>
                                        <input
                                            type="text"
                                            value={editingContact.address}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, address: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Country:</label>
                                        <input
                                            type="text"
                                            value={editingContact.country}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, country: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">State:</label>
                                        <input
                                            type="text"
                                            value={editingContact.state}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, state: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">City:</label>
                                        <input
                                            type="text"
                                            value={editingContact.city}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, city: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Pincode:</label>
                                        <input
                                            type="text"
                                            value={editingContact.pincode}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, pincode: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Department:</label>
                                        <input
                                            type="text"
                                            value={editingContact.department}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, department: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Designation:</label>
                                        <input
                                            type="text"
                                            value={editingContact.designation}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, designation: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Status:</label>
                                        <input
                                            type="text"
                                            value={editingContact.status}
                                            onChange={(e) =>
                                                setEditingContact({ ...editingContact, status: e.target.value })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                                            onClick={() => setIsEditModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {isDetailModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-5 rounded w-[95%] max-h-[100vh] overflow-auto relative">
                                <h2 className="text-2xl font-bold mb-4">Customer Details</h2>
                                <p><strong>Name:</strong> {selectedCustomer.customer_name}</p>
                                <p><strong>Landline Number:</strong> {selectedCustomer.landline_num}</p>
                                <p><strong>Email ID:</strong> {selectedCustomer.email_id}</p>
                                <p><strong>Address:</strong> {selectedCustomer.address}</p>
                                <p><strong>Country:</strong> {selectedCustomer.country}</p>
                                <p><strong>State:</strong> {selectedCustomer.state}</p>
                                <p><strong>City:</strong> {selectedCustomer.city}</p>
                                <p><strong>Pincode:</strong> {selectedCustomer.pincode}</p>
                                <p><strong>TAN Number:</strong> {selectedCustomer.tan_number}</p>
                                <p><strong>GST Number:</strong> {selectedCustomer.gst_number}</p>
                                <p><strong>PAN Number:</strong> {selectedCustomer.pan_no}</p>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold mb-2">Contact Details</h3>
                                    {loadingContacts ? (
                                        <p>Loading contact details...</p>
                                    ) : (

                                        Array.isArray(contactDetails) && contactDetails.length > 0 ? (
                                            <div className="relative">
                                                <div className="sticky top-0 bg-white border-b border-gray-300 z-10 p-2">
                                                    <div className="grid grid-cols-6 gap-4">
                                                        <div className="p-2"><strong>Contact Person:</strong></div>
                                                        <div className="p-2"><strong>Email ID:</strong></div>
                                                        <div className="p-2"><strong>Phone Number:</strong></div>

                                                        <div className="p-2"><strong>Status:</strong></div>
                                                        <div className="p-2"><strong>Action:</strong></div>
                                                    </div>
                                                </div>
                                                <div className="max-h-[60vh] overflow-y-auto mt-2">
                                                    {contactDetails
                                                        .filter(contact => contact.customer_id === selectedCustomer.customer_id) // Assuming `customer_id` is the key to match
                                                        .map((contact, index) => (
                                                            <div key={index} className="grid grid-cols-6 gap-4 border-t pt-2">
                                                                {/* Data Rows */}
                                                                <div className="p-2 cursor-pointer text-blue-500 hover:text-blue-700"
                                                                    onClick={() => handleContactClick(contact)}
                                                                >
                                                                    {contact.contact_person}
                                                                </div>
                                                                <div className="p-2">{contact.email_id}</div>
                                                                <div className="p-2">{contact.phone_num}</div>
                                                                <div className="p-2">{contact.status}</div>

                                                                <div className="flex items-center justify-center space-x-2 mt-2">
                                                                    <button
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                        onClick={() => handleEditContact(contact.contact_id)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </button>
                                                                    {/* <button
                                                                        className="text-red-500 hover:text-red-700"
                                                                        onClick={() => handleDelete(contact.contact_id)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button> */}

                                                                    <div>
                                                                        {errorMessage && (
                                                                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                                                                <strong className="font-bold">Message:</strong>
                                                                                <span className="block sm:inline">{errorMessage}</span>
                                                                            </div>
                                                                        )}

                                                                        <button
                                                                            className="text-red-500 hover:text-red-700"
                                                                            onClick={() => handleDelete(contact.contact_id)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                        </button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p>No contact details available.</p>
                                        )

                                    )}

                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                        onClick={() => setIsDetailModalOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isPopupOpen && selectedContact && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                                <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                                <div className="mb-2"><strong>Contact Id:</strong> {selectedContact.contact_id}</div>
                                <div className="mb-2"><strong>Contact Person:</strong> {selectedContact.contact_person}</div>
                                <div className="mb-2"><strong>Email ID:</strong> {selectedContact.email_id}</div>
                                <div className="mb-2"><strong>Phone Number:</strong> {selectedContact.phone_num}</div>
                                <div className="mb-2"><strong>Address:</strong> {selectedContact.address}</div>
                                <div className="mb-2"><strong>Country:</strong> {selectedContact.country}</div>
                                <div className="mb-2"><strong>State:</strong> {selectedContact.state}</div>
                                <div className="mb-2"><strong>City:</strong> {selectedContact.city}</div>
                                <div className="mb-2"><strong>Pincode:</strong> {selectedContact.pincode}</div>
                                <div className="mb-2"><strong>Department:</strong> {selectedContact.department}</div>
                                <div className="mb-2"><strong>Designation:</strong> {selectedContact.designation}</div>
                                <div className="mb-2"><strong>Date of Start</strong>{selectedContact.date_of_start}</div>
                                <div className="mb-2"><strong>Date of End:</strong> {selectedContact.date_of_end}</div>
                                <div className="mb-2"><strong>Status:</strong> {selectedContact.status}</div>
                                <button
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    onClick={closePopup}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    <table className="w-full bg-white rounded shadow overflow-x-auto">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Customer ID</th>
                                <th className="py-2 px-4 border-b">Customer Name</th>
                                <th className="py-2 px-4 border-b">Landline Number</th>
                                <th className="py-2 px-4 border-b">E-mail</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer, index) => (
                                <tr key={index} className="text-center">
                                    <td className="py-2 px-4 border-b">{customer.customer_id}</td>
                                    <td className="border px-4 py-2 cursor-pointer text-blue-500" onClick={() => handleCustomerClick(customer)}>
                                        {customer.customer_name}
                                    </td>
                                    <td className="py-2 px-4 border-b">{customer.landline_num}</td>
                                    <td className="py-2 px-4 border-b">{customer.email_id}</td>
                                    <td className="py-2 px-4 border-b flex justify-center">

                                        <button
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                            onClick={() => handleEditCustomer(index)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>


                                        <button
                                            className="text-red-500 hover:text-red-700 mr-2"
                                            onClick={() => handleOpenDeleteModal(index)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>


                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                                setSelectedCustomerId(customer.customer_id);
                                                setIsModalOpen1(true);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faContactCard} />
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
export default Profile;