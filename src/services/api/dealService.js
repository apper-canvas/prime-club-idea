import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) throw new Error("Deal not found");
    return { ...deal };
  },

  async getByStage(stage) {
    await delay(250);
    return deals.filter(deal => deal.stage === stage).map(deal => ({ ...deal }));
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updates) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Deal not found");
    
    deals[index] = { ...deals[index], ...updates };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Deal not found");
    
    const deletedDeal = deals.splice(index, 1)[0];
    return { ...deletedDeal };
  }
};