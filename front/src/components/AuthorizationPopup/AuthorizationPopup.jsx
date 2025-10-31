import {login} from "../../apiSevises/authorization.js";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {loginSuccess} from "../../store/authSlice.js";
import {createPortal} from "react-dom";
import styles from "./AuthorizationPopup.module.css";

export default function AuthorizationPopup({onClose}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            if (data.success) {
                dispatch(loginSuccess(data));
                onClose();
            } else {
                setError(data?.message || "Invalid login or password");
                dispatch(loginSuccess(null, null));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popupContainer} onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className={styles.closeButton}>x</button>
                <h2>Authorization</h2>
                <form onSubmit={handleLogin} className={styles.form}>
                    <label>
                        Login:
                        <input
                            className={styles.input}
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            className={styles.input}
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button type="submit" className={styles.submitButton}>
                            Welcome on the dark side)
                        </button>
                        <button type="button" onClick={onClose} className={styles.runAwayButton}>
                            Run away
                        </button>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                </form>

            </div>
        </div>,
        document.getElementById("modal")
    );
}
