import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../redux/hooks";
import { UpdateUserDetailsApiCall, setLoader } from "../../redux/action";
import CommonForm from "../Form/CommonForm";

interface FormValues {
  first_name: string;
  last_name: string;
}

const PersonalDetails: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const fields = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter First Name",
      required: true,
      maxLength: 20,
      validations: Yup.string()
        .required("First Name is required.")
        .max(20, "First Name length must not exceed 20 characters.")
        .matches(
          /^[A-Za-z]+$/,
          "First Name can only contain letters without spaces or special characters."
        ),
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Enter Last Name",
      maxLength: 20,
      required: false,
      validations: Yup.string()
        .max(20, "Last Name length must not exceed 20 characters.")
        .matches(
          /^[A-Za-z]*$/, // Allow empty string (optional)
          "Last Name can only contain letters without spaces or special characters."
        ),
    },
  ];

  const initialValues = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(UpdateUserDetailsApiCall(values));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating user details:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const buttons = isEditing
    ? [
        {
          text: "Cancel",
          type: "button" as const,
          className: "btn btn-secondary",
          icon: <FontAwesomeIcon icon={faTimes} />,
          onClick: () => setIsEditing(false),
        },
        {
          text: "Update",
          type: "submit" as const,
          className: "btn btn-primary",
          icon: <FontAwesomeIcon icon={faSave} />,
        },
      ]
    : [
        {
          text: "Edit",
          type: "button" as const,
          className: "btn btn-outline-primary",
          icon: <FontAwesomeIcon icon={faEdit} />,
          onClick: () => setIsEditing(true),
        },
      ];

  return (
    <div className="col-lg-12 mb-4">
      <div
        className="card shadow-sm rounded-3"
        style={{ backgroundColor: "var(--bs-body-bg)" }}
      >
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Personal Details</h4>
          {!isEditing && (
            <button
              className="btn btn-outline-primary"
              onClick={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} className="me-2" />
              Edit
            </button>
          )}
        </div>
        <div className="card-body">
          {!isEditing ? (
            <div>
              <p>
                <strong>First Name:</strong> {user?.first_name}
              </p>
              <p>
                <strong>Last Name:</strong> {user?.last_name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Role:</strong> {user?.role?.name}
              </p>
            </div>
          ) : (
            <CommonForm
              fields={fields}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              buttons={buttons}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
