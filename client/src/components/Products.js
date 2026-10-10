import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from "../images/logos.jpg";
import backButtonImage from "../images/backbutton.png";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Name: '',
    Description: '',
    sellerUsername: '',
    Ratings: '',
    Reviews: '',
    Price: '',
    Quantity: '',
  });

  const [successMessage, setSuccessMessage] = useState(''); // State to manage success message

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCreateProduct = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3002/createProduct',
        newProduct
      );
      console.log('Product created successfully:', response.data);
      setProducts([...products, response.data]);
      setNewProduct({
        Name: '',
        Description: '',
        sellerUsername: '',
        Ratings: '',
        Reviews: '',
        Price: '',
        Quantity: '',
      });
      setSuccessMessage('Product created successfully!'); // Set success message

      // Clear the message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    }
  };

  const inputStyle = {
    borderColor: '#5ddec2',
    borderWidth: '2px',
    borderRadius: '8px',
    padding: '10px',
    width: '100%', // Ensures all fields have full width within their container
    marginBottom: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#5ddec2',
    borderColor: '#5ddec2',
    padding: '12px 30px',
    fontSize: '16px',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '50%', // Ensures the button takes the full width
    textAlign: 'center',
  };

  const messageStyle = {
    color: '#4caf50', // Green color
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '20px',
  };

  return (
    <div className="container">
      <button
              onClick={() => navigate("/adminsellerproduct2")}
              className=""
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "absolute",
                top: "10%",
                left: "0",
                padding: 0,
              }}
            >
              <img
                src={backButtonImage}
                alt="Back to previous page"
                style={{
                  width: "85px",
                  height: "85px",
                }}
              />
            </button>
      <div className="row">
        <div className="col-lg-8 offset-lg-2 col-md-10 offset-md-1">
          <div className="card shadow-sm mt-5 p-4">
            <h2 className="text-center mb-4">Create New Product</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateProduct();
              }}
            >
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label htmlFor="Name">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Name"
                    name="Name"
                    placeholder="Enter product name"
                    value={newProduct.Name}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="Price">Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="Price"
                    name="Price"
                    placeholder="Enter product price"
                    value={newProduct.Price}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="Quantity">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    id="Quantity"
                    name="Quantity"
                    placeholder="Enter product quantity"
                    value={newProduct.Quantity}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="sellerUsername">Seller Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="sellerUsername"
                    name="sellerUsername"
                    placeholder="Enter seller Username"
                    value={newProduct.sellerUsername}
                    onChange={handleInputChange}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="Description">Description</label>
                <textarea
                  className="form-control"
                  id="Description"
                  name="Description"
                  placeholder="Enter product description"
                  rows="4"
                  value={newProduct.Description}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Display Success Message */}
              {successMessage && <div style={messageStyle}>{successMessage}</div>}

              <div className="form-group text-center">
                <button type="submit" style={buttonStyle}>
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
