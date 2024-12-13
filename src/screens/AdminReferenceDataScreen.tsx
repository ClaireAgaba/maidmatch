import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  Text, 
  Button, 
  DataTable, 
  TextInput, 
  Portal, 
  Dialog, 
  Snackbar,
  IconButton,
  Divider
} from 'react-native-paper';
import { referenceDataService } from '../services/referenceDataService';

type ReferenceDataType = 'district' | 'tribe' | 'language';

interface ReferenceItem {
  _id: string;
  name: string;
  isActive: boolean;
}

export function AdminReferenceDataScreen() {
  const [districts, setDistricts] = useState<ReferenceItem[]>([]);
  const [tribes, setTribes] = useState<ReferenceItem[]>([]);
  const [languages, setLanguages] = useState<ReferenceItem[]>([]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<ReferenceDataType>('district');
  const [newItemName, setNewItemName] = useState('');
  const [editItem, setEditItem] = useState<ReferenceItem | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const data = await referenceDataService.getAllReferenceData();
      setDistricts(data.districts);
      setTribes(data.tribes);
      setLanguages(data.languages);
    } catch (error) {
      console.error('Error loading reference data:', error);
      setSnackbarMessage('Failed to load reference data');
    }
  };

  const handleAdd = async () => {
    try {
      if (!newItemName.trim()) {
        setSnackbarMessage('Please enter a name');
        return;
      }

      const response = await referenceDataService.addReferenceData(selectedType, { name: newItemName });
      setSnackbarMessage(`${selectedType} added successfully`);
      loadReferenceData();
      setShowAddDialog(false);
      setNewItemName('');
    } catch (error) {
      console.error(`Error adding ${selectedType}:`, error);
      setSnackbarMessage(`Failed to add ${selectedType}`);
    }
  };

  const handleEdit = async () => {
    try {
      if (!editItem || !newItemName.trim()) {
        setSnackbarMessage('Please enter a name');
        return;
      }

      await referenceDataService.updateReferenceData(selectedType, editItem._id, { name: newItemName });
      setSnackbarMessage(`${selectedType} updated successfully`);
      loadReferenceData();
      setEditItem(null);
      setNewItemName('');
    } catch (error) {
      console.error(`Error updating ${selectedType}:`, error);
      setSnackbarMessage(`Failed to update ${selectedType}`);
    }
  };

  const handleToggleActive = async (item: ReferenceItem, type: ReferenceDataType) => {
    try {
      await referenceDataService.updateReferenceData(type, item._id, { 
        isActive: !item.isActive 
      });
      setSnackbarMessage(`${type} ${item.isActive ? 'deactivated' : 'activated'} successfully`);
      loadReferenceData();
    } catch (error) {
      console.error(`Error toggling ${type}:`, error);
      setSnackbarMessage(`Failed to update ${type}`);
    }
  };

  const renderTable = (
    title: string, 
    data: ReferenceItem[], 
    type: ReferenceDataType
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="titleLarge">{title}</Text>
        <Button 
          mode="contained" 
          onPress={() => {
            setSelectedType(type);
            setShowAddDialog(true);
          }}
        >
          Add {title}
        </Button>
      </View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Status</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {data.map((item) => (
          <DataTable.Row key={item._id}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell>
              {item.isActive ? 'Active' : 'Inactive'}
            </DataTable.Cell>
            <DataTable.Cell>
              <IconButton
                icon="pencil"
                onPress={() => {
                  setSelectedType(type);
                  setEditItem(item);
                  setNewItemName(item.name);
                }}
              />
              <IconButton
                icon={item.isActive ? 'close' : 'check'}
                onPress={() => handleToggleActive(item, type)}
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Reference Data Management
      </Text>

      {renderTable('Districts', districts, 'district')}
      <Divider style={styles.divider} />
      {renderTable('Tribes', tribes, 'tribe')}
      <Divider style={styles.divider} />
      {renderTable('Languages', languages, 'language')}

      <Portal>
        <Dialog
          visible={showAddDialog || editItem !== null}
          onDismiss={() => {
            setShowAddDialog(false);
            setEditItem(null);
            setNewItemName('');
          }}
        >
          <Dialog.Title>
            {editItem ? 'Edit' : 'Add'} {selectedType}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Name"
              value={newItemName}
              onChangeText={setNewItemName}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => {
                setShowAddDialog(false);
                setEditItem(null);
                setNewItemName('');
              }}
            >
              Cancel
            </Button>
            <Button onPress={editItem ? handleEdit : handleAdd}>
              {editItem ? 'Save' : 'Add'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage('')}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dialogInput: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
});
