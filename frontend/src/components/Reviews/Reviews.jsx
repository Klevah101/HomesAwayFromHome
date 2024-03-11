import { useDispatch, useSelector } from "react-redux"
import { getReviews } from "../../store/reviews";
import { useEffect } from "react";
import { FaStar } from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ReviewPostModal from './ReviewPostModal'
import './Reviews.css';
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

function Reviews({ props }) {
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
                if (props.rating) return ((props.rating - Math.floor(props.rating)) !== 0 ? props.rating : props.rating.toFixed(1))
            })()
            } </p>
            {/* <p>{props.rating && props.rating - Math.floor(props.rating) === 0 ? props.rating.toFixed(1) || "New" : props.rating} </p> */}

            {!!props.rating && <p>·</p>}
            <p> {!!props.numReviews && props.numReviews} {props.numReviews <= 0 ? "New" : props.numReviews == 1 ? "Review" : props.numReviews > 1 ? "Reviews" : ""}</p>
        </div>
        {!signedIn ? null : leftReview() ? null : isOwner(details.ownerId) ? null : <OpenModalButton buttonText="Post a review" modalComponent={<ReviewPostModal />} />}

        {(() => {
            if (!isOwner(details.ownerId) && signedIn && reviews.length === 0) return <p>Be the first to post a review!</p>
        })()}

        {reviews.map(element => {
            const date = new Date(element.createdAt)

            return (
                <div key={element.id}>
                    {/* <p > stars {element.User.firstName}</p> */}
                    <p> {element.User.firstName}</p>
                    <p > created at {months[date.getMonth()]} {date.getFullYear()}</p>
                    <p > {element.review}</p>
                    {isOwner(element.userId) ? <OpenModalButton buttonText="delete" modalComponent={<DeleteReviewModal id={element.id} />} /> : null}
                </div>
            )
        })}
    </>
    )
}
export default Reviews
