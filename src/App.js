import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import UserLogin from "./Pages/UserLogin";
import Profile from "./Profile";
import UserProfile from "./UserProfile";
import Cards from "./Cards";
import Cards1 from "./Cards1";
import UCS from "./UCS";
import HRMS from "./HRMS";
import DynamicForm from './DynamicForm';
import Verify from "./Pages/Verify";
import Password from "./Pages/Password";
import SuperLogin from "./Pages/SuperLogin";
import NewPassword from "./Components/NewPassword";
import ProfileDropdown from './ProfileDropdown';
import ChangePassword from './Components/ChangePassword';
import UMC from "./UMC";

//Sidebar
import HRMSidebar from './Sidebar/HRMSidebar';

//Organization Set Up
import Departments from "./OrganizationSetup/Departments";
import Designation from "./OrganizationSetup/Designation";
import Domain from "./OrganizationSetup/Domain";
import Location from "./OrganizationSetup/Location";

//User Management
import Usermng from "./UserManagemnt/Usermng";
import Role from "./UserManagemnt/Role";
import AMS from "./UserManagemnt/AMS";

//Leave Management
import Leave from "./LeaveManagement/Leave";
import ApplyLeave from "./LeaveManagement/ApplyLeave";
import BalanceLeave from "./LeaveManagement/BalanceLeave";
import CreateLeave from "./LeaveManagement/CreateLeave";
import LeaveApproval from "./LeaveManagement/LeaveApproval";
import LeavePolicy from "./LeaveManagement/LeavePolicy";
import CalenderLeave from "./LeaveManagement/CalenderLeave";

//Asset Management
import Asset from "./Asset/Asset";
import Category from './Asset/Category';
import WorkflowPage from './Asset/Workflow';
import ApprovalAuthority from './Asset/ApprovalAuthority';
import Depreciation from './Asset/Depreciation';
import ResubmittedApproval from './Asset/ResubmittedApproval';
import OrganizationLevel from './Asset/OrganisationLevel';


function App() {
  return (
    <div className='Main'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/UserLogin' element={<UserLogin />} />

        <Route path='/Password' element={<Password />} />
        <Route path='/UMC' element={<UMC />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path='/UserProfile' element={<UserProfile />} />
        <Route path='/Cards' element={<Cards />} />
        <Route path='/HRMS' element={<HRMS />} />
        <Route path='/Cards1' element={<Cards1 />} />
        <Route path='/DynamicForm' element={<DynamicForm />} />
        <Route path='/ProfileDopdown' element={<ProfileDropdown />} />
        <Route path='/UCS' element={<UCS />} />
        <Route path='/NewPassword' element={<NewPassword />} />
        <Route path='/Verify' element={<Verify />} />
        <Route path="/SuperLogin" element={<SuperLogin />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />


        {/*************************SIDEBAR******************/}
        <Route path='/HRMSidebar' element={<HRMSidebar />} />

        {/************************Organization Set Up ******************/}
        <Route path='/Departments' element={<Departments />} />
        <Route path='/Designation' element={<Designation />} />
        <Route path='/Domain' element={<Domain />} />
        <Route path='/Location' element={<Location />} />

        {/*************************User Management******************/}
        <Route path='/Role' element={<Role />} />
        <Route path='/AMS' element={<AMS />} />
        <Route path='/Usermng' element={<Usermng />} />

        {/*************************Leave Management******************/}
        <Route path='/Leave' element={<Leave />} />
        <Route path='/ApplyLeave' element={<ApplyLeave />} />
        <Route path='/BalanceLeave' element={<BalanceLeave />} />
        <Route path='/CreateLeave' element={<CreateLeave />} />
        <Route path="/LeaveApproval" element={<LeaveApproval />} />
        <Route path="/LeavePolicy" element={<LeavePolicy />} />
        <Route path="/CalenderLeave" element={<CalenderLeave />} />


        {/********************* */}
        <Route path="/assets" element={<Asset />} />
        <Route path="/categories" element={<Category />} />
        <Route path="/Approval" element={<ApprovalAuthority />} />
        <Route path="/Workflow" element={<WorkflowPage />} />
        <Route path="/Depreciation" element={<Depreciation />} />
        <Route path="/ResubmittedApproval" element={<ResubmittedApproval />} />
        <Route path="/OrganizationLevel" element={<OrganizationLevel />} />

      </Routes>
    </div>
  );
}

export default App;
