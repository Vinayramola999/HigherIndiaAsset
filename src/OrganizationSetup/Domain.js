import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/HRMSidebar';
import excel from '../assests/excel.png'; // Ensure this path is correct
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DomainTable = () => {
    const navigate = useNavigate();
    const [domains, setDomains] = useState([]);
    const [newDomainName, setNewDomainName] = useState('');
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [domainToDelete, setDomainToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [newDomainDescription, setNewDomainDescription] = useState('');

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        try {
            const response = await axios.get('http://higherindia.net:3006/domain');
            setDomains(response.data);
        } catch (error) {
            console.error('Error fetching domains:', error);
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        console.log('UserId:', userId); // Check if userId is valid
        if (userId) {
            const fetchUserData = async () => {
                try {
                    console.log('Fetching data for userId:', userId); // Log before API call
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
    },
        [token, userId]);

    const handleAddDomain = async () => {
        if (!newDomainName) {
            alert('Domain name is required');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://higherindia.net:3006/domain', {
                domain_name: newDomainName,
                description: newDomainDescription,
            });
            setDomains([...domains, response.data.domain]);
            setNewDomainName('');
            setNewDomainDescription('');
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding domain:', error);
            alert('Failed to add domain.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios({
                method: 'delete',
                url: 'http://higherindia.net:3006/domain',
                data: { id },
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
        localStorage.clear();
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

                <div className="flex justify-between mt-4">
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-gray-700 text-white px-4 py-2 rounded-2xl">
                        Add Domain
                    </button>
                    <button onClick={handleDownloadExcel} className="text-green-500">
                        <img src={excel} alt="logo" className="mr-5 w-8 h-8" />
                    </button>
                </div>

                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Add Domain</h2>
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

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4 border-b">ID</th>
                                <th className="py-2 px-4 border-b">Domain</th>
                                <th className="py-2 px-4 border-b">Description</th>
                                <th className="py-2 px-4 border-b">Actions</th> {/* Complete this header */}
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map((domain) => (
                                <tr key={domain.domain_id}>
                                    <td className="py-2 px-4 border-b">{domain.dom_id}</td>
                                    <td className="py-2 px-4 border-b">{domain.domain_name}</td>
                                    <td className="py-2 px-4 border-b">{domain.description}</td>
                                    <td className="py-2 px-4 border-b">
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