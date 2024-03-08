import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import { useEffect } from "react";
import './LandingPage.css'

function LandingPage() {

    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots);

    console.log(spots);

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])
    return (<>
        <h2>Landing Page</h2>
        {Object.keys(spots).map((id) => {
            // let img;
            // if (spots[id].previewImage) img = <img src={spots[id].previewImage} />
            return <div key={spots[id].id}>
                <p >{spots[id].address}</p>
                <img src={spots[id].previewImage} />
                <p>{spots[id].city}</p>
                <p>{spots[id].state}</p>
                <p>{spots[id].avgRating}</p>
                <p>${spots[id].price} night</p>
            </div>
        })
        }
    </>
    )
}

export default LandingPage;
