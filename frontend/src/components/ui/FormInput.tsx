export interface FormInputProps {
    type?: string
    id: string
    name: string
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    label?: string
}

export default function FormInput({
    type = "text",
    id,
    name,
    value,
    placeholder,
    required = false,
    onChange,
    label
}: FormInputProps) {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={id} className="form-label">{label}</label>
            )}
            <input 
                type={type}
                id={id}
                name={name}
                className="form-input"
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}