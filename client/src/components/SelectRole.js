// src/components/SelectRole.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectRole = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelection = () => {
    if (role) {
      localStorage.setItem('selectedRole', role);  // Save the selected role before redirecting
      
      if (role === 'tourGuide') {
        navigate('/login'); // Redirect to the Login page for Tour Guide role
      } else if (role === 'seller') {
        navigate('/seller-login'); // Redirect to the Seller Login page
      } else if (role === 'tourist') {
        navigate('/tourist-login'); // Redirect to the Tourist Login page
      } else if (role === 'advertiser') {
        navigate('/advertiser-login'); // Redirect to the Advertiser Login page
      } else if (role === 'admin') {
        navigate('/admin-login'); // Redirect to the Advertiser Login page
      }
      else if (role === 'tourism-governor') {
        navigate('/tourism-governor-login'); // Redirect to the Advertiser Login page
      }
      else {
        alert(`Selected role: ${role}`); // Placeholder for handling other roles
      }
    } else {
      alert('Please select a role before proceeding.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Select Your Role</h1>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={styles.select}
      >
        <option value="">Choose a role</option>
        <option value="tourist">Tourist</option>
        <option value="tourGuide">Tour Guide</option>
        <option value="seller">Seller</option>
        <option value="advertiser">Advertiser</option>
        <option value="admin">Admin</option>
        <option value="tourism-governor">Tourism Governor</option>
      </select>
      <button onClick={handleRoleSelection} style={styles.button}>Go</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  header: {
    marginBottom: '20px',
    fontSize: '2.5em',
    color: '#333',
  },
  select: {
    padding: '10px',
    marginBottom: '20px',
    fontSize: '1em',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    maxWidth: '300px',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    transition: 'background-color 0.3s, transform 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)',
  },
};

export default SelectRole;
