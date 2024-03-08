import { useDispatch, useSelector } from "react-redux"
import { getReviews } from "../../store/reviews";
import { useEffect } from "react";

function Reviews({ props }) {
    const dispatch = useDispatch();
    const reviewSlice = useSelector(state => state.reviews)
    useEffect(() => {
        dispatch(getReviews(parseInt(props)))
    }, [dispatch, props])

    const reviewKeys = Object.keys(reviewSlice)
    const reviews = reviewKeys.map(key => {
        return reviewSlice[key]
    })

    // console.log('review ID', props)
    return (<>
        <h2>Reviews</h2>
        <button>Post a review</button>
        {/* <p>{props}</p> */}
        {reviews.map(element => {
            return (
                <div key={element.id}>
                    <p > stars {element.User.firstName}</p>
                    <p > created at {element.createdAt}</p>
                    <p > {element.review}</p>
                </div>
            )
        })}
    </>
    )
}
export default Reviews
