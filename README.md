# Exercise 3: React Native Message Directory App

## Project Overview

This project is a React Native mobile application built with Expo. The app works as a message directory where users can store important messages in organized categories.

The user can create messages, assign them to a directory, choose a priority, search stored messages, filter unread or urgent messages, and open a full message detail page. Messages are saved locally with AsyncStorage, so they remain available after closing and reopening the app.

The main message directories are:

- School
- Work
- Family
- Emergency
- Reminders

## Main Features

- Display a list of message directories.
- Add a new message with sender, subject, body, directory, and priority.
- View all messages inside a selected directory.
- Open a message detail screen to read the full saved message.
- Mark messages as read.
- Delete stored messages.
- Search messages by sender, subject, body, or priority.
- Filter all messages by unread status.
- Filter all messages by urgent priority.
- Display category totals, unread counts, and urgent counts.
- Persist messages locally using AsyncStorage.
- Support Android, iOS, and web through Expo.

### State Management

The application uses a simple local TypeScript store in `src/data/message-store.ts`.

The store is responsible for:

- Defining the message and directory data types.
- Keeping the current list of stored messages.
- Loading saved messages from AsyncStorage when the app starts.
- Saving message changes to AsyncStorage after add, read, or delete actions.
- Calculating total, unread, and urgent message counts.
- Filtering and searching messages.
- Notifying screens when message state changes.

React's `useSyncExternalStore` is used so that screens subscribe to the message store. This keeps the homepage, directory pages, and message detail pages updated when a message is added, marked as read, or deleted.

AsyncStorage is used for persistence. The saved messages are stored locally on the current device, emulator, or browser. They are not uploaded to GitHub and are not shared between devices.

## Project Structure

```text
ex3/
|-- app.json
|-- package.json
|-- package-lock.json
|-- tsconfig.json
|-- eslint.config.js
|-- assets/
|   |-- images/
|   |   |-- icon.png
|   |   |-- splash-icon.png
|   |   |-- favicon.png
|   |   `-- android-icon-*.png
|   `-- expo.icon/
|-- scripts/
|   `-- reset-project.js
`-- src/
    |-- app/
    |   |-- _layout.tsx
    |   |-- index.tsx
    |   |-- add-message.tsx
    |   |-- directory/
    |   |   `-- [id].tsx
    |   `-- message/
    |       `-- [id].tsx
    |-- components/
    |   |-- directory-card.tsx
    |   |-- message-row.tsx
    |   |-- empty-state.tsx
    |   |-- themed-text.tsx
    |   `-- themed-view.tsx
    |-- constants/
    |   `-- theme.ts
    |-- data/
    |   `-- message-store.ts
    |-- hooks/
    |   |-- use-theme.ts
    |   |-- use-color-scheme.ts
    |   `-- use-color-scheme.web.ts
    `-- global.css
```

### Main Files

`src/app/_layout.tsx`  
Defines the Expo Router stack navigation. It registers the homepage, directory screen, message detail screen, and add-message modal. It also starts loading saved messages from AsyncStorage when the app opens.

`src/app/index.tsx`  
The homepage of the app. It shows the message directory, unread and urgent filter buttons, search input, add-message button, and category list.

`src/app/directory/[id].tsx`  
Displays messages for one selected directory. It also shows directory-specific counts and supports searching inside that directory.

`src/app/message/[id].tsx`  
Displays the full details of one message. The user can mark the message as read or delete it.

`src/app/add-message.tsx`  
Provides the form for creating a new message. The user selects a directory and priority, enters message details, and saves the message.

`src/data/message-store.ts`  
Contains the local message store, AsyncStorage persistence logic, message search, and count calculations.

`src/components/directory-card.tsx`  
Displays a directory card on the homepage.

`src/components/message-row.tsx`  
Displays one message preview in a message list.

`src/components/empty-state.tsx`  
Displays a message when no records are available.

`src/components/themed-text.tsx` and `src/components/themed-view.tsx`  
Reusable UI components for consistent light and dark theme support.

## Configuration

### Environment Setup

Required software:

- Node.js
- npm
- Expo CLI through `npx`
- Android Emulator, Expo Go, or a web browser

Start the Expo development server:

```
npx expo start
```

The application will be displayed in local host to be viewed via web or Expo Go. Pressing 'a' will launch the app in an Android Emulator.



### How to Use the App

1. Start the app as mentioned in previous section.
2. On the homepage, view the available message directories.
3. Press the blue `+` button to add a new message.
4. Select a directory such as School, Work, Family, Emergency, or Reminders.
5. Select a priority: Normal, High, Urgent, or Low.
6. Enter the sender, subject, and message body.
7. Save the message.
8. Return to the homepage to see updated category counts.
9. Use the Unread button to filter unread messages.
10. Use the Urgent button to filter urgent messages.
11. Open a directory to view messages in that category.
12. Open a message to view its full details.
13. Mark a message as read or delete it from the detail screen.

## Screenshots

### Homepage

![Homepage](assets/screenshots/homepage.png)

### Add Message Screen

![AddMessage](assets/screenshots/add_message.png)


### Directory Screen

![DirectoryScreen](assets/screenshots/directory_screen.png)

### Message Detail Screen

![MessageDetail](assets/screenshots/message_detail.png)

### Filtered Messages

![FilteredUnread](assets/screenshots/filtered_unread.png)
![FilteredUrgent](assets/screenshots/filtered_urgent.png)