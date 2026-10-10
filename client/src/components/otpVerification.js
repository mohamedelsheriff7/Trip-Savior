import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './otpVerification.css'; // Ensure correct styles

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ''; // Get email from state

  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Ensure only one digit
    setOtp(newOtp);
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    try {
      // Make an actual API call to verify OTP
      const response = await axios.post('http://localhost:3002/api/verify-otp', {
        email,
        otp: enteredOtp,
      });

      if (response.data.success) {
        setSuccess('OTP verified successfully!');
        setError('');

        // Navigate to the Reset Password page
        navigate('/reset-password', { state: { email } });
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
        setSuccess('');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <h6 className="logo-container">OTP Verification</h6>

        <div className="otp-input-container">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="otp-input"
            />
          ))}
        </div>

        <p>Please enter the 4-digit OTP sent to {email}</p>

        <button onClick={handleVerifyOtp} className="form-submit-btn">
          Verify OTP
        </button>

        {error && <p style={{ color: '#e63946', fontWeight: '500' }}>{error}</p>}
        {success && <p style={{ color: '#2a9d8f', fontWeight: '500' }}>{success}</p>}
      </div>
    </div>
  );
};

export default OtpVerification;

