import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-3"
              onClick={onMenuClick}
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Settings" className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-mint to-blue rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-teal-800" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;