import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  /**
   * Submits birth profile details to resolve coords/timezone and compile natal chart.
   */
  async submitBirthDetails(userId, dob, time, place) {
    const response = await client.post('/api/birth-details', {
      user_id: userId,
      dob,
      time,
      place,
    });
    return response.data;
  },

  /**
   * Retrieves user birth profile details.
   */
  async getBirthDetails(userId) {
    const response = await client.get(`/api/birth-details?user_id=${userId}`);
    return response.data;
  },

  /**
   * Retrieves conversation chat history.
   */
  async getChatHistory(userId) {
    const response = await client.get(`/api/chat/history?user_id=${userId}`);
    return response.data;
  },

  /**
   * Clears user chat messages history.
   */
  async clearChat(userId) {
    const response = await client.post(`/api/chat/clear?user_id=${userId}`);
    return response.data;
  },
  
  // Expose backend streaming URL directly
  getStreamUrl(message, userId) {
    const encodedMsg = encodeURIComponent(message);
    const encodedUser = encodeURIComponent(userId);
    return `${API_BASE_URL}/api/chat/stream?message=${encodedMsg}&user_id=${encodedUser}`;
  }
};
