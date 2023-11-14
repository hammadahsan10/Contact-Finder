import { baseURL } from "../Config";
import axios from "axios";
import { toast } from "react-toastify";
import { loadingAction } from "../redux/actions/loadingAction";

export const handleDeleteRequest =
    (url, isShowLoad = false, isShowToast = true) =>
        async (dispatch) => {
            try {
                if (isShowLoad) dispatch(loadingAction(true));
                const response = await axios({
                    method: "delete",
                    url: `${baseURL + url}`,
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (isShowToast && response?.data) toast.success(response?.data?.message);
                if (isShowLoad) dispatch(loadingAction(false));
                return response?.data;
            } catch (error) {
                if (isShowLoad) dispatch(loadingAction(false));
                if (error?.response?.status === 400 || error?.response?.status === 500) {
                    toast.warn(error?.response?.data?.message || "Something went wrong !!");
                } else {
                    toast.warn(error?.response?.data?.message || "Something went wrong !!");
                }
                return error?.response;
            }
        };
