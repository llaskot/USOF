import {useDispatch, useSelector} from "react-redux";
import styles from "./ProfilePage.module.css"
import AuthorizedButton from "../../components/Button/AuthorizedButton.jsx";
import ProfilePhoto from "../../components/FilePicker/FilePicker.jsx";
import {updateShowAvaPopup} from "../../store/userSlice.js";
import React, {useEffect, useRef, useState} from "react";
import {getProfile, updateUser} from "../../apiSevises/users.js";


export default function ProfilePage() {
    const dispatch = useDispatch();
    const pickAva = useSelector(state => state.users.showAvaPopup)
    const [loginEdit, setLoginEdit] = useState(false);
    const [validLogin, setValidLogin] = useState(false);
    const [newLogin, setNewLogin] = useState(false);

    const [fullNameEdit, setFullNameEdit] = useState(false);
    const [newFullName, setNewFullName] = useState(false);

    const [passEdit, setPassEdit] = useState(false);


    let user = useSelector((state) => state.auth.user) || {
        role: "user",
        login: "no_name",
        email: "no_name",
        full_name: "no_name",
        // rating: 0,
        profile_picture: null
    }

    const {
        id,
        login,
        full_name,
        email,
        role = "user",
        profile_picture,
        rating,
        activities = {posts: 0, comments: 0},
    } = user

    const updatedLogin = useSelector(state => state.users.newUser)
    useEffect(() => {
        dispatch(getProfile(id, "profile/getSuccess"));
        setLoginEdit(false)
        setFullNameEdit(false)
        setPassEdit(false)
    }, [updatedLogin])



    return (
        <div className={styles.profilePage}>
            <div className={styles.profileLeft}>
                <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>Login: {login}</span>
                    <AuthorizedButton className={styles.editBtn} onChange={() => setLoginEdit(true)}>Edit</AuthorizedButton>
                </div>
                {loginEdit && (
                    <>
                        <LoginEditField val={login} setValidLogin={setValidLogin} setNewLogin={setNewLogin} />
                        <div className={styles.actions}>
                            <AuthorizedButton className={styles.saveBtn} onChange={() => dispatch(updateUser(id, {login: newLogin}, "login/updateSuccess"))} disabled={!validLogin}>Save</AuthorizedButton>
                            <AuthorizedButton className={styles.cancelBtn} onChange={() => setLoginEdit(false)}>Cancel</AuthorizedButton>
                        </div>
                    </>
                )}

                <div className={styles.profileField}>
                    <span className={styles.fieldLabel}>Full Name: {full_name}</span>
                    <AuthorizedButton className={styles.editBtn} onChange={() => setFullNameEdit(true)}>Edit</AuthorizedButton>
                </div>
                {fullNameEdit && (
                    <>
                        <FullNameEditField cur_name={full_name} newFullName={newFullName} setNewFullName={setNewFullName} />
                        <div className={styles.actions}>
                            <AuthorizedButton className={styles.saveBtn} onChange={() => dispatch(updateUser(id, {full_name: newFullName}, "login/updateSuccess"))} disabled={!newFullName}>Save</AuthorizedButton>
                            <AuthorizedButton className={styles.cancelBtn} onChange={() => setFullNameEdit(false)}>Cancel</AuthorizedButton>
                        </div>
                    </>
                )}

                <p className={styles.profileField}>E-mail: {email}</p>
                <p className={styles.profileField}>Role: {role}</p>
                <p className={styles.profileField}>Rating: {rating}</p>
                <p className={styles.profileField}>Posts: {activities.posts}, Comments: {activities.comments}</p>

                <AuthorizedButton className={styles.editBtn} onChange={() => setPassEdit(true)}>Change Password</AuthorizedButton>
                {passEdit && <PasswordEditFields id={id} onClose={setPassEdit} />}
            </div>

            <div className={styles.profileRight}>
                <img className="profile-picture" src={profile_picture ? `api/upload/${profile_picture}` : "api/upload/placeholder.png"} alt="Profile" />
                <AuthorizedButton className={styles.editBtn} onChange={() => {
                    console.log(("clicked"));
                    dispatch(updateShowAvaPopup(true))
                }}>Edit</AuthorizedButton>

                {pickAva && (
                    <ProfilePhoto
                        currentPhoto={profile_picture ? `api/upload/${profile_picture}` : "api/upload/placeholder.png"}
                        onClose={() => dispatch(updateShowAvaPopup(false))}
                    />
                )}

            </div>
        </div>
    );
}


export function LoginEditField({cur_login, setValidLogin, setNewLogin}) {

    const loginPattern = "^[\\-a-zA-Z0-9_]{6,64}$";
    const handleLoginBlur = async (e) => {
        const {validity, value} = e.target;
        const input = e.target;
        const tip = document.querySelector("#login_tip");
        input.setCustomValidity("");
        tip.hidden = true;

        if (!validity.valid) {
            input.setCustomValidity("Use A-z, 0-9,  _-, 6-64 Symbols");
            tip.textContent = "Use A-z, 0-9,  _-, 6-64 Symbols";
            tip.hidden = false;
            setValidLogin(false);
            return;
        }

        try {
            const res = await fetch(`/api/auth/check-login?login=${encodeURIComponent(value)}`);
            const body = await res.json();
            if (!body.success) {
                input.setCustomValidity(body.message);
                tip.textContent = body.message;
                tip.hidden = false;
                setValidLogin(false);

            } else {
                input.setCustomValidity("")
                tip.hidden = true;
                setValidLogin(true);
                setNewLogin(value)
            }

        } catch (err) {
            console.error("Check login error ", err);
            setValidLogin(false);

        }
    };
    return (
        <label className="field">
            <span className="label-text">Login</span>
            <input
                name="login"
                type="text"
                pattern={loginPattern}
                required
                onChange={handleLoginBlur}
                className="input"
                placeholder={cur_login}
            />
            <div className="error">
                            <span id="login_tip"
                                  className="err-when-valid"
                                  hidden={true}
                            ></span>
            </div>

        </label>
    )
}

function FullNameEditField({cur_name, setNewFullName, newFullName}) {

    const fullNamePattern = "^(?=(?:.*[A-Za-z]){2,}).{2,32}$";
    const handleChange = (e) => {
        if (e.target.validity.valid) {
            setNewFullName(e.target.value);
        } else {
            setNewFullName(null)
        }
    }


    return (
        <label className="field">
            <span className="label-text">Full Name</span>
            <input
                name="full_name"
                type="text"
                pattern={fullNamePattern}
                required
                onChange={handleChange}
                className="input"
                placeholder={cur_name}
            />
            <div className="error">
                {!newFullName && (
                    <span>At least 2 letters</span>
                )}
            </div>

        </label>
    )
}

function PasswordEditFields({id, onClose}
) {
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);


    const checkPasswordMatch = () => {
        const form = formRef.current;

        if (!form) return;
        const password = form.elements.password.value;
        const confirm = form.elements.confirmPassword.value;
        if (confirm && password !== confirm) {
            form.elements.confirmPassword.setCustomValidity("password doesn't match");
            setPasswordError(false);
        } else {
            form.elements.confirmPassword.setCustomValidity("");
            setPasswordError(true);
        }
    };

    const handlePasswordInput = () => {
        checkPasswordMatch();
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        dispatch(updateUser(id, {
            password: formRef.current.elements.password.value,
            confirmation: formRef.current.elements.confirmPassword.value,
        }, "login/updateSuccess"))
    }
    return (

        <>
            <form ref={formRef} onSubmit={handleSubmit}>
                <label className="field">
                    <span className="label-text">Password</span>
                    <div className="password-wrapper">

                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            minLength={8}
                            maxLength={16}
                            required
                            onInput={handlePasswordInput}
                            className="input"
                        />
                        <button
                            type="button"
                            className="toggle-visibility"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <div className="error">
                        {!passwordError && (
                            <span> 8-16 sym.Required at least 1 Upper, 1 lowercase 1 number.</span>
                        )}
                    </div>

                </label>

                <label className="field">
                    <span className="label-text">Confirm password</span>
                    <div className="password-wrapper">
                        <input
                            name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            required
                            onInput={handlePasswordInput}
                            className="input"
                        />
                        <button
                            type="button"
                            className="toggle-visibility"
                            onClick={() => setShowConfirm(prev => !prev)}
                        >
                            {showConfirm ? "🙈" : "👁️"}
                        </button>
                    </div>
                    <div className="error">
                        {!passwordError && (
                            <span>Password does not match.</span>
                        )}
                    </div>

                </label>
                <AuthorizedButton
                    type="submit"
                    disabled={!passwordError}
                >Save new Password</AuthorizedButton>
                <AuthorizedButton
                    type="button"
                    onChange={() => {
                        onClose(false)
                    }}
                >Cancel</AuthorizedButton>
            </form>
        </>


    )


}




