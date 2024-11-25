import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar/HRMSidebar';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const UnifiedService = () => {
    const navigate = useNavigate();
    const [hasAMSAccess, setHasAMSAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [templateName, setTemplateName] = useState('');
    const [templateType, setTemplateType] = useState('SMS'); // Default to SMS
    const [selectedOption, setSelectedOption] = useState('message');
    const [message, setMessage] = useState('');
    const [variable, setVariable] = useState('');
    const [addedItems, setAddedItems] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);

    const handleTemplateNameChange = (e) => {
        setTemplateName(e.target.value);
    };

    const handleTemplateTypeChange = (e) => {
        setTemplateType(e.target.value);
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleVariableChange = (e) => {
        setVariable(e.target.value);
    };

    const handleAddMessage = () => {
        if (message) {
            setAddedItems(prev => [...prev, { message, variables: variable || '', templateName, role: templateType }]);
            setMessage('');
            setSelectedOption('variable'); // Automatically switch to 'variable' option
        }
    };

    const handleAddVariable = () => {
        if (variable) {
            setAddedItems(prev => [...prev, { message, variables: variable, templateName, role: templateType }]);
            setVariable('');
            setSelectedOption('message'); // Automatically switch to 'message' option
        }
    };

    const getToken = () => {
        const token = localStorage.getItem('token');
        return token;
    };
    const token = getToken();
    console.log('Retrieved token:', token);

    const handlePublish = () => {
        if (!templateName || !addedItems.length) {
            alert('Template name and at least one message or variable are required.');
            return;
        }

        // Construct the payload based on the required structure
        const payload = addedItems.map(item => ({
            message: item.message,
            variables: item.variables,
            templateName,
            role: item.role,
        }));

        // Check the payload before sending
        console.log('Payload:', payload);

        axios.post('http://43.204.140.118:8080/addTemplates', payload)
            .then(response => {
                setTemplateName('');
                setAddedItems([]);
                setIsModalOpen(false);
                fetchTemplates();
            })
            .catch(error => {
                console.error('Error adding template:', error.response?.data || error);
            });
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setTemplateName('');
        setAddedItems([]);
    };

    const fetchTemplates = () => {
        axios.get('http://higherindia.net:8080/viewAllTemplates')
            .then(response => {
                setTemplates(response.data);
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
            });
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
            navigate('/UCS');
        } catch (error) {
            console.error('Token verification failed:', error.response ? error.response.data : error.message);
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            navigate('/');
        }
    };
    useEffect(() => {
        verifyToken();
        fetchTemplates();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleHome = () => {
        navigate('/Cards');
    };

    const handleDeleteTemplate = (templateId) => {
        setTemplateToDelete(templateId);
        setDeleteConfirmationOpen(true);
    };

    const confirmDeleteTemplate = () => {
        if (templateToDelete) {
            axios.delete('http://43.204.140.118:8080/deleteTemplate/${templateToDelete}')
                .then(response => {
                console.log('Template deleted successfully:', response.data);
                fetchTemplates();
            })
                .catch(error => {
                    console.error('Error deleting template:', error);
                })
                .finally(() => {
                    setDeleteConfirmationOpen(false);
                    setTemplateToDelete(null);
                });
        }
    };

    const cancelDeleteTemplate = () => {
        setDeleteConfirmationOpen(false);
        setTemplateToDelete(null);
    };

    const handleTemplateIdClick = (message) => {
        setCurrentMessage(message);
        setMessageModalOpen(true);
    };

    const handleCloseMessageModal = () => {
        setMessageModalOpen(false);
    };

    return (
        <div className='flex flex-col overflow-hidden'>
            <div className='flex'>
                <Sidebar />
                <div className="p-6 w-full">
                    <div className="bg-custome-blue rounded-lg w-full p-3 flex justify-between items-center shadow-lg">
                        <button onClick={handleHome} type="button" className="flex items-center p-2 rounded-full">
                            <FaHome className="text-white mr-2" size={25} />
                        </button>
                        <h1 className="text-white text-2xl font-bold">Unified Communication Service</h1>
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

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-custome-blue w-[17%] text-white px-4 py-2 rounded-2xl mb-4 mt-4"
                    >
                        Add Template
                    </button>

                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl mb-4">Templates</h2>
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-center">S.No</th>
                                    <th className="px-4 py-2 text-center">Template ID</th>
                                    <th className="px-4 py-2 text-center">Date</th>
                                    <th className="px-4 py-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {templates.map((template, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="border px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border px-4 py-2 text-center cursor-pointer text-blue-500 hover:underline" onClick={() => handleTemplateIdClick(template.message)}>
                                            {template.templateId}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            {new Date(template.createDate).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="border px-4 py-2 text-center">
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteTemplate(template.templateId)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-full max-w-md p-5 bg-white shadow-lg rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Add Template</h3>
                                    <button className="text-red-500" onClick={handleClose}>X</button>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Template Name"
                                    value={templateName}
                                    onChange={handleTemplateNameChange}
                                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                                />
                                <select value={templateType} onChange={handleTemplateTypeChange} className="border border-gray-300 rounded-lg p-2 mb-4 w-full">
                                    <option value="SMS">SMS</option>
                                    <option value="Email">Email</option>
                                    <option value="Notification">Notification</option>
                                </select>

                                <div>
                                    <label className="mr-4">
                                        <input
                                            type="radio"
                                            value="message"
                                            checked={selectedOption === 'message'}
                                            onChange={handleOptionChange}
                                        />
                                        Message
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="variable"
                                            checked={selectedOption === 'variable'}
                                            onChange={handleOptionChange}
                                        />
                                        Variable
                                    </label>
                                </div>

                                {selectedOption === 'message' ? (
                                    <>
                                        <textarea
                                            placeholder="Enter your message"
                                            value={message}
                                            onChange={handleMessageChange}
                                            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                                        />
                                        <button onClick={handleAddMessage} className="bg-custome-blue text-white rounded-lg px-4 py-2">
                                            Add Message
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Enter variable name"
                                            value={variable}
                                            onChange={handleVariableChange}
                                            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                                        />
                                        <button onClick={handleAddVariable} className="bg-custome-blue text-white rounded-lg px-4 py-2">
                                            Add Variable
                                        </button>
                                    </>
                                )}

                                <h4 className="text-lg mt-4">Added Items</h4>
                                <ul className="list-disc list-inside">
                                    {addedItems.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center border-b py-1">
                                            <span>
                                                {item.message ? item.message : `Variable: ${item.variables}`}
                                            </span>
                                            <button
                                                className="text-red-500"
                                                onClick={() => {
                                                    setAddedItems(prev => prev.filter((_, i) => i !== index));
                                                }}
                                            >
                                                X
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={handlePublish} className="bg-custome-blue text-white rounded-lg px-4 py-2 mt-4">
                                    Publish Template
                                </button>
                            </div>
                        </div>
                    )}

                    {messageModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-full max-w-md p-5 bg-white shadow-lg rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Message</h3>
                                    <button className="text-red-500" onClick={handleCloseMessageModal}>X</button>
                                </div>
                                <p>{currentMessage}</p>
                            </div>
                        </div>
                    )}

                    {deleteConfirmationOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-full max-w-md p-5 bg-white shadow-lg rounded-lg">
                                <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                                <p>Are you sure you want to delete this template?</p>
                                <div className="flex justify-between mt-4">
                                    <button onClick={confirmDeleteTemplate} className="bg-red-500 text-white rounded-lg px-4 py-2">
                                        Delete
                                    </button>
                                    <button onClick={cancelDeleteTemplate} className="bg-gray-300 text-black rounded-lg px-4 py-2">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnifiedService;