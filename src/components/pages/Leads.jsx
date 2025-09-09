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
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [multiUrlInput, setMultiUrlInput] = useState("");
  const [showMultiUrlInput, setShowMultiUrlInput] = useState(false);
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

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''}? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        await leadService.bulkDelete(selectedLeads);
        setLeads(prev => prev.filter(lead => !selectedLeads.includes(lead.Id)));
        setSelectedLeads([]);
        toast.success(`${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''} deleted successfully`);
      } catch (error) {
        toast.error("Failed to delete selected leads");
      }
    }
  };

  const normalizeUrl = (url) => {
    if (!url) return "";
    let normalized = url.trim().toLowerCase();
    normalized = normalized.replace(/^https?:\/\//, "");
    normalized = normalized.replace(/^www\./, "");
    normalized = normalized.replace(/\/$/, "");
    return normalized;
  };

  const handleMultiUrlImport = async () => {
    if (!multiUrlInput.trim()) return;
    
    const urls = multiUrlInput
      .split(/[\s\n,]+/)
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urls.length === 0) {
      toast.error("No valid URLs found");
      return;
    }

    // Get existing URLs for duplicate detection
    const existingUrls = new Set(leads.map(lead => normalizeUrl(lead.websiteUrl)));
    
    // Remove duplicates and existing URLs
    const uniqueUrls = [...new Set(urls.map(normalizeUrl))]
      .filter(url => !existingUrls.has(url))
      .map(url => {
        // Find original URL format
        return urls.find(originalUrl => normalizeUrl(originalUrl) === url);
      });

    if (uniqueUrls.length === 0) {
      toast.info("All URLs are duplicates or already exist");
      return;
    }

    try {
      const newLeads = [];
      for (const url of uniqueUrls) {
        const leadData = {
          productName: `Company from ${url}`,
          name: "Auto-imported Lead",
          websiteUrl: url.startsWith('http') ? url : `https://${url}`,
          teamSize: "",
          arr: "",
          category: "",
          status: "New",
          fundingType: "",
          edition: "",
          salesRep: "",
          followUpReminder: ""
        };
        
        const createdLead = await leadService.create(leadData);
        newLeads.push(createdLead);
      }
      
      setLeads(prev => [...prev, ...newLeads]);
      setMultiUrlInput("");
      setShowMultiUrlInput(false);
      
      const duplicatesCount = urls.length - uniqueUrls.length;
      let message = `${uniqueUrls.length} lead${uniqueUrls.length > 1 ? 's' : ''} imported successfully`;
      if (duplicatesCount > 0) {
        message += ` (${duplicatesCount} duplicate${duplicatesCount > 1 ? 's' : ''} skipped)`;
      }
      toast.success(message);
      
    } catch (error) {
      toast.error("Failed to import leads");
    }
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
            <Button 
              variant="secondary" 
              onClick={() => setShowMultiUrlInput(!showMultiUrlInput)}
            >
              <ApperIcon name="Link" size={16} className="mr-2" />
              Import URLs
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
{/* Multi-URL Import Section */}
        {showMultiUrlInput && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Import Multiple URLs</h3>
                <p className="text-sm text-gray-600">Paste multiple URLs separated by spaces, commas, or new lines. Duplicates will be automatically removed.</p>
              </div>
              <Button variant="outline" onClick={() => setShowMultiUrlInput(false)}>
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            <div className="space-y-4">
              <textarea
                value={multiUrlInput}
                onChange={(e) => setMultiUrlInput(e.target.value)}
                placeholder="https://example1.com&#10;https://example2.com&#10;example3.com"
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint focus:border-mint resize-none"
              />
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setMultiUrlInput("")}>
                  Clear
                </Button>
                <Button variant="primary" onClick={handleMultiUrlImport}>
                  <ApperIcon name="Upload" size={16} className="mr-2" />
                  Import URLs
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Bulk Actions Toolbar */}
        {selectedLeads.length > 0 && (
          <motion.div 
            className="bg-mint/10 border border-mint/20 rounded-lg p-4 mb-6 flex items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-4">
              <p className="text-sm font-medium text-gray-700">
                {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
              </p>
              <Button variant="outline" onClick={() => setSelectedLeads([])}>
                Clear Selection
              </Button>
            </div>
            <Button variant="danger" onClick={handleBulkDelete}>
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete Selected
            </Button>
          </motion.div>
        )}

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
                {selectedLeads.length > 0 && (
                  <span className="ml-2 text-mint font-medium">
                    ({selectedLeads.length} selected)
                  </span>
                )}
              </p>
            </div>
            <LeadsTable 
              leads={filteredLeads} 
              onLeadUpdate={handleLeadUpdate}
              selectedLeads={selectedLeads}
              onSelectionChange={setSelectedLeads}
              showBulkActions={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Leads;