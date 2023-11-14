import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import AddEditUsers from "./AddEditUsers"
import { FilterMatchMode } from "primereact/api";
import LoadingOverlay from "react-loading-overlay";
import { Triangle } from "react-loader-spinner";
import { InputText } from "primereact/inputtext";
import { handleGetRequest } from "../../services/GetTemplate";
import { useDispatch } from "react-redux";
import { Divider } from "primereact/divider";
import editIcon from "../../assets/jswall_assets/JS WALL/colored/edit.png"
import deleteIcon from "../../assets/jswall_assets/JS WALL/colored/dlet.png"
import { handleDeleteRequest } from "../../services/DeleteTemplate";
import { confirmDialog } from "primereact/confirmdialog";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const ManageUsers = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    const [isActive, setIsActive] = useState(false)
    const [userdataId, setUserDataId] = useState();
    const [addEditUser, setAddEditUser] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const actionTemplate = (rowData) => {

        return (
            <div className="">
                <Button className='edit-btn ml-3' onClick={() => handleEditUsers(rowData)}>
                    <img src={editIcon} alt="Edit" />
                </Button>
                <Button className='edit-btn mr-3' onClick={() => confirm(rowData)}>
                    <img src={deleteIcon} alt="Edit" />
                </Button>
            </div>
        );
    };

    const confirm = (rowData) => {
        confirmDialog({
            message: 'Are you sure you want to Delete this User ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleDeleteUser(rowData),
            reject: null
        });
    }

    const handleDeleteUser = async (rowData) => {

        setIsActive(true);

        const response = await dispatch(handleDeleteRequest(`/api/user/delete/${rowData?._id}`, true, true));
        if (response?.status === 200) {
            await getUserList()
        }

        else if (response?.status === 403) {
            window.localStorage.clear();
            history.push("/")
            toast.info("Please Login again")
        }

        setIsActive(false);
    }

    const nameTemplate = (rowData) => {

        const result = `${rowData.first_name} ${rowData?.last_name}`
        return (
            <>
                {result}
            </>
        )
    }

    const handleEditUsers = (rowData) => {
        setDisplayDialog(true);
        setAddEditUser(true);
        setUserDataId(rowData?._id);
    };

    const onHide = (name) => {
        setDisplayDialog(false);
        setAddEditUser(false);
    };

    const handleDialog = () => {
        setDisplayDialog(true);
    };

    //Get All Users
    const getUserList = async () => {

        setIsActive(true);

        const response = await dispatch(handleGetRequest("/api/user/getAll", false));
        if (response) {
            setAllUsers(response?.Data);
        }
        setIsActive(false);
    };

    useEffect(() => {
        // getUserList()
    }, [])

    const Header = () => {
        return (
            <>
                <h3 className="pr-2 pl-2" style={{ fontWeight: "700" }}>{addEditUser ? "Edit User" : "Add User"}</h3>
                <div className="mt-2">
                    <hr />
                </div>
            </>
        )
    }

    return (
        <>
            <Dialog header={Header} visible={displayDialog} style={{ width: '80vw' }} onHide={onHide}>
                <AddEditUsers
                    onHide={onHide}
                    getUserList={getUserList}
                    addEditUser={addEditUser}
                    userdataId={userdataId}
                />
            </Dialog>

            <Divider align="left">
                <div className="inline-flex align-items-center">
                    <h2 style={{ fontWeight: "700", letterSpacing: "-1px", marginLeft: "-10px" }}>User Management </h2>
                </div>
            </Divider>

            <div className="card dark-bg">

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
                        header={
                            <>
                                <div className='flex justify-content-between custom-alignment' style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                                    <div>
                                        <span className="p-input-icon-left mr-3">
                                            <i className="pi pi-search" />
                                            <InputText
                                                placeholder="Search"
                                                value={globalFilterValue}
                                                onChange={onGlobalFilterChange}
                                                className="search-input"
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'black',
                                                }}
                                            />
                                        </span>
                                    </div>

                                    <div className="">
                                        <Button
                                            label="Add New"
                                            className="Add__New-Button mb-2"
                                            icon="pi pi-plus"
                                            onClick={() => {
                                                handleDialog();
                                            }}
                                        />
                                    </div>
                                </div>

                            </>
                        }

                        responsive={true}
                        filters={filters}
                        globalFilterFields={[
                            "first_name",
                            "last_name",
                            "email",
                            "cnic",
                            "gender",
                            "designation",
                            "contact",
                            "department.departmentName"
                        ]}
                        responsiveLayout="scroll"
                        stripedRows
                        paginator
                        rows={20}
                        value={allUsers}
                        emptyMessage="No records found"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    >
                        <Column body={nameTemplate} header="Name"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="cnic" header="CNIC"></Column>
                        <Column field="contact" header="Contact No."></Column>
                        <Column field="designation" header="Designation"></Column>
                        <Column field="department.departmentName" header="Department"></Column>
                        <Column field="gender" header="Gender"></Column>
                        <Column header="Action" body={actionTemplate} />
                    </DataTable>
                </LoadingOverlay>
            </div>
        </>
    );
};

export default ManageUsers