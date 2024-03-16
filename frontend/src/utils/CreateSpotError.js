export const checkErrors = (inputs) => {
    const errors = {};
    if (inputs.country === "") errors["country"] = "Country is required";
    if (inputs.address === "") errors["address"] = "Address is required";
    if (inputs.city === "") errors["city"] = "City is required";
    if (inputs.state === "") errors["state"] = "State is required";
    // if (inputs.latitude === "") errors["latitude"] = "Latitude is required";
    // if (inputs.longitude === "") errors["longitude"] = "Longitude is required";
    if (inputs.title === "") errors["title"] = "Name is required";
    if (inputs.price === "") errors["price"] = "Price is required";
    if (inputs.previewImage === "") errors["previewImage"] = "Preview image is required";
    if (!validImageType(inputs.previewImage)) errors["previewImageValid"] = "Image URL must end in .png, .jpg, or .jpeg";


    if (!validImageType(inputs.image1)) errors["image1"] = "Image URL must end in .png, .jpg, or .jpeg";
    if (!validImageType(inputs.image2)) errors["image2"] = "Image URL must end in .png, .jpg, or .jpeg";
    if (!validImageType(inputs.image3)) errors["image3"] = "Image URL must end in .png, .jpg, or .jpeg";
    if (!validImageType(inputs.image4)) errors["image4"] = "Image URL must end in .png, .jpg, or .jpeg";

    if (!inputs.description || inputs.description.length < 30) {
        errors["description"] = "Description needs a minimum of 30 characters";
    }

    return errors;
}

function validImageType(str) {
    let valid = false;
    if (str.length === 0) valid = true
    if (str.slice(-4) === ".png") valid = true
    if (str.slice(-4) === ".jpg") valid = true
    if (str.slice(-5) === ".jpeg") valid = true
    return valid
}
