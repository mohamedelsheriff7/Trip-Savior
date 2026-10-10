// src/App.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import SideBarTourist from "./components/Navigation/SideBarTourist.js";
import Login from "./components/Login";
import Loginalt from "./components/LandingPage/Login-alt.js";
import CheckOutCart from "./components/CheckOutPage.js";
import Profile from "./components/Profile";
import CreateProfile from "./components/CreateProfile";
import ProfileCreationSuccess from "./components/ProfileCreationSuccess";
import ReadTourGuideProfile from "./components/ReadTourGuideProfile";
import UpdateTourGuideProfile from "./components/UpdateTourGuideProfile";
import CreateItinerary from "./components/CreateItinerary";
import ReadItinerary from "./components/ReadItinerary";
import Registration from "./components/Registration"; // Import the Registration component
import LandingPage from "./components/LandingPage";
import SelectRole from "./components/SelectRole";
import SellerLogin from "./components/SellerLogin";
import SellerProfile from "./components/SellerProfile";
import CreateSellerProfile from "./components/CreateSellerProfile"; // Adjust according to your component
import CreateSellerSuccess from "./components/CreateSellerSuccess";
import ItineraryView from "./components/ItineraryView";
import TouristItinerary from "./components/Profile/TouristItineraries.js";
import ReadSellerProfile from "./components/ReadSellerProfile";
import UpdateSellerProfile from "./components/UpdateSellerProfile";
import ViewProduct from "./components/ViewProduct";
import TouristLogin from "./components/TouristLogin"; // Updated import
import TouristProfile from "./components/TouristProfile"; // Updated import
import ReadTouristProfile from "./components/ReadTouristProfile";
import UpdateTouristProfile from "./components/UpdateTouristProfile";
import Search from "./components/search";
import CreatePreference from "./components/CreatePreference";
import ManagePreferences from "./components/ManagePreferences";
import EditProductss from "./components/EditProductss";
import AdvertiserLogin from "./components/AdvertiserLogin";
import AdvertiserProfile from "./components/advertiser/AdvertiserProfile";
import CreateAdvertiserProfile from "./components/CreateAdvertiserProfile";
import ReadAdvertiserProfile from "./components/ReadAdvertiserProfile";
import UpdateAdvertiserProfile from "./components/UpdateAdvertiserProfile";
import ChangePassword from "./components/ChangePassword"; // Adjust the path as needed
import SellerChangePassword from "./components/SellerChangePassword";
import AdminChangePassword from "./components/AdminChangePassword";
import AdvertiserChangePassword from "./components/AdvertiserChangePassword";
import TouristChangePassword from "./components/Profile/TouristChangePassword.js";
import TouristComplaints from "./components/TouristComplaints.js";
import TourismGovernorChangePassword from "./components/TourismGovernorChangePassword";
import UpcomingActivities from "./components/viewUpcomingActivities";
import UpcomingItineraries from "./components/viewUpcomingItenraries";
import HistoricalPlaces from "./components/LandingPage/viewHistoricalPlace.js";
import Itineraries from "./components/itineraries";
import Itineraries2 from "./components/itinerariesGuest.js";
import ActivityF from "./components/ActivityF";
import ActivityGuest from "./components/LandingPage/activityGuest.js";
import HistoricalPlacess from "./components/HistoricalPlaces";
import ArchivedProducts from "./components/ArchivedProducts";
import TourismGovernorLogin from "./components/tourismGovernor/tourismGovernorLogin.js";
import AdminPage from "./components/AdminPage";
import AdminNav from "./components/adminNav";
import Admins from "./components/Admins.js";
import Preferences from "./components/Preferences.js";
import TourismGoverners from "./components/TourismGoverners.js";
import Categories from "./components/Categories.js";
import Products from "./components/Products.js";
import AdminDeleteAccount from "./components/adminDeleteAccountH.js";
import AdminLogin from "./components/AdminLogin.js";
import AdminViewDocuments from "./components/AdminViewDocuments.js";
import AdminComplaints from "./components/AdminComplaints.js";
import DocumentViewer from "./components/DocumentsTest.js";
import TouristHistoricalPlaces from "./components/TouristHistoricalPlaces.js";
import TouristHistoricalPlaces2 from "./components/Profile/TouristHistoricalPlaces.js";
import AdminFinalProfile from "./components/AdminFinalProfile.js";
///////////////////////////////////////////////////////////////////////////////////////////
import HistoricalPlacesSearch from "./components/tourismGovernor/getHistoricalPlacesByName";
import CreateTagsForHistoricalPlace from "./components/tourismGovernor/createTags";
import HistoricalPlacesPage from "./components/tourist-guest/historicalPlacesPage";
// import HistoricalPlacesByUsername from "./components/tourismGovernor/getCreatedHistoricalPlaces";
// import ItinerariesByUsername from "./components/tourGuide/tourGuideGetItenararies";
// import ItineraryView from "./components/tourGuide/ItineraryView";
import HistoricalPlacesView from "./components/tourismGovernor/getCreatedHistoricalPlaces";
import CreateActivity from "./components/advertiser/CreateActivity";
import DeleteActivity from "./components/advertiser/DeleteActivityButton.js";
import EditActivity from "./components/advertiser/EditActivity";
import ActivitiesView from "./components/advertiser/advertiserGetActivity";
import ReadActivities from "./components/advertiser/ActivitiesList";
import TermsAndConditions from "./components/termsAndCond.js";
import BookedItineraries from "./components/bookedItineraries.js";
import BookedActivities from "./components/bookedActivities.js";
import CreateHistoricalPlace from "./components/tourismGovernor/createHistoricalPlace.js";
//import AccountDeletionRequest from "./components/deleteAcc.js";
import FileComplaint from "./components/FileComplaint";
import AdminFlag from "./components/ActivityandItinerary.js";
import UserStats from "./components/UserStats";
import RateCommentItinerary from "./components/RateCommentItineraryTourguide.js";
import AccountDeletionRequest from "./components/deleteAcc.js";
import ActivityDetail from "./components/ActivityDetail";
import HistoricalPlaceDetail from "./components/HistoricalPlaceDetail";
import ItineraryDetail from "./components/ItineraryDetail";
import AttendedActivities from "./components/TouristAttendedActivities.js";
import LoginFinal from "./components/LoginFinal.js";
import ItinerariesGuest2 from "./components/ItinerariesGuest2.js";

import ViewSavedItineraries from "./components/ViewSavedItineraries";
import ViewSavedActivities from "./components/ViewSavedActivities";

import MyPromoCodes from "./components/MyPromoCodes"; // Import the component
import ProductAdminSellerPage from "./components/ProductAdminSellerPage.js";
import AdvertiserDocument from "./components/AdvertiserViewDocument.js";
import CreatePromoCode from "./components/CreatePromoCode"; // Import the new component
import ActivityFlaggedDetails from "./components/ActivitiesFlaggedDetails.js"; // Adjust the path as necessary

///////////////////////////////////////////////////////////////////////////////////////////
import TouristPurchases from "./components/TouristPurchases";
import TouristProfile2 from "./components/Profile/ViewProfile";
import ItineraryDetails from "./components/Profile/ItineraryDetails.js";
import TouristActivities from "./components/Profile/TouristActivities.js";
import ActivityDetails from "./components/Profile/ActivityDetails.js";
import ViewItinerariesGuest from "./components/LandingPage/ViewItinerariesGuest.js";
import ActivityGuestDetails from "./components/LandingPage/ActivityGuestDetails.js";
import ItineraryGuestDetails from "./components/LandingPage/ItineraryGuestDetails.js";
import ViewHistoricalPlacesGuest from "./components/LandingPage/ViewHistoricalPlacesGuest.js";
import ViewHPGuestDetails from "./components/LandingPage/ViewHPGuestDetails.js";
import TouristHPDetails from "./components/Profile/TouristHPDetails.js";
import TouristProductDetails from "./components/Profile/TouristProductDetails.js";
import TouristBookedItineraries from "./components/Profile/TouristBookedItineraries.js";
import TouristBookedActivities from "./components/Profile/TouristBookedActivities.js";
import TouristBookedFlights from "./components/Profile/TouristBookedFlights.js";
import TouristBookedHotels from "./components/Profile/TouristBookedHotels.js";
import TouristBookedTransport from "./components/Profile/TouristBookedTransport.js";
import BookmarkItinerary from "./components/Profile/BookmarkItinerary.js";

////////////////tourguide////////////////////////////////////////
import TourGuideItineraries from "./components/tourGuide/TourGuideItineraries.js";
import TGItineraryDetails from "./components/tourGuide/TGItineraryDetails.js";
import TGCreateItinerary from "./components/tourGuide/TGCreateItinerary.js";
import TGUpdateItinerary from "./components/tourGuide/TGUpdateItinerary.js";
import ViewHPTourismDetails from "./components/TourismGovernorHistoricalPlacesdetails.js";
import TourGuideProfile from "./components/tourGuide/TourGuideProfile.js";
import CreatedHistoricalPlacesView from "./components/TourismGovervorProfile.js";
//import CustomNavbar from "./components/CustomNavbar";
import FlightSearch from "./components/booking/fetchFlights.js";
import HotelSearch from "./components/booking/bookHotel.js";
import BookTransportation from "./components/tourist-guest/bookTransportation.js";
import ProductDetailsPage from "./components/ViewProductDetails.js";
import SuccessPage from "./components/tourist-guest/successPage.js";

import Cart from "./components/TouristCart.js";
import Wishlist from "./components/TouristWishList.js";
import ProductTouristPage from "./components/Profile/ProductTouristPage.js";
import TouristActivity from "./components/TouristActivity.js";
import SellerFinalProfile from "./components/SellerFinalProfile.js";
import SellerProductPage from "./components/SellerProductPage.js";
import AdvertiserFinalProfile from "./components/advertiser/AdvertiserFInalProfile.js";
import ForgotPassword from "./components/LandingPage/forgotPassword.js";
import OtpVerification from "./components/otpVerification.js";
import ResetPassword from "./components/Profile/ResetPassword.js";
import RevReportT from "./components/RevenueReport.js";
import RevReportA from "./components/RevenueReportAd.js";
import TouristReportA from "./components/TotalusersAdv.js";
import TourGuideReport from "./components/TotalusersIti.js";
import SalesReportS from "./components/RevReportS.js";
import SalesReport from "./components/SalesReport.js";
import SellerQuantitySales from "./components/SellerSalesTable.js";
// Inside your routes
import AdminProductPage from "./components/AdminSalesTable.js";
import TourGuideDocument from "./components/TourGuideDocuments.js";
import SellerViewDocument from "./components/SellerViewDocument.js";
import TourGuideFinalProfile from "./components/TourGuideFinalProfile.js";

import Orders from "./components/TouristOrderr.js";
import ItineraryFlagedDetails from "./components/ItineraryFlagedDetails"; // Import the new component
import AdvertiserActivityDetails from "./components/advertiser/AdvertiserActivityDetails.js";
import ProductTouristRate from "./components/Profile/ProductTouristRate.js";
import AdminSellerProductDetails from "./components/AdminSellerproductsdetails";
import StepByStep from "./components/tourist-guest/StepByStep.js";
import SelectPreferences from "./components/TouristPrefrences";
import UpdateHistoricalPlace from "./components/tourismGovernor/updateHistoricalPlace.js";


const Navigation = () => {
  const location = useLocation();

  const renderAdditionalLinks = () => {
    if (location.pathname === "/") {
      return (
        <>
          {/* <Link to="/itineraries2">Itineraries</Link> |{" "}
          <Link to="/historical-places">Historical Places</Link> |{" "}
          <Link to="/activities2">Activities</Link> |{" "} */}
        </>
      );
    }
    return null;
  };

  return (
    <nav>
      {/* <Link to="/">Home</Link> */}
      {renderAdditionalLinks()}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <Navigation /> {/* Navigation is now inside Router */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tourist-sidebar" element={<SideBarTourist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route
          path="/tourguide-finalprofile"
          element={<TourGuideFinalProfile />}
        />
        <Route
          path="/profile-creation-success"
          element={<ProfileCreationSuccess />}
        />
        <Route
          path="/tourist-historical-places"
          element={<TouristHistoricalPlaces />}
        />
        <Route
          path="/read-tour-guide-profile"
          element={<ReadTourGuideProfile />}
        />
        <Route path="/create-promo-code" element={<CreatePromoCode />} />
        <Route
          path="/update-tour-guide-profile"
          element={<UpdateTourGuideProfile />}
        />
        <Route path="/adv-viewdocuments" element={<AdvertiserDocument />} />
        <Route path="/seller-viewdocuments" element={<SellerViewDocument />} />
        <Route
          path="/tourguide-viewdocuments"
          element={<TourGuideDocument />}
        />
        <Route
          path="/admin-productsales-table"
          element={<AdminProductPage />}
        />
        <Route path="/create-itinerary" element={<CreateItinerary />} />
        <Route path="/read-itinerary" element={<ReadItinerary />} />
        <Route path="/itineraries-guest" element={<ItinerariesGuest2 />} />
        <Route path="/adminfinalprofile" element={<AdminFinalProfile />} />
        <Route path="/adminsellerproduct2" element={<SellerProductPage />} />
        <Route
          path="/adminsellerproduct"
          element={<ProductAdminSellerPage />}
        />
        <Route path="/register" element={<Registration />} />{" "}
        {/* Add this line for the registration route */}
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/seller-profile" element={<SellerProfile />} />
        <Route
          path="/create-seller-profile"
          element={<CreateSellerProfile />}
        />
        <Route
          path="/create-seller-success"
          element={<CreateSellerSuccess />}
        />
        <Route path="/view_itinerary" element={<ItineraryView />} />
        <Route path="/read-seller-profile" element={<ReadSellerProfile />} />
        <Route
          path="/update-seller-profile"
          element={<UpdateSellerProfile />}
        />
        <Route
          path="/view-products-details/:id"
          element={<ProductDetailsPage />}
        />
        <Route path="/view-products" element={<ViewProduct />} />
        <Route path="/tourist-login" element={<TouristLogin />} />
        <Route path="/tourist-profile" element={<TouristProfile />} />
        <Route path="/tourist-complaints" element={<TouristComplaints />} />
        <Route path="/read-tourist-profile" element={<ReadTouristProfile />} />
        <Route
          path="/update-tourist-profile"
          element={<UpdateTouristProfile />}
        />
        <Route path="/search" element={<Search />} />
        <Route path="/create-preference" element={<CreatePreference />} />
        <Route path="/manage-preference" element={<ManagePreferences />} />
        <Route path="/edit-products" element={<EditProductss />} />
        <Route path="/advertiser-login" element={<AdvertiserLogin />} />
        <Route path="/advertiser-profile" element={<AdvertiserProfile />} />
        <Route
          path="/create-historicalplace"
          element={<CreateHistoricalPlace />}
        />
        <Route
          path="/create-advertisement"
          element={<CreateAdvertiserProfile />}
        />
        <Route
          path="/view-advertisements"
          element={<ReadAdvertiserProfile />}
        />
        <Route
          path="/update-advertiser-profile"
          element={<UpdateAdvertiserProfile />}
        />
        <Route
          path="/view-upcoming-itenraries"
          element={<UpcomingItineraries />}
        />
        <Route path="/view-products" element={<ViewProduct />} />
        <Route path="/login-alt" element={<Loginalt />} />
        <Route path="/view-historicalPlaces" element={<HistoricalPlaces />} />
        <Route path="/edit-products" element={<EditProductss />} />
        <Route path="/view-upcoming-activities" element={<ActivityGuest />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/itineraries2" element={<Itineraries2 />} />
        <Route path="/historical-places" element={<HistoricalPlacess />} />
        <Route path="/activities" element={<ActivityF />} />
        <Route path="/activities2" element={<ActivityGuest />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-nav" element={<AdminNav />} />
        <Route path="/admins" element={<Admins />} />
        <Route path="/admin-view-documents" element={<AdminViewDocuments />} />
        <Route path="/admin-complaints" element={<AdminComplaints />} />
        <Route path="/documents-test" element={<DocumentViewer />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/tourism-governers" element={<TourismGoverners />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin-delete-account" element={<AdminDeleteAccount />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/sellerchange-password"
          element={<SellerChangePassword />}
        />
        <Route
          path="/advertiserchange-password"
          element={<AdvertiserChangePassword />}
        />
        <Route
          path="/tourist-change-password"
          element={<TouristChangePassword />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/tourist-itinerary" element={<TouristItinerary />} />
        <Route path="/guest-itinerary" element={<ViewItinerariesGuest />} />
        <Route path="/tourist-profile2" element={<TouristProfile2 />} />
        <Route path="/activity-guest/:id" element={<ActivityGuestDetails />} />
        <Route
          path="/itinerary-guest/:id"
          element={<ItineraryGuestDetails />}
        />
        <Route
          path="/tourismGovernor/changePassword"
          element={<TourismGovernorChangePassword />}
        />
        <Route path="/admin-changepassword" element={<AdminChangePassword />} />
        <Route path="/view-itinerary" element={<ItineraryView />} />
        <Route path="/archived-products" element={<ArchivedProducts />} />
        <Route path="/admin-flag" element={<AdminFlag />} />
        <Route path="/booked-itineraries" element={<BookedItineraries />} />
        <Route path="/activities" element={<ActivityF />} />
        <Route path="/booked-activities" element={<BookedActivities />} />
        <Route
          path="/users/request-deletion"
          element={<AccountDeletionRequest />}
        />
        <Route path="/delete-reqs" element={<AccountDeletionRequest />} />
        <Route
          path="/request-account-deletion"
          element={<AccountDeletionRequest />}
        />
        <Route
          path="/tourism-governor-login"
          element={<TourismGovernorLogin />}
        />
        <Route ////////////////////////////////////////////////////////////////
          path="/search-historical-places"
          element={<HistoricalPlacesSearch />} //ahmed
        />
        <Route
          path="/get-createdhistoricalplaces"
          element={<CreatedHistoricalPlacesView />}
        />
        <Route path="/historical-placess" element={<HistoricalPlacesPage />} />
        {/* <Route
          path="/historical-places-username"
          element={<HistoricalPlacesByUsername />} //ahmed
        /> */}
        <Route
          path="/historical-places-view" //ahmed
          element={<HistoricalPlacesView />}
        />
        <Route path="/activities-view" element={<ActivitiesView />} />
        <Route
          path="/advertiser-create-activity" //ahmed
          element={<CreateActivity />}
        />
        <Route
          path="/advertiser-edit-activity/:name" //ahmed
          element={<EditActivity />}
        />
        <Route
          path="/create-tags-historical-places" //ahmed
          element={<CreateTagsForHistoricalPlace />}
        />
        <Route
          path="/delete-activity" //ahmed
          element={<DeleteActivity />}
        />
        <Route
          path="/read-activities" //ahmed
          element={<ReadActivities />}
        />
        <Route path="/file-complaint" element={<FileComplaint />} />{" "}
        {/* New route for filing complaints */}
        <Route path="/tourist-purchases" element={<TouristPurchases />} />
        <Route path="/share/activity/:id" element={<ActivityGuestDetails />} />
        <Route path="/activity/:id" element={<ActivityDetails />} />
        <Route
          path="/tourist-booked-itineraries"
          element={<TouristBookedItineraries />}
        />
        <Route
          path="/tourist-booked-activities"
          element={<TouristBookedActivities />}
        />
        <Route
          path="/tourist-booked-flights"
          element={<TouristBookedFlights />}
        />
        <Route
          path="/tourist-booked-hotels"
          element={<TouristBookedHotels />}
        />
        <Route
          path="/tourist-booked-transport"
          element={<TouristBookedTransport />}
        />
        <Route path="/tourist-bookmark-itineraries" element={<BookmarkItinerary />} />
        <Route
          path="/share/historicalPlace/:id"
          element={<ViewHPGuestDetails />}
        />
        <Route
          path="/tourist-products-details/:id"
          element={<TouristProductDetails />}
        />
        <Route
          path="/share/itinerary/:id"
          element={<ItineraryGuestDetails />}
        />
        <Route path="/itinerary/:id" element={<ItineraryDetails />} />
        <Route
          path="/viewhistorical-guest"
          element={<ViewHistoricalPlacesGuest />}
        />
        <Route path="/hp-guest-details/:id" element={<ViewHPGuestDetails />} />
        <Route path="/tourist-hp" element={<TouristHistoricalPlaces2 />} />
        <Route path="/tourist-hp-details/:id" element={<TouristHPDetails />} />
        <Route
          path="/tourism-hp-details/:id"
          element={<ViewHPTourismDetails />}
        />
        <Route
          path="/rate-comment-itineraries-tourguide"
          element={<RateCommentItinerary />}
        />
        <Route path="/book-flight" element={<FlightSearch />} />
        <Route path="/book-hotel" element={<HotelSearch />} />
        <Route path="/book-transportation" element={<BookTransportation />} />
        <Route path="/attended-activites" element={<AttendedActivities />} />
        <Route path="/login-final" element={<LoginFinal />} />
        <Route path="/checkoutcart" element={<CheckOutCart />} />
        <Route
          path="/seller-productsales-table"
          element={<SellerQuantitySales />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product-tourist-page" element={<ProductTouristPage />} />
        <Route path="/tourist-activitypage" element={<TouristActivity />} />
        <Route path="/tourist-activity" element={<TouristActivities />} />
        <Route path="/seller-finalprofile" element={<SellerFinalProfile />} />
        <Route
          path="/advertiser-finalprofile"
          element={<AdvertiserFinalProfile />}
        />
        <Route path="/tourguide-profile" element={<TourGuideProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/sales-report" element={<SalesReport />} />
        <Route path="/admin-user-stats" element={<UserStats />} />
        <Route path="/revf-report" element={<RevReportT />} />
        <Route path="/revA-report" element={<RevReportA />} />
        <Route path="/total-tourist-booked-act" element={<TouristReportA />} />
        <Route
          path="/total-tourist-booked-itinerary"
          element={<TourGuideReport />}
        />
        <Route path="/products-sales-report" element={<SalesReportS />} />
        <Route path="/successPage" element={<SuccessPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="/itinerary-flagged/:id"
          element={<ItineraryFlagedDetails />}
        />{" "}
        <Route
          path="/tour-guide-profile-final"
          element={<TourGuideFinalProfile />}
        />{" "}
        <Route
          path="/activity-flagged/:id"
          element={<ActivityFlaggedDetails />}
        />
        <Route
          path="/viewsaveditineraries"
          element={<ViewSavedItineraries />}
        />
        <Route path="/viewsavedactivities" element={<ViewSavedActivities />} />
        <Route path="/my-promo-codes" element={<MyPromoCodes />} />
        <Route
          path="/advertiser-activity-details/:id"
          element={<AdvertiserActivityDetails />}
        />
        <Route path="/rate-products" element={<ProductTouristRate />} />
        <Route
          path="/admin-seller-product-details/:id"
          element={<AdminSellerProductDetails />}
        />
        <Route path="/step-by-step" element={<StepByStep />} />
        <Route path="/tourist-prefrences" element={<SelectPreferences />} />
        <Route
          path="/edit-historical-place/:name"
          element={<UpdateHistoricalPlace />}
        />





        <Route
          path="/tg-itinerary"
          element={<TourGuideItineraries />}
        />
        <Route
          path="/tg-itinerary/:id"
          element={<TGItineraryDetails />}
        />
        <Route
          path="/tg-create-itinerary"
          element={<TGCreateItinerary />}
        />
        <Route
          path="/tg-update-itinerary/:id"
          element={<TGUpdateItinerary />}
        />

      </Routes>
    </Router>
  );
};

export default App;
