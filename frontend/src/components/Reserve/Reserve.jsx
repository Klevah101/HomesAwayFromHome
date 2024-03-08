function Reserve({ props }) {
    return (
        <>
            <h2>Reserve Component</h2>
            <p>${props.price} night</p>
            <p>{props.rating} </p>
            <p>{props.numReviews} Reviews</p>
            <button>Reserve</button>
        </>)
}

export default Reserve
