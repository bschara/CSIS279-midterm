import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import "../style/login.css"

interface LoginResponse {
  token: string;
  wallet_address: string;
  private_key: string;
}

interface ErrorResponse {
  message: string;
}

export async function loginCustomer(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>('http://localhost:3000/customers/login', { email, password });
  return response.data;
}


export async function loginOrganizer(email: string, password: string): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>('http://localhost:3000/organizers/login', { email, password });
  return response.data;
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [email2, setEmail2] = useState('');
  const [password2, setPassword2] = useState('');
  const [error2, setError2] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const {token} = await loginCustomer(email, password);
      console.log(token);
      console.log("success");
      Cookies.set('customerEmail', email);


      const response = await axios.get<{ walletAddress: string, secretKey: string }>(`http://localhost:3000/customers/user-data/${email}`);
      Cookies.set('cust_wallet_address', response.data.walletAddress);
      Cookies.set('cust_secret_key', response.data.secretKey);
      
      navigate("/dashboard");
    } catch (error) {
      const err = error as ErrorResponse;
      setError(err.message);
    }
  };

  const handleLogin2 = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const {token} = await loginOrganizer(email2, password2);
      console.log(token);
      console.log("success");
      Cookies.set('organizerEmail', email2);

      const response = await axios.get<{ walletAddress: string, secretKey: string }>(`http://localhost:3000/organizers/user-data/${email2}`);
      Cookies.set('org_wallet_address', response.data.walletAddress);
      Cookies.set('org_secret_key', response.data.secretKey);

      navigate("/dashboardOrganizer");
    } catch (error) {
      const err = error as ErrorResponse;
      setError2(err.message);
    }
  };

  return (
  <div className="login-container">
  <div className="forms-wrapper">
    <div className="login-form customerLogin">
      <div className="form-box">
        <h1>Login as Customer</h1>
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
    <div className="login-form organizerLogin">
      <div className="form-box">
        <h1>Login as Organizer</h1>
        <form onSubmit={handleLogin2}>
          <label>
            Email:
            <input type="email" value={email2} onChange={(event) => setEmail2(event.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password2} onChange={(event) => setPassword2(event.target.value)} />
          </label>
          <button type="submit">Login</button>
        </form>
        {error2 && <p>{error2}</p>}
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
