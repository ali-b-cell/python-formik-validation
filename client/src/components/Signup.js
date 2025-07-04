
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

export const SignupForm = () => {
  const [customers, setCustomers] = useState([]);
  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    console.log("FETCH!");
    fetch("/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        console.log(data);
      });
  }, [refreshPage]);

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Must enter email"),
    name: yup.string().required("Must enter a name").max(15),
    age: yup
      .number()
      .positive()
      .integer()
      .required("Must enter age")
      .typeError("Please enter an Integer")
      .max(125),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      age: "",
    },
    validationSchema: formSchema,
    onSubmit: (values, { resetForm }) => {
      fetch("/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      }).then((res) => {
        if (res.status === 200) {
          setRefreshPage(!refreshPage);
          resetForm();
          alert(" Customer added successfully!");
        }
      });
    },
  });

  return (
    <div>
      <h1>Customer sign up form</h1>
      <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
        <label htmlFor="email">Email Address</label>
        <br />
        <input
          id="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <p style={{ color: "red" }}>{formik.errors.email}</p>

        <label htmlFor="name">Name</label>
        <br />
        <input
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <p style={{ color: "red" }}>{formik.errors.name}</p>

        <label htmlFor="age">Age</label>
        <br />
        <input
          id="age"
          name="age"
          onChange={formik.handleChange}
          value={formik.values.age}
        />
        <p style={{ color: "red" }}>{formik.errors.age}</p>

        <button type="submit">Submit</button>
      </form>

      <table style={{ padding: "15px" }}>
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>age</th>
          </tr>
        </thead>
        <tbody>
          {customers?.length === 0 ? (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          ) : (
            customers.map((customer, i) => (
              <tr key={i}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.age}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
