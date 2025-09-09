import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { leadService } from "@/services/api/leadService";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
const BUSINESS_CATEGORIES = [
  "Form Builder", "CRM", "Project Management", "Affiliate Management", "Help Desk", "Live Chat", 
  "Graphic Design", "WordPress Plugin", "VPN", "Landing Page Builder", "Meeting Assistant", 
  "Course Builder", "Sales Funnel Builder", "AI Writing Assistant", "Transcription Software",
  "Email Marketing", "Social Media Management", "SEO Tools", "Website Builder", "E-commerce Platform",
  "Inventory Management", "Accounting Software", "HR Management", "Payroll Software", "Time Tracking",
  "Video Conferencing", "File Sharing", "Cloud Storage", "Backup Solutions", "Security Software",
  "Password Manager", "VPN Service", "Antivirus", "Firewall", "Website Monitoring",
  "Analytics Tools", "Heatmap Software", "A/B Testing", "Survey Tools", "Feedback Management",
  "Customer Support", "Ticketing System", "Knowledge Base", "FAQ Software", "Chatbot Platform",
  "Marketing Automation", "Lead Generation", "CRM Integration", "Sales Analytics", "Pipeline Management",
  "Invoice Software", "Expense Tracking", "Financial Planning", "Tax Software", "Banking Tools",
  "Recruitment Software", "Applicant Tracking", "Employee Onboarding", "Performance Management", "Learning Management",
  "Content Management", "Blog Platform", "Newsletter Software", "Podcast Hosting", "Video Hosting",
  "Design Tools", "Photo Editor", "Vector Graphics", "Presentation Software", "Wireframing Tools",
  "Code Editor", "Version Control", "API Management", "Database Tools", "Server Monitoring",
  "Mobile App Builder", "Push Notifications", "App Analytics", "Beta Testing", "App Store Optimization",
  "Booking Software", "Appointment Scheduling", "Calendar Management", "Event Planning", "Reservation System",
  "Shipping Software", "Logistics Management", "Supply Chain", "Warehouse Management", "Delivery Tracking",
  "Review Management", "Reputation Monitoring", "Brand Management", "Influencer Marketing", "Affiliate Tracking",
  "Membership Software", "Subscription Management", "Billing Automation", "Payment Processing", "Donation Platform",
  "Real Estate CRM", "Property Management", "MLS Integration", "Virtual Tours", "Lead Capture",
  "Medical Practice", "Patient Management", "Telemedicine", "Health Records", "Appointment Booking",
  "Legal Practice", "Case Management", "Document Automation", "Time Billing", "Client Portal",
  "Restaurant POS", "Menu Management", "Online Ordering", "Delivery Management", "Kitchen Display",
  "Retail POS", "Inventory Control", "Customer Loyalty", "Gift Cards", "Multi-location Management",
  "Fitness Management", "Class Scheduling", "Member Check-in", "Personal Training", "Nutrition Tracking",
  "Education Platform", "Student Management", "Grade Book", "Parent Communication", "Online Learning"
];

const TEAM_SIZES = ["1-3", "4-10", "11-50", "51-200", "200+"];

const STATUS_OPTIONS = [
  "Connected", "Locked", "Meeting Booked", "Meeting Done", "Negotiation", "Closed", "Lost",
  "Launched on AppSumo", "Launched on Prime Club", "Keep an Eye", "Rejected", "Unsubscribed",
  "Outdated", "Hotlist", "Out of League"
];

const FUNDING_TYPES = ["Bootstrapped", "Pre-seed", "Y Combinator", "Angel", "Series A", "Series B", "Series C"];

const EDITIONS = ["Select Edition", "Black Edition", "Collector's Edition", "Limited Edition"];

const LeadsTable = ({ leads, onLeadUpdate, selectedLeads, onSelectionChange, showBulkActions = false }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [newLead, setNewLead] = useState({
    productName: "",
    name: "",
    websiteUrl: "",
    teamSize: "",
    arr: "",
    category: "",
    linkedinUrl: "",
    status: "",
    fundingType: "",
    edition: "",
    salesRep: "",
    followUpReminder: ""
  });
  const [isAddingLead, setIsAddingLead] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const formatUrl = (url) => {
    if (!url) return "";
    let formatted = url.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = "https://" + formatted;
    }
    return formatted.replace(/\/$/, "");
  };

  const generateLinkedInUrl = (websiteUrl) => {
    if (!websiteUrl) return "";
    const cleanUrl = websiteUrl.replace(/^https?:\/\//, "").replace(/^www\./, "").split('/')[0];
    const companyName = cleanUrl.split('.')[0];
    return `https://linkedin.com/company/${companyName}`;
  };

  const handleCellEdit = async (leadId, field, value) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        let processedValue = value;
        let updates = { [field]: processedValue };

        if (field === 'websiteUrl') {
          processedValue = formatUrl(value);
          updates.websiteUrl = processedValue;
          updates.linkedinUrl = generateLinkedInUrl(processedValue);
        }

        if (field === 'arr') {
          processedValue = parseFloat(value) || 0;
          updates.arr = processedValue;
        }

        const updatedLead = await leadService.update(leadId, updates);
        onLeadUpdate(updatedLead);
        toast.success("Lead updated successfully");
      } catch (error) {
        toast.error("Failed to update lead");
      }
    }, 500);
  };

  const handleAddLead = async () => {
    if (!newLead.productName || !newLead.name) {
      toast.error("Product name and name are required");
      return;
    }

    setIsAddingLead(true);
    try {
      const leadData = {
        ...newLead,
        websiteUrl: formatUrl(newLead.websiteUrl),
        linkedinUrl: newLead.websiteUrl ? generateLinkedInUrl(formatUrl(newLead.websiteUrl)) : "",
        arr: parseFloat(newLead.arr) || 0
      };

      const createdLead = await leadService.create(leadData);
      onLeadUpdate(createdLead);
      setNewLead({
        productName: "", name: "", websiteUrl: "", teamSize: "", arr: "",
        category: "", linkedinUrl: "", status: "", fundingType: "", edition: "",
        salesRep: "", followUpReminder: ""
      });
      toast.success("Lead created successfully");
    } catch (error) {
      toast.error("Failed to create lead");
    } finally {
      setIsAddingLead(false);
    }
  };

  const startEdit = (leadId, field, currentValue) => {
    setEditingCell(`${leadId}-${field}`);
    setEditValue(currentValue || "");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const finishEdit = (leadId, field) => {
    handleCellEdit(leadId, field, editValue);
    setEditingCell(null);
    setEditValue("");
  };

  const getStatusVariant = (status) => {
    const statusMap = {
      'connected': 'success', 'locked': 'danger', 'meeting booked': 'info', 'meeting done': 'success',
      'negotiation': 'warning', 'closed': 'success', 'lost': 'danger', 'launched on appsumo': 'primary',
      'launched on prime club': 'primary', 'keep an eye': 'info', 'rejected': 'danger',
      'unsubscribed': 'danger', 'outdated': 'warning', 'hotlist': 'success', 'out of league': 'danger'
    };
    return statusMap[status.toLowerCase()] || 'default';
  };

  const getFundingVariant = (funding) => {
    const fundingMap = {
      'bootstrapped': 'success', 'pre-seed': 'info', 'y combinator': 'primary',
      'angel': 'warning', 'series a': 'success', 'series b': 'success', 'series c': 'success'
    };
    return fundingMap[funding.toLowerCase()] || 'default';
  };

  const InlineInput = ({ value, onSave, type = "text", options = null, placeholder = "" }) => {
    if (options) {
      return (
        <select
          ref={inputRef}
          value={value}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onSave()}
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
          className="w-full px-2 py-1 text-xs border border-mint rounded bg-white focus:outline-none focus:ring-1 focus:ring-mint"
        >
          <option value="">Select...</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => onSave()}
        onKeyDown={(e) => e.key === 'Enter' && onSave()}
        placeholder={placeholder}
        className="w-full px-2 py-1 text-xs border border-mint rounded bg-white focus:outline-none focus:ring-1 focus:ring-mint"
      />
    );
  };

  const renderCell = (lead, field, value, type = "text", options = null) => {
    const cellKey = `${lead.Id}-${field}`;
    const isEditing = editingCell === cellKey;

    if (isEditing) {
      return (
        <InlineInput
          value={editValue}
          onSave={() => finishEdit(lead.Id, field)}
          type={type}
          options={options}
        />
      );
    }

    if (field === 'websiteUrl' || field === 'linkedinUrl') {
      return value ? (
        <div className="flex items-center gap-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline truncate max-w-32"
            onClick={(e) => e.stopPropagation()}
          >
            {value.replace(/^https?:\/\//, '')}
          </a>
          <ApperIcon
            name="Edit"
            size={12}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => startEdit(lead.Id, field, value)}
          />
        </div>
      ) : (
        <div
          className="text-gray-400 cursor-pointer hover:text-gray-600 flex items-center gap-1"
          onClick={() => startEdit(lead.Id, field, "")}
        >
          <span>Add URL</span>
          <ApperIcon name="Plus" size={12} />
        </div>
      );
    }

    if (field === 'status') {
      return (
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(value || '')}>
            {value || 'No Status'}
          </Badge>
          <ApperIcon
            name="Edit"
            size={12}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => startEdit(lead.Id, field, value)}
          />
        </div>
      );
    }

    if (field === 'fundingType') {
      return (
        <div className="flex items-center gap-2">
          <Badge variant={getFundingVariant(value || '')}>
            {value || 'No Funding'}
          </Badge>
          <ApperIcon
            name="Edit"
            size={12}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => startEdit(lead.Id, field, value)}
          />
        </div>
      );
    }

    if (field === 'arr') {
      const formattedValue = value ? `$${parseFloat(value).toFixed(1)}M` : '';
      return (
        <div
          className="cursor-pointer hover:bg-gray-100 px-1 py-1 rounded flex items-center gap-2"
          onClick={() => startEdit(lead.Id, field, value)}
        >
          <span>{formattedValue || 'Add ARR'}</span>
          <ApperIcon name="Edit" size={12} className="text-gray-400" />
        </div>
      );
    }

    if (field === 'followUpReminder' && value) {
      const date = new Date(value);
      return (
        <div
          className="cursor-pointer hover:bg-gray-100 px-1 py-1 rounded flex items-center gap-2"
          onClick={() => startEdit(lead.Id, field, value.split('T')[0])}
        >
          <span>{date.toLocaleDateString()}</span>
          <ApperIcon name="Edit" size={12} className="text-gray-400" />
        </div>
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-gray-100 px-1 py-1 rounded flex items-center gap-2"
        onClick={() => startEdit(lead.Id, field, value)}
      >
        <span className="truncate">{value || `Add ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}</span>
        <ApperIcon name="Edit" size={12} className="text-gray-400" />
      </div>
    );
  };

const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(leads.map(lead => lead.Id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectLead = (leadId, checked) => {
    if (checked) {
      onSelectionChange([...selectedLeads, leadId]);
    } else {
      onSelectionChange(selectedLeads.filter(id => id !== leadId));
    }
  };

  const isAllSelected = leads.length > 0 && selectedLeads.length === leads.length;
  const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < leads.length;

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gradient-to-r from-mint to-blue">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-32">
              Product Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-24">
              Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-40">
              Website URL
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-20">
              Team Size
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-20">
              ARR (M)
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-32">
              Category
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-40">
              LinkedIn URL
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-28">
              Status
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-24">
              Funding
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-32">
              Edition
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-24">
              Sales Rep
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider min-w-28">
              Follow-up
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
{showBulkActions && (
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-mint focus:ring-mint border-gray-300 rounded"
                  />
                </div>
              </th>
            )}
            {/* Empty row for direct entry */}
          <tr className="bg-white">
            <td className="px-3 py-2 text-sm">
              <input
                type="text"
                value={newLead.productName}
                onChange={(e) => setNewLead({...newLead, productName: e.target.value})}
                placeholder="Product name"
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              />
            </td>
            <td className="px-3 py-2 text-sm">
              <input
                type="text"
                value={newLead.name}
                onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                placeholder="Name"
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              />
            </td>
            <td className="px-3 py-2 text-sm">
              <input
                type="text"
                value={newLead.websiteUrl}
                onChange={(e) => {
                  const url = e.target.value;
                  setNewLead({
                    ...newLead, 
                    websiteUrl: url,
                    linkedinUrl: url ? generateLinkedInUrl(formatUrl(url)) : ""
                  });
                }}
                placeholder="Website URL"
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              />
            </td>
            <td className="px-3 py-2 text-sm">
              <select
                value={newLead.teamSize}
                onChange={(e) => setNewLead({...newLead, teamSize: e.target.value})}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              >
                <option value="">Team Size</option>
                {TEAM_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2 text-sm">
              <input
                type="number"
                step="0.1"
                value={newLead.arr}
                onChange={(e) => setNewLead({...newLead, arr: e.target.value})}
                placeholder="ARR (M)"
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              />
            </td>
            <td className="px-3 py-2 text-sm">
              <select
                value={newLead.category}
                onChange={(e) => setNewLead({...newLead, category: e.target.value})}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              >
                <option value="">Category</option>
                {BUSINESS_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2 text-sm text-gray-500">
              {newLead.linkedinUrl && (
                <a href={newLead.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline truncate block">
                  {newLead.linkedinUrl.replace(/^https?:\/\//, '')}
                </a>
              )}
            </td>
            <td className="px-3 py-2 text-sm">
              <select
                value={newLead.status}
                onChange={(e) => setNewLead({...newLead, status: e.target.value})}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              >
                <option value="">Status</option>
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2 text-sm">
              <select
                value={newLead.fundingType}
                onChange={(e) => setNewLead({...newLead, fundingType: e.target.value})}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              >
                <option value="">Funding</option>
                {FUNDING_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2 text-sm">
              <select
                value={newLead.edition}
                onChange={(e) => setNewLead({...newLead, edition: e.target.value})}
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              >
                {EDITIONS.map(edition => (
                  <option key={edition} value={edition}>{edition}</option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2 text-sm">
              <input
                type="text"
                value={newLead.salesRep}
                onChange={(e) => setNewLead({...newLead, salesRep: e.target.value})}
                placeholder="Sales Rep"
                className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
              />
            </td>
            <td className="px-3 py-2 text-sm">
              <div className="flex gap-1">
                <input
                  type="date"
                  value={newLead.followUpReminder}
                  onChange={(e) => setNewLead({...newLead, followUpReminder: e.target.value})}
                  className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-mint focus:border-mint"
                />
                <button
                  onClick={handleAddLead}
                  disabled={isAddingLead || !newLead.productName || !newLead.name}
                  className="px-2 py-1 text-xs bg-mint text-teal-800 rounded hover:bg-mint/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ApperIcon name="Plus" size={12} />
                  Add
                </button>
              </div>
            </td>
          </tr>

          {/* Existing leads */}
{leads.map((lead, index) => (
            <motion.tr
              key={lead.Id}
              className="bg-gray-50 hover:bg-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 1) * 0.03 }}
            >
              {showBulkActions && (
                <td className="px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.Id)}
                    onChange={(e) => handleSelectLead(lead.Id, e.target.checked)}
                    className="h-4 w-4 text-mint focus:ring-mint border-gray-300 rounded"
                  />
                </td>
              )}
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'productName', lead.productName)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'name', lead.name)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'websiteUrl', lead.websiteUrl)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'teamSize', lead.teamSize, 'text', TEAM_SIZES)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'arr', lead.arr, 'number')}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'category', lead.category, 'text', BUSINESS_CATEGORIES)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'linkedinUrl', lead.linkedinUrl)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'status', lead.status, 'text', STATUS_OPTIONS)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'fundingType', lead.fundingType, 'text', FUNDING_TYPES)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'edition', lead.edition, 'text', EDITIONS)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'salesRep', lead.salesRep)}</td>
              <td className="px-3 py-2 text-sm">{renderCell(lead, 'followUpReminder', lead.followUpReminder, 'date')}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;