import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, List, TextInput, Button, Card, useTheme } from 'react-native-paper';
import { authService } from '../services/authService';
import { messageService } from '../services/messageService';

interface Message {
  id: string;
  from: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}

export function HelpScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
    loadMessages();
  }, []);

  const checkUserRole = async () => {
    try {
      const user = await authService.getCurrentUser();
      setIsAdmin(user?.role === 'admin');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await messageService.getMessages();
      setMessages(response);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await messageService.sendMessage({
        subject: subject.trim(),
        message: message.trim(),
      });
      
      setSubject('');
      setMessage('');
      Alert.alert('Success', 'Message sent successfully');
      loadMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleReplyToMessage = async (messageId: string, reply: string) => {
    try {
      await messageService.replyToMessage(messageId, reply);
      Alert.alert('Success', 'Reply sent successfully');
      loadMessages();
    } catch (error) {
      Alert.alert('Error', 'Failed to send reply. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Help Center</Text>
      </View>

      {!isAdmin && (
        <Card style={styles.messageForm}>
          <Card.Content>
            <TextInput
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
            />
            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleSendMessage}
              style={styles.button}
            >
              Send Message
            </Button>
          </Card.Content>
        </Card>
      )}

      <List.Section>
        <List.Subheader>Messages</List.Subheader>
        {messages.map((msg) => (
          <Card key={msg.id} style={styles.messageCard}>
            <Card.Content>
              <Text variant="titleMedium">{msg.subject}</Text>
              <Text variant="bodyMedium" style={styles.messageText}>
                {msg.message}
              </Text>
              <Text variant="bodySmall" style={styles.messageInfo}>
                From: {msg.from} • {new Date(msg.createdAt).toLocaleDateString()}
              </Text>
              {isAdmin && msg.status === 'unread' && (
                <View style={styles.replySection}>
                  <TextInput
                    label="Reply"
                    multiline
                    numberOfLines={2}
                    style={styles.replyInput}
                    onSubmitEditing={(e) => handleReplyToMessage(msg.id, e.nativeEvent.text)}
                  />
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </List.Section>
    </ScrollView>
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
  messageForm: {
    margin: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  messageCard: {
    margin: 16,
    marginTop: 0,
  },
  messageText: {
    marginVertical: 8,
  },
  messageInfo: {
    marginTop: 8,
    color: '#666',
  },
  replySection: {
    marginTop: 16,
  },
  replyInput: {
    marginBottom: 8,
  },
});
