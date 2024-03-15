import { useState } from "react"
import './CreateSpot.css'
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import { checkErrors } from "../../utils/CreateSpotError";
import { useDispatch, } from "react-redux"
import { createSpot, deleteSpot, getUserSpots } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import { getSpotDetails } from "../../store/spot-details";
function CreateSpot() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('Please write at least 30 characters');
    const [title, setTitle] = useState('Name your spot');
    const [price, setPrice] = useState('Price per night (USD)');
    const [previewImage, setPreviewImage] = useState('Preview Image URL');
    const [image1, setImage1] = useState('Image URL');
    const [image2, setImage2] = useState('Image URL');
    const [image3, setImage3] = useState('Image URL');
    const [image4, setImage4] = useState('Image URL');
    const [errors, setErrors] = useState({})

    const inputs = {
        country,
        address,
        city,
        state,
        latitude,
        longitude,
        description,
        title,
        price,
        previewImage,
        image1,
        image2,
        image3,
        image4
    }
 
    return (
        <div className="spotFormWrapper">

            <form className="spotForm" onSubmit={async (e) => {
                e.preventDefault();
                setErrors(checkErrors(inputs));
                if (Object.keys(errors).length === 0) {
                    let urls = [];

                    previewImage && urls.push({ preview: true, url: previewImage })
                    image1 && urls.push({ preview: false, url: image1 })
                    image2 && urls.push({ preview: false, url: image2 })
                    image3 && urls.push({ preview: false, url: image3 })
                    image4 && urls.push({ preview: false, url: image4 })

                    const spotInfo = {
                        urls,
                        info: {
                            country,
                            address,
                            city,
                            state,
                            lng: parseInt(latitude),
                            lat: parseInt(longitude),
                            description,
                            name: title,
                            price: parseInt(price),
                        }
                    }
                    // console.log(spotInfo);
                    // redo so that images and spot creation are decoupled
                    const response = await dispatch(createSpot(spotInfo));
                    // navigate to spot's detail page

                    if (response.name === title && response.description === description) {
                        const gusResponse = await dispatch(getUserSpots());

                        const spot = gusResponse.Spots.find(element => element.id === response.id)
                        if (spot.previewImage) {
                            await dispatch(getSpotDetails(response.id));
                            navigate(`/spots/${response.id}`);
                        } else {
                            await dispatch(deleteSpot(response.id))
                        }
                    }
                }
            }}>
                <div className="location">
                    <h2>Create a new Spot</h2>
                    <h3>Where&apos;s your place located?</h3>
                    <p>Guest will only get your exact address once they booked a reservation.</p>
                    <TextInput title="Country" formId="country" errorMessage={errors.country} inputType="text" defaultValue={country} setValue={setCountry} />
                    <TextInput title="Street Address" formId="address" errorMessage={errors.address} inputType="text" defaultValue={address} setValue={setAddress} />
                    <div className="two-item-input">
                        <div>
                            <TextInput title="City" formId="city" errorMessage={errors.city} inputType="text" defaultValue={city} setValue={setCity} />
                        </div>
                        <div>
                            <TextInput title="State" formId="state" errorMessage={errors.state} inputType="text" defaultValue={state} setValue={setState} />
                        </div>
                    </div>
                    <div className="two-item-input">
                        <div>
                            <TextInput title="Latitude" formId="latitude" errorMessage={errors.latitude} inputType="text" defaultValue={latitude} setValue={setLatitude} />
                        </div>
                        <div>
                            <TextInput title="Longitude" formId="longitude" errorMessage={errors.longitude} inputType="text" defaultValue={longitude} setValue={setLongitude} />
                        </div>
                    </div>
                    <hr />
                </div>
                <div>
                    <h3>Describe your place to guests  </h3>
                    <p>Mention the best features of your space, any special amentities like
                        fast wifi or parking, and what you love about the neighborhood.</p>
                    <TextAreaInput title="Description" formId="description" errorMessage={errors.description} defaultValue={description} setValue={setDescription} />
                    <hr />
                </div>
                <div>
                    <h3>Create a title for your spot</h3>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes
                        your place special.</p>
                    <TextInput title="Title" formId="title" errorMessage={errors.title} inputType="text" defaultValue={title} setValue={setTitle} />
                    <hr />
                </div>
                <div>
                    <h3>Set a base price for your spot
                    </h3>
                    <p>Competitive pricing can help your listing stand out and rank higher
                        in search results.</p>
                    <TextInput title="Price" formId="price" errorMessage={errors.price} inputType="text" defaultValue={price} setValue={setPrice} />
                    <hr />
                </div>
                <div>
                    <h3>Liven up your spot with photos
                    </h3>
                    <p>
                        Submit a link to at least one photo to publish your spot
                    </p>
                    <TextInput title="PreviewImage" formId="previewImage" errorMessage={errors.previewImage} inputType="text" defaultValue={previewImage} setValue={setPreviewImage} />
                    <TextInput title="Image URL" formId="image1" errorMessage={errors.image1} inputType="text" defaultValue={image1} setValue={setImage1} />
                    <TextInput title="Image URL" formId="image2" errorMessage={errors.image2} inputType="text" defaultValue={image2} setValue={setImage2} />
                    <TextInput title="Image URL" formId="image3" errorMessage={errors.image3} inputType="text" defaultValue={image3} setValue={setImage3} />
                    <TextInput title="Image URL" formId="image4" errorMessage={errors.image4} inputType="text" defaultValue={image4} setValue={setImage4} />
                </div>
                <button>Create a Spot</button>
            </form>
        </div>
    )
}
export default CreateSpot
