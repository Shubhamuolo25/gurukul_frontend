import { useState, useRef } from 'react';
import './userForm.css';
import { createUser } from '../libs/apiHandler.js';
import { SuccessModal } from "./modal.jsx";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState('Group_16292168.svg');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const fileInputRef = useRef(null);

    const isPasswordValid = (pwd) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};

        if (!fullName.trim()) errors.fullName = 'Full name is required.';
        if (!email.trim()) {
            errors.email = 'Email address is required.';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            errors.email = 'Invalid email address.';
        }
        if (!password) {
            errors.password = 'Password is required.';
        } else if (!isPasswordValid(password)) {
            errors.password = 'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character.';
        }
        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password.';
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }
        if (!avatar) errors.avatar = 'Please upload a photo.';

        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            // Only set field errors, do not show toast for validation errors
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email.toLowerCase());
            formData.append('password', password);
            formData.append('confirmPassword', confirmPassword);
            formData.append('delete', false);
            formData.append('pic', avatar);

            const data = await createUser(formData);

            if (data.success) {
                setShowSuccessModal(true);
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAvatar(null);
                setPreview('Group_16292168.svg');
                setFieldErrors({});
            } else if (data.error) {
                let parsedError = data.error;
                try {
                    parsedError = typeof data.error === 'string' ? JSON.parse(data.error) : data.error;
                } catch {
                    // fallback if parsing fails
                }
                const errorMessage = parsedError?.email || parsedError?.message || 'Something went wrong.';
                toast.error(errorMessage);
            }
        } catch (err) {
            let backendMessage = null;
            if (err?.response) {
                const resp = err.response.data;
                if (typeof resp === 'string') {
                    try {
                        const parsed = JSON.parse(resp);
                        backendMessage = parsed?.email || parsed?.message || parsed?.error;
                    } catch {
                        backendMessage = resp;
                    }
                } else if (typeof resp === 'object') {
                    if (typeof resp.error === 'string') {
                        try {
                            const parsedErr = JSON.parse(resp.error);
                            backendMessage = parsedErr?.email || parsedErr?.message || parsedErr;
                        } catch {
                            backendMessage = resp.error;
                        }
                    } else {
                        backendMessage = resp?.email || resp?.message || resp?.error;
                    }
                }
            } else if (err?.message) {
                backendMessage = err.message;
            }
            toast.error(backendMessage || 'Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="content">
            <h1 className="head">Create Profile</h1>
            <div className="formContainer">
                <form className="formBody" onSubmit={handleSubmit}>
                    <div className="imageSection">
                        <label className="imageLabel">Upload Photo<span className="isRequired">*</span></label>
                        <span className="imageNote">Upload passport size photo</span>
                        <div className="imageUploader">
                            <img src={preview} alt="Preview" className="avatarImage" />
                            <button
                                type="button"
                                className="uploadButton"
                                onClick={handleUploadClick}
                                tabIndex={0}
                            >
                                <img src="upload.svg" alt="Upload Icon" />
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                        {fieldErrors.avatar && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.avatar}</div>}
                    </div>

                    <label>Full Name<span className="isRequired">*</span></label>
                    <input
                        type="text"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    />
                    {fieldErrors.fullName && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.fullName}</div>}

                    <label>Email Address<span className="isRequired">*</span></label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {fieldErrors.email && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.email}</div>}

                    <label>Create Password<span className="isRequired">*</span></label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {fieldErrors.password && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.password}</div>}

                    <label>Re-enter Password<span className="isRequired">*</span></label>
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    {fieldErrors.confirmPassword && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErrors.confirmPassword}</div>}

                    <div className="buttonGroup">
                        <button
                            type="button"
                            className="btnCancel"
                            onClick={() => {
                                setFullName('');
                                setEmail('');
                                setPassword('');
                                setConfirmPassword('');
                                setAvatar(null);
                                setPreview('Group_16292168.svg');
                                setFieldErrors({});
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btnSubmit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>

            {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}
            <ToastContainer position="top-center" autoClose={3000} />
        </div>
    );
};

export default UserForm;
