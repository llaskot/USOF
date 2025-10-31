import {useDispatch, useSelector} from "react-redux";
import {setLimit, setPage} from "../../store/postsSlice.js";
import "./Pagination.css"

export default function ItemQtySelector() {
    const limit = useSelector(state => state.posts.pagination.limit);
    const dispatch = useDispatch();

    const options = [4, 10, 50];

    return (
        <div className="item-qty-container">
            <span>Show: </span>
            {options.map((opt) => (
                <span
                    key={opt}
                    className={`item-qty${limit === opt ? " selected" : ""}`}
                    onClick={() => {
                        dispatch(setLimit(opt));
                        dispatch(setPage(1));
                    }}
                >
                    {opt}
                </span>
            ))}
        </div>
    );
}