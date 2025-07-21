import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';

import Layout from './components/shared/Layout';

import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

import AdminDashboard from './components/admin/AdminDashboard';
import ProjectList from './components/admin/ProjectList';
import UserProgressTable from './components/admin/UserProgressTable';
import UserDetailView from './components/admin/UserDetailView';

import UserDashboard from './components/user/UserDashboard';
import KanbanBoardPage from './components/user/KanbanBoardPage';
import NotificationDropdown from './components/user/NotificationDropdown';

const App = () => {
  console.log('App component is rendering...');
  
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/*" element={<AppWithLayout />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

const AppWithLayout = () => {
  console.log('AppWithLayout component is rendering...');
  
  return (
    <Layout>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute requiredRole="admin">
            <ProjectList />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <UserProgressTable />
          </ProtectedRoute>
        } />
        <Route path="/admin/users/:userId" element={
          <ProtectedRoute requiredRole="admin">
            <UserDetailView />
          </ProtectedRoute>
        } />
          {/* User routes */}
        <Route path="/user" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/kanban" element={
          <ProtectedRoute requiredRole="user">
            <KanbanBoardPage />
          </ProtectedRoute>
        } />
        <Route path="/user/notifications" element={
          <ProtectedRoute requiredRole="user">
            <NotificationDropdown />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
