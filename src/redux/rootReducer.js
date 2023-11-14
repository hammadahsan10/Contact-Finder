import { combineReducers } from "redux";
import authenticationSlice from "./slices/authenticationSlice";
import utilitySlice from "./slices/utilitySlice";
import incidentObjectSlice from "./slices/incidentObjectSlice";

export default combineReducers({
    authenticationSlice,
    utilitySlice,
    incidentObjectSlice,
});
