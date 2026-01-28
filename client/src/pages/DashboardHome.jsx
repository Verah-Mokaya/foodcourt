import React from 'react';

const DashboardHome = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Stats Cards */}
                {[
                    { label: 'Total Orders', value: '1,234', change: '+12%', color: 'blue' },
                    { label: 'Total Revenue', value: '$12,340', change: '+8%', color: 'green' },
                    { label: 'Active Bookings', value: '56', change: '-2%', color: 'orange' },
                    { label: 'New Customers', value: '128', change: '+24%', color: 'purple' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                        <div className="flex items-end justify-between mt-2">
                            <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <p className="text-gray-500">Activity feed placeholder...</p>
            </div>
        </div>
    );
};

export default DashboardHome;
