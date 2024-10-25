import { useAppDispatch } from "../../redux/hooks";
import * as Yup from "yup";
import passwordLockImage from "../../assets/images/passwordLock.svg"; // Corrected the variable name

import {
  ResetPasswordApiCall,
  setAuthUser,
  setLoader,
} from "../../redux/action";
import { SuccessMessageInterface } from "../../utils/redux_interfaces";
import { LOGIN_APP_URL } from "../../utils/app_url";
import { useNavigate } from "react-router-dom";
import { deleteAllLocalStorageData } from "../../utils/localStorage";
import CommonForm from "../Form/CommonForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

interface FormValues {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  const fields = [
    {
      name: "old_password",
      label: "Old Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
      icon: passwordLockImage,
      passwordTooltipShow: true,
      maxLength: 20,
      validations: Yup.string()
        .required("Old password is required.")
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
    {
      name: "new_password",
      label: "New Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
      maxLength: 20,
      passwordTooltipShow: true,
      icon: passwordLockImage,
      validations: Yup.string()
        .required("New password is required.")
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
        )
        .notOneOf(
          [Yup.ref("old_password")],
          "New password must be different from old password."
        ),
    },
    {
      name: "confirm_password",
      label: "Confirm Password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
      maxLength: 20,
      passwordTooltipShow: true,
      icon: passwordLockImage,
      validations: Yup.string()
        .required("Confirm password is required.")
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
        )
        .oneOf([Yup.ref("new_password")], "Passwords must match."),
    },
  ];

  const handleSubmit = async (values: FormValues) => {
    try {
      await dispatch(setLoader(true));
      await dispatch(
        ResetPasswordApiCall(
          {
            old_password: values.old_password,
            new_password: values.new_password,
          },
          async (response: SuccessMessageInterface) => {
            await dispatch(setLoader(false));
            if (response.success) {
              await deleteAllLocalStorageData();
              navigate(LOGIN_APP_URL);
              await dispatch(setAuthUser(null));
            }
          }
        )
      );
    } catch (err) {
      console.error("Error reset password:", err);
    } finally {
      await dispatch(setLoader(false));
    }
  };

  const buttons = [
    {
      text: "Reset Password",
      type: "submit" as const,
      className: "btn btn-primary w-100",
      icon: <FontAwesomeIcon icon={faLock} />,
    },
  ];

  return (
    <div
      className="content px-3 py-4 rounded-3"
      style={{ backgroundColor: "var(--bs-body-bg)" }}
    >
      <div className="dash_col dashboard-filter mb-4">
        <h4 className="m-0">Reset Password</h4>
      </div>
      <CommonForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        buttons={buttons}
      />
    </div>
  );
};

export default ResetPassword;
