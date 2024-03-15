import { useDispatch, useSelector } from "react-redux"
import { getReviews } from "../../store/reviews";
import { useEffect } from "react";
import { FaStar } from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ReviewPostModal from './ReviewPostModal'
import './Reviews.css';
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import ReviewUpdateModal from "./ReviewUpdateModal";

function Reviews({ props }) {
    console.log("nnnnnnnnnnnaaaaaaaaaaaaaaaaame", props.spotName)

    const dispatch = useDispatch();
    const signedIn = useSelector(state => state.session.user)
    const reviewSlice = useSelector(state => state.reviews)
    const details = useSelector(state => state.details)
    useEffect(() => {
        dispatch(getReviews(parseInt(props.id)))
    }, [dispatch, props])

    const reviewKeys = Object.keys(reviewSlice)
    const reviews = reviewKeys.map(key => {
        return reviewSlice[key]
    })

    const leftReview = () => {
        if (!signedIn) return false
        let isFound = false;
        reviewKeys.forEach(key => {
            if (reviewSlice[key].userId === signedIn.id) isFound = true;
        })
        return isFound
    }

    const isOwner = (idToCheck) => {
        if (!signedIn) return false // 
        if (idToCheck === signedIn.id) return true;
        return false
    }

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    // const handlePostReview = () => {
    //     console.log("click")
    // }

    // console.log('review ID', props)
    return (<>
        <h2>Reviews</h2>
        {/* {signedIn && <button onClick={handlePostReview}>Post a review</button>} */}
        {/* <p>{props}</p> */}
        <div className="review-summary">
            <p><FaStar /></p>
            <p>{(() => {
                if (!props.rating) return ""
                if (props.rating) return ((props.rating - Math.floor(props.rating)) !== 0 ? props.rating.toFixed(2) : props.rating.toFixed(1))
            })()
            } </p>
            {/* <p>{props.rating && props.rating - Math.floor(props.rating) === 0 ? props.rating.toFixed(1) || "New" : props.rating} </p> */}

            {!!props.rating && <p>·</p>}
            <p> {!!props.numReviews && props.numReviews} {props.numReviews <= 0 ? "New" : props.numReviews == 1 ? "Review" : props.numReviews > 1 ? "Reviews" : ""}</p>
        </div>
        {!signedIn ? null : leftReview() ? null : isOwner(details.ownerId) ? null : <OpenModalButton buttonText="Post a review" modalComponent={<ReviewPostModal id={props.id} />} />}

        {(() => {
            if (!isOwner(details.ownerId) && signedIn && reviews.length === 0) return <p>Be the first to post a review!</p>
        })()}

        {reviews.reverse().map(element => {
            const date = new Date(element.createdAt)
            if (parseInt(props.id) === parseInt(element.spotId)) {
                return (
                    <div key={element.id} className="review-section">
                        {/* <p > stars {element.User.firstName}</p> */}
                        <p className="user-name"> {element.User.firstName}</p>
                        <p className="date"> {months[date.getMonth()]} {date.getFullYear()}</p>
                        <p className="review-body"> {element.review}</p>
                        {isOwner(element.userId) ?
                            <>
                                <OpenModalButton buttonText="Update" modalComponent={<ReviewUpdateModal id={reviewSlice[element.id].id} spotName={props.spotName} />} />
                                <OpenModalButton buttonText="Delete" modalComponent={<DeleteReviewModal id={element.id} parent="DetailsReviews" spotId={element.spotId} />} />
                            </>
                            : null}
                    </div>
                )
            }
        })}
    </>
    )
}
export default Reviews
