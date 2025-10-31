import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import categoriesReducer from "./categSlice";
import postsReducer, {categListenerMiddleware} from "./postsSlice.js";
import usersReducer from "./userSlice";
import likesReducer from './likeSlice';
import commentReducer from "./commentSlice";
import {authMiddleware} from "./middleware/authCheck.js";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoriesReducer,
        posts: postsReducer,
        users: usersReducer,
        likes: likesReducer,
        comments: commentReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .prepend(categListenerMiddleware.middleware)
            .concat(authMiddleware),
});