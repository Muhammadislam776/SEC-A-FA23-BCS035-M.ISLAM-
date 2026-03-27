import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Book, Clock, Layout, CreditCard, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const [loans, setLoans] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            const loansRes = await axios.get('http://localhost:5000/api/loans/my', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const resRes = await axios.get('http://localhost:5000/api/reservations/my', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setLoans(loansRes.data);
            setReservations(resRes.data);
        } catch (err) {
            toast.error('Failed to fetch profile data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mt-4"
        >
            <div className="row g-4">
                <div className="col-md-4">
                    <div className="card border-0 glass shadow-sm p-4 rounded-4 profile-card mb-4">
                        <div className="text-center mb-4">
                            <div className="bg-primary bg-opacity-10 p-4 rounded-circle d-inline-block mb-3">
                                <span className="display-4 fw-bold text-primary">{user.firstName[0]}</span>
                            </div>
                            <h3 className="fw-bold mb-1">{user.firstName} {user.lastName}</h3>
                            <p className="text-muted small">{user.email}</p>
                            <span className="badge bg-primary rounded-pill px-3 py-2">{user.role}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2 small fw-bold">
                            <span className="text-muted">Member Since</span>
                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4 small fw-bold">
                            <span className="text-muted">Subscription</span>
                            <span className="text-success">{user.subscription?.plan || 'Free Tier'}</span>
                        </div>
                        <button className="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow-sm">
                            Upgrade Plan
                        </button>
                    </div>

                    <div className="card border-0 glass shadow-sm p-4 rounded-4">
                        <h5 className="fw-bold mb-3 d-flex align-items-center">
                            <CreditCard size={20} className="me-2 text-primary" /> Fines & Billing
                        </h5>
                        <div className="bg-danger bg-opacity-10 p-3 rounded-3 mb-3">
                            <h2 className="fw-bold text-danger mb-0">${user.fines || 0}.00</h2>
                            <small className="text-danger fw-bold">Outstanding Fines</small>
                        </div>
                        <button className="btn btn-outline-danger w-100 rounded-pill fw-bold">Pay Now</button>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card border-0 glass shadow-sm p-4 rounded-4 mb-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <Book size={20} className="me-2 text-primary" /> Active Loans
                        </h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Book Title</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.filter(l => l.status === 'ACTIVE').map(loan => (
                                        <tr key={loan._id}>
                                            <td className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{loan.book.title}</td>
                                            <td>{new Date(loan.dueDate).toLocaleDateString()}</td>
                                            <td><span className="badge bg-success bg-opacity-10 text-success">Active</span></td>
                                            <td><button className="btn btn-sm btn-link text-decoration-none fw-bold">Renew</button></td>
                                        </tr>
                                    ))}
                                    {loans.filter(l => l.status === 'ACTIVE').length === 0 && (
                                        <tr><td colSpan="4" className="text-center text-muted py-4">No active loans</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card border-0 glass shadow-sm p-4 rounded-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center">
                            <Clock size={20} className="me-2 text-primary" /> Pending Reservations
                        </h5>
                        <div className="list-group list-group-flush">
                            {reservations.map(res => (
                                <div key={res._id} className="list-group-item bg-transparent d-flex justify-content-between align-items-center py-3 border-0 border-bottom">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-warning bg-opacity-10 p-2 rounded me-3 text-warning">
                                            <Layout size={18} />
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold">{res.book.title}</h6>
                                            <small className="text-muted">Queue Position: #{res.queuePosition}</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-sm btn-outline-danger rounded-pill px-3">Cancel</button>
                                </div>
                            ))}
                            {reservations.length === 0 && (
                                <p className="text-center text-muted py-4">No pending reservations</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
