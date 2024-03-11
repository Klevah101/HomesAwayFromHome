import './SpotTile.css'
import { useNavigate } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../ManageSpotsPage/DeleteSpotModal';

function SpotTile({ spot, showButtons, showDetails }) {
    const navigate = useNavigate();
    const handleUpdate = () => {
        navigate(`/spots/${spot.id}/edit`);
    }

    return (
        <div className="spotTile-wrapper">
            <div className='image-wrapper'>
                <p className="tooltips">{spot.name}</p>
                {/* {spot.previewImage.url ? <img className="image" src={spot.previewImage.url} : <img className="image" src={spot.previewImage} />} */}
                <img className="image" src={spot.previewImage.url ? spot.previewImage.url : spot.previewImage} />

            </div>
            <p>{spot.city}</p>
            <p>{spot.state}</p>

            {showDetails ? <div>
                <p>{spot.avgRating || "New"}</p>
                <p>${spot.price} night</p>
            </div> : null
            }

            {showButtons ?
                <div className="manage-buttons">
                    <button onClick={handleUpdate}>Update</button>
                    <OpenModalButton buttonText="Delete" modalComponent={<DeleteSpotModal id={spot.id} />} />
                </div>
                : null
            }
        </div>

    )
}

export default SpotTile;
