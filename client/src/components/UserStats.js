import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserStats = () => {
    const [stats, setStats] = useState({
        total: {
            total: 0,
            tourists: 0,
            tourGuides: 0,
            advertisers: 0,
            sellers: 0,
            tourismGoverners: 0
        },
        newThisMonth: {
            total: 0,
            tourists: 0,
            tourGuides: 0,
            advertisers: 0,
            sellers: 0,
            tourismGoverners: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3002/user-counts');
                console.log('Received stats:', response.data);
                setStats(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching user statistics:', error);
                setError('Failed to load user statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: ['Tourists', 'Tour Guides', 'Advertisers', 'Sellers', 'Tourism Governors'],
        datasets: [{
            label: '',
            data: [
                stats.total.tourists,
                stats.total.tourGuides,
                stats.total.advertisers,
                stats.total.sellers,
                stats.total.tourismGoverners
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'User Distribution',
                font: { size: 20 }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">User Statistics</h2>
            
            {/* Chart Section */}
            <Card className="mb-4">
                <Card.Body style={{ height: '400px' }}>
                    <Bar data={chartData} options={chartOptions} />
                </Card.Body>
            </Card>

            {/* Total Users Section */}
            <h3 className="mb-4">Total Users</h3>
            <Row>
                <Col md={4} className="mb-3">
                    <Card bg="primary" text="white">
                        <Card.Body>
                            <Card.Title>Total Users</Card.Title>
                            <Card.Text className="display-4">{stats.total.total}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card bg="success" text="white">
                        <Card.Body>
                            <Card.Title>Tourists</Card.Title>
                            <Card.Text className="display-4">{stats.total.tourists}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card bg="info" text="white">
                        <Card.Body>
                            <Card.Title>Tour Guides</Card.Title>
                            <Card.Text className="display-4">{stats.total.tourGuides}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card bg="warning" text="dark">
                        <Card.Body>
                            <Card.Title>Advertisers</Card.Title>
                            <Card.Text className="display-4">{stats.total.advertisers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card bg="danger" text="white">
                        <Card.Body>
                            <Card.Title>Sellers</Card.Title>
                            <Card.Text className="display-4">{stats.total.sellers}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card bg="secondary" text="white">
                        <Card.Body>
                            <Card.Title>Tourism Governors</Card.Title>
                            <Card.Text className="display-4">{stats.total.tourismGoverners}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* New Users Section */}
            <Card className="mt-4">
                <Card.Header>
                    <h3 className="mb-0">New Users This Month</h3>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4} className="mb-3">
                            <Card bg="info" text="white">
                                <Card.Body>
                                    <Card.Title>Total New Users</Card.Title>
                                    <Card.Text className="display-4">{stats.newThisMonth.total}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={8}>
                            <Row>
                                <Col md={6} className="mb-2">
                                    <h5>Tourists: {stats.newThisMonth.tourists}</h5>
                                </Col>
                                <Col md={6} className="mb-2">
                                    <h5>Tour Guides: {stats.newThisMonth.tourGuides}</h5>
                                </Col>
                                <Col md={6} className="mb-2">
                                    <h5>Advertisers: {stats.newThisMonth.advertisers}</h5>
                                </Col>
                                <Col md={6} className="mb-2">
                                    <h5>Sellers: {stats.newThisMonth.sellers}</h5>
                                </Col>
                                <Col md={6} className="mb-2">
                                    <h5>Tourism Governors: {stats.newThisMonth.tourismGoverners}</h5>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserStats;