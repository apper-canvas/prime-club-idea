import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ title, value, icon, trend, color = "mint", className }) => {
  const colorStyles = {
    mint: "from-mint to-teal-200",
    blue: "from-blue to-indigo-200",
    purple: "from-purple to-violet-200",
    peach: "from-peach to-orange-200",
    pink: "from-pink to-rose-200"
  };

  return (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                className={`w-4 h-4 mr-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
              />
              <span className={`text-sm font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${colorStyles[color]} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;