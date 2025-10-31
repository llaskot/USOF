import Description from "../../Description/Description.jsx";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {filter, update} from "../../store/categSlice.js";
import "./SelectedCategories.css"


export default function SelectedItem({categoryId, description, children}) {
    const [showDescription, setShowDescription] = useState(false);
    const dispatch = useDispatch();
    const allCategories = useSelector(state => state.categories.allCategories);
    const selectedCategories = useSelector(state => state.categories.selectedCategories);

    const handleRemove = () => {
        const newSelected = selectedCategories.filter(category => category.id !== categoryId);
        dispatch(filter(newSelected));
        const updatedCategories = allCategories.map(category =>
            category.id === categoryId ? {...category, selected: false} : category
        );
        // console.log(updatedCategories);
        dispatch(update({categories: updatedCategories}));
    };

    return (
        <>
            <li className='selected'>
            <div className="selectedItem_title" onClick={() => setShowDescription(true)} title={"show description"}>
                {children}
        </div>
                <button className="categoryItem_remove" title={"remove from filter"} onClick={handleRemove}></button>
            </li>
            {showDescription && (
                <Description onClose={() => setShowDescription(false)} title={children}>
                    {description}
                </Description>
            )}
        </>);
}