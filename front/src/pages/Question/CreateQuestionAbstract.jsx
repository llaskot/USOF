import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../../store/categSlice.js";
import AuthorizedButton from "../../components/Button/AuthorizedButton.jsx";

export default function CreateQuestionAbstract({
                                                   handleSubmit, title, setTitle, content, setContent,
                                                   categories, setCategories
                                               }) {
    const dispatch = useDispatch();
    const categoriesList = useSelector(state => state.categories.allCategories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="question-page">
            <form className="question-page__form" onSubmit={handleSubmit}>
                <input
                    className="question-page__title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    minLength={6}
                    maxLength={64}
                    placeholder="Title"
                />
                <textarea
                    className="question-page__content"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    minLength={20}
                    maxLength={1600}
                    placeholder="Content"
                />

                <div className="question-page__categories">
                    {categoriesList.map(cat => (
                        <label key={cat.id} className="category-option">
                            <input
                                type="checkbox"
                                value={cat.id}
                                checked={categories.includes(cat.id)}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    setCategories(prev =>
                                        e.target.checked
                                            ? [...prev, id]
                                            : prev.filter(c => c !== id)
                                    );
                                }}
                            />
                            <span>{cat.title}</span>
                        </label>
                    ))}
                </div>

                <AuthorizedButton className="question-page__submit" type="submit">
                    Submit
                </AuthorizedButton>
            </form>

        </div>
    );
}
