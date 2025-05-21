import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Msg } from '@/types';
import { useStore } from '@/utils/store'; // Import the store
import { MaterialIcons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

export default function MsgDetailScreen() {
    const router = useRouter();
    const { msgId, groupId } = useLocalSearchParams<{ msgId: string; groupId?: string }>();
    const { messages, loadMessages, saveMessage } = useStore(); // Use store
    const [msg, setMsg] = useState<Msg | null>(null);
    const [isEditing, setIsEditing] = useState(msgId === 'new');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        console.log('useEffect', msgId, groupId);
        if (msgId !== 'new') {
            loadMsg();
        } else {
            setMsg({
                id: uuidv4(),
                groupId: groupId!,
                title: '',
                content: '',
                createdAt: new Date().toISOString(),
            });
        }
    }, [msgId, groupId]);

    const loadMsg = async () => {
        await loadMessages(); // Load messages from store
        const foundMsg = messages.find((n) => n.id === msgId);
        if (foundMsg) {
            setMsg(foundMsg);
            setTitle(foundMsg.title);
            setContent(foundMsg.content);
        }
    };

    const handleSave = async () => {
        if (msg) {
            const updatedMsg = { ...msg, title, content, createdAt: msg.createdAt || new Date().toISOString() };
            await saveMessage(updatedMsg); // Use store's saveMessage
            setIsEditing(false);
            router.back();
        }
    };

    if (!msg) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                {isEditing && (
                    <TouchableOpacity onPress={handleSave}>
                        <MaterialIcons name="check" size={24} color="#007AFF" />
                    </TouchableOpacity>
                )}
            </View>
            {isEditing ? (
                <>
                    <TextInput
                        style={styles.titleInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Title"
                    />
                    <Text style={styles.date}>
                        {new Date(msg.createdAt).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        })}
                    </Text>
                    <TextInput
                        style={styles.contentInput}
                        value={content}
                        onChangeText={setContent}
                        placeholder="Content"
                        multiline
                    />
                </>
            ) : (
                <>
                    <Text style={styles.title} onPress={() => setIsEditing(true)}>
                        {title || 'Untitled'}
                    </Text>
                    <Text style={styles.date}>
                        {new Date(msg.createdAt).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        })}
                    </Text>
                    <Text style={styles.content} onPress={() => setIsEditing(true)}>
                        {content}
                    </Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    titleInput: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, borderBottomWidth: 1 },
    date: { fontSize: 14, color: 'gray', marginBottom: 8 },
    content: { fontSize: 16 },
    contentInput: { fontSize: 16, flex: 1, textAlignVertical: 'top' },
});