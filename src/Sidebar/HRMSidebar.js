import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLocationArrow, FaUser,FaProjectDiagram,FaTh,FaUserCog,FaClipboardList, FaEnvelope, FaReact} from 'react-icons/fa';
import logo from '../assests/Logo.png';

const Sidebar = () => {
    const location = useLocation();
    const [isCrmOpen, setIsCrmOpen] = useState(location.pathname.includes('/Profile'));
    const [isHRMSOpen, setIsHRMSOpen] = useState(
        location.pathname.includes('/Departments') ||
        location.pathname.includes('/Location') ||
        location.pathname.includes('/Designation') ||
        location.pathname.includes('/Domain') ||
        location.pathname.includes('/Role') ||
        location.pathname.includes('/Usermng') ||
        location.pathname.includes('/AMS') ||
        location.pathname.includes('/Leave')
    );
    const [isOrgSetupOpen, setIsOrgSetupOpen] = useState(
        location.pathname.includes('/Departments') ||
        location.pathname.includes('/Location') ||
        location.pathname.includes('/Designation') ||
        location.pathname.includes('/Domain')
    );
    const [isUserOpen, setIsUserOpen] = useState(
        location.pathname.includes('/Role') ||
        location.pathname.includes('/Usermng') ||
        location.pathname.includes('/AMS')
    );
    const [isAssetOpen, setIsAssetOpen] = useState(
        location.pathname.includes('/Approval') ||
        location.pathname.includes('/ResubmittedApproval') ||
        location.pathname.includes('/assets') ||
        location.pathname.includes('/categories') ||
        location.pathname.includes('/Depreciation') ||
        location.pathname.includes('/Workflow')
    );

    const toggleCrmMenu = () => {
        setIsCrmOpen(prevState => !prevState);
    };

    const toggleHRMSMenu = () => {
        setIsHRMSOpen(prevState => !prevState);
    };

    const toggleOrgSetupMenu = () => {
        setIsOrgSetupOpen(prevState => !prevState);
    };

    const toggleUserMenu = () => {
        setIsUserOpen(prevState => !prevState);
    };

    const toggleAssetMenu = () => {
        setIsAssetOpen(prevState => !prevState);
    };

    return (
        <div className="w-[15%] border bg-white p-5 rounded-lg ml-5 mt-5 max-h-full flex flex-col overflow-hidden text-[14px]">
            <div className='border-b border-gray-300 pb-4 mb-4'>
                <img src={logo} alt="logo" className='w-full' />
            </div>
            <ul className="flex-grow list-none p-0">
                {/* CRM Menu Item */}
                <li className="mt-3">
                    <div
                        onClick={toggleCrmMenu}
                        className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                    >
                        <FaUser className="mr-2" /> CRM
                    </div>
                    {isCrmOpen && (
                        <ul className="ml-4">
                            <li className="mt-1">
                                <Link
                                    to="/Profile"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[12px] ${location.pathname === '/Profile' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                    <FaUser className="mr-2" /> Profile
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                {/* HRMS Menu Item */}
                <li className="mt-3">
                    <div
                        onClick={toggleHRMSMenu}
                        className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                    >
                        <FaUser className="mr-2" /> HRMS
                    </div>
                    {isHRMSOpen && (
                        <ul className="ml-4">
                            {/* Organization Setup */}
                            <li className="mt-1">
                                <div
                                    onClick={toggleOrgSetupMenu}
                                    className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 text-[12px] hover:text-white transition-colors"
                                >
                                    <FaUser className="mr-2" /> Organization Setup
                                </div>
                                {isOrgSetupOpen && (
                                    <ul className="ml-4">
                                        <li className="mt-3">
                                            <Link
                                                to="/Departments"
                                                className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Departments' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                                <FaUser className="mr-2" /> Department
                                            </Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link
                                                to="/Location"
                                                className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Location' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                                <FaLocationArrow className="mr-2" /> Location
                                            </Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link
                                                to="/Designation"
                                                className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Designation' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                                <FaUser className="mr-2" /> Designation
                                            </Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link
                                                to="/Domain"
                                                className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Domain' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                                <FaEnvelope className="mr-2" /> Domain
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            {/* User Management */}
                            <li className="mt-1">
                                <div
                                    onClick={toggleUserMenu}
                                    className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 text-[12px] hover:text-white transition-colors"
                                >
                                    <FaUser className="mr-2" /> User Management
                                </div>
                                {isUserOpen && (
                                    <ul className="ml-4">
                                        <li className="mt-3">
                                            <Link
                                                to="/Usermng"
                                                className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Usermng' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                                <FaUser className="mr-2" /> Users
                                            </Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link
                                                to="/Role"
                                                className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Role' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                                <FaUser className="mr-2" /> Role
                                            </Link>
                                        </li>
                                        <li className="mt-3">
                                            <Link
                                                to="/AMS"
                                                className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/AMS' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                                <FaUser className="mr-2" /> Access Privilege
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                            <li className="mt-1">
                                <Link
                                    to="/Leave"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Leave' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                                    <FaUser className="mr-2" /> Leave Management
                                </Link>
                            </li>
                        </ul>

                    )}
                </li>
                {/* ASM Menu Item */}
                <li className="mt-1">
                    <div
                        onClick={toggleAssetMenu}
                        className="flex items-center p-2 text-black rounded cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
                    >
                        <FaUser className="mr-2" /> Asset Management
                    </div>

                    {isAssetOpen && (
                        <ul className="ml-4">
                            <li className="mt-3">
                                <Link
                                    to="/Approval"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Approval' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaUserCog  className="mr-2" /> Approval Authority
                                </Link>
                            </li>
                          

                            <li className="mt-3">
                                <Link
                                    to="/ResubmittedApproval"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/ResubmittedApproval' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaUserCog  className="mr-2" /> Resubmitted Approval
                                </Link>
                            </li>
                            
                            <li className="mt-3">

                                <Link
                                    to="/assets"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/assets' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaTh  className="mr-2" /> Asset
                                </Link>
                            </li>

                        <li className="mt-3">

                                <Link
                                    to="/OrganizationLevel"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/OrganizationLevel' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaTh  className="mr-2" /> Organization Level
                                </Link>
                            </li>

                            <li className="mt-3">
                                <Link
                                    to="/categories"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/categories' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaClipboardList  className="mr-2" /> Category
                                </Link>
                            </li>
                            <li className="mt-3">
                                <Link
                                    to="/Depreciation"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Depreciation' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaUserCog  className="mr-2" /> Depreciation
                                </Link>
                            </li>
                            <li className="mt-3">
                                <Link
                                    to="/Workflow"
                                    className={`flex items-center p-2 text-black rounded transition-colors text-[10px] ${location.pathname === '/Workflow' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}
                                >
                                    <FaProjectDiagram className="mr-2" /> Workflow
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                {/* UCS Menu Item */}
                <li className="mt-1">
                    <Link
                        to="/UCS"
                        className={`flex items-center p-2 text-black rounded transition-colors ${location.pathname === '/UCS' ? 'bg-blue-600 text-white' : 'hover:bg-blue-600 hover:text-white'}`}>
                        <FaUser className="mr-2" /> UCS
                    </Link>
                </li>
            </ul>
        </div>
    );
};
export default Sidebar;