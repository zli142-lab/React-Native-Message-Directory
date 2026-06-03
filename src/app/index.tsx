import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';

import { DirectoryCard } from '@/components/directory-card';
import { EmptyState } from '@/components/empty-state';
import { MessageRow } from '@/components/message-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  getDirectories,
  getMessageStats,
  StoredMessage,
  searchMessages,
  useMessages,
} from '@/data/message-store';
import { useTheme } from '@/hooks/use-theme';

type HomeFilter = 'all' | 'unread' | 'urgent';

export default function DirectoryHomeScreen() {
  const theme = useTheme();
  const messages = useMessages();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<HomeFilter>('all');
  const directories = getDirectories();
  const stats = getMessageStats(messages);

  const sourceMessages = searchMessages(query, undefined, messages);
  const filters: Record<HomeFilter, (message: StoredMessage) => boolean> = {
    all: () => true,
    unread: (message) => !message.isRead,
    urgent: (message) => message.priority === 'Urgent',
  };
  const filteredMessages = sourceMessages.filter(filters[filter]);
  const hasQuery = query.trim().length > 0;
  const isFiltered = hasQuery || filter !== 'all';

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <View style={styles.summaryGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.summaryTile,
              {
                backgroundColor: filter === 'unread' ? '#2563EB' : theme.backgroundElement,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => setFilter((current) => (current === 'unread' ? 'all' : 'unread'))}>
            <ThemedText type="code" selectable themeColor="textSecondary">
              UNREAD
            </ThemedText>
            <ThemedText
              type="subtitle"
              selectable
              style={[styles.metric, filter === 'unread' && styles.selectedMetric]}>
              {stats.unread}
            </ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.summaryTile,
              {
                backgroundColor: filter === 'urgent' ? '#DC2626' : theme.backgroundElement,
              },
              pressed && styles.pressed,
            ]}
            onPress={() => setFilter((current) => (current === 'urgent' ? 'all' : 'urgent'))}>
            <ThemedText type="code" selectable themeColor="textSecondary">
              URGENT
            </ThemedText>
            <ThemedText
              type="subtitle"
              selectable
              style={[styles.metric, filter === 'urgent' && styles.selectedMetric]}>
              {stats.urgent}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.toolbar}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search messages"
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
            onPress={() => router.push('/add-message')}>
            <ThemedText type="smallBold" style={styles.addButtonText}>
              +
            </ThemedText>
          </Pressable>
        </View>

        {isFiltered ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="smallBold" selectable style={styles.sectionTitle}>
                {filter === 'all'
                  ? 'Search Results'
                  : `${filter[0].toUpperCase()}${filter.slice(1)} Messages`}
              </ThemedText>
              {filter !== 'all' && (
                <Pressable
                  style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
                  onPress={() => setFilter('all')}>
                  <ThemedText type="code" selectable>
                    CLEAR
                  </ThemedText>
                </Pressable>
              )}
            </View>
            {filteredMessages.length > 0 ? (
              <View style={styles.list}>
                {filteredMessages.map((message) => (
                  <MessageRow key={message.id} message={message} />
                ))}
              </View>
            ) : (
              <EmptyState
                title="No messages found"
                message="Add a message or adjust the active search and filter."
              />
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <ThemedText type="smallBold" selectable style={styles.sectionTitle}>
              Directories
            </ThemedText>
            <View style={styles.list}>
              {directories.map((directory) => (
                <DirectoryCard key={directory.id} directory={directory} messages={messages} />
              ))}
            </View>
          </View>
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  summaryTile: {
    backgroundColor: '#F0F0F3',
    borderRadius: 8,
    borderCurve: 'continuous',
    flexGrow: 1,
    minWidth: 104,
    padding: Spacing.three,
  },
  metric: {
    fontVariant: ['tabular-nums'],
    lineHeight: 38,
  },
  selectedMetric: {
    color: '#FFFFFF',
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
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  clearButton: {
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  list: {
    gap: Spacing.three,
  },
});
