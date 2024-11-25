import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocation, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { FaHome, FaSignOutAlt, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/HRMSidebar';
import SuccessModal from '../SuccessModal';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import excel from '../assests/excel.png'
import { Country, State, City } from "country-state-city";

const LocationsTable = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [newLocationData, setNewLocationData] = useState({
        locality: '',
        country: '',
        state: '',
        city: '',
        code: '',
        remarks: ''
    });
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        // Fetch all countries on component mount
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
    }, []);

    const handleCountryChange = (countryCode) => {
        setNewLocationData({
            ...newLocationData,
            country: countryCode,
            state: "",
            city: "",
        });

        const statesList = State.getStatesOfCountry(countryCode);
        setStates(statesList);
        setCities([]); // Reset cities
    };

    const handleStateChange = (stateCode) => {
        setNewLocationData({
            ...newLocationData,
            state: stateCode,
            city: "",
        });

        try {
            const cityList = City.getCitiesOfState(newLocationData.country, stateCode);
            setCities(cityList || []); // Use empty array as fallback
        } catch (error) {
            console.error("Error fetching cities:", error);
            const fallbackCities = City.getAllCities().filter(
                (city) =>
                    city.stateCode === stateCode &&
                    city.countryCode === newLocationData.country
            );
            setCities(fallbackCities);
        }
    };

    const [userData, setUserData] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAddModalOpen1, setIsAddModalOpen1] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formError, setFormError] = useState('');
    const [locationToDelete, setLocationToDelete] = useState(null);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiry');
        navigate('/');
    };

    const handleHome = () => {
        navigate('/Cards1');
    };

    const confirmDelete = (location) => {
        setLocationToDelete(location);
        setIsDeleteModalOpen(true);
    };

    const handleAddLocation = async () => {
        const { locality, country, state, city, code, remarks } = newLocationData;

        // Check for required fields
        if (!locality || !country || !state || !city || !code || !remarks) {
            setFormError('All fields are required');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://intranet.higherindia.net:3006/loc', newLocationData);
            setLocations([...locations, response.data.location]);
            setNewLocationData({ locality: '', country: '', state: '', city: '', code: '', remarks: '' });
            setIsAddModalOpen(false);
            setSuccess(true);
            setFormError('');  // Clear error on successful form submission
        } catch (error) {
            console.error('Error adding location:', error);
            setFormError('Failed to add location.');  // Set error if API call fails
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(locations);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations');

        // Create a buffer and save it as an Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, 'locations.xlsx');
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
        const fetchLocation = async () => {
            try {
                const response = await axios.get('http://intranet.higherindia.net:3006/loc');
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocation();
    }, []);

    const [success, setSuccess] = useState(false);


    const handleDelete = async (id) => {
        try {
            await axios.delete('http://intranet.higherindia.net:3006/loc', { data: { id } });
            setLocations(locations.filter(location => location.location_id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting location:', error);
            alert('Failed to delete location.');
        }
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subLocations, setSubLocations] = useState([]);

    const [formData, setFormData] = useState({
        location: "",
        buildingNo: "",
        floorNo: "",
        roomDescription: "",
        otherDescription: "",
    });

    const [loading, setLoading] = useState(false);

    // Fetch locations from the API
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch("http://intranet.higherindia.net:3006/loc"); // Replace with your API endpoint
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, []);

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    //Sub Location
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Construct the payload using the location_id and form data
            const payload = {
                location_id: newLocationData.location_id, // Ensure this is set correctly
                building_no: formData.buildingNo,
                floor: formData.floorNo,
                room: formData.roomDescription,
                section: formData.otherDescription,
                description: formData.roomDescription,
            };

            const response = await fetch("http://intranet.higherindia.net:3006/sloc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message); // Show success message

                // Reset form data
                setFormData({
                    buildingNo: "",
                    floorNo: "",
                    roomDescription: "",
                    otherDescription: "",
                });

                setIsAddModalOpen1(false); // Close modal
            } else {
                console.error("Error adding sub-location");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = async (location) => {
        if (!location?.sub_location_id) {
            console.error("Invalid sub_location_id");
            return;
        }
        try {
            setLoading(true);

            const response = await fetch(`http://intranet.higherindia.net:3006/sloc/${location.sub_location_id}`);
            if (response.ok) {
                const result = await response.json();

                if (result.sub_locations && result.sub_locations.length > 0) {
                    setSubLocations(result.sub_locations); // Update state with fetched data
                } else {
                    console.warn("No sub-locations found");
                    setSubLocations([]); // Set empty state if no data is returned
                }

                setIsModalOpen(true); // Open modal
            } else {
                console.error("Error fetching sub-locations");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 w-full">
                {/* Header */}
                <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                    <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
                        <FaHome className="text-white mr-2" size={25} />
                    </button>
                    <h1 className="text-white text-2xl font-bold">Location</h1>
                    {userData && (
                        <div className="ml-auto flex items-center gap-4">
                            <div className="bg-white rounded-3xl p-2 flex items-center">
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-semibold text-custome-black">
                                        {userData.first_name} {userData.last_name}
                                    </h3>
                                </div>
                            </div>
                            <button onClick={handleLogout} type="button" className="bg-white flex items-center p-2 rounded-full">
                                <FaSignOutAlt className="text-black mr-2" size={20} />
                                <span className="text-black font-semibold"></span>
                            </button>
                        </div>
                    )}
                </div>
                {/* END */}

                <div className="flex items-center justify-between mt-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue"
                    >
                        Add Location
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className="text-green-500 hover:text-green-500 flex items-center"
                    >
                        <img src={excel} alt="logo" className="w-8 h-8" />
                    </button>
                </div>

                {/* Add Location Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            {formError && <p className="text-red-500 mb-4 items-center">{formError}</p>} {/* Show error message here */}

                            <h2 className="text-xl font-bold mb-4">Add Location</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddLocation();
                                }}
                            >
                                {/* Locality */}
                                <div className="mb-4">
                                    <label htmlFor="locality">
                                        Locality <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="locality"
                                        value={newLocationData.locality}
                                        onChange={(e) =>
                                            setNewLocationData({
                                                ...newLocationData,
                                                locality: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Locality"
                                    />
                                </div>

                                {/* Country Dropdown */}
                                <div className="mb-4">
                                    <label htmlFor="country">
                                        Country <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="country"
                                        value={newLocationData.country}
                                        onChange={(e) => handleCountryChange(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* State Dropdown */}
                                <div className="mb-4">
                                    <label htmlFor="state">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="state"
                                        value={newLocationData.state}
                                        onChange={(e) => handleStateChange(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        disabled={!states.length}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Dropdown */}
                                <div className="mb-4">
                                    <label htmlFor="city">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="city"
                                        value={newLocationData.city}
                                        onChange={(e) =>
                                            setNewLocationData({
                                                ...newLocationData,
                                                city: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        disabled={!cities.length}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Code */}
                                <div className="mb-4">
                                    <label htmlFor="code">Code<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="code"
                                        value={newLocationData.code}
                                        onChange={(e) =>
                                            setNewLocationData({
                                                ...newLocationData,
                                                code: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Code"
                                    />
                                </div>

                                {/* Remarks */}
                                <div className="mb-4">
                                    <label htmlFor="remarks">Remarks<span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="remarks"
                                        value={newLocationData.remarks}
                                        onChange={(e) =>
                                            setNewLocationData({
                                                ...newLocationData,
                                                remarks: e.target.value,
                                            })
                                        }
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Remarks"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddModalOpen(false); // Close the modal
                                            setNewLocationData({
                                                locality: '',
                                                country: '',
                                                state: '',
                                                city: '',
                                                code: '',
                                                remarks: '',
                                            });
                                        }}
                                        className="mr-4 bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Add Location
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                )}

                <SuccessModal
                    success={success}
                    setSuccess={setSuccess}
                    message="Location Added Successfully!"
                />

                {/* Add Sub-Location Modal */}
                {isAddModalOpen1 && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold mb-4">Add Sub Location</h2>
                                <button
                                    onClick={() => setIsAddModalOpen1(false)}
                                    className="text-red-500 text-xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                {/* Fields */}
                                {/* Building No */}
                                <div className="mb-4">
                                    <label htmlFor="buildingNo" className="block font-medium mb-1">Building No.</label>
                                    <input
                                        type="text"
                                        id="buildingNo"
                                        name="buildingNo"
                                        value={formData.buildingNo}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Building No."
                                    />
                                </div>
                                {/* Floor */}
                                <div className="mb-4">
                                    <label htmlFor="floorNo" className="block font-medium mb-1">Floor No.</label>
                                    <input
                                        type="text"
                                        id="floorNo"
                                        name="floorNo"
                                        value={formData.floorNo}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Floor No."
                                    />
                                </div>
                                {/* Room Description */}
                                <div className="mb-4">
                                    <label htmlFor="roomDescription" className="block font-medium mb-1">Room Description</label>
                                    <input
                                        type="text"
                                        id="roomDescription"
                                        name="roomDescription"
                                        value={formData.roomDescription}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Enter Room Description"
                                    />
                                </div>
                                {/* Other Description */}
                                <div className="mb-4">
                                    <label htmlFor="otherDescription" className="block font-medium mb-1">Other Description</label>
                                    <textarea
                                        id="otherDescription"
                                        name="otherDescription"
                                        value={formData.otherDescription}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-md p-2"
                                        placeholder="Add Other Description"
                                        rows={3}
                                    ></textarea>
                                </div>
                                {/* Buttons */}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen1(false)}
                                        className="mr-4 text-gray-500 hover:text-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save Sub Location"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-3/4 max-w-4xl relative">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ✖
                            </button>

                            <h2 className="text-[18px] text-custome-blue font-bold my-1 mb-3">
                                Sub Locations
                            </h2>

                            <table className="table-auto w-full border-collapse">
                                <thead className="border-b bg-gray-100">
                                    <tr>
                                        <th className="py-2 px-4 text-left">S.no.</th>
                                        <th className="py-2 px-4 text-left">Sub Location</th>
                                        <th className="py-2 px-4 text-left">Description</th>
                                        <th className="py-2 px-4 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subLocations.map((subLoc, index) => (
                                        <tr key={subLoc.id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4">{index + 1}</td>
                                            <td className="py-2 px-4">{subLoc.name}</td>
                                            <td className="py-2 px-4">{subLoc.description || 'No description'}</td>
                                            <td className="py-2 px-4 flex space-x-2">
                                                {/* <button
                                                    onClick={() => confirmDeleteSubLocation(subLoc.id)}
                                                    className="text-red-500 px-4 py-2 rounded-lg"
                                                    disabled={loading}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button> */}
                                                {/* <button
                                                    onClick={() => handleEditSubLocation(subLoc)}
                                                    className="text-blue-500 px-4 py-2 rounded-lg"
                                                    disabled={loading}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Delete Location Modal */}
                {isDeleteModalOpen && locationToDelete && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Delete Location</h2>
                            <p>Are you sure you want to delete the location: {locationToDelete.locality}?</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="mr-4 text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(locationToDelete.location_id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Locations Table */}
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="py-2 px-4">S.no.</th>
                                <th className="py-2 px-4">Locality</th>
                                <th className="py-2 px-4">Country</th>
                                <th className="py-2 px-4">State</th>
                                <th className="py-2 px-4">City</th>
                                <th className="py-2 px-4">Code</th>
                                <th className="py-2 px-4">Remarks</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.length > 0 ? (
                                locations.map((location, index) => (
                                    <tr key={location.location_id} className={`bg-${index % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                                        <td className="p-4 border-b">{index + 1}</td>
                                        <td
                                            className="p-4 border-b text-blue-500 hover:underline cursor-pointer"
                                            onClick={() => handleOpenModal(location)}
                                        >
                                            {location.locality}
                                        </td>
                                        <td className="p-4 border-b">{location.country}</td>
                                        <td className="p-4 border-b">{location.state}</td>
                                        <td className="p-4 border-b">{location.city}</td>
                                        <td className="p-4 border-b">{location.code}</td>
                                        <td className="p-4 border-b">{location.remarks || 'N/A'}</td>
                                        <td className="p-4 border-b">
                                            <button
                                                onClick={() => confirmDelete(location)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setNewLocationData({ location_id: location.location_id });
                                                    setIsAddModalOpen1(true); // Open the modal
                                                }}
                                                className="text-blue-500 hover:text-blue-700 ml-4"
                                            >
                                                <FontAwesomeIcon icon={faLocation} />
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-4 text-center text-gray-500">No locations found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default LocationsTable;





// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import React, { useState, useEffect } from 'react';
// import { FaHome, FaSignOutAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from './Sidebar/HRMSidebar';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import excel from './assests/excel.png';
// import { Country, State, City } from 'country-state-city';

// const LocationsTable = () => {
//     const navigate = useNavigate();
//     const [locations, setLocations] = useState([]);
//     const [newLocationData, setNewLocationData] = useState({
//         locality: '',
//         country: '',
//         state: '',
//         city: '',
//         code: '',
//         remarks: ''
//     });
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [locationToDelete, setLocationToDelete] = useState(null);
//     const userId = localStorage.getItem('userId');
//     const token = localStorage.getItem('token');

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//         localStorage.removeItem('tokenExpiry');
//         navigate('/');
//     };

//     const handleHome = () => {
//         navigate('/Cards');
//     };

//     const confirmDelete = (location) => {
//         setLocationToDelete(location);
//         setIsDeleteModalOpen(true);
//     };

//     const handleAddLocation = async () => {
//         const { locality, country, state, city, code } = newLocationData;
//         if (!locality || !country || !state || !city || !code) {
//             alert('All fields except remarks are required');
//             return;
//         }
//         try {
//             setLoading(true);
//             const response = await axios.post('http://intranet.higherindia.net:3006/loc', newLocationData);
//             setLocations([...locations, response.data.location]);
//             setNewLocationData({ locality: '', country: '', state: '', city: '', code: '', remarks: '' });
//             setIsAddModalOpen(false);
//         } catch (error) {
//             console.error('Error adding location:', error);
//             alert('Failed to add location.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDownloadExcel = () => {
//         const worksheet = XLSX.utils.json_to_sheet(locations);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations');
//         const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//         const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
//         saveAs(data, 'locations.xlsx');
//     };

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (userId) {
//                 try {
//                     const response = await axios.get(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
//                         headers: { Authorization: `Bearer ${token}` },
//                     });
//                     setUserData(response.data[0]);
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             }
//         };
//         fetchUserData();
//     }, [token, userId]);

//     useEffect(() => {
//         const fetchLocation = async () => {
//             try {
//                 const response = await axios.get('http://intranet.higherindia.net:3006/loc');
//                 setLocations(response.data);
//             } catch (error) {
//                 console.error('Error fetching locations:', error);
//             }
//         };
//         fetchLocation();
//     }, []);

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete('http://intranet.higherindia.net:3006/loc', { data: { id } });
//             setLocations(locations.filter(location => location.location_id !== id));
//             setIsDeleteModalOpen(false);
//         } catch (error) {
//             console.error('Error deleting location:', error);
//             alert('Failed to delete location.');
//         }
//     };

//     useEffect(() => {
//         const handlePopState = () => {
//             navigate('/Cards1');
//         };
//         window.addEventListener('popstate', handlePopState);
//         return () => {
//             window.removeEventListener('popstate', handlePopState);
//         };
//     }, [navigate]);

//     const handleCountryChange = (selectedCountry) => {
//         setNewLocationData({ ...newLocationData, country: selectedCountry.name });
//     };

//     const handleStateChange = (selectedState) => {
//         setNewLocationData({ ...newLocationData, state: selectedState.name });
//     };

//     const handleCityChange = (selectedCity) => {
//         setNewLocationData({ ...newLocationData, city: selectedCity.name });
//     };

//     return (
//         <div className="flex">
//             <Sidebar />
//             <div className="p-6 w-full">
//                 {/* Header */}
//                 <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
//                     <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
//                         <FaHome className="text-white mr-2" size={25} />
//                     </button>
//                     <h1 className="text-white text-2xl font-bold">Location</h1>
//                     {userData && (
//                         <div className="ml-auto flex items-center gap-4">
//                             <div className="bg-white rounded-3xl p-2 flex items-center">
//                                 <div className="flex flex-col">
//                                     <h3 className="text-lg font-semibold text-custome-black">
//                                         {userData.first_name} {userData.last_name}
//                                     </h3>
//                                 </div>
//                             </div>
//                             <button onClick={handleLogout} type="button" className="bg-white flex items-center p-2 rounded-full">
//                                 <FaSignOutAlt className="text-black mr-2" size={20} />
//                                 <span className="text-black font-semibold"></span>
//                             </button>
//                         </div>
//                     )}

//                 </div>
//                 {/* Add Location Button */}
//                 <div className='justify-between flex'>
//                     <button
//                         onClick={() => setIsAddModalOpen(true)}
//                         className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-2xl mb-4 mt-4"
//                     >
//                         Add Location
//                     </button>

//                     <button
//                         onClick={handleDownloadExcel}
//                         className="text-green-500 hover:text-green-500 items-center"
//                     >
//                       <img src={excel} alt="logo" className='mr-5 w-8 h-8'/>
//                     </button>
//                 </div>


//                 {/* Add Location Modal */}
//                 {isAddModalOpen && (
//                     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//                         <div className="bg-white p-6 rounded-lg w-1/3">
//                             <h2 className="text-xl font-bold mb-4">Add Location</h2>
//                             <form onSubmit={(e) => { e.preventDefault(); handleAddLocation(); }}>
//                                 <div className="mb-4">
//                                     <label htmlFor="locality">Locality <span className="text-red-500">*</span></label>
//                                     <input
//                                         type="text"
//                                         id="locality"
//                                         value={newLocationData.locality}
//                                         onChange={(e) => setNewLocationData({ ...newLocationData, locality: e.target.value })}
//                                         className="w-full border border-gray-300 rounded-md p-2"
//                                         placeholder="Enter Locality"
//                                     />
//                                 </div>
//                                 <div className="mb-4">
//                                     <label htmlFor="country">Country <span className="text-red-500">*</span></label>
//                                     <select
//                                         id="country"
//                                         value={newLocationData.country}
//                                         onChange={(e) => handleCountryChange(Country.getCountryByCode(e.target.value))}
//                                         className="w-full border border-gray-300 rounded-md p-2"
//                                     >
//                                         <option value="">Select Country</option>
//                                         {Country.getAllCountries().map((country) => (
//                                             <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label htmlFor="state">State <span className="text-red-500">*</span></label>
//                                     <select
//                                         id="state"
//                                         value={newLocationData.state}
//                                         onChange={(e) => handleStateChange(State.getStateByCodeAndCountry(e.target.value, newLocationData.country))}
//                                         className="w-full border border-gray-300 rounded-md p-2"
//                                         disabled={!newLocationData.country}
//                                     >
//                                         <option value="">Select State</option>
//                                         {State.getStatesOfCountry(newLocationData.country).map((state) => (
//                                             <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label htmlFor="city">City <span className="text-red-500">*</span></label>
//                                     <select
//                                         id="city"
//                                         value={newLocationData.city}
//                                         onChange={(e) => handleCityChange(City.getCityByCodeAndState(e.target.value, newLocationData.state))}
//                                         className="w-full border border-gray-300 rounded-md p-2"
//                                         disabled={!newLocationData.state}
//                                     >
//                                         <option value="">Select City</option>
//                                         {City.getCitiesOfState(newLocationData.state).map((city) => (
//                                             <option key={city.isoCode} value={city.isoCode}>{city.name}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label htmlFor="code">Code <span className="text-red-500">*</span></label>
//                                     <input
//                                         type="text"
//                                         id="code"
//                                         value={newLocationData.code}
//                                         onChange={(e) => setNewLocationData({ ...newLocationData, code: e.target.value })}
//                                         className="w-full border border-gray-300 rounded-md p-2"
//                                         placeholder="Enter Code"
//                                     />
//                                 </div>
//                                 <div className="mb-4">
//                                     <label htmlFor="remarks">Remarks</label>
//                                     <textarea
//                                         id="remarks"
//                                         value={newLocationData.remarks}
//                                         onChange={(e) => setNewLocationData({ ...newLocationData, remarks: e.target.value })}
//                                         className="w-full border border-gray-300 rounded-md p-2"
//                                         placeholder="Enter Remarks (Optional)"
//                                     ></textarea>
//                                 </div>
//                                 <div className="flex justify-end">
//                                     <button
//                                         onClick={() => setIsAddModalOpen(false)}
//                                         className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="bg-custome-blue text-white px-4 py-2 rounded-md"
//                                         disabled={loading}
//                                     >
//                                         {loading ? 'Adding...' : 'Add'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}

//                 {/* Delete Confirmation Modal */}
//                 {isDeleteModalOpen && (
//                     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//                         <div className="bg-white p-6 rounded-lg w-1/3">
//                             <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
//                             <p>Are you sure you want to delete this location?</p>
//                             <div className="flex justify-end mt-4">
//                                 <button
//                                     onClick={() => setIsDeleteModalOpen(false)}
//                                     className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(locationToDelete.location_id)}
//                                     className="bg-red-500 text-white px-4 py-2 rounded-md"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Locations Table */}
//                 <div className="overflow-x-auto">
//                     <table className="w-full bg-white shadow-lg">
//                         <thead>
//                             <tr className="bg-gray-200">
//                                 <th className="py-2 px-4">Locality</th>
//                                 <th className="py-2 px-4">Country</th>
//                                 <th className="py-2 px-4">State</th>
//                                 <th className="py-2 px-4">City</th>
//                                 <th className="py-2 px-4">Code</th>
//                                 <th className="py-2 px-4">Remarks</th>
//                                 <th className="py-2 px-4">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {locations.map((location, index) => (
//                                 <tr key={location.location_id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
//                                     <td className="py-2 px-4">{location.locality}</td>
//                                     <td className="py-2 px-4">{location.country}</td>
//                                     <td className="py-2 px-4">{location.state}</td>
//                                     <td className="py-2 px-4">{location.city}</td>
//                                     <td className="py-2 px-4">{location.code}</td>
//                                     <td className="py-2 px-4">{location.remarks}</td>
//                                     <td className="py-2 px-4">
//                                         <button
//                                             onClick={() => confirmDelete(location)}
//                                             className="text-red-500 hover:text-red-700"
//                                         >
//                                             <FontAwesomeIcon icon={faTrash} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default LocationsTable;