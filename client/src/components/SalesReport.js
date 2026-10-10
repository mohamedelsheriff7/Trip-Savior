import React, { useState, useEffect } from "react";
import { Table, Container, Spinner, Alert, Form, Button } from "react-bootstrap";

const SalesReport = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        productName: "",
        date: "",
        month: "",
    });

    const fetchSalesReport = async () => {
        setLoading(true);
        setError("");
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(
                `http://localhost:3002/admin/sales-report?${queryParams}`
            );

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

    useEffect(() => {
        fetchSalesReport();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchSalesReport();
    };

    if (loading) {
        return <Spinner animation="border" role="status" className="d-block mx-auto mt-5" />;
    }

    if (error) {
        return <Alert variant="danger" className="mt-5">{error}</Alert>;
    }

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Sales Report</h1>

            {/* Filter Form */}
            <Form onSubmit={handleFilterSubmit} className="mb-4">
                <Form.Group controlId="filterProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter product name"
                        name="productName"
                        value={filters.productName}
                        onChange={handleFilterChange}
                    />
                </Form.Group>

                <Form.Group controlId="filterDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                    />
                </Form.Group>

                <Form.Group controlId="filterMonth">
                    <Form.Label>Month</Form.Label>
                    <Form.Control
                        type="month"
                        name="month"
                        value={filters.month}
                        onChange={handleFilterChange}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Apply Filters
                </Button>
            </Form>

            <h4>Total Revenue: ${report.totalCommission}</h4>

            {/* Render Itineraries, Activities, and Products sections here (unchanged from your original component) */}
            {/* Itineraries Section */}
            <h5 className="mt-4">Itineraries</h5>
            {report.details.itineraries?.commissionDetails?.length > 0 ? (
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
            ) : (
                <Alert variant="info">No itineraries found.</Alert>
            )}

            {/* Activities Section */}
            <h5 className="mt-4">Activities</h5>
            {report.details.activities?.commissionDetails?.length > 0 ? (
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
            ) : (
                <Alert variant="info">No activities found.</Alert>
            )}

            {/* Products Section */}
            <h5 className="mt-4">Sales from the gift shop</h5>
            {report.details.products?.commissionDetails?.length > 0 ? (
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.details.products.commissionDetails.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>${item.price}</td>
                                <td>{item.quantity}</td>
                                <td>${item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info">No purchased products found.</Alert>
            )}
        </Container>
    );
};

export default SalesReport;
