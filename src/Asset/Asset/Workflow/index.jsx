// // import React, { useState, useEffect } from "react";
// // import { FaTrash, FaEdit, FaSearch } from "react-icons/fa"; // Import FaEdit icon
// // import { FaHome, FaSignOutAlt } from 'react-icons/fa';
// // import { useNavigate } from 'react-router-dom';
// // import Sidebar from '../../Sidebar/HRMSidebar';
// // import axios from "axios";

// // const WorkflowPage = () => {
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [workflows, setWorkflows] = useState([]); // Main table data
// //   const [pendingWorkflows, setPendingWorkflows] = useState([]); // Workflows to be added
// //   const [formData, setFormData] = useState({
// //     workflowname: "",
// //     workflowid:" ",
// //     user: "",
// //     description: "",
// //     createdby: "admin",
// //     user_id: "", // Store user_id for the selected user
// //   });
// //   const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

// //   const [availableWorkflows, setAvailableWorkflows] = useState([]);
// //   const [availableUsers, setAvailableUsers] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [newWorkflow, setNewWorkflow] = useState("");
// //   const [editWorkflowId, setEditWorkflowId] = useState(null);
// //   const [updatedOn, setUpdatedOn] = useState(null);
// //   const [tempWorkflows, setTempWorkflows] = useState([]);
// //   const [selectedUser, setSelectedUser] = useState(null); // To store user details
// //   const [newWorkflowDetails, setNewWorkflowDetails] = useState(null);

// //   //TOKEN AND USERPROFILE  START
// //   const userId = localStorage.getItem('userId');
// //   const [userData, setUserData] = useState('');
// //   const navigate = useNavigate();
// //   const getToken = () => {
// //     const token = localStorage.getItem('token');
// //     return token;
// //   };
// //   const token = getToken();
// //   console.log('Retrieved token:', token);

// //   useEffect(() => {
// //     const fetchWorkflows = async () => {
// //       try {
// //         const response = await axios.get("http://higherindia.net:9898/workflow/get");
// //         setAvailableWorkflows(response.data);
// //         setWorkflows(response.data); // Ensure ID is included
// //       } catch (error) {
// //         console.error("Error fetching workflows:", error);
// //       }
// //     };

// //     const fetchUsers = async () => {
// //       try {
// //         const response = await axios.get("http://higherindia.net:3006/users/getusers");
// //         setAvailableUsers(response.data);
// //       } catch (error) {
// //         console.error("Error fetching users:", error);
// //       }
// //     };

// //     fetchWorkflows();
// //     fetchUsers();
// //   }, [updatedOn]);

// //   const handleDeleteWorkflow = async (id) => {
// //     if (!id) {
// //       console.error("Invalid workflow ID:", id);
// //       return;
// //     }

// //     try {
// //       const response = await axios.delete(`http://higherindia.net:9898/workflow/delete/${id}`);
// //       setWorkflows(workflows.filter((workflow) => workflow.id !== id));
// //       setUpdatedOn((prev) => prev + 1);
// //       alert("Workflow deleted successfully!");
// //     } catch (error) {
// //       console.error("Error deleting workflow:", error);
// //       alert("Error deleting workflow. Please try again.");
// //     }
// //   };

// //   const handleAddUserToWorkflow = async () => {
// //     try {
// //       console.log('vinay',formData);
// //       const response = await axios.post("http://higherindia.net:3006/workflow",  {
// //         userid: Number (formData.user_id),  // Ensure we use 'userid' in the payload
// //         workflowid: formData.workflowid,  // Use 'workflowid' instead of 'workflowname'

// //       },{ headers: {
// //         Authorization: `Bearer ${token}`,
// //       }});

// //       // Handle the response (perhaps update your state with new data or close the modal)
// //       console.log("User added to workflow successfully:", response.data);
// //       setIsAddUserModalOpen(false);  // Close the modal after success
// //     } catch (error) {
// //       console.error("Error adding user to workflow:", error);
// //     }
// //   };

// //   const handleNewWorkflow = (workflowname) =>{
// //     const workflow = availableWorkflows.find(w => w.workflowname === workflowname )
// //    console.log(workflow, availableUsers,availableWorkflows);
// //     if (workflow){
// //       setFormData({...formData,workflowname:workflow.workflowname,description:workflow.description,user_id:workflow.validuser, workflowid:workflow.workflowid})
// //       const user = availableUsers.find(u => u.user_id === workflow.validuser)
// //       if(user ) {
// //         setSelectedUser(user);
// //       }
// //       console.log ({user,workflow,formData});
// //     }

// //   }

// //   const handleAddNewWorkflow = () => {
// //     if (newWorkflow.trim() === "") return;

// //     const newWorkflowEntry = {
// //       workflowname: newWorkflow,
// //       description: "",
// //       createdby: "admin",
// //       id: Math.random().toString(36).substr(2, 9), // Generate a random ID
// //     };

// //     setTempWorkflows((prev) => [...prev, newWorkflowEntry]);
// //     setNewWorkflow(""); // Reset the new workflow input

// //   };

// //   const handleAddWorkflow = async () => {
// //     if (!formData.workflowname ||  !formData.description) {
// //       alert("Please fill in all fields.");
// //       return;
// //     }

// //     try {
// //       const response = await axios.post("http://higherindia.net:9898/workflow/save", {
// //         workflowname: formData.workflowname,
// //         description: formData.description,
// //         createdby: formData.createdby,
// //         // validuser: formData.user_id, // Correct payload key
// //       });

// //       const newWorkflowData = {
// //         ...formData,
// //         id: response.data.id
// //       };
// //       setWorkflows([...workflows, newWorkflowData]);
// //       setFormData({
// //         workflowid: "",
// //         workflowname: "",
// //         user: "",
// //         description: "",
// //         createdby: "admin",
// //         user_id: "", // Reset user_id
// //       });
// //       setIsModalOpen(false);
// //     } catch (error) {
// //       console.error("Error adding workflow:", error);
// //     }
// //   };

// //   const filteredWorkflows = [...availableWorkflows, ...pendingWorkflows].filter((workflow) =>
// //     workflow.workflowname?.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const validateForm = () => {
// //    console.log(formData);
// //     return formData.workflowname && formData.description;
// //   };

// //   const handleEditWorkflow = (workflow) => {
// //     setEditWorkflowId(workflow.workflowid);
// //     setFormData({
// //       workflowname: workflow.workflowname,
// //       description: workflow.description,
// //        user_id: workflow.validuser,
// //       createdby: workflow.createdby,
// //       workflowid: workflow.workflowid,
// //     });
// //     setSelectedUser(availableUsers.find(user => user.user_id === workflow.workflowid));
// //     // setSelectedUser(availableUsers.find(user => workflow.validuser.includes(user.user_id)));
// //     setIsModalOpen(true);
// //   };

// //   const openModalForNewWorkflow = () => {
// //     setFormData({
// //       workflowname: "",
// //       description: "",
// //       user_id: "",
// //       createdby: "admin",
// //       workflowid:"",
// //     });
// //     setSelectedUser(null);
// //     setNewWorkflow(""); // Clear new workflow input
// //     setIsModalOpen(true);
// //   };

// //   useEffect(() => {
// //     const userId = localStorage.getItem('userId');
// //     console.log('UserId:', userId);
// //     if (userId) {
// //       const fetchUserData = async () => {
// //         try {
// //           console.log('Fetching data for userId:', userId);
// //           const response = await axios.get(`http://43.204.140.118:3006/users/id_user/${userId}`, {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           });
// //           console.log('API Response:', response);
// //           if (response.data) {
// //             const user = response.data;
// //             console.log('User:', user);
// //             setUserData(user);
// //           } else {
// //             console.log('No user data found');
// //           }
// //         } catch (error) {
// //           console.error('Error fetching user data:', error);
// //         }
// //       };
// //       fetchUserData();
// //     }
// //   }, [token, userId]);

// //   useEffect(() => {
// //     const verifyToken = async () => {
// //       if (!token) {
// //         navigate('/');
// //         return;
// //       }
// //       try {
// //         const response = await axios.post('http://43.204.140.118:3006/verify-token', { token });
// //         console.log('Token is valid:', response.data);
// //         navigate('/Workflow');
// //       } catch (error) {
// //         console.error('Token verification failed:', error.response ? error.response.data : error.message);
// //         localStorage.removeItem('token');
// //         localStorage.removeItem('tokenExpiry');
// //         navigate('/');
// //       }
// //     };
// //     verifyToken();
// //   }, [token, navigate]);

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     navigate('/');
// //   };

// //   const handleHome = () => {
// //     navigate('/Cards');
// //   };
// //   //END

// //   return (
// //     <div className='flex flex-col overflow-hidden'>
// //       <div className='flex'>
// //         <Sidebar />
// //         <div className="p-6 w-full">
// //           {/********************* HEADER START *****************/}
// //           <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg mb-3">
// //             <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
// //               <FaHome className="text-white mr-2" size={25} />
// //             </button>
// //             <h1 className="text-white text-2xl font-bold">Workflow</h1>
// //             {userData && (
// //               <div className="ml-auto flex items-center gap-4">
// //                 <div className="bg-white rounded-3xl p-2 flex items-center">
// //                   <div className="flex flex-col">
// //                     <h3 className="text-lg font-semibold text-custome-black">
// //                       {userData.first_name} {userData.last_name}
// //                     </h3>
// //                   </div>
// //                 </div>
// //                 <button onClick={handleLogout} type="button" className="bg-white flex items-center p-2 rounded-full">
// //                   <FaSignOutAlt className="text-black mr-2" size={20} />
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //           {/*************************HEADER END *************** */}
// //           <div className="flex justify-between items-center mb-4">
// //             <button
// //               onClick={openModalForNewWorkflow} // Open modal for adding new workflow
// //               className="rounded-full bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 transition duration-300"
// //             >
// //               + Add Workflow
// //             </button>
// //             <div className="flex items-center">
// //               <input
// //                 type="text"
// //                 placeholder="Search..."
// //                 value={searchTerm}
// //                 onChange={(e) => setSearchTerm(e.target.value)}
// //                 className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               />
// //               <FaSearch className="text-gray-500 ml-2" />
// //             </div>
// //           </div>

// //           {/* Workflow Table */}
// //           <div className="overflow-auto mb-4" style={{ maxHeight: "690px" }}>
// //             <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mx-auto">
// //               <thead className="bg-gray-300 sticky top-0">
// //                 <tr>
// //                   <th className="py-3 border-b text-center px-4">Sr.no.</th>
// //                   {/* <th className="py-3 border-b text-center px-4">User</th> */}
// //                   <th className="py-3 border-b text-center px-4">Workflow</th>
// //                   <th className="py-3 border-b text-center px-4">Description</th>
// //                   {/* <th className="py-3 border-b text-center px-4">Created by</th> */}
// //                   <th className="py-3 border-b text-center px-4">Action</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {filteredWorkflows.map((workflow, index) => {
// //                   const user = availableUsers.find(user => user.user_id === workflow.validuser);
// //                   const userName = user ? `${user.first_name} ${user.last_name}` : "N/A";

// //                   return (
// //                     <tr key={workflow.workflowid} className="hover:bg-gray-100 transition duration-200">
// //                       <td className="py-3 border-b text-center">{index + 1}</td>
// //                       {/* <td className="py-3 border-b text-center">{userName}</td> */}
// //                       <td className="py-3 border-b text-center">{workflow.workflowname}</td>
// //                       <td className="py-3 border-b text-center">{workflow.description}</td>
// //                       {/* <td className="py-3 border-b text-center">{workflow.createdby}</td> */}
// //                       <td className="py-3 border-b text-center">
// //                         <button onClick={() => handleEditWorkflow(workflow)}>
// //                           <FaEdit className="text-blue-500 hover:underline" />
// //                         </button>
// //                         <button onClick={() => handleDeleteWorkflow(workflow.workflowid)}>
// //                           <FaTrash className="text-red-500 hover:underline" />
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {isModalOpen && (
// //             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
// //               <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
// //                 <h2 className="text-xl font-semibold mb-7 text-center"> Workflow</h2>
// //                 <form
// //                   onSubmit={(e) => {
// //                     e.preventDefault();
// //                     // if (validateForm()) {
// //                        handleAddWorkflow();
// //                     // } else {
// //                     //   alert("Please fill in all fields.");
// //                     // }
// //                   }}
// //                   className="grid grid-cols-1 gap-6"
// //                 >
// //                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //                     <div>
// //                       <label className="block text-gray-700 mb-1">Workflow</label>
// //                       <select
// //                         value={formData.workflowname}
// //                         onChange={(e) => { console.log (e.target.value);setFormData(e.target.value==='add-new'?{workflowname:e.target.value}:{ ...formData, workflowname: e.target.value });handleNewWorkflow (e.target.value); if (e.target.value==='add-new')setSelectedUser(null) }}
// //                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
// //                         required
// //                       >
// //                         <option value="" disabled>Select Workflow</option>
// //                         {filteredWorkflows.map((workflow) => (
// //                           <option key={workflow.id} value={workflow.workflowname}>
// //                             {workflow.workflowname}
// //                           </option>
// //                         ))}

// //                         {tempWorkflows?.map((workflow) => (
// //                           <option key={workflow.id} value={workflow.workflowname}>
// //                             {workflow.workflowname}
// //                           </option>
// //                         ))}

// //                         <option value="add-new">Add New Workflow</option>
// //                       </select>
// //                       {formData.workflowname === "add-new" && (
// //                         <div className="mt-2 ">
// //                           <input
// //                             type="text"
// //                             value={newWorkflow}
// //                             onChange={(e) => {setNewWorkflow(e.target.value);}}
// //                             placeholder="New Workflow Name"
// //                             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 "
// //                           />
// //                           <button
// //                             type="button"
// //                             onClick={handleAddNewWorkflow}
// //                             className="mt-2 rounded bg-blue-500 text-white py-1 px-4 hover:bg-blue-600"
// //                           >
// //                             Add
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>

// //                     <div>
// //                       <label className="block text-gray-700 mb-1">Description</label>
// //                       <input
// //                         type="text"
// //                         value={formData.description}
// //                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// //                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
// //                         placeholder="Enter description"
// //                       />
// //                     </div>
// //                     <button
// //                       type="submit"
// //                       className="rounded bg-blue-500 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
// //                     >
// //                       Submit
// //                     </button>

// //                     {/* <div>
// //                       <label className="block text-gray-700 mb-1">User</label>
// //                       <select
// //                         value={formData.user_id}
// //                         onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
// //                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 "
// //                         required
// //                       >
// //                         <option value="" disabled>Select User</option>
// //                         {availableUsers.map((user) => (
// //                           <option key={user.user_id} value={user.user_id}>
// //                             {user.first_name} {user.last_name}
// //                           </option>
// //                         ))}
// //                       </select>
// //                     </div> */}
// //                   </div>
// // {/* Display user details
// // {selectedUser && (
// //   <div className="mt-4 border-t pt-4">
// //     <h3 className="font-semibold text-lg mb-4">User Details</h3>
// //     <table className="table-auto border-collapse border border-gray-300 w-full">
// //       <thead>
// //         <tr>
// //           <th className="border border-gray-300 px-4 py-2">Name</th>
// //           <th className="border border-gray-300 px-4 py-2">Email</th>
// //           <th className="border border-gray-300 px-4 py-2">Phone</th>
// //           <th className="border border-gray-300 px-4 py-2">Employee ID</th>
// //         </tr>
// //       </thead>
// //       <tbody>
// //         <tr>
// //           <td className="border border-gray-300 px-4 py-2">{selectedUser.first_name} {selectedUser.last_name}</td>
// //           <td className="border border-gray-300 px-4 py-2">{selectedUser.email}</td>
// //           <td className="border border-gray-300 px-4 py-2">{selectedUser.phone_no}</td>
// //           <td className="border border-gray-300 px-4 py-2">{selectedUser.emp_id}</td>
// //         </tr>
// //       </tbody>
// //     </table>
// //   </div>
// // )} */}
// //                   <div className="flex justify-between mt-6">
// //                     <button
// //                       type="button"
// //                       onClick={() => setIsModalOpen(false)}
// //                       className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                     type="button"
// //   onClick={() => setIsAddUserModalOpen(true)} // Set the Add User modal to open
// //   className="rounded bg-blue-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
// // >
// //   + Add User
// // </button>
// //                   </div>
// //                 </form>
// //               </div>
// //             </div>
// //           )}
// //           {isAddUserModalOpen && (
// //   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
// //     <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
// //       <h2 className="text-xl font-semibold mb-7 text-center">Add User to Workflow</h2>
// //       <form onSubmit={handleAddUserToWorkflow} className="grid grid-cols-1 gap-6">
// //         {/* Workflow Dropdown */}
// //         <div>
// //           <label className="block text-gray-700 mb-1">Workflow</label>
// //           <select
// //             onChange={(e) => setFormData({ ...formData, workflowid: e.target.value })}
// //             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
// //             required
// //           >
// //             <option value="" disabled>Select Workflow</option>
// //             {filteredWorkflows.map((workflow) => (
// //               <option key={workflow.id} value={workflow.workflowid}selected={workflow.workflowid === formData.workflowid}>
// //                 {console.log({workflow})}
// //                 {workflow.workflowname}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* User Dropdown */}
// //         <div>
// //           <label className="block text-gray-700 mb-1">Select User</label>
// //           <select
// //             value={formData.user_id}
// //             onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
// //             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
// //             required
// //           >
// //             <option value="" disabled>Select User</option>
// //             {availableUsers.map((user) => (
// //               <option key={user.user_id} value={user.user_id}>
// //                 {user.first_name} {user.last_name}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* User Details (if selected) */}
// //         {selectedUser && (
// //           <div className="mt-4 border-t pt-4">
// //             <h3 className="font-semibold text-lg mb-4">User Details</h3>
// //             <table className="table-auto border-collapse border border-gray-300 w-full">
// //               <thead>
// //                 <tr>
// //                   <th className="border border-gray-300 px-4 py-2">Name</th>
// //                   <th className="border border-gray-300 px-4 py-2">Email</th>
// //                   <th className="border border-gray-300 px-4 py-2">Phone</th>
// //                   <th className="border border-gray-300 px-4 py-2">Employee ID</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 <tr>
// //                   <td className="border border-gray-300 px-4 py-2">{selectedUser.first_name} {selectedUser.last_name}</td>
// //                   <td className="border border-gray-300 px-4 py-2">{selectedUser.email}</td>
// //                   <td className="border border-gray-300 px-4 py-2">{selectedUser.phone_no}</td>
// //                   <td className="border border-gray-300 px-4 py-2">{selectedUser.emp_id}</td>
// //                 </tr>
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //         <div className="flex justify-between mt-6">
// //           <button
// //             type="button"
// //             onClick={() => setIsAddUserModalOpen(false)} // Close modal
// //             className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             type="submit"
// //             className="rounded bg-green-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
// //           >
// //             Add User
// //           </button>
// //         </div>
// //       </form>
// //     </div>
// //   </div>
// // )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default WorkflowPage;

// import React, { useState, useEffect } from "react";
// import { FaTrash, FaEdit, FaSearch } from "react-icons/fa"; // Import FaEdit icon
// import { FaHome, FaSignOutAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../../Sidebar/HRMSidebar';
// import axios from "axios";

// const WorkflowPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [workflows, setWorkflows] = useState([]); // Main table data
//   const [pendingWorkflows, setPendingWorkflows] = useState([]); // Workflows to be added
//   const [formData, setFormData] = useState({
//     workflowname: "",
//     workflowid:" ",
//     user: "",
//     description: "",
//     createdby: "admin",
//     user_id: "", // Store user_id for the selected user
//   });
//   const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

//   const [availableWorkflows, setAvailableWorkflows] = useState([]);
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [newWorkflow, setNewWorkflow] = useState("");
//   const [editWorkflowId, setEditWorkflowId] = useState(null);
//   const [updatedOn, setUpdatedOn] = useState(null);
//   const [tempWorkflows, setTempWorkflows] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null); // To store user details
//   const [newWorkflowDetails, setNewWorkflowDetails] = useState(null);
//   const [users, setUsers] = useState([]); // Users associated with workflows

//   //TOKEN AND USERPROFILE  START
//   const userId = localStorage.getItem('userId');
//   const [userData, setUserData] = useState('');
//   const navigate = useNavigate();
//   const getToken = () => {
//     const token = localStorage.getItem('token');
//     return token;
//   };
//   const token = getToken();
//   console.log('Retrieved token:', token);

//   useEffect(() => {
//     const fetchWorkflows = async () => {
//       try {
//         const response = await axios.get("http://higherindia.net:9898/workflow/get");
//         setAvailableWorkflows(response.data);
//         setWorkflows(response.data); // Ensure ID is included
//       } catch (error) {
//         console.error("Error fetching workflows:", error);
//       }
//     };
//       // Fetch users by workflow ID
//   const fetchUsersByWorkflowId = async (workflowId) => {
//     try {
//       const response = await axios.get(`http://higherindia.net:3006/workflow/workflowid`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(response.data.users); // Set users for the selected workflow
//     } catch (error) {
//       console.error("Error fetching users for workflow:", error);
//     }
//   };

//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://higherindia.net:3006/users/getusers");
//         setAvailableUsers(response.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchWorkflows();
//     fetchUsers();
//   }, [updatedOn]);

//   const handleDeleteWorkflow = async (id) => {
//     if (!id) {
//       console.error("Invalid workflow ID:", id);
//       return;
//     }

//     try {
//       const response = await axios.delete(`http://higherindia.net:9898/workflow/delete/${id}`);
//       setWorkflows(workflows.filter((workflow) => workflow.id !== id));
//       setUpdatedOn((prev) => prev + 1);
//       alert("Workflow deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting workflow:", error);
//       alert("Error deleting workflow. Please try again.");
//     }
//   };

//   const handleAddUserToWorkflow = async (e) => {
//     e.preventDefault(); // Prevent the default form submission behavior

//     // Check if required fields are available
//     if (!formData.user_id || !formData.workflowid) {
//       console.error("User ID or Workflow ID is missing");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://higherindia.net:3006/workflow", // Your API URL
//         {
//           userid: Number(formData.user_id),  // Ensure we use 'userid' in the payload
//           workflowid: formData.workflowid,  // Correct workflow ID
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Handle the response (perhaps update your state with new data or close the modal)
//       console.log("User added to workflow successfully:", response.data);
//       setIsAddUserModalOpen(false);  // Close the modal after success
//     } catch (error) {
//       console.error("Error adding user to workflow:", error);
//     }
//   };

//   const handleNewWorkflow = (workflowname) =>{
//     const workflow = availableWorkflows.find(w => w.workflowname === workflowname )
//    console.log(workflow, availableUsers,availableWorkflows);
//     if (workflow){
//       setFormData({...formData,workflowname:workflow.workflowname,description:workflow.description,user_id:workflow.validuser, workflowid:workflow.workflowid})
//       const user = availableUsers.find(u => u.user_id === workflow.workflowid)
//       if(user ) {
//         setSelectedUser(user);
//       }
//       console.log ({user,workflow,formData});
//     }

//   }

//   const handleAddNewWorkflow = () => {
//     if (newWorkflow.trim() === "") return;

//     const newWorkflowEntry = {
//       workflowname: newWorkflow,
//       description: "",
//       createdby: "admin",
//       id: Math.random().toString(36).substr(2, 9), // Generate a random ID
//     };

//     setTempWorkflows((prev) => [...prev, newWorkflowEntry]);
//     setNewWorkflow(""); // Reset the new workflow input

//   };

//   const handleAddWorkflow = async () => {
//     if (!formData.workflowname ||  !formData.description) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://higherindia.net:9898/workflow/save", {
//         workflowname: formData.workflowname,
//         description: formData.description,
//         createdby: formData.createdby,
//         // validuser: formData.user_id, // Correct payload key
//       });

//       const newWorkflowData = {
//         ...formData,
//         id: response.data.id
//       };
//       setWorkflows([...workflows, newWorkflowData]);
//       setFormData({
//         workflowid: "",
//         workflowname: "",
//         user: "",
//         description: "",
//         createdby: "admin",
//         user_id: "", // Reset user_id
//       });
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error adding workflow:", error);
//     }
//   };

//   const filteredWorkflows = [...availableWorkflows, ...pendingWorkflows].filter((workflow) =>
//     workflow.workflowname?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const validateForm = () => {
//    console.log(formData);
//     return formData.workflowname && formData.description;
//   };

//   const handleEditWorkflow = (workflow) => {
//     setEditWorkflowId(workflow.workflowid);
//     setFormData({
//       workflowname: workflow.workflowname,
//       description: workflow.description,
//        user_id: workflow.userId,
//       createdby: workflow.createdby,
//       workflowid: workflow.workflowid,
//     });
//     setSelectedUser(availableUsers.find(user => user.user_id === workflow.workflowid));
//     // setSelectedUser(availableUsers.find(user => workflow.validuser.includes(user.user_id)));
//     setIsModalOpen(true);
//   };

//   const openModalForNewWorkflow = () => {
//     setFormData({
//       workflowname: "",
//       description: "",
//       user_id: "",
//       createdby: "admin",
//       workflowid:"",
//     });
//     setSelectedUser(null);
//     setNewWorkflow(""); // Clear new workflow input
//     setIsModalOpen(true);
//   };

//   const excludedUserIds = workflows.map(workflow => workflow.validuser);
//   const availableUsersForDropdown = availableUsers.filter(user => !excludedUserIds.includes(user.user_id));

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     console.log('UserId:', userId);
//     if (userId) {
//       const fetchUserData = async () => {
//         try {
//           console.log('Fetching data for userId:', userId);
//           const response = await axios.get(`http://43.204.140.118:3006/users/id_user/${userId}`, {
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
//   }, [token, userId]);

//   useEffect(() => {
//     const verifyToken = async () => {
//       if (!token) {
//         navigate('/');
//         return;
//       }
//       try {
//         const response = await axios.post('http://43.204.140.118:3006/verify-token', { token });
//         console.log('Token is valid:', response.data);
//         navigate('/Workflow');
//       } catch (error) {
//         console.error('Token verification failed:', error.response ? error.response.data : error.message);
//         localStorage.removeItem('token');
//         localStorage.removeItem('tokenExpiry');
//         navigate('/');
//       }
//     };
//     verifyToken();
//   }, [token, navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate('/');
//   };

//   const handleHome = () => {
//     navigate('/Cards');
//   };
//   //END

//   return (
//     <div className='flex flex-col overflow-hidden'>
//       <div className='flex'>
//         <Sidebar />
//         <div className="p-6 w-full">
//           {/********************* HEADER START *****************/}
//           <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg mb-3">
//             <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
//               <FaHome className="text-white mr-2" size={25} />
//             </button>
//             <h1 className="text-white text-2xl font-bold">Workflow</h1>
//             {userData && (
//               <div className="ml-auto flex items-center gap-4">
//                 <div className="bg-white rounded-3xl p-2 flex items-center">
//                   <div className="flex flex-col">
//                     <h3 className="text-lg font-semibold text-custome-black">
//                       {userData.first_name} {userData.last_name}
//                     </h3>
//                   </div>
//                 </div>
//                 <button onClick={handleLogout} type="button" className="bg-white flex items-center p-2 rounded-full">
//                   <FaSignOutAlt className="text-black mr-2" size={20} />
//                 </button>
//               </div>
//             )}
//           </div>
//           {/*************************HEADER END *************** */}
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={openModalForNewWorkflow} // Open modal for adding new workflow
//               className="rounded-full bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 transition duration-300"
//             >
//               + Add Workflow
//             </button>
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <FaSearch className="text-gray-500 ml-2" />
//             </div>
//           </div>

//           {/* Workflow Table */}
//           <div className="overflow-auto mb-4" style={{ maxHeight: "690px" }}>
//             <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mx-auto">
//               <thead className="bg-gray-300 sticky top-0">
//                 <tr>
//                   <th className="py-3 border-b text-center px-4">Sr.no.</th>
//                   {/* <th className="py-3 border-b text-center px-4">User</th> */}
//                   <th className="py-3 border-b text-center px-4">Workflow</th>
//                   <th className="py-3 border-b text-center px-4">Description</th>
//                   {/* <th className="py-3 border-b text-center px-4">Created by</th> */}
//                   <th className="py-3 border-b text-center px-4">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredWorkflows.map((workflow, index) => {
//                   const user = availableUsers.find(user => user.user_id === workflow.validuser);
//                   const userName = user ? `${user.first_name} ${user.last_name}` : "N/A";

//                   return (
//                     <tr key={workflow.workflowid} className="hover:bg-gray-100 transition duration-200">
//                       <td className="py-3 border-b text-center">{index + 1}</td>
//                       {/* <td className="py-3 border-b text-center">{userName}</td> */}
//                       <td className="py-3 border-b text-center">{workflow.workflowname}</td>
//                       <td className="py-3 border-b text-center">{workflow.description}</td>
//                       {/* <td className="py-3 border-b text-center">{workflow.createdby}</td> */}
//                       <td className="py-3 border-b text-center">
//                         <button onClick={() => handleEditWorkflow(workflow)}>
//                           <FaEdit className="text-blue-500 hover:underline" />
//                         </button>
//                         <button onClick={() => handleDeleteWorkflow(workflow.workflowid)}>
//                           <FaTrash className="text-red-500 hover:underline" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {isModalOpen && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//               <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
//                 <h2 className="text-xl font-semibold mb-7 text-center"> Workflow</h2>
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     // if (validateForm()) {
//                        handleAddWorkflow();
//                     // } else {
//                     //   alert("Please fill in all fields.");
//                     // }
//                   }}
//                   className="grid grid-cols-1 gap-6"
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div>
//                       <label className="block text-gray-700 mb-1">Workflow</label>
//                       <select
//                         value={formData.workflowname}
//                         onChange={(e) => { console.log (e.target.value);setFormData(e.target.value==='add-new'?{workflowname:e.target.value}:{ ...formData, workflowname: e.target.value });handleNewWorkflow (e.target.value); if (e.target.value==='add-new')setSelectedUser(null) }}
//                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//                         required
//                       >
//                         <option value="" disabled>Select Workflow</option>
//                         {filteredWorkflows.map((workflow) => (
//                           <option key={workflow.id} value={workflow.workflowname}>
//                             {workflow.workflowname}
//                           </option>
//                         ))}

//                         {tempWorkflows?.map((workflow) => (
//                           <option key={workflow.id} value={workflow.workflowname}>
//                             {workflow.workflowname}
//                           </option>
//                         ))}

//                         <option value="add-new">Add New Workflow</option>
//                       </select>
//                       {formData.workflowname === "add-new" && (
//                         <div className="mt-2 ">
//                           <input
//                             type="text"
//                             value={newWorkflow}
//                             onChange={(e) => {setNewWorkflow(e.target.value);}}
//                             placeholder="New Workflow Name"
//                             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 "
//                           />
//                           <button
//                             type="button"
//                             onClick={handleAddNewWorkflow}
//                             className="mt-2 rounded bg-blue-500 text-white py-1 px-4 hover:bg-blue-600"
//                           >
//                             Add
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-gray-700 mb-1">Description</label>
//                       <input
//                         type="text"
//                         value={formData.description}
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//                         placeholder="Enter description"
//                       />
//                     </div>
//                     <button
//                       type="submit"
//                       className="rounded bg-blue-500 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
//                     >
//                       Submit
//                     </button>

//                   </div>

//                   <div className="flex justify-between mt-6">
//                     <button
//                       type="button"
//                       onClick={() => setIsModalOpen(false)}
//                       className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                     type="button"
//   onClick={() => setIsAddUserModalOpen(true)} // Set the Add User modal to open
//   className="rounded bg-blue-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
// >
//   + Add User
// </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}

// {isAddUserModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//           <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/2">
//             <h2 className="text-xl font-semibold mb-7 text-center">Add User to Workflow</h2>
//             <form onSubmit={handleAddUserToWorkflow} className="flex flex-col gap-6">
//               {/* Workflow Dropdown */}
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1">
//                   <label className="block text-gray-700 mb-1">Workflow</label>
//                   <select
//                     onChange={(e) => setFormData({ ...formData, workflowid: e.target.value })}
//                     value={formData.workflowid}
//                     className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//                     required
//                   >
//                     <option value="" disabled>Select Workflow</option>
//                     {filteredWorkflows.map((workflow) => (
//                       <option key={workflow.id} value={workflow.workflowid}>
//                         {workflow.workflowname}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* User Dropdown */}
//                 <div className="flex-1">
//                   <label className="block text-gray-700 mb-1">Select User</label>
//                   <select
//                     value={formData.user_id}
//                     onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
//                     className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//                     required
//                   >
//                     <option value="" disabled>Select User</option>
//                     {availableUsersForDropdown.map((user) => (
//                       <option key={user.user_id} value={user.user_id}>
//                         {user.first_name} {user.last_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//         {/* User Details (if selected) */}
//         {selectedUser && (
//           <div className="mt-4 border-t pt-4">
//             <h3 className="font-semibold text-lg mb-4">User Details</h3>
//             <table className="table-auto border-collapse border border-gray-300 w-full">
//               <thead>
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2">Name</th>
//                   <th className="border border-gray-300 px-4 py-2">Email</th>
//                   <th className="border border-gray-300 px-4 py-2">Phone</th>
//                   <th className="border border-gray-300 px-4 py-2">Employee ID</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.first_name} {selectedUser.last_name}</td>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.email}</td>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.phone_no}</td>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.emp_id}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Submit Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             type="button"
//             onClick={() => setIsAddUserModalOpen(false)} // Close modal
//             className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="rounded bg-green-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
//           >
//             Add User
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

//         </div>

//       </div>

//     </div>
//   );
// };

// export default WorkflowPage;

// import React, { useState, useEffect } from "react";
// import { FaTrash, FaEdit, FaSearch } from "react-icons/fa"; // Import FaEdit icon
// import { FaHome, FaSignOutAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../../Sidebar/HRMSidebar';
// import axios from "axios";

// const WorkflowPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [workflows, setWorkflows] = useState([]); // Main table data
//   const [pendingWorkflows, setPendingWorkflows] = useState([]); // Workflows to be added
//   const [formData, setFormData] = useState({
//     workflowname: "",
//     workflowid:" ",
//     user: "",
//     description: "",
//     createdby: "admin",
//     user_id: "", // Store user_id for the selected user
//   });
//   const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

//   const [availableWorkflows, setAvailableWorkflows] = useState([]);
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [newWorkflow, setNewWorkflow] = useState("");
//   const [editWorkflowId, setEditWorkflowId] = useState(null);
//   const [updatedOn, setUpdatedOn] = useState(null);
//   const [tempWorkflows, setTempWorkflows] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null); // To store user details
//   const [newWorkflowDetails, setNewWorkflowDetails] = useState(null);

//   //TOKEN AND USERPROFILE  START
//   const userId = localStorage.getItem('userId');
//   const [userData, setUserData] = useState('');
//   const navigate = useNavigate();
//   const getToken = () => {
//     const token = localStorage.getItem('token');
//     return token;
//   };
//   const token = getToken();
//   console.log('Retrieved token:', token);

//   useEffect(() => {
//     const fetchWorkflows = async () => {
//       try {
//         const response = await axios.get("http://higherindia.net:9898/workflow/get");
//         setAvailableWorkflows(response.data);
//         setWorkflows(response.data); // Ensure ID is included
//       } catch (error) {
//         console.error("Error fetching workflows:", error);
//       }
//     };

//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("http://higherindia.net:3006/users/getusers");
//         setAvailableUsers(response.data);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchWorkflows();
//     fetchUsers();
//   }, [updatedOn]);

//   const handleDeleteWorkflow = async (id) => {
//     if (!id) {
//       console.error("Invalid workflow ID:", id);
//       return;
//     }

//     try {
//       const response = await axios.delete(`http://higherindia.net:9898/workflow/delete/${id}`);
//       setWorkflows(workflows.filter((workflow) => workflow.id !== id));
//       setUpdatedOn((prev) => prev + 1);
//       alert("Workflow deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting workflow:", error);
//       alert("Error deleting workflow. Please try again.");
//     }
//   };

//   const handleAddUserToWorkflow = async () => {
//     try {
//       console.log('vinay',formData);
//       const response = await axios.post("http://higherindia.net:3006/workflow",  {
//         userid: Number (formData.user_id),  // Ensure we use 'userid' in the payload
//         workflowid: formData.workflowid,  // Use 'workflowid' instead of 'workflowname'

//       },{ headers: {
//         Authorization: `Bearer ${token}`,
//       }});

//       // Handle the response (perhaps update your state with new data or close the modal)
//       console.log("User added to workflow successfully:", response.data);
//       setIsAddUserModalOpen(false);  // Close the modal after success
//     } catch (error) {
//       console.error("Error adding user to workflow:", error);
//     }
//   };

//   const handleNewWorkflow = (workflowname) =>{
//     const workflow = availableWorkflows.find(w => w.workflowname === workflowname )
//    console.log(workflow, availableUsers,availableWorkflows);
//     if (workflow){
//       setFormData({...formData,workflowname:workflow.workflowname,description:workflow.description,user_id:workflow.validuser, workflowid:workflow.workflowid})
//       const user = availableUsers.find(u => u.user_id === workflow.validuser)
//       if(user ) {
//         setSelectedUser(user);
//       }
//       console.log ({user,workflow,formData});
//     }

//   }

//   const handleAddNewWorkflow = () => {
//     if (newWorkflow.trim() === "") return;

//     const newWorkflowEntry = {
//       workflowname: newWorkflow,
//       description: "",
//       createdby: "admin",
//       id: Math.random().toString(36).substr(2, 9), // Generate a random ID
//     };

//     setTempWorkflows((prev) => [...prev, newWorkflowEntry]);
//     setNewWorkflow(""); // Reset the new workflow input

//   };

//   const handleAddWorkflow = async () => {
//     if (!formData.workflowname ||  !formData.description) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://higherindia.net:9898/workflow/save", {
//         workflowname: formData.workflowname,
//         description: formData.description,
//         createdby: formData.createdby,
//         // validuser: formData.user_id, // Correct payload key
//       });

//       const newWorkflowData = {
//         ...formData,
//         id: response.data.id
//       };
//       setWorkflows([...workflows, newWorkflowData]);
//       setFormData({
//         workflowid: "",
//         workflowname: "",
//         user: "",
//         description: "",
//         createdby: "admin",
//         user_id: "", // Reset user_id
//       });
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error adding workflow:", error);
//     }
//   };

//   const filteredWorkflows = [...availableWorkflows, ...pendingWorkflows].filter((workflow) =>
//     workflow.workflowname?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const validateForm = () => {
//    console.log(formData);
//     return formData.workflowname && formData.description;
//   };

//   const handleEditWorkflow = (workflow) => {
//     setEditWorkflowId(workflow.workflowid);
//     setFormData({
//       workflowname: workflow.workflowname,
//       description: workflow.description,
//        user_id: workflow.validuser,
//       createdby: workflow.createdby,
//       workflowid: workflow.workflowid,
//     });
//     setSelectedUser(availableUsers.find(user => user.user_id === workflow.workflowid));
//     // setSelectedUser(availableUsers.find(user => workflow.validuser.includes(user.user_id)));
//     setIsModalOpen(true);
//   };

//   const openModalForNewWorkflow = () => {
//     setFormData({
//       workflowname: "",
//       description: "",
//       user_id: "",
//       createdby: "admin",
//       workflowid:"",
//     });
//     setSelectedUser(null);
//     setNewWorkflow(""); // Clear new workflow input
//     setIsModalOpen(true);
//   };

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     console.log('UserId:', userId);
//     if (userId) {
//       const fetchUserData = async () => {
//         try {
//           console.log('Fetching data for userId:', userId);
//           const response = await axios.get(`http://43.204.140.118:3006/users/id_user/${userId}`, {
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
//   }, [token, userId]);

//   useEffect(() => {
//     const verifyToken = async () => {
//       if (!token) {
//         navigate('/');
//         return;
//       }
//       try {
//         const response = await axios.post('http://43.204.140.118:3006/verify-token', { token });
//         console.log('Token is valid:', response.data);
//         navigate('/Workflow');
//       } catch (error) {
//         console.error('Token verification failed:', error.response ? error.response.data : error.message);
//         localStorage.removeItem('token');
//         localStorage.removeItem('tokenExpiry');
//         navigate('/');
//       }
//     };
//     verifyToken();
//   }, [token, navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate('/');
//   };

//   const handleHome = () => {
//     navigate('/Cards');
//   };
//   //END

//   return (
//     <div className='flex flex-col overflow-hidden'>
//       <div className='flex'>
//         <Sidebar />
//         <div className="p-6 w-full">
//           {/********************* HEADER START *****************/}
//           <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg mb-3">
//             <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
//               <FaHome className="text-white mr-2" size={25} />
//             </button>
//             <h1 className="text-white text-2xl font-bold">Workflow</h1>
//             {userData && (
//               <div className="ml-auto flex items-center gap-4">
//                 <div className="bg-white rounded-3xl p-2 flex items-center">
//                   <div className="flex flex-col">
//                     <h3 className="text-lg font-semibold text-custome-black">
//                       {userData.first_name} {userData.last_name}
//                     </h3>
//                   </div>
//                 </div>
//                 <button onClick={handleLogout} type="button" className="bg-white flex items-center p-2 rounded-full">
//                   <FaSignOutAlt className="text-black mr-2" size={20} />
//                 </button>
//               </div>
//             )}
//           </div>
//           {/*************************HEADER END *************** */}
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={openModalForNewWorkflow} // Open modal for adding new workflow
//               className="rounded-full bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 transition duration-300"
//             >
//               + Add Workflow
//             </button>
//             <div className="flex items-center">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <FaSearch className="text-gray-500 ml-2" />
//             </div>
//           </div>

//           {/* Workflow Table */}
//           <div className="overflow-auto mb-4" style={{ maxHeight: "690px" }}>
//             <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mx-auto">
//               <thead className="bg-gray-300 sticky top-0">
//                 <tr>
//                   <th className="py-3 border-b text-center px-4">Sr.no.</th>
//                   {/* <th className="py-3 border-b text-center px-4">User</th> */}
//                   <th className="py-3 border-b text-center px-4">Workflow</th>
//                   <th className="py-3 border-b text-center px-4">Description</th>
//                   {/* <th className="py-3 border-b text-center px-4">Created by</th> */}
//                   <th className="py-3 border-b text-center px-4">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredWorkflows.map((workflow, index) => {
//                   const user = availableUsers.find(user => user.user_id === workflow.validuser);
//                   const userName = user ? `${user.first_name} ${user.last_name}` : "N/A";

//                   return (
//                     <tr key={workflow.workflowid} className="hover:bg-gray-100 transition duration-200">
//                       <td className="py-3 border-b text-center">{index + 1}</td>
//                       {/* <td className="py-3 border-b text-center">{userName}</td> */}
//                       <td className="py-3 border-b text-center">{workflow.workflowname}</td>
//                       <td className="py-3 border-b text-center">{workflow.description}</td>
//                       {/* <td className="py-3 border-b text-center">{workflow.createdby}</td> */}
//                       <td className="py-3 border-b text-center">
//                         <button onClick={() => handleEditWorkflow(workflow)}>
//                           <FaEdit className="text-blue-500 hover:underline" />
//                         </button>
//                         <button onClick={() => handleDeleteWorkflow(workflow.workflowid)}>
//                           <FaTrash className="text-red-500 hover:underline" />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {isModalOpen && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//               <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
//                 <h2 className="text-xl font-semibold mb-7 text-center"> Workflow</h2>
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     // if (validateForm()) {
//                        handleAddWorkflow();
//                     // } else {
//                     //   alert("Please fill in all fields.");
//                     // }
//                   }}
//                   className="grid grid-cols-1 gap-6"
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div>
//                       <label className="block text-gray-700 mb-1">Workflow</label>
//                       <select
//                         value={formData.workflowname}
//                         onChange={(e) => { console.log (e.target.value);setFormData(e.target.value==='add-new'?{workflowname:e.target.value}:{ ...formData, workflowname: e.target.value });handleNewWorkflow (e.target.value); if (e.target.value==='add-new')setSelectedUser(null) }}
//                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//                         required
//                       >
//                         <option value="" disabled>Select Workflow</option>
//                         {filteredWorkflows.map((workflow) => (
//                           <option key={workflow.id} value={workflow.workflowname}>
//                             {workflow.workflowname}
//                           </option>
//                         ))}

//                         {tempWorkflows?.map((workflow) => (
//                           <option key={workflow.id} value={workflow.workflowname}>
//                             {workflow.workflowname}
//                           </option>
//                         ))}

//                         <option value="add-new">Add New Workflow</option>
//                       </select>
//                       {formData.workflowname === "add-new" && (
//                         <div className="mt-2 ">
//                           <input
//                             type="text"
//                             value={newWorkflow}
//                             onChange={(e) => {setNewWorkflow(e.target.value);}}
//                             placeholder="New Workflow Name"
//                             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 "
//                           />
//                           <button
//                             type="button"
//                             onClick={handleAddNewWorkflow}
//                             className="mt-2 rounded bg-blue-500 text-white py-1 px-4 hover:bg-blue-600"
//                           >
//                             Add
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-gray-700 mb-1">Description</label>
//                       <input
//                         type="text"
//                         value={formData.description}
//                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//                         placeholder="Enter description"
//                       />
//                     </div>
//                     <button
//                       type="submit"
//                       className="rounded bg-blue-500 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
//                     >
//                       Submit
//                     </button>

//                     {/* <div>
//                       <label className="block text-gray-700 mb-1">User</label>
//                       <select
//                         value={formData.user_id}
//                         onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
//                         className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200 "
//                         required
//                       >
//                         <option value="" disabled>Select User</option>
//                         {availableUsers.map((user) => (
//                           <option key={user.user_id} value={user.user_id}>
//                             {user.first_name} {user.last_name}
//                           </option>
//                         ))}
//                       </select>
//                     </div> */}
//                   </div>
// {/* Display user details
// {selectedUser && (
//   <div className="mt-4 border-t pt-4">
//     <h3 className="font-semibold text-lg mb-4">User Details</h3>
//     <table className="table-auto border-collapse border border-gray-300 w-full">
//       <thead>
//         <tr>
//           <th className="border border-gray-300 px-4 py-2">Name</th>
//           <th className="border border-gray-300 px-4 py-2">Email</th>
//           <th className="border border-gray-300 px-4 py-2">Phone</th>
//           <th className="border border-gray-300 px-4 py-2">Employee ID</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr>
//           <td className="border border-gray-300 px-4 py-2">{selectedUser.first_name} {selectedUser.last_name}</td>
//           <td className="border border-gray-300 px-4 py-2">{selectedUser.email}</td>
//           <td className="border border-gray-300 px-4 py-2">{selectedUser.phone_no}</td>
//           <td className="border border-gray-300 px-4 py-2">{selectedUser.emp_id}</td>
//         </tr>
//       </tbody>
//     </table>
//   </div>
// )} */}
//                   <div className="flex justify-between mt-6">
//                     <button
//                       type="button"
//                       onClick={() => setIsModalOpen(false)}
//                       className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                     type="button"
//   onClick={() => setIsAddUserModalOpen(true)} // Set the Add User modal to open
//   className="rounded bg-blue-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
// >
//   + Add User
// </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//           {isAddUserModalOpen && (
//   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
//     <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
//       <h2 className="text-xl font-semibold mb-7 text-center">Add User to Workflow</h2>
//       <form onSubmit={handleAddUserToWorkflow} className="grid grid-cols-1 gap-6">
//         {/* Workflow Dropdown */}
//         <div>
//           <label className="block text-gray-700 mb-1">Workflow</label>
//           <select
//             onChange={(e) => setFormData({ ...formData, workflowid: e.target.value })}
//             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//             required
//           >
//             <option value="" disabled>Select Workflow</option>
//             {filteredWorkflows.map((workflow) => (
//               <option key={workflow.id} value={workflow.workflowid}selected={workflow.workflowid === formData.workflowid}>
//                 {console.log({workflow})}
//                 {workflow.workflowname}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* User Dropdown */}
//         <div>
//           <label className="block text-gray-700 mb-1">Select User</label>
//           <select
//             value={formData.user_id}
//             onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
//             className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
//             required
//           >
//             <option value="" disabled>Select User</option>
//             {availableUsers.map((user) => (
//               <option key={user.user_id} value={user.user_id}>
//                 {user.first_name} {user.last_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* User Details (if selected) */}
//         {selectedUser && (
//           <div className="mt-4 border-t pt-4">
//             <h3 className="font-semibold text-lg mb-4">User Details</h3>
//             <table className="table-auto border-collapse border border-gray-300 w-full">
//               <thead>
//                 <tr>
//                   <th className="border border-gray-300 px-4 py-2">Name</th>
//                   <th className="border border-gray-300 px-4 py-2">Email</th>
//                   <th className="border border-gray-300 px-4 py-2">Phone</th>
//                   <th className="border border-gray-300 px-4 py-2">Employee ID</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.first_name} {selectedUser.last_name}</td>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.email}</td>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.phone_no}</td>
//                   <td className="border border-gray-300 px-4 py-2">{selectedUser.emp_id}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="flex justify-between mt-6">
//           <button
//             type="button"
//             onClick={() => setIsAddUserModalOpen(false)} // Close modal
//             className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="rounded bg-green-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
//           >
//             Add User
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkflowPage;

import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa"; // Import FaEdit icon
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Sidebar/HRMSidebar";
import axios from "axios";

const WorkflowPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workflows, setWorkflows] = useState([]); // Main table data
  const [pendingWorkflows, setPendingWorkflows] = useState([]); // Workflows to be added
  const [formData, setFormData] = useState({
    workflowname: "",
    workflowid: " ",
    user: "",
    description: "",
    createdby: "admin",
    user_id: "", // Store user_id for the selected user
  });
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [availableWorkflows, setAvailableWorkflows] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newWorkflow, setNewWorkflow] = useState("");
  const [editWorkflowId, setEditWorkflowId] = useState(null);
  const [updatedOn, setUpdatedOn] = useState(null);
  const [tempWorkflows, setTempWorkflows] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // To store user details
  const [newWorkflowDetails, setNewWorkflowDetails] = useState(null);
  const [users, setUsers] = useState([]); // Users associated with workflows

  //TOKEN AND USERPROFILE  START
  const userId = localStorage.getItem("userId");
  const [userData, setUserData] = useState("");
  const navigate = useNavigate();
  const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
  };
  const token = getToken();
  console.log("Retrieved token:", token);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get(
          "http://higherindia.net:9898/workflow/get"
        );
        setAvailableWorkflows(response.data);
        setWorkflows(response.data); // Ensure ID is included
      } catch (error) {
        console.error("Error fetching workflows:", error);
      }
    };
    // Fetch users by workflow ID
    const fetchUsersByWorkflowId = async (workflowId) => {
      try {
        const response = await axios.get(
          `http://higherindia.net:3006/workflow/workflowid`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(response.data.users); // Set users for the selected workflow
      } catch (error) {
        console.error("Error fetching users for workflow:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://higherindia.net:3006/users/getusers"
        );
        setAvailableUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchWorkflows();
    fetchUsers();
  }, [updatedOn]);

  const handleDeleteWorkflow = async (id) => {
    if (!id) {
      console.error("Invalid workflow ID:", id);
      return;
    }

    try {
      const response = await axios.delete(
        `http://higherindia.net:9898/workflow/delete/${id}`
      );
      setWorkflows(workflows.filter((workflow) => workflow.id !== id));
      setUpdatedOn((prev) => prev + 1);
      alert("Workflow deleted successfully!");
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Error deleting workflow. Please try again.");
    }
  };

  const handleAddUserToWorkflow = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if required fields are available
    if (!formData.user_id || !formData.workflowid) {
      console.error("User ID or Workflow ID is missing");
      return;
    }

    try {
      const response = await axios.post(
        "http://higherindia.net:3006/workflow", // Your API URL
        {
          userid: Number(formData.user_id), // Ensure we use 'userid' in the payload
          workflowid: Number(formData.workflowid), // Correct workflow ID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response (perhaps update your state with new data or close the modal)
      console.log("User added to workflow successfully:", response.data);
      setIsAddUserModalOpen(false); // Close the modal after success
    } catch (error) {
      console.error("Error adding user to workflow:", error);
    }
  };

  const handleNewWorkflow = (workflowname) => {
    const workflow = availableWorkflows.find(
      (w) => w.workflowname === workflowname
    );
    console.log(workflow, availableUsers, availableWorkflows);
    if (workflow) {
      setFormData({
        ...formData,
        workflowname: workflow.workflowname,
        description: workflow.description,
        user_id: workflow.validuser,
        workflowid: workflow.workflowid,
      });
      const user = availableUsers.find(
        (u) => u.user_id === workflow.workflowid
      );
      if (user) {
        setSelectedUser(user);
      }
      console.log({ user, workflow, formData });
    }
  };

  const handleAddNewWorkflow = () => {
    if (newWorkflow.trim() === "") return;

    const newWorkflowEntry = {
      workflowname: newWorkflow,
      description: "",
      createdby: "admin",
      id: Math.random().toString(36).substr(2, 9), // Generate a random ID
    };

    setTempWorkflows((prev) => [...prev, newWorkflowEntry]);
    setNewWorkflow(""); // Reset the new workflow input
  };

  const handleAddWorkflow = async () => {
    if (!formData.workflowname || !formData.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://higherindia.net:9898/workflow/save",
        {
          workflowname: formData.workflowname,
          description: formData.description,
          createdby: formData.createdby,
          // validuser: formData.user_id, // Correct payload key
        }
      );

      const newWorkflowData = {
        ...formData,
        id: response.data.id,
      };
      setWorkflows([...workflows, newWorkflowData]);
      setFormData({
        workflowid: "",
        workflowname: "",
        user: "",
        description: "",
        createdby: "admin",
        user_id: "", // Reset user_id
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding workflow:", error);
    }
  };

  const filteredWorkflows = [...availableWorkflows, ...pendingWorkflows].filter(
    (workflow) =>
      workflow.workflowname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    console.log(formData);
    return formData.workflowname && formData.description;
  };

  const handleEditWorkflow = (workflow) => {
    setEditWorkflowId(workflow.workflowid);
    setFormData({
      workflowname: workflow.workflowname,
      description: workflow.description,
      user_id: workflow.userId,
      createdby: workflow.createdby,
      workflowid: workflow.workflowid,
    });
    setSelectedUser(
      availableUsers.find((user) => user.user_id === workflow.workflowid)
    );
    // setSelectedUser(availableUsers.find(user => workflow.validuser.includes(user.user_id)));
    setIsModalOpen(true);
  };

  const openModalForNewWorkflow = () => {
    setFormData({
      workflowname: "",
      description: "",
      user_id: "",
      createdby: "admin",
      workflowid: "",
    });
    setSelectedUser(null);
    setNewWorkflow(""); // Clear new workflow input
    setIsModalOpen(true);
  };

  const excludedUserIds = workflows.map((workflow) => workflow.validuser);
  const availableUsersForDropdown = availableUsers.filter(
    (user) => !excludedUserIds.includes(user.user_id)
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("UserId:", userId);
    if (userId) {
      const fetchUserData = async () => {
        try {
          console.log("Fetching data for userId:", userId);
          const response = await axios.get(
            `http://43.204.140.118:3006/users/id_user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("API Response:", response);
          if (response.data) {
            const user = response.data;
            console.log("User:", user);
            setUserData(user);
          } else {
            console.log("No user data found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [token, userId]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.post(
          "http://43.204.140.118:3006/verify-token",
          { token }
        );
        console.log("Token is valid:", response.data);
        navigate("/Workflow");
      } catch (error) {
        console.error(
          "Token verification failed:",
          error.response ? error.response.data : error.message
        );
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        navigate("/");
      }
    };
    verifyToken();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleHome = () => {
    navigate("/Cards");
  };
  //END

  const fetchWorkflowDetails = async (workflowid) => {
    try {
      const response = await axios.get(
        `http://43.204.140.118:3006/workflow/${workflowid}`
      );
      setWorkflowDetails(response.data); // Update state with the fetched data
    } catch (error) {
      console.error("Error fetching workflow details:", error);
      setWorkflowDetails(null); // Reset details on error
    }
  };

  // Handle workflow selection
  const handleWorkflowChange = (e) => {
    const selectedWorkflowId = e.target.value;
    setFormData({ ...formData, workflowid: selectedWorkflowId });
    if (selectedWorkflowId) {
      fetchWorkflowDetails(selectedWorkflowId); // Fetch details for selected workflow
    }
  };

  const [workflowDetails, setWorkflowDetails] = useState(null);

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex">
        <Sidebar />
        <div className="p-6 w-full">
          {/********************* HEADER START *****************/}
          <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg mb-3">
            <button
              onClick={handleHome}
              type="button"
              className="flex items-center p-2 rounded-full"
            >
              <FaHome className="text-white mr-2" size={25} />
            </button>
            <h1 className="text-white text-2xl font-bold">Workflow</h1>
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
                  className="bg-white flex items-center p-2 rounded-full"
                >
                  <FaSignOutAlt className="text-black mr-2" size={20} />
                </button>
              </div>
            )}
          </div>
          {/*************************HEADER END *************** */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={openModalForNewWorkflow} // Open modal for adding new workflow
              className="rounded-full bg-blue-600 text-white py-3 px-6 hover:bg-blue-700 transition duration-300"
            >
              + Add Workflow
            </button>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="text-gray-500 ml-2" />
            </div>
          </div>

          {/* Workflow Table */}
          <div className="overflow-auto mb-4" style={{ maxHeight: "690px" }}>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mx-auto">
              <thead className="bg-gray-300 sticky top-0">
                <tr>
                  <th className="py-3 border-b text-center px-4">Sr.no.</th>
                  {/* <th className="py-3 border-b text-center px-4">User</th> */}
                  <th className="py-3 border-b text-center px-4">Workflow</th>
                  <th className="py-3 border-b text-center px-4">
                    Description
                  </th>
                  {/* <th className="py-3 border-b text-center px-4">Created by</th> */}
                  <th className="py-3 border-b text-center px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkflows.map((workflow, index) => {
                  const user = availableUsers.find(
                    (user) => user.user_id === workflow.validuser
                  );
                  const userName = user
                    ? `${user.first_name} ${user.last_name}`
                    : "N/A";

                  return (
                    <tr
                      key={workflow.workflowid}
                      className="hover:bg-gray-100 transition duration-200"
                    >
                      <td className="py-3 border-b text-center">{index + 1}</td>
                      {/* <td className="py-3 border-b text-center">{userName}</td> */}
                      <td className="py-3 border-b text-center">
                        {workflow.workflowname}
                      </td>
                      <td className="py-3 border-b text-center">
                        {workflow.description}
                      </td>
                      {/* <td className="py-3 border-b text-center">{workflow.createdby}</td> */}
                      <td className="py-3 border-b text-center">
                        <button onClick={() => handleEditWorkflow(workflow)}>
                          <FaEdit className="text-blue-500 hover:underline" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteWorkflow(workflow.workflowid)
                          }
                        >
                          <FaTrash className="text-red-500 hover:underline" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
                <h2 className="text-xl font-semibold mb-7 text-center">
                  {" "}
                  Workflow
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // if (validateForm()) {
                    handleAddWorkflow();
                    // } else {
                    //   alert("Please fill in all fields.");
                    // }
                  }}
                  className="grid grid-cols-1 gap-6"
                >
                 <div className="flex flex-wrap items-center gap-4">
  {/* Workflow Dropdown */}
  <div className="flex-1">
    <label className="block text-gray-700 mb-1">Workflow</label>
    <select
      value={formData.workflowname}
      onChange={(e) => {
        console.log(e.target.value);
        setFormData(
          e.target.value === "add-new"
            ? { workflowname: e.target.value }
            : { ...formData, workflowname: e.target.value }
        );
        handleNewWorkflow(e.target.value);
        if (e.target.value === "add-new") setSelectedUser(null);
      }}
      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-[250px] transition duration-200"
      required
    >
      <option value="" disabled>
        Select Workflow
      </option>
      {filteredWorkflows.map((workflow) => (
        <option key={workflow.id} value={workflow.workflowname}>
          {workflow.workflowname}
        </option>
      ))}
      {tempWorkflows?.map((workflow) => (
        <option key={workflow.id} value={workflow.workflowname}>
          {workflow.workflowname}
        </option>
      ))}
      <option value="add-new">Add New Workflow</option>
    </select>

    {formData.workflowname === "add-new" && (
      <div className="mt-2">
        <input
          type="text"
          value={newWorkflow}
          onChange={(e) => setNewWorkflow(e.target.value)}
          placeholder="New Workflow Name"
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto transition duration-200"
        />
        <button
          type="button"
          onClick={handleAddNewWorkflow}
          className="mt-2 rounded bg-blue-500 text-white py-1 px-4 hover:bg-blue-600 transition duration-300"
        >
          Add
        </button>
      </div>
    )}
  </div>

  {/* Description Field */}
  <div className="flex-1">
    <label className="block text-gray-700 mb-1">Description</label>
    <input
      type="text"
      value={formData.description}
      onChange={(e) =>
        setFormData({
          ...formData,
          description: e.target.value,
        })
      }
      className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-[250px] transition duration-200"
      placeholder="Enter description"
    />
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="rounded bg-blue-500 text-white py-2 px-5 text-sm hover:bg-blue-600 transition duration-300 mt-6"
  >
    Submit
  </button>
</div>


                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddUserModalOpen(true)} // Set the Add User modal to open
                      className="rounded bg-blue-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
                    >
                      + Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {isAddUserModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-lg p-6 shadow-lg w-11/12 md:w-3/4 lg:w-1/2 xl:w-1/2">
                <h2 className="text-xl font-semibold mb-7 text-center">
                  Add User to Workflow
                </h2>
                <form
                  onSubmit={handleAddUserToWorkflow}
                  className="flex flex-col gap-6"
                >
                  {/* Workflow Dropdown */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-1">
                          Workflow
                        </label>
                        <select
                          onChange={handleWorkflowChange}
                          value={formData.workflowid}
                          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
                          required
                        >
                          <option value="" disabled>
                            Select Workflow
                          </option>
                          {filteredWorkflows.map((workflow) => (
                            <option
                              key={workflow.id}
                              value={workflow.workflowid}
                            >
                              {workflow.workflowname}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Workflow Details Display */}
                      {workflowDetails ? (
                        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                          <h3 className="text-lg font-semibold mb-2">
                            Workflow Details:
                          </h3>
                          <p>
                            <strong>ID:</strong> {workflowDetails[0]?.id}
                          </p>
                          <p>
                            <strong>User ID:</strong>{" "}
                            {workflowDetails[0]?.userid}
                          </p>
                          <p>
                            <strong>Workflow ID:</strong>{" "}
                            {workflowDetails[0]?.workflowid}
                          </p>
                        </div>
                      ) : (
                        formData.workflowid && (
                          <p className="mt-4 text-gray-500">
                            No details available for this workflow.
                          </p>
                        )
                      )}
                    </div>

                    {/* User Dropdown */}
                    <div className="flex-1">
                      <label className="block text-gray-700 mb-1">
                        Select User
                      </label>
                      <select
                        value={formData.user_id}
                        onChange={(e) =>
                          setFormData({ ...formData, user_id: e.target.value })
                        }
                        className="p-3 border w-[180px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition duration-200"
                        required
                      >
                        <option value="" disabled>
                          Select User
                        </option>
                        {availableUsersForDropdown.map((user) => (
                          <option key={user.user_id} value={user.user_id}>
                            {user.first_name} {user.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* User Details (if selected) */}
                  {selectedUser && (
                    <div className="mt-4 border-t pt-4">
                      <h3 className="font-semibold text-lg mb-4">
                        User Details
                      </h3>
                      <table className="table-auto border-collapse border border-gray-300 w-full">
                        <thead>
                          <tr>
                            <th className="border border-gray-300 px-4 py-2">
                              Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Email
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Phone
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Employee ID
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-2">
                              {selectedUser.first_name} {selectedUser.last_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {selectedUser.email}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {selectedUser.phone_no}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {selectedUser.emp_id}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddUserModalOpen(false)} // Close modal
                      className="rounded bg-red-600 text-white py-2 px-3 hover:bg-red-700 transition duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-green-600 text-white py-2 px-3 hover:bg-green-700 transition duration-300"
                    >
                      Add User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowPage;
