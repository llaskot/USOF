import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../../store/categSlice.js";
import {postPost} from "../../apiSevises/posts.js";
import {useNavigate} from "react-router-dom";
import {clearNewPostId} from "../../store/postsSlice.js";
import CreateQuestionAbstract from "./CreateQuestionAbstract.jsx";
import AuthorizedButton from "../../components/Button/AuthorizedButton.jsx";
import styles from "../../components/AuthorizationPopup/AuthorizationPopup.module.css";
import {addCategory} from "../../apiSevises/categoties.js";

export default function CreateQuestion() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newPostId = useSelector(state => state.posts.newPostId);

    const [createCategory , setCreateCategory] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState([]);
    const [updCat, setUpdCat] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch, updCat]);

    useEffect(() => {
        if (newPostId != null) {
            navigate(`/question/${newPostId}`);
            dispatch(clearNewPostId());

        }
    }, [newPostId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(postPost({
            title,
            content,
            categories,
            onSuccess: "posts/createPostSuccess",
            onError: "posts/createPostError",
        }));
    };


    const [categoryTitle, setCategoryTitle] = useState("");
    const [categoryContent, setCategoryContent] = useState("");

    const handleCreteCategory = (e) => {
        e.preventDefault();
        dispatch(addCategory(categoryTitle, categoryContent)).then(() => {
            setCategoryTitle("");
            setCategoryContent("");
            setCreateCategory(false);
            setUpdCat(!updCat);
        });
    }

    return (
        <>
            <h1 className="question-page__header">Create Question</h1>
            <CreateQuestionAbstract handleSubmit={handleSubmit} title={title} setTitle={setTitle} content={content}
                                    setContent={setContent}
                                    categories={categories} setCategories={setCategories}></CreateQuestionAbstract>
            <AuthorizedButton className={styles.catButton} onChange={() => setCreateCategory(!createCategory)}>Add category</AuthorizedButton>
            {createCategory &&  <SetCategories
                categoryTitle={categoryTitle}
                categoryContent={categoryContent}
                setCategoryContent={setCategoryContent}
                setCategoryTitle={setCategoryTitle}
                onSubmit={handleCreteCategory}
                onClose={() => setCreateCategory(false)}


            ></SetCategories>}

        </>
    );
}


export function SetCategories({onSubmit, categoryTitle, setCategoryTitle,
                                  categoryContent, setCategoryContent, onClose, btnName = "Cancel" }) {

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <label>
                Title:
                <input
                    className={styles.input}
                    type="text"
                    value={categoryTitle}
                    onChange={e => setCategoryTitle(e.target.value)}
                />
            </label>
            <label>
                Description
                <input
                    className={styles.input}
                    type="text"
                    value={categoryContent}
                    onChange={e => setCategoryContent(e.target.value)}
                />
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className={styles.submitButton}>
                    Save
                </button>
                <button type="button" onClick={onClose} className={styles.runAwayButton}>
                    {btnName}
                </button>
            </div>
        </form>
    )
}