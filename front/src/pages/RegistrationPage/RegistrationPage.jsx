

import { useState } from "react";
import "./RegistrationPage.css";
import RegistrationForm from "../../components/RegistrationForm/RegistrationForm.jsx";
import ConfirmationForm from "../../components/ConfirmationForm/ConfirmationForm.jsx";



export default function RegistrationPage() {
    const [step, setStep] = useState("register");


    return (
        <div className="registration-page">
            <div style={{ display: step === "register" ? "block" : "none" }}>
                <RegistrationForm onSubmit={() => setStep("confirm")} />
            </div>

            <div style={{ display: step === "confirm" ? "block" : "none" }}>
                <ConfirmationForm onBack={() => setStep("register")} />
            </div>
        </div>
    );
}
