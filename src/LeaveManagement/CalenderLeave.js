import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import WorkingDays from './WorkingDays';
import axios from 'axios';

const YourComponent = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        year_type: '',
        start_date: '',
        end_date: '',
        description: '',
    });
    const [setFormErrors] = useState({});
    const [apiError, setApiError] = useState(null);
    const [yearData, setYearData] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    // Fetch year settings data
    const fetchYearData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://intranet.higherindia.net:3006/yrset/year', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setYearData(response.data);
        } catch (error) {
            console.error("Error fetching year data:", error);
        }
    };
    
    useEffect(() => {
        fetchYearData();
    }, []);

    // Toggle popup visibility and reset form
    const handleAddButtonClick = () => {
        setIsPopupOpen(true);
        setApiError(null);
    };

    const handleCancel = () => {
        setIsPopupOpen(false);
        setFormData({
            year_type: '',
            start_date: '',
            end_date: '',
            description: '',
        });
        setApiError(null);
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleYearSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://intranet.higherindia.net:3006/yrset/year', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.status === 200) {
                console.log('Year settings submitted successfully:', response.data);
                setIsPopupOpen(false);
                setFormData({
                    year_type: '',
                    start_date: '',
                    end_date: '',
                    description: '',
                });
                fetchYearData(); // Refresh year settings data
            } else {
                setApiError(response.data.error || "An error occurred while submitting the year settings.");
            }
        } catch (error) {
            setApiError(error.response?.data.error || "An error occurred while submitting the year settings.");
        }
    };
    

    // Show confirmation popup before deleting
    const confirmDelete = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    // Handle delete request
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://intranet.higherindia.net:3006/yrset/year/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log(`Year setting with ID ${id} deleted successfully`);
            setDeleteConfirm({ show: false, id: null });
            fetchYearData(); 
        } catch (error) {
            console.error("Error deleting year setting:", error);
            setApiError("An error occurred while deleting the year setting.");
        }
    };
    
    return (
        <div className="grid grid-row-3 gap-4 overflow-hidden">
            {/* Card 1 with Year Data Table */}
            <div className="bg-white p-4 rounded border border-gray-500 shadow">
                <h3 className="text-[16px] font-semibold mb-4 text-custome-blue">Year Type</h3>
                <button
                    onClick={handleAddButtonClick}
                    className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue"
                >
                    Add
                </button>
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">S.no</th>
                            <th className="p-2 border">Year Type</th>
                            <th className="p-2 border">Start Date</th>
                            <th className="p-2 border">End Date</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {yearData.length > 0 ? (
                            yearData.map((item, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{index + 1}</td>
                                    <td className="p-2 border">{item.year_type}</td>
                                    <td className="p-2 border">{item.start_date}</td>
                                    <td className="p-2 border">{item.end_date}</td>
                                    <td className="p-2 border">{item.description || "N/A"}</td>
                                    <td className="p-2 border">
                                        <button
                                            className="text-red-500 hover:text-red-700 mr-2"
                                            onClick={() => confirmDelete(item.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-2 border" colSpan="5">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Card 2 for Working Days */}
            <WorkingDays />
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add Year Type</h2>
                        {apiError && <p className="text-red-600 mb-2">{apiError}</p>}
                        <form onSubmit={handleYearSubmit}>
                            <div className="mb-4">
                                <label htmlFor="year_type" className="block font-medium ">Year Type</label>
                                <select
                                    name="year_type"
                                    value={formData.year_type}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                >
                                    <option value="">Select Year Type</option>
                                    <option value="calendar">Calendar</option>
                                    <option value="financial">Financial</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="start_date" className="block font-medium">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="end_date" className="block font-medium">End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block font-medium">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Popup */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this year setting?</p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setDeleteConfirm({ show: false, id: null })}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YourComponent;
