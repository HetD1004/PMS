# Project Management System (PMS)

A modern, full-featured Project Management System built with React.js, Tailwind CSS, and featuring advanced drag-and-drop functionality similar to Jira and Trello. This application provides comprehensive project management capabilities with role-based access control, real-time task tracking, and intuitive user interfaces.

## Key Features

### 🔐 Authentication & Authorization
- **Secure Login System** with email/password authentication
- **Role-Based Access Control** (Admin/User roles)
- **Protected Routes** with automatic redirects based on user roles
- **Demo Credentials** provided for easy testing and exploration
- **Session Management** with persistent login state

### Admin Panel Features
- **Comprehensive Dashboard** with real-time analytics and interactive charts
- **Advanced Statistics** including task completion rates, user productivity metrics
- **Project Management** with full CRUD operations
- **Task Assignment System** with user selection, priority setting, and due dates
- **User Progress Tracking** with detailed individual and team analytics
- **Activity Logs** showing complete task lifecycle and status changes
- **Data Export** functionality for reports and analytics
- **Global Search** across projects, tasks, and users
- **Bulk Operations** for efficient task management

### User Panel Features
- **Personal Dashboard** with comprehensive task overview and productivity insights
- **Interactive Kanban Board** with smooth drag-and-drop functionality
- **Multi-Column Task Organization** (Backlog, To Do, In Progress, On Hold, Done)
- **Real-time Notifications** system with unread count badges
- **Detailed Task Views** with rich information and status updates
- **Task Filtering & Search** capabilities
- **Progress Tracking** with visual completion indicators
- **Personal Analytics** and productivity metrics

### UI/UX Features
- **Modern Glass-morphism Design** with gradient backgrounds and blur effects
- **Fully Responsive Layout** optimized for desktop, tablet, and mobile
- **Smooth Animations** and transitions throughout the application
- **Interactive Data Visualizations** using Chart.js (Doughnut charts, Bar charts)
- **Custom Loading States** and micro-interactions
- **Accessibility Features** with proper ARIA labels and keyboard navigation
- **Dark Mode Support** preparations in Tailwind configuration

### Advanced Kanban Features
- **Drag & Drop** with visual feedback and constraints
- **Status-Based Columns** with custom colors and icons
- **Task Filtering** by priority, assignee, and due date
- **Side Panel** with settings, filters, and quick actions
- **Bulk Actions** for multiple task operations
- **Board Customization** options
- **Real-time Updates** with animated notifications

## Technology Stack

### Frontend Technologies
- **React.js 18** with modern hooks and functional components
- **JSX** for component templating
- **React Router DOM v6** for client-side routing
- **React Context API** for global state management

### Styling & UI
- **Tailwind CSS 3.3.5** with custom configurations
- **Custom CSS animations** for enhanced user experience
- **Responsive design** with mobile-first approach
- **CSS Grid & Flexbox** for advanced layouts

### Libraries & Packages
- **@hello-pangea/dnd** for drag-and-drop functionality
- **Chart.js 4.4.0** with **React-ChartJS-2** for data visualization
- **Lucide React** for consistent icon system
- **React Portals** for modal management

### Development Tools
- **Vite 4.5.0** as build tool and development server
- **ESLint** with React-specific rules for code quality
- **PostCSS** with **Autoprefixer** for CSS processing
- **Hot Module Replacement** for fast development

## Installation & Setup

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Start

1. **Clone or Download** the project to your local machine
   ```bash
   git clone <repository-url>
   cd PMS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   - Navigate to `http://localhost:5173` in your browser
   - The application will automatically open with hot reload enabled

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally  
npm run preview
```

## Demo Accounts & Testing

### Admin Account
- **Email**: `admin@gmail.com`
- **Password**: `admin123`
- **Access**: Complete admin panel with full project and user management capabilities
- **Features**: Analytics dashboard, user progress tracking, task assignment, project creation

### User Accounts
- **Primary User**: 
  - Email: `userone@gmail.com` | Password: `user123`
- **Additional Users**: 
  - Email: `usertwo@gmail.com` | Password: `user123`
  - Email: `userthree@gmail.com` | Password: `user123`
  - Email: `userfour@gmail.com` | Password: `user123`
  - Email: `userfive@gmail.com` | Password: `user123`

**User Access**: Personal dashboard, Kanban board, task management, notifications

### Testing Scenarios
1. **Admin Workflow**: Login as admin → View analytics → Create tasks → Assign to users → Monitor progress
2. **User Workflow**: Login as user → Check dashboard → Use Kanban board → Update task status → View notifications
3. **Drag & Drop**: Test task movement between columns (To Do → In Progress → Done)
4. **Responsive Design**: Test on different screen sizes and devices

## Project Architecture

```
src/
├── components/
│   ├── admin/                    # Admin-specific components
│   │   ├── AdminDashboard.jsx    # Main admin dashboard with analytics
│   │   ├── CreateTaskModal.jsx   # Task creation interface
│   │   ├── ProjectList.jsx       # Project management interface
│   │   ├── UserDetailView.jsx    # Individual user progress view
│   │   └── UserProgressTable.jsx # User overview table
│   ├── auth/                     # Authentication components
│   │   ├── LoginPage.jsx         # Login interface with demo credentials
│   │   ├── ProtectedRoute.jsx    # Route protection wrapper
│   │   └── SignupPage.jsx        # User registration interface
│   ├── shared/                   # Reusable UI components
│   │   ├── Button.jsx            # Styled button component
│   │   ├── Card.jsx              # Card container with variants
│   │   ├── Layout.jsx            # Main application layout
│   │   ├── Modal.jsx             # Modal dialog component
│   │   ├── Navbar.jsx            # Top navigation with search
│   │   ├── NavigationSidebar.jsx # Collapsible sidebar navigation
│   │   └── SidePanel.jsx         # Kanban board side panel
│   └── user/                     # User-specific components
│       ├── KanbanBoard.jsx       # Drag-and-drop task board
│       ├── KanbanBoardPage.jsx   # Kanban board page wrapper
│       ├── NotificationDropdown.jsx # Notification management
│       ├── TaskCard.jsx          # Individual task display
│       ├── TaskDetailModal.jsx   # Task detail view modal
│       └── UserDashboard.jsx     # User analytics dashboard
├── contexts/
│   └── AppContext.jsx            # Global state management
├── data/
│   └── dummyData.js              # Mock data for demonstration
├── styles/
│   └── animations.css            # Custom CSS animations
├── index.css                     # Global styles and Tailwind imports
└── main.jsx                      # Application entry point
```

### Key Directories Explained

- **`components/admin/`**: Admin-only interfaces for project management, user oversight, and analytics
- **`components/auth/`**: Authentication flow with login/signup and route protection
- **`components/shared/`**: Reusable UI components used across admin and user interfaces  
- **`components/user/`**: User-specific interfaces focusing on personal task management
- **`contexts/`**: React Context for global state management and data flow
- **`data/`**: Mock data structure simulating real backend API responses
- **`styles/`**: Custom animations and styling enhancements

## Feature Deep Dive

### Advanced Drag-and-Drop Kanban System
- **Smooth Interactions**: Built with @hello-pangea/dnd for fluid task movement
- **Visual Feedback**: Real-time preview while dragging with custom positioning
- **Smart Constraints**: Logical task flow restrictions (e.g., completed tasks can't be moved)
- **Multi-Status Support**: Five distinct columns (Backlog, To Do, In Progress, On Hold, Done)
- **Responsive Design**: Touch-friendly on mobile devices with optimized gestures

### Comprehensive Analytics Dashboard
- **Interactive Charts**: Doughnut and bar charts showing task distribution and completion rates
- **Real-time Metrics**: Live statistics updating based on task changes
- **Trend Analysis**: Historical data visualization for productivity tracking
- **Completion Tracking**: Detailed progress indicators with percentage calculations
- **Export Capabilities**: Download dashboard data as CSV/JSON reports

### Role-Based Access Control (RBAC)
- **Admin Privileges**: Full system access, user management, project creation, task assignment
- **User Restrictions**: Personal task management, read-only project information
- **Route Protection**: Automatic redirection based on authentication status and role
- **Session Management**: Persistent login state with secure logout functionality

### Advanced Search & Filtering
- **Global Search**: Search across tasks, projects, and users from the navigation bar
- **Smart Filtering**: Filter by status, priority, assignee, due date, and project
- **Real-time Results**: Instant search results with highlighted matches
- **Contextual Navigation**: Direct navigation to relevant sections from search results

### Responsive Design System
- **Mobile-First Approach**: Optimized for mobile devices with touch interactions
- **Flexible Layouts**: CSS Grid and Flexbox for complex responsive designs
- **Collapsible Navigation**: Space-efficient sidebar that adapts to screen size
- **Touch-Friendly**: Optimized button sizes and spacing for mobile use

### Modern UI/UX Design
- **Glass-morphism Effects**: Translucent cards with backdrop blur effects
- **Gradient Backgrounds**: Dynamic animated background elements
- **Micro-interactions**: Subtle hover effects and loading animations
- **Consistent Iconography**: Lucide React icons throughout the application
- **Color-Coded Systems**: Intuitive color schemes for different task states and priorities

## Available Scripts & Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Create optimized production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint for code quality checks

# Advanced Development Commands
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript type checking (if applicable)
```

### Development Workflow
1. **Start Development**: `npm run dev` - Launches Vite dev server on port 5173
2. **Code Quality**: `npm run lint` - Ensures code follows project standards
3. **Build Testing**: `npm run build && npm run preview` - Test production build locally
4. **Hot Reload**: Automatic browser refresh on file changes during development

## Data Architecture & Management

### Mock Data Structure
The application uses comprehensive mock data stored in `src/data/dummyData.js`:

```javascript
// User Management
- 6 total users (1 admin, 5 regular users)
- Role-based permissions and access control
- Complete user profiles with authentication

// Project Structure  
- 3 sample projects with different statuses
- Project metadata including creation dates and descriptions
- Project-task relationships

// Task Management
- 15+ sample tasks across different projects
- Task properties: title, description, status, priority, due dates
- Assignment relationships between users and tasks

// Notification System
- Task assignment notifications
- Status change notifications  
- Read/unread tracking per user

// Activity Logging
- Complete task lifecycle tracking
- User action history
- Status change timestamps
```

### State Management
- **React Context API**: Centralized state management
- **Local State**: Component-specific state for UI interactions
- **Persistent Data**: Session storage for user authentication
- **Real-time Updates**: Immediate UI updates on data changes

## Styling & Theming

### Design System
```javascript
// Custom Tailwind Configuration
- Extended color palette with primary blues and supporting colors
- Custom animations (fade-in, slide-up, blob animations)
- Responsive breakpoints optimized for the application
- Utility classes for common patterns

// Animation Classes
- animate-fade-in: Smooth element appearance
- animate-slide-up: Bottom-to-top element entry
- animate-blob: Floating background elements
- Custom hover and focus states
```

### Color Scheme
- **Primary**: Blue gradients (#3b82f6 to #1d4ed8)
- **Success**: Green tones for completed states
- **Warning**: Yellow/Orange for in-progress and on-hold
- **Error**: Red tones for urgent/overdue items
- **Neutral**: Gray scale for secondary elements

## Performance Optimizations

### Built-in Optimizations
- **Vite Build Tool**: Fast development and optimized production builds
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination in production
- **Asset Optimization**: Automatic image and CSS optimization
- **Modern JavaScript**: ES6+ features with automatic polyfill detection

### Application-Specific Optimizations
- **Lazy Loading**: Components loaded on-demand
- **Memoization**: React.memo for expensive re-renders
- **Virtual Scrolling**: Efficient handling of large task lists
- **Debounced Search**: Optimized search input handling

## Deployment Guide

### Production Build Process

1. **Create Production Build**
   ```bash
   npm run build
   ```
   This generates optimized files in the `dist/` directory.

2. **Test Production Build Locally**
   ```bash
   npm run preview
   ```
   Preview the production build at `http://localhost:4173`

### Deployment Options

#### **Static Hosting Services**
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **Vercel**: Import project from GitHub with automatic deployments
- **GitHub Pages**: Deploy directly from repository using GitHub Actions
- **Surge.sh**: Simple command-line deployment

#### **Cloud Platforms** 
- **AWS S3 + CloudFront**: Scalable static hosting with CDN
- **Google Cloud Storage**: Static website hosting
- **Azure Static Web Apps**: Integrated deployment with GitHub

#### **Sample Netlify Deployment**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Configuration
For production deployment, consider:
- Environment variables for API endpoints
- Analytics tracking (Google Analytics, etc.)
- Error tracking services (Sentry, LogRocket)
- Performance monitoring

## Contributing Guidelines

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Submit a pull request with a clear description

### Coding Standards
- **ESLint Configuration**: Follow the existing ESLint rules
- **Component Structure**: Use functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **CSS Classes**: Tailwind utility classes with custom CSS only when necessary

### Testing Guidelines
- Test all user interactions (drag & drop, form submissions, navigation)
- Verify responsive design on multiple screen sizes
- Check accessibility features and keyboard navigation
- Test with different user roles (admin/user)

## Troubleshooting

### Common Issues & Solutions

#### **Port Already in Use**
```bash
# If port 5173 is busy, Vite will automatically use the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

#### **Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Drag & Drop Issues**
- Ensure `@hello-pangea/dnd` is properly installed
- Check browser compatibility for drag events
- Verify touch device support settings

#### **Styling Issues**
```bash
# Rebuild Tailwind CSS
npm run build:css  # If you have this script
# Or restart the dev server
npm run dev
```

### Known Limitations
- **Backend Integration**: Currently uses mock data - requires API integration for production
- **Real-time Updates**: Uses local state - consider WebSocket integration for multi-user scenarios
- **File Uploads**: Not implemented - would require backend file handling
- **Email Notifications**: Mock notifications only - requires email service integration

## Learning Resources

### Technologies Used
- **React.js**: [Official Documentation](https://react.dev/)
- **Tailwind CSS**: [Documentation](https://tailwindcss.com/docs)
- **Vite**: [Guide](https://vitejs.dev/guide/)
- **React Router**: [Documentation](https://reactrouter.com/)
- **@hello-pangea/dnd**: [GitHub Repository](https://github.com/hello-pangea/dnd)

### Additional Learning
- **Project Management**: Understanding Agile, Scrum, and Kanban methodologies
- **React Patterns**: Context API, custom hooks, component composition
- **Modern CSS**: CSS Grid, Flexbox, and responsive design principles

## License & Credits

### License
This project is created for **educational and demonstration purposes**. Feel free to use, modify, and distribute as needed.

### Acknowledgments
- **React.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icons
- **@hello-pangea/dnd** for drag-and-drop functionality
- **Chart.js** for data visualization capabilities

---

**Built with ❤️ using modern web technologies**

*For questions, suggestions, or contributions, feel free to open an issue or submit a pull request!*
