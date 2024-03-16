

function TextInput({ formId, title, errorMessage, inputType, setValue, defaultValue,placeholder }) {

    return (
        <>
            <label htmlFor={formId}><p>{title} </p></label>
            <input type={inputType} className="input-field" id={formId} defaultValue={defaultValue} onChange={(e) => setValue(e.target.value)} placeholder={placeholder}/>
            <label className="error">{errorMessage}</label>
        </>
    )
}

export default TextInput;
