import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { api } from '../services/api';

export const useStreaming = () => {
  const {
    userId,
    addMessage,
    messages,
    setMessages,
    addActiveTool,
    removeActiveTool,
    clearActiveTools,
    setIsLoading,
  } = useChatStore();

  const sendMessageStream = useCallback(async (userMessageText) => {
    if (!userMessageText.trim()) return;

    // 1. Add the user message to the UI list
    const userMsgObj = { role: 'user', content: userMessageText };
    setMessages([...useChatStore.getState().messages, userMsgObj]);
    setIsLoading(true);
    clearActiveTools();

    // 2. Open Server-Sent Events (SSE) connection
    const url = api.getStreamUrl(userMessageText, userId);
    const eventSource = new EventSource(url);

    let assistantMsgObj = null;

    eventSource.addEventListener('token', (event) => {
      const token = JSON.parse(event.data);
      
      const currentMessages = [...useChatStore.getState().messages];
      const lastMsg = currentMessages[currentMessages.length - 1];

      if (lastMsg && lastMsg.role === 'assistant' && assistantMsgObj) {
        // Append token chunk to the existing assistant message
        lastMsg.content += token;
        setMessages(currentMessages);
      } else {
        // Create new assistant message
        assistantMsgObj = { role: 'assistant', content: token };
        setMessages([...currentMessages, assistantMsgObj]);
      }
    });

    eventSource.addEventListener('tool_start', (event) => {
      const toolName = JSON.parse(event.data);
      addActiveTool(toolName);
    });

    eventSource.addEventListener('tool_end', (event) => {
      const toolName = JSON.parse(event.data);
      removeActiveTool(toolName);
    });

    eventSource.addEventListener('done', () => {
      eventSource.close();
      setIsLoading(false);
      clearActiveTools();
    });

    eventSource.addEventListener('error', (event) => {
      console.error('SSE connection error:', event);
      
      // Append fallback error message
      const currentMessages = [...useChatStore.getState().messages];
      addMessage({ 
        role: 'assistant', 
        content: '⚠️ I encountered an error streaming responses. Please try sending your message again.' 
      });
      
      eventSource.close();
      setIsLoading(false);
      clearActiveTools();
    });

  }, [userId, addMessage, setMessages, addActiveTool, removeActiveTool, clearActiveTools, setIsLoading]);

  return { sendMessageStream };
};
