import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "authenticationSlice",
    initialState: {
        loginData: "",
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        user: localStorage.getItem("user"),
        id: localStorage.getItem("id"),
        userId: localStorage.getItem("userId"),
        rolePermissions: localStorage.getItem("rolePermissions"),
        // nav: localStorage.getItem("nav"),
        // loggedIn: localStorage.getItem("loggedIn"),
    },
    reducers: {
        LOGIN_SUCCESS: (state, action) => {
            return {
                ...state,
                loginData: action.payload,
                token: localStorage.getItem("token"),
                role: localStorage.getItem("role"),
                user: localStorage.getItem("user"),
                employee_id: localStorage.getItem("employee_id"),
                uuid: localStorage.getItem("uuid"),
                userId: localStorage.getItem("userId"),
                rolePermissions: localStorage.getItem("rolePermissions"),
                // nav: localStorage.getItem("nav"),
            };
        },
        LOGIN_ERROR: (state) => {
            return {
                ...state,
                loginData: "",
                token: "",
                role: "",
                user: "",
                employee_id: "",
                loggedIn: "",
                uuid: "",
                userId: "",
                rolePermissions: "",
                // nav:"",
            };
        },
    },
});

export const { LOGIN_SUCCESS, LOGIN_ERROR } = slice.actions;
export default slice.reducer;
