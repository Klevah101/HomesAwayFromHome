import './Reserve.css'

function Reserve({ props }) {
    return (
        <div className="reserve-wrapper">
            {/* <h2>Reserve Component</h2> */}
            <div className="reserve-info">
                <p>${props.price} night</p>
                <p>{props.rating} </p>
                <p>{props.numReviews} Reviews</p>
            </div>
            <div>
                <button id="reserve-button" onClick={() => window.alert("Feature Coming Soon...")}>Reserve</button>
            </div>
        </div>)
}

export default Reserve
