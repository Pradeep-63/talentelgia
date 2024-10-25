import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  CreatedKitInfoSlice,
  DeleteKitInfoSlice,
  UpdatedKitInfoSlice,
  closeModal,
  openModal,
  setLoader
} from "../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faBoxes,
  faEdit,
  faEye,
  faInfoCircle,
  faCancel,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import CommonTable from "../Table/CommonTable";
import { Switch, Tooltip } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import CommonModal from "../Modal/CommonModal";
import InventoryForm from "./InventoryForm";
import * as Yup from "yup";
import ConfirmationModal from "../Modal/ConfirmationModal";
import moment from "moment";
import { Button, Dropdown } from "react-bootstrap";
// Interfaces
interface FetchInventoryDetailsParams {
  currentPage: number;
  sort: string;
  sortColumn: string;
  searchText: string;
  type: string;
  perPage:number;
}

interface InventoryListTableProps {
  fetchAllKitDetails: (params: FetchInventoryDetailsParams) => void;
}

interface FormValues {
  type: string;
  quantity: string;
  supplier_name: string;
  supplier_contact_number: string;
  supplier_address: string;

}

interface Kit {
  id: string;
  quantity: number;
  type: string;
  supplier_name: string;
  supplier_contact_number: string;
  created_at: string;
  created_by: string;
}
interface Column {
  key: string;
  label: string;
  sortable: boolean;
  render?: (value: any, item: Kit) => React.ReactNode;
}

const KitList: React.FC<InventoryListTableProps> = ({ fetchAllKitDetails }) => {
  const dispatch = useAppDispatch();
  const { records, page, totalPages, sort, sortColumn, searchText, type,perPage } =
    useSelector((state: RootState) => state.manageInventory);
  const { isOpen, modalType, selectedUser } = useSelector(
    (state: RootState) => state.modal
  );
  const currentTheme = useSelector((state: RootState) => state.theme.theme);
  const [localSearchText, setLocalSearchText] = useState(searchText);
  const [localType, setLocalType] = useState(type);
  const [localPerPage,setLocalPerPage]=useState(perPage)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const iconColor = currentTheme === "light" ? "#75ac71" : ""; // Change as needed
  const deleteIconColor = currentTheme === "light" ? "red" : ""; // Change as needed
  const columns: Column[] = [
    { key: "type", label: "Type", sortable: true },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "supplier_name", label: "Supplier Name", sortable: true },
    { key: "created_by", label: "Created By", sortable: true },
    { key: "created_at", label: "Created On", sortable: true }
  ];
  const formattedRecords =
    records && records.length > 0
      ? records.map((kit) => ({
        ...kit,
        created_at: moment(kit.created_at).format("YYYY-MM-DD"),
        created_by: `${kit.created_by.first_name} ${kit.created_by.last_name}`,
      }))
      : [];

  const renderActions = (user: Kit) => (
    <div className="actions_wrap">
      <Tooltip title={`View Kits Details`}>

        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "view", user }))}
        >
          <FontAwesomeIcon icon={faEye} color={iconColor} />
        </button>
      </Tooltip>
      <Tooltip title={`Edit Kits Details`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "edit", user }))}
        >
          <FontAwesomeIcon icon={faEdit} color={iconColor} />
        </button>
      </Tooltip>
      <Tooltip title={`Delete Kit`}>
        <button
          className="action_btn"
          onClick={() => dispatch(openModal({ type: "delete", user }))}
        >
          <FontAwesomeIcon icon={faTrash} color={deleteIconColor} />
        </button>
      </Tooltip>
    </div>
  );


  const handleSort = (column: string) => {
    const newDirection = sort === "asc" ? "desc" : "asc";
    fetchAllKitDetails({
      currentPage: page,
      sort: newDirection,
      sortColumn: column,
      searchText,
      type,
      perPage
    });
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    fetchAllKitDetails({
      currentPage: selectedItem.selected + 1,
      sort,
      sortColumn,
      searchText,
      type,
      perPage
    });
  };

  const refreshKItList = () => {
    return fetchAllKitDetails({
      currentPage: page,
      sort,
      sortColumn,
      searchText,
      type,
      perPage
    });
  };
  // works fine
  const handleSubmit = async (values: FormValues) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(CreatedKitInfoSlice(values));
      await refreshKItList();
    } catch (err) {
      console.error("Error while creating kit:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleUpdateSubmit = async (values: FormValues) => {
    try {
      await dispatch(setLoader(true));
      const payload = {
        "type": values.type,
        "supplier_name": values.supplier_name,
        "quantity": values.quantity,
        "supplier_address": values.supplier_address,
        "supplier_contact_number": values.supplier_contact_number
      }
      await dispatch(UpdatedKitInfoSlice(payload, selectedUser.id));
      await refreshKItList();
    } catch (err) {
      console.error("Error while updating kit:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const handleDelete = async (user_id: string) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(closeModal());
      await dispatch(
        DeleteKitInfoSlice({
          user_id,
        })
      );
      await refreshKItList();
    } catch (err) {
      console.error("Error while delete user:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };
  const renderModalContent = () => {
    switch (modalType) {
      case "add":
      case "edit":
        return (
          <InventoryForm
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
                      <b>Kit Type</b>
                    </p>
                    <p className="txt">{selectedUser.type}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Quantity</b>
                    </p>
                    <p className="txt">{selectedUser.quantity}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Supplier Name</b>
                    </p>
                    <p className="txt">{selectedUser.supplier_name}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Supplier Contact Number</b>
                    </p>
                    <p className="txt">{selectedUser.supplier_contact_number}</p>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="report_inn">
                    <p className="mb-1">
                      <b>Supplier Address</b>
                    </p>
                    <p className="txt">{selectedUser.supplier_address}</p>
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
    fetchAllKitDetails({
      currentPage: 1,
      sort,
      sortColumn,
      searchText: value,
      type:localType,
      perPage
    });
  };

  const handleStatusFilter = (value: string) => {
    setLocalType(value);
    fetchAllKitDetails({
      currentPage: 1,
      sort,
      sortColumn,
      searchText: localSearchText,
      type: value,
      perPage
    });
  };
  const handlePerPageFilter=(value:number)=>{  
    setLocalPerPage(Number(value));
    fetchAllKitDetails({
      currentPage: page,
      sort,
      sortColumn,
      searchText: localSearchText,
      type,
      perPage:Number(value)
    });
    setLocalType("all")
    
  }

  const showSelectedType = (type: string) => {
    switch (type) {
      case "blood":
        return "Blood";
      case "saliva":
        return "Saliva";
      default:
        return "All";
    }
  };
  const showSelectedPerPage=(perPage:number)=>{
     switch(perPage){
      case 5:
        return 5;
      case 15:
        return 15;
      default:
        return 10;    
     }
  }

  return (
    <div className="col-lg-12 mb-4">
      <div className="card shadow-sm rounded-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <FontAwesomeIcon icon={faBoxes} className="me-2" />
            Kit Lists
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
              placeholder="Search Kits"
              onChange={(e) => handleSearchInputChange(e.target.value)}
              style={{ width: 300 }}
              value={localSearchText}
            />
            <div className="info-icon">
              <Tooltip
                title={`Search by Quantity, Supplier Name, Created By, Created On`}
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="fa-fw info-icon"
                />
              </Tooltip>
            </div>
          </div>
          <div className="table_filter" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
           <span>Kit Type: </span>
            <Dropdown
              onSelect={(eventKey) => handleStatusFilter(eventKey as any)}
            >
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {showSelectedType(localType)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="">All</Dropdown.Item>
                <Dropdown.Item eventKey="blood">Blood</Dropdown.Item>
                <Dropdown.Item eventKey="saliva">Saliva</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="table_filter" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
           <span>Select Records Per Page: </span>
            <Dropdown
              onSelect={(eventKey) => handlePerPageFilter(eventKey as any)}
            >
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {showSelectedPerPage(localPerPage)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey={10}>10</Dropdown.Item>
                <Dropdown.Item eventKey={5}>5</Dropdown.Item>
                <Dropdown.Item eventKey={15}>15</Dropdown.Item>
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
            ? "Add New Kit"
            : modalType === "edit"
              ? "Edit Kit"
              : modalType === "view"
                ? "View Kit"
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
        message="Are you sure you want to delete this kit?"
      />
    </div>
  );
};

export default KitList;
