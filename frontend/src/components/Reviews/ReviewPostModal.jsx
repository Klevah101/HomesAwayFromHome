import { useModal } from "../../context/Modal";
import { FaRegStar, FaStar } from "react-icons/fa";
import './ReviewPostModal.css'
import { useRef, useState } from "react";

function ReviewPostModal() {
    const [review, setReview] = useState('Leave your review here...')
    const { closeModal } = useModal();
    const handleClick = (e) => {
        e.preventDefault();
        console.log("clickaroooooo")
        closeModal();
    }

    const prevStars = useRef(0);
    const [stars, setStars] = useState(0)
    // const [starClicked, setStarClicked] = useState(false);

    let starLayout = [];

    for (let i = 1; i <= 5; i++) {
        starLayout.push(
            <p onMouseEnter={() => {
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
            <textarea defaultValue={review} onChange={(e) => setReview(e.target.value)} />
            <div className="review-rate-stars">
                {starLayout} <label>Stars</label>
            </div>
            <button disabled={review.length < 10 || stars === 0} onClick={handleClick}>Submit Your Review</button>
        </div>
    )
}

export default ReviewPostModal;
