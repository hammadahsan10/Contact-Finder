// let baseURL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_BASE_URL_DEV : process.env.REACT_APP_BASE_URL_LIVE;
// let baseURL = process.env.REACT_APP_BASE_URL;
let baseURL = "";
if (process.env.REACT_APP_BASE_URL !== undefined && process.env.REACT_APP_BASE_URL !== null)
{
    baseURL = process.env.REACT_APP_BASE_URL;
}
else
{
    baseURL = process.env.REACT_APP_BASE_URL_BACKEND;
}

export { baseURL };