import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: sessionStorage.getItem("accessToken") || null,
    loginModal: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            sessionStorage.setItem("accessToken", action.payload.token);
        },
        logout: (state) => {

            state.user = null;
            state.token = null;
            localStorage.removeItem("user");
            sessionStorage.removeItem("accessToken");
        },
        updateToken: (state, action) => {
            state.token = action.payload.token;
            sessionStorage.setItem("accessToken", action.payload.token);
        },
        showLoginModal: (state, action) => {
            state.loginModal = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase("profile/getSuccess", (state, action) => {
            state.user = action.payload.user;
        });
    },
});

export const { loginSuccess, logout, updateToken, showLoginModal } = authSlice.actions;
export default authSlice.reducer;