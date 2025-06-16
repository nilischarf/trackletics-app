import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

const validate = (values) => {
  const errors = {};
  if (!values.calories_burned) {
    errors.calories_burned = "Required";
  } else if (isNaN(values.calories_burned) || values.calories_burned < 0) {
    errors.calories_burned = "Must be a positive number";
  }

  if (!values.hydration) {
    errors.hydration = "Required";
  } else if (values.hydration < 1 || values.hydration > 5) {
    errors.hydration = "Must be between 1 and 5";
  }

  if (!values.soreness) {
    errors.soreness = "Required";
  } else if (values.soreness < 1 || values.soreness > 5) {
    errors.soreness = "Must be between 1 and 5";
  }

  return errors;
};

function EditHealthStatForm({ healthStat, onSubmit, onCancel }) {
  return (
    <Formik
      initialValues={{
        calories_burned: healthStat.calories_burned || "",
        hydration: healthStat.hydration || "",
        soreness: healthStat.soreness || "",
      }}
      validate={validate}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="edit-health-stat-form">
          <div>
            <label htmlFor="calories_burned">Calories Burned</label>
            <Field
              type="number"
              name="calories_burned"
              id="calories_burned"
              min="0"
            />
            <ErrorMessage
              name="calories_burned"
              component="div"
              className="error"
            />
          </div>

          <div>
            <label htmlFor="hydration">Hydration (1-5)</label>
            <Field
              as="select"
              name="hydration"
              id="hydration"
            >
              <option value="">Select hydration</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </Field>
            <ErrorMessage name="hydration" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="soreness">Soreness (1-5)</label>
            <Field
              as="select"
              name="soreness"
              id="soreness"
            >
              <option value="">Select soreness</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </Field>
            <ErrorMessage name="soreness" component="div" className="error" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Save
          </button>
          <button type="button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default EditHealthStatForm;