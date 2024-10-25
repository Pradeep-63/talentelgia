import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { LoginUser, setLoader } from "../../redux/action";
import {
  DASHBOARD_APP_URL,
  FORGET_PASSWORD_APP_URL,
} from "../../utils/app_url";
import { SuccessMessageInterface } from "../../utils/redux_interfaces";
import * as Yup from "yup";
import emailImage from "../../assets/images/email.svg";
import passwordLockImage from "../../assets/images/passwordLock.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import CommonForm from "../Form/CommonForm";

const LoginComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const fields = [
    {
      name: "email",
      label: "Email address",
      type: "email",
      placeholder: "Enter email address",
      required: true,
      icon: emailImage,
      maxLength: 100,
      validations: Yup.string()
        .required("Email is required.")
        .max(100, "Email length must not exceed 100 characters.")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          "Please enter a valid email address."
        ),
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      placeholder: "Enter your password",
      icon: passwordLockImage,
      maxLength: 20,
      validations: Yup.string()
        .required("Password is required.")
        .min(8, "Password must be at least 8 characters long.")
        .max(20, "Password length must not exceed 20 characters.")
        .matches(
          /[A-Z]/,
          "Password must contain at least one uppercase letter."
        )
        .matches(
          /[a-z]/,
          "Password must contain at least one lowercase letter."
        )
        .matches(/\d/, "Password must contain at least one number.")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character."
        ),
    },
  ];

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        LoginUser(values, async (response: SuccessMessageInterface) => {
          await dispatch(setLoader(false));
          if (response.success) {
            await dispatch(setLoader(true));
            navigate(DASHBOARD_APP_URL);
          }
        })
      );
    } catch (err) {
      console.error("Error fetching website data:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const buttons = [
    {
      text: "Login",
      type: "submit" as const,
      className: "btn btn-primary w-100",
      icon: <FontAwesomeIcon icon={faSignInAlt} />,
    },
  ];

  const auxiliaryContent = (
    <div className="d-flex justify-content-end">
      <Link
        className="form-label"
        style={{ fontWeight: "400" }}
        to={FORGET_PASSWORD_APP_URL}
      >
        Forgot Password?
      </Link>
    </div>
  );

  return (
    <div className="right-content">
      <div className="form-outer">
        <h2 className="mb-3">Login</h2>
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

export default LoginComponent;
