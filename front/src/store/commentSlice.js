import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    commentPopupStatus: false,
    newComment: false,
    updateCommentPopupStatus: false,
    currentComment: {},
}



const commentSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        showCommentPopup: (state, action) => {
            state.commentPopupStatus = action.payload;
        },
        showUpdateCommentPopupStatus: (state, action) => {
            state.updateCommentPopupStatus = action.payload;
        },
        setCurrentComment: (state, action) => {
            state.currentComment = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase("comment/addSuccess", (state, action) => {
            console.log("Like reducer", action.payload);
            state.newComment = !state.newComment;
        });
    },
});

export const {showCommentPopup, showUpdateCommentPopupStatus, setCurrentComment} = commentSlice.actions;
export default commentSlice.reducer;

