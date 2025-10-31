
import './App.css'

import Header from "./components/Header/Header.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.jsx";
import useCheck from "./hooks/checkAuthorization.js";
import QuestionPage from "./pages/Question/Question.jsx";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage.jsx";
import AskQuestionPage from "./pages/Question/AskQuestion.jsx";
import SearchPage from "./pages/Search/SearcPage.jsx";
import Footer from "./components/Futer/Footer.jsx";



function App(){
    useCheck();
    return (
        <BrowserRouter>
            <Header />
            <div id="modal"></div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/registration" element={<RegistrationPage />} />
                <Route path="/question" element={<AskQuestionPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/question/:id" element={<QuestionPage />} />

            </Routes>
            <Footer/>

        </BrowserRouter>
    );
}

export default App
