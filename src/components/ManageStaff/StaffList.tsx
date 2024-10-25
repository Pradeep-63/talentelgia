import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  CreatedAdminUserSlice,
  DeleteAdminUserSlice,
  UpdateAdminUserSlice,
  closeModal,
  openModal,
  setLoader,
} from "../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faEye,
  faInfoCircle,
  faCancel,
  faTrash,
  faUsers,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import CommonTable from "../Table/CommonTable";
import { Select, Switch, Tooltip } from "antd";
import editIcon from "../../assets/images/edit.svg";
import viewIcon from "../../assets/images/view.svg";
import deleteIcon from "../../assets/images/delete.svg";
import changePasswordIcon from "../../assets/images/changePassword.svg";
import { useAppDispatch } from "../../redux/hooks";
import CommonModal from "../Modal/CommonModal";
import StaffForm from "./StaffForm";
import * as Yup from "yup";
import ConfirmationModal from "../Modal/ConfirmationModal";
import moment from "moment";
import { Button, Dropdown } from "react-bootstrap";

// Interfaces
interface FetchStaffDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  status: string;
}

interface StaffListTableProps {
  fetchAllStaffDetails: (params: FetchStaffDetailsParams) => void;
}

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  active_status: boolean;
  created_at: string;
}

interface Column {
  key: string;
  label: string;
  sortable: boolean;
  render?: (value: any, item: User) => React.ReactNode;
}

// Constants
const PASSWORD_VALIDATION = Yup.string()
  .required("Password is required.")
  .min(8, "Password must be at least 8 characters long.")
  .max(20, "Password length must not exceed 20 characters.")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
  .matches(/\d/, "Password must contain at least one number.")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character."
  );

const StaffList: React.FC<StaffListTableProps> = ({ fetchAllStaffDetails }) => {
  const dispatch = useAppDispatch();
  const { records, page, totalPages, sort, sortColumn, searchText, status } =
    useSelector((state: RootState) => state.manageStaff);
  const { isOpen, modalType, selectedUser } = useSelector(
    (state: RootState) => state.modal
  );
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localStatus, setLocalStatus] = useState(status);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const iconColor = currentTheme === "light" ? "#75ac71" : ""; // Change as needed
  const deleteIconColor = currentTheme === "light" ? "red" : ""; // Change as needed
  const columns: Column[] = [
    { key: "first_name", label: "First Name", sortable: true },
    { key: "last_name", label: "Last Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "created_at", label: "Created On", sortable: true },
    {
      key: "active_status",
      label: "Status",
      sortable: true,
      render: (value: boolean, item: User) => (
        <Switch
          checked={value}
          onChange={() => handleStatusChange(item.id, !value)}
        />
      ),
    },
  ];

  const formattedRecords =
    records && records.length > 0
      ? records.map((user) => ({
          ...user,
          created_at: moment(user.created_at).format("YYYY-MM-DD"),
        }))
      : [];

  const renderActions = (user: User) => (
    <div className="actions_wrap">
      <Tooltip title={`View Staff Details`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", user }))}
        >
          <FontAwesomeIcon icon={faEye} color={iconColor} />
        </button>
      </Tooltip>
      <Tooltip title={`Edit Staff Details`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "edit", user }))}
        >
          <FontAwesomeIcon icon={faEdit} color={iconColor} />
        </button>
      </Tooltip>
      <Tooltip title={`Change Password`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "changePassword", user }))}
        >
          <FontAwesomeIcon icon={faKey} color={iconColor} />
        </button>
      </Tooltip>
      <Tooltip title={`Delete Staff User`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "delete", user }))}
        >
          <FontAwesomeIcon icon={faTrash} color={deleteIconColor} />
        </button>
      </Tooltip>
    </div>
  );

  const handleStatusChange = async (userId: string, newStatus: boolean) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        UpdateAdminUserSlice({ active_status: newStatus }, userId)
      );
      await refreshStaffList();
    } catch (err) {
      console.error("Error updating user status:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleSort = (column: string) => {
    const newDirection = sort === "asc" ? "desc" : "asc";
    fetchAllStaffDetails({
      currentPage: page,
      sort: newDirection,
      sortColumn: column,
      searchText,
      status,
    });
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    fetchAllStaffDetails({
      currentPage: selectedItem.selected + 1,
      sort,
      sortColumn,
      searchText,
      status,
    });
  };

  const refreshStaffList = () => {
    return fetchAllStaffDetails({
      currentPage: page,
      sort,
      sortColumn,
      searchText,
      status,
    });
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(CreatedAdminUserSlice(values));
      await refreshStaffList();
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleUpdateSubmit = async (values: FormValues) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(UpdateAdminUserSlice(values, selectedUser.id));
      await refreshStaffList();
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleChangePassword = async (
    user_id: string,
    new_password: string
  ) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(closeModal());
      await dispatch(
        UpdateAdminUserSlice(
          {
            password: new_password,
          },
          user_id
        )
      );
      await refreshStaffList();
    } catch (err) {
      console.error("Error changing password:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleDelete = async (user_id: string) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(closeModal());
      await dispatch(
        DeleteAdminUserSlice({
          user_id,
        })
      );
      await refreshStaffList();
    } catch (err) {
      console.error("Error delete user:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };
  const renderModalContent = () => {
    switch (modalType) {
      case "add":
      case "edit":
        return (
          <StaffForm
            initialValues={modalType === "edit" ? selectedUser : {}}
            onSubmit={(values) => {
              modalType === "edit"
                ? handleUpdateSubmit(values)
                : handleSubmit(values);
              dispatch(closeModal());
            }}
          />
        );
      case "view":
        return (
          <div>
            <div className="report_detail">
              <div className="row">
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>First Name</b>
                    </p>
                    <p className="txt">{selectedUser.first_name}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Last Name</b>
                    </p>
                    <p className="txt">{selectedUser.last_name}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Email</b>
                    </p>
                    <p className="txt">{selectedUser.email}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Status</b>
                    </p>
                    <p className="txt">
                      <span
                        className={`status ${
                          selectedUser.active_status ? "complete" : "progress"
                        }`}
                      >
                        {selectedUser.active_status ? "Active" : "Not Active"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Created On</b>
                    </p>
                    <p className="txt">
                      {moment(selectedUser.created_at).format("YYYY-MM-DD")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between w-100 btn_wrap">
              <Button
                variant="outline-danger"
                className="delete-btn"
                onClick={() =>
                  dispatch(openModal({ type: "delete", user: selectedUser }))
                }
              >
                <FontAwesomeIcon icon={faTrash} /> Delete
              </Button>
              <div className="btn_grp">
                <Button
                  variant="primary"
                  onClick={() =>
                    dispatch(openModal({ type: "edit", user: selectedUser }))
                  }
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => dispatch(closeModal())}
                >
                  <FontAwesomeIcon icon={faCancel} /> Cancel
                </Button>
              </div>
            </div>
          </div>
        );
      case "changePassword":
        return (
          <StaffForm
            initialValues={{}}
            onSubmit={(values) =>
              handleChangePassword(selectedUser.id, values.new_password)
            }
            fields={[
              {
                name: "new_password",
                label: "New Password",
                type: "password",
                placeholder: "Enter new password",
                required: true,
                validations: PASSWORD_VALIDATION,
                passwordTooltipShow: true,
              },
              {
                name: "confirm_password",
                label: "Confirm Password",
                type: "password",
                placeholder: "Confirm new password",
                required: true,
                passwordTooltipShow: true,
                validations: PASSWORD_VALIDATION.oneOf(
                  [Yup.ref("new_password")],
                  "Passwords must match."
                ),
              },
            ]}
          />
        );
      default:
        return null;
    }
  };

  const handleSearchInputChange = (value: string) => {
    setLocalSearchText(value);

    // Clear the previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout
    const newTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300); // Adjust the delay as needed (300 ms in this case)

    setSearchTimeout(newTimeout);
  };

  const handleSearch = (value: string) => {
    fetchAllStaffDetails({
      currentPage: 1,
      sort,
      sortColumn,
      searchText: value,
      status,
    });
  };

  const handleStatusFilter = (value: string) => {
    console.log(value, "value");
    setLocalStatus(value);
    fetchAllStaffDetails({
      currentPage: page,
      sort,
      sortColumn,
      searchText: localSearchText,
      status: value,
    });
  };

  const showSelectedStatus = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Not Active";
      default:
        return "All";
    }
  };

  return (
    <div className="col-lg-12 mb-4">
      <div className="card shadow-sm rounded-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Staff Members
          </h4>
          <button
            className="btn btn-primary"
            onClick={() => dispatch(openModal({ type: "add" }))}
          >
            <FontAwesomeIcon icon={faAdd} className="me-2" />
            Add
          </button>
        </div>

        <div className="table_top">
          <div className="search_outer">
            <input
              placeholder="Search staff members"
              onChange={(e) => handleSearchInputChange(e.target.value)}
              style={{ width: 300 }}
              value={localSearchText}
            />
            <div className="info-icon">
              <Tooltip
                title={`Search by first name, last name, email, created on`}
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="fa-fw info-icon"
                />
              </Tooltip>
            </div>
          </div>
          <div className="table_filter">
            <Dropdown
              onSelect={(eventKey) => handleStatusFilter(eventKey as any)}
            >
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {showSelectedStatus(localStatus)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                <Dropdown.Item eventKey="active">Active</Dropdown.Item>
                <Dropdown.Item eventKey="inactive">Not Active</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className="card-body">
          <CommonTable
            columns={columns}
            data={formattedRecords}
            sortColumn={sortColumn}
            sortDirection={sort}
            onSort={handleSort}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            currentPage={page}
            renderActions={renderActions}
          />
        </div>
      </div>
      <CommonModal
        show={isOpen}
        onHide={() => dispatch(closeModal())}
        title={
          modalType === "add"
            ? "Add New Staff Member"
            : modalType === "edit"
            ? "Edit Staff Member"
            : modalType === "view"
            ? "View Staff Member"
            : modalType === "changePassword"
            ? "Change Password"
            : ""
        }
      >
        {renderModalContent()}
      </CommonModal>
      <ConfirmationModal
        show={modalType === "delete"}
        onHide={() => dispatch(closeModal())}
        onConfirm={() => handleDelete(selectedUser.id)}
        title="Confirm Delete"
        message="Are you sure you want to delete this staff member?"
      />
    </div>
  );
};

export default StaffList;
