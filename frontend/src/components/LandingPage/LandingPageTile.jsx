import './LandingTile.css'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function LandingPageTile({ spot, showButtons }) {
    const navigate = useNavigate();
    const handleUpdate = () => {
        navigate(`/spots/${spot.id}`);
    }

    return (
        <div className="LandingTile-wrapper" onClick={handleUpdate}>
            <div className='lt-image-wrapper'>
                <p className='lt-tooltips'>{spot.name}</p>
                <img className="lt-image" src={spot.previewImage} />
            </div>

            <div className='lt-loc-rat'>
                <p>{spot.city}, {spot.state}</p>
                <p><FaStar />{spot.avgRating || "New"}</p>
            </div>

            <p>${spot.price} night</p>

            {showButtons ?
                <div className="lt-manage-buttons">
                    <button >Update</button>
                    <button>Delete</button>
                </div>
                : null
            }
        </div>

    )
}

export default LandingPageTile;
