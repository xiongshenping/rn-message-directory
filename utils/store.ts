import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group, Msg } from '@/types';

interface StoreState {
    groups: Group[];
    messages: Msg[];
    msgCounts: { [key: string]: number };
    loadGroups: () => Promise<void>;
    saveGroup: (group: Group) => Promise<void>;
    deleteGroup: (groupId: string) => Promise<void>;
    loadMessages: () => Promise<void>;
    saveMessage: (msg: Msg) => Promise<void>;
    deleteMessage: (msgId: string) => Promise<void>;
}

const GROUPS_KEY = 'groups';
const MSGS_KEY = 'msgs';

export const useStore = create<StoreState>((set) => ({
    groups: [],
    messages: [],
    msgCounts: {},

    loadGroups: async () => {
        try {
            const json = await AsyncStorage.getItem(GROUPS_KEY);
            const groups: Group[] = json ? JSON.parse(json) : [];
            const msgCounts: { [key: string]: number } = {};
            for (const group of groups) {
                const msgs = await AsyncStorage.getItem(MSGS_KEY);
                const messages: Msg[] = msgs ? JSON.parse(msgs) : [];
                msgCounts[group.id] = messages.filter((msg) => msg.groupId === group.id).length;
            }
            set({ groups, msgCounts });
        } catch (e) {
            console.error('Error loading groups', e);
        }
    },

    saveGroup: async (group: Group) => {
        try {
            const json = await AsyncStorage.getItem(GROUPS_KEY);
            const groups: Group[] = json ? JSON.parse(json) : [];
            groups.push(group);
            await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
            set((state) => ({
                groups,
                msgCounts: { ...state.msgCounts, [group.id]: 0 },
            }));
        } catch (e) {
            console.error('Error saving group', e);
        }
    },

    deleteGroup: async (groupId: string) => {
        try {
            // Remove group from AsyncStorage
            const jsonGroups = await AsyncStorage.getItem(GROUPS_KEY);
            let groups: Group[] = jsonGroups ? JSON.parse(jsonGroups) : [];
            groups = groups.filter((group) => group.id !== groupId);
            await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));

            // Remove associated messages from AsyncStorage
            const jsonMsgs = await AsyncStorage.getItem(MSGS_KEY);
            let messages: Msg[] = jsonMsgs ? JSON.parse(jsonMsgs) : [];
            messages = messages.filter((msg) => msg.groupId !== groupId);
            await AsyncStorage.setItem(MSGS_KEY, JSON.stringify(messages));

            // Update store state
            set((state) => {
                const newMsgCounts = { ...state.msgCounts };
                delete newMsgCounts[groupId];
                return {
                    groups: groups,
                    messages: messages,
                    msgCounts: newMsgCounts,
                };
            });
        } catch (e) {
            console.error('Error deleting group', e);
        }
    },

    loadMessages: async () => {
        try {
            const json = await AsyncStorage.getItem(MSGS_KEY);
            const messages: Msg[] = json ? JSON.parse(json) : [];
            set({ messages });
        } catch (e) {
            console.error('Error loading messages', e);
        }
    },

    saveMessage: async (msg: Msg) => {
        try {
            const json = await AsyncStorage.getItem(MSGS_KEY);
            let messages: Msg[] = json ? JSON.parse(json) : [];
            const index = messages.findIndex((m) => m.id === msg.id);
            if (index >= 0) {
                messages[index] = msg;
            } else {
                messages.push(msg);
            }
            await AsyncStorage.setItem(MSGS_KEY, JSON.stringify(messages));
            set((state) => {
                const newMessages = [...state.messages];
                const msgIndex = newMessages.findIndex((m) => m.id === msg.id);
                if (msgIndex >= 0) {
                    newMessages[msgIndex] = msg;
                } else {
                    newMessages.push(msg);
                }
                return {
                    messages: newMessages,
                    msgCounts: {
                        ...state.msgCounts,
                        [msg.groupId]: (state.msgCounts[msg.groupId] || 0) + (index >= 0 ? 0 : 1),
                    },
                };
            });
        } catch (e) {
            console.error('Error saving message', e);
        }
    },

    deleteMessage: async (msgId: string) => {
        try {
            const json = await AsyncStorage.getItem(MSGS_KEY);
            let messages: Msg[] = json ? JSON.parse(json) : [];
            const messageToDelete = messages.find((msg) => msg.id === msgId);
            messages = messages.filter((msg) => msg.id !== msgId);
            await AsyncStorage.setItem(MSGS_KEY, JSON.stringify(messages));
            set((state) => {
                const newMsgCounts = { ...state.msgCounts };
                if (messageToDelete) {
                    newMsgCounts[messageToDelete.groupId] = (newMsgCounts[messageToDelete.groupId] || 0) - 1;
                }
                return {
                    messages,
                    msgCounts: newMsgCounts,
                };
            });
        } catch (e) {
            console.error('Error deleting message', e);
        }
    },
}));