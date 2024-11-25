// import React, { useState } from 'react';
// import axios from 'axios';
// import { FaEnvelope, FaKey } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import login from '../assests/login.jpg';
// import PasswordResetPopup from '../Components/PasswordResetPopup';
// import OtpVerificationPopup from '../Components/OtpVerificationPopup';
// import ReCAPTCHA from 'react-google-recaptcha';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false);
//   const [showOtpVerificationPopup, setShowOtpVerificationPopup] = useState(false);
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [recaptchaToken, setRecaptchaToken] = useState(null); // State for reCAPTCHA
//   const navigate = useNavigate();

//   const handleEmailVerify = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     try {
//       const response = await axios.post('http://higherindia.net:3006/mail-verify', { email });
//       if (response.status === 403) {
//         setShowPasswordResetPopup(true);
//       } else if (response.data.message === "User found. You can proceed to login.") {
//         setIsEmailVerified(true);
//         setSuccess('Email verified! Please enter your password.');
//         setError('');
//       } else {
//         setError('Unexpected response.');
//       }
//     } catch (err) {
//       if (err.response && err.response.status === 403) {
//         setShowPasswordResetPopup(true);
//       } else {
//         setError('Error verifying email. Please try again.');
//       }
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);
//     if (!recaptchaToken) {
//       alert('Please verify the reCAPTCHA before submitting.');
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await axios.post('http://higherindia.net:3006/login', { email, password, }); // Include token in request
//       const { token, userId } = response.data;
//       if (token && userId) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('userId', userId);
//         setSuccess('Login successful!');
//         setError('');
//         setTimeout(() => navigate('/Cards'), 1000);
//       } else {
//         throw new Error('Token or User ID not received');
//       }
//     } catch (err) {
//       setError('Invalid email or password.');
//       setSuccess('');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => setShowPassword(!showPassword);

//   const handleOtpSent = () => {
//     setShowPasswordResetPopup(false);
//     setShowOtpVerificationPopup(true);
//   };

//   // Handle the reCAPTCHA token
//   const handleRecaptchaChange = (token) => {
//     setRecaptchaToken(token);
//   };

//   return (
//     <div className="h-screen flex">
//       <div className="w-1/2 flex justify-center items-center">
//         <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
//       </div>
//       <div className="w-1/2 bg-custom-gray flex justify-center items-center">
//         <div className="p-8 rounded-lg w-full max-w-md">
//           <h2 className="text-5xl font-bold text-center text-custome-blue mb-6">Welcome</h2>
//           <form onSubmit={isEmailVerified ? handleLogin : handleEmailVerify}>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-[16px]  ml-2 mb-1">Email</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaEnvelope className="text-black" />
//                 </span>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full py-3 pl-10 border text-[14px] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Email"
//                 />
//               </div>
//             </div>

//             {isEmailVerified && (
//               <div className="mb-4 relative">
//                 <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//                   Password
//                 </label>
//                 <span className="absolute inset-y-0 left-0 pl-3 mt-7 flex items-center pointer-events-none">
//                   <FaKey className="text-black" />
//                 </span>
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   placeholder="Enter Password"
//                 />
//                 {/* <span
//                   className="absolute inset-y-0 right-0 pr-3 mt-7 flex items-center cursor-pointer"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? <FaEye /> : <FaEyeSlash />}
//                 </span> */}
//               </div>
//             )}

//             {isEmailVerified && (
//               <div className="mb-4">
//                 <ReCAPTCHA
//                   sitekey="6LdJ6HcqAAAAAC9jfeOKaxVpLLQCoveF5iGkHYH9"
//                   onChange={handleRecaptchaChange}
//                   action="LOGIN"
//                 />
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full py-3 bg-custome-blue text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               enabled={isEmailVerified} // Disable until captcha is verified
//             >
//               {isEmailVerified ? 'Login' : 'Verify Email'}
//             </button>

//             {error && (
//               <div className="mt-4 text-red-500 text-sm">{error}</div>
//             )}
//             {success && (
//               <div className="mt-4 text-green-500 text-sm">{success}</div>
//             )}
//           </form>

//           {showPasswordResetPopup && (
//             <PasswordResetPopup
//               email={email}
//               onOtpSent={handleOtpSent}
//               onClose={() => setShowPasswordResetPopup(false)}
//             />
//           )}

//           {showOtpVerificationPopup && (
//             <OtpVerificationPopup
//               email={email}
//               onClose={() => setShowOtpVerificationPopup(false)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Login;



//************Login Without Captcha***************/
import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import login from '../assests/login.jpg';
import PasswordResetPopup from '../Components/PasswordResetPopup';
import OtpVerificationPopup from '../Components/OtpVerificationPopup';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordResetPopup, setShowPasswordResetPopup] = useState(false);
  const [showOtpVerificationPopup, setShowOtpVerificationPopup] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  const handleEmailVerify = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post('http://higherindia.net:3006/mail-verify', { email });
      if (response.status === 403) {
        setShowPasswordResetPopup(true);
      } else if (response.data.message === "User found. You can proceed to login.") {
        setIsEmailVerified(true);
        setSuccess('Email verified! Please enter your password.');
        setError('');
      } else {
        setError('Unexpected response.');
      }
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setShowPasswordResetPopup(true);
      } else {
        setError('Error verifying email. Please try again.');
      }
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // if (!recaptchaToken) {
    //   alert('Please verify the reCAPTCHA before submitting.');
    //   setLoading(false);
    //   return;
    // }
    try {
      const response = await axios.post('http://higherindia.net:3006/login', { email, password, }); // Include token in request
      const { token, userId } = response.data;
      if (token && userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        setSuccess('Login successful!');
        setError('');
        setTimeout(() => navigate('/Cards'), 1000);
      } else {
        throw new Error('Token or User ID not received');
      }
    } catch (err) {
      setError('Invalid email or password.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleOtpSent = () => {
    setShowPasswordResetPopup(false);
    setShowOtpVerificationPopup(true);
  };

  // Handle the reCAPTCHA token
  // const handleRecaptchaChange = (token) => {
  //   setRecaptchaToken(token);
  // };

  return (
    <div className="h-screen flex">
      <div className="w-1/2 flex justify-center items-center">
        <img src={login} alt="Login Illustration" className="object-cover h-[100%]" />
      </div>
      <div className="w-1/2 bg-custom-gray flex justify-center items-center">
        <div className="p-8 rounded-lg w-full max-w-md">
          <h2 className="text-5xl font-bold text-center text-custome-blue mb-6">Welcome</h2>
          <form onSubmit={isEmailVerified ? handleLogin : handleEmailVerify}>
            <div className="mb-4">
              <label className="block text-gray-700 text-[16px]  ml-2 mb-1">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-black" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-3 pl-10 border text-[14px] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter Email"
                />
              </div>
            </div>

            {isEmailVerified && (
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <span className="absolute inset-y-0 left-0 pl-3 mt-7 flex items-center pointer-events-none">
                  <FaKey className="text-black" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter Password"
                />
                {/* <span
                  className="absolute inset-y-0 right-0 pr-3 mt-7 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span> */}
              </div>
            )}

            {/* {isEmailVerified && (
              <div className="mb-4">
                <ReCAPTCHA
                  sitekey="6LdJ6HcqAAAAAC9jfeOKaxVpLLQCoveF5iGkHYH9"
                  onChange={handleRecaptchaChange}
                  action="LOGIN"
                />
              </div>
            )} */}

            <button
              type="submit"
              className="w-full py-3 bg-custome-blue text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              enabled={isEmailVerified}
            >
              {isEmailVerified ? 'Login' : 'Verify Email'}
            </button>

            {error && (
              <div className="mt-4 text-red-500 text-sm">{error}</div>
            )}
            {success && (
              <div className="mt-4 text-green-500 text-sm">{success}</div>
            )}
          </form>

          {showPasswordResetPopup && (
            <PasswordResetPopup
              email={email}
              onOtpSent={handleOtpSent}
              onClose={() => setShowPasswordResetPopup(false)}
            />
          )}

          {showOtpVerificationPopup && (
            <OtpVerificationPopup
              email={email}
              onClose={() => setShowOtpVerificationPopup(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Login;