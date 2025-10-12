import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://civiclens-backend-production-2c6d.up.railway.app/api/admin';

export const getAdminDashboardStats = async () => {
  const res = await axios.get(`${API_BASE}/dashboard/stats`);
  return res.data.data;
};

export const getAllSupportTickets = async (params?: {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
}) => {
  const res = await axios.get(`${API_BASE}/support/tickets`, { params });
  return res.data.data;
};

export const getResolvedTickets = async () => {
  const res = await axios.get(`${API_BASE}/support/tickets/resolved`);
  return res.data.data;
};

export const getTicketDetails = async (ticketId: string) => {
  const res = await axios.get(`${API_BASE}/support/tickets/${ticketId}`);
  return res.data.data;
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
  const res = await axios.put(`${API_BASE}/support/tickets/${ticketId}/status`, { status });
  return res.data.data;
};

export const addAdminReply = async (ticketId: string, message: string) => {
  const res = await axios.post(`${API_BASE}/support/tickets/${ticketId}/reply`, { message });
  return res.data.data;
};

export const deleteTicket = async (ticketId: string) => {
  const res = await axios.delete(`${API_BASE}/support/tickets/${ticketId}`);
  return res.data;
};