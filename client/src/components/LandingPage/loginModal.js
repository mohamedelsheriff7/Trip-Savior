// src/components/Registration.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../LandingPage/csstest.css";

const LoginModal = ({ setShowForgotPassword, closeLogin }) => {
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showFields, setShowFields] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Set default role to 'tourist' and show fields initially
  useState(() => {
    setRole("tourist");
    setShowFields(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await axios.get("http://localhost:3002/search-username", {
        params: { username: formData.username },
      });

      let response;

      if (user.data.role === "Tourguide") {
        response = await axios.get("http://localhost:3002/tour_guide", {
          params: { username: formData.username, password: formData.password },
        });

        localStorage.setItem("selectedRole", user.data.role);

        if (response.data && response.data.length > 0) {
          const tourGuide = response.data[0];

          // Check if the status is "Accepted"
          if (tourGuide.status === "Accepted") {
            // Store the user's details including the username in localStorage
            localStorage.setItem("user", JSON.stringify(tourGuide));
            localStorage.setItem("tourGuideName", tourGuide.username); // Store username for later comparison
            localStorage.setItem("tourGuidePassword", formData.password); // Store the password

            if (tourGuide.termsAndConditions) {
              navigate("/tourguide-finalprofile");
            } else {
              navigate("/terms-and-conditions");
            }
            // Redirect to Profile page
            // navigate("/profile");
          } else if (tourGuide.status === "Pending" || !tourGuide.status) {
            setError("Your account has not been accepted yet.");
          } else {
            setError("Invalid credentials. Please try again.");
          }
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else if (user.data.role === "Seller") {
        response = await axios.get("http://localhost:3002/sellers/login", {
          params: { username: formData.username, password: formData.password },
        });

        localStorage.setItem("selectedRole", user.data.role);

        if (response.data) {
          const seller = response.data;

          // Check if the returned seller matches the provided credentials and has an "Accepted" status
          if (
            seller.username === formData.username &&
            seller.password === formData.password &&
            seller.status === "Accepted"
          ) {
            // Store the user's details including the username and password in localStorage
            localStorage.setItem("user", JSON.stringify(seller));
            localStorage.setItem("sellerName", seller.username); // Store username for later comparison
            localStorage.setItem("sellerGuidePassword", seller.password);

            if (seller.termsAndConditions) {
              navigate("/adminsellerproduct2");
            } else {
              navigate("/terms-and-conditions");
            }
            // Redirect to Seller Profile page with seller's data
            // navigate("/seller-profile", { state: seller });
          } else if (seller.status === "Pending" || !seller.status) {
            setError("Your account has not been accepted yet.");
          } else {
            setError("Invalid credentials. Please try again.");
          }
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else if (user.data.role === "Advertiser") {
        response = await axios.get("http://localhost:3002/advertisers", {
          params: { username: formData.username, password: formData.password },
        });

        localStorage.setItem("selectedRole", user.data.role);

        if (response.data && response.data.length > 0) {
          const advertiser = response.data[0];

          // Check if the advertiser's status is 'Accepted'
          if (advertiser.status === "Accepted") {
            // Store the advertiser's details in localStorage
            localStorage.setItem("user", JSON.stringify(advertiser));
            localStorage.setItem("advertiserName", advertiser.username);
            localStorage.setItem(
              "advertiserGuidePassword",
              advertiser.password
            );

            // console.log(termsAndConditions.data.user.username);
            // console.log(formData.username);

            if (advertiser.termsAndConditions) {
              navigate("/activities-view");
            } else {
              navigate("/terms-and-conditions");
            }

            // navigate("/advertiser-profile");
          } else if (advertiser.status === "Pending" || !advertiser.status) {
            setError("Your account has not been accepted yet.");
          } else {
            setError("Invalid credentials. Please try again.");
          }
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else if (user.data.role === "Tourist") {
        response = await axios.post("http://localhost:3002/tourist/login", {
          username: formData.username,
          password: formData.password,
        });

        localStorage.setItem("selectedRole", user.data.role);

        if (response.data) {
          // Store user information in localStorage
          localStorage.setItem("user", JSON.stringify(response.data.tourist));
          localStorage.setItem(
            "username",
            JSON.stringify(response.data.tourist.username)
          );
          // Redirect to Profile page
          navigate("/tourist-itinerary");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } else if (user.data.role === "Admin") {
        response = await axios.post("http://localhost:3002/adminlogin", {
          username: formData.username,
          Password: formData.password,
        });

        console.log(response.data);

        localStorage.setItem("selectedRole", user.data.role);

        if (response.data) {
          const admin = response.data.admin;
          console.log(admin);
          localStorage.setItem("user", JSON.stringify({ ...admin }));
          localStorage.setItem("adminName", admin.username);
          localStorage.setItem("adminPassword", admin.Password);

          navigate("/adminfinalprofile", { state: admin });
        }
      } else if (user.data.role === "TourismGovernor") {
        response = await axios.post(
          "http://localhost:3002/tourism-governor/login",
          {
            username: formData.username,
            Password: formData.password,
          }
        );

        localStorage.setItem("selectedRole", user.data.role);

        if (response.data) {
          const tourismGovernor = response.data.tourismGovernor;
          if (
            tourismGovernor.username === formData.username &&
            tourismGovernor.Password === formData.password
          ) {
            // Store the user's details including the Username and Password in localStorage
            localStorage.setItem("user", JSON.stringify(tourismGovernor));
            localStorage.setItem(
              "tourismGovernorName",
              tourismGovernor.username
            ); // Store Username for later comparison
            localStorage.setItem(
              "tourismGovernorPassword",
              tourismGovernor.Password
            );

            // Redirect to Seller Profile page with seller's data
            navigate("/get-createdhistoricalplaces", {
              state: tourismGovernor,
            }); //mhtageen n3ml tourism governor profile? Ahmed
          } else {
            setError("Invalid credentials. Please try again.");
          }
        } else {
          setError("Invalid credentials. Please try again.");
        }
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  //<<<<<<< Updated upstream
  return (
    <div style={styles.container}>
      <h1 className="title text-start mb-4" style={styles.header}>
        Login
      </h1>
      <div style={styles.formContainer}>
        {/* <label htmlFor="role" style={styles.label}>Register as:</label> */}
        {/* <button className='btn-go rounded-2 py-1 px-3 mt-2' onClick={handleGoClick} >Go</button> */}

        {showFields && (
          <form className="form" onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="input"
                  placeholder=""
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span className="span">Username</span>
              </label>
            </div>

            <div style={styles.inputGroup}>
              <label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span className="span">Password</span>
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁" : "🙈"}
                </span>
              </label>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" style={styles.submitButton}>
              Login
            </button>
            <p style={styles.forgotPassword}>
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      setShowForgotPassword(); // This toggles the ForgotPassword modal
    }}
    style={styles.link}
  >
    Forgot Password?
  </a>
</p>


          </form>
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 className="title text-start mb-4" style={styles.header}>
        Login
      </h1>
      <div style={styles.formContainer}>
        {showFields && (
          <form className="form" onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="input"
                  placeholder=""
                  value={formData.username}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span className="span">Username</span>
              </label>
            </div>

            <div style={styles.inputGroup}>
              <label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="input"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span className="span">Password</span>
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁" : "🙈"}
                </span>
              </label>
            </div>
            <button type="submit" style={styles.submitButton}>
              Login
            </button>

            {/* Forgot Password Link */}
          </form>
        )}
      </div>
    </div>
  );

  //>>>>>>> Stashed changes
};

const styles = {
  container: {
    width: "30vw",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f988",
    border: "1px solid #fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#444",
  },
  select: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px dashed #ccc",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px dashed #ccc",
    width: "100%",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#5ddec2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },

  forgotPassword: {
    textAlign: "center",
    marginTop: "10px",
    color: "#5ddec2", // Set the color to #5ddec2
  },
  link: {
    textDecoration: "none",
    fontWeight: "bold",
    color: "#A0522D", // Set the initial color of the link to #5ddec2
  },
  linkHover: {
    textDecoration: "underline", // Underline on hover
  },
};

export default LoginModal;