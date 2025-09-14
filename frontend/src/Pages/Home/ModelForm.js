import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const ModelForm = ({ transaction, isShow, onClose, onSubmit }) => {
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  useEffect(() => {
    if (transaction) {
      setValues({
        title: transaction.title || "",
        amount: transaction.amount || "",
        description: transaction.description || "",
        category: transaction.category || "",
        date: transaction.date ? transaction.date.split("T")[0] : "",
        transactionType: transaction.transactionType || "",
      });
    }
  }, [transaction]);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <Modal show={isShow} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={values.category}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              <option value="Groceries">Groceries</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Tip">Tip</option>
              <option value="Food">Food</option>
              <option value="Medical">Medical</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={values.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Transaction Type</Form.Label>
            <Form.Select
              name="transactionType"
              value={values.transactionType}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              <option value="credit">Credit</option>
              <option value="expense">Expense</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelForm;
