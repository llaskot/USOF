import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {removeComment, updateAnswer} from "../../apiSevises/comments.js";
import CommentPopupAbstract from "./CommentPopupAbstract.jsx";

export default function CommentPopupUpdate({onClose}) {
    const oldComment = useSelector(state => state.comments.currentComment);
    const [comment, setComment] = useState(oldComment?.content);
    const dispatch = useDispatch();


    const handleComment = async (e) => {
        e.preventDefault();
        dispatch(updateAnswer(
            oldComment?.id,
            comment,
            "comment/addSuccess", // передаем **строку**
        ));
        onClose()
    };



    return (
        <>
            <CommentPopupAbstract comment={comment} setComment={setComment} handleComment={handleComment}
                                 onClose={onClose} onRemove={
                () => {
                    dispatch(removeComment(oldComment.id, "comment/addSuccess"));
                    onClose();
                }
            }/>
        </>
    )

}