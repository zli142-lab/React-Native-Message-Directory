import { router, type Href, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { addMessage, getDirectories, Priority } from '@/data/message-store';
import { useTheme } from '@/hooks/use-theme';

const priorities: Priority[] = ['Normal', 'High', 'Urgent', 'Low'];

export default function AddMessageScreen() {
  const { directoryId } = useLocalSearchParams<{ directoryId?: string }>();
  const theme = useTheme();
  const directories = getDirectories();
  const initialDirectory = useMemo(
    () => directories.find((directory) => directory.id === directoryId)?.id ?? directories[0].id,
    [directories, directoryId]
  );

  const [selectedDirectory, setSelectedDirectory] = useState(initialDirectory);
  const [priority, setPriority] = useState<Priority>('Normal');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  function handleSave() {
    const trimmedSender = sender.trim();
    const trimmedSubject = subject.trim();
    const trimmedBody = body.trim();

    if (!trimmedSender || !trimmedSubject || !trimmedBody) {
      Alert.alert('Missing details', 'Please enter a sender, subject, and message body.');
      return;
    }

    const created = addMessage({
      directoryId: selectedDirectory,
      sender: trimmedSender,
      subject: trimmedSubject,
      body: trimmedBody,
      priority,
    });

    router.replace(`/message/${created.id}` as Href);
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.container}>
        <View style={styles.section}>
          <ThemedText type="smallBold" selectable style={styles.sectionTitle}>
            Directory
          </ThemedText>
          <View style={styles.optionGrid}>
            {directories.map((directory) => {
              const isSelected = selectedDirectory === directory.id;
              return (
                <Pressable
                  key={directory.id}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      backgroundColor: isSelected ? directory.accent : theme.backgroundElement,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setSelectedDirectory(directory.id)}>
                  <ThemedText
                    type="smallBold"
                    style={{ color: isSelected ? '#FFFFFF' : theme.text }}>
                    {directory.title}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" selectable style={styles.sectionTitle}>
            Priority
          </ThemedText>
          <View style={styles.optionGrid}>
            {priorities.map((item) => {
              const isSelected = priority === item;
              return (
                <Pressable
                  key={item}
                  style={({ pressed }) => [
                    styles.option,
                    {
                      backgroundColor: isSelected ? '#2563EB' : theme.backgroundElement,
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setPriority(item)}>
                  <ThemedText
                    type="smallBold"
                    style={{ color: isSelected ? '#FFFFFF' : theme.text }}>
                    {item}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="smallBold" selectable style={styles.sectionTitle}>
            Message
          </ThemedText>
          <TextInput
            value={sender}
            onChangeText={setSender}
            placeholder="Sender"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { backgroundColor: theme.backgroundElement, color: theme.text },
            ]}
          />
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="Subject"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { backgroundColor: theme.backgroundElement, color: theme.text },
            ]}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="Message body"
            placeholderTextColor={theme.textSecondary}
            multiline
            textAlignVertical="top"
            style={[
              styles.bodyInput,
              { backgroundColor: theme.backgroundElement, color: theme.text },
            ]}
          />
        </View>

        <View style={styles.actions}>
          <Pressable style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]} onPress={() => router.back()}>
            <ThemedText type="smallBold">Cancel</ThemedText>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]} onPress={handleSave}>
            <ThemedText type="smallBold" style={styles.saveButtonText}>
              Save Message
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
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  option: {
    alignItems: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    minHeight: 44,
    minWidth: 92,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  input: {
    borderRadius: 8,
    borderCurve: 'continuous',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  bodyInput: {
    borderRadius: 8,
    borderCurve: 'continuous',
    fontSize: 16,
    minHeight: 160,
    padding: Spacing.three,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cancelButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderCurve: 'continuous',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    borderCurve: 'continuous',
    flexGrow: 2,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.three,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});
