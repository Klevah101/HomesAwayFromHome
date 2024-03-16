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

        if (!error) {
            const info = {
                id,
                stars,
                review
            }
            await dispatch(createReview(info))
            setError('');
            closeModal();
        }

    }

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
        <div className="post-review-modal">
            <h2>How was your stay?</h2>
            <p>{error ? error : null}</p>
            <textarea placeholder={review} onChange={(e) => setReview(e.target.value)} />
            <div className="review-rate-stars">
                {starLayout} <label>Stars</label>
            </div>
            <button className="review-post-update-button" disabled={review.length < 10 || stars === 0} onClick={handleClick}>Submit Your Review</button>
        </div>
    )
}

export default ReviewPostModal;
