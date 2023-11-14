import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { SplitButton } from "primereact/splitbutton";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import "./AppTopbar.scss";
import { Badge } from "primereact/badge";

export const AppTopbar = (props) => {

    const op = useRef(null);
    const history = useHistory();
    const firstName = localStorage.getItem("firstName")
    const lastName = localStorage.getItem("lastName")


    const userName = localStorage.getItem("user");
    const items = [

        // {
        //     label: "Reset Password",
        //     command: () => {
        //         history.push("/resetpassword");
        //     },
        // },

        {
            label: "Logout",
            command: () => {
                window.localStorage.clear();
                history.push("/");
            },
        },
    ];

    const handleLogOut = () =>
    {
        window.localStorage.clear();
        history.push("/");
    }

    return (
        <>
            <div className="layout-topbar">
                <Link to="/dashboard" className="layout-topbar-logo">
                    {/* <img src="assets/layout/images/menulogo_c@2x.png" alt="logo" /> */}
                    <div className="flex flex-column ml-3 text-center topbar-heading">
                        <span style={{ fontWeight: "bold", fontSize: "22px" }}>Contact Finder</span>
                    </div>
                </Link>

                <button type="button" className="p-link  layout-menu-button layout-topbar-button ml-1" onClick={props.onToggleMenuClick}>
                    <i className="pi pi-bars" />
                </button>
                <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                    <i className="pi pi-ellipsis-v" />
                </button>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", { "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive })}>
                    <li>
                        <button className="p-link layout-topbar-button mx-4" onClick={props.onMobileSubTopbarMenuClick}>
                            <label htmlFor="" className="font-semibold">
                                {userName}
                            </label>
                        </button>
                    </li>

                    <li className="flex">

                        {firstName
                            ?
                            <div className="">
                                <h2 className="">
                                    <Badge value={`${firstName} ${lastName}`} severity="warning" style={{ fontSize: '0.89rem' }} />
                                </h2>
                            </div>
                            :
                        null}

                        {/* <SplitButton model={items} className="p-button-text custom-button-css ml-4"></SplitButton> */}
                        <button className="p-link layout-topbar-button user-image" type="button" onClick={() => {
                            handleLogOut();
                        }}>
                            <i className="pi pi-power-off" title="Logout"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </>
    );
};
