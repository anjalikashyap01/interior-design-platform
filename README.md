# Interior Design Platform

A full-stack interior design platform built to bring an interior design studio's website, content, customer enquiries, and admin management into one place.

The project has two main parts:

- A public-facing website where visitors can explore designs, services, projects, testimonials, studio information, and request a consultation.
- An admin panel where the studio can manage the content shown on the website without changing the frontend code.

The goal was to build something that feels like a real interior design business website while also having the backend structure needed to manage it as an actual application.

---

## What the Platform Includes

### Public Website

Visitors can:

- Explore interior design ideas
- Browse designs
- Search and filter designs
- View individual design details
- Explore interior design services
- View individual service details
- Browse completed projects
- View individual project details
- Read customer testimonials
- Learn about the studio and its design philosophy
- View office and contact information
- Request an interior design consultation

The website is designed to work across desktop and mobile screen sizes.

---

## Admin Panel

The admin side works as a content management area for the website.

Admins can manage:

- Designs
- Projects
- Services
- Testimonials
- About / Studio information
- Office information
- Consultation requests
- Dashboard statistics

For content such as designs and projects, the admin can create, edit, publish, unpublish, archive, and manage images.

The admin panel uses a separate authentication flow from the public user authentication.

---

# Main Features

## Design Management

Designs can contain information such as:

- Title
- Description
- Room type
- Interior style
- Colors
- Materials
- Budget range
- Tags
- Multiple images
- Featured status
- Published status
- Archived status

The public design section supports searching and filtering.

---

## Project Management

Projects contain information about completed interior work, including:

- Project title
- Description
- Location
- Category
- Style
- Materials
- Project images
- Before and after images
- Featured status
- Published status

---

## Services

The platform supports individual service pages with:

- Service name
- Description
- Short description
- Starting price
- Features
- Images
- Draft / published status
- Featured status

---

## Testimonials

Testimonials can be managed from the admin panel with:

- Customer name
- Role
- Rating
- Review content
- Customer image
- Draft / published status

---

## About the Studio

The About section is structured as more than a simple text page.

It supports:

- Studio introduction
- Studio story
- Design philosophy
- Founder information
- Founder highlights
- Design process
- Materials
- Trusted brands
- Trust points
- Call-to-action section
- Multiple images

This allows studio information to be managed from the admin side.

---

## Consultation Requests

Visitors can submit consultation requests with information such as:

- Name
- Phone
- Email
- Consultation type
- Preferred date
- Preferred time
- Location
- Message
- Selected design
- Optional room image

Consultations can then be tracked from the admin dashboard through different statuses:

- Pending
- Contacted
- Confirmed
- Completed
- Cancelled

---

## Office Management

Office information can be managed from the admin panel, including:

- Office name
- Address
- City
- State
- Country
- Phone
- Email
- Latitude and longitude
- Social media handles
- Working hours

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Three.js
- React Three Fiber
- React Three Drei
- Clerk

## Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- Clerk Express
- JWT
- bcryptjs
- Zod
- Multer
- Cloudinary
- Resend

## Security and Infrastructure

- Helmet
- CORS
- Express Rate Limit
- Environment variables
- JWT-based admin authentication
- Clerk-based public authentication

---

# Project Structure

```text
interior-design-platform/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── about/
│   │   │   ├── admin/
│   │   │   ├── consultation/
│   │   │   ├── designs/
│   │   │   ├── projects/
│   │   │   ├── services/
│   │   │   └── ...
│   │   │
│   │   ├── components/
│   │   └── lib/
│   │       └── api.ts
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── scripts/
│   └── package.json
│
└── README.md

Application Architecture
At a high level, the application works like this:
                    ┌─────────────────┐
                    │   Public User   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Next.js Website │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express REST API│
                    └────────┬────────┘
                             │
                 ┌───────────┼───────────┐
                 ▼           ▼           ▼
             MongoDB     Cloudinary    Services

The admin side follows a separate authentication flow:
Admin
  │
  ▼
Admin Login
  │
  ▼
JWT Authentication
  │
  ▼
Admin Dashboard
  │
  ├── Designs
  ├── Projects
  ├── Services
  ├── Testimonials
  ├── About
  ├── Office
  └── Consultations

Authentication
The project uses two authentication approaches for different parts of the application.
Public Users
Public user authentication is handled with Clerk.
Admin Users
The admin panel uses a separate JWT-based authentication system.
Admin authentication includes:
- Admin login
- JWT token generation
- Protected admin routes
- Authenticated admin API requests
- Admin logout
- Automatic handling of unauthorized requests
If an authenticated admin request returns a 401 response, the frontend clears the admin authentication state and redirects the user toward the admin login flow.

Image Management
Images are handled through Cloudinary rather than being stored directly inside the application repository.
Cloudinary is used for content such as:
- Designs
- Projects
- Testimonials
- About / Studio content
- Consultation room images
This keeps uploaded media separate from the application source code.

Security
The backend includes several security measures:
- Helmet security headers
- CORS configuration
- Request rate limiting
- JWT authentication for admin routes
- Password hashing with bcrypt
- Input validation with Zod
- Environment-based secret management
- Disabled x-powered-by header
- Request body size limits
- Centralized error handling
The general API rate limiter currently allows up to 200 requests within a 15-minute window per client.

Public Pages
The frontend currently includes routes for:
- Home
- About
- Designs
- Design details
- Services
- Service details
- Projects
- Project details
- Consultation
- Admin Login
The public navigation also provides access to the main studio content and admin login entry point.
Admin Pages
The admin panel currently includes management areas for:
- Dashboard
- Designs
- Projects
- Services
- Testimonials
- About
- Office
- Consultations
The admin panel provides CRUD-style content management and publishing controls for supported resources.
Design and User Experience
The public website was designed around an interior-design-focused visual experience rather than a generic dashboard layout.
The UI includes:
- Responsive layouts
- Image-focused sections
- Interactive content
- Animated transitions
- Design and project galleries
- Individual detail pages
- Mobile navigation
- Admin content management interfaces
The public pages and detail pages share a consistent visual language while serving different purpose

Data Flow
A simplified example of the public design flow:
Visitor
   │
   ▼
Designs Page
   │
   ▼
Next.js API Client
   │
   ▼
Express API
   │
   ▼
MongoDB
   │
   ▼
Design Data
   │
   ▼
Design Details Page

For admin content management:
Admin
   │
   ▼
Admin Login
   │
   ▼
JWT Token
   │
   ▼
Protected Admin API
   │
   ▼
Controller
   │
   ▼
MongoDB / Cloudinary
   │
   ▼
Updated Content
   │
   ▼
Public Website

Development Notes
The project follows a separation between:
- UI
- API communication
- Backend routes
- Controllers
- Models
- Middleware
- Authentication
- External services
This makes it easier to maintain the application as new content types and features are added.
The frontend API layer centralizes communication with the backend, while the backend separates routes, controllers, models, and middleware.
Why This Project Was Built
This project started as an interior design website, but the goal was to take it beyond a collection of static pages.
The idea was to create a system where the public website and the studio's internal content management work together.
Instead of hardcoding every design, project, testimonial, or studio detail into the frontend, the backend provides the data and the admin panel provides a way to manage it.
This makes the project closer to a real-world full-stack application rather than only a frontend portfolio website.
Project Highlights
- Full-stack Next.js + Express application
- REST API architecture
- MongoDB database integration
- Separate public and admin experiences
- Clerk authentication
- JWT-based admin authentication
- Cloudinary image management
- Admin content management
- Consultation workflow
- Responsive UI
- Search and filtering for designs
- Security middleware
- API rate limiting
- TypeScript across frontend and backend
Author
Anjali Kashyap
Built as a full-stack interior design platform project.

License
This project is currently intended as a project and portfolio application.

**Important:** this is the README content only. It does **not** change anything in your GitHub repository yet. Once you paste it into the root `README.md`, we can verify it and then commit it safely to `main`.



