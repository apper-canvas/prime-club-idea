import React from "react";
import { motion } from "framer-motion";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { to: "/", icon: "BarChart3", label: "Dashboard" },
    { to: "/leads", icon: "Users", label: "Leads" },
    { to: "/hotlist", icon: "Flame", label: "Hotlist", badge: "4" },
    { to: "/pipeline", icon: "GitBranch", label: "Deal Pipeline" },
    { to: "/calendar", icon: "Calendar", label: "Calendar" },
    { to: "/analytics", icon: "PieChart", label: "Analytics" },
    { to: "/leaderboard", icon: "Trophy", label: "Leaderboard" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-mint to-blue rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Zap" className="w-5 h-5 text-teal-800" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Prime Club</h1>
              </div>
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavigationItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 flex z-40">
            <motion.div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.div
              className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={onClose}
                >
                  <span className="sr-only">Close sidebar</span>
                  <ApperIcon name="X" className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-shrink-0 flex items-center px-4 mb-8">
                <div className="w-8 h-8 bg-gradient-to-br from-mint to-blue rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Zap" className="w-5 h-5 text-teal-800" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Prime Club</h1>
              </div>
              <div className="mt-5 flex-1 h-0 overflow-y-auto">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavigationItem
                      key={item.to}
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      badge={item.badge}
                    />
                  ))}
                </nav>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;