import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Message',
                        headerTitle: () => (
                            <View style={styles.headerContainer}>
                                <MaterialIcons name="home" size={24} color="black" />
                                <Text style={styles.headerTitle}>Message</Text>
                            </View>
                        ),
                    }}
                />
                <Stack.Screen name="group/[groupId]" options={{ headerShown: false }} />
                <Stack.Screen name="message/[msgId]" options={{ headerShown: false }} />
            </Stack>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});