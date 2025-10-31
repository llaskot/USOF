import {useEffect, useState} from "react";
import Post from "../../components/Post/Post.jsx";
import {getSearch} from "../../apiSevises/search.js";
import {useLocation} from "react-router-dom";
import "./SearcPage.css"
import styles from "../../components/Header/Header.module.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// --- Форма поиска ---
export function SearchForm({value, setValue, onSubmit, buttonClass, inputClass}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim().length >= 3) onSubmit();
    }
    return (
        <form onSubmit={handleSubmit}>
            <input className={inputClass}
                   type="text"
                   value={value}
                   onChange={e => setValue(e.target.value)}
                   placeholder="Search..."
                   minLength={3}
                   required
            />
            <button type="submit" className={buttonClass}>Search</button>
            <div style={{
                height: '1rem',
                marginTop: '0.2rem',
                fontSize: '0.75rem',
                color: '#aaa',
                lineHeight: '1rem'
            }}>
                <p style={{margin: 0}}>
                    {value.length < 3 && "Input at least 3 characters"}
                </p>
            </div>
        </form>
    );
}

export default function SearchPage() {
    const queryParam = useQuery().get("query") || "";
    const [value, setValue] = useState(queryParam);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [searchBy, setSearchBy] = useState("");

    // При монтировании читаем данные из sessionStorage
    useEffect(() => {
        try {
            const savedPosts = JSON.parse(sessionStorage.getItem("searchPosts") || "[]");
            setPosts(savedPosts);
        } catch { /* empty */
        }
        try {
            const savedSearch = JSON.parse(sessionStorage.getItem("searchRes") || '""');
            setSearchBy(savedSearch);
        } catch { /* empty */
        }
    }, []);

    // Сохраняем posts и searchBy в sessionStorage при изменении
    useEffect(() => {
        sessionStorage.setItem("searchPosts", JSON.stringify(posts));
        sessionStorage.setItem("searchRes", JSON.stringify(searchBy));
    }, [posts, searchBy]);
    useEffect(() => {
        console.log("USEEFFECT  ", queryParam);
        if (queryParam) {
            doSearch(queryParam).then(() => setSearchBy(queryParam))
        }
    }, [queryParam]);

    // Выполнение поиска
    const doSearch = async (val) => {
        setLoading(true);
        const data = await getSearch(val);
        setPosts(data.posts);
        setSearchBy(value);
        setValue("");
        setLoading(false);
    };

    return (
        <>
            <SearchForm value={value} setValue={setValue} inputClass={styles.searchInput}
                        buttonClass={styles.searchButton} onSubmit={() => doSearch(value)}/>
            <div className={"searchBar"}>
                {searchBy && (
                    <div>
                        <span>Search: </span>
                        <span className="query">[ "{searchBy}" ]</span>
                    </div>
                )}
                <div className="hint">
                    <span>Search by User name, Question title, Question content, Answer content, Category description</span>
                </div>
            </div>

            {loading && <p>Loading...</p>}

            <ul className="question-list">
                {!loading && posts.map(item => <Post key={item.id} question={item}/>)}
            </ul>
        </>
    );
}
