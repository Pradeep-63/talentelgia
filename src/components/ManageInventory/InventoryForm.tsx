import React from "react";
import * as Yup from "yup";
import CommonForm from "../Form/CommonForm";
import { useAppDispatch } from "../../redux/hooks";
import { closeModal } from "../../redux/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faSave } from "@fortawesome/free-solid-svg-icons"; // Import the save icon

interface InventoryFormProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  fields?: any[];
}

const InventoryForm: React.FC<InventoryFormProps> = ({
  initialValues,
  onSubmit,
  fields,
}) => {
  const dispatch = useAppDispatch();

  // Define form fields
  const defaultFields = [
    {
      name: "type",
      label: "Kit Type",
      type: "select",
      placeholder: "Select Kit Type",
      required: true,
      options: [
        { label: "Blood", value: "blood" },
        { label: "Saliva", value: "saliva" },
      ],
      validations: Yup.string().required("Kit Type is required."),
    },
    {
      name: "quantity",
      label: "Quantity (Number of Kits)",
      type: "text",
      placeholder: "Enter Quantity",
      required: true,
      validations: Yup.string()
        .required("Quantity is required.")
        .matches(/^[0-9]{1,4}$/, "Quantity must be a valid number between 1 and 9999."),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const value = input.value;

        // Define allowed control keys
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

        // Allow only digit keys or allowed control keys
        const isDigit = /^[0-9]$/.test(e.key);
        const isAllowedKey = allowedKeys.includes(e.key);

        // Prevent invalid characters (-, e, E, and any other non-digit character)
        if (!isDigit && !isAllowedKey) {
          e.preventDefault();
        }

        // Prevent input if the number of digits is 4 or more
        if (value.length >= 4 && isDigit) {
          e.preventDefault();
        }
      }
    },

    {
      name: "supplier_name",
      label: "Supplier Name",
      type: "text",
      placeholder: "Enter Supplier Name",
      required: true,
      validations: Yup.string()
        .required("Supplier Name is required.")
        .min(3, "Supplier Name must be at least 3 characters.")
        .max(20, "Supplier Name must not exceed 20 characters.")
        .matches(
          /^[A-Za-z]+(?: [A-Za-z]+)*$/,
          "Supplier Name can only contain letters and a single space between words."
        ),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const value = input.value;
        
        // Define allowed control keys (Backspace, Delete, arrow keys, Tab)
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
        
        // Check if the key is a digit
        const isDigit = /^[0-9]$/.test(e.key);
        
        // Prevent numeric input and ensure allowed control keys work
        if (isDigit || (!allowedKeys.includes(e.key) && value.length >= 20)) {
          e.preventDefault(); // Prevent input if a number is typed or length exceeds 20 characters
        }
      }
    },
    {
      name: "supplier_contact_number",
      label: "Contact Number",
      type: "text",
      placeholder: "Enter Contact Number",
      required: false,
      validations: Yup.string()
        .matches(/^\d{10,15}$/, "Contact Number must be between 10 to 15 digits.")
        .matches(/^\d+$/, "Contact Number must contain only digits."),
      onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const value = input.value;

        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

        // Check if the key is a digit or an allowed control key
        const isDigit = /^[0-9]$/.test(e.key);
        const isAllowedKey = allowedKeys.includes(e.key);

        // Block non-digit characters except allowed control keys
        if (!isDigit && !isAllowedKey) {
          e.preventDefault();
        }

        // Prevent adding more than 15 digits (if it's a digit key)
        if (value.length >= 15 && isDigit) {
          e.preventDefault();
        }
      }
    },
    {
      name: "supplier_address",
      label: "Address",
      type: "textarea",
      placeholder: "Enter Address",
      required: false,
      validations: Yup.string()
        .min(3, "Address must be at least 3 characters.")
        .max(200, "Address must not exceed 200 characters."),
      onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const input = e.currentTarget;
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
        
        // Prevent further input if the length is 200 and it's not an allowed key
        if (input.value.length >= 200 && !allowedKeys.includes(e.key)) {
          e.preventDefault(); // Prevent adding more characters
        }
      },
    }
    
    

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

export default InventoryForm;
