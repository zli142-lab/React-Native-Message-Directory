import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Directory, getDirectoryStats, StoredMessage } from '@/data/message-store';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DirectoryCardProps = {
  directory: Directory;
  messages: StoredMessage[];
};

export function DirectoryCard({ directory, messages }: DirectoryCardProps) {
  const theme = useTheme();
  const stats = getDirectoryStats(directory.id, messages);
  const href = `/directory/${directory.id}` as Href;

  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
        <ThemedView type="backgroundElement" style={styles.card}>
          <View style={[styles.glyph, { backgroundColor: directory.accent }]}>
            <ThemedText style={styles.glyphText}>{directory.glyph}</ThemedText>
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <ThemedText type="smallBold" selectable style={styles.title}>
                {directory.title}
              </ThemedText>
              <ThemedText type="small" selectable themeColor="textSecondary" style={styles.count}>
                {stats.total}
              </ThemedText>
            </View>
            <View style={styles.metaRow}>
              <View style={[styles.badge, { backgroundColor: theme.background }]}>
                <ThemedText type="code" selectable>
                  {stats.unread} unread
                </ThemedText>
              </View>
              {stats.urgent > 0 && (
                <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                  <ThemedText type="code" selectable style={{ color: '#991B1B' }}>
                    {stats.urgent} urgent
                  </ThemedText>
                </View>
              )}
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
  card: {
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
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  glyphText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    gap: Spacing.two,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
  },
  count: {
    fontVariant: ['tabular-nums'],
  },
  metaRow: {
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
});
