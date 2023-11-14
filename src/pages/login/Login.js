import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { handlePostRequest } from "../../services/PostTemplate";
import { useDispatch } from "react-redux";
import loginImage from "../../assets/jswall_assets/JS WALL/loginbg1.png"
import logo from "../../assets/jswall_assets/JS WALL/jswalllogo_updated.png"

const Login = () => {

    const [saveBtnLoading, setSaveBtnLoading] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()

    const validationSchema = Yup.object().shape({
        email: Yup.mixed().required("This field is required."),
        password: Yup.mixed().required("This field is required."),
    });

    const formik = useFormik({

        validationSchema: validationSchema,
        initialValues: {
            email: "",
            password: "",
        },

        onSubmit: async (data) => {

            setSaveBtnLoading(true);
            const response = await dispatch(handlePostRequest(data, "/api/Login", false, true));
            console.log("res", response)
            if (response?.statusCode === 200) {
                localStorage.setItem("login", true)
                localStorage.setItem("userId", response?.data?._id)
                localStorage.setItem("firstName", response?.data?.first_name)
                localStorage.setItem("lastName", response?.data?.last_name)
                localStorage.setItem("token", response?.accessToken)
                history.push("/users");
            }
            else {
                setSaveBtnLoading(false)
            }
        },
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const RouteTo = () => {
        history.push("/forgot-password")
    }

    useEffect(() => {
        return () => {
            // Cleanup function
            setSaveBtnLoading(false);
        };
    }, []);

    useEffect(() => {
        if (formik.values.email) {
            localStorage.setItem("EmailForForgotPass", formik.values.email)
        }
    }, [formik.values.email])

    return (

        <>
            <div className="login-page-container">
                <div className="left-section">
                    <img src={loginImage} alt="Image Alt Text" className="imgMainLogo" />
                    {/* <img src={logo} className="imgAppLogo" /> */}
                </div>

                <div className="right-section mb-6">
                    <form onSubmit={formik.handleSubmit} className="login-form">
                        <h2 className="mb-4" style={{ color: "black", letterSpacing: "1px", fontWeight: "700" }}> Welcome to Contact Finder Portal </h2>
                        <div className="login-div mt-6">
                            <label htmlFor="email1" className="block text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText placeholder="Enter your email" id="email" name="email" value={formik.values.email} onChange={formik.handleChange} type="email" autoComplete="off" className="w-full p-inputtext-login mb-3" />
                            {getFormErrorMessage("email")}

                            <label htmlFor="password" className="block font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password
                                placeholder="Enter your password"
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                toggleMask
                                autoComplete="off"
                                feedback={false}
                                className="w-full custom-password-field"
                            />
                            {/* <h6 style={{ color: "gray", cursor: "pointer" }} onClick={RouteTo}> Forgot Password ?</h6> */}
                            {getFormErrorMessage("password")}
                            <div className='col-12 d-flex flex-row text-center mt-5'>
                                <Button className="Login-Button" label="Login" icon="pi pi-check" loading={saveBtnLoading} type="submit" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>

    );
};

export default Login;
