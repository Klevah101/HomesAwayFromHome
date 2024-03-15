import { useModal } from "../../context/Modal";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useDispatch } from "react-redux";
// import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { deleteReview, getReviews, getUserReviews } from "../../store/reviews";
import { getSpotDetails } from "../../store/spot-details";
import './DeleteReview.css'

function DeleteReviewModal({ id, spotId, parent }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

   
    // Function that runs when form is submitted
    const handleDelete = (e) => async (id, spotId) => {
        e.preventDefault();
        // Instead of a console log this would most likely be a thunk dispatch
     
        await dispatch(deleteReview(id, spotId));
        if (parent === "ManageReviewPage") {
        
            await dispatch(getUserReviews());
        }
        if (parent === "DetailsReviews") {
          
            await dispatch(getReviews(spotId));
            await dispatch(getSpotDetails(spotId));
        }
        // This will cause the modal to close after the console log has occurred
        closeModal();
    }
    const handleNo = (e) => {
        e.preventDefault();
        // Instead of a console log this would most likely be a thunk dispatch
     
        // This will cause the modal to close after the console log has occurred
        closeModal();
    }
    return (
        <div className="delete-review-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            {/* <OpenModalButton buttonText="Yes (Delete Review)" modalComponent={<ConfirmDeleteModal id={id} spotId={spotId} />} /> */}
            {/* <div className="confirm-cancel-button"> */}
                <button className="confirm" onClick={(e) => handleDelete(e)(id, spotId)} >Yes (Delete Review) </button>
                <button className="cancel" onClick={handleNo}>No (Keep Review)</button>
            {/* </div> */}
        </div>
    )
}

export default DeleteReviewModal;
