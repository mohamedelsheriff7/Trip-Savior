import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); 
        // Example of sending the data to an API
        try {
            const response = await axios.post('http://localhost:3002/createAdmin', {
                username: username,
                Password: password
            });
            console.log('Admin created:', response);
            // Clear the input fields after a successful request
            setUsername('');
            setPassword('');
        } catch (error) {
            // Display error message if request fails
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-12'>
                    <div className='card mt-3 p-3'>
                        <h2>Create New Admin</h2>
                        {/* Display error message if it exists */}
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label htmlFor='username'>Username</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='username'
                                    placeholder='Enter username'
                                    value={username} // bind to state
                                    onChange={(e) => setUsername(e.target.value)} // handle input change
                                    required
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password'>Password</label>
                                <input
                                    type='password'
                                    className='form-control'
                                    id='password'
                                    placeholder='Enter password'
                                    value={password} // bind to state
                                    onChange={(e) => setPassword(e.target.value)} // handle input change
                                    required
                                />
                            </div>
                            <button type='submit' className='btn btn-success mt-3'>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
