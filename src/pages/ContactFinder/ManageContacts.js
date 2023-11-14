import React, { useState, useEffect, useContext } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import LoadingOverlay from "react-loading-overlay";
import { Triangle } from "react-loader-spinner";
import { InputText } from "primereact/inputtext";
import { handleGetRequest } from "../../services/GetTemplate";
import { useDispatch } from "react-redux";
import { Divider } from "primereact/divider";
import AddEditContacts from "./AddEditContacts";
import { Dialog } from "primereact/dialog";
import { TabView, TabPanel } from 'primereact/tabview';
import moment from "moment";
import * as XLSX from 'xlsx';

const ManageContacts = () => {

    const dispatch = useDispatch()

    const [isActive, setIsActive] = useState(false)
    const [addEditUser, setAddEditUser] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [duplicateContacts, setDuplicateContacts] = useState([]);
    const [uniqueContacts, setUniqueContacts] = useState([]);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [expandedRows, setExpandedRows] = useState([]);
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


    const onHide = (name) => {
        setDisplayDialog(false);
        setAddEditUser(false);
    };

    const handleDialog = () => {
        setDisplayDialog(true);
    };

    const createdTemplate = (rowData) => {

        return (
            <>
                {moment(rowData?.createdAt).format("DD-MMM-YYYY HH:mm a")}
            </>
        )
    }

    const onRowToggle = (event) => {
        setExpandedRows(event.data);
    };

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

    //Export Excel All
    const exportExcelAll = () => {

        const workbook = XLSX.utils.book_new();
        let contactData = ""

        if (uniqueContacts) {

            contactData = uniqueContacts?.map((item) => [
                item.customerFirstName,
                item.customerLastName,
                item.customerEmail,
                item.customerContact,
                item.customerAlternativeContact,
                item.customerFatherName,
                item.gender,
                item.Dob,
                item.country,
                item.city,
                item.physicalHomeAddress,
                item.alternativeHomeAddress,
                item.SSN,
                item.duplicateCount,
                item.fax,
                item.po_Box,
                item.postalCode,
                item.zipCode,
            ]);


            const contactHeaders = ['Customer First Name', 'Customer Last Name', 'Customer Email', 'Customer Contact No.', 'Customer Alternative Contact No.', 'Customer Father Name', 'Gender', 'DOB', 'Country', 'City', 'Physical Home Address', 'Alternative Home Address', 'SSN', 'Duplicate Count', 'Fax', 'PO Box', 'Postal Code', 'Zip Code'];
            const contactWorksheet = XLSX.utils.aoa_to_sheet([contactHeaders, ...contactData]);
            XLSX.utils.book_append_sheet(workbook, contactWorksheet, 'Unique Records');

        }

        // Create a blob and save the file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, 'uniqueRecords');

    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };


    const getContactsList = async () => {

        setIsActive(true);
        const response = await dispatch(handleGetRequest("/api/contact/All", false));
        if (response) {
            const data = response?.data;
            const duplicates = data?.filter(item => item.duplicateCount > 0)
            const uniques = data?.filter(item => item.duplicateCount === 0)
            setAllContacts(data);
            setDuplicateContacts(duplicates);
            setUniqueContacts(uniques);
        }

        setIsActive(false);
    };

    useEffect(() => {
        getContactsList()
    }, [])

    return (
        <>

            <Dialog header="Add Contacts" visible={displayDialog} style={{ width: '80vw' }} onHide={onHide}>
                <AddEditContacts
                    onHide={onHide}
                    getContactsList={getContactsList}
                />
            </Dialog>

            <div className="col-12 pt-0 pb-0 mt-0" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Divider align="left">
                    <div className="inline-flex align-items-center">
                        <h2 style={{ fontWeight: "700", letterSpacing: "-1px", marginLeft: "-10px" }}>Manage Contacts </h2>
                    </div>
                </Divider>

                <div className="text-right d-flex col-6 mt-4">
                    <Button
                        disabled={allContacts.length === 0}
                        label="Import File"
                        className="Add__New-Button mb-2"
                        icon="pi pi-file-excel"
                        onClick={() => {
                            handleDialog();
                        }}
                    />
                </div>
            </div>

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
                    <TabView>
                        <TabPanel header="All Contacts">
                            <DataTable
                                header={
                                    <>
                                        <div className='flex justify-content-between' style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
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
                                        </div>

                                    </>
                                }
                                responsive={true}
                                filters={filters}
                                globalFilterFields={[
                                    "customerFirstName",
                                    "customerLastName",
                                    "customerEmail",
                                    "customerContact",
                                    "physicalHomeAddress",
                                    "customerFatherName",
                                    "country",
                                    "city",
                                    "postalCode",
                                    "gender",
                                ]}
                                responsiveLayout="scroll"
                                stripedRows
                                paginator
                                rows={20}
                                value={allContacts}
                                emptyMessage="No records found"
                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                            >
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
                        </TabPanel>

                        <TabPanel header="Duplicate Contacts">
                            <DataTable
                                header={
                                    <>
                                        <div className='flex justify-content-between' style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
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
                                        </div>

                                    </>
                                }
                                responsive={true}
                                filters={filters}
                                globalFilterFields={[
                                    "customerFirstName",
                                    "customerLastName",
                                    "customerEmail",
                                    "customerContact",
                                    "physicalHomeAddress",
                                    "customerFatherName",
                                    "country",
                                    "city",
                                    "postalCode",
                                    "gender",
                                ]}
                                responsiveLayout="scroll"
                                stripedRows
                                paginator
                                rows={20}
                                value={duplicateContacts}
                                emptyMessage="No records found"
                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
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
                        </TabPanel>

                        <TabPanel header="Unique Contacts">
                            <DataTable
                                header={
                                    <>
                                        <div className='flex justify-content-between d-column' style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
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
                                            <div>
                                                <Button
                                                    className="Add__New-Button mb-2"
                                                    type="button"
                                                    icon="pi pi-file-excel"
                                                    label="Export as Excel"
                                                    onClick={exportExcelAll}
                                                    data-pr-tooltip="XLS"
                                                />
                                            </div>
                                        </div>
                                    </>
                                }
                                responsive={true}
                                filters={filters}
                                globalFilterFields={[
                                    "customerFirstName",
                                    "customerLastName",
                                    "customerEmail",
                                    "customerContact",
                                    "physicalHomeAddress",
                                    "customerFatherName",
                                    "country",
                                    "city",
                                    "postalCode",
                                    "gender",
                                ]}
                                responsiveLayout="scroll"
                                stripedRows
                                paginator
                                rows={20}
                                value={uniqueContacts}
                                emptyMessage="No records found"
                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                rowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                            >
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
                        </TabPanel>
                    </TabView>
                </LoadingOverlay>

            </div>

        </>

    )
};

export default ManageContacts