import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReview } from "../../store/reviews";

function ConfirmDeleteModal({ id, spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleSubmit = (e) => async (id, spotId) => {
        e.preventDefault();
        // Instead of a console log this would most likely be a thunk dispatch
    
        await dispatch(deleteReview(id, spotId));
        // This will cause the modal to close after the console log has occurred
        closeModal();
    }
    return (
        <>
            <button onClick={(e) => handleSubmit(e)(id, spotId)}>Yes Delete</button>
        </>
    )
}

export default ConfirmDeleteModal;
