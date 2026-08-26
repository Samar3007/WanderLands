# 🏕️ WanderLands

**WanderLands** is a full-stack campground discovery and review platform where users can explore campgrounds, view locations on an interactive map, create listings, upload images, and share reviews.

This project was built as a hands-on full-stack web development project while learning modern web development concepts with Node.js, Express, MongoDB, and JavaScript.

## ✨ Features

* 🔐 User registration, login, and logout
* 🏕️ Create, view, edit, and delete campground listings
* ⭐ Create, edit, and delete campground reviews
* 🗺️ Interactive maps and location-based campground information
* 📸 Image uploads and cloud storage
* 🛡️ Authentication and authorization
* ✅ Server-side validation and error handling
* 📱 Responsive user interface

## 🛠️ Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript
* Bootstrap
* EJS

**Backend**

* Node.js
* Express.js
* RESTful APIs
* MVC architecture

**Database**

* MongoDB
* Mongoose

**Services & Tools**

* Mapbox — maps & geocoding
* Cloudinary — image storage
* Passport.js — authentication
* Git & GitHub

## 🏗️ Architecture

The application follows an **MVC architecture**:

```text
Browser
   ↓
Express Routes
   ↓
Controllers
   ↓
Models ───→ MongoDB
   ↓
Views
```

The application also integrates external services such as **Mapbox** for location data and **Cloudinary** for image storage.

## 🔐 Authentication & Authorization

Camply uses session-based authentication and authorization to protect user actions.

Users can:

* Create their own campground listings
* Edit and delete their own listings
* Add and manage their own reviews
* Access protected routes only when authorized

## 📚 What I Learned

Through this project, I gained practical experience with:

* Building full-stack applications with Node.js and Express
* Designing RESTful routes and MVC applications
* MongoDB database design and Mongoose
* CRUD operations and data relationships
* Authentication and authorization
* Sessions, cookies, and middleware
* API and third-party service integration
* Image uploads and cloud storage
* Maps and geocoding
* Git and GitHub

## 👨‍💻 Author

**Samarjeet Baliyan**

[GitHub](https://github.com/Samar3007)

---

⭐ If you found this project interesting, consider giving it a star!
