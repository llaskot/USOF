import {createAsyncThunk, createListenerMiddleware, createSlice} from "@reduxjs/toolkit";
import {filter} from "./categSlice.js";
import {getPosts} from "../apiSevises/posts.js";

const initialState = {
    requestParams: {
        allCategory: true,
        categoryFilter: [],
        date_from: null,
        date_to: null,
        inactive: false,
        my_own: false,
        sort: ["dateDESC", "likeDESC"]
    },
    allPosts: [],
    loading: false,
    reset: true,
    pagination: {page: 1, limit: 5},
    totalQty: 0,
    newPostId: null,
    showUpdateQuestion: false,
    updatedPost: false

};


export const fetchPosts = createAsyncThunk(
    "posts/fetch",
    async (params, {dispatch}) => {
        dispatch(setLoading(true));
        const data = await getPosts(params);
        dispatch(update({posts: data.posts}));
        dispatch(setTotalQty(data.total));
        dispatch(setLoading(false));
        return data.posts;
    }
);



const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        update: (state, action) => {
            state.allPosts = action.payload.posts;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCategoryFilter: (state, action) => {
            state.requestParams.categoryFilter = action.payload.map(category => category.id);
        },
        setDateFrom: (state, action) => {
            state.requestParams.date_from = action.payload;
        },
        setDateTo: (state, action) => {
            state.requestParams.date_to = action.payload;
        },
        setSort: (state, action) => {
            state.requestParams.sort = action.payload;
        },
        setAllCategory: (state, action) => {
            state.requestParams.allCategory = action.payload;
        },
        setInactive: (state, action) => {
            state.requestParams.inactive = action.payload;
        },
        cleanAll: (state) => {
            state.requestParams = initialState.requestParams;
            state.reset = !state.reset;
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
        },
        setTotalQty: (state, action) => {
            state.totalQty = action.payload;
        },
        clearNewPostId: (state) => {
            state.newPostId = null;
        },
        setMy_own: (state, action) => {
            state.requestParams.my_own = action.payload;
        },
        setShowUpdateQuestion: (state, action) => {
            state.showUpdateQuestion = action.payload;
        }



    },
    extraReducers: (builder) => {
        builder
            .addCase("posts/createPostSuccess", (state, action) => {
            state.newPostId = action.payload.id;
        })
            .addCase("posts/updatePostSuccess", (state) => {
                state.showUpdateQuestion = false
                state.updatedPost = !state.updatedPost;
            })
        ;
    },
});

export const categListenerMiddleware = createListenerMiddleware();

categListenerMiddleware.startListening({
    actionCreator: filter, // слушаем каждый вызов filter()
    effect: async (action, listenerApi) => {
        const state = listenerApi.getState();
        const selected = state.categories.selectedCategories;
        listenerApi.dispatch(setCategoryFilter(selected));
    },
});


export let {
    update, setLoading, setCategoryFilter, setDateTo, setDateFrom, setSort, setMy_own, setShowUpdateQuestion,
    setAllCategory, setInactive, cleanAll, setLimit, setPage, setTotalQty,  clearNewPostId
} = postsSlice.actions;
export default postsSlice.reducer;