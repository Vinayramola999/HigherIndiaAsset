import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faFilePdf,faFileExcel } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axios from 'axios';

const HolidayManager = () => {
    const [isHolidayPopupOpen, setIsHolidayPopupOpen] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [apiError, setApiError] = useState(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [holidayFormData, setHolidayFormData] = useState({
        holiday_name: '',
        holiday_date: '',
        description: '',
    });

    const fetchHolidayData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://intranet.higherindia.net:3006/yrset/holidays', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setHolidays(response.data);
        } catch (error) {
            setApiError('An error occurred while fetching holidays.');
        }
    };

    useEffect(() => {
        fetchHolidayData();
    }, []);

    const handleHolidayChange = (e) => {
        const { name, value } = e.target;
        setHolidayFormData({
            ...holidayFormData,
            [name]: value,
        });
    };

    const handleHolidaySubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        try {
            const token = localStorage.getItem('token');

            await axios.post('http://intranet.higherindia.net:3006/yrset/holidays', [holidayFormData], {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setIsHolidayPopupOpen(false);
            setHolidayFormData({
                holiday_name: '',
                holiday_date: '',
                description: '',
            });
            fetchHolidayData();
        } catch (error) {
            setApiError("An error occurred while adding the holiday.");
        }
    };

    const confirmDelete = (holiday) => {
        setSelectedHoliday(holiday);
        setIsDeletePopupOpen(true);
    };

    const handleDelete = async () => {
        if (selectedHoliday) {
            setApiError(null);
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from localStorage

                await axios.delete('http://intranet.higherindia.net:3006/yrset/holidays', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Add token to the header
                    },
                    data: {
                        holiday_name: selectedHoliday.holiday_name,
                        holiday_date: selectedHoliday.holiday_date,
                    },
                });
                setIsDeletePopupOpen(false);
                setSelectedHoliday(null);
                fetchHolidayData();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    setApiError(error.response.data.error); // Set error message from server
                } else {
                    setApiError('An error occurred while deleting the holiday.');
                }
            }
        }
    };

    const handleCancelDelete = () => {
        setIsDeletePopupOpen(false);
        setSelectedHoliday(null);
    };

    const handleCancel = () => {
        setIsHolidayPopupOpen(false);
        setHolidayFormData({
            holiday_name: '',
            holiday_date: '',
            description: '',
        });
    };
    // Generate PDF function
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Holiday List", 20, 10);
        doc.autoTable({
            head: [['S.no.', 'Holiday Name', 'Holiday Date', 'Description']],
            body: holidays.map((holiday, index) => [
                index + 1,
                holiday.holiday_name,
                holiday.holiday_date,
                holiday.description,
            ]),
        });
        doc.save('holidays.pdf');
    };
    // Generate Excel function
    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(holidays.map((holiday, index) => ({
            "S.no.": index + 1,
            "Holiday Name": holiday.holiday_name,
            "Holiday Date": holiday.holiday_date,
            "Description": holiday.description,
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Holidays");
        XLSX.writeFile(workbook, 'holidays.xlsx');
    };
    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <button
                    onClick={() => setIsHolidayPopupOpen(true)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-3xl hover:bg-blue-700"
                >
                    Add Holiday
                </button>
                <div className="space-x-4">
                    <button onClick={downloadPDF} className="text-red-600 hover:text-red-800">
                        <FontAwesomeIcon icon={faFilePdf} size="2x" />
                    </button>
                    <button onClick={downloadExcel} className="text-green-600 hover:text-green-800">
                        <FontAwesomeIcon icon={faFileExcel} size="2x" />
                    </button>
                </div>
            </div>

            {isHolidayPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Add Holiday</h2>
                        <form onSubmit={handleHolidaySubmit}>
                            <div className="mb-4">
                                <label htmlFor="holiday_name" className="block font-medium">Holiday Name</label>
                                <input
                                    type="text"
                                    name="holiday_name"
                                    value={holidayFormData.holiday_name}
                                    onChange={handleHolidayChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="holiday_date" className="block font-medium">Holiday Date</label>
                                <input
                                    type="date"
                                    name="holiday_date"
                                    value={holidayFormData.holiday_date}
                                    onChange={handleHolidayChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block font-medium">Description</label>
                                <textarea
                                    name="description"
                                    value={holidayFormData.description}
                                    onChange={handleHolidayChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Holiday</button>
                            </div>
                            {apiError && <p className="text-red-500 mt-2">{apiError}</p>}
                        </form>
                    </div>
                </div>
            )}

            {isDeletePopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        {apiError && <p className="text-red-500 mt-2 ">{apiError}</p>}
                        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                        <p>Are you sure you want to delete the holiday <strong>{selectedHoliday?.holiday_name}</strong>?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleCancelDelete} className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2">Cancel</button>
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <table className="min-w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">S.no.</th>
                        <th className="border border-gray-300 px-4 py-2">Holiday Name</th>
                        <th className="border border-gray-300 px-4 py-2">Holiday Date</th>
                        <th className="border border-gray-300 px-4 py-2">Description</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {holidays.map((holiday, index) => (
                        <tr key={holiday.id}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border border-gray-300 px-4 py-2">{holiday.holiday_name}</td>
                            <td className="border border-gray-300 px-4 py-2">{holiday.holiday_date}</td>
                            <td className="border border-gray-300 px-4 py-2">{holiday.description}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    className="text-red-500 hover:text-red-700 mr-2"
                                    onClick={() => confirmDelete(holiday)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default HolidayManager;