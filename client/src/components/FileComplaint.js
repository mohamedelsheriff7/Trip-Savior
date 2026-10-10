import React, { useState } from 'react';
import axios from 'axios';
import sendButton from '../styles/sendButton.css';
import { BsExclamationCircle, BsCalendarDate, BsSend } from 'react-icons/bs';

const FileComplaintModal = () => {
  const [Title, setTitle] = useState('');
  const [Body, setBody] = useState('');
  const [Date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  // Retrieve the username from localStorage
  const tourist = JSON.parse(localStorage.getItem('user')) || {};
  const Username = tourist.username || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:3002/complaints', {
        Title,
        Body,
        Date,
        TouristUsername: Username,
      });
      alert(response.data.message);
      setTitle('');
      setBody('');
      setDate('');
      setModalShow(false); // Close modal on successful submission
    } catch (error) {
      console.error('Error filing complaint:', error);
      alert('Error filing complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
    <div className='d-flex justify-content-center mb-4' style={{ height: '40%' }}>
  {/* Trigger Button */}
  <button 
    onClick={() => setModalShow(true)} 
    style={{ border: '1px solid red', color: 'red', paddingTop: '0.5rem', paddingBottom: '0.5rem' }} 
    className="btn bg-white rounded-pill px-3 mt-md-3 mt-2 d-flex flex-row align-items-center"
  >
    File Complaint
  </button>
</div>


      {/* Modal */}
      {modalShow && (
  <div
  className="modal fade show d-flex align-items-center justify-content-center"
  tabIndex="-1"
  style={{
    display: "block",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1050, // Ensure it's above other elements
  }}
>
  <div
    className="modal-dialog modal-dialog-centered"
    style={{
      maxWidth: "40%", // Set custom width
      width: "80%",
    }}
  >
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">File a Complaint</h5>
        <button
          type="button"
          className="btn-close"
          onClick={() => setModalShow(false)}
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <input
          type="text"
          style={{border:"1px solid #5ddec2"}}
          className="form-control"
          id="title"
          placeholder="Enter title"
          value={Title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="modal-body">
        <textarea
          style={{border:"1px solid #5ddec2"}}
          placeholder="Body"
          className="form-control mb-3"
          rows="6"
          value={Body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
        <div className="form-floating mb-3">
          <input
            style={{border:"1px solid #5ddec2"}}
            type="date"
            className="form-control"
            id="date"
            value={Date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <label htmlFor="date">Date</label>
        </div>
        <div onClick={handleSubmit} className="d-flex justify-content-end">
          <button className="send-button d-flex align-items-center justify-content-center">
            <div className="svg-wrapper-1">
              <div className="svg-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    fill="currentColor"
                    d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                  ></path>
                </svg>
              </div>
            </div>
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

)}

      </div>
  );
};

// <div className="modal show d-block" tabIndex="-1" role="dialog">
//   <div className="modal-dialog modal-dialog-centered" role="document">
//     <div className="modal-content">
//       <div className="modal-header">
//         <h5 className="modal-title">
//           <BsExclamationCircle className="text-primary me-2" />
//           File a Complaint
//         </h5>
//         <button
//           type="button"
//           className="btn-close"
//           onClick={() => setModalShow(false)}
//           aria-label="Close"
//         ></button>
//       </div>
//       <div className="modal-body">
//         <form onSubmit={handleSubmit} className="needs-validation" noValidate>
//           <div className="form-floating mb-3">
//             <input
//               type="text"
//               className="form-control"
//               id="title"
//               placeholder="Enter title"
//               value={Title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//             <label htmlFor="title">Title</label>
//           </div>

//           <div className="form-floating mb-3">
//             <textarea
//               className="form-control"
//               id="problem"
//               placeholder="Describe your problem"
//               style={{ height: '150px' }}
//               value={Body}
//               onChange={(e) => setBody(e.target.value)}
//               required
//             ></textarea>
//             <label htmlFor="problem">Problem Description</label>
//           </div>

//           <div className="form-floating mb-3">
//             <input
//               type="date"
//               className="form-control"
//               id="date"
//               value={Date}
//               onChange={(e) => setDate(e.target.value)}
//               required
//             />
//             <label htmlFor="date">Date</label>
//           </div>

//           <div className="d-grid">
//             <button
//               type="submit"
//               className="btn btn-primary"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                     aria-hidden="true"
//                   ></span>
//                   Submitting...
//                 </>
//               ) : (
//                 <>
//                   <BsSend className="me-2" />
//                   Submit Complaint
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
//   <div
//     onClick={() => setModalShow(false)}
//   ></div>
// </div>
export default FileComplaintModal;
