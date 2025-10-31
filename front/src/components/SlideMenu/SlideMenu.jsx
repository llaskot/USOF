import { useState } from "react";
import styles from "./SlideMenu.module.css";
import Button from "../Button/Button.jsx";
import AuthorizedButton from "../Button/AuthorizedButton.jsx";

export default function SlideMenu({ navigate }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.container}>
            <button className={styles.menuButton} onClick={() => setOpen(!open)}>
                Menu
            </button>

            <div className={`${styles.slidePanel} ${open ? styles.open : ""}`}>
                <Button onChange={() => navigate("/")}>Home</Button>
                <Button onChange={() => navigate("/search")}>Search</Button>
                <AuthorizedButton onChange={() => navigate("/profile")}>Profile</AuthorizedButton>
            </div>
        </div>
    );
}