import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, Card, TextInput, Button, Avatar, useTheme } from 'react-native-paper';
import { messageService } from '../services/messageService';

interface Message {
  id: string;
  from: {
    id: string;
    name: string;
    avatar?: string;
    role: 'maid' | 'homeowner' | 'admin';
  };
  to: {
    id: string;
    name: string;
  };
  content: string;
  createdAt: string;
  status: 'unread' | 'read';
}

export function MessagesScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await messageService.getMessages();
      setMessages(response);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) {
      Alert.alert('Error', 'Please select a recipient and enter a message');
      return;
    }

    try {
      await messageService.sendMessage({
        to: selectedUser,
        content: newMessage.trim(),
      });
      
      setNewMessage('');
      Alert.alert('Success', 'Message sent successfully');
      loadMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Messages</Text>
      </View>

      <ScrollView style={styles.messageList}>
        {messages.map((message) => (
          <Card
            key={message.id}
            style={[
              styles.messageCard,
              message.status === 'unread' && styles.unreadMessage,
            ]}
            onPress={() => markAsRead(message.id)}
          >
            <Card.Content style={styles.messageContent}>
              <View style={styles.avatarContainer}>
                <Avatar.Image
                  size={48}
                  source={
                    message.from.avatar
                      ? { uri: message.from.avatar }
                      : require('../../assets/maid.jpg')
                  }
                />
              </View>
              <View style={styles.messageDetails}>
                <View style={styles.messageHeader}>
                  <Text variant="titleMedium">{message.from.name}</Text>
                  <Text variant="bodySmall" style={styles.timestamp}>
                    {new Date(message.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={styles.messageText}>
                  {message.content}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Card style={styles.composerCard}>
        <Card.Content>
          <TextInput
            label="Message"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            numberOfLines={3}
            style={styles.messageInput}
          />
          <Button
            mode="contained"
            onPress={handleSendMessage}
            style={styles.sendButton}
            disabled={!selectedUser || !newMessage.trim()}
          >
            Send Message
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  messageList: {
    flex: 1,
  },
  messageCard: {
    margin: 8,
    marginHorizontal: 16,
  },
  unreadMessage: {
    backgroundColor: '#f0f9ff',
  },
  messageContent: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 16,
  },
  messageDetails: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timestamp: {
    color: '#666',
  },
  messageText: {
    color: '#333',
  },
  composerCard: {
    margin: 16,
  },
  messageInput: {
    marginBottom: 16,
  },
  sendButton: {
    marginTop: 8,
  },
});
