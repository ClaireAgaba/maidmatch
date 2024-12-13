import api from './api';

export interface MessageData {
  receiver: string;
  content: string;
}

export const messageService = {
  async sendMessage(messageData: MessageData) {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  async getConversation(userId: string) {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  async getAllConversations() {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  async markAsRead(senderId: string) {
    const response = await api.patch(`/messages/read/${senderId}`);
    return response.data;
  },

  async deleteMessage(messageId: string) {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
};
