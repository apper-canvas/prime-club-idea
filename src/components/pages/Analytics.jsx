import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";
import { dealService } from "@/services/api/dealService";

const Analytics = () => {
  const [data, setData] = useState({
    leads: [],
    deals: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalyticsData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [leadsData, dealsData] = await Promise.all([
        leadService.getAll(),
        dealService.getAll()
      ]);
      setData({ leads: leadsData, deals: dealsData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadAnalyticsData} />;

  // Calculate metrics
  const totalLeads = data.leads.length;
  const conversionRate = totalLeads > 0 ? Math.round((data.leads.filter(l => l.status === "Closed Won").length / totalLeads) * 100) : 0;
  const totalRevenue = data.leads.filter(l => l.status === "Closed Won").reduce((sum, lead) => sum + lead.value, 0);
  const avgDealSize = data.leads.filter(l => l.status === "Closed Won").length > 0 
    ? Math.round(totalRevenue / data.leads.filter(l => l.status === "Closed Won").length) 
    : 0;

  // Status distribution for pie chart
  const statusCounts = data.leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    series: Object.values(statusCounts),
    options: {
      chart: { type: "pie" },
      labels: Object.keys(statusCounts),
      colors: ["#9FEBE1", "#B8CEFF", "#EAC2FF", "#FFE9CF", "#FFAEB4", "#F87171"],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 200 },
          legend: { position: "bottom" }
        }
      }]
    }
  };

  // Revenue by month (simulated)
  const revenueData = {
    series: [{
      name: "Revenue",
      data: [45000, 52000, 48000, 61000, 55000, 67000]
    }],
    options: {
      chart: { type: "area" },
      xaxis: { categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
      colors: ["#9FEBE1"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2
        }
      }
    }
  };

  // Lead sources (simulated)
  const sourceData = {
    series: [{
      name: "Leads",
      data: [23, 18, 15, 12, 8, 4]
    }],
    options: {
      chart: { type: "bar" },
      xaxis: { categories: ["Website", "Referral", "Social", "Email", "Cold Call", "Events"] },
      colors: ["#B8CEFF"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false
        }
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your sales performance.</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Leads"
            value={totalLeads}
            icon="Users"
            color="mint"
            trend={12}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon="TrendingUp"
            color="blue"
            trend={5}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon="DollarSign"
            color="purple"
            trend={18}
          />
          <MetricCard
            title="Avg Deal Size"
            value={`$${avgDealSize.toLocaleString()}`}
            icon="Target"
            color="peach"
            trend={-3}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Status Distribution */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-mint to-blue rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="PieChart" className="w-5 h-5 text-teal-800" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Lead Status Distribution</h2>
          </div>
          {Object.keys(statusCounts).length > 0 ? (
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="pie"
              height={300}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </motion.div>

        {/* Revenue Trend */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue to-indigo-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="TrendingUp" className="w-5 h-5 text-blue-800" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
          </div>
          <Chart
            options={revenueData.options}
            series={revenueData.series}
            type="area"
            height={300}
          />
        </motion.div>

        {/* Lead Sources */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple to-violet-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="BarChart3" className="w-5 h-5 text-purple-800" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Lead Sources</h2>
          </div>
          <Chart
            options={sourceData.options}
            series={sourceData.series}
            type="bar"
            height={300}
          />
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-peach to-orange-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Award" className="w-5 h-5 text-amber-800" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Performance Summary</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-mint to-teal-100 rounded-lg">
              <div>
                <p className="text-sm text-teal-700">Won Deals</p>
                <p className="text-2xl font-bold text-teal-800">
                  {data.leads.filter(l => l.status === "Closed Won").length}
                </p>
              </div>
              <ApperIcon name="Trophy" className="w-8 h-8 text-teal-600" />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue to-indigo-100 rounded-lg">
              <div>
                <p className="text-sm text-blue-700">In Progress</p>
                <p className="text-2xl font-bold text-blue-800">
                  {data.leads.filter(l => ["Qualified", "Proposal", "Negotiation"].includes(l.status)).length}
                </p>
              </div>
              <ApperIcon name="Clock" className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-pink to-red-100 rounded-lg">
              <div>
                <p className="text-sm text-red-700">Hotlist</p>
                <p className="text-2xl font-bold text-red-800">
                  {data.leads.filter(l => l.isHotlist).length}
                </p>
              </div>
              <ApperIcon name="Flame" className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;