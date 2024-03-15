import { useModal } from "../../context/Modal";
import { FaRegStar, FaStar } from "react-icons/fa";
import './ReviewPostModal.css'
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserReviews, updateReview } from "../../store/reviews";
import './ReviewUpdateModal.css'

function ReviewUpdateModal({ id, spotName }) {

    const dispatch = useDispatch();
    const reviewsSlice = useSelector(state => state.reviews);
    const [error, setError] = useState('')
    const [review, setReview] = useState(reviewsSlice[id].review)
    const prevStars = useRef(reviewsSlice[id].stars);
    const [stars, setStars] = useState(reviewsSlice[id].stars)


    const { closeModal } = useModal();
    const handleClick = async (e) => {
        e.preventDefault();
        console.log("clickaroooooo")
        if (error) {
            console.log('There is an error')
        } else {
            console.log(id)
            const info = {
                id,
                stars,
                review
            }
            const response = await dispatch(updateReview(info))
            await dispatch(getUserReviews());
            console.log(response.status)
            console.log('this is the post review response', response)
            // await dispatch(getReviews());
            setError('');
            closeModal();
        }

    }


    // const [starClicked, setStarClicked] = useState(false);

    let starLayout = [];

    for (let i = 1; i <= 5; i++) {
        starLayout.push(
            <p className="clickable" key={i} onMouseEnter={() => {
                setStars(i);
            }}
                onMouseLeave={() => {
                    setStars(prevStars.current);
                }}
                onClick={() => prevStars.current = stars}>
                {stars > i - 1 ? <FaStar /> : <FaRegStar />}
            </p>)
    }

    return (
        <div className="update-review-modal">
            <h2>How was your stay at {reviewsSlice[id].Spot?.name} {spotName ? spotName : null}?</h2>
            <p>{error ? error : null}</p>
            <textarea defaultValue={review} onChange={(e) => setReview(e.target.value)} />
            <div className="review-rate-stars">
                {starLayout} <label>Stars</label>
            </div>
            <button className="review-post-update-button" disabled={review.length < 10 || stars === 0} onClick={handleClick}>Update Your Review</button>
        </div>
    )
}

export default ReviewUpdateModal;
