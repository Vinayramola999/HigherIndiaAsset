import { useState, useEffect } from 'react';
import axios from 'axios';

const defaultWorkingDaysByYearType = {
    calendar: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    financial: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export default function WorkingDaysComponent() {
    const [formData, setFormData] = useState({
        year_type: '',
        start_date: '',
        end_date: '',
        description: '',
    });
    const [selectedDays, setSelectedDays] = useState([]);
    const [workingDayData, setWorkingDayData] = useState({});
    const [apiError, setApiError] = useState(null);

    const fetchWorkingDaysData = async () => {
        try {
            const token = localStorage.getItem('token');    
            const response = await axios.get('http://higherindia.net:3006/yrset/days', {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                }
            });
            setWorkingDayData(response.data); 
        } catch (error) {
            console.error("Error fetching working days data:", error);
        }
    };
    
    useEffect(() => {
        fetchWorkingDaysData(); 
    }, []);

    const handleYearTypeChange = (e) => {
        const selectedYearType = e.target.value;
        setFormData({ ...formData, year_type: selectedYearType });
        if (selectedYearType) {
            const daysForYearType = workingDayData[selectedYearType] || defaultWorkingDaysByYearType[selectedYearType] || [];
            setSelectedDays(daysForYearType);
        }
    };

    const handleWorkingDayChange = (day) => {
        setSelectedDays((prevDays) =>
            prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
        );
    };

    const handleWorkingDaysSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        try {
            const token = localStorage.getItem('token');    
            const response = await axios.post('http://higherindia.net:3006/yrset/days', {
                year_type: formData.year_type,
                working_day: selectedDays,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                }
            });   
            console.log('Working days submitted successfully:', response.data);
            fetchWorkingDaysData(); 
        } catch (error) {
            setApiError("An error occurred while submitting the working days.");
        }
    };
    
    return (
        <div className="bg-white p-4 rounded border border-gray-500 shadow scroll-my-10">
            <h3 className="text-[16px]  text-custome-blue font-bold ">Working Days</h3>
            <div className='flex justify-between mb-3'>
                
                {/* Year Type Selection */}
                <div className="mt-4">
                    <h4 className="font-medium">Select Year Type</h4>
                    <select
                        name="year_type"
                        value={formData.year_type}
                        onChange={handleYearTypeChange}
                        className="w-30 border border-gray-300 p-2 rounded mt-2"
                        required
                    >
                        <option value="">Select Year Type</option>
                        <option value="calendar">Calendar</option>
                        <option value="financial">Financial</option>
                    </select>
                </div>

                {/* Working Days Selection */}
                <div className="mt-4">
                    <h4 className="font-medium">Select Working Days</h4>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <label key={day} className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                value={day}
                                checked={selectedDays.includes(day)}
                                onChange={() => handleWorkingDayChange(day)}
                                className="mr-2"
                            />
                            {day}
                        </label>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                    <button
                        onClick={handleWorkingDaysSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                    {apiError && <p className="text-red-600 mt-2">{apiError}</p>}
                </div>
            </div>
        </div>
    );
}

