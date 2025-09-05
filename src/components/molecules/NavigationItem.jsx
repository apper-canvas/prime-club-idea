import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative ${
          isActive 
            ? "bg-gradient-to-r from-mint to-blue text-teal-800 shadow-sm" 
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-gradient-to-r from-mint to-blue rounded-lg"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <div className="relative flex items-center w-full">
            <ApperIcon name={icon} className="w-5 h-5 mr-3" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="ml-2 bg-gradient-to-r from-pink to-red-300 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
        </>
      )}
    </NavLink>
  );
};

export default NavigationItem;