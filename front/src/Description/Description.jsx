import "./Description.css";
import {createPortal} from "react-dom";
import {useDispatch, useSelector} from "react-redux";
import AuthorizedButton from "../components/Button/AuthorizedButton.jsx";
import {SetCategories} from "../pages/Question/CreateQuestion.jsx";
import {useState} from "react";
import { removeCategory, updateCategory} from "../apiSevises/categoties.js";
import {fetchCategories} from "../store/categSlice.js";

export default function Description({id, children, title, onClose}) {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [createCategory, setCreateCategory] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState(title);
    const [categoryContent, setCategoryContent] = useState(children);

    const handleUpdateCategory = (e) => {
        e.preventDefault();
        dispatch(updateCategory(id, categoryTitle, categoryContent)).then(() => {
            setCategoryTitle("");
            setCategoryContent("");
            setCreateCategory(false);
            dispatch(fetchCategories())
            onClose()
        });
    }

    const handleRemoveCategory = (e) => {
        e.preventDefault();
        dispatch(removeCategory(id)).then(() => {
            setCategoryTitle("");
            setCategoryContent("");
            setCreateCategory(false);
            dispatch(fetchCategories())
            onClose()
        });
    }


    return createPortal(
        <div className="description-dialog" onClick={onClose}>
            <div className="description-content" onClick={(e) => e.stopPropagation()}>
                {user?.role === "admin" &&
                    <AuthorizedButton className={"clean-all"} onChange={() => setCreateCategory(!createCategory)}>Edit</AuthorizedButton>}
                {createCategory && <SetCategories
                    categoryTitle={categoryTitle}
                    categoryContent={categoryContent}
                    setCategoryContent={setCategoryContent}
                    setCategoryTitle={setCategoryTitle}
                    onSubmit={handleUpdateCategory}
                    onClose={handleRemoveCategory}
                    btnName={"Remove"}


                ></SetCategories>}
                <h4>{title}</h4>
                {children}
                <button onClick={onClose} className="close-button">x</button>
            </div>
        </div>,
        document.getElementById("modal"),
    );
}