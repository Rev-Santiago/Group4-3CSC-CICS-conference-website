import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from "../../App";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!captchaVerified) {
            setError("Please verify the CAPTCHA");
            setIsLoading(false);
            return;
        }

        try {
            const captchaRes = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/verify-captcha`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: captchaVerified }),
            });

            const captchaData = await captchaRes.json();
            if (!captchaData.success) {
                setError("Captcha verification failed");
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Login failed");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("accountType", data.account_type);
            localStorage.setItem("userEmail", email);

            setAuth({
                token: data.token,
                accountType: data.account_type,
                email: email
            });

            navigate("/admin-dashboard");

        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate("/forgot-password");
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="bg-white p-6 border border-black w-96 mb-5">
                <h2 className="text-xl text-customRed mb-4">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 mb-3">{error}</p>}

                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-black mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium">Password</label>
                    <div className="relative mb-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full p-2 border border-black pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <IconButton
                            onClick={handleTogglePasswordVisibility}
                            className="!absolute top-1/2 right-2 transform -translate-y-1/2"
                            size="small"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </div>

                    <ReCAPTCHA
                        className="flex justify-center"
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={(token) => setCaptchaVerified(token)}
                    />

                    <Typography
                        className="text-blue-700 mt-4 cursor-pointer pt-3 hover:underline"
                        onClick={handleForgotPassword}
                    >
                        Forgot Password?
                    </Typography>

                    <button
                        type="submit"
                        className="w-full bg-customRed text-white p-2 rounded mt-4 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-middle" />
                        ) : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
