import React, { useState, useEffect } from 'react';
import ChatLayout from './components/ChatLayout';
import './chat.css';

// Mock data for demonstration
const mockChats = [
    {
        id: '1',
        name: 'Alex Johnson',
        avatarText: 'AJ',
        lastMessage: 'See you tomorrow!',
        timestamp: '10:30 AM',
        unread: 2,
        online: true
    },
    {
        id: '2',
        name: 'Marketing Team',
        avatarText: 'MT',
        lastMessage: 'New campaign launch next week',
        timestamp: 'Yesterday',
        unread: 0,
        online: false
    },
    {
        id: '3',
        name: 'Sarah Miller',
        avatarText: 'SM',
        lastMessage: 'Thanks for your help!',
        timestamp: 'Friday',
        unread: 1,
        online: true
    },
    {
        id: '4',
        name: 'David Wilson',
        avatarText: 'DW',
        lastMessage: 'Meeting at 3 PM',
        timestamp: 'Thursday',
        unread: 0,
        online: false
    }
];

const mockMessages = {
    '1': [
        {
            id: 'm1',
            text: 'Hey there! How are you doing?',
            timestamp: '10:15 AM',
            sender: 'them',
            status: 'read'
        },
        {
            id: 'm2',
            text: 'I\'m doing great! Just finished the project.',
            timestamp: '10:20 AM',
            sender: 'me',
            status: 'read'
        },
        {
            id: 'm3',
            text: 'That\'s awesome! Can we meet tomorrow to discuss the next steps?',
            timestamp: '10:25 AM',
            sender: 'them',
            status: 'read'
        },
        {
            id: 'm4',
            text: 'Sure, how about 2 PM at the usual coffee place?',
            timestamp: '10:30 AM',
            sender: 'me',
            status: 'delivered'
        }
    ],
    '2': [
        {
            id: 'm1',
            text: 'The new campaign analytics are ready for review.',
            timestamp: 'Yesterday',
            sender: 'them',
            status: 'read'
        }
    ]
};

function ChatApp({ setActiveTab }) {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({});
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState({});

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setChats(mockChats);
            setMessages(mockMessages);
            setLoadingChats(false);
        }, 1000);
    }, []);

    const loadMessages = (chatId) => {
        if (!messages[chatId]) {
            setLoadingMessages(prev => ({ ...prev, [chatId]: true }));
            setTimeout(() => {
                setMessages(prev => ({
                    ...prev,
                    [chatId]: mockMessages[chatId] || []
                }));
                setLoadingMessages(prev => ({ ...prev, [chatId]: false }));
            }, 800);
        }
    };

    const sendMessage = (chatId, text) => {
        const newMessage = {
            id: `m${Date.now()}`,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'me',
            status: 'sent'
        };

        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), newMessage]
        }));
    };

    return (
        <div className="App">
            <ChatLayout
                chats={chats}
                messages={messages}
                loadingChats={loadingChats}
                loadingMessages={loadingMessages}
                onSelectChat={loadMessages}
                onSendMessage={sendMessage}
                setActiveTab={setActiveTab}
            />
        </div>
    );
}

export default ChatApp;