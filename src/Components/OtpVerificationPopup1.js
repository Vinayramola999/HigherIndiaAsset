
import React, { useState } from 'react';
import axios from 'axios';

const OtpVerificationPopup = ({ email, onClose }) => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyOtp = async () => {
    try {
        const token = localStorage.getItem('token'); // Or wherever you store the token

        const response = await axios.post('http://intranet.higherindia.net:3006/verify-otp', 
            { email, otp },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to the headers
                }
            }
        );
        if (response.data.message === "OTP verified. You can now reset your password.") {
            setOtpVerified(true);
            setError('');
        }
    } catch (err) {
        console.error('Error verifying OTP:', err);
        setError('Failed to verify OTP.');
    }
};

const handleResetPassword = async () => {
  if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
  }
  try {
      const token = localStorage.getItem('token'); // Or wherever you store the token

      await axios.post('http://intranet.higherindia.net:3006/reset-password', 
          { email, password, confirmPassword },
          {
              headers: {
                  'Authorization': `Bearer ${token}`, // Add token to the headers
              }
          }
      );
      alert('Password reset successfully. You can now log in.');
      onClose(); 
      window.location.href = '/'; 
  } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password.');
  }
};

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-lg">
        {otpVerified ? (
          <>
            <h3 className="text-2xl font-bold mb-4">Reset Your Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter new password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded-lg mt-4"
              placeholder="Confirm new password"
            />
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2">
                Cancel
              </button>
              <button onClick={handleResetPassword} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Reset Password
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4">Enter OTP</h3>
            <p className="mb-4">An OTP has been sent to your email.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter OTP"
            />
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mr-2">
                Cancel
              </button>
              <button onClick={handleVerifyOtp} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Verify OTP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default OtpVerificationPopup;