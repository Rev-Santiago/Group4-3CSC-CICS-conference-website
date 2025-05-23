import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Alert, Snackbar, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [tokenChecked, setTokenChecked] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

    // ✅ Password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleTogglePasswordVisibility = () => setShowPassword(prev => !prev);
    const handleToggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/verify-reset-token/${token}`);
                const data = await response.json();
                setIsTokenValid(response.ok);
                if (!response.ok) setError(data.error || "Invalid or expired reset token");
            } catch (err) {
                console.error("Token verification error:", err);
                setError("Failed to verify reset token");
                setIsTokenValid(false);
            } finally {
                setTokenChecked(true);
            }
        };

        if (token) verifyToken();
        else {
            setError("Reset token is missing");
            setIsTokenValid(false);
            setTokenChecked(true);
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Failed to reset password");
                return;
            }

            setNotification({
                open: true,
                message: "Password reset successful! You can now login with your new password.",
                severity: "success"
            });

            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            console.error("Password reset error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseNotification = () => setNotification(prev => ({ ...prev, open: false }));

    if (!tokenChecked) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customRed mx-auto" />
                    <p className="mt-4">Verifying reset token...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="bg-white p-6 border border-black w-96 mb-5">
                <h2 className="text-xl text-customRed mb-4">Reset Your Password</h2>

                {!isTokenValid ? (
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error || "Invalid or expired reset link"}</p>
                        <p className="mb-4">The password reset link may have expired or is invalid.</p>
                        <button 
                            className="bg-customRed text-white p-2 rounded mt-2"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Request New Reset Link
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && <p className="text-red-500 mb-3">{error}</p>}

                        {/* New Password */}
                        <label className="block text-sm font-medium">New Password</label>
                        <div className="relative mb-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-2 border border-black pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <IconButton
                                onClick={handleTogglePasswordVisibility}
                                className="!absolute right-2 top-1/2 transform -translate-y-1/2"
                                size="small"
                            >
                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">Password must be at least 8 characters long</p>

                        {/* Confirm Password */}
                        <label className="block text-sm font-medium">Confirm New Password</label>
                        <div className="relative mb-4">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full p-2 border border-black pr-10"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <IconButton
                                onClick={handleToggleConfirmPasswordVisibility}
                                className="!absolute right-2 top-1/2 transform -translate-y-1/2"
                                size="small"
                            >
                                {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                        </div>

                        {/* Submit */}
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
