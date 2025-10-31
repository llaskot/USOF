import AuthorizedButton from "../Button/AuthorizedButton.jsx";
import {useEffect, useState} from "react";
import {getCommentLikes, likeComment} from "../../apiSevises/comments.js";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentComment, showUpdateCommentPopupStatus} from "../../store/commentSlice.js";


export default function CommentItem({comment}) {
    const user = useSelector((state) => state.auth.user);
    const [likes, setLikes] = useState(null);
    const dispatch = useDispatch();
    const newLikes = useSelector(state => state.likes.commentLikeStatus);
    useEffect(() => {
        getCommentLikes(comment.id)
            .then(res => {
                setLikes(_processLikes(res.likes))
            })
    }, [comment, newLikes]);
    console.log(user?.role)

    return (
        <li className="comment-item">
            <div className="question-header">
                <p className="questionContent">
                    {comment.content}
                </p>
                <div><span className="question-meta">
                    author: {comment.author?.full_name}
                </span>
                    <span className="question-meta"> • </span>
                    <span className="question-meta">
                    Rating: {comment.author?.rating}
                </span>
                    <span className="question-meta"> • </span>

                    <span className="question-meta">
                    published: {new Date(comment.publish_date).toLocaleDateString()}
                </span></div>
            </div>
            <div className="question-actions">
                {((user?.id === comment.author.id) || (user?.role === "admin")) &&
                    <AuthorizedButton className="clean-all" onChange={() => {
                        dispatch(setCurrentComment(comment));
                        dispatch(showUpdateCommentPopupStatus(true));
                    }}>
                        Update comment
                    </AuthorizedButton>}
                <AuthorizedButton className="clean-all" onChange={() => {
                    dispatch(likeComment(
                        comment.id, true, "commentLikes/addSuccess"
                    ))
                }}>👍 {likes ? likes.likes : 0}</AuthorizedButton>
                <AuthorizedButton className="clean-all" onChange={() => {
                    dispatch(likeComment(
                        comment.id, false, "commentLikes/addSuccess"
                    ))
                }}>👎 {likes ? likes.dislikes : 0}</AuthorizedButton>
            </div>
        </li>
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