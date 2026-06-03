import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { StoredMessage } from '@/data/message-store';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const priorityColors: Record<StoredMessage['priority'], { background: string; text: string }> = {
  Urgent: { background: '#FEE2E2', text: '#991B1B' },
  High: { background: '#FEF3C7', text: '#92400E' },
  Normal: { background: '#DBEAFE', text: '#1E40AF' },
  Low: { background: '#DCFCE7', text: '#166534' },
};

type MessageRowProps = {
  message: StoredMessage;
};

export function MessageRow({ message }: MessageRowProps) {
  const theme = useTheme();
  const priorityColor = priorityColors[message.priority];
  const href = `/message/${message.id}` as Href;

  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
        <ThemedView type="backgroundElement" style={styles.row}>
          <View style={styles.topRow}>
            <View style={styles.senderWrap}>
              {!message.isRead && <View style={styles.unreadDot} />}
              <ThemedText type="smallBold" selectable style={styles.sender}>
                {message.sender}
              </ThemedText>
            </View>
            <ThemedText type="code" selectable themeColor="textSecondary">
              {message.date}
            </ThemedText>
          </View>

          <ThemedText type="smallBold" selectable style={styles.subject}>
            {message.subject}
          </ThemedText>
          <ThemedText type="small" selectable themeColor="textSecondary" numberOfLines={2}>
            {message.body}
          </ThemedText>

          <View style={styles.metaRow}>
            <View style={[styles.priority, { backgroundColor: priorityColor.background }]}>
              <ThemedText type="code" selectable style={{ color: priorityColor.text }}>
                {message.priority}
              </ThemedText>
            </View>
            <View style={[styles.priority, { backgroundColor: theme.background }]}>
              <ThemedText type="code" selectable>
                {message.isRead ? 'read' : 'unread'}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.75,
  },
  row: {
    borderRadius: 8,
    borderCurve: 'continuous',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  senderWrap: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  unreadDot: {
    backgroundColor: '#2563EB',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  sender: {
    flex: 1,
  },
  subject: {
    fontSize: 17,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  priority: {
    borderRadius: 8,
    borderCurve: 'continuous',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
});
