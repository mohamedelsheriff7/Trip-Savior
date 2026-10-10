import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedDetails, setEditedDetails] = useState('');
  const [editedPrice, setEditedPrice] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3002/products");
        if (response.data) {
          const filtered = response.data.filter((product) => product.Quantity > 0);
          setProducts(filtered);
          setFilteredProducts(filtered);
        } else {
          setError("No products found.");
        }
      } catch (err) {
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleImageUpload = async (productId, file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.put(
        `http://localhost:3002/uploadProductImage/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const updatedProducts = products.map((product) =>
        product._id === productId ? { ...product, Picture: response.data.imagePath } : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleEdit = (productId) => {
    setEditingProductId(productId);
    const product = products.find((product) => product._id === productId);
    setEditedDetails(product?.Details || '');
    setEditedPrice(product?.Price || '');
  };

  const handleSave = async (productId) => {
    const data = { Details: editedDetails, Price: editedPrice };
    try {
      await axios.put(`http://localhost:3002/editProductDetails/${productId}`, data);
      const updatedProducts = products.map((product) =>
        product._id === productId ? { ...product, Details: editedDetails, Price: editedPrice } : product
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProductId(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  const handleSort = () => {
    const sorted = [...filteredProducts].sort((a, b) => b.Ratings - a.Ratings);
    setFilteredProducts(sorted);
  };

  const handleSearch = () => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (minPrice) {
      filtered = filtered.filter((product) => product.Price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((product) => product.Price <= parseFloat(maxPrice));
    }
    setFilteredProducts(filtered);
  };

  const handleArchive = async (productId) => {
    try {
      await axios.put(`http://localhost:3002/archive/${productId}`);
      const updatedProducts = products.filter((product) => product._id !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error archiving product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const containerStyle = {
    padding: "20px",
    textAlign: "center",
  };

  const productListStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: "20px",
  };

  const productCardStyle = {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
    width: "300px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const productImageStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  };

  const filterContainerStyle = {
    margin: "20px 0",
  };

  const topRightButtonStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
  };
  const productTextStyle = {
    margin: "10px 0",
    fontWeight: "bold",
    fontSize: "16px"
  };
  
  return (
    <div style={containerStyle}>
      <h2>Available Products</h2>
      <Button style={topRightButtonStyle} variant="primary" onClick={() => navigate('/archived-products')}>
        Unarchive
      </Button>
      <div style={filterContainerStyle}>
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <br />
        <button onClick={handleSort}>Sort by Rating</button>
      </div>

      <div style={productListStyle}>
  {filteredProducts.length === 0 ? (
    <p>No products available.</p>
  ) : (
    filteredProducts.map((product) => (
      <div key={product._id} style={productCardStyle}>
        {product.Picture && (
          <img src={`http://localhost:3002/${product.Picture}`} alt={product.Name} style={productImageStyle} />
        )}
        
        {editingProductId === product._id ? (
          <div>
            <input
              type="text"
              value={editedDetails}
              onChange={(e) => setEditedDetails(e.target.value)}
              placeholder="Edit Details"
            />
            <input
              type="number"
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              placeholder="Edit Price"
            />
            <button onClick={() => handleSave(product._id)}>Save</button>
          </div>
        ) : (
          <div>
            <button onClick={() => handleEdit(product._id)}>Edit</button>
            <h3 style={productTextStyle}>{product.Name}</h3>
            <p>{product.Description || "No description available"}</p>
            <p><strong>Price:</strong> ${product.Price || "N/A"}</p>
            <p><strong>Details:</strong> {product.Details || "No details"}</p>
            <p><strong>Ratings:</strong> {product.Ratings ? `${product.Ratings} / 5` : "No ratings"}</p>
            <p><strong>Quantity:</strong> {product.Quantity > 0 ? product.Quantity : "Out of stock"}</p>
            <p><strong>Sold:</strong> {product.Sold || "0"}</p>
            <Button variant="danger" onClick={() => handleArchive(product._id)}>Archive</Button>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(product._id, e.target.files[0])}
            />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditProducts;
