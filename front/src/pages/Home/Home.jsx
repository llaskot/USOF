import {useEffect} from "react";
import CategoriesList from "../../components/CategoriesList/CategoriesList.jsx";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../../store/categSlice.js";
import PostsList from "../../components/PostsList/PostsList.jsx";
import {fetchPosts} from "../../store/postsSlice.js";
import "./Home.css"
import SelectedCategories from "../../components/SelectedCategories/SelectedCategories.jsx";
import Filters from "../../components/Filters/FiltersSection/Filters.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import AuthorizedButton from "../../components/Button/AuthorizedButton.jsx";
import {useNavigate} from "react-router-dom";


export default function Home() {
    const dispatch = useDispatch();
    const requestParams = useSelector(state => state.posts.requestParams);
    const paginationParams = useSelector(state => state.posts.pagination)
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchPosts({...requestParams, ...paginationParams}));

    }, [dispatch, paginationParams, requestParams]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <>
            <div className="home-container">
                <div className="main-content">
                    <SelectedCategories/>
                    <div>
                        <Filters/>
                        <Pagination/>
                        <AuthorizedButton className={"qButton"} onChange={() => {
                            navigate(`/question`)
                        }}>
                            Ask Question
                        </AuthorizedButton>
                    </div>
                    <PostsList/>
                </div>

                <div className="sidebar">
                    <CategoriesList/>
                </div>
            </div>
        </>
    )
}