import React from "react";
import * as Yup from "yup";
import emailImage from "../../assets/images/email.svg";
import { useAppDispatch } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { ForgetPasswordApiCall, setLoader } from "../../redux/action";
import { LOGIN_APP_URL } from "../../utils/app_url";
import { SuccessMessageInterface } from "../../utils/redux_interfaces";
import CommonForm from "../Form/CommonForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";

interface FormValues {
  email: string;
}

const ForgetPasswordComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fields = [
    {
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "Enter email address",
      icon: emailImage,
      required: true,
      maxLength: 100,
      validations: Yup.string()
        .required("Email is required.")
        .max(100, "Email length must not exceed 100 characters.")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Please enter a valid email address."
        ),
    },
  ];

  const initialValues = {
    email: "",
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        ForgetPasswordApiCall(
          {
            email: values.email,
          },
          async (response: SuccessMessageInterface) => {
            await dispatch(setLoader(false));
            if (response.success) {
              navigate(LOGIN_APP_URL);
            }
          }
        )
      );
    } catch (err) {
      console.error("Error fetching website data:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const buttons = [
    {
      text: "Forgot Password",
      type: "submit" as const,
      className: "btn btn-primary w-100",
      icon: <FontAwesomeIcon icon={faKey} />,
    },
  ];

  const auxiliaryContent = (
    <div className="d-flex justify-content-end">
      <Link
        className="form-label"
        style={{ fontWeight: "400" }}
        to={LOGIN_APP_URL}
      >
        Back to login page?
      </Link>
    </div>
  );

  return (
    <div className="right-content">
      <div className="form-outer">
        <h2 className="mb-3">Forgot Password</h2>
        <CommonForm
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          buttons={buttons}
          auxiliaryContent={auxiliaryContent}
        />
      </div>
    </div>
  );
};

export default ForgetPasswordComponent;
