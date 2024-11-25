import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import SuccessModal from '../SuccessModal';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/HRMSidebar';
import excel from '../assests/excel.png';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DomainTable = () => {
    const navigate = useNavigate();
    const [domains, setDomains] = useState([]);
    const [newDomainName, setNewDomainName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [domainToDelete, setDomainToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [newDomainDescription, setNewDomainDescription] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('UserId:', userId); // Check if userId is valid
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
    },
        [token, userId]);

    const handleAddDomain = async () => {
        const token = localStorage.getItem('token');
        if (!newDomainName) {
            alert('Domain name is required');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://intranet.higherindia.net:3006/domain', {
                domain_name: newDomainName,
                description: newDomainDescription,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // Success handling
            setDomains([...domains, response.data.domain]);
            setNewDomainName('');
            setNewDomainDescription('');
            setIsAddModalOpen(false);
            setError('');  // Clear any previous error
            setSuccess(true);  // Set success to true
        } catch (error) {
            console.error('Error adding domain:', error);

            // Check if the error is a "domain already exists" error
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                if (errorMessage.includes('already exists')) {
                    setError('Domain name already exists');
                } else {
                    setError(errorMessage);  
                }
            } else {
                setError('Failed to add domain.');
            }
            setSuccess(false); 
        } finally {
            setLoading(false);
        }
    };



    const fetchDomains = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://intranet.higherindia.net:3006/domain', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setDomains(response.data);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
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
            navigate('/Domain');
        } catch (error) {
            console.error('Token verification failed:', error.response ? error.response.data : error.message);
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            navigate('/');
        }
    };

    useEffect(() => {
        fetchDomains();
        verifyToken();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios({
                method: 'delete',
                url: 'http://intranet.higherindia.net:3006/domain',
                data: { id },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setDomains(domains.filter(domain => domain.dom_id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting domain:', error);
            alert('Failed to delete domain.');
        }
    };

    const confirmDelete = (domain) => {
        setDomainToDelete(domain);
        setIsDeleteModalOpen(true);
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(domains);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Domains');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'Domains.xlsx');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleHome = () => {
        navigate('/Cards');
    };

    useEffect(() => {
        const handlePopState = () => {
            navigate('/Cards1');
        };
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 w-full">
                {/* Header */}
                <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                    <button onClick={handleHome} className="flex items-center p-2 rounded-full ">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-2xl font-bold">Domain</h1>
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

                <div className="flex justify-between mt-3">
                    <button onClick={() => setIsAddModalOpen(true)}
                        className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue">
                        Add Domain
                    </button>
                    <button onClick={handleDownloadExcel} className="text-green-500">
                        <img src={excel} alt="logo" className="mr-5 w-8 h-8" />
                    </button>
                </div>

                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Create Domain</h2>
                            <form onSubmit={(e) => { e.preventDefault(); handleAddDomain(); }}>
                                <div className="mb-4">
                                    <label htmlFor="domain">Domain Name *</label>
                                    <input
                                        type="text"
                                        id="domain_name"
                                        value={newDomainName}
                                        onChange={(e) => setNewDomainName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Domain Name"
                                        required
                                    />
                                    {error && <div className="text-red-500 text-[10px]">{error}</div>}  {/* Display error */}

                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        id="description"
                                        value={newDomainDescription}
                                        onChange={(e) => setNewDomainDescription(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Domain Description"
                                    />
                                </div>
                                <div className="flex">
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50' : ''}`}
                                        disabled={loading}>
                                        {loading ? 'Adding...' : 'Add Domain'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewDomainName(''); // Reset domain name field
                                            setNewDomainDescription(''); // Reset domain description field
                                            setError();
                                            setIsAddModalOpen(false); // Close the modal
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-5"
                                    >
                                        Cancel
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

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                            <p>
                                Are you sure you want to delete the domain: <strong>{domainToDelete?.domain_name}</strong>?
                            </p>
                            <div className="flex justify-between mt-4">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                                    Cancel
                                </button>
                                <button onClick={() => handleDelete(domainToDelete.dom_id)} className="bg-red-500 text-white px-4 py-2 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/********************DOmain Table************ */}
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4 border-b">S.no.</th>
                                <th className="py-2 px-4 border-b">Domain</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Actions</th> {/* Complete this header */}
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map((domain, index) => (
                                <tr key={index} className={`bg-${index % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                                    <td className="p-4 border-b">{index + 1}</td>
                                    <td className="p-4 border-b">{domain.domain_name}</td>
                                    <td className="p-4 border-b">{domain.description || 'No description'}</td>
                                    <td className="p-4 border-b">
                                        <button onClick={() => confirmDelete(domain)} className="text-red-500 hover:text-red-700">
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
    )
}
export default DomainTable;