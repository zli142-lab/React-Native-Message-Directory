import { router, Stack, type Href, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import {
  deleteMessage,
  getDirectory,
  markMessageRead,
  useMessages,
} from '@/data/message-store';
import { useTheme } from '@/hooks/use-theme';

const priorityColors = {
  Urgent: { background: '#FEE2E2', text: '#991B1B' },
  High: { background: '#FEF3C7', text: '#92400E' },
  Normal: { background: '#DBEAFE', text: '#1E40AF' },
  Low: { background: '#DCFCE7', text: '#166534' },
} as const;

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const messages = useMessages();
  const message = messages.find((item) => item.id === id);
  const directory = message ? getDirectory(message.directoryId) : undefined;

  if (!message || !directory) {
    return (
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}>
        <EmptyState
          title="Message not found"
          message="This stored message may have been deleted. Return to the directory to continue."
        />
      </ScrollView>
    );
  }

  const priorityColor = priorityColors[message.priority];

  function handleMarkRead() {
    if (message) {
      markMessageRead(message.id);
    }
  }

  async function handleDelete() {
    if (!message) {
      return;
    }

    const directoryId = message.directoryId;
    await deleteMessage(message.id);
    router.replace(`/directory/${directoryId}` as Href);
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}>
      <Stack.Screen options={{ title: message.subject }} />
      <ThemedView style={styles.container}>
        <ThemedView type="backgroundElement" style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.glyph, { backgroundColor: directory.accent }]}>
              <ThemedText style={styles.glyphText}>{directory.glyph}</ThemedText>
            </View>
            <View style={styles.titleText}>
              <ThemedText type="small" selectable themeColor="textSecondary">
                {directory.title}
              </ThemedText>
              <ThemedText type="subtitle" selectable style={styles.subject}>
                {message.subject}
              </ThemedText>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <ThemedText type="code" selectable themeColor="textSecondary">
                SENDER
              </ThemedText>
              <ThemedText type="smallBold" selectable>
                {message.sender}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <ThemedText type="code" selectable themeColor="textSecondary">
                DATE
              </ThemedText>
              <ThemedText type="smallBold" selectable>
                {message.date}
              </ThemedText>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: priorityColor.background }]}>
              <ThemedText type="code" selectable style={{ color: priorityColor.text }}>
                {message.priority}
              </ThemedText>
            </View>
            <View style={[styles.badge, { backgroundColor: theme.background }]}>
              <ThemedText type="code" selectable>
                {message.isRead ? 'read' : 'unread'}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.bodyCard}>
          <ThemedText selectable style={styles.bodyText}>
            {message.body}
          </ThemedText>
        </ThemedView>

        <View style={styles.actions}>
          {!message.isRead && (
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={handleMarkRead}>
              <ThemedText type="smallBold" style={styles.primaryButtonText}>
                Mark Read
              </ThemedText>
            </Pressable>
          )}
          <Pressable style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]} onPress={handleDelete}>
            <ThemedText type="smallBold" style={styles.deleteButtonText}>
              Delete
            </ThemedText>
          </Pressable>
        </View>
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
  header: {
    borderRadius: 8,
    borderCurve: 'continuous',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    gap: Spacing.three,
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
  titleText: {
    flex: 1,
    gap: Spacing.one,
  },
  subject: {
    fontSize: 28,
    lineHeight: 34,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metaItem: {
    flexGrow: 1,
    gap: Spacing.one,
    minWidth: 160,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  badge: {
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  bodyCard: {
    borderRadius: 8,
    borderCurve: 'continuous',
    padding: Spacing.three,
  },
  bodyText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    borderCurve: 'continuous',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderCurve: 'continuous',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  deleteButtonText: {
    color: '#991B1B',
  },
  pressed: {
    opacity: 0.75,
  },
});
