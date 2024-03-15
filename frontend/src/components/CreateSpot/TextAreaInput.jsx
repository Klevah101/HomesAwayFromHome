function TextAreaInput({ formId, title, errorMessage, setValue, defaultValue }) {

    return (
        <>
            <label htmlFor={formId}><p>{title}</p></label>
            <textarea id={formId} defaultValue={defaultValue} onChange={(e) => setValue(e.target.value)} />
            <label className="error">{errorMessage}</label>
        </>
    )
}

export default TextAreaInput;
