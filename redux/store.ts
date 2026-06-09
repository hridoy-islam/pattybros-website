import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER 
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';

// 1. Fix the "failed to create sync storage" error by creating a server-side fallback
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use real localStorage in the browser, fallback to dummy storage on the server
const safeStorage = typeof window !== 'undefined' 
  ? createWebStorage('local') 
  : createNoopStorage();

const persistConfig = {
  key: 'pattybros',
  storage: safeStorage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // 2. Fix the "non-serializable value" warning by ignoring internal persist lifecycle events
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;