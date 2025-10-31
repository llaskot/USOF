import {useDispatch, useSelector} from "react-redux";
import {setPage} from "../../store/postsSlice.js";
import "./Pagination.css"

export default function FindPage() {
    const dispatch = useDispatch();
    const totalQty = useSelector(state => state.posts.totalQty);
    return (
        <div className="jump-to-page">
            <span className="page"> # </span>
            <input className={"clean-all"} type="number" min="1" placeholder="Page #" id="jumpInput"/>
            <span className="page" onClick={() => {
                const page =  Math.floor(Number(document.getElementById("jumpInput").value))
                if (page >= 1 && page <= totalQty) {
                    dispatch(setPage(page));
                } else throw new Error(`Page ${document.getElementById("jumpInput").value} doesn't exist`);
            }}>Go</span>
        </div>
    )
}