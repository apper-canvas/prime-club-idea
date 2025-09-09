import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { leadService } from '@/services/api/leadService';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const LeadModal = ({ isOpen, onClose, lead, mode, onLeadSaved }) => {
  const [formData, setFormData] = useState({
    productName: '',
    url: '',
    businessCategory: '',
    teamSize: '',
    location: '',
    status: 'New',
    funding: '',
    edition: '',
    linkedinUrl: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const BUSINESS_CATEGORIES = [
    "Form Builder", "CRM", "Project Management", "E-commerce", "Analytics", 
    "Marketing", "HR", "Finance", "Communication", "Design", "Development",
    "Security", "Healthcare", "Education", "Real Estate", "Legal", "Other"
  ];

  const TEAM_SIZES = ["1-3", "4-10", "11-50", "51-200", "200+"];
  
  const STATUS_OPTIONS = [
    "New", "Connected", "Locked", "Meeting Booked", "Follow Up", 
    "Qualified", "Proposal Sent", "Negotiation", "Closed Won", 
    "Closed Lost", "On Hold", "Unresponsive"
  ];
  
  const FUNDING_TYPES = [
    "Bootstrapped", "Pre-seed", "Seed", "Series A", "Series B+", 
    "Y Combinator", "Other"
  ];
  
  const EDITIONS = ["Standard Edition", "Black Edition", "Collector's Edition"];

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && lead) {
        setFormData({
          productName: lead.productName || '',
          url: lead.url || '',
          businessCategory: lead.businessCategory || '',
          teamSize: lead.teamSize || '',
          location: lead.location || '',
          status: lead.status || 'New',
          funding: lead.funding || '',
          edition: lead.edition || '',
          linkedinUrl: lead.linkedinUrl || '',
          notes: lead.notes || ''
        });
      } else {
        setFormData({
          productName: '',
          url: '',
          businessCategory: '',
          teamSize: '',
          location: '',
          status: 'New',
          funding: '',
          edition: '',
          linkedinUrl: '',
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, lead, mode]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'Website URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    if (!formData.businessCategory) {
      newErrors.businessCategory = 'Business category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setLoading(true);
    
    try {
      let savedLead;
      
      if (mode === 'edit') {
        savedLead = await leadService.update(lead.Id, formData);
        toast.success('Lead updated successfully');
      } else {
        savedLead = await leadService.create(formData);
        toast.success('Lead created successfully');
      }
      
      onLeadSaved(savedLead);
      onClose();
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <Input
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                placeholder="Enter product name"
                className={errors.productName ? 'border-red-500' : ''}
              />
              {errors.productName && (
                <p className="text-sm text-red-600">{errors.productName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Website URL *
              </label>
              <Input
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://example.com"
                className={errors.url ? 'border-red-500' : ''}
              />
              {errors.url && (
                <p className="text-sm text-red-600">{errors.url}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Business Category *
              </label>
              <select
                value={formData.businessCategory}
                onChange={(e) => handleInputChange('businessCategory', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.businessCategory ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {BUSINESS_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.businessCategory && (
                <p className="text-sm text-red-600">{errors.businessCategory}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Team Size
              </label>
              <select
                value={formData.teamSize}
                onChange={(e) => handleInputChange('teamSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select team size</option>
                {TEAM_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Funding
              </label>
              <select
                value={formData.funding}
                onChange={(e) => handleInputChange('funding', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select funding type</option>
                {FUNDING_TYPES.map(funding => (
                  <option key={funding} value={funding}>{funding}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Edition
              </label>
              <select
                value={formData.edition}
                onChange={(e) => handleInputChange('edition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select edition</option>
                {EDITIONS.map(edition => (
                  <option key={edition} value={edition}>{edition}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <Input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/example"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this lead"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                mode === 'edit' ? 'Update Lead' : 'Create Lead'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LeadModal;