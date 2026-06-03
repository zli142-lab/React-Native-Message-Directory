import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type Priority = 'Urgent' | 'High' | 'Normal' | 'Low';

export type Directory = {
  id: string;
  title: string;
  accent: string;
  glyph: string;
};

export type StoredMessage = {
  id: string;
  directoryId: string;
  sender: string;
  subject: string;
  body: string;
  date: string;
  priority: Priority;
  isRead: boolean;
};

export type NewMessageInput = {
  directoryId: string;
  sender: string;
  subject: string;
  body: string;
  priority: Priority;
};

export type MessageStats = {
  total: number;
  unread: number;
  urgent: number;
};

type MessageStoreSnapshot = {
  version: number;
  messages: StoredMessage[];
  hasHydrated: boolean;
};

const directories: Directory[] = [
  {
    id: 'school',
    title: 'School',
    accent: '#2563EB',
    glyph: 'S',
  },
  {
    id: 'work',
    title: 'Work',
    accent: '#0F766E',
    glyph: 'W',
  },
  {
    id: 'family',
    title: 'Family',
    accent: '#C2410C',
    glyph: 'F',
  },
  {
    id: 'emergency',
    title: 'Emergency',
    accent: '#DC2626',
    glyph: 'E',
  },
  {
    id: 'reminders',
    title: 'Reminders',
    accent: '#7C3AED',
    glyph: 'R',
  },
];

const storageKey = 'message-directory.messages.v1';

let messages: StoredMessage[] = [];
let hasHydrated = false;

let version = 0;
let snapshot: MessageStoreSnapshot = {
  version,
  messages,
  hasHydrated,
};
let pendingPersist = Promise.resolve();
const listeners = new Set<() => void>();

function emitChange() {
  version += 1;
  snapshot = {
    version,
    messages,
    hasHydrated,
  };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

export function useMessageStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useMessages() {
  return useMessageStore().messages;
}

function persistMessages(nextMessages = messages) {
  const storedValue = JSON.stringify(nextMessages);

  pendingPersist = pendingPersist
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(storageKey, storedValue))
    .catch(() => undefined);

  return pendingPersist;
}

export async function hydrateMessages() {
  if (hasHydrated) {
    return;
  }

  hasHydrated = true;

  try {
    const storedMessages = await AsyncStorage.getItem(storageKey);
    messages = storedMessages ? JSON.parse(storedMessages) : [];
  } catch {
    messages = [];
  }

  emitChange();
}

export function isMessageStoreHydrated() {
  return hasHydrated;
}

export function getDirectories() {
  return directories;
}

export function getDirectory(id: string) {
  return directories.find((directory) => directory.id === id);
}

export function getMessages() {
  return messages;
}

export function getMessage(id: string) {
  return messages.find((message) => message.id === id);
}

export function getMessagesByDirectory(directoryId: string) {
  return messages.filter((message) => message.directoryId === directoryId);
}

export function getDirectoryStats(directoryId: string, source = messages): MessageStats {
  const directoryMessages = source.filter((message) => message.directoryId === directoryId);
  return getMessageStats(directoryMessages);
}

export function getMessageStats(source = messages): MessageStats {
  return {
    total: source.length,
    unread: source.filter((message) => !message.isRead).length,
    urgent: source.filter((message) => message.priority === 'Urgent').length,
  };
}

export function addMessage(input: NewMessageInput) {
  const created: StoredMessage = {
    ...input,
    id: `m-${Date.now()}`,
    date: new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date()),
    isRead: false,
  };

  messages = [created, ...messages];
  emitChange();
  void persistMessages(messages);
  return created;
}

export function markMessageRead(id: string) {
  messages = messages.map((message) =>
    message.id === id ? { ...message, isRead: true } : message
  );
  emitChange();
  void persistMessages(messages);
}

export async function deleteMessage(id: string) {
  const message = getMessage(id);
  messages = messages.filter((item) => item.id !== id);
  emitChange();
  await persistMessages(messages);
  return message;
}

export function searchMessages(query: string, directoryId?: string, source = messages) {
  const normalizedQuery = query.trim().toLowerCase();
  const searchableMessages = directoryId
    ? source.filter((message) => message.directoryId === directoryId)
    : source;

  if (!normalizedQuery) {
    return searchableMessages;
  }

  return searchableMessages.filter((message) =>
    [message.sender, message.subject, message.body, message.priority]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
  );
}
