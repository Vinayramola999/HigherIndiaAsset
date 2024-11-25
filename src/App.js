// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Signup from "./Pages/Signup";
// import Login from "./Pages/Login";
// import UserLogin from "./Pages/UserLogin";
// import Profile from "./Profile";
// import UserProfile from "./UserProfile";
// import Cards from "./Cards";
// import Cards1 from "./Cards1";
// import UCS from "./UCS";
// import HRMS from "./HRMS";
// import DynamicForm from './DynamicForm';
// import Verify from "./Pages/Verify";
// import Password from "./Pages/Password";
// import SuperLogin from "./Pages/SuperLogin";
// import NewPassword from "./Components/NewPassword";
// import ProfileDropdown from './ProfileDropdown';
// import ChangePassword from './Components/ChangePassword';
// import UMC from "./UMC";

// //Sidebar
// import HRMSidebar from './Sidebar/HRMSidebar';

// //Organization Set Up
// import Departments from "./OrganizationSetup/Departments";
// import Designation from "./OrganizationSetup/Designation";
// import Domain from "./OrganizationSetup/Domain";
// import Location from "./OrganizationSetup/Location";

// //User Management
// import Usermng from "./UserManagemnt/Usermng";
// import Role from "./UserManagemnt/Role";
// import AMS from "./UserManagemnt/AMS";
// import AMS1 from "./UserManagemnt/AMS1";

// //Leave Management
// import Leave from "./LeaveManagement/Leave";
// import ApplyLeave from "./LeaveManagement/ApplyLeave";
// import BalanceLeave from "./LeaveManagement/BalanceLeave";
// import CreateLeave from "./LeaveManagement/CreateLeave";
// import LeaveApproval from "./LeaveManagement/LeaveApproval";
// import LeavePolicy from "./LeaveManagement/LeavePolicy";
// import CalenderLeave from "./LeaveManagement/CalenderLeave";

// //Asset Management
// import Asset from "./Asset/Asset";
// import Category from './Asset/Category';
// import WorkflowPage from './Asset/Workflow';
// import ApprovalAuthority from './Asset/ApprovalAuthority';
// import Depreciation from './Asset/Depreciation';

// function App() {
//   return (
//     <div className='Main'>
//       <Routes>
//         <Route path='/' element={<Login />} />
//         <Route path='/Signup' element={<Signup />} />
//         <Route path='/UserLogin' element={<UserLogin />} />

//         <Route path='/Password' element={<Password />} />
//         <Route path='/UMC' element={<UMC />} />
//         <Route path="/Profile" element={<Profile />} />
//         <Route path='/UserProfile' element={<UserProfile />} />
//         <Route path='/Cards' element={<Cards />} />
//         <Route path='/HRMS' element={<HRMS />} />
//         <Route path='/Cards1' element={<Cards1 />} />
//         <Route path='/DynamicForm' element={<DynamicForm />} />
//         <Route path='/ProfileDopdown' element={<ProfileDropdown />} />
//         <Route path='/UCS' element={<UCS />} />
//         <Route path='/NewPassword' element={<NewPassword />} />
//         <Route path='/Verify' element={<Verify />} />
//         <Route path="/SuperLogin" element={<SuperLogin />} />
//         <Route path="/ChangePassword" element={<ChangePassword />} />


//         {/*************************SIDEBAR******************/}
//         <Route path='/HRMSidebar' element={<HRMSidebar />} />

//         {/************************Organization Set Up ******************/}
//         <Route path='/Departments' element={<Departments />} />
//         <Route path='/Designation' element={<Designation />} />
//         <Route path='/Domain' element={<Domain />} />
//         <Route path='/Location' element={<Location />} />

//         {/*************************User Management******************/}
//         <Route path='/Role' element={<Role />} />
//         <Route path='/AMS' element={<AMS />} />
//         <Route path='/AMS1' element={<AMS1 />} />
//         <Route path='/Usermng' element={<Usermng />} />

//         {/*************************Leave Management******************/}
//         <Route path='/Leave' element={<Leave />} />
//         <Route path='/ApplyLeave' element={<ApplyLeave />} />
//         <Route path='/BalanceLeave' element={<BalanceLeave />} />
//         <Route path='/CreateLeave' element={<CreateLeave />} />
//         <Route path="/LeaveApproval" element={<LeaveApproval />} />
//         <Route path="/LeavePolicy" element={<LeavePolicy />} />
//         <Route path="/CalenderLeave" element={<CalenderLeave />} />

//         {/********************* */}
//         <Route path="/assets" element={<Asset />} />
//         <Route path="/categories" element={<Category />} />
//         <Route path="/Approval" element={<ApprovalAuthority />} />
//         <Route path="/Workflow" element={<WorkflowPage />} />
//         <Route path="/Depreciation" element={<Depreciation />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Import Components and Pages
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

// Sidebar
import HRMSidebar from './Sidebar/HRMSidebar';

// Organization Set Up
import Departments from "./OrganizationSetup/Departments";
import Designation from "./OrganizationSetup/Designation";
import Domain from "./OrganizationSetup/Domain";
import Location from "./OrganizationSetup/Location";
import Modal from "./OrganizationSetup/Modal";

// User Management
import Usermng from "./UserManagemnt/Usermng";
import Role from "./UserManagemnt/Role";
import AMS from "./UserManagemnt/AMS";
import AMS1 from "./UserManagemnt/AMS1";

// Leave Management
import Leave from "./LeaveManagement/Leave";
import ApplyLeave from "./LeaveManagement/ApplyLeave";
import BalanceLeave from "./LeaveManagement/BalanceLeave";
import CreateLeave from "./LeaveManagement/CreateLeave";
import LeaveApproval from "./LeaveManagement/LeaveApproval";
import LeavePolicy from "./LeaveManagement/LeavePolicy";
import CalenderLeave from "./LeaveManagement/CalenderLeave";

// Asset Management
import Asset from "./Asset/Asset";
import Category from './Asset/Category';
import WorkflowPage from './Asset/Workflow';
import ApprovalAuthority from './Asset/ApprovalAuthority';
import Depreciation from './Asset/Depreciation';
import ResubmittedApproval from './Asset/ResubmittedApproval';

function App() {
  // Define routes using createBrowserRouter
  const appRouter = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/user-login", element: <UserLogin /> },
    { path: "/password", element: <Password /> },
    { path: "/umc", element: <UMC /> },
    { path: "/profile", element: <Profile /> },
    { path: "/user-profile", element: <UserProfile /> },
    { path: "/cards", element: <Cards /> },
    { path: "/hrms", element: <HRMS /> },
    { path: "/cards1", element: <Cards1 /> },
    { path: "/dynamic-form", element: <DynamicForm /> },
    { path: "/profile-dropdown", element: <ProfileDropdown /> },
    { path: "/ucs", element: <UCS /> },
    { path: "/new-password", element: <NewPassword /> },
    { path: "/verify", element: <Verify /> },
    { path: "/super-login", element: <SuperLogin /> },
    { path: "/change-password", element: <ChangePassword /> },

    // Sidebar
    { path: "/hrm-sidebar", element: <HRMSidebar /> },

    // Organization Setup
    { path: "/departments", element: <Departments /> },
    { path: "/designation", element: <Designation /> },
    { path: "/domain", element: <Domain /> },
    { path: "/location", element: <Location /> },
    {path: "/modal", element: <Modal />},

    // User Management
    { path: "/role", element: <Role /> },
    { path: "/ams", element: <AMS /> },
    { path: "/ams1", element: <AMS1 /> },
    { path: "/usermng", element: <Usermng /> },

    // Leave Management
    { path: "/leave", element: <Leave /> },
    { path: "/apply-leave", element: <ApplyLeave /> },
    { path: "/balance-leave", element: <BalanceLeave /> },
    { path: "/create-leave", element: <CreateLeave /> },
    { path: "/leave-approval", element: <LeaveApproval /> },
    { path: "/leave-policy", element: <LeavePolicy /> },
    { path: "/calendar-leave", element: <CalenderLeave /> },

    // Asset Management
    { path: "/assets", element: <Asset /> },
    { path: "/categories", element: <Category /> },
    { path: "/workflow", element: <WorkflowPage /> },
    { path: "/approval", element: <ApprovalAuthority /> },
    { path: "/depreciation", element: <Depreciation /> },
    { path: "/ResubmittedApproval", element: <ResubmittedApproval /> },

    // Default fallback route
    { path: "/*", element: <div>Page Not Found</div> },
  ]);

  return <RouterProvider router={appRouter} />;
}

export default App;
