function TextInput({ formId, title, errorMessage, inputType, setValue, defaultValue }) {

    return (
        <>
            <label htmlFor={formId}><p>{title} <span className="error">{errorMessage}</span></p></label>
            <input type={inputType} id={formId} defaultValue={defaultValue} onChange={(e) => setValue(e.target.value)} />
        </>
    )
}

{/* <label htmlFor="country"><p> Country <span className="error">{errors.country}</span></p></label>
<input type="text" defaultValue={country} id="country" onChange={(e) => { setCountry(e.target.value) }} /> */}

export default TextInput;
