import { LOADING_SUCCESS } from "../slices/utilitySlice";
export const loadingAction = (isLoading) => async (dispatch) => {
    dispatch(LOADING_SUCCESS(isLoading));
};
