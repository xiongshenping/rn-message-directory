import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Msg } from '@/types';
import MsgItem from '@/components/MsgItem';
import { MaterialIcons } from '@expo/vector-icons';
import { useStore } from '@/utils/store';
import { Swipeable } from 'react-native-gesture-handler'; // Import Swipeable

export default function MsgsListScreen() {
    const router = useRouter();
    const { groupId, name } = useLocalSearchParams<{ groupId: string; name: string }>();
    const { messages, loadMessages, deleteMessage } = useStore();
    const msgs = messages.filter((msg) => msg.groupId === groupId);

    useEffect(() => {
        loadMessages(); // Load initial data
    }, []); // Empty dependency array

    const renderRightActions = (msgId: string) => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteMessage(msgId)}
        >
            <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
    );

    const renderMsg = ({ item }: { item: Msg }) => (
        <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <MsgItem msg={item} onPress={() => router.push(`/message/${item.id}`)} />
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{decodeURIComponent(name || '')}</Text>
                <View style={styles.placeholder} />
            </View>
            <FlatList
                data={msgs}
                renderItem={renderMsg}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No messages in this group</Text>}
            />
            <TouchableOpacity
                style={styles.addMsgButton}
                onPress={() => router.push(`/message/new?groupId=${groupId}`)}
            >
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    placeholder: { width: 24 },
    emptyText: { textAlign: 'center', marginTop: 20, color: 'gray' },
    addMsgButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: '100%',
    },
    deleteButtonText: { color: 'white', fontSize: 16 },
});