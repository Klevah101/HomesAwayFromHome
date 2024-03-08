import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getSpotDetails } from "../../store/spot-details";
import { useParams } from "react-router";
import Reserve from "../Reserve/Reserve";
import Reviews from "../Reviews/Reviews";

function SpotDetail() {
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
    // let reviews = {};
    if (details.SpotImages) {
        image = details.SpotImages.find(el => el.preview === true)
        ownerName = `${details.Owner.firstName} ${details.Owner.lastName}`
        price = details.price;
        numReviews = details.numReviews;
        rating = details.avgStarRating;
        reserveProps = { price, numReviews, rating }
        // reviews = {...details.}
    }
    useEffect(() => {
        dispatch(getSpotDetails(id))
        // onumount clear details and reviews
    }, [dispatch, id])
    // preview = SpotImages.filter(image => image.preview)


    return (<>
        <h2>Spot Detail</h2>
        <p>{details.city}</p>
        <p>{details.state}</p>
        <p>{details.country}</p>
        {/* <p>{`${image ? image.url : null}`}</p> */}
        <img src={`${image ? image.url : null}`} />
        <p>{`Hosted by ${ownerName}`}</p>
        <Reserve props={reserveProps} />
        <Reviews props={id} />
        {/* <p>{details["SpotImages"]["preview"]}</p> */}
    </>)
}

export default SpotDetail
