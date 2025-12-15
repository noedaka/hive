export interface FormInputProps {
    type?: string
    id: string
    name: string
    value: string
    placeholder: string
    required?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    label?: string
    error?: string  
    disabled?: boolean 
}

export default function FormInput({
    type = "text",
    id,
    name,
    value,
    placeholder,
    required = false,
    onChange,
    label,
    error, 
    disabled = false  
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
                className={`form-input ${error ? 'form-input-error' : ''}`}  
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled} 
            />
            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}
        </div>
    )
}