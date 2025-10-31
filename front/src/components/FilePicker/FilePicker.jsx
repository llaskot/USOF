import {useRef, useState} from "react";
import {createPortal} from "react-dom";
import {useDispatch} from "react-redux";
import {createAnswer} from "../../apiSevises/comments.js";
import {uploadAvatar} from "../../apiSevises/users.js";

export default function ProfilePhoto({currentPhoto, onUpload, onClose}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleButtonClick = () => {
        inputRef.current.click();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("file", selectedFile);

        dispatch(uploadAvatar(
            formData,
            // "comment/addSuccess", // передаем **строку**
        ));
    };

    return createPortal(
        <div className="description-dialog" onClick={onClose}>
            <div className="description-content" onClick={(e) => e.stopPropagation()}>


                <div className="popup">
                    <img
                        src={selectedFile ? URL.createObjectURL(selectedFile) : currentPhoto}
                        alt="Avatar"
                        width={100}
                        height={100}
                        style={{
                            width: '60px',
                            height: '80px',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                    <div>
                        <button onClick={handleButtonClick}>Change Photo</button>
                        {selectedFile && <button onClick={handleUpload}>Upload</button>}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        style={{display: "none"}}
                        onChange={handleFileChange}
                    />
                </div>

                <button onClick={onClose} className="close-button">x</button>
            </div>
        </div>
        ,
        document.getElementById("modal"),
    );
}

