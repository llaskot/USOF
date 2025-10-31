export async function getSearch(val) {
    let res = await fetch(`/api/search?word=${encodeURIComponent(val)}`);
    if (!res.ok) throw new Error(`Posts loading error`);
    res = await res.json();
    return res;
}