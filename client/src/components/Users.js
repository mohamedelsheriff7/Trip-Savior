import React, { useState } from 'react';
import { createAdmin } from '../../Routes/adminController';
import axios from 'axios';

const AdminPage = () => {
    

    

    return (
        <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='card flex-row justify-content-between p-3'>
              <h1>Categories</h1>
              <button onClick={handleCreate} className='btn btn-primary'>Create</button>
            </div>
          </div>
        </div>
        <div className='row'>
          {categories.map((category, index) => (
            <div key={index} className='col-12'>
              <div className='card p-3 mb-3'>
                <h2>{category.Name}</h2>
                <button onClick={() => handleUpdate(category.id)} className='btn btn-warning'>Update</button>
                <button onClick={() => handleDelete(category.id)} className='btn btn-danger'>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default AdminPage;
