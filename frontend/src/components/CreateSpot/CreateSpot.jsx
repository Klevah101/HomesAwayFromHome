import { useState } from "react"
import './CreateSpot.css'
function CreateSpot() {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lattitude, setLattitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');

    return (
        <>
            <h2>Create Spot</h2>
            <form className="spotForm">
                <label >
                    Country
                    <input type="text" defaultValue={country}
                        onChange={(e) => { setCountry(e.target.value) }} />
                </label>
                <label>
                    Address
                    <input type="text" defaultValue={address}
                        onChange={(e) => { setAddress(e.target.value) }} />
                </label>
                <label >
                    City
                    <input type="text" defaultValue={city}
                        onChange={(e) => { setCity(e.target.value) }} />
                </label>
                <label>
                    State
                    <input type="text" defaultValue={state}
                        onChange={(e) => { setState(e.target.value) }} />
                </label>
                <label >
                    Lattitude
                    <input type="text" defaultValue={lattitude}
                        onChange={(e) => { setLattitude(e.target.value) }} />
                </label>
                <label >
                    Longitude
                    <input type="text" defaultValue={longitude}
                        onChange={(e) => { setLongitude(e.target.value) }} />
                </label>
                <label >
                    Desription
                    <input type="textarea" defaultValue={description}
                        onChange={(e) => { setDescription(e.target.value) }} />
                </label>
                <label >
                    Title
                    <input type="text" defaultValue={title}
                        onChange={(e) => { setTitle(e.target.value) }} />
                </label>
                <label >
                    Price
                    <input type="text" defaultValue={price}
                        onChange={(e) => { setPrice(e.target.value) }} />
                </label>
                <label >
                    Preview Image
                    <input type="url" defaultValue={previewImage}
                        onChange={(e) => { setPreviewImage(e.target.value) }} />
                </label>
                <label >
                    ImageUrl
                    <input type="url" defaultValue={image1}
                        onChange={(e) => { setImage1(e.target.value) }} />
                </label>
                <label >
                    ImageUrl
                    <input type="url" defaultValue={image2}
                        onChange={(e) => { setImage2(e.target.value) }} />
                </label>
                <label >
                    ImageUrl
                    <input type="url" defaultValue={image3}
                        onChange={(e) => { setImage3(e.target.value) }} />
                </label>
                <label >
                    ImageUrl
                    <input type="url" defaultValue={image4}
                        onChange={(e) => { setImage4(e.target.value) }} />
                </label>
            </form>

        </>
    )
}
export default CreateSpot
