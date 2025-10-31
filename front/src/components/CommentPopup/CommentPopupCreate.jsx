import {useState} from "react";
import {useDispatch} from "react-redux";
import {createAnswer} from "../../apiSevises/comments.js";
import CommentPopupAbstract from "./CommentPopupAbstract.jsx";

export default function CommentPopupCreate({id, onClose}) {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();


    const handleComment = async (e) => {
        e.preventDefault();
        dispatch(createAnswer(
            id,
            comment,
            "comment/addSuccess", // передаем **строку**
        ));
    };


    return (
        <CommentPopupAbstract comment={comment} setComment={setComment} handleComment={handleComment} onClose={onClose} />
   )

}