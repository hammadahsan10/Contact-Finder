import React from 'react'
import { handlePostRequest } from '../../services/PostTemplate';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from "yup";
import LoadingOverlay from 'react-loading-overlay';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { handleGetRequest } from '../../services/GetTemplate';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { useEffect } from 'react';
import { Column } from 'jspdf-autotable';
import { DataTable } from 'primereact/datatable';
import { Triangle } from 'react-loader-spinner';
import moment from 'moment';

const AddEditContacts = ({ onHide, getContactsList }) => {

    const history = useHistory()
    const dispatch = useDispatch()
    const userId = localStorage.getItem("userId");

    const [saveBtnLoading, setSaveBtnLoading] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [fields, setFields] = useState(false)
    const [selectedFile, setSelectedFile] = useState([])
    const [allDepartments, setAllDepartments] = useState([])
    const [duplicateResponse, setDuplicateResponse] = useState([])
    const [expandedRows, setExpandedRows] = useState([]);

    const validationSchema = Yup.object().shape({
        department: Yup.mixed().required("This field is required."),
    });

    const formik = useFormik({

        validationSchema: validationSchema,
        initialValues: {
            department: "",

        },

        onSubmit: async (data) => {

           
            const formData = new FormData()
            formData.append("file", selectedFile)
            formData.append("department", formik.values.department)
            formData.append("userid", userId)

            setSaveBtnLoading(true);

            const response = await dispatch(handlePostRequest(formData, "/api/contact/upload", false, true));
            if (response) {
                setFields(true)
                if (response?.data) {
                    setDuplicateResponse(response?.data)
                }
                else {
                    setDuplicateResponse([])
                }
            }

            getContactsList()
            setSaveBtnLoading(false);
            // onHide()
        }

    });

    const onHide2 = () => {
        onHide()
        getContactsList()
        setSaveBtnLoading(false);
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const onRowToggle = (event) => {
        setExpandedRows(event.data);
    };

    const createdTemplate = (rowData) => {

        return (
            <>
                {moment(rowData?.createdAt).format("DD-MMM-YYYY HH:mm a")}
            </>
        )
    }


    const expandableRowTemplate = (rowData) => {

        return (
            <div>
                <h5 style={{ display: "flex", justifyContent: "flex-start", fontStyle: "italic" }}>  Duplicate Contact Details </h5>
                <DataTable value={rowData?.duplicateSourceFiles}>
                    <Column field="fileName" header="File Name" />
                    <Column field="department.departmentName" header="Department" />
                    <Column field="createdAt" body={createdTemplate} header="Uploaded At" />
                </DataTable>
            </div>
        );
    };


    const handleFileUpload = (event) => {
        const file = event.files[0];
        const fileName = file.name.toLowerCase();
        if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            setSelectedFile(file);
        } else {
            toast.info("Please select excel file! ")
        }
    };


    const getAllDept = async () => {

        setIsActive(true);
        const response = await dispatch(handleGetRequest("/api/department/getAll", false));
        if (response) {
            setAllDepartments(response?.Data);
        }
        setIsActive(false);
    }

    useEffect(() => {
        getAllDept()
    }, [])

    console.log("duplicateResponse", duplicateResponse)

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
                            <label>Department</label>
                            <span className="Label__Required">*</span>
                            <Dropdown disabled={fields} id="department" name="department" optionLabel='departmentName' optionValue='_id' options={allDepartments} value={formik.values.department} onChange={formik.handleChange} className="p-inputtext-sm" autoComplete="off"></Dropdown>
                            {getFormErrorMessage("department")}
                        </div>

                        <div className="field col-12 md:col-4 ml-4">
                            <label> Select File </label>
                            <span className="Label__Required">*</span>
                            <FileUpload
                                disabled={fields}
                                mode="basic"
                                chooseLabel="Choose File"
                                className="p-mt-2"
                                onSelect={handleFileUpload}
                            />
                        </div>

                        <div className='col-12 d-flex flex-row flexColumn text-center mt-4 pb-2'>
                            {/* <Button className="Cancel-Button abc" label="Cancel" icon="pi pi-times" type="button" onClick={onHide} /> */}
                            <Button disabled={fields} className="Save-Button ml-2" label='Add' icon="pi pi-plus" loading={saveBtnLoading} type="submit" />
                        </div>

                        {fields === true && duplicateResponse.length ?
                            <>
                                <h6 style={{ display: "flex", justifyContent: "flex-start", fontStyle: "italic", color: "gray" }}>  The added record is duplicate </h6>
                                <div className="col-12 card dark-bg mt-4">
                                    <LoadingOverlay
                                        active={isActive}
                                        spinner={<Triangle
                                            height="120"
                                            width="120"
                                            color="#0E828A"
                                            ariaLabel="triangle-loading"
                                            wrapperStyle={{}}
                                            wrapperClassName=""
                                            visible={true}
                                        />}
                                        // text='Loading your content...'
                                        styles={{
                                            overlay: (base) => ({
                                                ...base,
                                                background: 'rgb(38 41 51 / 78%)',
                                            })
                                        }}
                                    >

                                        <DataTable
                                            showGridlines
                                            responsive={true}
                                            responsiveLayout="scroll"
                                            stripedRows
                                            value={duplicateResponse}
                                            expandedRows={expandedRows}
                                            onRowToggle={onRowToggle}
                                            rowExpansionTemplate={expandableRowTemplate}
                                        >
                                            <Column expander style={{ width: '3em' }} header="View Duplicates" />
                                            <Column field="customerFirstName" header="First Name"></Column>
                                            <Column field="customerLastName" header="Last Name"></Column>
                                            <Column field="customerEmail" header="Email"></Column>
                                            <Column field="customerContact" header="Contact No."></Column>
                                            <Column field="physicalHomeAddress" header="Address"></Column>
                                            <Column field="customerFatherName" header="Father Name"></Column>
                                            <Column field="country" header="Country"></Column>
                                            <Column field="city" header="City"></Column>
                                            <Column field="postalCode" header="Postal Code"></Column>
                                            <Column field="gender" header="Gender"></Column>
                                            <Column field="duplicateCount" header="Duplicate Count"></Column>
                                        </DataTable>
                                    </LoadingOverlay>
                                </div>
                            </>
                            : fields && !duplicateResponse.length ?
                                <h6 style={{ display: "flex", justifyContent: "flex-start", fontStyle: "italic", color: "gray" }}>  The added record is unique </h6>
                                :
                                null
                        }

                        {fields === false ?
                            <>
                                <div className='col-12'>
                                    <div className="dark-bg col-6">
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <i className="ml-2 mr-2 custom-target-icon pi pi-info-circle p-text-secondary p-overlay-badge"
                                                style={{ fontSize: '1.2rem', cursor: 'pointer' }}>
                                            </i>
                                            <h6 style={{ textAlign: "center", fontStyle: "italic", color: "gray", display: "", verticalAlign: "" }}>
                                                Please submit the file to check for duplicate contacts !
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className='col-12 text-center mt-2 pb-2 mb-2'>
                                    <Button className="Save-Button" label="Finish" icon="pi pi-check" onClick={onHide2} type="button" />
                                </div>
                            </>
                        }

                    </div>
                </form>

            </LoadingOverlay>
        </>
    )
}

export default AddEditContacts
