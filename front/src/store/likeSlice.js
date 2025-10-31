import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    status: false,
    commentLikeStatus: false
}



const likeSlice = createSlice({
    name: "likes",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase("postLikes/addSuccess", (state) => {
            // console.log("Like reducer",);
            state.status = !state.status;
        })
            .addCase("commentLikes/addSuccess", (state) => {
                state.commentLikeStatus = !state.commentLikeStatus;
            });
    },

});

export default likeSlice.reducer;
