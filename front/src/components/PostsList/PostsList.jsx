import {useSelector} from "react-redux";
import Post from "../Post/Post.jsx";
import "./PostsList.css"


export default function PostsList() {

    const loading = useSelector(state => state.posts.loading);
    const postItem  = useSelector(state => state.posts.allPosts);

    return(

        <ul className="question-list">
            {loading && <li>Loading...</li>}
            {!loading && postItem.map(item => <Post key={item.id} question={item} ></Post>)}
        </ul>
    )
}


