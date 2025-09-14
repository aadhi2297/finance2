import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Modal,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import {
  deleteTransactionAPI,
  updateTransactionAPI,
} from "../../utils/ApiRequest";
import axios from "axios";
import { toast } from "react-toastify";

const TableData = ({ data, user }) => {
  const [transactions, setTransactions] = useState([]);
  const [show, setShow] = useState(false);
  const [currId, setCurrId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  useEffect(() => {
    setTransactions(data);
  }, [data]);

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const resetForm = () => {
    setValues({
      title: "",
      amount: "",
      description: "",
      category: "",
      date: "",
      transactionType: "",
    });
  };

  const handleClose = () => {
    resetForm();
    setShow(false);
  };

  const handleEditClick = (id) => {
    const tran = transactions.find((item) => item._id === id);
    if (tran) {
      setValues({
        title: tran.title,
        amount: tran.amount,
        description: tran.description,
        category: tran.category,
        date: moment(tran.date).format("YYYY-MM-DD"),
        transactionType: tran.transactionType,
      });
      setCurrId(id);
      setShow(true);
    }
  };

  // Edit transaction
  const handleEditSubmit = async () => {
    if (
      !values.title ||
      !values.amount ||
      !values.category ||
      !values.transactionType ||
      !values.date
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...values, amount: Number(values.amount) };
      const { data } = await axios.put(
        `${updateTransactionAPI}/${currId}`,
        payload
      );

      if (data.success) {
        toast.success("Transaction updated");
        setTransactions((prev) =>
          prev.map((t) => (t._id === currId ? { ...t, ...payload } : t))
        );
        handleClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    setLoading(true);
    try {
      const { data } = await axios.delete(`${deleteTransactionAPI}/${id}`, {
        data: { userId: user._id },
      });
      if (data.success) {
        toast.success("Transaction deleted");
        setTransactions((prev) => prev.filter((t) => t._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Table responsive="md" className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((item) => (
              <tr key={item._id}>
                <td>{moment(item.date).format("YYYY-MM-DD")}</td>
                <td>{item.title}</td>
                <td>{item.amount}</td>
                <td>{item.transactionType}</td>
                <td>{item.category}</td>
                <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleEditClick(item._id)}
                    />
                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDeleteClick(item._id)}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={show} onHide={handleClose} centered>
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
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEditSubmit}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TableData;
