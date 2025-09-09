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

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadLeads = async () => {
    try {
      setError(null);
      setLoading(true);
      const leadsData = await leadService.getAll();
      setLeads(leadsData);
      setFilteredLeads(leadsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

useEffect(() => {
    let filtered = leads;

    // Apply search filter - now includes new fields
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.salesRep?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter - now includes new status options
    if (statusFilter !== "All") {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter]);

  const handleLeadUpdate = (updatedLead) => {
    setLeads(prev => prev.map(lead => 
      lead.Id === updatedLead.Id ? updatedLead : lead
    ));
  };

  const handleAddLead = () => {
    toast.info("Add lead functionality would open a modal here");
  };

  const handleExport = () => {
    toast.success("Leads exported successfully");
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads</h1>
            <p className="text-gray-600">Manage and track all your leads in one place.</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleExport}>
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            <Button variant="primary" onClick={handleAddLead}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

{/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by name, product, company, category, or sales rep..."
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-mint focus:border-mint"
            >
              <option value="All">All Status</option>
              <option value="Connected">Connected</option>
              <option value="Locked">Locked</option>
              <option value="Meeting Booked">Meeting Booked</option>
              <option value="Meeting Done">Meeting Done</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed">Closed</option>
              <option value="Lost">Lost</option>
              <option value="Launched on AppSumo">Launched on AppSumo</option>
              <option value="Launched on Prime Club">Launched on Prime Club</option>
              <option value="Keep an Eye">Keep an Eye</option>
              <option value="Rejected">Rejected</option>
              <option value="Unsubscribed">Unsubscribed</option>
              <option value="Outdated">Outdated</option>
              <option value="Hotlist">Hotlist</option>
              <option value="Out of League">Out of League</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {filteredLeads.length === 0 ? (
          <Empty
            title="No leads found"
            description="No leads match your current search criteria. Try adjusting your filters or add a new lead."
            actionText="Add Lead"
            onAction={handleAddLead}
            icon="Users"
          />
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
            </div>
            <LeadsTable leads={filteredLeads} onLeadUpdate={handleLeadUpdate} />
          </>
        )}
      </div>
    </div>
  );
};

export default Leads;