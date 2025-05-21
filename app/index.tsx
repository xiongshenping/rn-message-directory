import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Group } from '@/types';
import NewGroupModal from '@/components/NewGroupModal';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '@/utils/store';
import { Swipeable } from 'react-native-gesture-handler';

export default function HomeScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const { groups, msgCounts, loadGroups, deleteGroup } = useStore();

    useEffect(() => {
        loadGroups(); // Load initial data
    }, []); // Empty dependency array

    const renderRightActions = (groupId: string) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteGroup(groupId)}
        >
            <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
    );

    const renderGroup = ({ item }: { item: Group }) => (
        <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <Link href={`/group/${item.id}?name=${encodeURIComponent(item.name)}`} asChild>
                <TouchableOpacity style={styles.groupItem}>
                    <Text style={styles.groupName}>{item.name}</Text>
                    <Text style={styles.msgCount}>{msgCounts[item.id] || 0}</Text>
                </TouchableOpacity>
            </Link>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={groups}
                renderItem={renderGroup}
                keyExtractor={(item) => item.id}
                ListFooterComponent={
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.addButtonText}>Add Category</Text>
                    </TouchableOpacity>
                }
            />
            <NewGroupModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSave={() => loadGroups()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    groupItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    groupName: { fontSize: 16 },
    msgCount: { fontSize: 16, color: 'gray' },
    addButton: {
        padding: 16,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        marginTop: 8,
    },
    addButtonText: { color: 'white', fontSize: 16 },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteButtonText: { color: 'white', fontSize: 16 },
});