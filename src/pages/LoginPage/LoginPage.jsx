import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from "../../App";
import Typography from "@mui/material/Typography";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaVerified) {
            setError("Please verify the CAPTCHA");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }

            localStorage.setItem("authToken", data.token);
            setAuth(data.token);
            navigate("/admin-dashboard"); // ✅ Redirect after successful login
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="bg-white p-6 border border-black w-96 mb-5">
                <h2 className="text-xl text-customRed mb-4">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500">{error}</p>}
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-black mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-black mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <ReCAPTCHA
                        className="flex justify-center"
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={() => setCaptchaVerified(true)}
                    />
                    <Typography
                        className="text-blue-700 mt-4 cursor-pointer pt-3 hover:underline"
                        onClick={() => navigate("/register")}
                    >
                        Register Here
                    </Typography>
                    <button type="submit" className="w-full bg-customRed text-white p-2 rounded mt-4">
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}
