import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { leadService } from "@/services/api/leadService";
import { dealService } from "@/services/api/dealService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";

const Calendar = () => {
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadCalendarData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [dealsData] = await Promise.all([
        dealService.getAll()
      ]);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDealsForDate = (date) => {
    return deals.filter(deal => isSameDay(new Date(deal.closeDate), date));
  };

  const getTotalValueForDate = (date) => {
    const dateDeals = getDealsForDate(date);
    return dateDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const selectedDateDeals = getDealsForDate(selectedDate);
  const monthDeals = deals.filter(deal => {
    const dealDate = new Date(deal.closeDate);
    return dealDate >= monthStart && dealDate <= monthEnd;
  });
  const monthValue = monthDeals.reduce((sum, deal) => sum + deal.value, 0);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadCalendarData} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
            <p className="text-gray-600">Track deal timelines and important dates.</p>
          </div>
        </div>

        {/* Calendar Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-mint to-teal-200 rounded-xl p-6 text-teal-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">This Month</p>
                <p className="text-2xl font-bold">{monthDeals.length} deals</p>
              </div>
              <ApperIcon name="Calendar" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-blue to-indigo-200 rounded-xl p-6 text-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Month Value</p>
                <p className="text-2xl font-bold">${monthValue.toLocaleString()}</p>
              </div>
              <ApperIcon name="DollarSign" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-purple to-violet-200 rounded-xl p-6 text-purple-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Selected Date</p>
                <p className="text-2xl font-bold">{selectedDateDeals.length} deals</p>
              </div>
              <ApperIcon name="Target" className="w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(day => {
              const dayDeals = getDealsForDate(day);
              const dayValue = getTotalValueForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <motion.button
                  key={day.toISOString()}
                  className={`
                    relative p-3 text-left rounded-lg border-2 transition-all min-h-[80px]
                    ${isSelected 
                      ? "border-mint bg-mint text-teal-800" 
                      : "border-transparent hover:border-gray-200 hover:bg-gray-50"
                    }
                    ${isToday && !isSelected ? "bg-blue bg-opacity-20" : ""}
                  `}
                  onClick={() => handleDateClick(day)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(day, "d")}
                  </div>
                  {dayDeals.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs bg-gradient-to-r from-mint to-blue text-teal-800 px-1 py-0.5 rounded">
                        {dayDeals.length} deals
                      </div>
                      {dayValue > 0 && (
                        <div className="text-xs text-gray-600">
                          ${(dayValue / 1000).toFixed(0)}k
                        </div>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          
          {selectedDateDeals.length === 0 ? (
            <Empty
              title="No deals"
              description="No deals are scheduled for this date."
              icon="Calendar"
            />
          ) : (
            <div className="space-y-4">
              {selectedDateDeals.map(deal => (
                <motion.div
                  key={deal.Id}
                  className="border border-gray-200 rounded-lg p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{deal.title}</h4>
                    <Badge variant={deal.stage === "Closed Won" ? "won" : deal.stage === "Closed Lost" ? "lost" : "default"}>
                      {deal.stage}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Value: ${deal.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Probability: {deal.probability}%
                  </p>
                </motion.div>
              ))}
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900">
                  Total Value: ${getTotalValueForDate(selectedDate).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;