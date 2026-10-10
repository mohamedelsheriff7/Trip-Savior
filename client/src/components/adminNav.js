import React from 'react';
import { Button, Container } from 'react-bootstrap';

const AdminNav = () => {
    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Admin</h1>
            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" href="/admins">
                    Create Admin
                </Button>
                <Button variant="secondary" size="lg" href="/tourism-governers">
                    Create Tourism Governer
                </Button>
                <Button variant="success" size="lg" href="/categories">
                    Manage Categories
                </Button>
                <Button variant="secondary" size="lg" href="/products">
                    Create New Product
                </Button>
                <Button variant="danger" size="lg" href="/edit-products">
                    View/Edit Product 
                </Button>
                <Button variant="danger" size="lg" href="/admin-delete-account">
                    Delete User
                </Button>
                
                <Button variant="danger" size="lg" href="/preferences">
                    Manage Preference 
                </Button>
                <Button variant="danger" size="lg" href="/admin-view-documents">
                    View documents 
                </Button>
                <Button variant="danger" size="lg" href="/admin-changepassword">
                    Change Password 
                </Button>
                <Button variant="danger" size="lg" href="/admin-complaints">
                    View Complaints 
                </Button>
                <Button variant="danger" size="lg" href="/admin-flag">
                    Flag Event/Itinerary
                </Button>
                <Button variant="info" size="lg" href="/sales-report">
                    View Sales Report
                </Button>
                <Button variant="info" size="lg" href="/admin-user-stats">
                     View User Statistics
                </Button>
            </div>
        </Container>
    );
};

export default AdminNav;