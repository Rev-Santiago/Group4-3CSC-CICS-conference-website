import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Typography from "@mui/material/Typography";
import { Alert, Snackbar } from "@mui/material";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!captchaVerified) {
            setError("Please verify the CAPTCHA");
            setIsLoading(false);
            return;
        }

        try {
            // Verify captcha token
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

            // Send password reset request
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/request-password-reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                setError(data.error || "Failed to send reset email");
                setIsLoading(false);
                return;
            }

            // Show success message
            setSuccess(true);
            setNotification({
                open: true,
                message: "Password reset email sent! Please check your inbox.",
                severity: "success"
            });
            
            // Clear form
            setEmail("");
            setCaptchaVerified(false);
            
        } catch (err) {
            console.error("Password reset error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="bg-white p-6 border border-black w-96 mb-5">
                <h2 className="text-xl text-customRed mb-4">Reset Password</h2>
                {success ? (
                    <div className="text-center">
                        <p className="text-green-600 mb-4">
                            Password reset email has been sent! Please check your inbox and follow the instructions.
                        </p>
                        <button 
                            className="bg-customRed text-white p-2 rounded mt-2"
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 mb-3">{error}</p>}
                        <p className="mb-4 text-gray-600">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-black mb-3"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <ReCAPTCHA
                            className="flex justify-center mt-3"
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={(token) => setCaptchaVerified(token)}
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <Typography
                                className="text-blue-700 cursor-pointer hover:underline"
                                onClick={() => navigate("/login")}
                            >
                                Back to Login
                            </Typography>
                            <button 
                                type="submit" 
                                className="bg-customRed text-white p-2 rounded flex justify-center items-center w-32"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-middle"></span>
                                ) : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            
            <Snackbar 
                open={notification.open} 
                autoHideDuration={6000} 
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseNotification} 
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </div>
    );
}