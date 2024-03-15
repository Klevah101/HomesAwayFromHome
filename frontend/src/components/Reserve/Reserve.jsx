import './Reserve.css'
import { FaStar } from 'react-icons/fa'
function Reserve({ props }) {
    return (
        <div className="reserve-wrapper">
            <div className="reserve-info">
                <p>${props.price} night</p>
                <div className="rate-review-info">
                    <p><FaStar /> </p>
                    <p>{(() => {
                        // if (!props.rating) return "New"
                        if (props.rating) return (props.rating - Math.floor(props.rating)) !== 0 ? props.rating.toFixed(2) : props.rating.toFixed(1)
                    })()
                    } </p>
                    {!!props.rating && <p>·</p>}
                    <p> {!!props.numReviews && props.numReviews} {props.numReviews <= 0 ? "New" : props.numReviews == 1 ? "Review" : "Reviews"}</p>
                </div>
            </div>
            <div>
                <button id="reserve-button" className="clickable" onClick={() => window.alert("Feature Coming Soon...")}>Reserve</button>
            </div>
        </div>)
}

export default Reserve
