import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { leadService } from "@/services/api/leadService";
import { format } from "date-fns";

const LeadsTable = ({ leads, onLeadUpdate }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "new": return "new";
      case "qualified": return "qualified";
      case "proposal": return "proposal";
      case "negotiation": return "negotiation";
      case "closed won": return "won";
      case "closed lost": return "lost";
      default: return "default";
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    try {
      const updatedLead = await leadService.updateStatus(leadId, newStatus);
      onLeadUpdate(updatedLead);
      toast.success("Lead status updated successfully");
    } catch (error) {
      toast.error("Failed to update lead status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleHotlist = async (leadId) => {
    setUpdatingId(leadId);
    try {
      const updatedLead = await leadService.toggleHotlist(leadId);
      onLeadUpdate(updatedLead);
      toast.success(updatedLead.isHotlist ? "Added to hotlist" : "Removed from hotlist");
    } catch (error) {
      toast.error("Failed to update hotlist status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gradient-to-r from-mint to-blue">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Assigned To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Last Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.map((lead, index) => (
            <motion.tr
              key={lead.Id}
              className="hover:bg-gray-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-mint to-blue rounded-full flex items-center justify-center mr-3">
                    <ApperIcon name="User" className="w-5 h-5 text-teal-800" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{lead.company}</div>
                <div className="text-sm text-gray-500">{lead.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusVariant(lead.status)}>
                  {lead.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${lead.value.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {lead.assignedTo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(lead.lastContact), "MMM d, yyyy")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Button
                  variant={lead.isHotlist ? "danger" : "outline"}
                  size="sm"
                  onClick={() => handleToggleHotlist(lead.Id)}
                  disabled={updatingId === lead.Id}
                  className="flex items-center gap-1"
                >
                  <ApperIcon 
                    name={lead.isHotlist ? "Flame" : "Plus"} 
                    size={14} 
                  />
                  {lead.isHotlist ? "Hot" : "Add"}
                </Button>
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.Id, e.target.value)}
                  disabled={updatingId === lead.Id}
                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                >
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;