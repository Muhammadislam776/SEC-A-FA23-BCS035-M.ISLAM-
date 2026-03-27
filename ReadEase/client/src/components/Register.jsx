import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, BookOpen, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                className="auth-card glass shadow-lg"
            >
                {/* Logo */}
                <div className="text-center mb-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
                        className="auth-logo mx-auto mb-3"
                    >
                        <BookOpen size={28} className="text-white" />
                    </motion.div>
                    <h2 className="fw-bold mb-1">Create account</h2>
                    <p className="text-muted small">Join ReadEase today — it's free!</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                        <div className="col-6">
                            <label className="form-label small fw-bold">First Name</label>
                            <div className="auth-input-wrap">
                                <User size={16} className="auth-input-icon" />
                                <input type="text" className="form-control auth-input" placeholder="John"
                                    value={formData.firstName} onChange={set('firstName')} required />
                            </div>
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-bold">Last Name</label>
                            <input type="text" className="form-control rounded-3" placeholder="Doe"
                                value={formData.lastName} onChange={set('lastName')} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">Email</label>
                        <div className="auth-input-wrap">
                            <Mail size={16} className="auth-input-icon" />
                            <input type="email" className="form-control auth-input" placeholder="you@example.com"
                                value={formData.email} onChange={set('email')} required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold">Password</label>
                        <div className="auth-input-wrap">
                            <Lock size={16} className="auth-input-icon" />
                            <input type={showPass ? 'text' : 'password'} className="form-control auth-input auth-input-padded"
                                placeholder="••••••••" value={formData.password} onChange={set('password')} required minLength={6} />
                            <button type="button" className="auth-eye-btn" onClick={() => setShowPass(v => !v)}>
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="btn btn-primary w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 mb-3"
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="spinner-border spinner-border-sm" /> Creating account...</>
                            : <><UserPlus size={18} /> Create Account</>
                        }
                    </motion.button>

                    <p className="text-center text-muted small mb-0">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign in</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
