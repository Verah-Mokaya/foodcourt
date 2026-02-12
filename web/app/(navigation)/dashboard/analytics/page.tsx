"use client";

import { useAuth } from "@/app/context/AuthContext";
import { fetcher } from "@/app/lib/api";
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Loader2,
    TrendingUp,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { cn } from "@/app/lib/utils";

// Types
interface OverviewStats {
    total_orders: number;
    total_revenue: number;
    orders_today: number;
    revenue_today: number;
}

interface OrderStatus {
    pending: number;
    completed: number;
    cancelled: number;
}

interface DailyRevenue {
    date: string;
    revenue: number;
}

interface WeeklyRevenue {
    current_week_revenue: number;
    previous_week_revenue: number;
    growth_percentage: number;
}

interface PopularItem {
    item_name: string;
    total_quantity: number;
    total_revenue: number;
}

// Simple Card components since we don't have them in ui lib
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("rounded-xl border bg-card text-card-foreground shadow bg-white", className)}>
        {children}
    </div>
);

const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
        {children}
    </div>
);

const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <h3 className={cn("font-semibold leading-none tracking-tight", className)}>
        {children}
    </h3>
);

const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("p-6 pt-0", className)}>
        {children}
    </div>
);

export default function AnalyticsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState<OverviewStats | null>(null);
    const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([]);
    const [weeklyRevenue, setWeeklyRevenue] = useState<WeeklyRevenue | null>(null);
    const [popularItems, setPopularItems] = useState<PopularItem[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const [
                    overviewRes,
                    dailyRes,
                    weeklyRes,
                    popularRes
                ] = await Promise.all([
                    fetcher<OverviewStats>("/analytics/overview"),
                    fetcher<{ daily_revenue: DailyRevenue[] }>("/analytics/revenue/daily"),
                    fetcher<WeeklyRevenue>("/analytics/revenue/weekly"),
                    fetcher<{ popular_items: PopularItem[] }>("/analytics/popular-items")
                ]);

                if (overviewRes) setOverview(overviewRes);
                if (dailyRes && dailyRes.daily_revenue) setDailyRevenue(dailyRes.daily_revenue);
                if (weeklyRes) setWeeklyRevenue(weeklyRes);
                if (popularRes && popularRes.popular_items) setPopularItems(popularRes.popular_items);

            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAnalytics();
        }
    }, [user, fetcher]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            KES {overview?.total_revenue?.toLocaleString() || "0"}
                        </div>
                        <p className="text-xs text-gray-500">
                            Lifetime revenue
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overview?.total_orders || 0}</div>
                        <p className="text-xs text-gray-500">
                            Lifetime orders
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Today's Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            KES {overview?.revenue_today?.toLocaleString() || "0"}
                        </div>
                        <p className="text-xs text-gray-500">
                            From {overview?.orders_today || 0} orders today
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Weekly Growth</CardTitle>
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <div className="text-2xl font-bold">
                                {weeklyRevenue?.growth_percentage}%
                            </div>
                            {weeklyRevenue && weeklyRevenue.growth_percentage >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 text-green-500" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-500" />
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            Compared to last week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-gray-400">Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyRevenue}>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return `${date.getDate()}/${date.getMonth() + 1}`;
                                        }}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `K${value}`}
                                    />
                                    <Tooltip
                                        formatter={(value: any) => [`KES ${Number(value).toLocaleString()}`, 'Revenue']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#ea580c"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-gray-400">Top Selling Items</CardTitle>
                        <p className="text-sm text-gray-500">
                            Most popular items by quantity sold
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-gray-400">
                            {popularItems.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="ml-4 space-y-1 flex-1">
                                        <p className="text-sm font-medium leading-none">{item.item_name}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.total_quantity} sold
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        KES {item.total_revenue.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {popularItems.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No sales data available yet.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
