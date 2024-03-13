import { useModal } from "../../context/Modal";
import { FaRegStar, FaStar } from "react-icons/fa";
import './ReviewPostModal.css'
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";

function ReviewPostModal({ id }) {
    const dispatch = useDispatch();
    const [error, setError] = useState('')
    const [review, setReview] = useState('Leave your review here...')
    const prevStars = useRef(0);
    const [stars, setStars] = useState(0)

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
            const response = await dispatch(createReview(info))
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
            <p key={i} onMouseEnter={() => {
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
        <div>
            <h2>How was your stay?</h2>
            <p>{error ? error : null}</p>
            <textarea defaultValue={review} onChange={(e) => setReview(e.target.value)} />
            <div className="review-rate-stars">
                {starLayout} <label>Stars</label>
            </div>
            <button disabled={review.length < 10 || stars === 0} onClick={handleClick}>Submit Your Review</button>
        </div>
    )
}

export default ReviewPostModal;
