import React, { useState, useEffect } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Sidebar/HRMSidebar';
import axios from "axios";

const DepreciationPage = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('WDV');
  const [showModal, setShowModal] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [depreciationValue, setDepreciationValue] = useState('');
  const [data, setData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateOption, setDateOption] = useState('custom'); // New state for date range option

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://intranet.higherindia.net:8443/api/categories/fetch');
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://intranet.higherindia.net:8443/test/depr/getall');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'view') {
      setShowModal(true);
      setShowTable(false);
    } else {
      setShowModal(false);
    }
  };

  const fetchViewData = async () => {
    const formattedStartDate = dateOption === 'custom' ? startDate : ''; // Only set if custom
  
    try {
      let endpoint = '';
      if (dateOption === 'today') {
        if (selectedMethod === 'WDV') {
          endpoint = `https://intranet.higherindia.net:8443/api/dep/calculateWDB/${selectedCategory}`;
        } else if (selectedMethod === 'SLM') {
          endpoint = `https://intranet.higherindia.net:8443/api/dep/calculateDepreciation/${selectedCategory}`;
        }
      } else if (dateOption === 'custom' && formattedStartDate) {
        if (selectedMethod === 'WDV') {
          endpoint = `https://intranet.higherindia.net:8443/api/dep/calculateWDBToDate/category/${selectedCategory}?startDate=${formattedStartDate}`;
        } else if (selectedMethod === 'SLM') {
          endpoint = `https://intranet.higherindia.net:8443/api/dep/calculateSlmDepreciationToDate/category/${selectedCategory}?startDate=${formattedStartDate}`;
        }
      }
  
      if (endpoint) {
        const response = await fetch(endpoint);
        const result = await response.json();
        setViewData(result); // Set the data received
        setShowTable(true);   // Display the table once data is fetched
        setShowModal(false);  // Close the modal
      }
    } catch (error) {
      console.error('Error fetching depreciation data:', error);
      setShowModal(false); // Close the modal on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      categoriesname: selectedCategory,
      assertName: 'Laptop',
      deprecessionPercentage: parseFloat(depreciationValue),
      createdBy: 'Admin',
    };

    try {
      const response = await fetch('https://intranet.higherindia.net:8443/test/depr/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedData = await fetch('https://intranet.higherindia.net:8443/test/depr/getall');
        const result = await updatedData.json();
        setData(result);
        resetForm();
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setSelectedCategory(item.categoriesname);
    setDepreciationValue(item.deprecessionPercentage);
    setShowModal(true);
  };
  const handleViewSubmit = async () => {
    if (selectedCategory) {
      await fetchViewData(); // Fetch the data based on the selected method and date option
      setShowModal(false); // Close the modal after fetching data
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const payload = {
      ...editingItem,
      categoriesname: selectedCategory,
      deprecessionPercentage: parseFloat(depreciationValue),
    };

    try {
      const response = await fetch(`https://intranet.higherindia.net:8443/test/depr/update/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedData = await fetch('https://intranet.higherindia.net:8443/test/depr/getall');
        const result = await updatedData.json();
        setData(result);
        resetForm();
      } else {
        console.error('Failed to update data');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://intranet.higherindia.net:8443/test/depr/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedData = await fetch('https://intranet.higherindia.net:8443/test/depr/getall');
        const result = await updatedData.json();
        setData(result);
      } else {
        console.error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const resetForm = () => {
    setSelectedCategory('');
    setDepreciationValue('');
    setEditingItem(null);
    setShowModal(false);
    setShowTable(false);
  };

  const exportToCSV = () => {
    const csvData = [
      ['Sr. No.', 'Category', 'Asset', 'Original Cost', selectedMethod === 'SLM' ? 'SLM Depreciation' : 'WDV Depreciation', 'Time Stamp'],
      ...viewData.map((item, index) => [
        index + 1,
        item.categoriesName,
        item.assetName,
        item.originalCost,
        selectedMethod === 'SLM' ? item.slmDepreciation : item.wdvDepreciation,
        new Date(item.timeStamp).toLocaleString()
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'depreciation_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  }, [token, userId]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const response = await axios.post('http://higherindia.net:3006/verify-token', { token });
        console.log('Token is valid:', response.data);
        navigate('/Depreciation');
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
    <div className='flex flex-col overflow-hidden'>
      <div className='flex'>
        <Sidebar />
        <div className="p-6 w-full">
          {/********************* HEADER START *****************/}
          <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg mb-3">
            <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
              <FaHome className="text-white mr-2" size={25} />
            </button>
            <h1 className="text-white text-2xl font-bold">Depreciation</h1>
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
                </button>
              </div>
            )}
          </div>
          {/*************************HEADER END *************** */}
          {/* Tabs and setup */}
          <div className="relative flex justify-left space-x-8 mb-6 border-b border-gray-300">
            <button
              className={`px-6 py-2 text-sm md:text-lg font-semibold relative focus:outline-none transition duration-300 ${activeTab === 'setup' ? 'text-blue-600' : 'text-gray-600'}`}
              onClick={() => handleTabSwitch('setup')}
            >
              Setup WDV
              {activeTab === 'setup' && <div className="absolute left-0 right-0 h-1 bg-blue-600 bottom-0 transition-all duration-300"></div>}
            </button>

            <button
              className={`px-6 py-2 text-sm md:text-lg font-semibold relative focus:outline-none transition duration-300 ${activeTab === 'view' ? 'text-blue-600' : 'text-gray-600'}`}
              onClick={() => handleTabSwitch('view')}
            >
              View Depreciation
              {activeTab === 'view' && <div className="absolute left-0 right-0 h-1 bg-blue-600 bottom-0 transition-all duration-300"></div>}
            </button>
          </div>

          {/* Setup WDV Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            {activeTab === 'setup' ? (
              <div>
                {/* Form for adding/editing depreciation data */}
                <div className="flex md:grid-cols-3 gap-4 mb-7">
                  <div className="flex flex-col">
                    <label htmlFor="categories" className="mb-2 text-gray-700 font-semibold">
                      Select Category
                    </label>
                    <select
                      id="categories"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-[250px]"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category, i) => (
                        <option key={i} value={category.categoriesname}>
                          {category.categoriesname}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="depreciation" className="mb-2 text-gray-700 font-semibold">
                      Depreciation Value (%)
                    </label>
                    <input
                      id="depreciation"
                      type="number"
                      value={depreciationValue}
                      onChange={(e) => setDepreciationValue(e.target.value)}
                      placeholder="Enter Dep Value"
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-[250px]"
                    />
                  </div>

                  <div className="flex items-end">
                    <button onClick={editingItem ? handleUpdate : handleSubmit} className="w-[250px] px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300">
                      {editingItem ? 'Update' : 'Submit'}
                    </button>
                  </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gray-300 sticky top-0">
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Sr. No.</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Category</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Depreciation [%]</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Time Stamp</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Created By</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border text-gray-700">{index + 1}</td>
                          <td className="px-4 py-2 border text-gray-700">{item.categoriesname}</td>
                          <td className="px-4 py-2 border text-gray-700">{item.deprecessionPercentage}</td>
                          <td className="px-4 py-2 border text-gray-700">{new Date(item.createdat).toLocaleString()}</td>
                          <td className="px-4 py-2 border text-gray-700">{item.createdBy}</td>
                          <td className="px-4 py-2 border text-gray-700">
                            <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 ml-2">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                {/* View Depreciation Modal */}
                {showModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[800px]">
                      <h2 className="text-lg font-bold mb-4">Select Method</h2>
                      <div className="mb-4">
                        <label>
                          <input
                            type="radio"
                            value="WDV"
                            checked={selectedMethod === 'WDV'}
                            onChange={() => setSelectedMethod('WDV')}
                            className="mr-2"
                          />
                          WDV
                        </label>
                      </div>
                      <div className="mb-4">
                        <label>
                          <input
                            type="radio"
                            value="SLM"
                            checked={selectedMethod === 'SLM'}
                            onChange={() => setSelectedMethod('SLM')}
                            className="mr-2"
                          />
                          SLM
                        </label>
                      </div>

                      {/* Category and Date Range */}
                      <div className="flex flex-col mb-4">
                        <label htmlFor="categories" className="mb-2 text-gray-700 font-semibold">
                          Select Category
                        </label>
                        <select
                          id="categories"
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-full"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category, i) => (
                            <option key={i} value={category.categoriesname}>
                              {category.categoriesname}
                            </option>
                          ))}
                        </select>
                      </div>

                               {/* Date Range Options */}
                               <div className="mb-4">
  <label className="text-gray-700 font-semibold">As on</label>
  <div className="flex space-x-4 mt-2">
    <button
      onClick={() => {
        setDateOption('today'); // Select "Today" option
        setStartDate(''); // Clear any custom date
      }}
      className={`px-4 py-2 text-sm font-semibold ${dateOption === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
    >
      Today
    </button>
    <button
      onClick={() => setDateOption('custom')} // Select "Custom" option
      className={`px-4 py-2 text-sm font-semibold ${dateOption === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
    >
      Custom date
    </button>
  </div>
</div>

                                       {/* Custom Range Inputs */}
{dateOption === 'custom' && (
  <div className="flex gap-4 mb-4">
    <div className="flex flex-col w-full">
      <label htmlFor="startDate" className="mb-2 text-gray-700 font-semibold">
        Select Date
      </label>
      <input
        type="date"
        id="startDate"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)} // Set the custom start date
        className="px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 w-full"
      />
    </div>
  </div>
)}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                      onClick={handleViewSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}


                {/* View Depreciation Table */}
                {showTable && (
                  <div>
                    <button
                      onClick={exportToCSV}
                      className="mb-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-300"
                    >
                      Export to CSV
                    </button>
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Sr. No.</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Category</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Asset</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Original Cost</th>
                            {selectedMethod === 'SLM' && (
                              <th className="px-4 py-2 text-left font-semibold text-gray-600">SLM Depreciation</th>
                            )}
                            {selectedMethod === 'WDV' && (
                              <th className="px-4 py-2 text-left font-semibold text-gray-600">WDV Depreciation</th>
                            )}
                            <th className="px-4 py-2 text-left font-semibold text-gray-600">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewData.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-gray-700">{index + 1}</td>

                              {/* Category Column */}
                              {selectedMethod === 'SLM' && (
                                <td className="px-4 py-2 text-gray-700">{item['Categories Name']}</td> // SLM Category
                              )}
                              {selectedMethod === 'WDV' && (
                                <td className="px-4 py-2 text-gray-700">{item['CategoriesName']}</td> // WDV Category (slightly different key)
                              )}

                              {/* Asset Column */}
                              {selectedMethod === 'SLM' && (
                                <td className="px-4 py-2 text-gray-700">{item['Assert Name']}</td> // SLM Asset Name
                              )}
                              {selectedMethod === 'WDV' && (
                                <td className="px-4 py-2 text-gray-700">{item['Asset Name']}</td> // WDV Asset Name (different key)
                              )}

                              {/* Original Cost Column */}
                              <td className="px-4 py-2 text-gray-700">{item['Original Cost']}</td>

                              {/* Depreciation Column */}
                              {selectedMethod === 'SLM' && (
                                <td className="px-4 py-2 text-gray-700">{item['Slm Depreciation']}</td> // SLM Depreciation
                              )}
                              {selectedMethod === 'WDV' && (
                                <td className="px-4 py-2 text-gray-700">{item['Wdb Value']}</td> // WDV Depreciation (Wdb Value)
                              )}

                              {/* Date Column */}
                              <td className="px-4 py-2 text-gray-700">{new Date(item['Date Of Purchase']).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DepreciationPage;