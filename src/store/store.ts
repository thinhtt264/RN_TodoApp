import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: __DEV__,
});


// 
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch | any>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store };