import { useEffect, useState } from "react"
import './UpdateSpot.css'
import TextInput from "../CreateSpot/TextInput";
import TextAreaInput from "../CreateSpot/TextAreaInput";
import { checkUpdateErrors } from "../../utils/UpdateSpotError";
import { useDispatch } from "react-redux";
import { getSpotDetails } from "../../store/spot-details";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { updateSpot, getUserSpots } from "../../store/spots";
import { deleteSpot } from "../../store/spots";


function UpdateSpot() {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
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

    const navigate = useNavigate();
    // console.table(inputs) // see all the form data at once in a table format
    const dispatch = useDispatch();
    const { id } = useParams();
    // let details = useSelector(state => state.details);
    useEffect(() => {
        dispatch(getSpotDetails(id)).then((data) => {
            setCountry(data.country)
            setAddress(data.address)
            setCity(data.city)
            setState(data.state)
            setLatitude(data.lat)
            setLongitude(data.lng)
            setTitle(data.name)
            setPrice(data.price)
            setDescription(data.description)
            data.SpotImages.forEach(el => {
                if (el.preview === true) {
                 
                    setPreviewImage(el.url)
                }
                
            })

      
        })

    }, [dispatch, id])
    return (
        <div className="spotFormWrapper">

            <form className="spotForm" onSubmit={async (e) => {
                e.preventDefault();
                setErrors(checkUpdateErrors(inputs));
              
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
                            id,
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

               
                    const response = await dispatch(updateSpot(spotInfo));

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
                    <h2>Update Your Spot</h2>
                    <h3>Where&apos;s your place located?</h3>
                    <p>Guest will only get your exact address once they booked a reservation.</p>
                    <TextInput title="Country" formId="country" errorMessage={errors.country} inputType="text" defaultValue={country} setValue={setCountry} />
                    <TextInput title="Address" formId="address" errorMessage={errors.address} inputType="text" defaultValue={address} setValue={setAddress} />
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
                    <TextAreaInput title="Description" formId="description" errorMessage={errors.description} inputType="textArea" defaultValue={description} setValue={setDescription} />
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
                    <TextInput title="PreviewImage" formId="previewImage" errorMessage={errors.previewImage} inputType="url" defaultValue={previewImage} setValue={setPreviewImage} />
                    <TextInput title="Image URL" formId="image1" errorMessage={errors.image1} inputType="url" defaultValue={image1} setValue={setImage1} />
                    <TextInput title="Image URL" formId="image2" errorMessage={errors.image2} inputType="url" defaultValue={image2} setValue={setImage2} />
                    <TextInput title="Image URL" formId="image3" errorMessage={errors.image3} inputType="url" defaultValue={image3} setValue={setImage3} />
                    <TextInput title="Image URL" formId="image4" errorMessage={errors.image4} inputType="url" defaultValue={image4} setValue={setImage4} />
                </div>
                <button >Update your Spot</button>
            </form>
        </div>
    )
}
export default UpdateSpot
