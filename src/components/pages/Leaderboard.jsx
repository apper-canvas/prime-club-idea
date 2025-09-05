import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { leadService } from "@/services/api/leadService";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("month");

  const loadLeaderboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      const leads = await leadService.getAll();
      
      // Group by assignedTo and calculate metrics
      const salesReps = leads.reduce((acc, lead) => {
        const rep = lead.assignedTo;
        if (!acc[rep]) {
          acc[rep] = {
            name: rep,
            totalLeads: 0,
            wonDeals: 0,
            totalValue: 0,
            wonValue: 0,
            hotlistLeads: 0
          };
        }
        
        acc[rep].totalLeads += 1;
        acc[rep].totalValue += lead.value;
        
        if (lead.status === "Closed Won") {
          acc[rep].wonDeals += 1;
          acc[rep].wonValue += lead.value;
        }
        
        if (lead.isHotlist) {
          acc[rep].hotlistLeads += 1;
        }
        
        return acc;
      }, {});

      // Convert to array and calculate additional metrics
      const leaderboard = Object.values(salesReps).map(rep => ({
        ...rep,
        conversionRate: rep.totalLeads > 0 ? Math.round((rep.wonDeals / rep.totalLeads) * 100) : 0,
        avgDealSize: rep.wonDeals > 0 ? Math.round(rep.wonValue / rep.wonDeals) : 0
      }));

      // Sort by won value (primary metric)
      leaderboard.sort((a, b) => b.wonValue - a.wonValue);
      
      setLeaderboardData(leaderboard);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [timeframe]);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return "Trophy";
      case 1: return "Award";
      case 2: return "Medal";
      default: return "User";
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0: return "from-yellow-400 to-yellow-600";
      case 1: return "from-gray-300 to-gray-500";
      case 2: return "from-amber-400 to-amber-600";
      default: return "from-mint to-blue";
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadLeaderboardData} />;

  const topPerformer = leaderboardData[0];
  const totalRevenue = leaderboardData.reduce((sum, rep) => sum + rep.wonValue, 0);
  const totalDeals = leaderboardData.reduce((sum, rep) => sum + rep.wonDeals, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Trophy" className="w-5 h-5 text-yellow-800" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            </div>
            <p className="text-gray-600">Track team performance and celebrate top achievers.</p>
          </div>
          
          <div>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-mint focus:border-mint"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-6 text-yellow-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Top Performer</p>
                <p className="text-xl font-bold">{topPerformer?.name || "N/A"}</p>
              </div>
              <ApperIcon name="Crown" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-mint to-teal-200 rounded-xl p-6 text-teal-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Team Revenue</p>
                <p className="text-xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <ApperIcon name="DollarSign" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-blue to-indigo-200 rounded-xl p-6 text-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Total Deals Won</p>
                <p className="text-xl font-bold">{totalDeals}</p>
              </div>
              <ApperIcon name="Target" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-purple to-violet-200 rounded-xl p-6 text-purple-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Active Reps</p>
                <p className="text-xl font-bold">{leaderboardData.length}</p>
              </div>
              <ApperIcon name="Users" className="w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-mint to-blue">
          <h2 className="text-lg font-semibold text-teal-800">Sales Team Rankings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Rep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deals Won
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Deal Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotlist
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((rep, index) => (
                <motion.tr
                  key={rep.name}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getRankColor(index)} rounded-full flex items-center justify-center mr-3`}>
                        <ApperIcon name={getRankIcon(index)} className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rep.name}</div>
                    <div className="text-sm text-gray-500">{rep.totalLeads} total leads</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      ${rep.wonValue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rep.wonDeals}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={rep.conversionRate >= 30 ? "won" : rep.conversionRate >= 15 ? "warning" : "default"}>
                      {rep.conversionRate}%
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${rep.avgDealSize.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ApperIcon name="Flame" className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-sm text-gray-900">{rep.hotlistLeads}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;