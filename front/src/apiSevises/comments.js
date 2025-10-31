export const createAnswer = (postId, content, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/posts/${postId}/comments`,
            options: {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: content}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});

export const updateAnswer = (commentId, content, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/comments/${commentId}`,
            options: {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: content}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});

export const likeComment = (commentId, type, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/comments/${commentId}/like`,
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

export const removeComment = (commentId,onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/comments/${commentId}`,
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


export async function getCommentLikes(id) {
    let res = await fetch(`/api/comments/${id}/like`);
    if (!res.ok) throw new Error(`Post ${id} likes loading error`);
    res = await res.json();
    return res;
}