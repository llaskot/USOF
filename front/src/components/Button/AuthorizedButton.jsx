import './Button.css';
import { useAuthAction } from "../../hooks/useAuthAction.js";


export default function AuthorizedButton({className, onChange, children, ...rest}) {
    const authAction = useAuthAction();
    return (
        <button
            className={className}
            onClick={() => {
                if (onChange) authAction(onChange)
            }}
            {...rest}
        >
            {children}
        </button>
    );
}