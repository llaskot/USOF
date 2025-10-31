import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../../store/categSlice.js";
import {removePost, updatePost} from "../../apiSevises/posts.js";
import {useNavigate} from "react-router-dom";
import {clearNewPostId} from "../../store/postsSlice.js";
import CreateQuestionAbstract from "./CreateQuestionAbstract.jsx";
import AuthorizedButton from "../../components/Button/AuthorizedButton.jsx";

export default function UpdateQuestion({question_obj, categoriesId, onClose}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const newPostId = useSelector(state => state.posts.newPostId);

    const [title, setTitle] = useState(question_obj.title);
    const [content, setContent] = useState(question_obj.content);
    const [categories, setCategories] = useState(categoriesId);
    const [status, setActive ] = useState(!!question_obj.status);
    const navgate = useNavigate();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (newPostId != null) {
            navigate(`/question/${newPostId}`);
            dispatch(clearNewPostId());
        }
    }, [newPostId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updatePost(question_obj.id, {
            title,
            content,
            categories,
            status,
            onSuccess: "posts/updatePostSuccess",
            onError: "posts/createPostError",
        }));
    };

    const handleRemove = () => {
        dispatch(removePost(question_obj.id,));
        onClose();
        navgate('/');
    }

    return (
        <>
            <h1 className="question-page__header">Update Question</h1>
            <div className="question-page_buttons">
                <label> active
                <input
                    type="checkbox"
                    checked={status}
                    onChange={e => setActive(e.target.checked)}
                />
            </label>
                <AuthorizedButton className="clean-all" onChange={handleRemove}>Remove</AuthorizedButton>
            </div>


            <CreateQuestionAbstract handleSubmit={handleSubmit} title={title} setTitle={setTitle} content={content}
                                   setContent={setContent}
                                   categories={categories} setCategories={setCategories}></CreateQuestionAbstract>
        </>
    );
}
