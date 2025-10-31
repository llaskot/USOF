import {createPortal} from "react-dom";
import Button from "../Button/Button.jsx";
import AuthorizedButton from "../Button/AuthorizedButton.jsx";
import "./ComentPopup.css"


export default function CommentPopupAbstract({comment, setComment, handleComment, onClose, onRemove}) {


    return createPortal(
        <div className="description-dialog" onClick={onClose}>
            <div className="description-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup">
                    {onRemove && <AuthorizedButton className={"clean-all"} onChange={onRemove}>Remove</AuthorizedButton>}
                    <h2>Add your answer</h2>
                    <form onSubmit={handleComment}>
                        <label>
                            Comment:
                            <textarea className="question-page__content"
                                      value={comment}
                                      required
                                      minLength={4}
                                      placeholder="4 symbols minimum"
                                      onChange={(e) => setComment(e.target.value)}/>
                        </label>

                        <AuthorizedButton className={"clean-all"} type="submit">Send</AuthorizedButton>
                        </form>

                </div>

                <Button onChange={onClose} className="close-button">x</Button>
            </div>
        </div>,
        document.getElementById("modal"),
    );

}