import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Form,
  Button,
  Dropdown,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomNavbar from "./CustomNavbar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AdvertiserNavbar from "./advertiser/AdvertiserNavbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TouristReportA = () => {
  const [touristReport, setTouristReport] = useState(null);
  const [error, setError] = useState("");
  const [monthlyReport, setMonthlyReport] = useState({});
  const [filterMonth, setFilterMonth] = useState("");
  const [filteredTourists, setFilteredTourists] = useState(0);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [totalTourists, setTotalTourists] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username || "";

    if (!username) {
      setError("Username is not provided.");
      setLoading(false);
      return;
    }

    const fetchTouristReport = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/advertiser-tourist-report/${username}`
        );
        setTouristReport(response.data);
        generateMonthlyReport(response.data);
        calculateTotalTourists(response.data);
      } catch (error) {
        setError(
          error.response?.data.message || "Error loading tourist report"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTouristReport();
  }, []);

  const generateMonthlyReport = (data) => {
    const monthlyData = {};
    const allMonths = new Set();

    (data.activities || []).forEach((activity) => {
      const activityMonth = new Date(activity.date).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "short" }
      );
      allMonths.add(activityMonth);
      monthlyData[activityMonth] =
        (monthlyData[activityMonth] || 0) + activity.totalTourists;
    });

    const months = Array.from(allMonths).sort();
    setMonthlyReport(monthlyData);
    setAvailableMonths(months);
  };

  const calculateTotalTourists = (data) => {
    const total = data.activities.reduce(
      (sum, activity) => sum + activity.totalTourists,
      0
    );
    setTotalTourists(total);
  };

  const applyFilters = () => {
    if (monthlyReport[filterMonth]) {
      setFilteredTourists(monthlyReport[filterMonth]);
    } else {
      setFilteredTourists(0);
    }
    setShowFilters(false);
  };

  const handleFilterView = () => {
    setShowFilters(!showFilters);
  };

  const chartData = {
    labels: Object.keys(monthlyReport),
    datasets: [
      {
        label: "Tourists per Month",
        data: Object.values(monthlyReport),
        backgroundColor: "rgba(93, 222, 194, 0.6)",
        borderColor: "rgba(93, 222, 194, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Tourist Distribution by Month",
        font: { size: 14 },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
  };

  const renderTable = (data, headers) => (
    <table
      style={{
        marginTop: "20px",
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <thead style={{ backgroundColor: "#5ddec2", color: "white" }}>
        <tr>
          {headers.map((header, idx) => (
            <th
              key={idx}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e3f2fd")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                index % 2 === 0 ? "#f9f9f9" : "#ffffff")
            }
          >
            {Object.values(row).map((value, idx) => (
              <td
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  fontSize: "14px",
                  color: "#333",
                  textAlign: "center",
                }}
              >
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <AdvertiserNavbar />
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
                onSubmit={(e) => {
                  e.preventDefault();
                  applyFilters();
                }}
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
                      <label>Month:</label>
                      <Form.Control
                        as="select"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                      >
                        <option value="">Select a Month</option>
                        {availableMonths.map((month, index) => (
                          <option key={index} value={month}>
                            {month}
                          </option>
                        ))}
                      </Form.Control>

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

        <Container className="mt-4">
          <h1 className="text-center mb-3">
            Tourist Report for {touristReport?.username}
          </h1>

          <Row className="gy-3">
            <Col md={4}>
              <Card
                className="text-center"
                style={{
                  backgroundColor: "#f7fbfc",
                  color: "#007b83",
                  height: "300px",
                }}
              >
                <Card.Body>
                  <Card.Title>Total Tourists</Card.Title>
                  <Card.Text className="display-6">{totalTourists}</Card.Text>
                  <p>Across All Activities</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="text-center"
                style={{
                  backgroundColor: "#fff5e6",
                  color: "#ff8c00",
                  height: "300px",
                }}
              >
                <Card.Body>
                  <Card.Title>Filtered Tourists</Card.Title>
                  <Card.Text className="display-6">
                    {filteredTourists}
                  </Card.Text>
                  <p>
                    {filterMonth
                      ? `in ${filterMonth}`
                      : "Select a month to filter"}
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="text-center"
                style={{ backgroundColor: "#f4f7fc", height: "300px" }}
              >
                <Card.Body>
                  <Bar data={chartData} options={chartOptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div
            style={{
              marginTop: "30px",
              padding: "10px",
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
                marginBottom: "10px",
              }}
            >
              Activities Report
            </h2>
          </div>

          <h5 className="mt-4">Activities:</h5>
          {touristReport?.activities.length > 0 ? (
            renderTable(
              touristReport.activities.map(
                ({ name, date, totalTourists }, idx) => ({
                  "#": idx + 1,
                  "Activity Name": name,
                  Date: new Date(date).toLocaleDateString("en-US"),
                  "Total Tourists": totalTourists,
                })
              ),
              ["#", "Activity Name", "Date", "Total Tourists"]
            )
          ) : (
            <Alert variant="info">
              No tourist data available for your activities.
            </Alert>
          )}
        </Container>
      </div>
    </>
  );
};

export default TouristReportA;
