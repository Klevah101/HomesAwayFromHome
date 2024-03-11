import ManageSpotHeader from "./ManageSpotHeader";
import { getUserSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SpotTile from "../SpotTile/SpotTile";
import './ManageSpotsPage.css'

function ManageSpotsPage() {

    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.Spots)

    useEffect(() => {
        dispatch(getUserSpots());
    }, [dispatch])

    return (



        <div className="manage-spot-page-wrapper">
            <ManageSpotHeader />
            <div className="inner-wrapper">
                {spots && spots.map(spot => (<SpotTile key={spot.id} spot={spot} showButtons={true} />))}
            </div>

        </div>
    )
}
export default ManageSpotsPage;
