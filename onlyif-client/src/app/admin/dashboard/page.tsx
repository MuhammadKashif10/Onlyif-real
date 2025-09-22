// ... existing code ...
// Replace hardcoded URLs with apiClient calls
const fetchPropertiesStats = () => 
  adminApi.getPropertiesCount();

const fetchAgentsStats = () => 
  adminApi.getAgentsCount();

const fetchUsersStats = () => 
  adminApi.getUsersCount();

const fetchMonthlyRevenue = () => 
  adminApi.getMonthlyRevenue();

const fetchRecentActivity = () => 
  adminApi.getRecentActivity();
// ... existing code ...