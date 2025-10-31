import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCategories} from "../apiSevises/categoties.js";

const initialState = {
    allCategories:  [],
    selectedCategories: [],
    loading: false,
};


export const fetchCategories = createAsyncThunk(
    "categories/fetch",
    async (_, { dispatch }) => {
        dispatch(setLoading(true));
        const data = await getCategories();
        data.categories.forEach(category => {category.selected = false;});
        dispatch(update({ categories: data.categories }));
        dispatch(setLoading(false));
    }
);



const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        update: (state, action) => {
            state.allCategories = action.payload.categories;
        },
        filter: (state, action) => {
            state.selectedCategories = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const { update, filter, setLoading } = categoriesSlice.actions;
export default categoriesSlice.reducer;