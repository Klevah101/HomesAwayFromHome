// import { useState } from 'react';
import './LandingTile.css'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { getSpotDetails } from '../../store/spot-details';
import { useDispatch } from 'react-redux';

function LandingPageTile({ spot, showButtons }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleUpdate = async () => {
        await dispatch(getSpotDetails(spot.id))
        navigate(`/spots/${spot.id}`);
    }
    // const [hover, setHover] = useState(false);

    return (
        <div className="LandingTile-wrapper" onClick={handleUpdate}>
            <div className='lt-image-wrapper'  >
                {<p className={`lt-tooltips`} >{spot.name}</p>}
                <img className="lt-image" src={spot.previewImage} />
            </div>

            <div className='lt-loc-rat'>
                <p>{spot.city}, {spot.state}</p>
                <p><FaStar />{(() => {
                    const rating = spot.avgRating || "New";
                    if (typeof rating == String) return rating;
                    return ((rating - Math.floor(rating)) !== 0 ? rating : rating.toFixed(1))
                })()}</p>
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
