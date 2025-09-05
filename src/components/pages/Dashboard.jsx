import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";
import { dealService } from "@/services/api/dealService";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalLeads: 0,
    conversionRate: 0,
    revenue: 0,
    activeDeals: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);

      const [leads, deals] = await Promise.all([
        leadService.getAll(),
        dealService.getAll()
      ]);

      // Calculate metrics
      const totalLeads = leads.length;
      const closedWonLeads = leads.filter(lead => lead.status === "Closed Won").length;
      const conversionRate = totalLeads > 0 ? (closedWonLeads / totalLeads * 100) : 0;
      const revenue = leads
        .filter(lead => lead.status === "Closed Won")
        .reduce((sum, lead) => sum + lead.value, 0);
      const activeDeals = deals.filter(deal => 
        !["Closed Won", "Closed Lost"].includes(deal.stage)
      ).length;

      setMetrics({
        totalLeads,
        conversionRate: Math.round(conversionRate),
        revenue,
        activeDeals
      });

      // Get recent leads (last 5)
      const sortedLeads = [...leads]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentLeads(sortedLeads);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your leads.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Leads"
          value={metrics.totalLeads}
          icon="Users"
          color="mint"
          trend={12}
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          icon="TrendingUp"
          color="blue"
          trend={3}
        />
        <MetricCard
          title="Revenue"
          value={`$${metrics.revenue.toLocaleString()}`}
          icon="DollarSign"
          color="purple"
          trend={8}
        />
        <MetricCard
          title="Active Deals"
          value={metrics.activeDeals}
          icon="GitBranch"
          color="peach"
          trend={-2}
        />
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h2>
        <div className="space-y-4">
          {recentLeads.map((lead, index) => (
            <motion.div
              key={lead.Id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-mint to-blue rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-teal-800">
                    {lead.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${lead.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{lead.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;