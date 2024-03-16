export const trimTrailZero = (str) => {
    if (str[str.length - 1] === "0") return str.slice(0, str.length - 1)
    return str
}
