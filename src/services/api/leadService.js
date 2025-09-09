import leadsData from "@/services/mockData/leads.json";

let leads = [...leadsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const leadService = {
  async getAll() {
    await delay(300);
    return [...leads];
  },

  async getById(id) {
    await delay(200);
    const lead = leads.find(l => l.Id === parseInt(id));
    if (!lead) throw new Error("Lead not found");
    return { ...lead };
  },

  async getHotlist() {
    await delay(250);
    return leads.filter(lead => lead.isHotlist).map(lead => ({ ...lead }));
  },

async create(leadData) {
    await delay(400);
    const newLead = {
      ...leadData,
      Id: leads.length > 0 ? Math.max(...leads.map(l => l.Id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      // Convert legacy fields for compatibility
      email: leadData.email || `${leadData.name?.toLowerCase().replace(' ', '.')}@${leadData.productName?.toLowerCase().replace(' ', '')}.com`,
      phone: leadData.phone || "+1 (555) 000-0000",
      company: leadData.productName || leadData.company,
      value: (parseFloat(leadData.arr) || 0) * 1000000, // Convert ARR millions to value
      assignedTo: leadData.salesRep || "Unassigned",
      stage: "Lead",
      isHotlist: leadData.status === "Hotlist"
    };
    leads.push(newLead);
    return { ...newLead };
  },

async update(id, updates) {
    await delay(350);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    // Handle legacy field mapping for backward compatibility
    if (updates.arr !== undefined) {
      updates.value = parseFloat(updates.arr) * 1000000;
    }
    if (updates.salesRep !== undefined) {
      updates.assignedTo = updates.salesRep;
    }
    if (updates.productName !== undefined) {
      updates.company = updates.productName;
    }
    if (updates.status === "Hotlist") {
      updates.isHotlist = true;
    }
    
    leads[index] = { 
      ...leads[index], 
      ...updates,
      lastContact: new Date().toISOString()
    };
    return { ...leads[index] };
  },

  async delete(id) {
    await delay(300);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    const deletedLead = leads.splice(index, 1)[0];
    return { ...deletedLead };
  },

  async updateStatus(id, status, stage) {
    await delay(250);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    leads[index] = {
      ...leads[index],
      status,
      stage: stage || leads[index].stage,
      lastContact: new Date().toISOString()
    };
    return { ...leads[index] };
  },

  async toggleHotlist(id) {
    await delay(200);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    leads[index] = {
      ...leads[index],
      isHotlist: !leads[index].isHotlist,
      lastContact: new Date().toISOString()
    };
    return { ...leads[index] };
  }
};