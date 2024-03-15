function TextInput({ formId, title, errorMessage, inputType, setValue, defaultValue }) {

    return (
        <>
            <label htmlFor={formId}><p>{title} </p></label>
            <input type={inputType} className="input-field" id={formId} defaultValue={defaultValue} onChange={(e) => setValue(e.target.value)} />
            <label className="error">{errorMessage}</label>
        </>
    )
}

{/* <label htmlFor="country"><p> Country <span className="error">{errors.country}</span></p></label>
<input type="text" defaultValue={country} id="country" onChange={(e) => { setCountry(e.target.value) }} /> */}

export default TextInput;
