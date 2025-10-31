// import "./CategoryItemLi.css"
// import Description from "../../Description/Description.jsx";
// import {useState} from "react";
// import {useDispatch, useSelector} from "react-redux";
// import {filter, update} from "../../store/categSlice.js";
//
//
// export default function CategoryItemLi({categoryId, description, children}) {
//     const [showDescription, setShowDescription] = useState(false);
//     const dispatch = useDispatch();
//     const allCategories = useSelector(state => state.categories.allCategories);
//     const selectedCategories = useSelector(state => state.categories.selectedCategories);
//
//     const handleSelect = () => {
//         const category = {id: categoryId, title: children, description: description};
//         dispatch(filter([...selectedCategories, category]));
//         const updatedCategories = allCategories.map(category =>
//             category.id === categoryId ? {...category, selected: true} : category
//         );
//         // console.log(updatedCategories);
//         dispatch(update({categories: updatedCategories}));
//     };
//
//     return (
//         <>
//             <li className="categoryItem">
//             <div className="categoryItem_title" onClick={() => setShowDescription(true)} title={"show description"}>
//                 {children}
//         </div>
//                 <button className="categoryItem_select" title={"add to filter"} onClick={handleSelect}></button>
//             </li>
//             {showDescription && (
//                 <Description onClose={() => setShowDescription(false)} title={children}>
//                     {description}
//                 </Description>
//             )}
//         </>);
// }

import styles from "./CategoryItemLi.module.css";
import Description from "../../Description/Description.jsx";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {filter, update} from "../../store/categSlice.js";

export default function CategoryItemLi({categoryId, description, children}) {
    const [showDescription, setShowDescription] = useState(false);
    const dispatch = useDispatch();
    const allCategories = useSelector(state => state.categories.allCategories);
    const selectedCategories = useSelector(state => state.categories.selectedCategories);

    const handleSelect = () => {
        const category = {id: categoryId, title: children, description: description};
        dispatch(filter([...selectedCategories, category]));
        const updatedCategories = allCategories.map(category =>
            category.id === categoryId ? {...category, selected: true} : category
        );
        dispatch(update({categories: updatedCategories}));
    };

    return (
        <>
            <li className={styles.categoryItem}>
                <div
                    className={styles.categoryItem_title}
                    onClick={() => setShowDescription(true)}
                    title="show description"
                >
                    {children}
                </div>
                <button
                    className={styles.categoryItem_select}
                    title="add to filter"
                    onClick={handleSelect}
                ></button>
            </li>
            {showDescription && (
                <Description id={categoryId} onClose={() => setShowDescription(false)} title={children}>
                    {description}
                </Description>
            )}
        </>
    );
}
