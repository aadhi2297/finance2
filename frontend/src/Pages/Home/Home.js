import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
import "./home.css";
import { addTransactionAPI, getTransactionsAPI } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";

const Home = () => {
  const navigate = useNavigate();
  const [cUser, setcUser] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

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

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, description, category, date, transactionType } =
      values;

    if (
      !title ||
      (!amount && amount !== 0) ||
      !description ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all fields", toastOptions);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(addTransactionAPI, {
        title,
        amount,
        description,
        category,
        date,
        transactionType,
        userId: cUser._id,
      });

      if (data.success) {
        toast.success(data.message, toastOptions);
        handleClose();
        setRefresh((prev) => !prev);
      } else {
        toast.error(data.message, toastOptions);
      }
    } catch {
      toast.error("Failed to add transaction", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setShow(false);
  };
  const handleShow = () => setShow(true);

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };

  // ✅ check login + avatar before entering
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user.isAvatarImageSet || !user.avatarImage) {
        navigate("/setAvatar");
      }
      setcUser(user);
      setRefresh(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ fetch transactions
  useEffect(() => {
    if (!cUser) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(getTransactionsAPI, {
          userId: cUser._id,
          frequency,
          startDate,
          endDate,
          type,
        });
        setTransactions(data.transactions);
      } catch {
        toast.error("Error fetching transactions", toastOptions);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [refresh, frequency, endDate, type, startDate, cUser]);

  return (
    <>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        <Container className="mt-3">
          {/* Filter Row */}
          <div className="filterRow">
            <div className="text-white">
              <Form.Group>
                <Form.Label>Select Frequency</Form.Label>
                <Form.Select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="7">Last Week</option>
                  <option value="30">Last Month</option>
                  <option value="365">Last Year</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="text-white">
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="expense">Expense</option>
                  <option value="credit">Credit</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="text-white iconBtnBox">
              <FormatListBulletedIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setView("table")}
                className={view === "table" ? "iconActive" : "iconDeactive"}
              />
              <BarChartIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setView("chart")}
                className={view === "chart" ? "iconActive" : "iconDeactive"}
              />
            </div>

            <div>
              <Button onClick={handleShow} className="addNew">
                Add New
              </Button>
              <Button onClick={handleShow} className="mobileBtn">
                +
              </Button>
            </div>
          </div>

          {/* Custom Date Filter */}
          {frequency === "custom" && (
            <div className="date">
              <div>
                <label className="text-white">Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={setStartDate}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
              <div>
                <label className="text-white">End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={setEndDate}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              </div>
            </div>
          )}

          <div className="containerBtn">
            <Button onClick={handleReset}>Reset Filter</Button>
          </div>

          {/* Table or Chart View */}
          {view === "table" ? (
            <TableData data={transactions} user={cUser} />
          ) : (
            <Analytics transactions={transactions} user={cUser} />
          )}

          <ToastContainer />

          {/* Modal Add */}
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add Transaction</Modal.Title>
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
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      )}
    </>
  );
};

export default Home;
