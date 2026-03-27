import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, BookOpen, User, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5000/api';

const BorrowingFlow = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` }
  });

  const fetchData = async () => {
    setFetching(true);
    try {
      const [bookRes, loanRes] = await Promise.all([
        axios.get(`${API}/books`),
        user ? axios.get(`${API}/loans/my`, authHeaders()) : Promise.resolve({ data: [] })
      ]);
      setBooks(bookRes.data.filter(b => b.availableCopies > 0));
      setLoans(loanRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setFetching(false);
    }
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to borrow books'); return; }
    if (!selectedBook) return;
    setLoading(true);
    try {
      await axios.post(`${API}/loans`, { bookId: selectedBook }, authHeaders());
      toast.success('Book borrowed successfully! Due in 14 days.');
      setSelectedBook('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to borrow book');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      const { data } = await axios.post(`${API}/loans/${loanId}/return`, {}, authHeaders());
      if (data.loan?.fineAmount > 0) {
        toast(`Book returned! Fine: $${data.loan.fineAmount} (overdue)`, { icon: '⚠️' });
      } else {
        toast.success('Book returned successfully!');
      }
      fetchData();
    } catch (err) {
      toast.error('Failed to return book');
    }
  };

  const activeLoans = loans.filter(l => l.status === 'ACTIVE');
  const returnedLoans = loans.filter(l => l.status === 'RETURNED');
  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-4">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="fw-bold mb-1">Borrowing <span className="text-primary">& Returns</span></h1>
        <p className="text-muted">Borrow books and manage your reading journey</p>
      </div>

      <div className="row g-4">
        {/* Left: Borrow Form */}
        <div className="col-md-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card border-0 glass rounded-4 shadow-sm p-4 mb-4"
          >
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <span className="bg-primary bg-opacity-10 p-2 rounded-3">
                <ArrowRight size={18} className="text-primary" />
              </span>
              Issue a Book
            </h5>

            {!user && (
              <div className="alert alert-warning rounded-3 d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={16} /> Login required to borrow
              </div>
            )}

            <form onSubmit={handleBorrow}>
              <label className="form-label small fw-bold text-muted">Select Available Book</label>
              <select
                className="form-select rounded-3 mb-4"
                value={selectedBook}
                onChange={e => setSelectedBook(e.target.value)}
                required
                disabled={!user || fetching}
              >
                <option value="">Choose a book...</option>
                {books.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.title} — {b.author} ({b.availableCopies} left)
                  </option>
                ))}
              </select>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-primary w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                disabled={loading || !user}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm" /> Processing...</>
                  : <><BookOpen size={18} /> Borrow Book</>
                }
              </motion.button>
            </form>
          </motion.div>

          {/* Stats */}
          <div className="row g-3">
            {[
              { label: 'Active Loans', value: activeLoans.length, color: 'primary', icon: <BookOpen size={18} /> },
              { label: 'Returned', value: returnedLoans.length, color: 'success', icon: <Check size={18} /> },
            ].map((s, i) => (
              <div className="col-6" key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="card border-0 glass rounded-4 p-3 text-center shadow-sm"
                >
                  <div className={`text-${s.color} mb-1`}>{s.icon}</div>
                  <div className={`h3 fw-bold text-${s.color} mb-0`}>{s.value}</div>
                  <div className="small text-muted">{s.label}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Loans */}
        <div className="col-md-7">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="card border-0 glass rounded-4 shadow-sm p-4"
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                <span className="bg-success bg-opacity-10 p-2 rounded-3">
                  <Check size={18} className="text-success" />
                </span>
                My Active Loans
              </h5>
              <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}
                className="btn btn-sm btn-light rounded-circle p-2 border-0" onClick={fetchData}>
                <RefreshCw size={14} />
              </motion.button>
            </div>

            {fetching ? (
              <div className="text-center py-4"><div className="spinner-border text-primary spinner-border-sm" /></div>
            ) : activeLoans.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5 text-muted">
                <BookOpen size={52} style={{ opacity: 0.2 }} className="mb-3" />
                <p className="mb-0">No active loans found</p>
                <small>Borrow a book to get started!</small>
              </motion.div>
            ) : (
              <div className="d-flex flex-column gap-3">
                <AnimatePresence>
                  {activeLoans.map((loan, i) => (
                    <motion.div
                      key={loan._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.06 }}
                      className={`d-flex justify-content-between align-items-center p-3 rounded-3 border ${isOverdue(loan.dueDate) ? 'border-danger bg-danger bg-opacity-5' : 'border-0 bg-white bg-opacity-50'}`}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className={`p-2 rounded-3 ${isOverdue(loan.dueDate) ? 'bg-danger bg-opacity-10' : 'bg-primary bg-opacity-10'}`}>
                          <BookOpen size={18} className={isOverdue(loan.dueDate) ? 'text-danger' : 'text-primary'} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{loan.book?.title || 'Unknown'}</h6>
                          <div className="d-flex align-items-center gap-1 text-muted small">
                            <Clock size={12} />
                            Due: {new Date(loan.dueDate).toLocaleDateString()}
                            {isOverdue(loan.dueDate) && <span className="badge bg-danger ms-2">Overdue</span>}
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold"
                        onClick={() => handleReturn(loan._id)}
                      >
                        Return
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* History */}
          {returnedLoans.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="card border-0 glass rounded-4 shadow-sm p-4 mt-4"
            >
              <h6 className="fw-bold mb-3 text-muted">Return History</h6>
              <div className="d-flex flex-column gap-2">
                {returnedLoans.slice(0, 5).map(loan => (
                  <div key={loan._id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="small fw-bold">{loan.book?.title}</span>
                    <div className="d-flex align-items-center gap-2">
                      {loan.fineAmount > 0 && <span className="badge bg-danger bg-opacity-10 text-danger">Fine: ${loan.fineAmount}</span>}
                      <span className="badge bg-success bg-opacity-10 text-success">Returned</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BorrowingFlow;
