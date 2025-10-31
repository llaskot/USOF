import "./Toggle.css"

export default function Toggle({value, onChange, labels = ["All", "Any"], suffix = ""}) {
    let currentLabel = value ? labels[0] : labels[1];

    return (
        <button
            className={`toggle-switch ${currentLabel.toLowerCase()}`}
            onClick={() => {
                onChange(!value)
            }}
        >
            {currentLabel} {suffix}
        </button>
    );
}