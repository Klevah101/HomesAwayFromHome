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
        <div className="spotTile-wrapper clickable">
            <div className='image-wrapper' onClick={() => navigate(`/spots/${spot.id}`)}>

                <p className="tooltips">{spot.name}</p>
                <img className="image" src={spot.previewImage.url ? spot.previewImage.url : spot.previewImage} />

            </div>
            <div onClick={() => navigate(`/spots/${spot.id}`)}>
                <p>{spot.city}</p>
                <p>{spot.state}</p>
            </div>

            {showDetails ? <div>
                <p>{spot.avgRating || "New"}</p>
                <p>${spot.price} night</p>
            </div> : null
            }
            <div>
                {showButtons ?
                    <div className="manage-buttons">
                        <button onClick={handleUpdate}>Update</button>
                        <OpenModalButton buttonText="Delete" modalComponent={<DeleteSpotModal id={spot.id} />} />
                    </div>
                    : null
                }
            </div>
        </div>

    )
}

export default SpotTile;
