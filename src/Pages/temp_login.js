// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return; 
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Profile');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false); 
//     }
//   };
//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//         {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//         {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//       </div>
//     </div>
//   );
// };
// export default Login;


// import React, { useState } from 'react';
// import axios from 'axios';
// import login from '../loginimg.jpg';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Profile');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };
//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };
//   return (
//     <div className="h-screen flex">
//       {/* Left side with image */}
//       <div className="w-1/2 bg-#79DFEE-200 flex justify-center items-center ">
//         <img src={login} alt="Login Illustration" className="object-cover w-[90%] h-full" />
//       </div>

//       {/* Right side with login form */}
//       <div className="w-1/2 bg-yellow-100 flex justify-center items-center">
//         <div className= "p-8 rounded-lg  w-full max-w-md">
//           <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
//           <form onSubmit={handleLogin}>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Enter email:
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <i className="fas fa-user text-gray-400"></i>
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>
//             <div className="mb-6">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <i className="fas fa-lock text-gray-400"></i>
//                 </span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="password"
//                 />
//                 <span className="absolute inset-y-0 right-0 flex items-center pr-2">
//                   <i className="fas fa-eye-slash text-gray-400"></i>
//                 </span>
//               </div>
//               {/* <div className="text-right mt-2">
//                 <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Forgot Password?</a>
//               </div> */}
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'bg-gray-400' : 'bg-teal-500 hover:bg-teal-600'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//           {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//           {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//           {/* <div className="mt-6 flex items-center justify-center">
//             <div className="border-t border-gray-300 w-24"></div>
//             <span className="mx-4 text-sm text-gray-500">or login with</span>
//             <div className="border-t border-gray-300 w-24"></div>
//           </div> */}
//           {/* <button className="mt-4 flex items-center justify-center w-full py-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50">
//             <img src="path_to_google_logo.png" alt="Google Logo" className="w-5 h-5 mr-3" />
//             Login with Google
//           </button> */}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;


// import React, { useState } from 'react';
// import axios from 'axios';
// import login from '../login.jpg';
// import { useNavigate } from 'react-router-dom';
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/2 bg-79DFEE-200 flex justify-center items-center ">
//         <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
//       </div>

//       <div className="w-1/2 bg-blue-100 flex justify-center items-center">
//         <div className= "p-8 rounded-lg  w-full max-w-md">
//           <h2 className="text-3xl font-bold text-center mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Enter email:
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <i className="fas fa-user text-gray-400"></i>
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>
//             <div className="mb-6">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-2">
//                   <i className="fas fa-lock text-gray-400"></i>
//                 </span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="password"
//                 />
//                 <span className="absolute inset-y-0 right-0 flex items-center pr-2">
//                   <i className="fas fa-eye-slash text-gray-400"></i>
//                 </span>
//               </div>
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'bg-gray-400' : 'bg-teal-500 hover:bg-teal-600'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//           {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//           {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;
// import React, { useState } from 'react';
// import axios from 'axios';
// import login from '../login.jpg'; // Your uploaded image path
// import { useNavigate } from 'react-router-dom';
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   return (
//     <div className="h-screen flex">
//       {/* Left Section */}
//       <div className="w-1/2 bg-blue-500 flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[80%]" />
//       </div>

//       {/* Right Section */}
//       <div className="w-1/2 bg-gray-100 flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-4xl font-bold text-center mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>
//             {/* Email Input */}
//             <div className="mb-4">
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-user text-gray-400"></i>
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Email, Username, Phone"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="mb-4">
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-lock text-gray-400"></i>
//                 </span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Password"
//                 />
//                 <span className="absolute inset-y-0 right-0 flex items-center pr-3">
//                   <i className="fas fa-eye-slash text-gray-400"></i>
//                 </span>
//               </div>
//               <div className="flex justify-between items-center mt-2">
//                 <label className="text-sm">
//                   <input type="checkbox" className="mr-1" />
//                   Remember me
//                 </label>
//                 {/* <a href="#" className="text-sm text-blue-600">Forgot Password?</a> */}
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'bg-gray-400' : 'bg-gray-700 hover:bg-gray-800'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>

//             <div className="flex items-center justify-center my-4">
//               <span className="border-t w-1/3"></span>
//               <span className="px-2 text-sm text-gray-500">or</span>
//               <span className="border-t w-1/3"></span>
//             </div>

//             {/* Google Login */}
//             <button
//               type="button"
//               className="w-full py-3 flex items-center justify-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700 bg-white hover:bg-gray-100"
//             >
//               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google Logo" className="w-5 h-5 mr-2" />
//               Login with Google
//             </button>

//           </form>

//           {/* Error & Success Messages */}
//           {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//           {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;


// import React, { useState } from 'react';
// import axios from 'axios';
// import login from '../login.jpg'; // Your uploaded image path
// import { useNavigate } from 'react-router-dom';
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   return (
//     <div className="h-screen flex">
//       {/* Left Section */}
//       <div className="w-1/2 bg-blue-500 flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[80%]" />
//       </div>

//       {/* Right Section */}
//       <div className="w-1/2 bg-gray-100 flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-4xl font-bold text-center mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>
//             {/* Email Input */}
//             <div className="mb-4">
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-envelope text-gray-400"></i> {/* Email Icon */}
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Email"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="mb-4">
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-lock text-gray-400"></i> {/* Password Icon */}
//                 </span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Password"
//                 />
//               </div>
//               <div className="flex justify-between items-center mt-2">
//                 <label className="text-sm">
//                   <input type="checkbox" className="mr-1" />
//                   Remember me
//                 </label>
//                 <a href="#" className="text-sm text-blue-600">Forgot Password?</a>
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'bg-gray-400' : 'bg-gray-700 hover:bg-gray-800'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>

//             <div className="flex items-center justify-center my-4">
//               <span className="border-t w-1/3"></span>
//               <span className="px-2 text-sm text-gray-500">or</span>
//               <span className="border-t w-1/3"></span>
//             </div>

//             {/* Google Login */}
//             <button
//               type="button"
//               className="w-full py-3 flex items-center justify-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700 bg-white hover:bg-gray-100"
//             >
//               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google Logo" className="w-5 h-5 mr-2" />
//               Login with Google
//             </button>

//           </form>

//           {/* Error & Success Messages */}
//           {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//           {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;


// import React, { useState } from 'react';
// import axios from 'axios';
// import login from '../login.jpg';
// import { useNavigate } from 'react-router-dom';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/2  flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
//       </div>

//       <div className="w-1/2 bg-custom-gray flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-5xl font-bold text-center text-custome-blue mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>

//             <div className="mb-4">
//               {/* Email Label and Input */}
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Email
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-envelope text-black-500"></i> {/* Email Icon */}
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-key text-black-500"></i>
//                 </span>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Password"
//                 />
//               </div>

//               <div className="flex justify-between items-center mt-2">
//                 <label className="text-sm">
//                   <input type="checkbox" className="mr-1" />
//                   Remember me
//                 </label>
//                 <a href="#" className="text-sm text-blue-600">Forgot Password?</a>
//               </div>
//             </div>


//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-full focus:outline-none focus:ring-2 ${loading ? 'bg-custom-dark-gray' : 'bg-gray-700 hover:bg-custome-blue'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>

//             {/* <div className="flex items-center justify-center my-4">
//                 <span className="border-t w-1/3"></span>
//                 <span className="px-2 text-sm text-gray-500">or</span>
//                 <span className="border-t w-1/3"></span>
//               </div>
//               <button
//                 type="button"
//                 className="w-full py-3 flex items-center justify-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-700 bg-white hover:bg-gray-100"
//               >
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google Logo" className="w-5 h-5 mr-2" />
//                 Login with Google
//               </button> */}
//           </form>
//           {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//           {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;


// import axios from 'axios';
// import login from '../assests/login.jpg';
// import { useNavigate } from 'react-router-dom';
// import React, { useState, useEffect } from 'react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedEmail = localStorage.getItem('email');
//     if (storedEmail) {
//       setEmail(storedEmail);
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         if (rememberMe) {
//           localStorage.setItem('email', email);
//         } else {
//           localStorage.removeItem('email');
//         }
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/2  flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
//       </div>

//       <div className="w-1/2 bg-custom-gray flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-5xl font-bold text-center text-custome-blue mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>

//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Email
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-envelope text-black-500"></i> {/* Email Icon */}
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-key text-black-500"></i>
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Password"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-3"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>


//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-full focus:outline-none focus:ring-2 ${loading ? 'bg-custom-dark-gray' : 'bg-gray-700 hover:bg-custome-blue'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>

//             {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//             {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import login from '../assests/login.jpg';
// const PasswordResetPopup = ({ email, onSendOtp, onClose }) => {
//   const handleSendOtp = () => {
//     onSendOtp(email);
//   };

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-md shadow-lg">
//         <h3 className="text-2xl font-bold mb-4">Password Reset Required</h3>
//         <p className="mb-4">Please reset your password. Enter your email to receive an OTP.</p>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="text"
//             value={email}
//             disabled
//             className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSendOtp}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//           >
//             Send OTP
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false); // State to show/hide the popup
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedEmail = localStorage.getItem('email');
//     if (storedEmail) {
//       setEmail(storedEmail);
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email || !password) {
//       setError('Both fields are required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         if (rememberMe) {
//           localStorage.setItem('email', email);
//         } else {
//           localStorage.removeItem('email');
//         }
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.preview && err.preview.data && err.preview.data.error) {
//         const previewMessage = err.preview.data.error;
//         if (previewMessage === 'Password reset required.Please change your password.') {
//           setShowPasswordResetPopup(true);
//         } else {
//           setError(previewMessage);
//         }
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendOtp = async (email) => {
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/send-otp', { email });
//       if (response.data.success) {
//         alert('OTP sent to your email');
//         setShowPasswordResetPopup(false);
//         navigate(`/reset-password?email=${email}`);
//       }
//     } catch (err) {
//       console.error('Error sending OTP:', err);
//       alert('Failed to send OTP. Please try again.');
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/2 flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
//       </div>

//       <div className="w-1/2 bg-custom-gray flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-5xl font-bold text-center text-custome-blue mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>
//             {/* Email Input */}
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Email
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-envelope text-black-500"></i>
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-key text-black-500"></i>
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Password"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-3"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-full focus:outline-none focus:ring-2 ${loading ? 'bg-custom-dark-gray' : 'bg-gray-700 hover:bg-custome-blue'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>

//             {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//             {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//           </form>

//           {/* Show Password Reset Popup */}
//           {showPasswordResetPopup && (
//             <PasswordResetPopup
//               email={email}
//               onSendOtp={handleSendOtp}
//               onClose={() => setShowPasswordResetPopup(false)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import login from '../assests/login.jpg';

// const PasswordResetMsgPopup = ({ email, onSendOtp, onClose }) => {
//   const handleSendOtp = () => {
//     onSendOtp(email);
//   };

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-md shadow-lg">
//         <h3 className="text-2xl font-bold mb-4">Password Reset Required</h3>
//         <p className="mb-4">Please reset your password.</p>

//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSendOtp}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const PasswordResetPopup = ({ email, otp, onClose }) => {
//   const handleSendOtp = () => {
//   };

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-md shadow-lg">
//         <h3 className="text-2xl font-bold mb-4">Password Reset Required</h3>
//         <p className="mb-4">Please reset your password. Enter your email to receive an OTP.</p>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="text"
//             value={email}
//             disabled
//             className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">OTP</label>
//           <input
//             type="text"
//             value={otp}
//             disabled
//             className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSendOtp}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false);
//   const [showPasswordResetMsgPopup, setShowPasswordResetMsgPopup] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedEmail = localStorage.getItem('email');
//     if (storedEmail) {
//       setEmail(storedEmail);
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email ) {
//       setError('Email is required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         if (rememberMe) {
//           localStorage.setItem('email', email);
//         } else {
//           localStorage.removeItem('email');
//         }
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.message) {
//         const previewMessage = err.response.data.message;
//         if (previewMessage === 'Password reset required. Please change your password.') {
//           setShowPasswordResetMsgPopup(true);
//         } else {
//           setError(previewMessage);
//         }
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendOtp = async (email) => {
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/request-otp', { email });
//       if (response.data.success) {
//         alert('OTP sent to your email');
//         setShowPasswordResetMsgPopup(false);
//         navigate(`/reset-password?email=${email}`);
//       }
//     } catch (err) {
//       console.error('Error sending OTP:', err);
//       alert('Failed to send OTP. Please try again.');
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/2 flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
//       </div>

//       <div className="w-1/2 bg-custom-gray flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-5xl font-bold text-center text-custome-blue mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>
//             {/* Email Input */}
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-envelope text-black-500"></i>
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-key text-black-500"></i>
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Password"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-3"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//             </div>

//             {/* Remember Me Checkbox */}
//             <div className="mb-4 flex items-center">
//               <input
//                 type="checkbox"
//                 id="rememberMe"
//                 checked={rememberMe}
//                 onChange={(e) => setRememberMe(e.target.checked)}
//                 className="mr-2"
//               />
//               <label htmlFor="rememberMe" className="text-gray-700">Remember Me</label>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-3 rounded-full focus:outline-none focus:ring-2 ${loading ? 'bg-custom-dark-gray' : 'bg-gray-700 hover:bg-custome-blue'} text-white`}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>

//             {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
//             {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
//           </form>

//           {/* Show Password Reset Popup */}
//           {showPasswordResetMsgPopup && (
//             <PasswordResetMsgPopup
//               email={email}
//               onSendOtp={handleSendOtp}
//               onClose={() => setShowPasswordResetMsgPopup(false)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;  




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import login from '../assests/login.jpg';
// const PasswordResetPopup = ({ email, onSendOtp, onClose }) => {
//   const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false);
//   const [showOtpVerificationPopup, setShowOtpVerificationPopup] = useState(false);

//   const handleSendOtp = async () => {
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/request-otp', { email });
//       if (response.status) {
//         alert('OTP sent to your email');
//         onSendOtp(email); // Call the onSendOtp function to update the state in the Login component
//       }
//     } catch (err) {
//       console.error('Error sending OTP:', err);
//       alert('Failed to send OTP. Please try again.');
//     } finally {
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-md shadow-lg">
//         <h3 className="text-2xl font-bold mb-4">Password Reset Required</h3>
//         <p className="mb-4">Please reset your password. Enter your email to receive an OTP.</p>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="text"
//             value={email}
//             disabled
//             className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => handleSendOtp(email)}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//           >
//             Send OTP
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };
// const OtpVerificationPopup = ({ email, onVerifyOtp, onClose }) => {
//   const [otp, setOtp] = useState('');

//   const handleVerifyOtp = () => {
//     onVerifyOtp(email, otp);
//   };

//   return (
//     <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-md shadow-lg">
//         <h3 className="text-2xl font-bold mb-4">Enter OTP</h3>
//         <p className="mb-4">An OTP has been sent to your email. Please enter it below to verify your email.</p>
//         <div className="mb-4">
//           <label className="block text-gray-700">Email</label>
//           <input
//             type="text"
//             value={email}
//             disabled
//             className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700">OTP</label>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded-lg"
//             placeholder="Enter OTP"
//           />
//         </div>
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleVerifyOtp}
//             className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//           >
//             Verify OTP
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false);
//   const [showOtpVerificationPopup, setShowOtpVerificationPopup] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedEmail = localStorage.getItem('email');
//     if (storedEmail) {
//       setEmail(storedEmail);
//     }
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     if (!email) {
//       setError('Email is required');
//       return;
//     }
//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address');
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/login', {
//         email,
//         password,
//       });
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         if (rememberMe) {
//           localStorage.setItem('email', email);
//         } else {
//           localStorage.removeItem('email');
//         }
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => {
//           navigate('/Cards');
//         }, 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       console.error('Error during login:', err);
//       if (err.response && err.response.data && err.response.data.message) {
//         const previewMessage = err.response.data.message;
//         if (previewMessage === 'Password reset required. Please change your password.') {
//           setShowPasswordResetPopup(true);
//         } else {
//           setError(previewMessage);
//         }
//       } else {
//         setError('Invalid email or password. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSendOtp = async (email) => {
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/request-otp', { email });
//       if (response.status) {
//         alert('OTP sent to your email');
//         // setShowPasswordResetPopup(false);
//         setShowOtpVerificationPopup(true);
//       }
//     } catch (err) {
//       console.error('Error sending OTP:', err);
//       alert('Failed to send OTP. Please try again.');
//     }
//   };

//   const handleVerifyOtp = async (email, otp) => {
//     try {
//       const response = await axios.post('https://highersystem.onrender.com/verify-otp', { email, otp });
//       if (response.status) {
//         alert('OTP verified successfully');
//         navigate(`/reset-password?email=${email}`);
//       }
//     } catch (err) {
//       console.error('Error verifying OTP:', err);
//       alert('Failed to verify OTP. Please try again.');
//     }finally{
//       setShowOtpVerificationPopup(false);
//     }
//   };

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/2 flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
//       </div>

//       <div className="w-1/2 bg-custom-gray flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-5xl font-bold text-center text-custome-blue mb-6">Welcome</h2>
//           <form onSubmit={handleLogin}>
//             {/* Email Input */}
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-envelope text-black-500"></i>
//                 </span>
//                 <input
//                   type="text"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>

//             {/* Password Input */}
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                   <i className="fas fa-lock text-black-500"></i>
//                 </span>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Password"
//                 />
//                 <span
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? <FaEye /> : <FaEyeSlash />}
//                 </span>
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={() => setRememberMe(!rememberMe)}
//                   className="form-checkbox text-blue-600"
//                 />
//                 <span className="ml-2 text-gray-700">Remember me</span>
//               </label>
//             </div>

//             {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
//             {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

//             <button
//               type="submit"
//               className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''
//                 }`}
//               disabled={loading}
//             >
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* Password Reset Popup */}
//       {showPasswordResetPopup && (
//         <PasswordResetPopup
//           email={email}
//           onSendOtp={handleSendOtp}
//           onClose={() => setShowPasswordResetPopup(false)}
//         />
//       )}

//       {/* OTP Verification Popup */}
//       {showOtpVerificationPopup && (
//         <OtpVerificationPopup
//           email={email}
//           onVerifyOtp={handleVerifyOtp}
//           onClose={() => setShowOtpVerificationPopup(false)}
//         />
//       )}
//     </div>
//   );
// };
// export default Login;
