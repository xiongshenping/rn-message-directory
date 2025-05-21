import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Msg } from '@/types';

interface Props {
    msg: Msg;
    onPress: () => void;
}

const MsgItem = ({ msg, onPress }: Props) => {
    const previewContent = msg.content.split('\n').slice(0, 3).join('\n');

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.title}>{msg.title || 'Untitled'}</Text>
            <Text style={styles.content} numberOfLines={3}>{previewContent}</Text>
            <Text style={styles.date}>{new Date(msg.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            })}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    content: { fontSize: 14, color: 'gray', marginBottom: 4 },
    date: { fontSize: 12, color: 'gray' },
});

export default MsgItem;