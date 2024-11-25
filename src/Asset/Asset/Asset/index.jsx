

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AssetManagementPage = () => {
//   const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [dynamicFields, setDynamicFields] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [tableData, setTableData] = useState({ columns: [], data: [] });
//   const [searchTerm, setSearchTerm] = useState(""); // State for search input
//   const [filteredData, setFilteredData] = useState([]); // State for filtered table data

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Fetch categories when the component mounts
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://higherindia.net:9898/api/categories/fetch");
//         setCategories(response.data || []);
//       } catch (error) {
//         console.error("Error fetching categories:", error.message);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch dynamic fields and table data based on the selected category
//   const fetchTableData = async (categoryName) => {
//     try {
//       const response = await axios.get(`http://higherindia.net:9898/api/tables/table-data/${categoryName}`);
//       setTableData({
//         columns: response.data.columns || [],
//         data: response.data.data || [],
//       });
//       setDynamicFields(response.data.columns || []);
//       setFilteredData(response.data.data || []); // Initialize filtered data
//     } catch (error) {
//       console.error("Error fetching table data:", error.message);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (name === 'category') {
//       setSelectedCategory(value);
//       fetchTableData(value);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { category, ...payloadToSend } = formData;
//       const response = await axios.post(`http://higherindia.net:9898/api/tables/insert/${selectedCategory}`, payloadToSend, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       console.log('Form submitted successfully:', response.data);

//       await fetchTableData(selectedCategory);
//       setIsAssetModalOpen(false);
//     } catch (error) {
//       console.error("Error submitting form:", error.message);
//     }
//   };

//   // Handle search term changes and update filtered data
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = tableData.data.filter((row) =>
//       Object.values(row).some((val) =>
//         val.toString().toLowerCase().includes(e.target.value.toLowerCase())
//       )
//     );
//     setFilteredData(filtered);
//   };

//   // Pagination logic
//   const paginate = (data) => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return data.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   return (
//     <div className="p-4 md:p-5 flex flex-col space-y-6 min-h-screen">
//       {/* Add Asset Button, Category Dropdown, and Search Input */}
//       <div className="flex items-center justify-between flex-wrap space-y-4 md:space-y-0">
//         {/* Left Section: Add Asset Button and Category Dropdown */}
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => setIsAssetModalOpen(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg w-[200px]"
//           >
//             + Add Asset
//           </button>

//           <div className="flex flex-col">
//             <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700"></label>
//             <select
//               name="category"
//               value={selectedCategory}
//               onChange={handleChange}
//               className="p-2 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-[#F0F0F0] w-[200px]"
//               required
//             >
//               <option value="">Select a category</option>
//               {categories.map((category, i) => (
//                 <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Right Section: Search Bar */}
//         <div className="w-full md:w-1/3 lg:w-1/4 mt-4 md:mt-0">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="px-3 py-2 border rounded-lg w-[300px]"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto h-[698px]">
//         <table className="min-w-full table-auto border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-300 sticky top-0">
//               {tableData.columns.map((column, index) => (
//                 <th key={index} className="px-2 md:px-4 py-2 border">{column}</th>
//               ))}
//               <th className="px-2 md:px-4 py-2 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginate(filteredData).map((row, index) => (
//               <tr key={index} className="even:bg-gray-100">
//                 {tableData.columns.map((column, colIndex) => (
//                   <td key={colIndex} className="px-2 md:px-4 py-2 border">
//                     {row[column] || ""}
//                   </td>
//                 ))}
//                 <td className="px-2 md:px-4 py-2 border">

//                   <button className="text-green-600 mx-1 md:mx-2">Edit</button>
//                   <button className="text-red-600 mx-1 md:mx-2">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Section
//       <div className="flex justify-center mt-4">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
//         >
//           Previous
//         </button>
//         {[...Array(totalPages).keys()].map(page => (
//           <button
//             key={page}
//             onClick={() => handlePageChange(page + 1)}
//             className={`px-4 py-2 ${currentPage === page + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'} hover:bg-gray-300`}
//           >
//             {page + 1}
//           </button>
//         ))}
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300"
//         >
//           Next
//         </button>
//       </div> */}

//       {/* Modal Section */}
//       {isAssetModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
//             <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
//               <h2 className="text-lg font-semibold text-gray-800">Add Asset</h2>
//               <button onClick={() => setIsAssetModalOpen(false)} className="text-red-500">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">Category</label>
//                 <select name="category" value={selectedCategory} onChange={handleChange} className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]" required>
//                   <option value="">Select a category</option>
//                   {categories.map((category, i) => (
//                     <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
//                   ))}
//                 </select>
//               </div>
//               {dynamicFields.map((field, index) => (
//                 <div key={index} className="flex flex-col">
//                   <label htmlFor={field} className="mb-1 text-sm font-medium text-gray-700">{field}</label>
//                   <input type="text" name={field} value={formData[field] || ""} onChange={handleChange} className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]" required />
//                 </div>
//               ))}
//               <div className="col-span-2 flex justify-end mt-4">
//                 <button type="button" onClick={() => setIsAssetModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2">Cancel</button>
//                 <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Save Changes</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssetManagementPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AssetManagementPage = () => {
//   const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [dynamicFields, setDynamicFields] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [tableData, setTableData] = useState({ columns: [], data: [] });
//   const [searchTerm, setSearchTerm] = useState(""); // State for search input
//   const [filteredData, setFilteredData] = useState([]); // State for filtered table data
//   const [editingAssetId, setEditingAssetId] = useState(null); // State for tracking which asset is being edited

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   // Fetch categories when the component mounts
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get("http://higherindia.net:9898/api/categories/fetch");
//         setCategories(response.data || []);
//       } catch (error) {
//         console.error("Error fetching categories:", error.message);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch dynamic fields and table data based on the selected category
//   const fetchTableData = async (categoryName) => {
//     try {
//       const response = await axios.get(`http://higherindia.net:9898/api/tables/table-data/${categoryName}`);
//       setTableData({
//         columns: response.data.columns || [],
//         data: response.data.data || [],
//       });
//       setDynamicFields(response.data.columns || []);
//       setFilteredData(response.data.data || []); // Initialize filtered data
//     } catch (error) {
//       console.error("Error fetching table data:", error.message);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (name === 'category') {
//       setSelectedCategory(value);
//       fetchTableData(value);
//     }
//   };

//   // Handle the form submission (Create or Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { category, ...payloadToSend } = formData;

//       // URL based on editing state (create or update)
//       const url = editingAssetId
//         ? `http://higherindia.net:9898/api/crud/update/${selectedCategory}/${editingAssetId}` // Update
//         : `http://higherindia.net:9898/api/tables/insert/${selectedCategory}`; // Create new

//       const method = editingAssetId ? 'put' : 'post';
//       const response = await axios[method](url, payloadToSend, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       console.log('Form submitted successfully:', response.data);

//       // If editing, update the data in the table with the new values instead of adding a new asset
//       if (editingAssetId) {
//         const updatedData = tableData.data.map((row) =>
//           row.asset_id === editingAssetId ? { ...row, ...response.data } : row
//         );
//         setTableData((prevState) => ({
//           ...prevState,
//           data: updatedData,
//         }));
//       } else {
//         // If creating a new asset, just add the new asset to the table
//         setTableData((prevState) => ({
//           ...prevState,
//           data: [...prevState.data, response.data],
//         }));
//       }

//       // After submitting, fetch the latest table data to reflect changes (no duplicates)
//       setIsAssetModalOpen(false);
//       setEditingAssetId(null); // Reset editing state
//     } catch (error) {
//       console.error("Error submitting form:", error.message);
//     }
//   };

//   // Handle search term changes and update filtered data
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = tableData.data.filter((row) =>
//       Object.values(row).some((val) =>
//         val.toString().toLowerCase().includes(e.target.value.toLowerCase())
//       )
//     );
//     setFilteredData(filtered);
//   };

//   // Pagination logic
//   const paginate = (data) => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return data.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Delete asset function
//   const handleDelete = async (assetId) => {
//     if (selectedCategory) {
//       if (window.confirm('Are you sure you want to delete this asset?')) {
//         try {
//           const url = `http://higherindia.net:9898/api/crud/delete/${selectedCategory}/${assetId}`;
//           const response = await axios.delete(url);
//           console.log("Asset deleted successfully:", response.data);
//           // Remove deleted asset from tableData
//           setTableData((prevState) => ({
//             ...prevState,
//             data: prevState.data.filter((asset) => asset.asset_id !== assetId),
//           }));
//         } catch (error) {
//           console.error("Error deleting asset:", error.message);
//         }
//       }
//     } else {
//       alert("Please select a category first.");
//     }
//   };

//   // Edit asset function
//   const handleEdit = (assetId) => {
//     const asset = tableData.data.find((row) => row.asset_id === assetId);
//     if (asset) {
//       setFormData(asset);
//       setEditingAssetId(assetId); // Mark the asset as being edited
//       setIsAssetModalOpen(true); // Open the modal
//     }
//   };

//   return (
//     <div className="p-4 md:p-5 flex flex-col space-y-6 min-h-screen">
//       {/* Add Asset Button, Category Dropdown, and Search Input */}
//       <div className="flex items-center justify-between flex-wrap space-y-4 md:space-y-0">
//         {/* Left Section: Add Asset Button and Category Dropdown */}
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={() => setIsAssetModalOpen(true)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg w-[200px]"
//           >
//             + Add Asset
//           </button>

//           <div className="flex flex-col">
//             <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700"></label>
//             <select
//               name="category"
//               value={selectedCategory}
//               onChange={handleChange}
//               className="p-2 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-[#F0F0F0] w-[200px]"
//               required
//             >
//               <option value="">Select a category</option>
//               {categories.map((category, i) => (
//                 <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Right Section: Search Bar */}
//         <div className="w-full md:w-1/3 lg:w-1/4 mt-4 md:mt-0">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="px-3 py-2 border rounded-lg w-[300px]"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="overflow-x-auto h-[698px]">
//         <table className="min-w-full table-auto border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-300 sticky top-0">
//               {tableData.columns.map((column, index) => (
//                 <th key={index} className="px-2 md:px-4 py-2 border">{column}</th>
//               ))}
//               <th className="px-2 md:px-4 py-2 border">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginate(filteredData).map((asset, index) => (
//               <tr key={index} className="even:bg-gray-100">
//                 {tableData.columns.map((column, colIndex) => (
//                   <td key={colIndex} className="px-2 md:px-4 py-2 border">
//                     {asset[column] || ""}
//                   </td>
//                 ))}
//                 <td className="px-2 md:px-4 py-2 border">
//                   <button
//                     className="text-green-600 mx-1 md:mx-2"
//                     onClick={() => handleEdit(asset.asset_id)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="text-red-600 mx-1 md:mx-2"
//                     onClick={() => handleDelete(asset.asset_id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal Section */}
//       {isAssetModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
//             <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {editingAssetId ? "Edit Asset" : "Add Asset"}
//               </h2>
//               <button onClick={() => setIsAssetModalOpen(false)} className="text-red-500">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div className="flex flex-col">
//                 <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">Category</label>
//                 <select name="category" value={selectedCategory} onChange={handleChange} className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]" required>
//                   <option value="">Select a category</option>
//                   {categories.map((category, i) => (
//                     <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
//                   ))}
//                 </select>
//               </div>
//               {dynamicFields.map((field, index) => (
//                 <div key={index} className="flex flex-col">
//                   <label htmlFor={field} className="mb-1 text-sm font-medium text-gray-700">{field}</label>
//                   <input
//                     type="text"
//                     name={field}
//                     value={formData[field] || ""}
//                     onChange={handleChange}
//                     className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]"
//                     required
//                   />
//                 </div>
//               ))}
//               <div className="col-span-2 flex justify-end mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsAssetModalOpen(false)}
//                   className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AssetManagementPage;





/*********New Code***** */

import React, { useState, useEffect } from 'react';
import { FaHome, FaSignOutAlt,FaEdit,FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../Sidebar/HRMSidebar';
import axios from 'axios';

const AssetManagementPage = () => {
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState([]); // State for filtered table data
  const [editingAssetId, setEditingAssetId] = useState(null); // State for tracking which asset is being edited
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [assetToDelete, setAssetToDelete] = useState(null); // Store asset ID to delete
  const [formErrors, setFormErrors] = useState({}); // To store form validation errors from backend

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://higherindia.net:9898/api/categories/fetch");
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
    fetchTableData();
  }, []);
  // Fetch dynamic fields and table data based on the selected category
  const fetchTableData = async (categoryName = selectedCategory) => {
    try {
      const response = await axios.get(`http://higherindia.net:9898/api/tables/table-data/${categoryName}`);
      setTableData({
        columns: response.data.columns || [],
        data: response.data.data || [],
      });
      setDynamicFields(response.data.columns || []);
      setFilteredData(response.data.data || []); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching table data:", error.message);
    }
  };


   // Handle the form data change
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'category') {
      setSelectedCategory(value);
      fetchTableData(value);
      handleEdit(value);
    }
  };


 // Handle form submission (Create or Update)
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { category, ...payloadToSend } = formData;

    // URL based on editing state (create or update)
    const url = editingAssetId
      ? `http://higherindia.net:9898/api/crud/update/${selectedCategory}/${editingAssetId}` // Update
      : `http://higherindia.net:9898/api/tables/insert/${selectedCategory}`; // Create new

    const method = editingAssetId ? 'post' : 'post';
    const response = await axios[method](url, payloadToSend, {
      headers: { 'Content-Type': 'application/json' },
    });

    // If the backend returns errors, set them in formErrors state
    if (response.data.errors) {
      setFormErrors(response.data.errors); // Backend validation errors
    } else {
      console.log('Form submitted successfully:', response.data);

      // If editing, update the data in the table with the new values instead of adding a new asset
      if (editingAssetId) {
        const updatedData = tableData.data.map((row) =>
          row.unique_id === editingAssetId ? { ...row, ...response.data } : row
        );
        setTableData((prevState) => ({
          ...prevState,
          data: updatedData,
        }));
      } else {
        // If creating a new asset, just add the new asset to the table
        setTableData((prevState) => ({
          ...prevState,
          data: [...prevState.data, response.data],
        }));
      }

      // After submitting, close the modal and reset the editing state
      setIsAssetModalOpen(false);
      setEditingAssetId(null); // Reset editing state
      setFormErrors({}); // Clear any previous errors
    }
  } catch (error) {
    console.error("Error submitting form:", error.message);
    setFormErrors({ general: "An error occurred. Please try again." }); // Show a general error if the request fails
  }
};

  // Handle search term changes and update filtered data
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = tableData.data.filter((row) =>
      Object.values(row).some((val) =>
        val.toString().toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

   // Pagination logic
   const paginate = (data) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

 // Delete asset function
 const handleDelete = (unique_id) => {
  if (unique_id) {
    setAssetToDelete(unique_id); // Store the unique_id of the asset to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  } else {
    console.error("Asset unique_id is undefined or invalid");
  }
};
 // Confirm delete action
 const confirmDelete = async () => {
  if (assetToDelete !== null) {
    try {
      const url = `http://higherindia.net:9898/api/crud/delete/${selectedCategory}/${assetToDelete}`;
      const response = await axios.delete(url);
      console.log("Asset deleted successfully:", response.data);

      // Remove deleted asset from tableData
      setTableData((prevState) => ({
        ...prevState,
        data: prevState.data.filter((asset) => asset.unique_id !== assetToDelete),
      }));

      // Close the modal after successful deletion
      setIsDeleteModalOpen(false);
      setAssetToDelete(null); // Clear the asset to delete
    } catch (error) {
      console.error("Error deleting asset:", error.message);
      setIsDeleteModalOpen(false); // Close the modal if there's an error
    }
  } else {
    console.error("No asset unique_id found for deletion");
  }
};

// Cancel delete action
const cancelDelete = () => {
  setIsDeleteModalOpen(false); // Just close the modal without deleting
  setAssetToDelete(null); // Clear the asset to delete
};

  // Edit asset function
  const handleEdit = (unique_id) => {
    const asset = tableData.data.find((row) => row.unique_id === unique_id);
    if (asset) {
      setFormData(asset);
      setEditingAssetId(unique_id); // Mark the asset as being edited
      setIsAssetModalOpen(true); // Open the modal
    }
  };
    // Format the created_at date to 'YYYY-MM-DD'
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
      const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
  
      return `${year}-${month}-${day}`;
    };
  
    // Filter out `unique_id` and `created_at` fields from dynamic fields
    const filteredDynamicFields = dynamicFields.filter((field) => field !== 'unique_id' && field !== 'created_at');

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
          const response = await axios.get(`http://43.204.140.118:3006/users/id_user/${userId}`, {
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
        const response = await axios.post('http://43.204.140.118:3006/verify-token', { token });
        console.log('Token is valid:', response.data);
        navigate('/assets');
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
          <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
            <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
              <FaHome className="text-white mr-2" size={25} />
            </button>
            <h1 className="text-white text-2xl font-bold">Asset</h1>
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
          <div className="p-4 md:p-5 flex flex-col space-y-6 min-h-screen">
            {/* Add Asset Button, Category Dropdown, and Search Input */}
            <div className="flex items-center justify-between flex-wrap space-y-4 md:space-y-0">
              {/* Left Section: Add Asset Button and Category Dropdown */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsAssetModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-[200px]"
                >
                  + Add Asset
                </button>

                <div className="flex flex-col">
                  <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700"></label>
                  <select
                    name="category"
                    value={selectedCategory}
                    onChange={handleChange}
                    className="p-2 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-[#F0F0F0] w-[200px]"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, i) => (
                      <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Section: Search Bar */}
              <div className="w-full md:w-1/3 lg:w-1/4 mt-4 md:mt-0">
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-2 border rounded-lg w-[300px]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-300 sticky top-0">
              {/* Add Sno Column */}
              {selectedCategory && <th className="px-2 md:px-4 py-2 border">S.no</th>}

              {/* Display other columns except `unique_id` */}
              {tableData.columns.filter(column => column !== 'unique_id').map((column, index) => (
                <th key={index} className="px-2 md:px-4 py-2 border">{column}</th>
              ))}
              {selectedCategory && <th className="px-2 md:px-4 py-2 border">Action</th>}
            </tr>
          </thead>
          <tbody>
            {paginate(filteredData).map((asset, index) => (
              <tr key={index} className="even:bg-gray-100">
                {/* Sno Column */}
                {selectedCategory && <td className="px-2 md:px-4 py-2 border">{index + 1}</td>}

                {/* Display data for each column, except `unique_id` */}
                {tableData.columns.filter(column => column !== 'unique_id').map((column, colIndex) => (
                  <td key={colIndex} className="px-2 md:px-4 py-2 border">
                    {column === 'created_at' ? formatDate(asset[column]) : asset[column] || ""}
                  </td>
                ))}
                {selectedCategory && (
                  <td className="px-2 md:px-4 py-2 border">
                    <button
                      className="text-blue-600 mx-1 md:mx-2"
                      onClick={() => handleEdit(asset.unique_id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-600 mx-1 md:mx-2"
                      onClick={() => handleDelete(asset.unique_id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 {/* Modal Section */}
 {isAssetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingAssetId ? "Edit Asset" : "Add Asset"}
              </h2>
              <button onClick={() => setIsAssetModalOpen(false)} className="text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={selectedCategory} onChange={handleChange} className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]" required>
                  <option value="">Select a category</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category.categoriesname}>{category.categoriesname}</option>
                  ))}
                </select>
              </div>
              {filteredDynamicFields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label htmlFor={field} className="mb-1 text-sm font-medium text-gray-700">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="p-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-[#F0F0F0]"
                  />
                  {/* Display backend validation errors for this field */}
                  {formErrors[field] && <span className="text-red-600 text-sm">{formErrors[field]}</span>}
                </div>
              ))}
              {/* Show general error */}
              {formErrors.general && <p className="text-red-600 text-sm">{formErrors.general}</p>}
              <div className="col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  {/* Delete Confirmation Modal */}
  {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800">Are you sure you want to delete this asset?</h2>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
      </div>
      </div>
</div>    
  );
};
export default AssetManagementPage;