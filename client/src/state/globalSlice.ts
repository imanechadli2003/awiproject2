// src/state/globalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@/state/api'; // ou le chemin correct vers votre type Session

interface GlobalState {
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  activeSession: Session | null; // Ajoutez cette propriété
}

const initialState: GlobalState = {
  isDarkMode: false,
  isSidebarCollapsed: false,
  activeSession: null, // initialisez à null
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setIsDarkMode(state, action: PayloadAction<boolean>) {
      state.isDarkMode = action.payload;
    },
    setIsSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.isSidebarCollapsed = action.payload;
    },
    setActiveSession(state, action: PayloadAction<Session | null>) {
      state.activeSession = action.payload;
    },
  },
});

export const { setIsDarkMode, setIsSidebarCollapsed, setActiveSession } = globalSlice.actions;
export default globalSlice.reducer;
