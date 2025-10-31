
import "./Pagination.css"
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "../../store/postsSlice.js";

export default function PaginationScroll() {

    const paginationSettings = useSelector(state => state.posts.pagination);
    const totalQty = useSelector(state => state.posts.totalQty);
    const pageQty = _getPagesQty(totalQty, paginationSettings.limit);
    const dispatch = useDispatch();


    return (
        <div className="pages">
            <span className="page">Pages: </span>
            <button className="page selected" onClick={() =>
                dispatch(setPage(1))
            }>1
            </button>

            <div className="arrow" onClick={() => {
                if (paginationSettings.page > 1) dispatch(setPage(paginationSettings.page - 1))
            }}>◀
            </div>

            {Shelf(pageQty, paginationSettings.page)}

            <div className="arrow" onClick={() => {
                if (paginationSettings.page < pageQty) dispatch(setPage(paginationSettings.page + 1))
            }}>▶
            </div>

            <button className="page selected" onClick={() =>
                dispatch(setPage(pageQty))
            }>{pageQty}</button>

        </div>
    )

}

function Shelf(pageQty, currentPage) {
    const dispatch = useDispatch();
    const shelf = []
    if (pageQty <= 5 || currentPage <= 3) {
        for (let i = 1; i <= Math.min(5,pageQty ); i++) {
            shelf.push(i)
        }
    } else if (currentPage > pageQty - 3) {
        for (let i = pageQty - 4; i <= pageQty; i++) {
            shelf.push(i)
        }
    } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            shelf.push(i)
        }
    }

    return (
        <div className="shelf">
            {(shelf[0] > 1) && <span>...</span>}
            {shelf.map((item) => {
                return <span className={item === currentPage ? "page selected" : "page"}
                             onClick={() => dispatch(setPage(item))} key={item}>
                    {item}
                 </span>
            })}
            {(shelf[shelf.length - 1] < pageQty) && <span>...</span>}


        </div>)


}

function _getPagesQty(totalQty, pageQty) {
    return Math.trunc(totalQty / pageQty) + (totalQty % pageQty > 0);
}