import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book as BookIcon, User, Calendar, Tag, Star, ArrowLeft, Bookmark, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/books/${id}`);
            setBook(data);
        } catch (err) {
            toast.error('Failed to fetch book details');
        }
    };

    const handleBorrow = async () => {
        if (!user) return navigate('/login');
        try {
            await axios.post('http://localhost:5000/api/loans', { bookId: id }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Book borrowed successfully!');
            fetchBook();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to borrow book');
        }
    };

    const handleReserve = async () => {
        if (!user) return navigate('/login');
        try {
            await axios.post('http://localhost:5000/api/reservations', { bookId: id }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Reservation placed successfully!');
            fetchBook();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reserve book');
        }
    };

    if (!book) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container"
        >
            <button className="btn btn-link text-decoration-none mb-4 d-flex align-items-center" onClick={() => navigate(-1)}>
                <ArrowLeft size={18} className="me-2" /> Back to Books
            </button>

            <div className="row g-5">
                <div className="col-md-4">
                    <div className="card border-0 shadow-lg overflow-hidden glass rounded-4">
                        <img 
                            src={book.coverUrl || `https://images.unsplash.com/photo-1543004403-d66779366e4a?auto=format&fit=crop&q=80&w=600`} 
                            className="card-img-top" 
                            alt={book.title}
                            style={{ height: '450px', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill">
                                <Tag size={14} className="me-1" /> {book.genre?.name || 'Fiction'}
                            </span>
                            <h1 className="display-5 fw-bold mb-1">{book.title}</h1>
                            <p className="lead text-muted d-flex align-items-center">
                                <User size={20} className="me-2" /> {book.author}
                            </p>
                        </div>
                        <div className="text-end">
                            <div className="d-flex align-items-center text-warning mb-1">
                                <Star size={24} fill="currentColor" />
                                <span className="fs-3 fw-bold ms-2">{book.averageRating.toFixed(1)}</span>
                            </div>
                            <small className="text-muted">{book.ratings.length} Reviews</small>
                        </div>
                    </div>

                    <div className="card glass border-0 p-4 mb-4 rounded-4 shadow-sm">
                        <h5 className="fw-bold mb-3">Description</h5>
                        <p className="text-muted">
                            {book.description || "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort."}
                        </p>
                        
                        <div className="row mt-4">
                            <div className="col-6 col-md-3">
                                <small className="text-muted d-block">ISBN</small>
                                <span className="fw-bold">{book.isbn || '978-0261103573'}</span>
                            </div>
                            <div className="col-6 col-md-3">
                                <small className="text-muted d-block">Availability</small>
                                <span className={`fw-bold ${book.availableCopies > 0 ? 'text-success' : 'text-danger'}`}>
                                    {book.availableCopies} / {book.totalCopies} Copies
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3">
                        {book.availableCopies > 0 ? (
                            <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow" onClick={handleBorrow}>
                                <ShoppingBag className="me-2" /> Borrow Now
                            </button>
                        ) : (
                            <button className="btn btn-warning btn-lg px-5 py-3 rounded-pill fw-bold shadow text-white" onClick={handleReserve}>
                                <Bookmark className="me-2" /> Reserve Now
                            </button>
                        )}
                        <button className="btn btn-outline-primary btn-lg px-4 py-3 rounded-pill fw-bold">
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookDetails;
