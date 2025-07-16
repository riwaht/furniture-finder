Furniture Finder App
====================

A React Native mobile application built with Expo, allowing users to log in, browse furniture items from a public API, view product details, manage a profile picture using the device camera, and save favorite items. The app features a clean, mobile-friendly design with light/dark mode and a consistent user experience.

Table of Contents
-----------------

1.  [How to Install and Run the App](https://www.google.com/search?q=#how-to-install-and-run-the-app)
    
2.  [Features Implemented](https://www.google.com/search?q=#features-implemented)
    

How to Install and Run the App
------------------------------

Follow these steps to get the Furniture Finder App up and running on your local machine.

### Prerequisites

*   **Node.js and npm (or Yarn):** Ensure you have Node.js (LTS version recommended) and npm (Node Package Manager) or Yarn installed.
*   **Expo Go App:** Download the Expo Go app on your physical iOS or Android device from the App Store or Google Play Store.
    

### Installation Steps

1.  Clone the repo
2.  Run cd furniture-finder
3.  Run npm install

### Running the App

1.  Run npx expo start
    
2.  **Open on Device:**
    
    *   **Scan QR Code:** Use the Expo Go app on your phone to scan the QR code displayed in the terminal or in the Expo Dev Tools web interface.
        

### Test Credentials

The app uses hardcoded credentials for login:

*   **Email:** test@example.com
    
*   **Password:** 123456
    

Features Implemented
--------------------

The Furniture Finder App includes the following functionalities:

*   **Simulated Login:**
    
    *   A dedicated login screen with email and password inputs.
        
    *   Basic input validation (required fields, valid email format).
        
    *   Uses hardcoded credentials (test@example.com / 123456) for authentication.
        
    *   Persists login state using AsyncStorage.
        
*   **Profile Page (Camera Integration):**
    
    *   Displays the logged-in user's email.
        
    *   Shows a profile image (initially a placeholder).
        
    *   Allows users to take a photo using the device camera to update their profile image.
        
    *   Stores the profile image URI persistently using AsyncStorage.
        
    *   Includes a "Log Out" button.
        
*   **Furniture Browser:**
    
    *   Fetches furniture data from https://dummyjson.com/products/category/furniture.
        
    *   Displays a scrollable list of furniture items.
        
    *   Each item shows its image, title, price, and a short description.
        
    *   Includes loading indicators and error handling for data fetching.
        
*   **Product Detail Page:**
    
    *   Navigates to a dedicated detail screen when a furniture item is tapped from the browser.
        
    *   Displays full-size image(s), product title, price, full description, and category.
        
*   **Tailwind Styling:**
    
    *   Utilizes nativewind (or a similar Tailwind integration) for all styling.
        
    *   Features a clean, modern, and mobile-friendly layout.
        
    *   **Light/Dark Mode Toggle:** A user-selectable toggle (located in the Profile screen) to switch between light and dark themes, with all UI elements adapting dynamically.
        
    *   Consistent color palette and typography (using the "Inter" font family).
        
*   **Logout Functionality:**
    
    *   A "Log Out" button is available on the Profile screen.
        
    *   Clears session data from AsyncStorage upon logout.
        
    *   Automatically navigates the user back to the login screen.
        
*   **Favorites Feature:**
    
    *   Allows users to mark furniture items as favorites using a heart icon on both the main browser screen and the product detail page.
        
    *   Persists the list of favorited product IDs using AsyncStorage.
        
*   **Search Bar:**
    
    *   A search input field on the Home screen to filter furniture items by title and description in real-time.
        
*   **Enhanced UI/UX:**
    
    *   Custom "Inter" font applied consistently across all screens for improved readability and aesthetic.
        
    *   Structured Profile screen with distinct sections for photo update, settings, and logout.
        
    *   Integrated StackNavigator headers with dynamic styling (matching theme), including a top-right profile icon on the Home screen and automatic back buttons on detail/profile screens.
        
    *   StatusBar color dynamically matches the header background for a seamless look.
