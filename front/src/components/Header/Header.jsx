
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchUsers} from "../../store/userSlice.js";
import Button from "../Button/Button.jsx";
import {useNavigate} from "react-router-dom";
import {logout, showLoginModal} from "../../store/authSlice.js";
import AuthorizationPopup from "../AuthorizationPopup/AuthorizationPopup.jsx";
import {logoutUser} from "../../apiSevises/authorization.js";
import {getProfile} from "../../apiSevises/users.js";
import {SearchForm} from "../../pages/Search/SearcPage.jsx";
import SlideMenu from "../SlideMenu/SlideMenu.jsx";
import styles from "./Header.module.css";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginModal = useSelector(state => state.auth.loginModal);
    const user = useSelector(state => state.auth.user);
    const [avatar, setAvatar] = useState("/api/upload/placeholder.png");
    const [value, setValue] = useState("");

    async function logOut() {
        await logoutUser().then(dispatch(logout())).catch(err => {
            dispatch(logout());
            console.error(err)
        });
    }

    const goToRegistration = () => {
        navigate(`/registration`);
    };

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (user?.profile_picture) {
            setAvatar(`/api/upload/${user.profile_picture}`);
        } else {
            setAvatar('/api/upload/placeholder.png');
        }
    }, [user]);

    const goToProfile = () => {
        if (user?.id) {
            dispatch(getProfile(user.id, "profile/getSuccess"));
            navigate(`/profile`);
        } else {
            dispatch(showLoginModal(true));
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h2 className={styles.title}>Innovation Campus Q&A</h2>


                <div className={styles.menu}>
                    <span className={styles.home} onClick={() => navigate("/")}>
                        🏠
                    </span>
                    <SlideMenu navigate={navigate}></SlideMenu>
                </div>


            </div>
<div className={styles.right}>
            <div className={styles.center}>
                <SearchForm
                    value={value}
                    setValue={setValue}
                    onSubmit={() => navigate(`/search/?query=${encodeURIComponent(value)}`)}
                    inputClass={styles.searchInput}
                    buttonClass={styles.searchButton}
                />
            </div>

            <div className={styles.userSection}>
                <div className={styles.buttons}>
                    {!user && <Button className={styles.headerButton} onChange={() => dispatch(showLoginModal(true))}>Sign IN</Button>}
                    {!user && <Button className={styles.headerButton} onChange={goToRegistration}>Sign UP</Button>}
                    {user && <Button className={styles.headerButton} onChange={logOut}>Sign OUT</Button>}
                </div>
                <div className={styles.user} onClick={goToProfile}>
                    <img src={avatar} alt="User avatar" className={styles.avatar}/>
                    <h5 className={styles.username}>{user ? user.full_name : "Not Authorized"}</h5>
                </div>
            </div>
</div>
            {loginModal && <AuthorizationPopup onClose={() => dispatch(showLoginModal(false))}/>}
        </header>
    )
}
