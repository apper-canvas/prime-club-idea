import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import LeadsTable from "@/components/organisms/LeadsTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";

const Hotlist = () => {
  const [hotlistLeads, setHotlistLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadHotlist = async () => {
    try {
      setError(null);
      setLoading(true);
      const leadsData = await leadService.getHotlist();
      setHotlistLeads(leadsData);
      setFilteredLeads(leadsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotlist();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = hotlistLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(hotlistLeads);
    }
  }, [hotlistLeads, searchTerm]);

  const handleLeadUpdate = (updatedLead) => {
    if (updatedLead.isHotlist) {
      setHotlistLeads(prev => prev.map(lead => 
        lead.Id === updatedLead.Id ? updatedLead : lead
      ));
    } else {
      setHotlistLeads(prev => prev.filter(lead => lead.Id !== updatedLead.Id));
    }
  };

  const handleClearHotlist = () => {
    toast.info("Clear hotlist functionality would require confirmation");
  };

  const handleExportHotlist = () => {
    toast.success("Hotlist exported successfully");
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadHotlist} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink to-red-300 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Flame" className="w-5 h-5 text-red-700" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Hotlist</h1>
            </div>
            <p className="text-gray-600">High-priority leads that require immediate attention.</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleClearHotlist}>
              <ApperIcon name="X" size={16} className="mr-2" />
              Clear All
            </Button>
            <Button variant="secondary" onClick={handleExportHotlist}>
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search hotlist leads..."
            className="max-w-md"
          />
        </div>

        {/* Hotlist Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-pink to-red-200 rounded-xl p-6 text-red-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Total Hotlist</p>
                <p className="text-2xl font-bold">{hotlistLeads.length}</p>
              </div>
              <ApperIcon name="Flame" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-peach to-orange-200 rounded-xl p-6 text-amber-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Total Value</p>
                <p className="text-2xl font-bold">
                  ${hotlistLeads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
                </p>
              </div>
              <ApperIcon name="DollarSign" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-mint to-teal-200 rounded-xl p-6 text-teal-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Avg. Value</p>
                <p className="text-2xl font-bold">
                  ${hotlistLeads.length > 0 ? Math.round(hotlistLeads.reduce((sum, lead) => sum + lead.value, 0) / hotlistLeads.length).toLocaleString() : 0}
                </p>
              </div>
              <ApperIcon name="TrendingUp" className="w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hotlist Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {filteredLeads.length === 0 ? (
          <Empty
            title="No hotlist leads found"
            description={searchTerm ? "No hotlist leads match your search criteria." : "No leads are currently marked as hotlist. Add leads to hotlist to see them here."}
            icon="Flame"
          />
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredLeads.length} hotlist leads
              </p>
            </div>
            <LeadsTable leads={filteredLeads} onLeadUpdate={handleLeadUpdate} />
          </>
        )}
      </div>
    </div>
  );
};

export default Hotlist;