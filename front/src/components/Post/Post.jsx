import "./Post.css"
import Button from "../Button/Button.jsx";
import {useNavigate} from "react-router-dom";

export default function Post({question}) {
    const navigate = useNavigate();
    // console.log(question);

    const goToQuestion = () => {
        navigate(`/question/${question.id}`);
    };
    return (
        <li className="question-item" >
            <div className="question-header">
                <strong className="question-title">{question.title}</strong>
                <Button className={"clean-all answers"} onChange={
                    goToQuestion
                }>
                    Show answers: {question.com_qty}
                </Button>
                <span className="question-meta">
          author: {question.author} • published: {new Date(question.publish_date).toLocaleDateString()}
        </span>
            </div>
            <p className="question-content" >{question.content}</p>
            <div className="question-footer">

                {
                    <QuestionCategories questionCat={question.categ_titles}></QuestionCategories>
                }
                <div className="likes"><span className="question-likes"> {question.status === 1 ? "Opened" : "Closed"}</span>

                    <span className="question-likes">👍 {question.likes}</span>
                    <span className="question-likes">👎 {question.reactions - question.likes}</span></div>
            </div>
        </li>
    );
}


export function QuestionCategories ({questionCat}) {
    if (typeof questionCat === "string") {
        questionCat = questionCat.split(",")
    }
    return (
        <span className="question-categories">
          {questionCat.map((cat, i) => (
              <span key={i} className="question-category">{cat.trim()}</span>
          ))}
        </span>
    )
}