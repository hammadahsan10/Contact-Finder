import { login } from "../../services/Auth";
import { LOGIN_SUCCESS, LOGIN_ERROR } from "../slices/authenticationSlice";

export const loginAction = (authData) => async (dispatch) => {
    const res = await login(authData);
    if (res?.login === true || res?.token) {
        localStorage.setItem("token", res?.token);
        localStorage.setItem("role", res?.role);
        localStorage.setItem("user", res?.user?.first_name);
        localStorage.setItem("employee_id", res?.user?.employee_id);
        localStorage.setItem("uuid", res?.user?.uuid);
        localStorage.setItem("userId", res?.user?.userId);
        localStorage.setItem("rolePermissions", JSON.stringify(res?.rolePermissions));
        localStorage.setItem("login", true);
        dispatch(LOGIN_SUCCESS(res));
        return res;
    } else {
        dispatch(LOGIN_ERROR("Error"));
        return res;
    }
};
