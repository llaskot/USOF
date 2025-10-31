import "./Question.css"
import {useParams} from "react-router-dom";
import Question from "../../components/Question/Question.jsx";
import CommentsList from "../../components/CommentsList/CommentsList.jsx";


export default function QuestionPage() {


    const id = useParams().id
    // const authors = useSelector(state => state.users.allUsers);

    return (<>
        <div className="-container">
            {<Question id ={id}/>}
            {id ? <CommentsList id={id} ></CommentsList> : <span>Loading...</span>}

        </div>


    </>)
}

