import React, {useState} from 'react';
import "./csstest.css";

function Loginalt() {
    const [role, setRole] = useState('');
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
    setShowFields(false);
  };
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
    <div>
<form className="form">
    <p className="title">Register </p>
    <p className="message">Signup now and get full access to our app. </p>
        <div className="flex">
        <label>
            <input className="input" type="text" placeholder="" required=""/>
            <span>Firstname</span>
        </label>

        <label>
            <input className="input" type="text" placeholder="" required=""/>
            <span>Lastname</span>
        </label>
    </div>  
            
    <label>
        <input className="input" type="email" placeholder="" required=""/>
        <span>Email</span>
    </label> 
        
    <label>
        <input className="input" type="password" placeholder="" required=""/>
        <span>Password</span>
    </label>
    <label>
        <input className="input" type="password" placeholder="" required=""/>
        <span>Confirm password</span>
    </label>
    <button className="submit">Submit</button>
    <p className="signin">Already have an acount ? <a href="#">Signin</a> </p>
</form>    </div>
  );
}   
export default Loginalt;