 <h3 style="text-align: left;">Introducing Our All-in-One Travel Planner</h3>
 <div align="center">
  <h1>Trip Saviour ⛱️⛵🌊</h1>
</div>

 


Introducing our comprehensive travel platform, designed to simplify and enhance your vacation planning experience. Whether you're envisioning a journey through historic landmarks, a relaxing retreat on serene beaches, or fun-filled family adventures, our app brings all the essential tools together to help you create the perfect trip.


---

## Table of Contents
1. [About the Project](#about-the-project)
2. [Motivation](#motivation)
3. [Build Status](#build-status)
4. [Code Style](#code-style)
5. [Screenshots](#screenshots)
6. [Features](#features)
7. [Tech Stack](#tech-stack)
8. [Code Examples](#code-examples)
9. [Installation](#installation)
10. [How to Use](#how-to-use)
11. [API Refrences](#api-refrences)
10. [Tests](#tests)
11. [Roadmap](#roadmap)
12. [Contributing](#contributing)
13. [Credits](#credits)
14. [License](#license)
15. [Contact](#contact)

---

# About the Project

The **Virtual Trip Planner** simplifies travel planning by offering:
- Personalized recommendations based on user preferences (budget, interests, travel dates).
- Interactive maps for visualizing destinations and routes.
- Seamless integration with travel for real-time data on flights, hotels, and activities.

This project aims to make travel planning hassle-free and enjoyable.

---

# Motivation

This project was developed as part of the Advanced Computer Lab course (CSEN 704) at the German University in Cairo, Egypt. It was collaboratively designed and implemented by a team of 10 Media Engineering students.The project reflects the culmination of our theoretical knowledge and practical skills, with a focus on innovative problem-solving and teamwork.

---

# Build Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) 
![Tests](https://img.shields.io/badge/tests-93%25-success) 
- **Current Status:** Stable and functional.
- **Sprint Development:** Completed over 3 sprints.
- **Functioning Features:** Most planned features have been implemented and tested successfully.
- **Known Issues:**  Minimal issues identified in:
- Exchange currency API has only 3 currencies so far.
- Promo codes are sent every second, instead of once at 12AM.
- Notifications that remind the tourists of upcoming events they paid for are still under development.
-Missing of some back buttons , users rely on the back button of the browser.
- **Test Coverage:** Key functionalities have been tested manually to ensure reliability.

- **Release Version:** v1.0 (Final Submission)

---
# Code Style

 
![Code Style](https://img.shields.io/badge/code%20style-Airbnb-yellow)


Airbnb code style is what we attempted to stay consistent with throughout the entire development of the project with some very minor inconsistencies (e.g., mixed quotes and variable naming). In future developments, we plan to resolve these inconsistencies.

---
# Screenshots

1. **Home Page**
   
   ![WhatsApp Image 2024-12-09 at 05 35 07_ed66b580](https://github.com/user-attachments/assets/9a66fe60-f1d2-4fb9-8bee-94cd5217ff1e)

2. **Explore Activities**

![WhatsApp Image 2024-12-09 at 06 02 41_4b2dec01](https://github.com/user-attachments/assets/bd1d647f-8edb-44a3-b973-53d8a0a6f552)


3. **Tourist Profile**

![tourist profile](https://github.com/user-attachments/assets/a1bd4c68-f18f-4462-9ede-8a10922d182a)

4. **Tourist Profile Edit**

![tourist profile edit](https://github.com/user-attachments/assets/3fdaa6f7-200e-4028-9f95-ee31c0802891)

5. **Tourist profile dropdown**

![tourist profile dropdown](https://github.com/user-attachments/assets/2d72d338-fa3b-448a-b5c9-87baf116c7e4)

6. **Tourist Activities**

![tourist activities](https://github.com/user-attachments/assets/2063c8ea-2ad2-4e14-b1c2-d22d767b794c)

7. **Tourist Complaints**

![tourist complaints](https://github.com/user-attachments/assets/b78e911c-fbc0-486d-b366-198f76d77154)

8. **Tourist Rate Itineraries & Tour Guide**

![tourist rate itineraries](https://github.com/user-attachments/assets/c27bfe96-c948-4677-86d6-6f72b6a0c2c8)

9. **Tourist Rate Activities**

![tourist rate activities](https://github.com/user-attachments/assets/08097cd0-1a79-4680-b787-b80dcf4c5ec5)

10. **View Products**

![products](https://github.com/user-attachments/assets/4411dc92-2cf3-4ccc-8018-c6ea663fde4d)

11. **Product Details**

![products details](https://github.com/user-attachments/assets/a9c3f7be-85c6-4d3b-854f-92df97595da7)

12. **Itinerary Details**

![itineraries details](https://github.com/user-attachments/assets/9c468692-e0ec-487e-88e6-f882fa88b65b)

13. **Historical Places Details**

![HP details](https://github.com/user-attachments/assets/68c6f173-0b0f-4722-bde2-9e8e7f10de2b)

14. **Tourist Flight Booking**

![flight booking](https://github.com/user-attachments/assets/b21b1fac-83f6-4dce-ab4f-7c78b4696e3a)

15. **Step-by-Step Guide**

![how to use steps](https://github.com/user-attachments/assets/761226e5-82cb-431f-b4b6-17307f831466)

16. **Tour Guide Itineraries**

![tour guide itineraries](https://github.com/user-attachments/assets/73321e47-9dbd-4480-8e23-87fd3952c5ca)

17. **Tour Guide Create Itinerary**

![tour guide create itinerary](https://github.com/user-attachments/assets/bf3baa63-a147-4793-8a68-51497e588dc2)

18. **Tour Guide Sales Report**

![tg sales report](https://github.com/user-attachments/assets/a47bb417-fedd-4436-b70e-86063e147805)

19. **Tour Guide Contributors**

![tg contributors](https://github.com/user-attachments/assets/0bd65c53-b883-47ab-8203-43552f20561e)

20. **Delete Account**

![delete account](https://github.com/user-attachments/assets/d3cf8ddd-ec75-4a78-ac66-59c18c822623)

21. **Advertiser Create Activity**

![advertiser create activity](https://github.com/user-attachments/assets/0881a1cb-e914-4ad4-bc65-77356e9d05f8)

22. **Tourism Governer Create Historical Place**

![tourism governor add HP](https://github.com/user-attachments/assets/0b46a912-27d8-4a75-928d-07bc4f34d3df)


23. **Seller/Admin Create Product**

![seller create product](https://github.com/user-attachments/assets/98b5a8f5-57a4-4620-bbe7-e1af4542f6bd)

24. **Admin Statistics**

![admin stats](https://github.com/user-attachments/assets/bfe3245c-8fc4-4622-8e89-04f64426136e)

25. **Admin Add Admin**

![add admin](https://github.com/user-attachments/assets/d241fd56-ec47-4f19-8432-5278c4897988)

26. **Notifications**

![notifications](https://github.com/user-attachments/assets/5ab0842d-c8dd-461a-9470-819ff847c89c)

27. **Admin Manage Categories**

![add category admin](https://github.com/user-attachments/assets/f619e3c7-f7a6-4968-b09b-e6ceec294838)

28. **Admin Review Documents**

![documents admin](https://github.com/user-attachments/assets/3e16983d-f847-4800-afd6-5ac48eb4ffb6)

29. **Admin Flag Events**

![flag admin](https://github.com/user-attachments/assets/d7972ef5-b27a-4d6b-90e2-2c5f7d60cffc)

30. **Admin Delete User**

![delete account](https://github.com/user-attachments/assets/16623c8b-d3f2-4652-96cc-bdd71941acfb)


---
---
# Features

### **User Management**
- **Account Management**: Secure login for all users (tourists, tour guides , advertisers , sellers , tourism governors and admins), password reset via OTP, and password change.
- **User Registration**: Flexible sign-up options for tourists, tour guides, advertisers and sellers.
- **Profile Management**: Create, read, update, and profiles for all user roles, with specialized fields tailored to each user.
- **Document Verification**: Upload and validate ID documents for roles requiring verification, such as tour guides, sellers and advertisers.
- **Terms and Conditions**: Enforce acceptance of terms and conditions before using the platform for tour guides , sellers and advertisers only once.
- **Explore Hub**:Guests can easily view all the upcoming activities, itineraries, and historical places/museums and can filter and sort them to find options that best suit their preferences.
### **Tourist Features**
- **Profile Page**: Any tourist can view his profile and update his info except username and wallet they are not editable.
- **Change password**: Enter current password , new password and confirmation of new password to change your password successfully.
- **Step by step**: View a step-by-step guide on the steps you must take in order to begin my vacation
- **Request account deletion**: Any tourist can request his account to be delete his account.
- **Explore Hub**:Tourists can easily view all the upcoming activities, itineraries, and historical places/museums and can filter and sort them to find options that best suit their preferences.
- **Vacation Planning**: Customize itineraries based on selected preferences like budget, historic areas, beaches, and shopping.
- **Activity and Event Booking**: Book flights, hotels, transportation, events, and itineraries within the platform and booking can be only cancelled 48 hours before the start of the event/ activity or itinerary.
- **Products GiftShop**:Tourists can view a comprehensive list of all available products, including details such as product pictures, price, description, seller information, ratings, and reviews. Additionally, touirsts can filter products based on price and sort them by ratings to make informed purchasing decisions.
- **Notifications**: Receive timely alerts for upcoming events and promotional offers on system and via email.
- **Payment and Wallet**: Flexible payment options, including wallet, credit card, cash on delivery and Stripe integration. Wallet updates after cancellations or point redemption.
- **Promocodes**: Tourist can use his Promo code on anything in the website.
- **Loyalty Rewards**: Earn points, levels, and badges for bookings and redeem them for wallet credits.
- **Social Interaction**: Share activities and itineraries, rate and review tour guides, itineraries,events and products.
- **Wishlist and Cart**: Bookmark activities,add product to wishlist, add products to cart , view them and manage purchases through a cart system.
- **File a complaint**: Any tourist can file a complaint and view them in his complaints.
  
### **Tour Guide Features**
- **Profile Pages**: Any tourguide can create and view his account and upload profile picture after being accepted on the system .
- **Change password**: Enter current password , new password and confirmation of new password to change your password successfully.
- **Request account deletion**: Any tourguide can request his account to be delete his account.
- **Itinerary Management**: Create, read, update, and delete customizable itineraries with detailed activity breakdowns.
- **Itinerary Acctivation**:Tourguides can manage the activation and deactivation of their itineraries.
- **Reporting and Analytics**: View and filter reports on revenue, bookings, and tourist participation.
- **Notifications**: Get notified about his flagged itineraries on system and email.

### **Advertiser Features**
- **Profile Pages**: Any advertiser can create and view his account and upload profile picture after being accepted on the system .
- **Change password**: Enter current password , new password and confirmation of new password to change your password successfully.
- **Request account deletion**: Any advertiser can request his account to be delete his account.
- **Activity Management**: Create and manage activities with categories, tags, discounts, and booking details.
- **Reporting**: Analyze sales and attendance data, with filtering options for deeper insights.
- **Promotional Tools**: Use curated tags and categories to improve activity visibility.
- **Notifications**: Get notified about his flagged activities on system and email.

### **Seller Features**
- **Profile Pages**: Any seller can create and view his account and upload profile picture after being accepted on the system .
- **Change password**: Enter current password , new password and confirmation of new password to change your password successfully.
- **Request account deletion**: Any advertiser can request his account to be delete his account.
- **Product Management**: Manage an in-app gift shop with product listings, images, pricing, and inventory tracking and can archive any product.
- **Wishlist and Cart Integration**: Engage tourists with product wishlists and seamless checkout.
- **Sales Reporting**: Analyze sales and inventory to optimize offerings.
- **Notifications**: Get notified when my products are out of stock on system and email.
  
### **Admin Features**
- **Change password**: Enter current password , new password and confirmation of new password to change your password successfully.
- **Platform Oversight**: Approve or reject registrations for tour guides, advertisers, and sellers based on uploaded documents.
- **Accounts deletion**: Delete any account off system or accept/reject requested accounts to be deleted.
- **Invite Users**: Add another admin or tourism governor to the system.
- **Content Management**: Add, update, or delete categories and preferences .
- **Complaint Resolution**: Manage and respond to user complaints with filtering and sorting capabilities and mark complaint as pending/resolved.
- **Reporting**: Generate comprehensive sales reports and track user metrics.View a sales report containing all my revenue from different events/ itineraries/ sales from the gift shop.
- **Flag Events/Itinerary**:Flag an event/ itinerary deem inappropriate .
- **View Contribution**: View the number of users in total and the number of new users per month.
- **Promo Codes**: Create promotional codes and birthday discounts to drive user engagement.
- **Product Management**: Manage an in-app gift shop with product listings, images, pricing, and inventory tracking and can archive any product.
- **Notifications**: Get notified when my products are out of stock on system and email.

### **Tourism Governor Features**
- **Cultural Content Management**: Add and manage museums and historical sites. Assign tags like "monument" or "religious site."
- **Custom Tags**: Enrich user experiences with tags based on historical periods and themes.

### **Search and Discovery**
- **Powerful Search**: Search for activities, itineraries, products, and historical locations using names, categories, or tags.
- **Filtering and Sorting**: Refine searches by budget, date, preferences, ratings, and more.
- **User Education**: Provide step-by-step guides to help users navigate and maximize the platform.

### **E-commerce and Payment**
- **Integrated Shopping**: Explore products, save them in a wishlist, and complete purchases through secure checkout.
- **Dynamic Pricing**: Support multi-currency pricing and special offers for events and products.
- **Cancellation and Refunds**: Manage cancellations and process refunds back to wallets.

### **Real-Time Updates**
- **Notification System**: Alerts for flagged events, new bookings, and upcoming activities.
- **Live Updates**: Ensure tourists and sellers are always aware of the latest system changes and promotions.

### **Miscellaneous Features**
- **Help and Support**: File and track complaints for any issues encountered.
---
---

# Tech Stack

- **Frontend**: React.js, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **api**: Google Maps , ExchangeRate , NodeMailer , Amadeus , Stripe 

---

# Code Examples


### 1. Send OTP

**Description:** Sends a 4-digit OTP to the user's email.  
**Endpoint:** `POST /api/send-otp`  
**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Code Snippet (FrontEnd):**
``` js
const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    try {
      // Make an actual API call to verify OTP
      const response = await axios.post('http://localhost:3002/api/verify-otp', {
        email,
        otp: enteredOtp,
      });

      if (response.data.success) {
        setSuccess('OTP verified successfully!');
        setError('');

        // Navigate to the Reset Password page
        navigate('/reset-password', { state: { email } });
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
        setSuccess('');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
      setSuccess('');
    }
  };
```
**BackEnd:**
``` js
/ Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  // Generate a random 4-digit OTP
  const otp = crypto.randomInt(1000, 9999);

  // Store the OTP with a short expiration time (e.g., 5 minutes)
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  try {
    // Send the OTP via email
    await transporter.sendMail({
      from: `"Trip Saviour" <${process.env.EMAIL_USER}>`, // Sender address
      to: email, // Recipient's email
      subject: 'Your OTP Code', // Subject line
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`, // Plain text body
    });

    res.status(200).json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.code === 'EAUTH') {
      return res.status(500).json({ success: false, message: 'Authentication error with email provider.' });
    }
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Both email and OTP are required.' });
  }

  // Check if the OTP exists and has not expired
  const record = otpStore[email];
  if (!record) {
    return res.status(404).json({ success: false, message: 'OTP not found or expired.' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email]; // Remove expired OTP
    return res.status(400).json({ success: false, message: 'OTP has expired.' });
  }

  if (parseInt(otp, 10) !== record.otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP.' });
  }

  // OTP is valid
  delete otpStore[email]; // Clean up after successful verification
  res.status(200).json({ success: true, message: 'OTP verified successfully.' });
});

// Set up a cleanup interval to remove expired OTPs every minute
setInterval(() => {
  for (const email in otpStore) {
    if (otpStore[email].expiresAt < Date.now()) {
      delete otpStore[email]; // Remove expired OTP
    }
  }
}, 60 * 1000); // Run every minute
```
### 2. File a Complaint

**Description:** Allows tourists to file a complaint by providing a title, body, and date. The complaint is associated with the tourist's username.  
**Endpoint:** `POST /complaints`  
**Request Body:**
```json
{
  "Title": "Complaint Title",
  "Body": "Details about the complaint.",
  "Date": "2024-12-08",
  "TouristUsername": "tourist123"
}
```


**Code Snippet (FrontEnd):**
``` js
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const response = await axios.post('http://localhost:3002/complaints', {
      Title,
      Body,
      Date,
      TouristUsername: Username, // Retrieve from localStorage or session
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

```
**BackEnd:**
``` js
app.post('/complaints', async (req, res) => {
  try {
    const { TouristUsername, Title, Body, Date } = req.body; // Destructure from request body
    const newComplaint = new ComplaintModel({
      TouristUsername, // Store username in the complaint
      Title,
      Body,
      Date,
    });
    await newComplaint.save();
    console.log(newComplaint);
    res.status(201).json({
      message: 'Complaint filed successfully',
      complaint: newComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

```
### 3. Create a Product

**Description:** Allows sellers to create a new product by providing details such as name, description, ratings, reviews, price, and quantity.  
**Endpoint:** `POST /createProduct`  
**Request Body:**
```json
{
  "Name": "Product Name",
  "Description": "Product Description",
  "sellerUsername": "seller123",
  "Ratings": 5,
  "Reviews": "This product is amazing!",
  "Price": 100,
  "Quantity": 10
}
```




**Code Snippet (FrontEnd):**
``` js
const handleCreateProduct = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3002/createProduct',
      newProduct
    );
    console.log('Product created successfully:', response.data);
    setProducts([...products, response.data]);
    setNewProduct({
      Name: '',
      Description: '',
      sellerUsername: '',
      Ratings: '',
      Reviews: '',
      Price: '',
      Quantity: '',
    });
    setSuccessMessage('Product created successfully!'); // Display success message

    // Clear the success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (error) {
    console.error('Error creating product:', error);
    alert('Failed to create product. Please try again.');
  }
};


```
**BackEnd:**
``` js
const createProduct = async (req, res) => {
  try {
    const newProduct = new productModel({ ...req.body });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

```

### 4. Add a product to cart 

**Description:** Allows tourists to add a specific product to their cart.  
**Endpoint:** `PUT tourists/addToCart/:id`  
**Request Body:**
```json
{
  "productId": "63f9c8a5e4b0c123456789ab",
  "quantity": 2
}
```


**Code Snippet (FrontEnd):**
``` js
 const handleAddToCart = async (productId, quantity) => {
    const userData = localStorage.getItem("user");
    let touristId;
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      touristId = parsedUserData._id;
    } else {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      await axios.put(`http://localhost:3002/tourists/addToCart/${touristId}`, { productId, quantity });
      alert("Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding product to cart:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
    alert(errorMessage);
    }
  };

```
**BackEnd:**
``` js
app.put("/tourists/addToCart/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product to be added
    const quantity = req.body.quantity; // Quantity to add

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.Quantity) {
      return res.status(400).json({ message: "Not enough products in stock" });
    }

    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product._id.toString() === productId // Access the _id field of the product
    );

    console.log(cartItemIndex);

    if (cartItemIndex > -1) {
      // If product is already in the cart, update the quantity
      const currentQuantity = tourist.cart[cartItemIndex].quantity;

      if (currentQuantity + quantity > product.Quantity) {
        return res
          .status(400)
          .json({ message: "Not enough products in stock" });
      }

      tourist.cart[cartItemIndex].quantity += quantity;
    } else {
      // If product is not in the cart, add it
      tourist.cart.push({ product: productId, quantity });
    }

    // Save the updated tourist document
    await tourist.save();

    // Populate cart details for the response
    const updatedTourist = await TouristModel.findById(touristId).populate(
      "cart.product"
    );

    res.status(200).json({
      message: "Product added to cart successfully",
      cart: updatedTourist.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

```

### 5. Add a product to wishlist

**Description:** Allows tourists to add a product to their wishlist.  
**Endpoint:** `PUT /tourists/addProductToWishlist/:id`  
**Request Body:**
```json
{
  "productId": "63f9c8a5e4b0c123456789ab"
}
```




**Code Snippet (FrontEnd):**
``` js
const handleAddToWishlist = async (productId) => {
    const userData = localStorage.getItem("user");
    let touristId;
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      touristId = parsedUserData._id;
    } else {
      alert("User not found. Please log in again.");
      return;
    }

    try {
      await axios.put(`http://localhost:3002/tourists/addProductToWishlist/${touristId}`, { productId });
      alert("Product added to wishlist successfully!");
    } catch (err) {
      console.error("Error adding product to wishlist:", err);
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred';
    alert(errorMessage);
    }
  };


```
**BackEnd:**
``` js
app.put("/tourists/addProductToWishlist/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product to be added

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);

    const wishlistIds = tourist.wishlist.map((item) => String(item));

    console.log(wishlistIds.includes(String(productId)));
    // Check if product is already in wishlist
    if (wishlistIds.includes(String(productId))) {
      return res
        .status(400)
        .json({ message: "Product is already in the wishlist" });
    }

    // Add the product to the wishlist
    tourist.wishlist.push(productId);

    // Save the updated tourist document
    await tourist.save();

    // Populate the wishlist to return detailed product information
    const updatedTourist = await TouristModel.findById(touristId).populate(
      "wishlist"
    );

    res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist: updatedTourist.wishlist, // Populated wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

```

### 6. Create a Historical place 

**Description:** Allows tourism governers to add a new historical place to the website for tourists to learn more about.  
**Endpoint:** `POST /createHistoricalPlaces`  
**Request Body:**
```json
{
  "governorUsername": "johnDoe",
  "governorId": "64a7c8e1d4e1234567890def",
  "name": "Great Pyramid of Giza",
  "description": "The oldest and largest of the three pyramids in Giza.",
  "location": "Giza, Egypt",
  "historicalSignificance": "One of the Seven Wonders of the Ancient World.",
  "entryFeeForeign": 500,
  "entryFeeNative": 300,
  "entryFeeStudent": 200,
  "openingHours": "8:00 AM - 5:00 PM",
  "category": "Monument",
  "tags": ["Ancient", "World Heritage"],
  "type": "Monument"
}

```


**Code Snippet (FrontEnd):**
``` js
 const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const {
      name,
      description,
      historicalSignificance,
      openingHours,
      category,
      location,
    } = historicalPlaceDetails;

    if (!location) {
      setErrorMessage("Please enter a location.");
      return;
    }

    if (
      !name ||
      !description ||
      !historicalSignificance ||
      !openingHours ||
      !category
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!selectedImage) {
      setErrorMessage("Please select an image.");
      return;
    }

    const formData = new FormData();
    // Append all historical place details
    Object.keys(historicalPlaceDetails).forEach((key) => {
      if (key === "tags") {
        // Special handling for tags
        formData.append(key, JSON.stringify(historicalPlaceDetails[key]));
      } else {
        formData.append(key, historicalPlaceDetails[key]);
      }
    });
    // Append the image
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        "http://localhost:3002/createHistoricalPlaces",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Historical place created successfully!");
        // Reset form
        setHistoricalPlaceDetails({
          governorUsername: username,
          name: "",
          description: "",
          historicalSignificance: "",
          entryFeeForeign: 250,
          entryFeeNative: 200,
          entryFeeStudent: 150,
          openingHours: "",
          pictures: "",
          category: "Museum",
          tags: [],
          location: "",
        });
        setSelectedImage(null);
      }
    } catch (error) {
      console.error("Error creating historical place:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error creating historical place. Please try again."
      );
    }
  };

```
**BackEnd:**
``` js
app.post(
  "/createHistoricalPlaces",
  uploadHistImage.single("image"), // Handle image upload
  async (req, res) => {
    try {
      const imagePath = req.file ? req.file.path : null;

      if (!imagePath) {
        return res.status(400).json({ message: "Image upload failed" });
      }

      // Create a new historical place using the request body and add the image path
      const newHistoricalPlace = new HistoricalPlaceModel({
        ...req.body, // Spread the other fields from the request body (e.g., name, description, etc.)
        pictures: imagePath, // Add the image path to the pictures field
      });

      // Save the new historical place
      const savedPlace = await newHistoricalPlace.save();

      // Respond with the saved historical place
      res.status(200).json({
        message: "New historical place created with image",
        savedPlace,
      });
    } catch (error) {
      console.error("Error creating historical place:", error);
      res
        .status(500)
        .json({ message: "Error creating historical place", error });
    }
  }
);

```

### 7. Rate products

**Description:** Allows tourists rate the product they purchased.  
**Endpoint:** `POST /tourists/rateProduct/:touristId`  
**Request Body:**
```json
{
  "productId": "64a7c8e1d4e1234567890abc",
  "rating": 4
}

```


**Code Snippet (FrontEnd):**
``` js
 const handleRatingSubmit = async (itemId) => {
        const rating = selectedRatings[itemId];
        try {
            await axios.post(`http://localhost:3002/tourists/rateProduct/${id}`, {
                productId: itemId,
                rating,
            });
            setSubmittedRatings({ ...submittedRatings, [itemId]: true }); // Mark this rating as submitted
            alert('Rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

```
**BackEnd:**
``` js
app.post("/tourists/rateProduct/:touristId", async (req, res) => {
  const { productId, rating } = req.body; // Get product ID and rating from the request body

  // Validate input
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Invalid rating value. Rating must be a number between 1 and 5.",
    });
  }

  try {
    // Find the product and update its ratings
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Push the new rating to the AllRating array
    product.AllRatings.push(rating);

    // Update the average rating
    const totalRatings = product.AllRatings.reduce(
      (acc, curr) => acc + curr,
      0
    );
    product.Ratings = totalRatings / product.AllRatings.length; // Calculate new average

    // Save the updated product
    await product.save();

    return res.status(200).json(product); // Respond with the updated product
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

``` 

### 8. View upcoming activities

**Description:** Allows tourists to view the available upcoming activities so they can book it.  
**Endpoint:** `GET getUpcomingActivities`  
**Request Body:**

NONE




**Code Snippet (FrontEnd):**
``` js
const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3002/getUpcomingActivities"
      );
      setActivities(response.data);
      const uniqueCategories = [
        ...new Set(activities.map((activity) => activity.category)),
      ];
      setCategories(uniqueCategories);
      setError("");
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Failed to load activities. Please try again."
      );
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };


```
**BackEnd:**
``` js
app.get("/getUpcomingActivities", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activities = await ActivityModel.find({
      date: { $gt: today },
    });

    if (activities.length > 0) {
      res.status(200).json(activities);
    } else {
      res.status(404).json({ message: "No upcoming activities found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
});

```

### 9. Book activity

**Description:** Allows tourists book a specific activity to attend.  
**Endpoint:** `POST /activities/book-activity`  
**Request Body:**
```json
{
  "name": "Snorkeling Adventure", 
  "username": "john_doe",
  "totalPrice": 150
}


```


**Code Snippet (FrontEnd):**
``` js
 const handlebookingActivity = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;

    if (!username) {
      alert("You must be logged in to book an activity.");
      return;
    }

    try {
      console.log(bookedActivities);
      const response = await axios.post(
        "http://localhost:3002/activities/book-activity",
        {
          name: bookingActivity.name,
          username,
          totalPrice: bookingActivity.price * (1 - discount / 100) + 5,
        }
      );

      alert(response.data.message);
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.name === bookingActivity.name
            ? {
                ...activity,
                bookedBy: [...(activity.bookedBy || []), username],
              }
            : activity
        )
      );
    } catch (error) {
      console.error("Error bookingActivity activity:", error.message);
      alert("Failed to book activity. Please try again.");
    }
  };
  const handleBookWithCard = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;
    if (!username) {
      alert("You Must Be Signed In To Book Transportation");
      return;
    }
    try {
      const toBePayedFor = bookingActivity;
      const category = "activity";
      const currency = "USD";
      const stripe = await loadStripe(
        "pk_test_51QP32KJw0GnOmOhiEcjFRPOQuAaeMvLFua47d32A2oZRpH6RjplhiKrp98clFipprosXFawCqzGEGAYK2OpulYI400jvrMVbHU"
      );
      const body = {
        //need to get as input to the CardPayment component
        category: category,
        products: toBePayedFor,
        currency: currency,
        discount,
      };
      const headers = {
        "content-Type": "application/json",
      };
      const response = await fetch(
        "http://localhost:3002/create-checkout-session",
        {
          method: "post",
          headers: headers,
          body: JSON.stringify(body),
        }
      );
      const session = await response.json();
      const result = stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error("Error:", error);
    }
  };

```
**BackEnd:**
``` js
app.post("/activities/book-activity", async (req, res) => {
  const { name, username, totalPrice } = req.body;

  try {
    // Find the activity by name and ensure it's open for booking
    const activity = await Activity.findOne({ name, bookingOpen: true });
    if (!activity) {
      return res
        .status(404)
        .json({ message: "Activity not found or already booked." });
    }

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }

    // Check if the tourist has enough wallet balance
    if (tourist.wallet < totalPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance." });
    }

    // Deduct the price from the tourist's wallet
    tourist.wallet -= totalPrice;

    // Calculate loyalty points based on the level
    let pointsMultiplier;
    switch (tourist.level) {
      case 1:
        pointsMultiplier = 0.5;
        break;
      case 2:
        pointsMultiplier = 1.0;
        break;
      case 3:
        pointsMultiplier = 1.5;
        break;
      default:
        pointsMultiplier = 1.0; // Default to level 2 rate if level is out of range
    }
    const loyaltyPoints = totalPrice * pointsMultiplier;
    tourist.loyaltyPoints += loyaltyPoints;

    // Update the level based on the new loyalty points total
    if (tourist.loyaltyPoints <= 100000) {
      tourist.level = 1;
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.level = 2;
    } else {
      tourist.level = 3;
    }

    // Update the activity as booked and associate it with the user
    tourist.bookedActivities.push(activity);
    activity.bookedBy.push(username);

    // Save changes to both activity and tourist
    await Promise.all([activity.save(), tourist.save()]);

    res.status(200).json({
      message: "Activity booked successfully and loyalty points awarded!",
      updatedActivity: activity,
      newWalletBalance: tourist.wallet,
      newLoyaltyPoints: tourist.loyaltyPoints,
      newLevel: tourist.level,
    });
  } catch (error) {
    console.error("Error booking activity:", error);
    res.status(500).json({ message: "Failed to book activity." });
  }
});

``` 
### 10. Redeem Points

**Description:** Allows tourists to redeem points to be added to there wallet as a gift for there many purchases.  
**Endpoint:** `POST /tourist/redeem-points`  
**Request Body:**
```json
{
  "username": "Jhon Doe"
}

```


**Code Snippet (FrontEnd):**
``` js
 const handleRedeemPoints = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const username = user?.username;

      if (!username) {
        return alert("User not found.");
      }

      const response = await axios.post(
        "http://localhost:3002/tourist/redeem-points",
        { username }
      );

      // Set success message for the alert
      setAlertMessage(response.data.message);
      setShowAlert(true);

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 1000);

      // Update other data if necessary
      setWallet(response.data.newWalletBalance);
      setLoyaltyPoints(response.data.remainingPoints);
      setLevel(response.data.newlevel); // Set new level

      fetchData();
    } catch (error) {
      console.error("Error redeeming points:", error);
      setAlertMessage("Failed to redeem points. Please try again.");
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

```
**BackEnd:**
``` js
app.post("/tourist/redeem-points", async (req, res) => {
  const { username } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Calculate redeemable cash and points to redeem
    const pointsToEGPConversion = 10000;
    const redeemableCash =
      Math.floor(tourist.loyaltyPoints / pointsToEGPConversion) * 100;
    const redeemedPoints = (redeemableCash * pointsToEGPConversion) / 100;

    if (redeemableCash === 0) {
      return res
        .status(400)
        .json({ message: "Insufficient points to redeem." });
    }

    // Update wallet and loyalty points
    tourist.wallet += redeemableCash;
    tourist.loyaltyPoints -= redeemedPoints;

    // Determine new level based on remaining points
    if (tourist.loyaltyPoints <= 100000) {
      tourist.level = 1;
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.level = 2;
    } else {
      tourist.level = 3;
    }

    await tourist.save();

    res.status(200).json({
      message: "Points redeemed successfully!",
      newWalletBalance: tourist.wallet,
      remainingPoints: tourist.loyaltyPoints,
      newlevel: tourist.level,
    });
  } catch (error) {
    console.error("Error redeeming points:", error);
    res.status(500).json({ message: "Failed to redeem points." });
  }
});

```

### 11. Cancel an order

**Description:** Allows tourists to cancel an order before it arrives.  
**Endpoint:** `PUT /tourist/cancel-order`  
**Request Body:**
```json
{
  "orderId": "64f5b2d2a4b1c9e9f8aefb23",
  "username": "john_doe"
}


```


**Code Snippet (FrontEnd):**
``` js
 const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:3002/tourist/cancel-order`,
        { orderId, username }
      );
      if (response.status === 200) {
        const updatedOrders = currentOrders.filter(
          (order) => order._id !== orderId
        );
        setCurrentOrders(updatedOrders);
        alert("Order canceled successfully.");
      } else {
        alert("Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

```
**BackEnd:**
``` js
app.put("/tourist/cancel-order", async (req, res) => {
  try {
    const { orderId, username } = req.body;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Find the order with the specified ID in the orders array
    const orderIndex = tourist.orders.findIndex(
      (o) => o._id.toString() === orderId
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = tourist.orders[orderIndex];

    // Check if ETA is in the past
    const currentDateTime = new Date();
    const orderETA = new Date(order.ETA);

    if (orderETA <= currentDateTime) {
      return res.status(400).json({
        message: "Order cannot be cancelled as the ETA is in the past.",
      });
    }

    // Refund the total price to the tourist's wallet balance
    tourist.wallet += order.totalPrice;

    // Remove the order from the orders array
    tourist.orders.splice(orderIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Order cancelled and refunded successfully.",
      walletBalance: tourist.wallet,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res
      .status(500)
      .json({ message: "An error occurred while cancelling the order." });
  }
});

``` 

### 12. Edit product Details

**Description:** Allows admins and sellers to edit their product details.  
**Endpoint:** `PUT /editProductDetails/:productId`  
**Request Body:**
```json
{
  "Description": "Updated description of the product",
  "Name": "Updated Product Name",
  "Quantity": 50,
  "Price": 99.99
}



```


**Code Snippet (FrontEnd):**
``` js
 const handleSaveProduct = async () => {
    const confirmSave = window.confirm("Are you sure you want to save the changes?");
    if (!confirmSave) return;

    try {
      const response = await axios.put(
        `http://localhost:3002/editProductDetails/${productDetails._id}`,
        editedDetails
      );
      setProductDetails(editedDetails);
      localStorage.setItem("productName", editedDetails.Name);
      setEditMode(false);
      setError("");
      alert("Product details have been successfully updated!");
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Error saving product. Please try again.");
    }
  };

```
**BackEnd:**
``` js
const editProductDetailsPrice = async (req, res) => {
  try {
    const { productId } = req.params;
    const { Description, Name, Quantity, Price } = req.body;
    const product = await productModel.findByIdAndUpdate(
      productId,
      { Description, Name, Quantity, Price },
      { new: true, runValidators: true }
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

app.put("/editProductDetails/:productId", editProductDetailsPrice);

``` 
### 13. Select prefrence

**Description:** Allows Tourists to select their prefrence.  
**Endpoint:** `POST /tourist/updatePreferences`  
**Request Body:**
```json
{
  "username": "john_doe123",
  "preferences": ["beaches", "museums", "adventure"],
  "action": "add"
}

```


**Code Snippet (FrontEnd):**
``` js
 const handlePreferencesSubmit = async () => {
    try {
      let username = localStorage.getItem("username");
      console.log(username); // This logs the raw value, which may have extra quotes

      // Remove the extra quotes (escaped characters)
      username = username.replace(/^"|"$/g, ""); // Removes leading and trailing quotes if present

      console.log(username); // Should log "seiff" without extra quotes

      if (
        !username ||
        !selectedPreferences ||
        selectedPreferences.length === 0
      ) {
        alert("User is not logged in or preferences are missing.");
        return;
      }

      // Trim each preference in the selectedPreferences array
      const trimmedPreferences = selectedPreferences.map((preference) =>
        preference.trim()
      );

      // Ensure preferences is an array
      if (!Array.isArray(trimmedPreferences)) {
        alert("Preferences must be an array.");
        return;
      }

      // Prepare the data to send
      const data = {
        username: username, // Cleaned username
        preferences: trimmedPreferences, // Trimmed preferences
        action: "add", // Assuming "add" action; this can change based on your use case
      };

      console.log(data); // Check what you're sending

      // Make POST request with axios
      const response = await axios.post(
        "http://localhost:3002/tourist/updatePreferences",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      alert(response.data.message || "Preferences updated successfully!");
    } catch (err) {
      console.error("Error submitting preferences:", err);
      alert(`Failed to update preferences: ${err.message}`);
    }
  };

```
**BackEnd:**
``` js
app.post("/tourist/updatePreferences", async (req, res) => {
  const { username, preferences, action } = req.body;

  try {
    // Ensure username is provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Ensure preferences is an array
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: "Preferences must be an array" });
    }

    // Ensure action is either "add" or "remove"
    if (action !== "add" && action !== "remove") {
      return res
        .status(400)
        .json({ message: "Invalid action, must be 'add' or 'remove'" });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Handle adding or removing preferences
    for (let pref of preferences) {
      if (action === "add") {
        // Only add the preference if it is not already in the array
        if (!tourist.touristprefrences.includes(pref)) {
          tourist.touristprefrences.push(pref);
        }
      } else if (action === "remove") {
        // Remove the preference if it exists
        tourist.touristprefrences = tourist.touristprefrences.filter(
          (item) => item !== pref
        );
      }
    }

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({
      message: "Preferences updated successfully",
      prefrences: tourist.touristprefrences,
    });
  } catch (err) {
    console.error("Error updating preferences:", err);
    return res
      .status(500)
      .json({ message: "Server error while updating preferences" });
  }
});

```

### 14. Delete an account

**Description:** Allows admins to delete any account they wish.  
**Endpoint:** `DELETE /deleteAccount`  
**Request Body:**
```json
{
  "category": "tourist",
  "username": "john_doe123"
}

```

**Code Snippet (FrontEnd):**
``` js
 const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!username) {
      setError("Username is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.delete(
        "http://localhost:3002/deleteAccount",
        {
          data: { category, username },
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
        setUsername("");
        setCategory("seller");
      } else {
        setError("Failed to delete the account.");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("An error occurred while deleting the account.");
    } finally {
      setLoading(false);
    }
  };
```
**BackEnd:**
``` js
const deleteAccount = async (req, res) => {
  const { category, username } = req.body;

  // Validate input
  if (!category || !username) {
    return res
      .status(400)
      .json({ message: "Category and username are required." });
  }

  try {
    switch (category.toLowerCase()) {
      case "seller":
        // Delete Seller Account
        const seller = await SellerModel.findOneAndDelete({ username });
        if (!seller) {
          return res.status(404).json({ message: "Seller not found." });
        }
        // Delete all products created by the seller
        await productModel.deleteMany({ sellerUsername: username });
        break;

      case "tour guide":
        // Delete Tour Guide Account
        const tourGuide = await TourGuideModel.findOneAndDelete({ username });
        if (!tourGuide) {
          return res.status(404).json({ message: "Tour Guide not found." });
        }
        // Delete all itineraries created by the tour guide
        await ItineraryModel.deleteMany({ tourGuideName: username });
        break;

      case "tourism governor":
        // Delete Tourism Governor Account
        const tourismGovernor = await tourismGovernerModel.findOneAndDelete({
          username: username,
        });
        if (!tourismGovernor) {
          return res
            .status(404)
            .json({ message: "Tourism Governer not found." });
        }
        // Delete all historical places created by the governor
        await placeModel.deleteMany({ governorUsername: username });
        break;

      case "advertiser":
        // Delete Advertiser Account
        const advertiser = await AdvertiserModel.findOneAndDelete({ username });
        if (!advertiser) {
          return res.status(404).json({ message: "Advertiser not found." });
        }
        // Delete all activities created by the advertiser
        await ActivityModel.deleteMany({ advertiserUsername: username });
        break;

      case "guest":
        // Delete Guest Account
        const guest = await TouristModel.findOneAndDelete({ username });
        if (!guest) {
          return res.status(404).json({ message: "Guest not found." });
        }
        break;

      default:
        return res.status(400).json({ message: "Invalid category provided." });
    }

    res.status(200).json({
      message: `${category} account and associated data deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account." });
  }
};

app.delete("/deleteAccount", deleteAccount);

```

### 15. Archive a product

**Description:** Allows admins and sellers to archive a product makeing it unvisible for the tourists but not deleted of system.  
**Endpoint:** `PUT /unarchive/:id`  
**Request Body:**
```json
NONE
```


**Code Snippet (FrontEnd):**
``` js
const handleArchive = async (productId) => {
    try {
      await axios.put(`http://localhost:3002/archive/${productId}`);
      const updatedProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (error) {
      console.error("Error archiving product:", error);
    }
  };

```
**BackEnd:**
``` js
app.put("/archive/:id", async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to archive product" });
  }
});

```


# Installation

### Prerequisites
- [Express](https://expressjs.com/en/starter/installing.html)
- [Node.js](https://nodejs.org/en/download/)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [React](https://www.npmjs.com/package/react)
- [Git](https://www.npmjs.com/package/git)
- [Axios](https://www.npmjs.com/package/axios)
- [Postman](https://www.postman.com/downloads/)



### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Advanced-computer-lab-2024/Trip-Saviour-.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Trip-Saviour-
   ```
3. Navigate to the frontend directory:
   ```bash
   cd client
   ```
4. Install frontend dependencies:
   ```bash
   npm install
   ```
5. Navigate to the backend directory:
   ```bash
   cd server
   ```
6. Install backend dependencies:
   ```bash
   npm install
   ```
7. Start the server:
   ```bash
   node app.js
   ```
8. Start the application (in frontend directory/terminal):
   ```bash
   npm start
   ```

---

# How To Use

## 1. Tourist

### Step 1: Getting Started  
Follow these steps to begin your journey with our app:  
1. **Launch App**  
   - Open the app in your browser at http://localhost:3000.

2. **Register Your Account**  
   - Sign up using your email, username, password, mobile number, nationality, date of birth, and occupation.  
     > Note: Users under 18 cannot make bookings.  

3. **Log In**  
   - Log in using your registered username and password.  
   - Forgot your password? Recover it using an OTP sent to your registered email.  

---

### Step 2: Setting Up Your Profile  
1. Update your profile with details like name and contact information. Your wallet and username are not editable.    

---

### Step 3: Explore and Plan  
1. **Search Activities and Places**  
   - Use the search bar to find museums, historical places, activities, or itineraries by name, category, or tags.  

2. **Filter and Sort Options**  
   - Narrow your search by budget, preferences (e.g., beaches, historic areas), dates, or ratings.  
   - Sort results by price, ratings, or relevance.  

3. **View Recommendations**  
   - Check out curated itineraries, events, and activities tailored to your preferences.  

---

### Step 4: Booking and Payments  
1. **Book Activities or Itineraries**  
   - Browse through available options and book directly in the app.  
   - Pay securely using your wallet, credit/debit card (via Stripe) for eligible purchases.  

2. **Flight and Hotel Reservations**  
   - Use integrated third-party services to book flights and hotels effortlessly without redirection.  

3. **Manage Your Bookings**  
   - View all upcoming and past bookings in the **My Bookings** section.  

---

### Step 5: Notifications and Support  
1. **Stay Notified**  
   - Receive alerts for flagged events, upcoming bookings, or saved activities opening for bookings.  
   - Choose to receive notifications via email or directly in the app.  

2. **File Complaints**  
   - Navigate to the **Help & Support** section to report issues or seek assistance.  

3. **Track Your Wallet**  
   - Monitor your wallet for refunds, loyalty points, and redeemed rewards.

---
  
## 2. Tour Guide

### Step 1: Getting Started  
Follow these steps to begin your journey with our app:  
1. **Launch App**  
   - Open the app in your browser at http://localhost:3000.

2. **Register Your Account** 
   - Register using your username, email, and password.  
     - Upload necessary documents (e.g., ID, certificates, etc) for verification.  

3. **Log In**  
   - Log in using your registered username and password.  
   - Forgot your password? Recover it using an OTP sent to your registered email.  

---

### Step 2: Profile  
1. Update your profile with details like name, e-mail, age, mobile number, years of experience and previous work. Your username is not editable.
2. Change your password by inputting the old one then the new one.
3. Request account deletion if desired.

---

### Step 3: View and Create Itineraries
1. View your created itineraries
2. Create a new itinerary by adding all the needed information.
3. Edit any of your created itineraries.
4. Activate or deactivate any of your created itineraries.
5. Delete one of your itineraries if desired.

---

### Step 4: Sales and Contributors
1. View a sales report of all your itineraries and how much revenue they made.
2. Filter by name, date and month.
3. View a report of how many tourists have booked your itineraries, can be filtered by month.

---

## 3. Advertiser

### Step 1: Getting Started  
Follow these steps to begin your journey with our app:  
1. **Launch App**  
   - Open the app in your browser at http://localhost:3000.

2. **Register Your Account** 
   - Register using your username, email, and password.  
     - Upload necessary documents (e.g., ID, certificates, etc) for verification.  

3. **Log In**  
   - Log in using your registered username and password.  
   - Forgot your password? Recover it using an OTP sent to your registered email.

---

### Step 2: Profile  
1. Update your profile with details like e-mail, company name, website, hotline and company profile . Your username is not editable.
2. Change your password by inputting the old one then the new one.
3. Request account deletion if desired.

---

### Step 3: View and Create Activities
1. View your created activities
2. Create a new activity by adding all the needed information.
3. Edit one of your activities if desired.
4. Delete one of your activity if desired.

---

### Step 4: Sales and Contributors
1. View a sales report of all your activities and how much revenue they made.
2. Filter by name, date and month.
3. View a report of how many tourists have booked your activities, can be filtered by month.

---

### Step 5: Notifications  
1. **Stay Notified**  
   - Receive alerts for any of your activities if they have been flagged as inappropriate by an admin.
  
---
  
## 4. Seller

### Step 1: Getting Started  
Follow these steps to begin your journey with our app:  
1. **Launch App**  
   - Open the app in your browser at http://localhost:3000.

2. **Register Your Account** 
   - Register using your username, email, and password.  
     - Upload necessary documents (e.g., ID, certificates, etc) for verification.  

3. **Log In**  
   - Log in using your registered username and password.  
   - Forgot your password? Recover it using an OTP sent to your registered email.

---

### Step 2: Profile  
1. Update your profile with details like e-mail, name and description. Your username is not editable.
2. Change your password by inputting the old one then the new one.
3. Request account deletion if desired.

---

### Step 3: View and Create Products
1. View all products on the system.
2. Create a new product by adding all the needed information.
3. Edit one of your products if desired.
4. Archive one of your products if desired.
5. Filter your products based on price.
6. Search your products by name.
7. Sort your products by rating descendingly.

---

### Step 4: Sales
1. View a sales report of all your products and how much revenue they made.
2. Filter by name, date and month.
3. View a table of all products and the quantity sold from each one.

---

### Step 5: Notifications  
1. **Stay Notified**  
   - Receive alerts for any of your products if they are out of stock.
  
---

## 5. Tourism Governor

### Step 1: Getting Started  
Follow these steps to begin your journey with our app:  
1. **Launch App**  
   - Open the app in your browser at http://localhost:3000. 

2. **Log In**
   - Log in using an account created by an admin.
   - Log in using your registered username and password.  
   - Forgot your password? Recover it using an OTP sent to your registered email.
  
---

### Step 2: Profile
1. Request account deletion if desired.

---

### Step 3: View and Create Historical Places
1. View your created historical places.
2. Create a new historical place by adding all the needed information.
3. Edit any of your created historical places.
4. Delete one of your itineraries if desired.

---

## 6. Admin

### Step 1: Getting Started  
Follow these steps to begin your journey with our app:  
1. **Launch App**  
   - Open the app in your browser at http://localhost:3000. 

2. **Log In**
   - Log in using an account created by an admin.
   - Log in using your registered username and password.  
   - Forgot your password? Recover it using an OTP sent to your registered email.
  
---

### Step 2: View Users and Sales
1. The admin dashboard shows an overview of users that have joined the website, how many have joined in the past month and how many of each role.
2. View a sales report of itineraries, activities, products and their total revenue.
3. filter the sales report by name, date and month.

---

### Step 3: Create Users and Options
1. **Users**
   - Add a new admin or tourism governor to the website by inputting their username, email and password.
2. **Options**
   - Add, edit and delete categories and preferences.
   - Add a new promocode by entering the promocode, discount, expiry date and usage limit.

---

### Step 4: View Documents
1. View the uploaded documents of Tour Guides, Sellers and Advertisers.

---

### Step 5: View Complaints
1. View complains made by tourists.
2. Sort by date or status (pending or resolved)
3. View details of a complaint and reply to it if desired.
4. Set complaint as resolved or pending.

---

### Step 6: Products
1. **View and Create**
   - View all products on the system.
   - Create a new product by adding all the needed information.
   - Archive one of your products if desired.
   - Search your products by name.
2. **View and Create**
   - View each product, the quantity that has been sold and the sales of that product.

---

### Step 7: Delete Users
1. Search for a specific user and their role and delete them.
2. View a table of deletion requests and accept or reject them.

---

### Step 8: Flag Events
1. View all Itineraries and activities and choose to flag or unflag them.

---

### Step 9: Profile
1. Change your password by inputting the old one then the new one.

---

### Step 10: Notifications  
1. **Stay Notified**  
   - Receive alerts for any products if they are out of stock.
---



#  API Refrences

The backend power the Virtual Trip Planner. Here's an example of an endpoint:

### 1) Flight Booking
Get flight offers from Amadeus API.

**Endpoint:**
```http
GET https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&adults=${adults}&max=${maxResults}```
```
### 2) Hotel Booking
Find hotels by city from Amadeus API.

**Endpoint:**
```http
GET https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}
```

### 3) Stripe Payment Integration
Integrate payments using Stripe.

**Endpoint:**
```http
POST http://localhost:3002/create-checkout-session
```
### 4) Exchange Rate 
Get real-time currency exchange rates from exchangerate-.com.

**Endpoint:**
```http
GET https://.exchangerate-.com/v4/latest/{base-currency}
```
### 5) Update Activity 
Find and update the activity
- **Method:** PUT
- **Endpoint:**
`/wael/activities/:name`

 ### 6) File Complaint
Tourist file a complaint with title, body (problem) and date
- **Method:** POST
- **Endpoint:**
`/api/file-complaint`

 ### 7) Retrieve Itineraries
Retrieve all itineraries for tourist and guests
- **Method:** GET
- **Endpoint:**
`/itinerary`

  ### 8) Tourism Governor Login
Allow tourism governor to login 
- **Method:** POST
- **Endpoint:**
`/tourism-governor/login`

  ### 9) TourGuide Profile Creation
Create profile with my information as a tour guide including mobile number, years of experience, previous work(if exists), etc.. if accepted as a tour guide on the system
- **Method:** POST
- **Endpoint:**
`/tour_guide`

  ### 10) Fetch TourGuide Profile
Fetch all info about tourguide 
- **Method:** GET
- **Endpoint:**
`/tour_guide`

 ### 11) Create Prefences
Create preference tags (historic areas, beaches, family-friendly, shopping, budget-friendly)
- **Method:** POST
- **Endpoint:**
`/preferences`

 ### 12) Filter Historical Places by Tags
Filter Historical places by selected tags 
- **Method:** GET
- **Endpoint:**
`GET /filterHistoricalPlaces`

 ### 13) Search for product by name 
Retrieve product with specific name 
- **Method:** GET
- **Endpoint:**
`/ProductByName`

 ### 14) Filter Product by price 
Retrieve product with specific price 
- **Method:** GET
- **Endpoint:**
`/FilterProductByPrice`


 ### 15) Retrieve upcoming activities
Get all upcoming activities for tourists nand guests
- **Method:** GET
- **Endpoint:**
`/getUpcomingActivities`

 ### 16) Retrieve upcoming itineraries
Get all upcoming itineraries for tourists nand guests
- **Method:** GET
- **Endpoint:**
`/getUpcomingItenraries`

 ### 17) Delete accounts
Admin delete accounts off system
- **Method:** Delete
- **Endpoint:**
`/deleteAccount`

 ### 18) Seller Change Password 
Seller Update his password
- **Method:** PUT
- **Endpoint:**
`/sellers/change-password`

 ### 19) Archived Products 
View all archieved products 
- **Method:** GET
- **Endpoint:**
`/archived-products`

 ### 20) Activate Itinerary

- **Method:** PUT
- **Endpoint:**
`/itinerary/:id/activate`

# Tests

To test the backend routes for the following, you can use Postman. Below are some examples:

### Create a New Activity
- **Method:** POST
- **Endpoint:** `/wael/activities`
- **Headers:** `Content-Type: application/json`
- **Body:** 
  ```json
  {
    "name": "Hiking Adventure",
    "description": "A thrilling hike through the mountains.",
    "location": "Rocky Mountains",
    "date": "2024-12-15",
    "price": 50
  }


### Response Body

1. **Success Response:**
   - **Status Code:** `201 Created`
   - **Response Body:**
     ```json
     {
       "message": "Activity created successfully",
       "activity": {
         "_id": "unique-activity-id",
         "name": "Hiking Adventure",
         "description": "A thrilling hike through the mountains.",
         "location": "Rocky Mountains",
         "date": "2024-12-15T00:00:00.000Z",
         "price": 50,
         "createdAt": "2024-12-08T12:00:00.000Z",
         "updatedAt": "2024-12-08T12:00:00.000Z",
         "__v": 0
       }
     }
     ```

2. **Error Responses:**

   - **Missing Required Fields:**
     - **Status Code:** `400 Bad Request`
     - **Response Body:**
       ```json
       {
         "error": "Name, description, location, date, and price are required."
       }
       ```

   - **Server Error:**
     - **Status Code:** `500 Internal Server Error`
     - **Response Body:**
       ```json
       {
         "error": "Error creating activity"
       }
       ```



### Filter Historical Places by Tags
- **Method:** GET
- **Endpoint:** `GET /filterHistoricalPlaces`
- **Headers:** `Content-Type: application/json`
- **Description:** Fetches historical places filtered by specified tags. Tags can be provided as a comma-separated list.

- **Query Parameters:**
  - `tags` (optional): A comma-separated list of tags for filtering (e.g., `Museum,Castle`).
- **Body:** 
  ```json
  {
    "_id": "unique-id-1",
    "name": "National History Museum",
    "description": "Explore the country's rich history.",
    "location": "Downtown",
    "historicalSignificance": "An iconic historical landmark.",
    "entryFeeForeign": 250,
    "entryFeeNative": 200,
    "entryFeeStudent": 150,
    "openingHours": "9:00 AM - 6:00 PM",
    "pictures": ["image1.jpg", "image2.jpg"],
    "category": "Museum",
    "tags": ["Museum", "History"],
    "type": "Museum",
    "governorUsername": "governor1",
    "governorId": "gov-id-1",
    "createdAt": "2024-12-01T00:00:00.000Z",
    "updatedAt": "2024-12-01T00:00:00.000Z"
  }


### Update Itinerary by ID
- **Method:** PUT
- **Endpoint:** `PUT /itinerary/:id`
- **Description:** Updates the details of an itinerary by its unique ID. If the itinerary is flagged, a notification email is sent to the associated tour guide.
- **Path Parameters:**
  - `id` (required): The unique ID of the itinerary to update.
- **Request Body:**
  ```json
  {
    "Itinerary_Name": "Cultural City Tour",
    "tourGuideName": "JohnDoe",
    "activities": [
      { "time": "10:00 AM", "name": "Museum Visit" },
      { "time": "12:00 PM", "name": "Lunch at City Square" }
    ],
    "preferences": ["History", "Walking"],
    "locationToBeVisited": ["City Museum", "Old Town"],
    "languageOfTour": "English",
    "price": 50,
    "date_time": "2024-12-15T10:00:00Z",
    "accessibility": ["Wheelchair Accessible"],
    "pickupLocation": "Hotel Lobby",
    "dropoffLocation": "Hotel Lobby",
    "booked": true,
    "rating": 4.5,
    "isFlagged": true,
    "bookedBy": ["User123", "User456"]
  }

### How to Test the previous with Postman
- Set Method: PUT
- Set URL: http://<your-server-url>/itinerary/:id (Replace :id with a valid itinerary ID)
- Set Headers:
- Content-Type: application/json
- Set Body: Use the example JSON in the Request Body section.
- Click Send: Verify the updated itinerary in the response.



### Register Seller
- **Method:** `POST`
- **Endpoint:** `POST /registerSellerReg`
- **Description:** Registers a new seller with the required information and document uploads. The seller's status is set to "Pending" by default.
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body (Form-Data):**
  - **Fields:**
    - `username` (string, required): Unique username for the seller.
    - `email` (string, required): Unique email address for the seller.
    - `password` (string, required): Seller's password (should be hashed in production).
    - `idSellerProof` (file, required): Upload for seller's ID proof.
    - `taxationRegisteryCard` (file, required): Upload for seller's taxation registry card.

#### Example Form-Data in Postman:
- **Key:** `username`
  - **Value:** `sellerUser`
- **Key:** `email`
  - **Value:** `seller@example.com`
- **Key:** `password`
  - **Value:** `securePassword123`
- **Key:** `idSellerProof`
  - **Value:** Upload file (e.g., `idProof.jpg`)
- **Key:** `taxationRegisteryCard`
  - **Value:** Upload file (e.g., `taxCard.jpg`)


### Expected Response

#### Success Response:
- **Status Code:** `201 Created`
- **Response Body:**
  ```json
  {
    "message": "Seller registered successfully",
    "data": {
      "_id": "unique-id",
      "username": "sellerUser",
      "email": "seller@example.com",
      "name": "placeholder",
      "description": "placeholder",
      "documents": {
        "idSellerProof": "/path/to/idProof.jpg",
        "taxationRegisteryCard": "/path/to/taxCard.jpg"
      },
      "status": "Pending",
      "revenue": 0
    }
  }
  

### Create a New Promo Code
- **Method:** POST
- **Endpoint:** `/api/promo-code`
- **Headers:** `Content-Type: application/json`
- **Body:** 
  ```json
  {
    "code": "TESTCODEeeee",
    "discount": 10,
    "expiryDate": "2023-12-31"
  }

  ```

### Response Body
   - **Status Code:** `201 Created`
   - **Response Body:**
     ```json
     {
        "message": "Promo code created successfully",
        "promoCode": {
          "code": "TESTCODEeeee",
          "discount": 10,
          "expiryDate": "2023-12-31T00:00:00.000Z",
          "usageLimit": 1,
          "timesUsed": 0,
          "isActive": true,
          "_id": "unique-promo-code-id"
      }

### File a Complaint
- **Method:** POST
- **Endpoint:** `/api/file-complaint`
- **Headers:** `Content-Type: application/json`
- **Body:** 
  ```json
  {
    "complaint": "Test complaint"
  }


### Response Body
   - **Status Code:** `201 Created`
   - **Response Body:**
     ```json
      {
        "message": "Complaint filled successfully",
        "complaint": {
          "Status": "Pending",
          "Reply": "",
          "_id": "676341258a7df9660aaeec5",
          "createdAt": "2024-12-18T21:39:49.166Z",
          "updatedAt": "2024-12-18T21:39:49.166Z",
          "_v": 0
        }
      }
    


### Get All Complaints
- **Method:** GET
- **Endpoint:** `/complaints`
- **Headers:** `Content-Type: application/json`
- **Response Body:**
 ```json
 [
   {
     "_id": "6727f2c5f65cd8bb82624287",
     "TouristID": "6727638ed5006ac104996038",
     "Title": "complaint",
     "Body": "this is a complain",
     "Status": "Pending",
     "createdAt": "2024-11-03T22:01:41.310Z",
     "updatedAt": "2024-12-04T15:25:09.011Z",
     "_v": 0,
     "Reply": "hi"
   }
 ]

```
### Generate Share Link
- **Method:** POST
- **Endpoint:** `/api/share/email`
- **Headers:** `Content-Type: application/json`
- **Body:** 
 ```json
 {
   "link": "http://localhost:3000/share/test/123"
 }

 ```

### Response Body
   - **Status Code:** `500 Internal Server Error`
   - **Response Body:**
     ```json
     {
      "message": "Failed to send email",
      "error": "Invalid login: 535-5.7.8 Username and Password not accepted."
     }

     ```

### Get Account Deletion Requests
- **Method:** GET
- **Endpoint:** `/requests`
- **Headers:** `Content-Type: application/json`
- **Response Body:**
 ```json
 [
   {
     "_id": "672da76cf5e70c6771a04b40",
     "Username": "mo",
     "status": "accepted",
     "requestDate": "2024-11-08T05:53:48.879Z",
     "__v": 0,
     "responseDate": "2024-12-0410:36:00.227Z",
   }
 ]
```
### Get All Activities
- **Method:** GET
- **Endpoint:** `/activities`
- **Headers:** `Content-Type: application/json`
- **Response Body:**
 ```json
 [
   {
        "pictures": [],
        "_id": "670196ad92a61f69e94f1821",
        "name": "Mountain Hiking Tour 32",
        "date": "2024-05-10T08:00:00.000Z",
        "time": "08:00 AM",
        "location": "Rocky Mountains",
        "price": 100,
        "category": "Tour",
        "tags": [
            "hiking",
            "adventure",
            "nature"
        ],
        "specialDiscounts": "10% for students",
        "bookingOpen": true,
        "rating": 4,
        "__v": 9,
        "bookedBy": [
            "reem20"
        ],
        "AllRatings": [
            5,
            3,
            4,
            4
        ],
        "isFlagged": true,
        "comments": [
            "Activity fager",
            "Activity fager 2",
            "Activity fager 3",
            "Activity fager 4",
            "Activity fager 5"
        ],
        "interestedUsers": [
            "g3"
        ]
    }
 ]
```
### Test Login
- **Method:** POST
- **Endpoint:** `/tourism-governor/login`
- **Headers:** `Content-Type: application/json`
- **Request Body**
   ```json
    [
      {
        "username": "tourismgovernortest",
        "Password": "tourismgovernortest"
      }
    ] 
- **Response Body:**
  ```json
      [
        {
        "message": "Login successful",
        "tourismGovernor": {
          "_id": "674f7b2c0f349fc36ef92975",
          "username": "tourismgovernortest",
          "Password": "tourismgovernortest",
          "createdAt": "2024-12-03T21:42:04.705Z",
          "updatedAt": "2024-12-03T21:42:04.705Z",
          "__v": 0
          }
        }
      ]
  ```
### Test Get Profile
- **Method:** GET
- **Endpoint:** `/tourist/profile/{username}`
- **Headers:** `Content-Type: application/json`
- **Response Body:**
  ```json
  [
    {
    "_id": "66ffb0c6d2da3bfec50f585c",
    "email": "hisham.ahmedy6u718@gmail.com",
    "username": "Ahmed",
    "mobileNumber": "1234567892",
    "nationality": "egyptian",
    "date_of_birth": "2000-12-16T00:00:00.000Z",
    "work_status": "teacher",
    "__v": 231,
    "attendedActivities": [],
    "savedItineraries": [],
    "interestedActivities": []
    }
  ]
  ```

### Test Create Itinerary
- **Method:**  POST
- **Endpoint:** `/itinerary`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  [
    {
    "Itinerary_Name": "test",
    "tourGuideName": "tourAbdo12",
    "activities": "",
    "preferences": "budget",
    "locationToBeVisited": "cairo",
    "timeline": "",
    "durationOfActivity": "",
    "languageOfTour": "english",
    "price": "500",
    "date_time": "2024-12-22T21:15:00.000+00:00",
    "accessibility": "",
    "pickupLocation": "cairo",
    "dropoffLocation": "cairo",
    "booked": true,
    "rating": "3",
    "isFlagged": false
    }

  ]

- **Response Body:**
  ```json
  [
    {
    "Itinerary_Name": "test",
    "tourGuideName": "tourAbdo12",
    "activities": "",
    "preferences": "budget",
    "locationToBeVisited": "cairo",
    "timeline": "",
    "durationOfActivity": "",
    "languageOfTour": "english",
    "price": "500",
    "date_time": "2024-12-22T21:15:00.000+00:00",
    "accessibility": "",
    "pickupLocation": "cairo",
    "dropoffLocation": "cairo",
    "booked": true,
    "rating": "3",
    "isFlagged": false
  }

  ]
  ```
### Activate Itinerary
- **Method:** PUT
- **Endpoint:** `/itinerary/:id/activate`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
id (string): The unique identifier of the itinerary to be activated.
  
- **Response Body:**
 ```json
 [
  {
  "message": "Itinerary activated successfully",
  "itinerary": {
    "_id": "670196ad92a61f69e94f1821",
    "name": "Mountain Hiking Tour",
    "active": true,
    "booked": false,
  
  }
}


 ]
```
### Remove From Wishlist
- **Method:** DELETE
- **Endpoint:** `/tourists/removeFromWishlist/:id`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
 {
  "productId": "product123"
}


- **Response Body:**
 ```json
 [
   {
  "message": "Product removed from wishlist successfully",
  "wishList": []
}


 ]
```
**Our app has many other routes that can be tested with Postman, so we decided to summarize and use different methods with different objects and user types!**
---

# Roadmap

- [x] Basic itinerary generation
- [x] Integration with travel APIs
- [ ] Social media sharing
- [ ] Enhanced multi-language support

---

## Contributing

Contributions are welcome! Here's how to contribute:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add YourFeature"
   ```
4. Push the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Submit a pull request.

---
# Credits

This project was a collaborative effort by a team of 10 Media Engineering students under the guidance of Dr. Mervat Abu-Elkheir, the course professor.

The team was led by Engineer Hadwa Pasha, who served as the product manager, ensuring smooth coordination and alignment of the project goals.

Team Members:

- Nourhan Ibrahim
- Karim Elesseily
- Abdelrahman Zidan 
- Seif Khaled
- Ahmed Hisham
- Maya Ahmed
- Ahmed Ashoub
- Mohamed Wael
- Reem Mohamed
- Mohamed Elsherif

### Resources
- [Resource 1](https://nodejs.org/en/download/)
- [Resource 2](https://www.mongodb.com/try/download/community)
- [Resource 3](https://uiverse.io/)
- [Resource 4](https://getbootstrap.com/)
- [Resource 5](https://www.mongodb.com/try/download/community)

---

# License

This project utilizes several third-party tools and s, each with its own licensing terms:

- **Stripe CLI:** Licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Permits use, modification, and distribution under the license terms.

- **Nodemailer:** Licensed under the [MIT License](https://nodemailer.com/about/license/).
- **Google Maps Platform:** Usage is subject to [Google's Terms of Service](https://developers.google.com/maps/terms-20180207).
- **Amadeus :** Access requires signing the Amadeus  license agreement. For more information, visit the [Amadeus  Certification Procedure](https://.dev.amadeus.net//Marketing/UserLab/CertificationProcedure.htm).

Please ensure compliance with each license when using these tools and s.

---

# Contact

- **Nourhan Ibrahim**: [LinkedIn](http://linkedin.com/in/nourhan-ibrahim-4243a0294) | [Email](mailto:nourhanmorad8@gmail.com)
- **Project Repository**: [GitHub Repo](https://github.com/Advanced-computer-lab-2024/Trip-Saviour-.git)

---
