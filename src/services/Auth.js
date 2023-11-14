import { baseURL } from "../Config";
import axios from "axios";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";
import { trimData } from "../utilities/TrimPayloadData";

export const login = async (data) => {
    data = await trimData(data);
    const id = toast.loading("Please wait...");
    // Encrypt
    let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), "my-secret-key@123").toString();
  

    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, "my-secret-key@123");
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
   
    try {
        const response = await axios({
            method: "post",
            url: `${baseURL}/api/login`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU1NDQ3OTgwLCJleHAiOjE2NTU0NTE1ODB9.jrz2EXYWb19fu1hzuBLAokjq6ZZD9uIrA2oVXVMVIDk",
            },
        });
        toast.update(id, { render: response?.data?.message, type: "success", isLoading: false, autoClose: 3000 });

        return response?.data;
    } catch (error) {
        if (error.response.status === 500) toast.update(id, { render: error.response.data.message || "Something went wrong !!", type: "error", isLoading: false, autoClose: 3000 });
        else if (error.response.status === 400) toast.update(id, { render: error?.response?.data?.[0]?.toastError || "Something went wrong !!", type: "error", isLoading: false, autoClose: 3000 });
        else toast.update(id, { render: error.response.data.message || "Something went wrong !!", type: "warn", isLoading: false, autoClose: 3000 });

        return error.response;
    }
};

export const refreshToken = async (data) => {
    let res;
    await axios({
        method: "get",
        url: `${baseURL}refreshToken`,
        data: data,
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            localStorage.setItem("token", response.data.data);
        })
        .catch((err) => {
            res = false;
            console.err(err);
        });
    return res;
};

export const updatePassword = async (password) => {
    let res;
    await axios({
        method: "post",
        url: `${baseURL}userManagement/changePassword`,
        data: { password },
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    })
        .then((response) => {
            toast.success(response.data.data);
            res = response?.data?.data;
        })
        .catch((err) => {
            toast.warn(err?.response?.data?.messages || "Something went wrong");
            res = false;
        });
    return res;
};
