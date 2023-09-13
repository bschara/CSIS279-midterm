import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/login.css";

interface LoginResponse {
  token: string;
  wallet_address: string;
  private_key: string;
}

interface ErrorResponse {
  message: string;
}

export async function loginCustomer(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    "http://localhost:3000/customers/login",
    { email, password }
  );
  return response.data;
}

export async function loginOrganizer(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    "http://localhost:3000/organizers/login",
    { email, password }
  );
  return response.data;
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("customer");

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userType === "customer") {
      try {
        const { token } = await loginCustomer(email, password);
        console.log(token);
        console.log("success");
        sessionStorage.setItem("customerEmail", email);

        const response = await axios.get<{
          walletAddress: string;
          secretKey: string;
        }>(`http://localhost:3000/customers/user-data/${email}`);
        sessionStorage.setItem(
          "cust_wallet_address",
          response.data.walletAddress
        );
        sessionStorage.setItem("cust_secret_key", response.data.secretKey);

        navigate("/dashboard");
      } catch (error) {
        const err = error as ErrorResponse;
        setError(err.message);
      }
    } else if (userType === "organizer") {
      try {
        const { token } = await loginOrganizer(email, password);
        console.log(token);
        console.log("success");
        sessionStorage.setItem("organizerEmail", email);

        const response = await axios.get<{
          walletAddress: string;
          secretKey: string;
        }>(`http://localhost:3000/organizers/user-data/${email}`);
        sessionStorage.setItem(
          "org_wallet_address",
          response.data.walletAddress
        );
        sessionStorage.setItem("org_secret_key", response.data.secretKey);

        navigate("/dashboardOrganizer");
      } catch (error) {
        const err = error as ErrorResponse;
        setError(err.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="forms-wrapper">
        <div className="login-form">
          <div className="form-box">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  title="please enter your email address"
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  title="please enter your password"
                />
              </label>
              <div className="radio-input">
                <label>
                  <input
                    type="radio"
                    value="customer"
                    checked={userType === "customer"}
                    onChange={() => setUserType("customer")}
                  />
                  Customer
                </label>
                <label>
                  <input
                    type="radio"
                    value="organizer"
                    checked={userType === "organizer"}
                    onChange={() => setUserType("organizer")}
                  />
                  Organizer
                </label>
              </div>
              <button type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
          </div>
        </div>
      </div>
      <div className="hyperlink">
        <a href="/orgSignUp">Don't have an account?</a>
      </div>
    </div>
  );
}

export default LoginPage;
