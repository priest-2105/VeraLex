import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { account, databases } from '../lib/appwrite'; // Import databases
import { AppwriteException } from 'appwrite'; // Import AppwriteException

// Async thunk to check for existing session and fetch user data + profile
export const checkUserSession = createAsyncThunk(
  'auth/checkUserSession',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Check for active session & get auth data
      const authData = await account.get();
      
      // 2. Fetch corresponding profile data from Database
      const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const PROFILE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID;

      if (!DATABASE_ID || !PROFILE_COLLECTION_ID) {
        console.error("Appwrite DB/Collection IDs missing in env for checkUserSession");
        // Return only auth data if profile fetch isn't possible, but log error
        return authData; 
      }

      try {
        const profileData = await databases.getDocument(
          DATABASE_ID,
          PROFILE_COLLECTION_ID,
          authData.$id // Use auth ID to get profile doc
        );
        // 3. Return combined data
        return { ...authData, profile: profileData };
      } catch (dbError) {
          console.error("Failed to fetch user profile during session check:", dbError);
          // If profile fetch fails, maybe return auth data only or specific error?
          // Returning auth data allows app to function partially.
          return rejectWithValue({ ...authData, profileError: 'Could not load profile.' }); 
      }

    } catch (error) {
      // If account.get() fails, no active session
      if (error instanceof AppwriteException && error.code !== 401) {
           // Log unexpected errors during account.get()
           console.error("Unexpected error during session check:", error);
       } 
      // Don't log expected 401 (no session) as an error
      return rejectWithValue('No active session');
    }
  }
);

const initialState = {
  user: null, // Holds combined user object { ...authData, profile: profileData }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Can store error messages or codes
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to manually set user data (e.g., after login/signup)
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = action.payload ? 'succeeded' : 'idle'; // Adjust status based on payload
      state.error = null;
    },
    // Action to clear user data (on logout)
    clearUser: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    // Optionally set loading/error states directly if needed
    setAuthLoading: (state) => {
        state.status = 'loading';
    },
    setAuthError: (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload; // Payload is now combined object
        state.error = null;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null; // Clear user on rejection
        // Store reason for rejection if needed (e.g., 'No active session', or profile load error)
        state.error = action.payload; 
      });
  },
});

export const { setUser, clearUser, setAuthLoading, setAuthError } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer; 