export async function getPosts(params) {
    params = _setParams(params);
    const res = await fetch(`/api/posts${params}`);
    if (!res.ok) throw new Error("Posts loading error");
    return res.json();
}

function _setParams(params) {
    const paramsArr = [];
    for (let key in params) {
        if (key === "categoryFilter" && params[key].length > 0) {
            params[key].forEach(id => {
                paramsArr.push(`category_id=${id}`);
            })
        } else if (key === "sort") {
            if (params[key][0]) {
                paramsArr.push(`sort0=${params[key][0]}`);
            }
            if (params[key][1]) {
                paramsArr.push(`sort1=${params[key][1]}`);
            }
        } else if (params[key] !== null) paramsArr.push(`${key}=${params[key]}`);
    }
    return `?${paramsArr.join("&")}`;
}

export async function getPostById(id) {
    const res = await fetch(`/api/posts/${id}`);
    if (!res.ok) throw new Error(`Post ${id} loading error`);
    return await res.json();
}

export async function getPostLikes(id) {
    let res = await fetch(`/api/posts/${id}/like`);
    if (!res.ok) throw new Error(`Post ${id} likes loading error`);
    res = await res.json();
    return res;
}

export async function getComments(id) {
    const res = await fetch(`/api/posts/${id}/comments`);
    return await res.json();
}


export const postPost = ({title, content, categories, onSuccess, onError}) => ({
    type: "api/call",
    payload: {
        request: {
            url: "/api/posts/",
            options: {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content, categories}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});

export const updatePost = (id, {title, content, categories, status, onSuccess, onError}) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/posts/${id}`,
            options: {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content, categories, status}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});



export const likePost = (postId, type, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/posts/${postId}/like`,
            options: {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({type: type}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});

export const removePost = (postId, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/posts/${postId}`,
            options: {
                method: "DELETE",
                // headers: {"Content-Type": "application/json"},
                // body: JSON.stringify({type: type}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});