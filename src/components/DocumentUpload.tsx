import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { documentRequirements } from '../data/referenceData';

interface DocumentUploadProps {
  documentId: string;
  documentName: string;
  onFileSelect: (documentId: string, file: DocumentPicker.DocumentResult) => void;
  error?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentId,
  documentName,
  onFileSelect,
  error
}) => {
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: documentRequirements.allowedTypes,
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        // Check file size
        if (result.size > documentRequirements.maxSize) {
          alert(`File size must be less than ${documentRequirements.maxSize / (1024 * 1024)}MB`);
          return;
        }

        onFileSelect(documentId, result);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      alert('Failed to pick document. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={handleFilePick}
        style={styles.button}
      >
        Upload {documentName}
      </Button>
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    marginVertical: 4,
  },
});
