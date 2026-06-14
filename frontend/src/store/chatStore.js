import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  userId: localStorage.getItem('astroagent_user_id') || `user_${Math.random().toString(36).substring(2, 9)}`,
  birthDetails: JSON.parse(localStorage.getItem('astroagent_birth_details')) || null,
  activeTools: [], // tracks executing tools (e.g. ['tool_geocode_place'])
  isLoading: false,
  theme: localStorage.getItem('astroagent_theme') || 'indigo',
  fontPairing: localStorage.getItem('astroagent_font') || 'sans',

  setTheme: (theme) => {
    localStorage.setItem('astroagent_theme', theme);
    set({ theme });
  },

  setFontPairing: (fontPairing) => {
    localStorage.setItem('astroagent_font', fontPairing);
    set({ fontPairing });
  },

  setBirthDetails: (details) => {
    localStorage.setItem('astroagent_birth_details', JSON.stringify(details));
    set({ birthDetails: details });
  },

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),

  setMessages: (messages) => set({ messages }),

  clearChat: () => {
    set({ messages: [] });
  },

  addActiveTool: (toolName) => set((state) => ({
    activeTools: state.activeTools.includes(toolName) 
      ? state.activeTools 
      : [...state.activeTools, toolName]
  })),

  removeActiveTool: (toolName) => set((state) => ({
    activeTools: state.activeTools.filter((t) => t !== toolName)
  })),

  clearActiveTools: () => set({ activeTools: [] }),

  setIsLoading: (isLoading) => set({ isLoading }),
}));

// Save user ID to local storage if it's new
if (!localStorage.getItem('astroagent_user_id')) {
  localStorage.setItem('astroagent_user_id', useChatStore.getState().userId);
}
