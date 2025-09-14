import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = values;

    if (!email || !password) {
      toast.error("Please enter email and password", toastOptions);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(loginAPI, { email, password });

      if (data.success) {
        // store user in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ safe success message (fallback just in case)
        toast.success(
          data.message || data.msg || "Login successful!",
          toastOptions
        );

        // navigate to home/dashboard
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        // ✅ safe error message
        toast.error(data.message || data.msg || "Login failed!", toastOptions);
      }
    } catch (err) {
      // ✅ safe error message handling
      const message =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Login failed. Please try again.";
      toast.error(message, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // Particles
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            links: { enable: false },
            move: { enable: true, speed: 2 },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Login Form */}
      <Container className="mt-5" style={{ position: "relative", zIndex: 2 }}>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="text-center mt-5">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
            </h1>
            <h2 className="text-white text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mt-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  value={values.email}
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Group>

              <div className="mt-4 d-flex flex-column align-items-center">
                <Button
                  type="submit"
                  className="mt-3 btnStyle"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Login"}
                </Button>

                <p className="mt-3" style={{ color: "#9d9494" }}>
                  Don’t have an account?{" "}
                  <Link to="/register" className="text-white lnk">
                    Register
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Login;
