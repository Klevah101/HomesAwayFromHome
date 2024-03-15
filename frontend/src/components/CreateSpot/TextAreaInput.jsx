function TextAreaInput({ formId, title, errorMessage, setValue, defaultValue }) {

    return (
        <>
            <label htmlFor={formId}><p>{title}</p></label>
            <textarea id={formId} defaultValue={defaultValue} onChange={(e) => setValue(e.target.value)} />
            <label className="error">{errorMessage}</label>
        </>
    )
}

{/* <label htmlFor="country"><p> Country <span className="error">{errors.country}</span></p></label>
<input type="text" defaultValue={country} id="country" onChange={(e) => { setCountry(e.target.value) }} /> */}

export default TextAreaInput;
