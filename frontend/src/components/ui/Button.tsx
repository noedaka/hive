interface ButtonProps {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

export default function Button({ type = "button", onClick, children, className = "" }: ButtonProps) {
    return (
        <button type={type} onClick={onClick} className={`form-button ${className}`}>
            {children}
        </button>
    );
}