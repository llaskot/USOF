import {useSelector} from "react-redux";
import SelectedItem from "./SelectedItem.jsx";


export default function SelectedCategories() {
    const loading = useSelector(state => state.categories.loading);
    const categories = useSelector(state => state.categories.selectedCategories);
    return (<>
            <ul className="selectedCategories">
                {loading && <li>Loading...</li>}
                {!loading && categories
                    .map(category =>
                        <SelectedItem key={category.id} categoryId ={category.id} description={category.description}>{
                            category.title
                        }</SelectedItem>)}
            </ul>
        </>
    )
}