import { useModal } from "../../context/Modal";

function ConfirmDeleteModal({ id }) {
    const { closeModal } = useModal();

    const handleSubmit = (e) => (id) => {
        e.preventDefault();
        // Instead of a console log this would most likely be a thunk dispatch
        console.log("Submitted!", id);
        // This will cause the modal to close after the console log has occurred
        closeModal();

    }
    return (
        <>
            <button onClick={(e) => handleSubmit(e)(id)}>Yes Delete</button>
        </>
    )
}

export default ConfirmDeleteModal;
