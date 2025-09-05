import activitiesData from "@/services/mockData/activities.json";

let activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getByLeadId(leadId) {
    await delay(200);
    return activities
      .filter(activity => activity.leadId === parseInt(leadId))
      .map(activity => ({ ...activity }));
  },

  async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id)) + 1,
      date: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, updates) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Activity not found");
    
    activities[index] = { ...activities[index], ...updates };
    return { ...activities[index] };
  },

  async delete(id) {
    await delay(300);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Activity not found");
    
    const deletedActivity = activities.splice(index, 1)[0];
    return { ...deletedActivity };
  }
};