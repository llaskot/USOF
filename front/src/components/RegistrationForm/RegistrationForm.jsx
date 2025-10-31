// RegistrationForm.jsx
import React, {useState, useRef} from "react";
import "./RegistrationForm.css";
import Button from "../Button/Button.jsx";
import {registration} from "../../apiSevises/authorization.js";

export default function RegistrationForm({onSubmit}) {

    const [touched, setTouched] = useState({
        login: false,
        email: false,
        password: false,
        confirmPassword: false,
        full_name: false,
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState(""); // если нужен серверный отклик
    const formRef = useRef(null);

    const loginPattern = "^[\\-a-zA-Z0-9_]{6,64}$";
    const fullNamePattern = "^(?=(?:.*[A-Za-z]){2,}).{2,32}$";

    const handleBlur = (e) => {
        setTouched(prev => ({...prev, [e.target.name]: true}));
    };

    const handleLoginBlur = async (e) => {
        const {name, validity, value} = e.target;
        const input = e.target;
        const tip = document.querySelector("#login_tip");
        input.setCustomValidity("");
        tip.hidden = true;

        if (!validity.valid) {
            input.setCustomValidity("Use A-z, 0-9,  _-, 6-64 Symbols");
            tip.textContent = "Use A-z, 0-9,  _-, 6-64 Symbols";
            tip.hidden = false;
            setTouched(prev => ({...prev, [name]: true}));
            return;
        }

        try {
            const res = await fetch(`/api/auth/check-login?login=${encodeURIComponent(value)}`);
            const body = await res.json();
            if (!body.success) {
                input.setCustomValidity(body.message);
                setTouched(prev => ({...prev, [name]: true}));
                tip.textContent = body.message;
                tip.hidden = false;
            } else {
                input.setCustomValidity("")
                setTouched(prev => ({...prev, [name]: true}));
                tip.hidden = true;
            }

        } catch (err) {
            console.error("Check login error ", err);
        }
    };

    const handEmailBlur = async (e) => {
        const {name, validity, value} = e.target;
        const input = e.target;
        const tip = document.querySelector("#email_tip");
        input.setCustomValidity("");
        tip.hidden = true;

        if (!validity.valid) {
            input.setCustomValidity("Input valid e-mail");
            tip.textContent = "Input valid e-mail";
            tip.hidden = false;
            setTouched(prev => ({...prev, [name]: true}));
            return;
        }

        try {
            const res = await fetch(`/api/auth/check-email?email=${encodeURIComponent(value)}`);
            const body = await res.json();
            if (!body.success) {
                input.setCustomValidity(body.message);
                setTouched(prev => ({...prev, [name]: true}));
                tip.textContent = body.message;
                tip.hidden = false;
            } else {
                input.setCustomValidity("")
                setTouched(prev => ({...prev, [name]: true}));
                tip.hidden = true;
            }

        } catch (err) {
            console.error("Check Email error ", err);
        }
    };

    // Проверяем совпадение паролей: ставим customValidity на confirmPassword input
    const checkPasswordMatch = () => {
        const form = formRef.current;
        if (!form) return;
        const password = form.elements.password.value;
        const confirm = form.elements.confirmPassword.value;
        if (confirm && password !== confirm) {
            form.elements.confirmPassword.setCustomValidity("Пароли не совпадают");
        } else {
            form.elements.confirmPassword.setCustomValidity("");
        }
    };

    const handlePasswordInput = () => {
        checkPasswordMatch();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setServerError("");

        // перед сабмитом пометим все поля как touched, чтобы показать ошибки
        setTouched({
            login: true,
            email: true,
            password: true,
            confirmPassword: true,
            full_name: true,
        });

        const form = formRef.current;
        if (!form) return;

        checkPasswordMatch();

        if (!form.checkValidity()) {
            return;
        }

        const payload = {
            login: form.elements.login.value,
            email: form.elements.email.value,
            password: form.elements.password.value,
            confirmation: form.elements.confirmPassword.value,
        };
        if (form.elements.full_name.value) payload.full_name = form.elements.full_name.value;


        registration(payload)
            .then(res =>
                {
                    if (res.success) {
                        onSubmit?.();
                    }else {
                        setServerError(res.message);
                    }
                }
            )
            .catch(err => setServerError(err.message));

    };

    return (
        <div className="registration-container">
            <form ref={formRef} className="registration-form" noValidate onSubmit={handleSubmit}>
                <h2 className={"h2"}>Registration</h2>

                <label className="field">
                    <span className="label-text">Login</span>
                    <input
                        name="login"
                        type="text"
                        pattern={loginPattern}
                        required
                        onBlur={handleLoginBlur}
                        className="input"
                    />
                    <div className="error">
                            <span id="login_tip"
                                  className="err-when-valid"
                                  hidden={true}
                            ></span>
                    </div>

                </label>


                <label className="field">
                    <span className="label-text">Full Name</span>
                    <input
                        name="full_name"
                        type="text"
                        pattern={fullNamePattern}
                        // required
                        onBlur={handleBlur}
                        className="input"
                    />
                    <div className="error">
                        {touched.full_name && !formRef.current?.elements.full_name.validity.valid && (
                            <span>At least 2 letters</span>
                        )}
                    </div>

                </label>


                <label className="field">
                    <span className="label-text">Email</span>
                    <input
                        name="email"
                        type="email"
                        required
                        onBlur={handEmailBlur}
                        className="input"
                    />
                    <div className="error">
                            <span id="email_tip"
                                  className="err-when-valid"
                                  hidden={true}
                            ></span>
                    </div>
                </label>

                <label className="field">
                    <span className="label-text">Password</span>
                    <div className="password-wrapper">

                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            minLength={8}
                            maxLength={16}
                            required
                            onBlur={handleBlur}
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
                        {touched.password && !formRef.current?.elements.password.validity.valid && (
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
                            onBlur={handleBlur}
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
                        {touched.confirmPassword && !formRef.current?.elements.confirmPassword.validity.valid && (
                            <span>Password does not match.</span>
                        )}
                    </div>

                </label>
                {serverError && <div className="server-error">{serverError}</div>}


                <div className="actions">
                    <Button type="submit" className="btn" onChange={() => {
                    }}>Register</Button>
                </div>
            </form>
        </div>
    );
}
