import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.mark}>
        <ThemedText style={styles.markText}>M</ThemedText>
      </View>
      <ThemedText type="smallBold" selectable style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="small" selectable themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  mark: {
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 8,
    borderCurve: 'continuous',
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  markText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});
