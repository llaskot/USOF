export async function getCategories() {
    const res = await fetch("/api/categories");
    if (!res.ok) throw new Error("Category loading error");
    return res.json();
}

export async function getPostCategories(id){
    const res = await fetch(`/api/posts/${id}/categories`);
    if (!res.ok) throw new Error("Category loading error");
    return res.json();
}

export const addCategory = (title, content, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/categories`,
            options: {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({description: content, title: title}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});


export const updateCategory = (catId, title, content, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/categories/${catId}`,
            options: {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({description: content, title: title}),
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});

export const removeCategory = (catId, onSuccess, onError) => ({
    type: "api/call",
    payload: {
        request: {
            url: `/api/categories/${catId}`,
            options: {
                method: "DELETE",
            }
        },
        onSuccess, // ← передаём функцию
        onError
    }
});