import React, { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  Button,
  Dropdown,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import AdvertiserNavbar from "./advertiser/AdvertiserNavbar";

const ActivitySalesReport = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUsername, setLoggedInUsername] = useState("");

  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueActivityNames, setUniqueActivityNames] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username || "";

    if (!username) {
      setError("Username is not provided. Please log in again.");
    } else {
      setLoggedInUsername(username);
      fetchSalesReport(username);
    }
  }, []);

  const fetchSalesReport = async (username) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:3002/advertiser-sales-report/${username}`
      );
      const data = response.data;
      console.log(data);

      const validActivities = data.activities.map((activity) => {
        if (
          activity.date &&
          new Date(activity.date).toString() === "Invalid Date"
        ) {
          activity.date = null;
        }
        return activity;
      });

      setSalesReport(data);
      setFilteredActivities(validActivities);
      calculateTotalRevenue(validActivities);

      const uniqueNames = [
        ...new Set(validActivities.map((activity) => activity.name)),
      ];
      setUniqueActivityNames(uniqueNames);
    } catch (err) {
      setError(err.response?.data.message || "Failed to fetch sales report.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!salesReport) return;

    let filtered = [...salesReport.activities];

    if (filterName) {
      filtered = filtered.filter(
        (activity) => activity.name.toLowerCase() === filterName.toLowerCase()
      );
    }

    if (filterDate) {
      const selectedDate = filterDate.toISOString().split("T")[0];
      filtered = filtered.filter((activity) => {
        if (!activity.date) return false;
        const activityDate = new Date(activity.date)
          .toISOString()
          .split("T")[0];
        return activityDate === selectedDate;
      });
    }

    if (filterMonth) {
      filtered = filtered.filter((activity) => {
        const activityMonth = new Date(activity.date).getMonth() + 1;
        return activityMonth === parseInt(filterMonth);
      });
    }

    setFilteredActivities(filtered);
    calculateTotalRevenue(filtered);
    setShowFilters(false);
  };

  const calculateTotalRevenue = (activities) => {
    const revenue = activities.reduce(
      (total, activity) => total + (parseFloat(activity.totalRevenue) || 0),
      0
    );
    setTotalRevenue(revenue);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "month") setFilterMonth(value);
  };

  const handleFilterView = () => {
    setShowFilters(!showFilters);
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
    return (
      <Spinner
        animation="border"
        role="status"
        className="d-block mx-auto mt-5"
      />
    );
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
            className="filterActivityBar"
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
                      <label>Activity Name:</label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="light"
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
                            boxShadow: "none",
                          }}
                        >
                          {filterName || "Select Activity"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setFilterName("")}>
                            All Activities
                          </Dropdown.Item>
                          {uniqueActivityNames.map((name, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() => setFilterName(name)}
                            >
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
                        onChange={handleFilterChange}
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

        <Container className="mt-5">
          <h1 className="text-center mb-4">Activity Sales Report</h1>

          <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>

          {filteredActivities.length > 0 ? (
            renderTable(
              filteredActivities.map((activity, index) => ({
                "#": index + 1,
                "Activity Name": activity.name,
                Price: `$${activity.price}`,
                Bookings: activity.bookings,
                Date: activity.date
                  ? new Date(activity.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "Date not available",
                "Total Revenue": `$${
                  activity.totalRevenue
                    ? parseFloat(activity.totalRevenue).toFixed(2)
                    : "0.00"
                }`,
              })),
              [
                "#",
                "Activity Name",
                "Price",
                "Bookings",
                "Date",
                "Total Revenue",
              ]
            )
          ) : (
            <Alert variant="info">No activities found.</Alert>
          )}
        </Container>
      </div>
    </>
  );
};

export default ActivitySalesReport;
