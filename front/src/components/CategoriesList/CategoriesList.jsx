import {useSelector} from "react-redux";
import useInput from "../../hooks/useInpt.js";
import CategoryItemLi from "../CategoryItemLi/CategoryItemLi.jsx";
import "./CategoryList.css"


export default function CategoriesList() {
    const input = useInput()
    const loading = useSelector(state => state.categories.loading);
    const categories = useSelector(state => state.categories.allCategories);
    return (<>
            <div className="categorySearchContainer">
                <input type="text" {...input} className="categorySearch" placeholder="quick category search"/>
            </div>
            <ul className="categoriesList">
                {loading && <li>Loading...</li>}
                {!loading && categories
                    .filter(category => !category.selected && category.title.toLowerCase()
                        .includes(input.value.toLowerCase()))
                    .map(category =>
                        <CategoryItemLi key={category.id} categoryId={category.id} description={category.description}>{
                            category.title
                        }</CategoryItemLi>)}
            </ul>
        </>
    )
}