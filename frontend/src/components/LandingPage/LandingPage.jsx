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
    // const handleImageClick = (e, id) => {
    //     e.stopPropagation();
    //     navigate(`/spots/${id}`);
    // }
    // console.log(spots);

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])


    return (
        <div className="landingpage-wrapper">
            {/* <ManageSpotHeader /> */}
            <div className="landingpage-tiles">
            {spotArray && spotArray.map(spot => (<LandingPageTile key={spot.id} spot={spot} showButtons={false} />))}
            </div>
        </div>
    )




    // return (<>
    //     <h2>Landing Page</h2>
    //     {Object.keys(spots).map((id) => {
    //         // let img;
    //         // if (spots[id].previewImage) img = <img src={spots[id].previewImage} />
    //         return <div key={spots[id].id} className="spot" onClick={(e) => handleImageClick(e, spots[id].id)}>
    //             <p >{spots[id].address}</p>
    //             <img src={spots[id].previewImage} />
    //             <p>{spots[id].city}</p>
    //             <p>{spots[id].state}</p>
    //             <p>{spots[id].avgRating || "New"}</p>
    //             <p>${spots[id].price} night</p>
    //             <p className="tooltip">{spots[id].name}</p>
    //         </div>
    //     })
    //     }
    // </>
    // )
}

export default LandingPage;
