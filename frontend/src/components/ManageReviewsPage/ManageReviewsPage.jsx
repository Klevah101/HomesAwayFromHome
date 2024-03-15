import { useEffect } from "react";
import { getUserReviews } from "../../store/reviews";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux/es/hooks/useSelector";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import ReviewUpdateModal from "../Reviews/ReviewUpdateModal";
import './ManageReviews.css'


function ManageReviewsPage() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dispatch = useDispatch();
    const reviewSlice = useSelector(state => state.reviews);
    useEffect(() => {
        dispatch(getUserReviews())
    }, [dispatch])
    const keys = Object.keys(reviewSlice)

    return (
        <div className="manage-reviews-wrapper">

            <h2>Manage Reviews</h2>
            <div className="review-content">
                {keys.map(key => {
                    const date = new Date(reviewSlice[key].createdAt)
                    return (
                        <div className="review" key={reviewSlice[key].id}>
                            <p > {reviewSlice[key].Spot?.name}</p>
                            <p > {months[date.getMonth()]} {date.getFullYear()}</p>
                            <p > {reviewSlice[key].review}</p>
                            <OpenModalButton buttonText="Update" modalComponent={<ReviewUpdateModal id={reviewSlice[key].id} />} />
                            <OpenModalButton buttonText="Delete" modalComponent={<DeleteReviewModal id={reviewSlice[key].id} parent="ManageReviewPage" spotId={reviewSlice[key].Spot?.id} />} />
                        </div>
                    )
                }
                )}
            </div>
        </div>

    )
}

export default ManageReviewsPage;
