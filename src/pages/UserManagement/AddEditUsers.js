import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import LoadingOverlay from 'react-loading-overlay';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { handleGetRequest } from '../../services/GetTemplate';
import { useDispatch } from 'react-redux';
import { handlePostRequest } from '../../services/PostTemplate';
import { Dialog } from 'primereact/dialog';
import { handlePutRequest } from '../../services/PutTemplate';
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';

const AddEditUsers = ({ onHide, getUserList, addEditUser, userdataId }) => {

    const userId = localStorage.getItem("userId")
    const [saveBtnLoading, setSaveBtnLoading] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [userInput, setUserInput] = useState("")
    const [allDepartments, setAllDepartments] = useState([])

    const history = useHistory()
    const dispatch = useDispatch()

    const validationSchema = Yup.object().shape({
        first_name: Yup.mixed().required("This field is required."),
        last_name: Yup.mixed().required("This field is required."),
        email: Yup.mixed().required("This field is required."),
        password: addEditUser ? null : Yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Must be alphanumeric and at least 8 characters").required("This field is required."),
        cnic: Yup.mixed().required("This field is required."),
        gender: Yup.mixed().required("This field is required."),
        contact: Yup.mixed().required("This field is required."),
        designation: Yup.mixed().required("This field is required."),
        department: Yup.mixed().required("This field is required."),
    });

    const formik = useFormik({

        validationSchema: validationSchema,
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            cnic: "",
            password: "",
            gender: "",
            designation: "",
            contact: "",
            department: ""
        },

        onSubmit: async (data) => {

            if (addEditUser === true) {

                let obj = {
                    first_name: formik.values.first_name,
                    last_name: formik.values.last_name,
                    email: formik.values.email,
                    cnic: formik.values.cnic,
                    contact: formik.values.contact,
                    gender: formik.values.gender,
                    designation: formik.values.designation,
                    department: formik.values.department,
                }

                setSaveBtnLoading(true);
                const response = await dispatch(handlePutRequest(obj, `/api/user/update/${userdataId}`, false, true));
                if (response?.status === 200) {
                    getUserList();
                    setSaveBtnLoading(false);
                    onHide();
                }
                else if (response?.status === 403) {
                    window.localStorage.clear();
                    history.push("/")
                    toast.info("Please Login again")
                }
                getUserList();
                setSaveBtnLoading(false);
                onHide();
            }

            else {
                setSaveBtnLoading(true);

                let obj = {
                    first_name: formik.values.first_name,
                    last_name: formik.values.last_name,
                    email: formik.values.email,
                    cnic: formik.values.cnic,
                    contact: formik.values.contact,
                    gender: formik.values.gender,
                    password: formik.values.password,
                    designation: formik.values.designation,
                    department: formik.values.department,
                }

                const response = await dispatch(handlePostRequest(obj, "/api/user/add", false, true));
                if (response?.status === 200) {
                    getUserList();
                    setSaveBtnLoading(false);
                    onHide();
                }
                else if (response?.status === 403) {
                    window.localStorage.clear();
                    history.push("/")
                    toast.info("Please Login again")
                }
                getUserList();
                setSaveBtnLoading(false);
                onHide();
            }
        },
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    //Get User By Id
    const getUserById = async () => {

        setIsActive(true)
        const response = await dispatch(handleGetRequest(`/api/user/getbyid/${userdataId}`, false));

        if (response?.status === 200) {
            const keyData = response?.data;
            formik.setFieldValue("first_name", keyData?.first_name)
            formik.setFieldValue("last_name", keyData?.last_name)
            formik.setFieldValue("email", keyData?.email)
            formik.setFieldValue("gender", keyData?.gender)
            formik.setFieldValue("cnic", keyData?.cnic)
            formik.setFieldValue("designation", keyData?.designation)
            formik.setFieldValue("department", keyData?.department?._id)
            const contact = keyData?.contact;
            const formattedContact = contact ? contact.toString() : "";
            formik.setFieldValue("contact", formattedContact);
            setIsActive(false)
        }
    };

    useEffect(() => {
        if (userdataId !== undefined && userdataId !== null && addEditUser === true) {
            getUserById();
        }
    }, [userdataId]);

     //Get All Dept
     const getDeptList = async () => {

        setIsActive(true);

        const response = await dispatch(handleGetRequest("/api/department/getAll", false));
        if (response) {
            setAllDepartments(response?.Data);
        }

        setIsActive(false);
    };

    useEffect(() => {
         getDeptList()
    }, [])
 
    const genderOptions = [
        { name: 'Male', id: "male" },
        { name: 'Female', id: "female" },
    ];

    useEffect(() => {
        if (formik.values.contact) {
            setUserInput(formik.values.contact.toString().slice(2));
        }
    }, [formik.values.contact]);

    return (
        <>


            <LoadingOverlay
                active={isActive}
                spinner
                text='Loading your content...'
                styles={{
                    overlay: (base) => ({
                        ...base,
                        background: 'rgb(38 41 51 / 78%)',
                        width: '107.9%',
                        height: '125%',
                        top: '-27px',
                        left: '-35px'
                    })
                }}
            >

                <form onSubmit={formik.handleSubmit}>
                    <div className="p-fluid formgrid grid pl-2 pr-2">
                        <div className="field col-12 md:col-4">
                            <label> First Name </label>
                            <span className="Label__Required">*</span>
                            <InputText className="p-inputtext-sm" id="first_name" name="first_name" value={formik.values.first_name} onChange={formik.handleChange} type="text" />
                            {getFormErrorMessage("first_name")}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label> Last Name </label>
                            <span className="Label__Required">*</span>
                            <InputText className="p-inputtext-sm" id="last_name" name="last_name" value={formik.values.last_name} onChange={formik.handleChange} type="text" />
                            {getFormErrorMessage("last_name")}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label>Email</label>
                            <span className="Label__Required">*</span>
                            <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} type="email" className="p-inputtext-sm" autoComplete="off"></InputText>
                            {getFormErrorMessage("email")}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label>CNIC</label>
                            <span className="Label__Required">*</span>
                            <InputText id="cnic" name="cnic" value={formik.values.cnic} placeholder="374xxxxxxxxxx" onChange={(event) => {
                                const inputValue = event.target.value;
                                if (inputValue.length <= 14) {
                                    formik.handleChange(event);
                                }
                            }} type="text" className="p-inputtext-sm" autoComplete="off"></InputText>
                            {getFormErrorMessage("cnic")}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label>Contact No.</label>
                            <span className="Label__Required">*</span>
                            <InputText
                                id="contact"
                                name="contact"
                                placeholder="03xxxxxxxxx"
                                value={`92${userInput}`}
                                onChange={(e) => {
                                    const newValue = e.target.value.substring(2);
                                    if (/^\d*$/.test(newValue)) {
                                        setTimeout(() => {
                                            setUserInput(newValue);
                                            formik.setFieldValue("contact", parseInt(`92${newValue}`, 10));
                                        }, 0);
                                    }
                                }}
                                maxLength={12}
                                type="text"
                                className="p-inputtext-sm"
                                autoComplete="off"
                            >
                            </InputText>
                            {getFormErrorMessage("contact")}
                        </div>

                        {addEditUser === false ?
                            <div className="field col-12 md:col-4">
                                <label> Password </label>
                                <span className="Label__Required">*</span>
                                <Password id='password' name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask className="p-inputtext-sm" autoComplete="off" />
                                {getFormErrorMessage("password")}
                            </div>
                            :
                            null
                        }

                        {/* <div className={addEditUser ? "dNone" : "field col-12 md:col-4"}>
                            <label> Confirm Password </label>
                            <span className="Label__Required">*</span>
                            <Password id='reEnterPassword' name="reEnterPassword" value={formik.values.reEnterPassword} onChange={formik.handleChange} toggleMask className="p-inputtext-sm" autoComplete="off" />
                            {getFormErrorMessage("reEnterPassword")}
                        </div> */}

                        <div className="field col-12 md:col-4">
                            <label>Gender</label>
                            <span className="Label__Required">*</span>
                            <Dropdown id="gender" name="gender" optionLabel='name' optionValue='id' options={genderOptions} value={formik.values.gender} onChange={formik.handleChange} className="p-inputtext-sm" autoComplete="off"></Dropdown>
                            {getFormErrorMessage("gender")}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label>Department</label>
                            <span className="Label__Required">*</span>
                            <Dropdown id="department" name="department" optionLabel='departmentName' optionValue='_id' options={allDepartments} value={formik.values.department} onChange={formik.handleChange} className="p-inputtext-sm" autoComplete="off"></Dropdown>
                            {getFormErrorMessage("department")}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label>Designation</label>
                            <span className="Label__Required">*</span>
                            <InputText id="designation" name="designation" value={formik.values.designation} onChange={formik.handleChange} className="p-inputtext-sm" autoComplete="off"></InputText>
                            {getFormErrorMessage("designation")}
                        </div>
                       
                        <div className='col-12 d-flex flex-row text-center mt-4 pb-2'>
                            <Button className="Cancel-Button" label="Cancel" icon="pi pi-times" type="button" onClick={onHide} />
                            <Button className="Save-Button ml-2" label={addEditUser ? "Update" : "Add"} icon="pi pi-plus" loading={saveBtnLoading} type="submit" />
                        </div>

                    </div>
                </form>

            </LoadingOverlay>
        </>
    )
}

export default AddEditUsers