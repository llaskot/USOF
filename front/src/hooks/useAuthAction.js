import { useSelector, useDispatch } from "react-redux";
import { showLoginModal } from "../store/authSlice.js";

export function useAuthAction() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    return (callback) => {
            if (!user) {
                dispatch(showLoginModal(true));
                return;
            }
            callback(); // if authorized
        };
}