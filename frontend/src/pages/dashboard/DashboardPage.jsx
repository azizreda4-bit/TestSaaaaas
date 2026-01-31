import React from 'react';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingBagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

import { dashboardService } from '@/services/dashboardService';
import { useAuth } from '@/contexts/AuthContext';

import StatsCard from '@/components/dashboard/StatsCard';
import OrdersChart from '@/components/dashboard/OrdersChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopProducts from '@/components/dashboard/TopProducts';
import DeliveryProviderStats from '@/components/dashboard/DeliveryProviderStats';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

function DashboardPage() {
  const { user, tenant } = useAuth();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['dashboard', tenant?.id],
    () => dashboardService.getDashboardStats(),
    {
      enabled: !!tenant?.id,
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage
          title="Failed to load dashboard"
          message={error.message}
          onRetry={refetch}
        />
      </div>
    );
  }

  const stats = dashboardData?.data || {};

  // Calculate percentage changes (mock data for now)
  const getPercentageChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.orders?.total || 0,
      change: getPercentageChange(stats.orders?.thisMonth, stats.orders?.lastMonth),
      icon: ShoppingBagIcon,
      color: 'blue',
      subtitle: `${stats.orders?.thisMonth || 0} this month`,
    },
    {
      title: 'Confirmed Orders',
      value: stats.orders?.confirmed || 0,
      change: stats.orders?.confirmationRate || 0,
      icon: CheckCircleIcon,
      color: 'green',
      subtitle: `${stats.orders?.confirmationRate || 0}% confirmation rate`,
      isPercentage: true,
    },
    {
      title: 'Total Revenue',
      value: stats.revenue?.total || 0,
      change: getPercentageChange(stats.revenue?.thisMonth, stats.revenue?.lastMonth),
      icon: CurrencyDollarIcon,
      color: 'emerald',
      subtitle: `${stats.revenue?.thisMonth || 0} MAD this month`,
      isCurrency: true,
    },
    {
      title: 'Customers',
      value: stats.customers?.total || 0,
      change: getPercentageChange(stats.customers?.newThisMonth, stats.customers?.newLastMonth),
      icon: UserGroupIcon,
      color: 'purple',
      subtitle: `${stats.customers?.newThisMonth || 0} new this month`,
    },
    {
      title: 'Delivered Orders',
      value: stats.orders?.delivered || 0,
      change: stats.orders?.deliveryRate || 0,
      icon: TruckIcon,
      color: 'indigo',
      subtitle: `${stats.orders?.deliveryRate || 0}% delivery rate`,
      isPercentage: true,
    },
    {
      title: 'Pending Orders',
      value: stats.orders?.pending || 0,
      change: 0,
      icon: ClockIcon,
      color: 'yellow',
      subtitle: 'Awaiting confirmation',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - DeliveryHub</title>
        <meta name="description" content="DeliveryHub dashboard with order statistics and analytics" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your orders today.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tenant?.name}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                {tenant?.subscriptionPlan} Plan
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
              subtitle={stat.subtitle}
              isCurrency={stat.isCurrency}
              isPercentage={stat.isPercentage}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Chart */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Orders Overview
              </h3>
              <select className="text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            <OrdersChart data={stats.ordersChart} />
          </div>

          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Revenue Trend
              </h3>
              <select className="text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            <RevenueChart data={stats.revenueChart} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
                <a
                  href="/orders"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
                >
                  View all
                </a>
              </div>
              <RecentOrders orders={stats.recentOrders} />
            </div>
          </div>

          {/* Top Products */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Top Products
              </h3>
              <TopProducts products={stats.topProducts} />
            </div>

            {/* Delivery Provider Stats */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Delivery Performance
              </h3>
              <DeliveryProviderStats providers={stats.providerStats} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/orders/new"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ShoppingBagIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">New Order</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create a new order</p>
              </div>
            </a>

            <a
              href="/customers"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <UserGroupIcon className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Customers</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage customers</p>
              </div>
            </a>

            <a
              href="/communications"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <TruckIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Send Messages</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">WhatsApp & SMS</p>
              </div>
            </a>

            <a
              href="/analytics"
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <CurrencyDollarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Analytics</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">View reports</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;