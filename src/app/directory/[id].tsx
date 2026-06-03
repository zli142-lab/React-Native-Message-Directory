import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';

import { EmptyState } from '@/components/empty-state';
import { MessageRow } from '@/components/message-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  getDirectory,
  getDirectoryStats,
  searchMessages,
  useMessages,
} from '@/data/message-store';
import { useTheme } from '@/hooks/use-theme';

export default function DirectoryMessagesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const allMessages = useMessages();
  const [query, setQuery] = useState('');
  const directory = getDirectory(id);
  const stats = directory ? getDirectoryStats(directory.id, allMessages) : undefined;

  const messages = directory ? searchMessages(query, directory.id, allMessages) : [];

  if (!directory || !stats) {
    return (
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}>
        <EmptyState
          title="Directory not found"
          message="Return to the message directory and choose an available category."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ title: directory.title }} />
      <ThemedView style={styles.container}>
        <ThemedView type="backgroundElement" style={styles.hero}>
          <View style={[styles.glyph, { backgroundColor: directory.accent }]}>
            <ThemedText style={styles.glyphText}>{directory.glyph}</ThemedText>
          </View>
          <View style={styles.heroText}>
            <ThemedText type="smallBold" selectable style={styles.heroTitle}>
              {directory.title}
            </ThemedText>
          </View>
        </ThemedView>

        <View style={styles.statsRow}>
          <ThemedView type="backgroundElement" style={styles.stat}>
            <ThemedText type="code" selectable themeColor="textSecondary">
              MESSAGES
            </ThemedText>
            <ThemedText type="subtitle" selectable style={styles.metric}>
              {stats.total}
            </ThemedText>
          </ThemedView>
          <ThemedView type="backgroundElement" style={styles.stat}>
            <ThemedText type="code" selectable themeColor="textSecondary">
              UNREAD
            </ThemedText>
            <ThemedText type="subtitle" selectable style={styles.metric}>
              {stats.unread}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={styles.toolbar}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search this directory"
            placeholderTextColor={theme.textSecondary}
            returnKeyType="search"
            style={[
              styles.searchInput,
              { backgroundColor: theme.backgroundElement, color: theme.text },
            ]}
          />
          <Pressable
            accessibilityLabel="Add message"
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
            onPress={() =>
              router.push({
                pathname: '/add-message',
                params: { directoryId: directory.id },
              })
            }>
            <ThemedText type="smallBold" style={styles.addButtonText}>
              +
            </ThemedText>
          </Pressable>
        </View>

        {messages.length > 0 ? (
          <View style={styles.list}>
            {messages.map((message) => (
              <MessageRow key={message.id} message={message} />
            ))}
          </View>
        ) : (
          <EmptyState
            title="No matching messages"
            message="Add a message or clear the search field to show every stored message."
          />
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: Spacing.three,
    paddingBottom: Spacing.five,
  },
  container: {
    gap: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  hero: {
    borderRadius: 8,
    borderCurve: 'continuous',
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  glyph: {
    alignItems: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  glyphText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  heroText: {
    flex: 1,
    gap: Spacing.one,
  },
  heroTitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  stat: {
    borderRadius: 8,
    borderCurve: 'continuous',
    flex: 1,
    padding: Spacing.three,
  },
  metric: {
    fontVariant: ['tabular-nums'],
    lineHeight: 38,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    width: '100%',
  },
  searchInput: {
    borderRadius: 8,
    borderCurve: 'continuous',
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    minWidth: 0,
    paddingHorizontal: Spacing.three,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    borderCurve: 'continuous',
    flexShrink: 0,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.75,
  },
  list: {
    gap: Spacing.three,
  },
});
