import styles from "./Question.module.css"
import {useEffect, useState} from "react";
import {getPostById, getPostLikes, likePost} from "../../apiSevises/posts.js";
import {useDispatch, useSelector} from "react-redux";
import AuthorizedButton from "../Button/AuthorizedButton.jsx";
import {showCommentPopup, showUpdateCommentPopupStatus} from "../../store/commentSlice.js";
import Popup from "../PopUp/Popup.jsx";
import {setShowUpdateQuestion} from "../../store/postsSlice.js";
import {QuestionCategories} from "../Post/Post.jsx";
import {getPostCategories} from "../../apiSevises/categoties.js";
import CommentPopupCreate from "../CommentPopup/CommentPopupCreate.jsx";
import CommentPopupUpdate from "../CommentPopup/CommentPopupUpdate.jsx";
import UpdateQuestion from "../../pages/Question/UpdateQuestion.jsx";

export default function Question({id,}) {
    const [question, setQuestion] = useState(null);
    const [likes, setLikes] = useState(null);
    const dispatch = useDispatch();
    const likeStatus = useSelector(state => state.likes.status);
    const authors = useSelector(state => state.users.allUsers);
    const commentPopup = useSelector(state => state.comments.commentPopupStatus)
    const user = useSelector(state => state.auth.user);
    const showUpdateQuestion = useSelector(state => state.posts.showUpdateQuestion);
    const [categories, setCategories] = useState([]);
    const [categoriesId, setCategoriesId] = useState([]);
    const showUpdateCommentPopup = useSelector(state => state.comments.updateCommentPopupStatus)


    useEffect(() => {
        getPostLikes(id)
            .then(res => {
                setLikes(_processLikes(res.likes))
            })
    }, [likeStatus, id]);

    useEffect(() => {
        getPostById(id)
            .then(res => setQuestion(res.post));
        getPostCategories(id)
            .then(res => {
                setCategories(_processCategories(res.categories, setCategoriesId));
            });

    }, [id])

    const postUpdated = useSelector(state => state.posts.updatedPost);
    useEffect(() =>{
        getPostById(id)
            .then(res => setQuestion(res.post));
    },[postUpdated])


    if (!question) return <p>Loading...</p>;
    return (
        <>
            <div className="question-card">
                <div className="question-head">
                    <h2 className="question-title">{question.title}</h2>
                    {question.status === 1 &&
                        <AuthorizedButton className="clean-all" onChange={() => dispatch(showCommentPopup(true))}>
                            Add Answer
                        </AuthorizedButton>}
                    {question.status === 0 &&
                        <AuthorizedButton className="clean-all" disabled={true}>
                            Closed
                        </AuthorizedButton>}
                    {(question.author === user?.id || user?.role === "admin" ) &&
                        <AuthorizedButton className="clean-all" onChange={() => dispatch(setShowUpdateQuestion(true))}>
                            Change question
                        </AuthorizedButton>}
                </div>
                <p className={styles.questionContent}>{question.content}</p>

                <div className="question-meta">
                    {<QuestionCategories questionCat={categories}></QuestionCategories>}
                    <span>Author: {authors?.[question.author].full_name}</span>
                    <span> • </span>
                    <span> Rating: {authors?.[question.author].rating} </span>
                    <span> • </span>

                    <span>{new Date(question.publish_date).toLocaleDateString()}</span>
                </div>

                <div className="question-actions">
                    <AuthorizedButton className="clean-all" onChange={() => {
                        dispatch(likePost(
                            id, true, "postLikes/addSuccess"
                        ))
                    }}>👍 {likes ? likes.likes : 0}</AuthorizedButton>
                    <AuthorizedButton className="clean-all" onChange={() => {
                        dispatch(likePost(
                            id, false, "postLikes/addSuccess"
                        ))
                    }}>👎 {likes ? likes.dislikes : 0}</AuthorizedButton>
                </div>
                {
                    commentPopup &&
                    <CommentPopupCreate id={id} onClose={() => dispatch(showCommentPopup(false))}></CommentPopupCreate>
                }
                {
                    showUpdateQuestion &&
                    <Popup onClose={() => dispatch(setShowUpdateQuestion(false))}>
                        <UpdateQuestion question_obj={question}
                                        categoriesId={categoriesId}
                                        onClose={() => dispatch(setShowUpdateQuestion(false))}>

                        </UpdateQuestion>
                    </Popup>
                }
                {
                    showUpdateCommentPopup &&
                    <CommentPopupUpdate onClose={() => dispatch(showUpdateCommentPopupStatus(false))}/>
                }
            </div>
        </>
    );
}

function _processLikes(resp) {
    const res = {
        likes: 0,
        dislikes: 0,
    }
    resp.forEach(like => {
        if (like.type) res.likes += 1;
        else res.dislikes += 1;
    })
    return res;
}

function _processCategories(resp, setIds) {
    setIds(resp.map(cat => cat.id))
    return resp.map(cat => cat.title);
}