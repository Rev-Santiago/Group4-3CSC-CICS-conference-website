import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!captchaVerified) {
      alert("Please verify the CAPTCHA");
      return;
    }
    alert("Login successful (Mock Response)");
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl text-customRed mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <input type="checkbox" id="keepLoggedIn" className="mr-2" />
              <label htmlFor="keepLoggedIn">Keep me logged in</label>
            </div>
            <a href="#" className="text-blue-500 text-sm">Forgot Password?</a>
          </div>
          
          <ReCAPTCHA
            sitekey="your-recaptcha-site-key"
            onChange={() => setCaptchaVerified(true)}
          />
          
          <button
            type="submit"
            className="w-full bg-customRed text-white p-2 rounded mt-4"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
