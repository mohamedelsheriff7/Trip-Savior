import React, { useEffect, useState } from "react";
import axios from "axios";
import CurrencySelector from "./CurrencySelector"; // Make sure to import the CurrencySelector component

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState('USD');  // Default to USD
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3002/products");
        if (response.data) {
          // Filter products to exclude archived ones (assuming 'isArchived' property exists)
          const filtered = response.data.filter((product) => product.Quantity >= 0 && !product.isArchived).map(product => ({
            ...product,
            selectedQuantity: 1  // Add initial quantity
          }));
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

  const handleCurrencyChange = async (selectedCurrency) => {
    setCurrency(selectedCurrency);

    const exchangeRateResponse = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
    const exchangeRate = exchangeRateResponse.data.rates[selectedCurrency] || 1;

    const updatedProducts = products.map((product) => ({
      ...product,
      convertedPrice: (product.Price * exchangeRate).toFixed(2)  // Convert price to selected currency
    }));

    setFilteredProducts(updatedProducts);
  };

  const handleSort = () => {
    const sorted = [...filteredProducts].sort((a, b) => b.Ratings - a.Ratings); // Sort by ratings in descending order
    setFilteredProducts(sorted); // Update the state with sorted products
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

  const handlePurchaseClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;

    const userData = localStorage.getItem("user");
    let touristId;
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      touristId = parsedUserData._id;
    } else {
      alert("User not found. Please log in again.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3002/tourist/purchase", { 
        touristId, 
        productId: selectedProduct._id, 
        quantity: selectedProduct.selectedQuantity 
      });
      alert("Purchase successful!");
    } catch (error) {
      console.error("Error making purchase:", error);
      if (!error.response) {
        alert("Failed to connect to server. Please check if the server is running.");
      } else if (error.response.status === 403) {
        alert("CORS policy restriction: Please check if your backend server allows requests from this origin.");
      } else {
        alert(error.response.data.message);
      }
    } finally {
      setShowModal(false);
      setSelectedProduct(null);
    }
  };

  const handleAddToWishlist = async (productId) => {
    const userData = localStorage.getItem("user");
    let touristId;
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      touristId = parsedUserData._id;
    } else {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      await axios.put(`http://localhost:3002/tourists/addProductToWishlist/${touristId}`, { productId });
      alert("Product added to wishlist successfully!");
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
    alert(errorMessage);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    const userData = localStorage.getItem("user");
    let touristId;
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      touristId = parsedUserData._id;
    } else {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      await axios.put(`http://localhost:3002/tourists/addToCart/${touristId}`, { productId, quantity });
      alert("Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
    alert(errorMessage);
    }
  };

  const incrementQuantity = (index) => {
    setFilteredProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].selectedQuantity += 1;
      return updatedProducts;
    });
  };

  const decrementQuantity = (index) => {
    setFilteredProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      if (updatedProducts[index].selectedQuantity > 1) {
        updatedProducts[index].selectedQuantity -= 1;
      }
      return updatedProducts;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const containerStyle = { padding: "20px", textAlign: "center" };
  const productListStyle = { display: "flex", flexWrap: "wrap", justifyContent: "space-around", marginTop: "20px" };
  const productCardStyle = { border: "1px solid #ccc", borderRadius: "5px", padding: "10px", margin: "10px", width: "300px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "center" };
  const productImageStyle = { width: "100%", height: "200px", objectFit: "cover" };
  const productTextStyle = { margin: "10px 0" };
  const filterContainerStyle = { margin: "20px 0" };
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
    zIndex: 1000
  };
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000
  };

  return (
    <div style={containerStyle}>
      <h2>Available Products</h2>

      <CurrencySelector onCurrencyChange={handleCurrencyChange} />
      
      {/* Search and Filter Inputs */}
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
          min="0"
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          min="0"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleSort}>Sort by Rating</button>
      </div>

      <div style={productListStyle}>
        {filteredProducts.length === 0 ? (
          <p>No products available.</p>
        ) : (
          filteredProducts.map((product, index) => (
            <div key={product._id} style={productCardStyle}>
              {product.Picture && (
                <img src={`http://localhost:3002/${product.Picture}`} alt={product.Name} style={productImageStyle} />
              )}
              
              <h3 style={productTextStyle}>{product.Name}</h3>
              <p>{product.Description || "No description available"}</p>
              <p>
                <strong>Price:</strong> 
                {product.convertedPrice ? 
                    `${product.convertedPrice} ${currency}` : 
                    `${product.Price} EGP (Conversion Failed)`}
              </p>
              <p><strong>Ratings:</strong> {product.Ratings ? `${product.Ratings} / 5` : "No ratings"}</p>
              <p><strong>Reviews:</strong> {product.Reviews || "No reviews"}</p>
              <p><strong>Quantity:</strong> {product.Quantity > 0 ? product.Quantity : "Out of stock"}</p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
                <button onClick={() => decrementQuantity(index)}>-</button>
                <span style={{ margin: "0 10px" }}>{product.selectedQuantity}</span>
                <button onClick={() => incrementQuantity(index)}>+</button>
              </div>

              <button onClick={() => handleAddToWishlist(product._id)}>Add to Wishlist</button>
              <button onClick={() => handleAddToCart(product._id, product.selectedQuantity)}>Add to Cart</button>

              <button onClick={() => handlePurchaseClick(product)}>Purchase</button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <>
          <div style={overlayStyle} onClick={() => setShowModal(false)}></div>
          <div style={modalStyle}>
            <h3>Confirm Purchase</h3>
            <p>
              Are you sure you want to purchase {selectedProduct?.Name} (x{selectedProduct?.selectedQuantity})?
            </p>
            <button onClick={handleConfirmPurchase}>Confirm</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewProducts;
