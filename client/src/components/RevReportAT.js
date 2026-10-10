import React, { useState, useEffect } from "react";
import { Table, Container, Spinner, Alert } from "react-bootstrap";

const RevReportAT = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Assuming you store the username in localStorage or other storage mechanism
    const getUsername = () => {
        return localStorage.getItem("username"); // Adjust this based on your auth method
    };

    useEffect(() => {
        const fetchSalesReport = async () => {
            try {
                const username = getUsername();

                if (!username) {
                    throw new Error("User not logged in.");
                }

                // Make the API request with the username in the request header
                const response = await fetch("http://localhost:3002/admin/sales-report", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Username": username, // Pass the username in the request header
                    },
                });

                // Check if the response is JSON
                if (response.headers.get("content-type")?.includes("application/json")) {
                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || "Failed to fetch sales report.");
                    }

                    setReport(data);
                } else {
                    throw new Error("Unexpected response format: Not JSON");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesReport();
    }, []);

    if (loading) {
        return <Spinner animation="border" role="status" className="d-block mx-auto mt-5" />;
    }

    if (error) {
        return <Alert variant="danger" className="mt-5">{error}</Alert>;
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Sales Report</h1>
            <h4>Total Revenue: ${report.totalCommission}</h4>
            <h5 className="mt-4">Itineraries</h5>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Itinerary Name</th>
                        <th>Price</th>
                        <th>App Commission</th>
                    </tr>
                </thead>
                <tbody>
                    {report.details.itineraries.commissionDetails.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.appCommission}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h5 className="mt-4">Activities</h5>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Activity Name</th>
                        <th>Price</th>
                        <th>App Commission</th>
                    </tr>
                </thead>
                <tbody>
                    {report.details.activities.commissionDetails.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.appCommission}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default RevReportAT;
