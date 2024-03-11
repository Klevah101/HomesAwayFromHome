import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function DeleteReviewModal({ id }) {

    const { closeModal } = useModal();

    console.log(id)
    // Function that runs when form is submitted
    // const handleDelete = (e) => {
    //     e.preventDefault();
    //     // Instead of a console log this would most likely be a thunk dispatch
    //     console.log("Submitted!");
    //     // This will cause the modal to close after the console log has occurred
    //     closeModal();
    // }
    const handleNo = (e) => {
        e.preventDefault();
        // Instead of a console log this would most likely be a thunk dispatch
        console.log("No");
        // This will cause the modal to close after the console log has occurred
        closeModal();
    }
    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <OpenModalButton buttonText="Yes (Delete Review)" modalComponent={<ConfirmDeleteModal id={id} />} />
            <button onClick={handleNo}>No (Keep Review)</button>
        </>
    )
}

export default DeleteReviewModal;
