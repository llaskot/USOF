// Redux middleware

import {showLoginModal, updateToken} from "../authSlice";// action для открытия попапа
import {refreshToken} from "../../apiSevises/authorization.js";

// middleware — это функция, которая возвращает функцию, которая возвращает функцию
export const authMiddleware = (storeAPI) => (next) => async (action) => {

    // Если это не наш специальный API action — пропускаем дальше
    if (action.type !== "api/call") {
        return next(action);
    }

    // Здесь будем обрабатывать action с fetch и токеном
    const {request, onSuccess, onError} = action.payload;
    // console.log("what insaid",  typeof onSuccess);

    const state = storeAPI.getState();
    const token = state.auth.token;

    try {
        // fetch с токеном
        let res = await fetch(request.url, {
            ...request.options,
            headers: {
                ...request.options.headers,
                Authorization: `Bearer ${token}`,
            },
        });

        // дальше будем обрабатывать 403 и повтор запроса
        if (res.status === 403) {
            let refreshRes
            try {
                refreshRes = await refreshToken();
            } catch (error) {
                storeAPI.dispatch(showLoginModal(true));
                console.error(error);
                return storeAPI.dispatch({type: onError, payload: "auth_required"});
            }

            storeAPI.dispatch(updateToken({token: refreshRes.token}));

            // Повторяем исходный запрос с новым токеном

            res = await fetch(request.url, {
                ...request.options,
                headers: {
                    ...request.options.headers,
                    Authorization: `Bearer ${refreshRes.token}`,
                },
            });
        } else if (!res.ok) {
            const errData = await res.json();
            alert(`response ERROR: ${errData.message || res.status}`);
            storeAPI.dispatch({type: onError, payload: errData.message});
            return; // завершить middleware
        }


        // если успешный ответ
        const data = await res.json();
        // storeAPI.dispatch(onSuccess(data));
        if (onSuccess) {
            try {
                console.log("middleware do it", onSuccess)
                storeAPI.dispatch({type: onSuccess, payload: data})
                console.log(data)
            } catch (error) {
                console.error(error);
            }
        }
    } catch (err) {
        if (onError) storeAPI.dispatch({type: onError, payload: err.message});
    }
};