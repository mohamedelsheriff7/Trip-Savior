import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SellerNavigationBar from "./SellerNavBar";
import backButtonImage from "../images/backbutton.png";
import { useNavigate } from "react-router-dom";


const SellerQuantitySales = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get('http://localhost:3002/products');
        setProducts(productResponse.data); // Store the fetched product data
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
    <SellerNavigationBar />
    <div style={{
      margin: "20px auto",
      padding: "20px",
      maxWidth: "1200px",
      backgroundColor: "#ffffff",
      
    }}>
      <h1 style={{
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#000",
        marginBottom: "20px"
      }}>
       
      </h1>
      <table style={{
         marginTop: "50px",
        width: "112%",
        marginLeft:"-70px",
        borderCollapse: "collapse",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}>
        <thead style={{ backgroundColor: "#5ddec2", color: "white" }}>
          <tr>
            <th style={{
              border: "1px solid #ddd",
              padding: "12px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold"
            }}>
              Product Name
            </th>
            <th style={{
              border: "1px solid #ddd",
              padding: "12px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold"
            }}>
              Quantity
            </th>
            <th style={{
              border: "1px solid #ddd",
              padding: "12px",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold"
            }}>
              Sales
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id} style={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e3f2fd"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff"}>
              <td style={{
                border: "1px solid #ddd",
                padding: "12px",
                fontSize: "14px",
                color: "#333"
              }}>
                {product.Name}
              </td>
              <td style={{
                border: "1px solid #ddd",
                padding: "12px",
                fontSize: "14px",
                color: "#333",
                textAlign: "center"
              }}>
                {product.Quantity}
              </td>
              <td style={{
                border: "1px solid #ddd",
                padding: "12px",
                fontSize: "14px",
                color: "#333",
                textAlign: "center"
              }}>
                {product.Sold}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default SellerQuantitySales;
