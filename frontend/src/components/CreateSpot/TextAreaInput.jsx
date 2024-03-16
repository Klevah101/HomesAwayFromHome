function TextAreaInput({ formId, title, errorMessage, setValue, placeholder }) {

    return (
        <>
            <label htmlFor={formId}><p>{title}</p></label>
            <textarea id={formId} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} />
            <label className="error">{errorMessage}</label>
        </>
    )
}

export default TextAreaInput;
