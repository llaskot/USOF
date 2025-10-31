import React, {useState} from "react";
import "./ConfirmationForm.css"
import {confirmEmail} from "../../apiSevises/authorization.js";
import {loginSuccess} from "../../store/authSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function ConfirmationForm({onBack}) {
    const [code, setCode] = useState("");
    const [serverError, setServerError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        setServerError("");
        confirmEmail({code: Number(code)})
            .then((res) =>
                {
                    if (!res.success) {
                        setServerError(res.message)
                    }else{
                        dispatch(loginSuccess(res))
                        navigate(`/`);
                    }
                }
            )
            .catch(err => setServerError(err.message))

    };

    return (
        <div className="registration-container">
            <form className="registration-form confirmation-form" onSubmit={handleSubmit}>
                <h2>Confirm Registration</h2>
                <div className="info">Confirmation Code has been successfully sent.
                    Please check your e-mail and complete the registration.</div>
                <span></span>
                <label className={'label-text'}>
                    <span>Confirmation Code</span>
                    <input className={"input"}
                           type="text"
                           value={code}
                           maxLength={6}
                           onChange={e => setCode(e.target.value.replace(/\D/g, ''))} // оставляем только цифры
                           placeholder="Enter code from email"
                           required
                    />
                </label>
                <div className="actions">
                    <button className="btn" type="submit">Confirm</button>
                    <button className="btn" type="button" onClick={onBack}>Back</button>
                </div>
                {serverError && <div className="server-error">{serverError}</div>}

            </form>
        </div>
    );
}