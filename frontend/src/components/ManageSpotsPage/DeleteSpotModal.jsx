import { deleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './DeleteSpot.css'

function DeleteSpotModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteSpot(id));
        closeModal();
    }

    return (
        <div className="delete-spot-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            {/* <div className="confirm-cancel-button"> */}
            <button className="confirm" onClick={handleDelete}>Yes (Delete Spot)</button>
            <button className="cancel" onClick={closeModal}>No (Keep Spot)</button>
            {/* </div> */}
        </div>
    )
}

export default DeleteSpotModal;
