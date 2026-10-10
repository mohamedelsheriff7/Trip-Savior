import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

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
                setMessage('Error fetching preferences.');
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
        <div style={styles.container}>
            <h2 style={styles.header}>Manage Categories</h2>
            <button onClick={handleCreate} style={styles.createButton}>Create Category</button>

            {/* Search bar */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search categories by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={handleSearch} style={styles.searchButton}>Search</button>
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
                                            <button onClick={() => handleUpdate(category._id)} style={styles.updateButton}>Update</button>
                                            <button onClick={() => setEditIndex(-1)} style={styles.cancelButton}>Cancel</button>
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
                                                    style={styles.icon}
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
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '20px auto',
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
    createButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto 20px auto',
    },
    searchContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
    },
    searchInput: {
        padding: '10px',
        width: '60%',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    searchButton: {
        padding: '10px 20px',
        backgroundColor: '#2c3e50',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
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
        backgroundColor: '#ecf0f1',
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
        color: '#007bff',
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
    updateButton: {
        padding: '8px 12px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    cancelButton: {
        padding: '8px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loading: {
        textAlign: 'center',
        color: '#7f8c8d',
    },
    noCategories: {
        textAlign: 'center',
        color: '#e74c3c',
    },
    message: {
        marginTop: '20px',
        color: '#28a745',
        textAlign: 'center',
    },
};

export default Categories;