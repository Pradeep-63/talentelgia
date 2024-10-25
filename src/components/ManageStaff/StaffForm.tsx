// StaffForm.tsx
import React from "react";
import * as Yup from "yup";
import CommonForm from "../Form/CommonForm";
import { useAppDispatch } from "../../redux/hooks";
import { closeModal } from "../../redux/action";
import emailImage from "../../assets/images/email.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faSave } from "@fortawesome/free-solid-svg-icons"; // Import the save icon

interface StaffFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  fields?: any[];
}

const StaffForm: React.FC<StaffFormProps> = ({
  initialValues,
  onSubmit,
  fields,
}) => {
  const dispatch = useAppDispatch();

  const defaultFields = [
    {
      name: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter First Name",
      required: true,
      validations: Yup.string()
        .required("First Name is required.")
        .min(3, "First Name must be at least 3 characters.")
        .max(20, "First Name length must not exceed 20 characters.")
        .matches(
          /^[A-Za-z]+$/,
          "First Name can only contain letters without spaces or special characters."
        ),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const value = input.value;
    
        // Define allowed control keys (Backspace, Delete, arrow keys, Tab)
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    
        // Check if the key is a letter (A-Z or a-z)
        const isLetter = /^[A-Za-z]$/.test(e.key);
    
        // Check if the key is an allowed control key
        const isAllowedKey = allowedKeys.includes(e.key);
    
        // Prevent any key that is not a letter or an allowed control key
        if (!isLetter && !isAllowedKey) {
          e.preventDefault();
        }
    
        // Prevent input if the number of characters is 20 or more
        if (value.length >= 20 && isLetter) {
          e.preventDefault();
        }
      }
    },
    {
      name: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Enter Last Name",
      required: false, // Not required, unlike the first name
      validations: Yup.string()
        .min(3, "Last Name must be at least 3 characters.")
        .max(20, "Last Name length must not exceed 20 characters.")
        .matches(
          /^[A-Za-z]*$/,
          "Last Name can only contain letters without spaces or special characters."
        ),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const value = input.value;
    
        // Define allowed control keys (Backspace, Delete, arrow keys, Tab)
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
    
        // Check if the key is a letter (A-Z or a-z)
        const isLetter = /^[A-Za-z]$/.test(e.key);
    
        // Check if the key is an allowed control key
        const isAllowedKey = allowedKeys.includes(e.key);
    
        // Prevent any key that is not a letter or an allowed control key
        if (!isLetter && !isAllowedKey) {
          e.preventDefault();
        }
    
        // Prevent input if the number of characters is 20 or more
        if (value.length >= 20 && isLetter) {
          e.preventDefault();
        }
      }
    },
    {
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "Enter email address",
      required: true,
      icon: emailImage,
      validations: Yup.string()
        .required("Email is required.")
        .max(100, "Email length must not exceed 100 characters.")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Please enter a valid email address."
        ),
    },
  ];

  const formFields = fields || defaultFields;

  return (
    <CommonForm
      fields={formFields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      buttons={[
        {
          text: "Cancel",
          type: "button",
          className: "btn btn-secondary",
          icon: <FontAwesomeIcon icon={faCancel} />,
          onClick: () => {
            dispatch(closeModal());
          },
        },
        {
          text: Object.keys(initialValues).length > 0 ? "Update" : "Submit", // Conditional text
          type: "submit",
          className: "btn btn-primary",
          icon: <FontAwesomeIcon icon={faSave} />, // Updated icon for submit button
        },
      ]}
    />
  );
};

export default StaffForm;
