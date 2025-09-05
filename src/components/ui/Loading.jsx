import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <div className="space-y-4 p-6">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-mint to-blue rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-mint to-blue rounded animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-purple to-pink rounded w-2/3 animate-pulse" />
              </div>
              <div className="h-8 w-20 bg-gradient-to-r from-peach to-pink rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {[...Array(4)].map((_, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="space-y-3">
              <div className="h-6 bg-gradient-to-r from-mint to-blue rounded animate-pulse" />
              <div className="h-8 bg-gradient-to-r from-purple to-pink rounded animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-peach to-pink rounded w-1/2 animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-gradient-to-r from-mint to-blue rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;