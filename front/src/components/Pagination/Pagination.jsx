import "./Pagination.css"
import ItemQtySelector from "./ItemQtySelector.jsx";
import PaginationScroll from "./PaginationScroll.jsx";
import FindPage from "./FindPage.jsx";




export default function Pagination() {


    return (
        <div className="pagination-container">
            <ItemQtySelector></ItemQtySelector>
            <PaginationScroll></PaginationScroll>
            <FindPage></FindPage>
        </div>

    )


}


