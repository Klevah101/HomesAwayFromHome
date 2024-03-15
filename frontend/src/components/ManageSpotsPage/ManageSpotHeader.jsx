import './ManageHeader.css'
import { useNavigate } from 'react-router-dom';
function ManageSpotHeader() {
    const navigate = useNavigate();
    return (
        <>
            <h2>Manage Spots</h2>
            <button className="create-spot-button" onClick={() => navigate(`/spots/new`)}>Create a New  Spot</button>
        </>
    )
}

export default ManageSpotHeader;
