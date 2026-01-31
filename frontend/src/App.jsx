import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { AuthProvider } from '@/contexts/AuthContext';
import { TenantProvider } from '@/contexts/TenantContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Layout Components
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';

// Dashboard Pages
import DashboardPage from '@/pages/dashboard/DashboardPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import OrderDetailsPage from '@/pages/orders/OrderDetailsPage';
import CreateOrderPage from '@/pages/orders/CreateOrderPage';
import CustomersPage from '@/pages/customers/CustomersPage';
import CustomerDetailsPage from '@/pages/customers/CustomerDetailsPage';
import ProductsPage from '@/pages/products/ProductsPage';
import ProductDetailsPage from '@/pages/products/ProductDetailsPage';
import DeliveryProvidersPage from '@/pages/delivery/DeliveryProvidersPage';
import CommunicationsPage from '@/pages/communications/CommunicationsPage';
import AutomationPage from '@/pages/automation/AutomationPage';
import AnalyticsPage from '@/pages/analytics/AnalyticsPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import UsersPage from '@/pages/users/UsersPage';

// Protected Route Component
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Error Pages
import NotFoundPage from '@/pages/errors/NotFoundPage';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Loading Component
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <TenantProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    <Routes>
                      {/* Public Auth Routes */}
                      <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="reset-password" element={<ResetPasswordPage />} />
                      </Route>

                      {/* Protected Dashboard Routes */}
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute>
                            <DashboardLayout />
                          </ProtectedRoute>
                        }
                      >
                        {/* Dashboard Home */}
                        <Route index element={<DashboardPage />} />
                        
                        {/* Orders Management */}
                        <Route path="orders">
                          <Route index element={<OrdersPage />} />
                          <Route path="new" element={<CreateOrderPage />} />
                          <Route path=":id" element={<OrderDetailsPage />} />
                        </Route>

                        {/* Customers Management */}
                        <Route path="customers">
                          <Route index element={<CustomersPage />} />
                          <Route path=":id" element={<CustomerDetailsPage />} />
                        </Route>

                        {/* Products Management */}
                        <Route path="products">
                          <Route index element={<ProductsPage />} />
                          <Route path=":id" element={<ProductDetailsPage />} />
                        </Route>

                        {/* Delivery Providers */}
                        <Route path="delivery-providers" element={<DeliveryProvidersPage />} />

                        {/* Communications */}
                        <Route path="communications" element={<CommunicationsPage />} />

                        {/* Automation */}
                        <Route path="automation" element={<AutomationPage />} />

                        {/* Analytics & Reports */}
                        <Route path="analytics" element={<AnalyticsPage />} />

                        {/* User Management */}
                        <Route path="users" element={<UsersPage />} />

                        {/* Settings */}
                        <Route path="settings" element={<SettingsPage />} />
                      </Route>

                      {/* Redirects */}
                      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

                      {/* 404 Page */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>

                    {/* Global Toast Notifications */}
                    <Toaster
                      position="top-right"
                      toastOptions={{
                        duration: 4000,
                        style: {
                          background: '#363636',
                          color: '#fff',
                        },
                        success: {
                          duration: 3000,
                          iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                          },
                        },
                        error: {
                          duration: 5000,
                          iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                          },
                        },
                      }}
                    />
                  </div>
                </Router>
              </TenantProvider>
            </AuthProvider>
          </ThemeProvider>
          
          {/* React Query DevTools (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;