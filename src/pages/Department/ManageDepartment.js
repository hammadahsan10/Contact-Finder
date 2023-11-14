import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
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
import AddEditDepartment from "./AddEditDepartment";

const ManageDepartment = () => {

    const history = useHistory()
    const dispatch = useDispatch()

    const [isActive, setIsActive] = useState(false)
    const [rowData, setRowData] = useState();
    const [addEditUser, setAddEditUser] = useState(false);
    const [allDept, setAllDept] = useState([]);
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
            <div style={{paddingTop:"0", paddingBottom:"0"}} className="">
              
                    <Button style={{paddingTop:"0", paddingBottom:"0"}} className='edit-btn ml-3' onClick={() => handleEditUsers(rowData)}>
                        <img style={{paddingTop:"0", paddingBottom:"0"}} src={editIcon} alt="Edit" />
                    </Button>
            
                    <Button style={{paddingTop:"0", paddingBottom:"0"}} className='edit-btn mr-3' onClick={() => confirm(rowData)}>
                        <img style={{paddingTop:"0", paddingBottom:"0"}} src={deleteIcon} alt="Edit" />
                    </Button>
                  
            </div>
        );
    };

    const confirm = (rowData) => {
        confirmDialog({
            message: 'Are you sure you want to Delete this Department ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => handleDeleteDept(rowData),
            reject: null
        });
    }

    const handleDeleteDept = async (rowData) => {

        setIsActive(true);

        const response = await dispatch(handleDeleteRequest(`/api/department/delete/${rowData?._id}`, true, true));
        if (response) {
            await getDeptList()
        }

        else if (response?.status === 403) {
            window.localStorage.clear();
            history.push("/")
            toast.info("Please Login again")
        }

        setIsActive(false);
    }

    const handleEditUsers = (rowData) => {
        setDisplayDialog(true);
        setAddEditUser(true);
        setRowData(rowData);
    };

    const onHide = (name) => {
        setDisplayDialog(false);
        setAddEditUser(false);
    };

    const handleDialog = () => {
        setDisplayDialog(true);
    };

    //Get All Dept
    const getDeptList = async () => {

        setIsActive(true);

        const response = await dispatch(handleGetRequest("/api/department/getAll", false));
        if (response) {
            setAllDept(response?.Data);
        }

        setIsActive(false);
    };

    useEffect(() => {
         getDeptList()
    }, [])

    const Header = () => {
        return (
            <>
                <h3 className="pr-2 pl-2" style={{ fontWeight: "700" }}>{addEditUser ? "Edit Department" : "Add Department"}</h3>
                <div className="mt-2">
                    <hr />
                </div>
            </>
        )
    }

    return (
        <>
            <Dialog header={Header} visible={displayDialog} style={{ width: '80vw' }} onHide={onHide}>
                <AddEditDepartment
                    onHide={onHide}
                    getDeptList={getDeptList}
                    addEditUser={addEditUser}
                    rowData={rowData}
                />
            </Dialog>

            <Divider align="left">
                <div className="inline-flex align-items-center">
                    <h2 style={{ fontWeight: "700", letterSpacing: "-1px", marginLeft: "-10px" }}>Manage Departments </h2>
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
                                                className="search-input" // Add your custom class here
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'black',
                                                }}
                                            />
                                        </span>
                                    </div>

                                    <div className="text-right">
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
                            "departmentName",
                            "departmentContact",
                        ]}
                        responsiveLayout="scroll"
                        stripedRows
                        paginator
                        rows={20}
                        value={allDept}
                        emptyMessage="No records found"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    >
                        <Column field="departmentName" header="Department Name"></Column>
                        <Column field="departmentContact" header="Department Contact No."></Column>
                        <Column header="Action" body={actionTemplate} />
                    </DataTable>
                </LoadingOverlay>

            </div>

        </>
    );
};

export default ManageDepartment