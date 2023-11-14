import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom'
import * as Yup from "yup";
import LoadingOverlay from 'react-loading-overlay';
import { InputText } from 'primereact/inputtext';
import { handlePostRequest } from '../../services/PostTemplate';
import { handlePutRequest } from '../../services/PutTemplate';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Button } from 'primereact/button';

const AddEditDepartment = ({ onHide, getDeptList, addEditUser, rowData }) => {

    const [saveBtnLoading, setSaveBtnLoading] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const history = useHistory()
    const dispatch = useDispatch()

    const validationSchema = Yup.object().shape({
        departmentName: Yup.mixed().required("This field is required."),
        departmentContact: Yup.mixed().required("This field is required."),

    });

    const formik = useFormik({

        validationSchema: validationSchema,
        initialValues: {
            departmentName: "",
            departmentContact: "",

        },

        onSubmit: async (data) => {

            if (addEditUser === true) {

                setSaveBtnLoading(true);
                const response = await dispatch(handlePutRequest(data, `/api/department/update/${rowData?._id}`, false, true));
                if (response) {
                    getDeptList();
                    setSaveBtnLoading(false);
                    onHide();
                }
                else if (response?.status === 403) {
                    window.localStorage.clear();
                    history.push("/")
                    toast.info("Please Login again")
                }
                getDeptList();
                setSaveBtnLoading(false);
                onHide();
            }

            else {
                setSaveBtnLoading(true);

                const response = await dispatch(handlePostRequest(data, "/api/department/add", false, true));
                if (response) {
                    getDeptList();
                    setSaveBtnLoading(false);
                    onHide();
                }
                else if (response?.status === 403) {
                    window.localStorage.clear();
                    history.push("/")
                    toast.info("Please Login again")
                }
                getDeptList();
                setSaveBtnLoading(false);
                onHide();
            }
        },
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    useEffect(() => {

        if (rowData) {
            formik.setFieldValue("departmentName", rowData?.departmentName)
            formik.setFieldValue("departmentContact", rowData?.departmentContact)
        }
    }, [rowData])

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
                            <label> Name </label>
                            <span className="Label__Required">*</span>
                            <InputText className="p-inputtext-sm" id="departmentName" name="departmentName" value={formik.values.departmentName} onChange={formik.handleChange} type="text" />
                            {getFormErrorMessage("departmentName")}
                        </div>

                        <div className="field col-12 md:col-4">
                            <label> Contact No. </label>
                            <span className="Label__Required">*</span>
                            <InputText className="p-inputtext-sm" id="departmentContact" name="departmentContact" value={formik.values.departmentContact} onChange={formik.handleChange} type="text" />
                            {getFormErrorMessage("departmentContact")}
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

export default AddEditDepartment
