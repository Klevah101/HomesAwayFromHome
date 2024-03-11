import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getSpotDetails } from "../../store/spot-details";
// import { getSpotDetails as gsd } from "../../store/spots";
import { useParams } from "react-router";
import Reserve from "../Reserve/Reserve";
import Reviews from "../Reviews/Reviews";
import './SpotDetails.css'

function SpotDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    let details = useSelector(state => state.details);
    // let { SpotImages } = details;
    // let keys = Object.keys(details);
    // let preview = keys.filter(key => {
    //     // if (details["SpotImages"][0].preview == true) return details["SpotImages"][0]
    // })
    // let SpotImages;
    // console.log(SpotImages.length);
    // let preview;
    let image;
    let ownerName;
    let price;
    let numReviews;
    let rating;
    let reserveProps = {};
    let description;
    let spotImages = [];
    // let reviews = {};
    if (details.SpotImages) {
        image = details.SpotImages.find(el => el.preview === true)
        ownerName = `${details.Owner.firstName} ${details.Owner.lastName}`
        price = details.price;
        numReviews = details.numReviews;
        rating = details.avgStarRating;
        reserveProps = { price, numReviews, rating }
        description = details.description;
        spotImages = [...details.SpotImages.filter(el => el.preview !== true)];
        console.log(spotImages)
        // reviews = {...details.}
    }
    useEffect(() => {
        dispatch(getSpotDetails(id))
        // dispatch(gsd(id))
        // onunount clear details and reviews
    }, [dispatch, id])
    // preview = SpotImages.filter(image => image.preview)


    return (<div className="spot-details-wrapper">
        <h2>{details.name}</h2>
        <div className="spot-details-location">
            <p>{details.city}, {details.state}, {details.country}</p>
            <p></p>
            <p></p>
        </div>
        {/* <p>{`${image ? image.url : null}`}</p> */}
        <div className="spot-images">
            <div className="spot-details-preview-wrapper">
                <img className="spot-details-preview" src={`${image ? image.url : null}`} />
            </div>
            <div className="spot-details-images">
                <img className="spot-details-image" src={`${spotImages[0] ? spotImages[0].url : null}`} />
                <img className="spot-details-image" src={`${spotImages[1] ? spotImages[1].url : null}`} />
                <img className="spot-details-image" src={`${spotImages[2] ? spotImages[2].url : null}`} />
                <img className="spot-details-image" src={`${spotImages[3] ? spotImages[3].url : null}`} />
            </div>
        </div>
        <div className="spot-details-about">
            <div>

                <p>{`Hosted by ${ownerName}`}</p>
                <p>{description}</p>
            </div>
            <div>

                <div><Reserve props={reserveProps} />
                </div>
            </div>
        </div>
        <Reviews props={{ id, numReviews, rating }} />


        {/* <p>{details["SpotImages"]["preview"]}</p> */}
    </div>)
}

export default SpotDetails
