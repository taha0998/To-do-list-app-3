import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfrmPassword] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogin & (password !== confirmPassword)) {
      setError("make sure passwords match");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_SERVERURL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await   response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      console.log(data);
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);
      window.location.reload();
    }
  };

  return (
    <>
      <div className="auth-container">
        <h2>Please {isLogin ? "log in" : "sign up"}!</h2>
        <form onSubmit={(e) => handleSubmit(e, isLogin ? "login" : "signup")}>
          <div className="auth-box-container">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              required
            />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfrmPassword(e.target.value)}
                placeholder="confirmPassword"
                required
              />
            )}
            <p onClick={() => setIsLogin((prev) => !prev)}>
              {isLogin ? "sign up" : "log in"}?
            </p>
          </div>
          <input
            className="submit-bouton"
            type="submit"
            value={isLogin ? "Log in" : "Sign Up"}
          />
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
};
export default Auth;
