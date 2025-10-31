import './Button.css';

export default function Button({className, onChange, children}) {

    return (
        <button
            className={className}
            onClick={() => {
                onChange()
            }}
        >
            {children}
        </button>
    );
}