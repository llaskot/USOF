import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUsers} from "../apiSevises/users.js";


const initialState = {
    allUsers: null,
    showAvaPopup: false,
    newUser: false,
}

export const fetchUsers = createAsyncThunk(
    "users/fetch",
    async (_, {dispatch}) => {
        const data = await getUsers();
        dispatch(updateUsers(_processUsers(data.users)));
    }
);

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        updateUsers: (state, action) => {
            state.allUsers = action.payload;
        },
        updateShowAvaPopup: (state, action) => {
            state.showAvaPopup = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase("login/updateSuccess", (state) => {
                state.newUser = !state.newUser;
            })

    },

});

function _processUsers(users){
    const res = {}
    users.forEach((user) => {
        res[user.id] = user;

    })
    return res;
}



export const {updateUsers, updateShowAvaPopup} = usersSlice.actions;
export default usersSlice.reducer;