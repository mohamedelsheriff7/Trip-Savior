// src/components/Registration.js
import React, { useState } from 'react';
import './LandingPage/csstest.css'
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobileNumber: '',
    nationality: '',
    date_of_birth: '',
    work_status: '',
  });
  const [showFields, setShowFields] = useState(false);
  const [files, setFiles] = useState({
    idProof: null,
    certificates: null,
    idSellerProof: null, // For seller
    taxationRegisteryCard: null,
    idAdvertiserProof: null, // For advertiser
    taxationRegisteryCardAdvertiser: null,
  });


  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setShowFields(true);
  };

  // Set default role to 'tourist' and show fields initially
  useState(() => {
    setRole('tourist');
    setShowFields(true);
  }, []);
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: files[0], // Store the first file selected
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = {
      tourist: '/createTourist',
      tourGuide: '/registerTourGuide',
      seller: '/registerSellerReg',
      advertiser: '/registerAdvertiser',
    }[role];

    if (endpoint) {
      const formDataToSend = new FormData();
      
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Append files only for the tourGuide role
      if (role === 'tourGuide') {
        if (files.idProof) {
          formDataToSend.append('idProof', files.idProof);
        } else {
          alert("ID Proof is required for Tour Guide.");
          return;
        }
        if (files.certificates) {
          formDataToSend.append('certificates', files.certificates);
        } else {
          alert("Certificates are required for Tour Guide.");
          return;
        }
      }
      else if (role === 'seller') {
        if (files.idSellerProof) {
          formDataToSend.append('idSellerProof', files.idSellerProof);
        } else {
          alert("ID Seller Proof is required for Seller.");
          return;
        }
        if (files.taxationRegisteryCard) {
          formDataToSend.append('taxationRegisteryCard', files.taxationRegisteryCard);
        } else {
          alert("Taxation Registry Card is required for Seller.");
          return;
        }
      }
      else if (role === 'advertiser') {
        if (files.idAdvertiserProof) {
          formDataToSend.append('idAdvertiserProof', files.idAdvertiserProof);
        } else {
          alert("ID Advertiser Proof is required .");
          return;
        }
        if (files.taxationRegisteryCardAdvertiser) {
          formDataToSend.append('taxationRegisteryCardAdvertiser', files.taxationRegisteryCardAdvertiser);
        } else {
          alert("Taxation Registry Card is required .");
          return;
        }
      }
  
      
    

      try {
        const response = (role === 'tourGuide'||role === 'seller'||role==='advertiser')
        ? await fetch(`http://localhost:3002${endpoint}`, {
            method: 'POST',
            body: formDataToSend,
          })
        : await fetch(`http://localhost:3002${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
        const data = await response.json();
        alert(data.message || data.error); // Display success or error message
        if (role === "tourist")
          navigate("/tourist-itinerary");
      } catch (error) {
        console.error("Error:", error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleGoClick = () => {
    if (role) {
      setShowFields(true);
    }
  };
  

  return (
    <div style={styles.container}>
      <h1 className='title text-start mb-4' style={styles.header}>Register</h1>
      <div style={styles.formContainer}>
        {/* <label htmlFor="role" style={styles.label}>Register as:</label> */}
        <select id="role" value={role} onBeforeInput={handleRoleChange} onChange={handleRoleChange} style={styles.select}>
          {/* <option value="">Select a role</option> */}
          <option value="tourist">Tourist</option>
          <option value="tourGuide">Tour Guide</option>
          <option value="seller">Seller</option>
          <option value="advertiser">Advertiser</option>
        </select>
        {/* <button className='btn-go rounded-2 py-1 px-3 mt-2' onClick={handleGoClick} >Go</button> */}

        {showFields && (
          <form className='form' onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label>
              <input
                type="text"
                id="username"
                name="username"
                className='input'
                placeholder=''
                value={formData.username}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <span className='span'>Username</span>
              </label>
            </div>

            <div style={styles.inputGroup}>
              <label>
              <input
                type="email"
                id="email"
                name="email"
                className='input'
                placeholder=''
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <span className='span'>Email</span>
              </label>
            </div>

            <div style={styles.inputGroup}>
              <label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className='input'
                placeholder=''
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
                <span className='span'>Password</span>
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                >
                {showPassword ? "👁️" : "🙈"}
              </span>
                </label>
            </div>
            {role === 'tourGuide' && (
              <>
                <div style={styles.inputGroup}>
                  <label htmlFor="idProof" style={styles.label}>Upload ID</label>
                  <input
                    type="file"
                    id="idProof"
                    name="idProof"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    required
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="certificates" style={styles.label}>Upload Certificates</label>
                  <input
                    type="file"
                    id="certificates"
                    name="certificates"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    required
                    style={styles.input}
                  />
                </div>
              </>
            )}
            {role === 'seller' && (
  <>
    <div style={styles.inputGroup}>
      <label htmlFor="idSellerProof" style={styles.label}>Upload ID</label>
      <input
        type="file"
        id="idSellerProof"
        name="idSellerProof"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        required
        style={styles.input}
      />
    </div>
    <div style={styles.inputGroup}>
      <label htmlFor="taxationRegisteryCard" style={styles.label}>Upload Taxation Registry Card:</label>
      <input
        type="file"
        id="taxationRegisteryCard"
        name="taxationRegisteryCard"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        required
        style={styles.input}
      />
    </div>
  </>
)}
            {role === 'advertiser' && (
  <>
    <div style={styles.inputGroup}>
      <label htmlFor="idAdvertiserProof" style={styles.label}>Upload ID</label>
      <input
  type="file"
  id="idAdvertiserProof"
  name="idAdvertiserProof"
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={handleFileChange}
  required
  style={styles.input}
/>
    </div>
    <div style={styles.inputGroup}>
      <label htmlFor="taxationRegisteryCardAdvertiser" style={styles.label}>Upload Taxation Registry Card</label>
      <input
  type="file"
  id="taxationRegisteryCardAdvertiser"
  name="taxationRegisteryCardAdvertiser"
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={handleFileChange}
  required
  style={styles.input}
/>
    </div>
  </>
)}
            

  
            {role === 'tourist' && (
              <>
              <div className='d-flex justify-content-between'>
                <div style={styles.inputGroup}>
                  <label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder=''
                    className='input w-100'
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                  <span className='span'>Mobile Number</span>
                  </label>
                </div>
                <div style={styles.inputGroup}>
                  <label>
                  <input
                    type="text"
                    id="nationality"
                    name="nationality"
                    placeholder=''
                    className='input'
                    value={formData.nationality}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                  <span className='span'>Nationality</span>
                  </label>
                </div>
                </div>
                <div style={styles.inputGroup}>
                  <label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    placeholder=''
                    className='input'
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    style={{...styles.input,color:'#777'}}
                  />
                  <span className='span'>Date of Birth</span>
                  </label>
                </div>
                <div style={styles.inputGroup}>
                  <label>
                  <input
                    type="text"
                    id="work_status"
                    name="work_status"
                    placeholder=''
                    className='input'
                    value={formData.work_status}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                  <span className='span'>Work Status</span>
                  </label>
                </div>
              </>
            )}

            <button type="submit" style={styles.submitButton}>Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '35vw',
    margin: '0 auto',
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
    display: 'flex',
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

export default Registration;
// appjsjs
//app jsjsjsjs

