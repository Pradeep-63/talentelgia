import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faInfoCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
interface Option {
  label: string;
  value: string;
}

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  icon?: string;
  validations: Yup.AnySchema;
  maxLength?: number;
  minLength?: number;
  options?: Option[];
  required?: boolean; // Make it optional
  passwordTooltipShow?: boolean; // Make it optional
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface ButtonConfig {
  text: string;
  type: "submit" | "button" | "reset";
  className: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface CommonFormProps {
  fields: FieldConfig[];
  initialValues: { [key: string]: string };
  onSubmit: (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  buttons: ButtonConfig[];
  auxiliaryContent?: React.ReactNode;
}

const CommonForm: React.FC<CommonFormProps> = ({
  fields,
  initialValues,
  onSubmit,
  buttons,
  auxiliaryContent,
}) => {
  const [showPassword, setShowPassword] = React.useState<{
    [key: string]: boolean;
  }>({});
  const loading = useSelector((state: RootState) => state.loader.loader);

  const toggleShowPassword = (fieldName: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const validationSchema = Yup.object().shape(
    fields.reduce((schema, field) => {
      return { ...schema, [field.name]: field.validations };
    }, {})
  );

  const renderField = (field: FieldConfig) => {
    const isPasswordField = field.type === "password";
    const isSelectField = field.type === "select";
    const isTextAreaField = field.type === "textarea"; // Check if the field is a textarea

    const required = field.required !== undefined ? field.required : true;
    const passwordTooltipShow = field.passwordTooltipShow !== undefined ? field.passwordTooltipShow : false;

    return (
      <div key={field.name} className="mb-3">
        <label htmlFor={field.name} className="form-label required-field">
          {field.label}
          {required ? <span className="text-danger ms-1">*</span> : ""}
        </label>

        {isSelectField ? (
          <Field as="select" name={field.name} placeholder={field.placeholder} className="form-control">
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Field>
        ) : isTextAreaField ? (
          <Field as="textarea" name={field.name} placeholder={field.placeholder} className="form-control" onKeyDown={field.onKeyDown} />
        ) : (
          <div className={`input-group ${isPasswordField ? "password-box" : ""}`}>
            {field.icon && (
              <span className="input-group-text">
                <img src={field.icon} alt={`${field.name}_icon`} />
              </span>
            )}
            <Field
              type={isPasswordField && showPassword[field.name] ? "text" : field.type}
              name={field.name}
              placeholder={field.placeholder}
              className="form-control"
              maxLength={field.maxLength}
              onKeyDown={field.onKeyDown}
            />
            {isPasswordField && (
              <span className="toggle-password">
                <FontAwesomeIcon
                  icon={showPassword[field.name] ? faEye : faEyeSlash}
                  className="field_icon toggle-password fa-fw"
                  onClick={() => toggleShowPassword(field.name)}
                />
                {passwordTooltipShow && (
                  <Tooltip title={`Password must be 8-20 characters long, contain uppercase and lowercase letters, a number, and a special character.`}>
                    <FontAwesomeIcon icon={faInfoCircle} className="field_icon toggle-password fa-fw" />
                  </Tooltip>
                )}
              </span>
            )}
          </div>
        )}
        <ErrorMessage name={field.name} component="div" className="text-danger" />
      </div>
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form>
          {fields.map(renderField)}

          {auxiliaryContent && <div className="mb-3">{auxiliaryContent}</div>}

          <div className="d-flex justify-content-end">
            {buttons.map((button, index) => (
              <button
                key={index}
                type={button.type}
                className={`${button.className} ${index > 0 ? "ms-2" : ""}`}
                onClick={button.onClick}
                disabled={
                  button.type === "submit"
                    ? loading
                      ? true
                      : !(formik.isValid && formik.dirty)
                    : false
                }
              >
                {loading && button.type === "submit" ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                ) : (
                  <>
                    {button.icon && <span className="me-2">{button.icon}</span>}
                    {button.text}
                  </>
                )}
              </button>
            ))}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CommonForm;
