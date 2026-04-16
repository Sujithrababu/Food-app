import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-600 text-lg">
          This page will provide administrators with system overview, user management, and analytics.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
