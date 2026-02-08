import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auth from "./Auth/authSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import activity from "./activity/activitySlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import wishlistReducer from "./wishlist/wishlistSlice";
import notificationReducer from "./notification/notificationSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  activity,
  auth,
  wishlist: wishlistReducer,
  notification: notificationReducer, // Remove persistReducer for notification
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
