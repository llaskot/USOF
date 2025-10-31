import {createAsyncThunk} from "@reduxjs/toolkit";
import {logout, showLoginModal, updateToken} from "../store/authSlice.js";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {refreshToken} from "../apiSevises/authorization.js";


const fetchRefresh = createAsyncThunk(
    "refresh/fetch",
    async (_, { dispatch }) => {
        const res = await refreshToken();
        dispatch(updateToken({ token: res.token }));
    }
);


    export default function useCheck() {
        const dispatch = useDispatch();
        const user = useSelector((state) => state.auth.user);

        useEffect(() => {
            if (!user) {
                console.error("User not authorized!");
                return;
            }
            dispatch(fetchRefresh())
                .unwrap()
                .then(() => {
                    // console.log("Token refreshed");
                })
                .catch((error) => {
                    console.error("Failed to refresh token:", error);
                    dispatch(logout());
                    dispatch(showLoginModal(true))
                });
        }, [user, dispatch]);

}