import { deleteSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function DeleteSpotModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async () => {
        await dispatch(deleteSpot(id));
        closeModal();
    }

    return (
        <div>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot?</p>
            <button onClick={handleDelete}>Yes (Delete Spot)</button>
            <button>No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal;
