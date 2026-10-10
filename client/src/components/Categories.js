import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSearch, FaCheck, FaTimes } from 'react-icons/fa'; // Combined imports
import AdminNavigationbar from "./AdminNavigationBar"; // Import AdminNavigationBar

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]); // For storing filtered results
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const [updatedCategoryName, setUpdatedCategoryName] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // For handling search input

    // Fetch categories from the server
    const fetchCategory = async () => {
        axios.get('http://localhost:3002/manageCategory')
            .then(response => {
                setCategories(response.data);
                setFilteredCategories(response.data); // Initially, all categories are shown
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the categories!', error);
                setLoading(false);
                setMessage('Error fetching categories.');
            });
    };

    // Handle delete category
    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');
        if (confirmDelete) {
            axios.delete('http://localhost:3002/manageCategory', { data: { _id: id } })
                .then(() => {
                    setCategories(categories.filter(category => category._id !== id));
                    setFilteredCategories(filteredCategories.filter(category => category._id !== id)); // Remove from filtered list too
                    setMessage('Category deleted successfully!');
                })
                .catch(error => {
                    console.error('There was an error deleting the category!', error);
                    setMessage('Error deleting category.');
                });
        }
    };

    // Handle update category
    const handleUpdate = (id) => {
        axios.put('http://localhost:3002/manageCategory', { _id: id, Name: updatedCategoryName })
            .then(() => {
                setCategories(categories.map(category =>
                    category._id === id ? { ...category, Name: updatedCategoryName } : category
                ));
                setFilteredCategories(filteredCategories.map(category =>
                    category._id === id ? { ...category, Name: updatedCategoryName } : category
                )); // Update in filtered list as well
                setMessage('Category updated successfully!');
                setEditIndex(-1);
            })
            .catch(error => {
                console.error('There was an error updating the category!', error);
                setMessage('Error updating category.');
            });
    };

    // Handle editing category
    const handleEditClick = (index, currentName) => {
        setEditIndex(index);
        setUpdatedCategoryName(currentName);
    };

    // Handle creating a new category
    const handleCreate = () => {
        const newCategory = prompt('Enter new category name:');
        if (newCategory) {
            axios.post('http://localhost:3002/manageCategory', { Name: newCategory })
                .then(response => {
                    setCategories([...categories, response.data]);
                    setFilteredCategories([...filteredCategories, response.data]); // Add to both lists
                    setMessage('Category created successfully!');
                })
                .catch(error => {
                    console.error('There was an error creating the category!', error);
                    setMessage('Error creating category.');
                });
        }
    };

    // Handle search functionality
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredCategories(categories); // If no search term, show all categories
        } else {
            const filtered = categories.filter(category =>
                category.Name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    };

    useEffect(() => {
        fetchCategory(); // Fetch categories on component mount
    }, []);

    return (
        <>
            <AdminNavigationbar /> {/* Add AdminNavigationbar at the top */}
            <div style={styles.container}>
                <h2 style={styles.header}>Manage Categories</h2>
                <div className='d-flex justify-content-center mb-4'>
                    <button onClick={handleCreate} className="icon-btn add-complaint-btn">
                        <div className="add-complaint-icon"></div>
                        <div className="btn-txt">Create Category</div>
                    </button>
                </div>

                {/* Search bar */}
                <div className="rounded mb-4" style={{ display: 'flex', justifyContent: 'center' }}>
                    <input
                        type="search"
                        className="form-control rounded"
                        placeholder="Search category by its name"
                        aria-label="Search"
                        aria-describedby="search-addon"
                        value={searchTerm}
                        onClick={handleSearch}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            borderColor: '#5ddec2',
                            borderWidth: '1px',
                            width: '50%', // Adjust the width here to make it smaller
                            margin: '0 auto' // Centers the search bar horizontally
                        }} // Inline style to set border color
                    />
                </div>

                {loading ? (
                    <p style={styles.loading}>Loading categories...</p>
                ) : (
                    <>
                        {filteredCategories.length > 0 ? (
                            <ul style={styles.categoryList}>
                                {filteredCategories.map((category, index) => (
                                    <li key={category._id} style={styles.categoryItem}>
                                        {editIndex === index ? (
                                            <div style={styles.editContainer}>
                                                <input
                                                    type="text"
                                                    value={updatedCategoryName}
                                                    onChange={(e) => setUpdatedCategoryName(e.target.value)}
                                                    style={styles.editInput}
                                                />
                                                <FaCheck
                                                    style={{ ...styles.icon, color: '#28a745' }}
                                                    onClick={() => handleUpdate(category._id)}
                                                />
                                                <FaTimes
                                                    style={{ ...styles.icon, color: '#e74c3c' }}
                                                    onClick={() => setEditIndex(-1)}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <span style={styles.categoryText}>{category.Name}</span>
                                                <div style={styles.actions}>
                                                    <FaEdit
                                                        style={styles.icon}
                                                        onClick={() => handleEditClick(index, category.Name)}
                                                    />
                                                    <FaTrash
                                                        style={{ ...styles.icon, color: 'red' }}
                                                        onClick={() => handleDelete(category._id)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={styles.noCategories}>No categories found</p>
                        )}
                    </>
                )}
                {message && <p style={styles.message}>{message}</p>}
            </div>
        </>
    );
};

const styles = {
    container: {
        width: '75%', // Set the width to 75% of the page
        margin: '90px auto', // Center the container horizontally
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        backgroundColor: '#ffffff',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#2c3e50',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    categoryList: {
        listStyle: 'none',
        padding: '0',
    },
    categoryItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #bdc3c7',
        backgroundColor: 'white',
    },
    categoryText: {
        color: '#2c3e50',
        fontWeight: '500',
    },
    actions: {
        display: 'flex',
        gap: '10px',
    },
    icon: {
        cursor: 'pointer',
        color: '#5ddec2',
        fontSize: '20px',
        transition: 'color 0.3s',
    },
    editContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    editInput: {
        padding: '8px',
        border: '1px solid #2980b9',
        borderRadius: '4px',
    },
    loading: {
        textAlign: 'center',
        color: '#7f8c8d',
    },
    noCategories: {
        textAlign: 'center',
        color: '#7f8c8d',
    },
    message: {
        color: '#27ae60',
        fontWeight: 'bold',
        textAlign: 'center',
    },
};

export default Categories;
