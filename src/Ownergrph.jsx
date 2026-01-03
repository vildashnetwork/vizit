import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

import "./owners.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function HouseAnalytics() {

    const [houses, setHouses] = useState([]);

    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const res = await axios.get("https://vizit-backend-hubw.onrender.com/api/house/houses");

                const housesData = Array.isArray(res.data.houses)
                    ? res.data.houses
                    : [];

                setHouses(housesData);
            } catch (error) {
                console.error("Failed to fetch houses", error);
                setHouses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHouses();
    }, []);


    const totalHouses = houses.length;

    const available = houses.filter(h => h.isAvalable).length;
    const unavailable = totalHouses - available;

    const avgRent =
        houses.reduce((sum, h) => sum + Number(h.rent || 0), 0) / totalHouses;

    const avgRating =
        houses.reduce((sum, h) => sum + (h.reviews?.overallRating || 0), 0) /
        totalHouses;

    const totalReviews = houses.reduce(
        (sum, h) => sum + (h.reviews?.totalReviews || 0),
        0
    );

    const rentCurve = houses.map((h, i) => ({
        specimen: `House ${i + 1}`,
        rent: Number(h.rent)
    }));

    const availabilityData = [
        { state: "Available", value: available },
        { state: "Unavailable", value: unavailable }
    ];

    const typeDistribution = Object.values(
        houses.reduce((acc, h) => {
            acc[h.type] = acc[h.type] || { type: h.type, value: 0 };
            acc[h.type].value += 1;
            return acc;
        }, {})
    );

    const reviewGrowth = houses.map((h, i) => ({
        specimen: `House ${i + 1}`,
        reviews: h.reviews?.totalReviews || 0
    }));

    if (loading) {
        return (
            <div className="bisque-bisque-loader">
                <div className="consomme-spinner">
                    <div className="foie-gras-ring"></div>
                    <div className="caviar-dots">
                        <div className="caviar-dot"></div>
                        <div className="caviar-dot"></div>
                        <div className="caviar-dot"></div>
                    </div>
                </div>
                <p className="bisque-text">Loading Portfolio...</p>
            </div>
        )
    }

    return (
        <div className="organismus-analytics">

            <div className="cellula-kpi-grid">
                <KPI title="Total Houses" value={totalHouses} />
                <KPI title="Available" value={available} />
                <KPI title="Average Rent" value={`${avgRent.toFixed(0)}FCFA`} />
                <KPI title="Avg Rating" value={avgRating.toFixed(1)} />
                <KPI title="Total Reviews" value={totalReviews} />
            </div>

            {/* CHARTS */}
            <div className="tissue-chart-grid">
                {/* Rent Curve */}
                <ChartCard title="Rent Distribution Curve">
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={rentCurve}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="specimen" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="rent"
                                stroke="#3b82f6"
                                strokeWidth={3}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Availability */}
                <ChartCard title="Availability State">
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={availabilityData}>
                            <XAxis dataKey="state" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Type Pie */}
                <ChartCard title="House Type Distribution">
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={typeDistribution}
                                dataKey="value"
                                nameKey="type"
                                outerRadius={90}
                                fill="#6366f1"
                                label
                            />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Review Growth */}
                <ChartCard title="Review Accumulation">
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={reviewGrowth}>
                            <XAxis dataKey="specimen" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="reviews"
                                stroke="#f97316"
                                fill="#fed7aa"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}

function KPI({ title, value }) {
    return (
        <div className="nucleus-kpi">
            <span className="chromatin-title">{title}</span>
            <span className="mitochondria-value">{value}</span>
        </div>
    );
}

function ChartCard({ title, children }) {
    return (
        <div className="histologia-card">
            <h3 className="epithelium-title">{title}</h3>
            {children}
        </div>
    );
}
