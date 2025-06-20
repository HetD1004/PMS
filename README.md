# Project Management System (PMS)

A modern, full-featured Project Management System built with React.js, Tailwind CSS, and featuring drag-and-drop functionality similar to Jira.

## 🚀 Features

### Authentication & Authorization
- **User Registration & Login** with role-based access (Admin/User)
- **Protected Routes** ensuring proper access control
- **Demo Credentials** provided for easy testing

### Admin Panel
- **Dashboard** with comprehensive analytics and charts
- **Project Management** with create, view, and delete functionality
- **Task Assignment** with user selection and due dates
- **User Progress Tracking** with detailed Kanban views

### User Panel
- **Personal Dashboard** with task overview and statistics
- **Interactive Kanban Board** with drag-and-drop functionality
- **Real-time Notifications** with unread badges
- **Task Detail Views** with comprehensive information

### UI/UX
- **Modern Design** using Tailwind CSS
- **Responsive Layout** works on all device sizes
- **Interactive Elements** with smooth animations
- **Data Visualization** using Chart.js

## 🛠️ Technology Stack

- **Frontend**: React.js 18 with JSX
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Drag & Drop**: @hello-pangea/dnd
- **Charts**: Chart.js + React-ChartJS-2
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Context API

## 📦 Installation & Setup

1. **Clone or download** the project to your local machine

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 👤 Demo Accounts

### Admin Account
- **Email**: admin@gmail.com
- **Password**: admin123
- **Access**: Full admin panel with project and user management

### User Account
- **Email**: userone@gmail.com
- **Password**: user123
- **Access**: Personal dashboard with Kanban board

## 🏗️ Project Structure

```
src/
├── components/
│   ├── admin/           # Admin panel components
│   ├── auth/            # Authentication components
│   ├── shared/          # Reusable UI components
│   └── user/            # User panel components
├── contexts/            # React Context for state management
├── data/                # Dummy data and helper functions
└── index.css           # Global styles and Tailwind imports
```

## 🎯 Key Features Explained

### Drag-and-Drop Kanban Board
- Built with @hello-pangea/dnd for smooth interactions
- Three columns: "To Do", "In Progress", "Done"
- Visual feedback during dragging
- Automatic status updates

### Role-Based Access Control
- Admins can manage projects, create tasks, and view all user progress
- Users can only access their personal dashboard and tasks
- Automatic redirection based on user role

### Real-Time Notifications
- Bell icon with unread count badge
- Automatic notifications when tasks are assigned
- Mark as read functionality
- Dedicated notifications page

### Responsive Design
- Mobile-first approach
- Collapsible navigation on smaller screens
- Optimized layouts for all device sizes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Data Management

The application uses dummy data stored in `src/data/dummyData.js` that simulates:
- User accounts with different roles
- Projects with various statuses
- Tasks with different completion states
- Notifications for task assignments

In a real-world scenario, this would be replaced with API calls to a backend server.

## 🎨 Customization

The application uses a custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Utility classes for common patterns

## 🚀 Deployment

To deploy the application:

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist` folder contains the production build
3. Deploy the contents to any static hosting service

## 📝 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

---

**Built with ❤️ using React.js and Tailwind CSS**
