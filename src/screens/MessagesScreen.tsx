import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Card, TextInput, Button, Avatar, useTheme } from 'react-native-paper';
import type { RootStackScreenProps } from '../navigation/types';

type Props = RootStackScreenProps<'Messages'>;

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
    avatar?: string;
    role: 'maid' | 'homeowner' | 'admin';
  };
  content: string;
  timestamp: string;
  read: boolean;
}

const MessagesScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredMessages = messages.filter(message =>
    message.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessagePress = (message: Message) => {
    // TODO: Navigate to chat detail screen
    console.log('Message pressed:', message.id);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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

  const renderMessage = (message: Message) => (
    <Card
      key={message.id}
      style={[
        styles.messageCard,
        !message.read && { backgroundColor: theme.colors.primaryContainer }
      ]}
      onPress={() => handleMessagePress(message)}
    >
      <Card.Content style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <View style={styles.userInfo}>
            {message.from.avatar ? (
              <Avatar.Image
                size={40}
                source={{ uri: message.from.avatar }}
              />
            ) : (
              <Avatar.Text
                size={40}
                label={getInitials(message.from.name)}
              />
            )}
            <View style={styles.textContainer}>
              <Text variant="titleMedium">{message.from.name}</Text>
              <Text variant="bodySmall" style={styles.timestamp}>
                {new Date(message.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
          {!message.read && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]} />
          )}
        </View>
        <Text
          variant="bodyMedium"
          numberOfLines={2}
          style={[styles.messageText, message.read && styles.readMessage]}
        >
          {message.content}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Messages</Text>
        <TextInput
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchInput}
        />
      </View>

      <ScrollView style={styles.messagesList}>
        {filteredMessages.length > 0 ? (
          filteredMessages.map(renderMessage)
        ) : (
          <Text style={styles.emptyText}>No messages found</Text>
        )}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageCard: {
    marginBottom: 8,
  },
  messageContent: {
    padding: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
  },
  timestamp: {
    opacity: 0.7,
  },
  messageText: {
    marginLeft: 52,
  },
  readMessage: {
    opacity: 0.7,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    opacity: 0.6,
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

export default MessagesScreen;
