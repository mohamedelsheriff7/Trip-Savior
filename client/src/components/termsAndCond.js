import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const TermsAndConditions = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const handleProceed = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve the user details
    const role = localStorage.getItem("selectedRole"); // Get the role

    if (user && role) {
      try {
        const response = await axios.put("http://localhost:3002/accept-terms", {
          username: user.username,
        });

        console.log("test");

        if (response.status === 200) {
          // Update local storage to prevent future redirection
          user.termsAndConditions = true;
          localStorage.setItem("user", JSON.stringify(user));
          // Redirect based on the role
          if (role === "Tourguide") {
            navigate("/tourguide-finalprofile");
          } else if (role === "Seller") {
            navigate("/adminsellerproduct2");
          } else if (role === "Advertiser") {
            navigate("/activities-view");
          }
        }
      } catch (error) {
        console.error("Failed to accept terms:", error);
      }
    } else {
      console.error("User or role information missing.");
    }
  };
  return (
    <div>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap");

          :root {
            --primary-clr: #5ddec2; /* Main pastel color */
            --pastel-1: #8ee1d7; /* Lighter pastel variant */
            --pastel-2: #74c8b7; /* Slightly darker pastel */
            --pastel-3: #64bfa4; /* Another variant */
            --white: #fff;
            --primary-text-clr: #212121;
            --secondary-text-clr: #8c8c8c;
            --bg-hvr: #4dbd9f; /* Hover effect */
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Open Sans", sans-serif;
          }

          body {
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: flex-start; /* Adjust content alignment */
            height: 100vh;
            background: var(--white);
            padding: 20px;
          }

          .terms_service {
            width: 100%; /* Full width of the screen */
            max-width: 100%; /* Ensure it doesn’t go beyond the screen */
            background: var(--white); /* White background */
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .terms_service .tc_item {
            padding: 20px;
          }

          .terms_service .tc_head {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 20px; /* Spacing below header */
            border-bottom: 2px solid var(--primary-clr); /* Bottom line */
            padding-bottom: 10px;
          }

          .terms_service .tc_head h2 {
            font-size: 24px; /* Adjust the font size for the title */
            color: var(--primary-text-clr);
            margin-bottom: 5px;
          }

          .terms_service .tc_head p {
            font-size: 12px; /* Smaller font for the date */
            color: var(--secondary-text-clr);
          }

          .terms_service .tc_body {
            padding-right: 20px;
            margin-top: 20px;
            flex-grow: 1;
            overflow-y: auto; /* Allow scrolling if content overflows */
          }

          .terms_service .tc_body ol li {
            margin-bottom: 20px;
          }

          /* New style for titles (h3) */
          .terms_service .tc_body ol li h3 {
            font-size: 16px; /* Smaller font size */
            margin-bottom: 10px;
            text-align: left; /* Align titles to the left */
            position: relative; /* Required for positioning the colored line */
            padding-left: 30px; /* Space for the colored line */
          }

          /* Colored lines with pastel variations */
          .terms_service .tc_body ol li h3::before {
            content: ''; 
            position: absolute;
            left: 0;
            top: 50%;
            width: 5px;
            height: 20px; /* Adjust the height of the line */
            background-color: var(--pastel-1); /* Default pastel color */
            transform: translateY(-50%); /* Vertically center the line */
          }

          .terms_service .tc_body ol li:nth-child(2) h3::before {
            background-color: var(--pastel-2); /* Second pastel color */
          }

          .terms_service .tc_body ol li:nth-child(3) h3::before {
            background-color: var(--pastel-3); /* Third pastel color */
          }

          .terms_service .tc_foot {
            display: flex;
            justify-content: center; /* Center the button */
            gap: 10px;
            margin-top: 20px;
          }

          .terms_service .tc_foot button {
              padding: 15px 30px; /* Larger button size */
            font-size: 16px; /* Increase font size */
            border-radius: 5px; 
            cursor: pointer;
            transition: all 0.5s ease;
            font-size: 14px;
            width: auto;
          }

          .terms_service .tc_foot button.decline_btn {
            background: var(--white);
            color: var(--primary-clr);
            border: 1px solid var(--primary-clr);
          }

          .terms_service .tc_foot button.accept_btn {
            background: var(--primary-clr);
            color: var(--white);
            border: 1px solid var(--primary-clr);
          }

          .terms_service .tc_foot button.decline_btn:hover {
            background: var(--primary-clr);
            color: var(--white);
          }

          .terms_service .tc_foot button.accept_btn:hover {
            background: var(--primary-clr);
            color: var(--white);
             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
          }
             .terms_service .tc_foot button:active {
            background: var(--primary-clr);
            color: var(--white);
            box-shadow: none;
          }
        `}
      </style>

      <div className="terms_service">
        <div className="tc_item tc_head">
          <h2>TERMS OF SERVICE</h2>
          <p>Last updated on September 12, 2022</p>
        </div>
        <div className="tc_item tc_body">
          <ol>
            <li>
              <h3>Terms of use</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum
                reprehenderit nihil nisi odit necessitatibus voluptate
                voluptatibus magni ducimus sed accusamus illo nobis veniam.
              </p>
            </li>
            <li>
              <h3>Intellectual property rights</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum
                reprehenderit nihil nisi odit necessitatibus voluptate
                voluptatibus magni ducimus sed accusamus illo nobis veniam.
              </p>
            </li>
            <li>
              <h3>Prohibited activities</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum
                reprehenderit nihil nisi odit necessitatibus voluptate
                voluptatibus magni ducimus sed accusamus illo nobis veniam.
              </p>
            </li>
            <li>
              <h3>Termination clause</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum
                reprehenderit nihil nisi odit necessitatibus voluptate
                voluptatibus magni ducimus sed accusamus illo nobis veniam.
              </p>
            </li>
            <li>
              <h3>Governing law</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum
                reprehenderit nihil nisi odit necessitatibus voluptate
                voluptatibus magni ducimus sed accusamus illo nobis veniam.
              </p>
            </li>
          </ol>
        </div>
        <div className="tc_item tc_foot">
          <button className="accept_btn" onClick={handleProceed}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
