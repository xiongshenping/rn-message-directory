import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '@/utils/store'; // Import the store
import { v4 as uuidv4 } from 'uuid';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
}

const NewGroupModal = ({ visible, onClose, onSave }: Props) => {
    const [name, setName] = useState('');
    const { saveGroup } = useStore(); // Use store

    const handleSave = async () => {
        if (name.trim()) {
            await saveGroup({ id: uuidv4(), name });
            setName('');
            onSave();
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>New Group</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter Group name"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.okButton} onPress={handleSave}>
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 8, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    cancelButton: { padding: 8, marginRight: 8 },
    okButton: { padding: 8, backgroundColor: '#007AFF', borderRadius: 4 },
    buttonText: { color: 'white', fontSize: 16 },
});

export default NewGroupModal;