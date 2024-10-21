import { useDispatch } from "react-redux";
import { deleteSpotById, getCurrentUserSpots } from "../../store/spot";
import { useModal } from "../../context/Modal";

function DeleteSpotModal ({spotId}) {
    const dispatch = useDispatch();
    const {closeModal} = useModal();

    const confirmedDelete = () => {
        dispatch(deleteSpotById(spotId)).then(dispatch(getCurrentUserSpots()))
        .then(closeModal)
    }
    return (

        <div className="delete-spot-prompt">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={confirmedDelete}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </div>

    )
}

export default DeleteSpotModal;
