import React, { useState } from "react";
import axios from "axios";

const ShareLink = ({ type, id }) => {
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState(""); // State for email recipient
    const [shareLink, setShareLink] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false); // State to show email input
    
    // Generate the shareable link and copy it to the clipboard
    const handleCopyIconClick = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/api/share/${type}/${id}`);
            const generatedLink = response.data.link;

            // Copy the generated link to the clipboard
            navigator.clipboard.writeText(generatedLink);
            setShareLink(generatedLink);
            setMessage("Link copied to clipboard!");
        } catch (error) {
            console.error("Error generating or copying link:", error);
            setMessage("Failed to generate or copy link.");
        }
    };

    // Function to send the email with the link
    const sendEmail = async () => {
        if (!email) {
            setMessage("Please enter an email address.");
            return;
        }

        try {
            await axios.post("http://localhost:3002/api/share/email", {
                email,
                link: shareLink,
            });
            setMessage("Email sent successfully!");
        } catch (error) {
            console.error("Error sending email:", error);
            setMessage("Failed to send email.");
        }
    };
     // Handle email icon click: Generate and copy the link, then show the email input
     const handleEmailIconClick = async () => {
        await handleCopyIconClick();  // Generate and copy the link first
        setShowEmailInput(true);      // Then show the email input field
        setMessage(""); // Hide the message when email icon is clicked
    };

    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-copy"
                viewBox="0 0 16 16"
                style={{ color: "#5ddec2", cursor: "pointer" }}
                onClick={handleCopyIconClick} // Trigger the logic on icon click
            >
                <path
                    fillRule="evenodd"
                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 1 1 2-2h1v1z"
                />
            </svg>{" "}
            {/* Email Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-envelope-at"
                viewBox="0 0 16 16"
                style={{ color: "#5ddec2", cursor: "pointer" }}
                onClick={handleEmailIconClick} // Show email input on click
            >
                <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
            </svg>

            {/* Email Input and Send Button */}
            {showEmailInput && shareLink && (
                <div>
                    <input
                        type="email"
                        placeholder="Enter recipient email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '200px',        
                            padding: '5px',        
                            fontSize: '14px',      
                            borderRadius: '4px',   
                            border: '1px solid #ccc', 
                            marginTop: '-150px' 
                        }}
                    />
                    {" "}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-send mt-2"
                        viewBox="0 0 16 16"
                        style={{ color: "#5ddec2", cursor: "pointer" }}
                        onClick={sendEmail}
                    >
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                    </svg>
                </div>
            )}

            {message && (
                <p style={{ fontSize: "14px", color: "green", marginTop: "5px" }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default ShareLink;
