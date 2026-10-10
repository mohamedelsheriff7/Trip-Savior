import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './csstest.css'; // Ensure correct styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an actual API call to send OTP
      const response = await axios.post('http://localhost:3002/api/send-otp', { email });

      if (response.data.success) {
        setSuccess('OTP has been sent to your email.');
        setError('');

        // Redirect to OTP Verification page, passing the email as state
        navigate('/otp-verification', { state: { email } });
      } else {
        setError(response.data.message || 'Failed to send OTP.');
        setSuccess('');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div style={styles.container}>
      <h1 className="title text-start mb-4" style={styles.header}>
        Forgot Password
      </h1>
      <div style={styles.formContainer}>
        <form className="form" onSubmit={handleEmailSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
              <span className="span">Email</span>
            </label>
          </div>
          <button type="submit" style={styles.submitButton}>
            Send Email
          </button>
        </form>
        {error && <p style={{ color: '#e63946', fontWeight: '500' }}>{error}</p>}
        {success && <p style={{ color: '#2a9d8f', fontWeight: '500' }}>{success}</p>}
        <p style={styles.signupLink}>
          Don't have an account?{' '}
          <a href="#" style={styles.link}>
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '35vw',
    padding: '20px',
    backgroundColor: '#f9f9f988',
    border: '1px solid #fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  formContainer: {
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#444',

  },
  select: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px dashed #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px dashed #ccc',
    width: '100%',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#5ddec2',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};
export default ForgotPassword;
