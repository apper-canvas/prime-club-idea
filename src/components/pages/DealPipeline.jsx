import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { leadService } from "@/services/api/leadService";
import { format } from "date-fns";

const DealPipeline = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);

  const stages = [
    { key: "Lead", label: "New Leads", color: "mint" },
    { key: "Qualified", label: "Qualified", color: "blue" },
    { key: "Proposal", label: "Proposal", color: "purple" },
    { key: "Negotiation", label: "Negotiation", color: "peach" },
    { key: "Closed Won", label: "Won", color: "mint" },
    { key: "Closed Lost", label: "Lost", color: "pink" }
  ];

  const loadLeads = async () => {
    try {
      setError(null);
      setLoading(true);
      const leadsData = await leadService.getAll();
      setLeads(leadsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const getLeadsByStage = (stage) => {
    return leads.filter(lead => lead.stage === stage);
  };

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    
    if (!draggedLead || draggedLead.stage === newStage) {
      setDraggedLead(null);
      return;
    }

    try {
      const statusMap = {
        "Lead": "New",
        "Qualified": "Qualified",
        "Proposal": "Proposal", 
        "Negotiation": "Negotiation",
        "Closed Won": "Closed Won",
        "Closed Lost": "Closed Lost"
      };

      const updatedLead = await leadService.updateStatus(
        draggedLead.Id, 
        statusMap[newStage], 
        newStage
      );
      
      setLeads(prev => prev.map(lead => 
        lead.Id === updatedLead.Id ? updatedLead : lead
      ));
      
      toast.success(`Lead moved to ${newStage}`);
    } catch (error) {
      toast.error("Failed to update lead stage");
    } finally {
      setDraggedLead(null);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const wonValue = leads
    .filter(lead => lead.stage === "Closed Won")
    .reduce((sum, lead) => sum + lead.value, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Deal Pipeline</h1>
            <p className="text-gray-600">Track deals through each stage of your sales process.</p>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-br from-mint to-teal-200 rounded-xl p-6 text-teal-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Total Pipeline</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              </div>
              <ApperIcon name="DollarSign" className="w-8 h-8" />
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
                <p className="text-sm font-medium mb-1">Active Deals</p>
                <p className="text-2xl font-bold">
                  {leads.filter(lead => !["Closed Won", "Closed Lost"].includes(lead.stage)).length}
                </p>
              </div>
              <ApperIcon name="GitBranch" className="w-8 h-8" />
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
                <p className="text-sm font-medium mb-1">Won This Month</p>
                <p className="text-2xl font-bold">${wonValue.toLocaleString()}</p>
              </div>
              <ApperIcon name="Trophy" className="w-8 h-8" />
            </div>
          </motion.div>
          
          <motion.div
            className="bg-gradient-to-br from-peach to-orange-200 rounded-xl p-6 text-amber-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Win Rate</p>
                <p className="text-2xl font-bold">
                  {leads.length > 0 ? Math.round((leads.filter(l => l.stage === "Closed Won").length / leads.length) * 100) : 0}%
                </p>
              </div>
              <ApperIcon name="Target" className="w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stages.map((stage, stageIndex) => {
            const stageLeads = getLeadsByStage(stage.key);
            
            return (
              <div
                key={stage.key}
                className="bg-gray-50 rounded-lg p-4 min-h-[500px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.key)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  <Badge variant={stage.color}>
                    {stageLeads.length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {stageLeads.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <ApperIcon name="Inbox" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No deals
                    </div>
                  ) : (
                    stageLeads.map((lead, leadIndex) => (
                      <motion.div
                        key={lead.Id}
                        className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stageIndex * 0.1 + leadIndex * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.05, zIndex: 50 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {lead.name}
                          </h4>
                          {lead.isHotlist && (
                            <ApperIcon name="Flame" className="w-4 h-4 text-red-500 flex-shrink-0 ml-1" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2 truncate">{lead.company}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            ${lead.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(lead.lastContact), "MMM d")}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{lead.assignedTo}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DealPipeline;