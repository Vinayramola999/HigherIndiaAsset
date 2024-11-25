// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash } from '@fortawesome/free-solid-svg-icons';
// import React, { useEffect, useState } from 'react';
// import { FaHome, FaSignOutAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../Sidebar/HRMSidebar';
// import excel from '../assests/excel.png';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// const DepartmentsTable = () => {
//   const navigate = useNavigate();
//   const [departments, setDepartments] = useState([]);
//   const [newDeptName, setNewDeptName] = useState('');
//   const [newDeptDesc, setNewDeptDesc] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [departmentToDelete, setDepartmentToDelete] = useState(null);
//   const userId = localStorage.getItem('userId');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const response = await axios.get('http://intranet.higherindia.net:3006/departments', {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         });
//         setDepartments(response.data);
//       } catch (error) {
//         console.error('Error fetching departments:', error);
//       }
//     };
//     fetchDepartments();
//   }, []);

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     console.log('UserId:', userId);
//     if (userId) {
//       const fetchUserData = async () => {
//         try {
//           console.log('Fetching data for userId:', userId);
//           const response = await axios.get(`http://intranet.higherindia.net:3006/users/id_user/${userId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           console.log('API Response:', response);
//           if (response.data) {
//             const user = response.data;
//             console.log('User:', user);
//             setUserData(user);
//           } else {
//             console.log('No user data found');
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       };
//       fetchUserData();
//     }
//   },
//     [token, userId]);

//   const handleAddDepartment = async () => {
//     if (!newDeptName) {
//       alert('Department name is required');
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.post('http://intranet.higherindia.net:3006/departments', {
//         dept_name: newDeptName,
//         dept_data: newDeptDesc,
//       }, {
//         headers: {
//           "Authorization": `Bearer ${token}` 
//         }
//       });
//       setDepartments([...departments, response.data.department]);
//       setNewDeptName('');
//       setNewDeptDesc('');
//       setIsAddModalOpen(false);
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.message) {
//         if (error.response.data.message.includes("already exists")) {
//           alert("Department already exists");
//         } else {
//           alert(error.response.data.message);
//         }
//       } else {
//         console.error('Error adding department:', error);
//         alert('Failed to add department.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios({
//         method: 'delete',
//         url: 'http://intranet.higherindia.net:3006/departments',
//         data: { id },
//         headers: {
//           "Authorization": `Bearer ${token}` 
//         }
//       });
//       setDepartments(departments.filter(department => department.dept_id !== id));
//       setIsDeleteModalOpen(false);
//     } catch (error) {
//       console.error('Error deleting department:', error);
//       alert('Failed to delete department.');
//     }
//   };

//   const confirmDelete = (department) => {
//     setDepartmentToDelete(department);
//     setIsDeleteModalOpen(true);
//   };

//   const verifyToken = async () => {
//     if (!token) {
//       navigate('/');
//       return;
//     }
//     try {
//       const response = await axios.post('http://intranet.higherindia.net:3006/verify-token', {
//         token: token
//       });
//       console.log('Token is valid:', response.data);
//       navigate('/Departments');
//     } catch (error) {
//       console.error('Token verification failed:', error.response ? error.response.data : error.message);
//       localStorage.removeItem('token');
//       localStorage.removeItem('tokenExpiry');
//       navigate('/');
//     }
//   };

//   useEffect(() => {
//     verifyToken();
//   }, []);

//   useEffect(() => {
//     const handlePopState = () => {
//       navigate('/Cards1');
//     };
//     window.addEventListener('popstate', handlePopState);
//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, [navigate]);

//   const handleDownloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(departments);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Departments');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
//     saveAs(data, 'Department.xlsx');
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate('/');
//   };

//   const handleHome = () => {
//     navigate('/Cards');
//   };

//   return (
//     <div className='flex'>
//       <Sidebar />
//       <div className="p-6 w-full">

//         {/*************************  Header Start  ******************************/}
//         <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
//           <button
//             onClick={handleHome}
//             type="button"
//             className="flex items-center p-2 rounded-full ">
//             <FaHome className="text-white mr-2" size={25} />
//           </button>
//           <h1 className="text-white text-2xl font-bold">Department</h1>
//           {userData && (
//             <div className="ml-auto flex items-center gap-4">
//               <div className="bg-white rounded-3xl p-2 flex items-center">
//                 <div className="flex flex-col">
//                   <h3 className="text-lg font-semibold text-black">
//                     {userData.first_name} {userData.last_name}
//                   </h3>
//                 </div>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 type="button"
//                 className="bg-white flex items-center p-2 rounded-full ">
//                 <FaSignOutAlt className="text-black mr-2" size={20} />
//                 <span className="text-black font-semibold"></span>
//               </button>
//             </div>
//           )}
//         </div>
//         {/*************************  Header End  ******************************/}
//         <div className='justify-between flex'>
//           <button
//             onClick={() => setIsAddModalOpen(true)}
//             className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-2xl mb-4 mt-4 "
//           >
//             Add Department
//           </button>

//           <button
//             onClick={handleDownloadExcel}
//             className="text-green-500 hover:text-green-500 items-center">
//             <img src={excel} alt="logo" className='mr-5 w-8 h-8' />
//           </button>
//         </div>

//         {isAddModalOpen && (
//           <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg w-1/3">
//               <h2 className="text-xl font-bold mb-4">Add Department</h2>
//               <form onSubmit={(e) => { e.preventDefault(); handleAddDepartment(); }}>
//                 <div className="mb-4">
//                   <label htmlFor="dept_name">
//                     Department Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="dept_name"
//                     value={newDeptName}
//                     onChange={(e) => setNewDeptName(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md p-2"
//                     placeholder="Enter Department Name"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label htmlFor="dept_data">Department Description</label>
//                   <textarea
//                     id="dept_data"
//                     value={newDeptDesc}
//                     onChange={(e) => setNewDeptDesc(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md p-2"
//                     placeholder="Enter Department Description"
//                   />
//                 </div>
//                 <div className="flex">
//                   <button
//                     type="submit"
//                     className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50' : ''}`}
//                     disabled={loading}
//                   >
//                     {loading ? 'Adding...' : 'Add Department'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsAddModalOpen(false);
//                     }}
//                     className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-5"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {isDeleteModalOpen && (
//           <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//             <div className="bg-white p-6 rounded-lg w-1/3">
//               <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
//               <p>Are you sure you want to delete the department: <strong>{departmentToDelete?.dept_name}</strong>?</p>
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={() => setIsDeleteModalOpen(false)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDelete(departmentToDelete.dept_id)}
//                   className="bg-red-500 text-white px-4 py-2 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border-collapse">
//             <thead>
//               <tr className="bg-gray-200 text-left">
//                 <th className="py-2 px-4 border-b">ID</th>
//                 <th className="py-2 px-4 border-b">Department Name</th>
//                 <th className="py-2 px-4 border-b">Description</th>
//                 <th className="py-2 px-4 text-center border-b">Created At</th>
//                 <th className="py-2 px-4 border-b text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {departments.map((department, index) => (
//                 <tr key={index} className={`bg-${index % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
//                   <td className="py-2 px-4 border-b">{department.dept_id}</td>
//                   <td className="py-2 px-4 border-b">{department.dept_name}</td>
//                   <td className="py-2 px-4 border-b">{department.dept_data || 'No description'}</td>
//                   <td className="py-2 px-4 text-center border-b">
//                     {new Date(department.created_at).toLocaleString()}
//                   </td>
//                   <td className="py-2 px-4 text-center border-b">
//                     <button
//                       className="text-red-500 hover:text-red-700 mr-2"
//                       onClick={() => confirmDelete(department)}
//                     >
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>


//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DepartmentsTable;



import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/HRMSidebar';
import excel from '../assests/excel.png';
import SuccessModal from '../SuccessModal';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const DepartmentsTable = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [subDepartments, setSubDepartments] = useState([]);
  const [success, setSuccess] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [deleteSubDeptId, setDeleteSubDeptId] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [departmentToContact, setDepartmentToContact] = useState(null);
  const [subDeptName, setSubDeptName] = useState('');
  const [subDeptDesc, setSubDeptDesc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState('');

  const [subDepts, setSubDepts] = useState([]);
  const [editSubDept, setEditSubDept] = useState({ sub_dept_name: "", sub_data: "", sub_id: "" });


  //SUB-DEPARTMENTS
  const handleContact = (department) => {
    setDepartmentToContact(department);
    setIsContactModalOpen(true);
  };

  const handleAddSubdepartment = async () => {
    if (!subDeptName) {
      setError('Verticals is required.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await axios.post(
        'http://intranet.higherindia.net:3006/sub_dept',
        {
          dept_id: departmentToContact.dept_id,
          sub_dept_name: subDeptName,
          sub_data: subDeptDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubDeptName('');
      setSubDeptDesc('');
    } catch (error) {
      console.error('Error adding subdepartment:', error);
      setError(error.response?.data?.message || 'Failed to add subdepartment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubDept = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://intranet.higherindia.net:3006/sub_dept/${deleteSubDeptId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the local state to remove the deleted vertical
      setSubDepartments((prev) =>
        prev.filter((subDept) => subDept.sub_id !== deleteSubDeptId)
      );

      setIsConfirmModalOpen(false); // Close modal
      alert('Vertical deleted successfully.');
    } catch (error) {
      console.error('Error deleting vertical:', error);
      alert('Failed to delete vertical. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const confirmDeleteSubDept = (subDeptId) => {
    setDeleteSubDeptId(subDeptId); // Set the selected vertical ID
    setIsConfirmModalOpen(true); // Open confirmation modal
  };

  const handleCancelDelete = () => {
    setDeleteSubDeptId(null); // Clear the selected ID
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const submitEditSubDept = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true when submitting
    
    try {
      const response = await fetch(`http://intranet.higherindia.net:3006/sub_dept/${editSubDept.sub_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sub_dept_name: editSubDept.sub_dept_name,
          sub_data: editSubDept.sub_data,
        }),
      });
  
      if (response.ok) {
        const updatedSubDept = await response.json();
  
        // Update the sub-department in the state without changing its position
        setSubDepts((prevSubDepts) =>
          prevSubDepts.map((subDept) =>
            subDept.sub_id === updatedSubDept.sub_id ? updatedSubDept : subDept
          )
        );
  
        setEditModalOpen1(false); // Close the modal
      } else {
        console.error("Failed to update sub-department");
      }
    } catch (error) {
      console.error("Error updating sub-department:", error);
    } finally {
      setLoading(false); // Set loading to false after the operation
    }
  };
  
  const handleEditSubDept = (subDept) => {
    setEditSubDept(subDept); 
    setEditModalOpen1(true); 
  };

  //DEPARTMENTS
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://intranet.higherindia.net:3006/departments', {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDeptName) {
      setError('Department name is required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        'http://intranet.higherindia.net:3006/departments',
        {
          dept_name: newDeptName,
          dept_data: newDeptDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      // Update departments list
      setDepartments([...departments, response.data.department]);
      // Clear form fields
      setNewDeptName('');
      setNewDeptDesc('');
      setIsAddModalOpen(false);
      setSuccess(true);
    } catch (error) {
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('already exists')) {
          setError('Department already exists');
        } else {
          setError(error.response.data.message);
        }
      } else {
        console.error('Error adding department:', error);
        setError('Failed to add department. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios({
        method: 'delete',
        url: 'http://intranet.higherindia.net:3006/departments',
        data: { id },
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setDepartments(departments.filter(department => department.dept_id !== id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department.');
    }
  };

  const confirmDelete = (department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalOpen(true);
  };

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isEditModalOpen1, setEditModalOpen1] = useState(false)
  const [editData, setEditData] = useState({ dept_name: "", dept_data: "" });

  const handleEdit = (department) => {
    setEditData(department); // Pre-fill form with current department data
    setEditModalOpen(true);  // Open the modal
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://intranet.higherindia.net:3006/departments/${editData.dept_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept_name: editData.dept_name,
          dept_data: editData.dept_data,
        }),
      });

      if (response.ok) {
        const updatedDepartment = await response.json();
        // Update the UI with the new data (e.g., refresh the list or update state)
        console.log("Updated department:", updatedDepartment);
        setEditModalOpen(false); // Close modal after successful update
      } else {
        console.error("Failed to update department");
      }
    } catch (error) {
      console.error("Error updating department:", error);
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
      navigate('/Departments');
    } catch (error) {
      console.error('Token verification failed:', error.response ? error.response.data : error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      navigate('/');
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      navigate('/Cards1');
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(departments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Departments');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'Department.xlsx');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };

  const handleHome = () => {
    navigate('/Cards');
  };

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
  },
    [token, userId]);

  const handleDepartmentClick = async (dept_id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://intranet.higherindia.net:3006/sub_dept/get/${dept_id}`);
      if (response.status === 200) {
        setSubDepartments(response.data);
        setSelectedDepartment(dept_id);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching subdepartments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className="p-6 w-full">

        {/*************************  Header Start  ******************************/}
        <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
          <button
            onClick={handleHome}
            type="button"
            className="flex items-center p-2 rounded-full ">
            <FaHome className="text-white mr-2" size={25} />
          </button>
          <h1 className="text-white text-2xl font-bold">Department</h1>
          {userData && (
            <div className="ml-auto flex items-center gap-4">
              <div className="bg-white rounded-3xl p-2 flex items-center">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-black">
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
        <div className='justify-between flex mt-3'>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gray-700 w-[13%] text-white px-4 py-2 rounded-3xl mt-1 mb-4 hover:bg-custome-blue "
          >
            Add Department
          </button>

          <button
            onClick={handleDownloadExcel}
            className="text-green-500 hover:text-green-500 items-center">
            <img src={excel} alt="logo" className='mr-5 w-8 h-8' />
          </button>
        </div>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              {error && <p className="text-red-500">{error}</p>}
              <h2 className="text-xl font-bold mb-4">Add Department</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddDepartment(); }}>
                <div className="mb-4">
                  <label htmlFor="dept_name">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="dept_name"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter Department Name"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="dept_data">Department Description</label>
                  <textarea
                    id="dept_data"
                    value={newDeptDesc}
                    onChange={(e) => setNewDeptDesc(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter Department Description"
                  />
                </div>
                <div className="flex">
                  <button
                    type="submit"
                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Department'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDeptName('');
                      setNewDeptDesc('');
                      setError('');
                      setSuccess(false);
                      setIsAddModalOpen(false);
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
          message="Department Added Successfully!"
        />

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-xl mb-4">Edit Department</h2>
              <form onSubmit={submitEdit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Department Name</label>
                  <input
                    type="text"
                    value={editData.dept_name}
                    onChange={(e) => setEditData({ ...editData, dept_name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Department Data</label>
                  <textarea
                    value={editData.dept_data}
                    onChange={(e) => setEditData({ ...editData, dept_data: e.target.value })}
                    className="w-full p-2 border rounded"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="ml-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete the department: <strong>{departmentToDelete?.dept_name}</strong>?</p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(departmentToDelete.dept_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isContactModalOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-1/3">
              {error && <p className="text-red-500">{error}</p>}
              <h2 className="text-xl font-bold mb-4">Create Verticals</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddSubdepartment(); }}>
                <div className="mb-4">
                  <label htmlFor="sub_dept_name">Verticals <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="sub_dept_name"
                    value={subDeptName}
                    onChange={(e) => setSubDeptName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter Verticals"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="sub_data">Description</label>
                  <textarea
                    id="sub_data"
                    value={subDeptDesc}
                    onChange={(e) => setSubDeptDesc(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter Description"
                  />
                </div>
                <div className="flex">
                  <button
                    type="submit"
                    className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Verticals'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubDeptName('');
                      setSubDeptDesc('');
                      setError('');
                      setIsContactModalOpen(false);
                    }
                    }
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-5"
                  >
                    Cancel
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
              {error && <p className="text-red-500">{error}</p>}

              <h2 className="text-[18px] text-custome-blue font-bold my-1 mb-3">
                Verticals
              </h2>
              <table className="table-auto w-full border-collapse">
                <thead className="border-b bg-gray-100"> {/* Optional: Add a background color for headings */}
                  <tr>
                    <th className="py-2 px-4 text-left">S.no.</th>
                    <th className="py-2 px-4 text-left">Verticals</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subDepartments.map((subDept, index) => (
                    <tr key={subDept.id} className="border-b hover:bg-gray-50"> {/* Hover effect for rows */}
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{subDept.sub_dept_name}</td>
                      <td className="py-2 px-4">{subDept.sub_data || 'No description'}</td>
                      <td className="  border-b">
                        <button
                          onClick={() => confirmDeleteSubDept(subDept.sub_id)}
                          className="text-red-500 px-4 py-2 rounded-lg"
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          onClick={() => handleEditSubDept(subDept)}
                          className="text-blue-500 px-4 py-2 rounded-lg"
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        )}

        {isConfirmModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this vertical?</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubDept}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen1 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[50%] max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setEditModalOpen1(false)}
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-4">Edit Sub-Department</h2>
              <form onSubmit={submitEditSubDept} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sub-Department Name</label>
                  <input
                    type="text"
                    value={editSubDept.sub_dept_name}
                    onChange={(e) => setEditSubDept({ ...editSubDept, sub_dept_name: e.target.value })}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sub-Department Data</label>
                  <input
                    type="text"
                    value={editSubDept.sub_data}
                    onChange={(e) => setEditSubDept({ ...editSubDept, sub_data: e.target.value })}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-start space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                    onClick={() => setEditModalOpen1(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/************** Department Table ***************/}
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4 border-b">S.no.</th>
                <th className="py-2 px-4 border-b">Department Name</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 text-center border-b">Created At</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department, index) => (
                <tr key={index} className={`bg-${index % 2 === 0 ? 'blue-50' : 'white'} border-t`}>
                  <td className="p-4 border-b">{index + 1}</td>
                  <td
                    className="p-4 cursor-pointer text-blue-500"
                    onClick={() => handleDepartmentClick(department.dept_id)}
                  >
                    {department.dept_name}
                  </td>
                  <td className="p-4border-b">{department.dept_data || 'No description'}</td>
                  <td className="p4 text-center border-b">
                    {new Date(department.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 text-center border-b">
                    <button
                      className="text-red-500 hover:text-red-700 mr-2"
                      onClick={() => confirmDelete(department)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEdit(department)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleContact(department)}
                    >
                      <FontAwesomeIcon icon={faUser} /> {/* Contact button */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div >
    </div >
  );
};
export default DepartmentsTable;