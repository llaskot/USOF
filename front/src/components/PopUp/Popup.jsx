
import {createPortal} from "react-dom";
import Button from "../Button/Button.jsx";

export default function Popup({children, onClose}) {

    return createPortal(
        <>


            <div className="description-dialog" onClick={onClose}>
                <div className="description-content" onClick={(e) => e.stopPropagation()}>
                    <div className="popup">
                        <Button onChange={onClose} className="close-button">x</Button>

                        {children}
                    </div>

                </div>
            </div>
        </>,
        document.getElementById("modal"),
    );

}