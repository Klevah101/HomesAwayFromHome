import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import { useEffect } from "react";
// import { useNavigate } from "react-router";
import LandingPageTile from "./LandingPageTile";
import './LandingPage.css'


function LandingPage() {
    // const navigate = useNavigate();
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);
    const getAllNewSpots = (spots) => {
        const array = [];
        const keys = Object.keys(spots)
        keys.forEach(key => array.push(spots[key]))
        return array;
    }
    let spotArray;

    if (spots) spotArray = getAllNewSpots(spots)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])


    return (
        <div className="landingpage-wrapper">
            <div className="landingpage-tiles">
                {spotArray && spotArray.map(spot => (<LandingPageTile key={spot.id} spot={spot} showButtons={false}  />))}
            </div>
        </div>
    )
}

export default LandingPage;
