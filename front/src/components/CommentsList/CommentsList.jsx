import {useEffect, useState} from "react";
import {getComments} from "../../apiSevises/posts.js";
import CommentItem from "../Comment/CommentItem.jsx";
import {useDispatch, useSelector} from "react-redux";
import {showCommentPopup} from "../../store/commentSlice.js";


export default function CommentsList(id) {
    const authors = useSelector(state => state.users.allUsers);

    const [comments, setComments] = useState(null);
    const newComment = useSelector(state => state.comments.newComment);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!id.id) return
        getComments(id.id).then((data) => {
            if (data.success) {
                setComments(data.comment);
            } else setComments([]);
            dispatch(showCommentPopup(false))
        })
    }, [id.id, newComment])


    return (<ul className="question-list">
        {(!authors || !comments) && <span>Loading...</span>}
        {(comments && comments.length === 0) && <span>No comments yet :\\ </span>}
        {(authors && comments) && comments.map(c => {
                const comment = {...c, author: authors[c.author]};
                return <CommentItem key={comment.id} comment={comment}></CommentItem>
            }
        )}
    </ul>)
}
