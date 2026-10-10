import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminFinal.css';
import AdminNavigationbar from './AdminNavigationBar';
import { Container, Row, Col, Card, Alert,Form, Button, Dropdown } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomNavbar from "./CustomNavbar";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminFinalProfile = () => {
  const [stats, setStats] = useState({
    total: {
      total: 0,
      tourists: 0,
      tourGuides: 0,
      advertisers: 0,
      sellers: 0,
      tourismGoverners: 0,
    },
    newThisMonth: {
      total: 0,
      tourists: 0,
      tourGuides: 0,
      advertisers: 0,
      sellers: 0,
      tourismGoverners: 0,
    },
  });
  const [products, setProducts] = useState([]);
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProductName, setSelectedProductName] = useState(""); // Store the selected product name
  const [filterDate, setFilterDate] = useState(""); // Filter for product date
  const [filterMonth, setFilterMonth] = useState(""); // Filter for product month
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filterName, setFilterName] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueProductNames, setUniqueProductNames] = useState([]);
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(100000);
  const [filteredSalesReport, setFilteredSalesReport] = useState(null);
  const [uniqueNames, setUniqueNames] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3002/user-counts');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const fetchSalesReport = async () => {
      try {
        const response = await fetch('http://localhost:3002/admin/sales-report');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch sales report.');
        }

        if (data.details && data.details.products && data.details.products.commissionDetails) {
          data.details.products.commissionDetails = data.details.products.commissionDetails.map(product => ({
            ...product,
            date: product.date ? new Date(product.date) : null
          }));
        }

        if (data.details) {
          const allNames = [
            ...new Set([
              ...data.details.itineraries.commissionDetails.map(i => i.name),
              ...data.details.activities.commissionDetails.map(a => a.name),
              ...data.details.products.commissionDetails.map(p => p.name)
            ])
          ];
          setUniqueNames(allNames);
        }

        setSalesReport(data);
        setFilteredSalesReport(data);
        calculateTotalRevenue(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchSalesReport();
  }, []);

  
  const chartData = {
    labels: ['Tourists', 'Tour Guides', 'Advertisers', 'Sellers', 'Tourism Governors'],
    datasets: [
      {
        label: 'Users',
        data: [
          stats.total.tourists,
          stats.total.tourGuides,
          stats.total.advertisers,
          stats.total.sellers,
          stats.total.tourismGoverners,
        ],
        backgroundColor: [
          'rgba(93, 222, 194, 0.6)',
          'rgba(173, 216, 230, 0.6)',
          'rgba(144, 238, 144, 0.6)',
          'rgba(255, 182, 193, 0.6)',
          'rgba(255, 223, 186, 0.6)',
        ],
        borderColor: [
          'rgba(93, 222, 194, 1)',
          'rgba(173, 216, 230, 1)',
          'rgba(144, 238, 144, 1)',
          'rgba(255, 182, 193, 1)',
          'rgba(255, 223, 186, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'User Distribution', font: { size: 14 } },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
  };
// Apply filters based on the entered values
const applyFilters = () => {
  if (!salesReport) return;

  const filteredReport = {
    ...salesReport,
    details: {
      itineraries: { commissionDetails: filterData(salesReport.details.itineraries.commissionDetails) },
      activities: { commissionDetails: filterData(salesReport.details.activities.commissionDetails) },
      products: { commissionDetails: filterData(salesReport.details.products.commissionDetails) },
    },
  };

  setFilteredSalesReport(filteredReport);
  calculateTotalRevenue(filteredReport);
  setShowFilters(false);
};

const filterData = (data) => {
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    const matchesName = filterName
      ? (item.name && item.name.toLowerCase().includes(filterName.toLowerCase()))
      : true;
    const matchesDate = filterDate
      ? itemDate.toDateString() === filterDate.toDateString()
      : true;
    const matchesMonth = filterMonth
      ? itemDate.getMonth() + 1 === parseInt(filterMonth)
      : true;
    return matchesName && matchesDate && matchesMonth;
  });
};

// Calculate total revenue based on filtered products
const calculateTotalRevenue = (filteredReport) => {
  const revenue = Object.values(filteredReport.details).reduce((total, category) => {
    return total + category.commissionDetails.reduce((categoryTotal, item) => categoryTotal + parseFloat(item.appCommission || 0), 0);
  }, 0);
  setTotalRevenue(revenue);
};

const handleFilterChange = (e) => {
  const { name, value } = e.target;
  if (name === "month") setFilterMonth(value);
};

const handleFilterView = () => {
  setShowFilters(!showFilters);
};



const handleProductNameSelect = (name) => {
  setSelectedProductName(name);
  applyFilters(); // Reapply filters after selection
};
const renderTable = (data, headers) => (
  <table style={{
    marginTop: "20px",
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  }}>
    <thead style={{ backgroundColor: "#5ddec2", color: "white" }}>
      <tr>
        {headers.map((header, idx) => (
          <th key={idx} style={{
            border: "1px solid #ddd",
            padding: "12px",
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "bold"
          }}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index} style={{
          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
          transition: "background-color 0.3s"
        }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e3f2fd"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#ffffff"}>
          {Object.values(row).map((value, idx) => (
            <td key={idx} style={{
              border: "1px solid #ddd",
              padding: "12px",
              fontSize: "14px",
              color: "#333",
              textAlign: "center"
            }}>{value}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

  return (
    <>
      <CustomNavbar />
      <div className="container-fluid">
        <div className="container d-flex flex-row w-100 justify-content-end align-items-center mt-3">
          <svg
            className="filterProductBar"
            onClick={handleFilterView}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            style={{
              fill: "#4ed4b7",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            viewBox="0 0 16 16"
          >
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
          </svg>
        </div>

        <div className="d-flex align-items-center">
          {showFilters && (
            <div className="ms-3 justify-content-start">
              <form
                onSubmit={(e) => { e.preventDefault(); applyFilters(); }}
                className="container"
                style={{
                  position: "absolute",
                  minWidth: "700px",
                  maxWidth: "100%",
                  right: "-18%",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                  <div>
                <div className="position-relative">
                  <div
                    className="z-3 card p-3 position-relative w-25"
                    style={{
                      marginLeft: "800px",
                    }}
                  >
                    <label>Name:</label>
                    <Dropdown>
                      <Dropdown.Toggle variant="light"
                          id="dropdown-basic"
                          style={{
                            border: "1px solid #ced4da",
                            borderRadius: "0.25rem",
                            backgroundColor: "#fff",
                            color: "#495057",
                            width: "100%",
                            textAlign: "left",
                            padding: "0.375rem 0.75rem",
                            fontSize: "1rem",
                            lineHeight: "1.5",
                            cursor: "pointer",
                          }}>
                        {filterName || "Select Name"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setFilterName("")}>All</Dropdown.Item>
                        {uniqueNames.map((name, index) => (
                          <Dropdown.Item key={index} onClick={() => setFilterName(name)}>
                            {name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>

                    <label>Date:</label>
                    <DatePicker
                      selected={filterDate}
                      onChange={(date) => setFilterDate(date)}
                      dateFormat="yyyy-MM-dd"
                      isClearable
                      placeholderText="Select a date"
                      className="form-control"
                    />

                    <label>Month:</label>
                    <Form.Control
                      type="number"
                      name="month"
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      placeholder="Filter by month (1-12)"
                      min="1"
                      max="12"
                    />

                    <Button
                      type="submit"
                      style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#5ddec2",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        marginTop: "20px",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
    <div>
      <AdminNavigationbar />

      <Container className="mt-4">
        <h1 className="text-center mb-3">Admin Dashboard</h1>

        {/* Three Cards Section */}
        <Row className="gy-3">
          <Col md={4}>
            <Card className="text-center" style={{ backgroundColor: '#f7fbfc', color: '#007b83', height: '300px' }}>
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <Card.Text className="display-6">{stats.total.total}</Card.Text>
                <ul className="list-unstyled mt-2">
                  <Row>
                    <Col xs={6}>
                      <li style={{ marginBottom: '10px' }}>• Tourists: {stats.total.tourists}</li>
                      <li style={{ marginBottom: '10px' }}>• Tour Guides: {stats.total.tourGuides}</li>
                    </Col>
                    <Col xs={6}>
                      <li style={{ marginBottom: '10px' }}>• Advertisers: {stats.total.advertisers}</li>
                      <li style={{ marginBottom: '10px' }}>• Sellers: {stats.total.sellers}</li>
                      <li style={{ marginBottom: '10px' }}>• Governors: {stats.total.tourismGoverners}</li>
                    </Col>
                  </Row>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center" style={{ backgroundColor: '#fff5e6', color: '#ff8c00', height: '300px' }}>
              <Card.Body>
                <Card.Title>New Users This Month</Card.Title>
                <Card.Text className="display-6">{stats.newThisMonth.total}</Card.Text>
                <ul className="list-unstyled mt-2">
                  <Row>
                    <Col xs={6}>
                      <li style={{ marginBottom: '10px' }}>• Tourists: {stats.newThisMonth.tourists}</li>
                      <li style={{ marginBottom: '10px' }}>• Tour Guides: {stats.newThisMonth.tourGuides}</li>
                    </Col>
                    <Col xs={6}>
                      <li style={{ marginBottom: '10px' }}>• Advertisers: {stats.newThisMonth.advertisers}</li>
                      <li style={{ marginBottom: '10px' }}>• Sellers: {stats.newThisMonth.sellers}</li>
                      <li style={{ marginBottom: '10px' }}>• Governors: {stats.newThisMonth.tourismGoverners}</li>
                    </Col>
                  </Row>
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center" style={{ backgroundColor: '#f4f7fc', height: '300px' }}>
              <Card.Body>
                <Bar data={chartData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

      {/* Sales Report Section */}
<div
  style={{
    marginTop: "30px", // Reduced margin for a tighter layout
    padding: "10px", // Reduced padding to decrease height
    backgroundColor: "#f7fbfc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  }}
>
  <h2
    className="text-center"
    style={{
      color: "#007b83",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px", // Reduced margin for less space below
    }}
  >
    Sales Report
  </h2>
  <div
    style={{
      textAlign: "center",
      backgroundColor: "#e3f8f4",
      padding: "10px", // Reduced padding for a tighter design
      borderRadius: "8px",
      fontSize: "18px", // Slightly smaller font
      fontWeight: "bold",
      color: "#005f55",
      marginBottom: "20px", // Reduced margin for less spacing below
    }}
  >
    Total Revenue: ${salesReport?.totalCommission || 0}
  </div>
</div>
<h5 className="mt-4">Itineraries</h5>
        {filteredSalesReport?.details?.itineraries?.commissionDetails?.length > 0 ? (
          renderTable(
            filteredSalesReport.details.itineraries.commissionDetails.map(({ name, price, appCommission, date }, idx) => ({
              '#': idx + 1,
              'Itinerary Name': name,
              'Price': `$${price}`,
              'App Commission': `$${appCommission}`,
              'Date': date ? new Date(date).toLocaleDateString() : "Date not available",
            })),
            ['#', 'Itinerary Name', 'Price', 'App Commission', 'Date']
          )
        ) : (
          <Alert variant="info">No itineraries found.</Alert>
        )}


<h5 className="mt-4">Activities</h5>
        {filteredSalesReport?.details?.activities?.commissionDetails?.length > 0 ? (
          renderTable(
            filteredSalesReport.details.activities.commissionDetails.map(({ name, price, appCommission, date }, idx) => ({
              '#': idx + 1,
              'Activity Name': name,
              'Price': `$${price}`,
              'App Commission': `$${appCommission}`,
              'Date': date ? new Date(date).toLocaleDateString() : "Date not available",
            })),
            ['#', 'Activity Name', 'Price', 'App Commission', 'Date']
          )
        ) : (
          <Alert variant="info">No activities found.</Alert>
        )}

<h5 className="mt-4">Sales from the Gift Shop</h5>
        {filteredSalesReport?.details?.products?.commissionDetails?.length > 0 ? (
          renderTable(
            filteredSalesReport.details.products.commissionDetails.map(({ name, price, quantity, appCommission, date }, idx) => ({
              '#': idx + 1,
              'Product Name': name,
              'Price': `$${price}`,
              'Quantity': quantity,
              'Total Revenue': `$${appCommission}`,
              'Date': date ? new Date(date).toLocaleDateString() : "Date not available",
            })),
            ['#', 'Product Name', 'Price', 'Quantity', 'Total Revenue', 'Date']
          )
        ) : (
          <Alert variant="info">No purchased products found.</Alert>
        )}
      </Container>
    </div>
    </div>
      </>
  );
};

export default AdminFinalProfile;
