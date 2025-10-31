export async function getUsers() {
    const res = await fetch(`/api/users`);
    if (!res.ok) throw new Error("Users loading error");
    return res.json();
}


export const uploadAvatar = (formData, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: "/api/users/avatar",
            options: {
                method: "PATCH",
                body: formData,
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});

export const getProfile = (id, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/users/${id}`,
            options: {
                method: "GET",
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});

export const updateUser = (id, body, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/users/${id}`,
            options: {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});