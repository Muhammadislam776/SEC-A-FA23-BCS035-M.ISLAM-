import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, BookOpen, Tag, Edit2, Trash2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/books';

const COVERS = [
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
];

const emptyBook = { title: '', author: '', isbn: '', totalCopies: 1, description: '', coverUrl: '' };

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(emptyBook);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setBooks(data);
    } catch {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => { setCurrentBook(emptyBook); setShowModal(true); };
  const openEdit = (book) => { setCurrentBook(book); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentBook._id) {
        await axios.put(`${API_URL}/${currentBook._id}`, currentBook);
        toast.success('Book updated!');
      } else {
        const payload = { ...currentBook, availableCopies: currentBook.totalCopies };
        await axios.post(API_URL, payload);
        toast.success('Book added!');
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Book deleted');
      fetchBooks();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const randomCover = () => COVERS[Math.floor(Math.random() * COVERS.length)];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container pb-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5 mt-4 gap-3">
        <div>
          <h1 className="fw-bold mb-1">Our <span className="text-primary">Collection</span></h1>
          <p className="text-muted mb-0">Discover and manage the library's book catalog</p>
        </div>
        <div className="d-flex gap-3 flex-wrap">
          <div className="d-flex align-items-center glass rounded-pill px-3 shadow-sm" style={{ minWidth: 280 }}>
            <Search size={18} className="text-muted me-2 flex-shrink-0" />
            <input
              type="text"
              className="form-control border-0 bg-transparent py-2 shadow-none"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center"
            onClick={openAdd}
          >
            <Plus size={18} className="me-2" /> Add Book
          </motion.button>
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Books', value: books.length, color: 'primary' },
          { label: 'Available', value: books.filter(b => b.availableCopies > 0).length, color: 'success' },
          { label: 'Out of Stock', value: books.filter(b => b.availableCopies === 0).length, color: 'danger' },
        ].map((s, i) => (
          <div className="col-4" key={i}>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`card border-0 glass rounded-4 p-3 text-center shadow-sm`}
            >
              <div className={`h3 fw-bold text-${s.color} mb-0`}>{s.value}</div>
              <div className="small text-muted">{s.label}</div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
          <BookOpen size={64} className="text-muted mb-3" style={{ opacity: 0.3 }} />
          <h5 className="text-muted">No books found</h5>
          <button className="btn btn-primary rounded-pill mt-3" onClick={openAdd}>Add your first book</button>
        </motion.div>
      ) : (
        <div className="row g-4">
          <AnimatePresence>
            {filteredBooks.map((book, index) => (
              <motion.div
                className="col-sm-6 col-md-4 col-lg-3"
                key={book._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04, type: 'spring', stiffness: 120 }}
                layout
              >
                <motion.div
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="card h-100 border-0 glass overflow-hidden rounded-4"
                >
                  {/* Cover image */}
                  <div className="position-relative overflow-hidden" style={{ height: 220 }}>
                    <motion.img
                      src={book.coverUrl || COVERS[book.title.length % COVERS.length]}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      alt={book.title}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    />
                    {/* Overlay badges */}
                    <div className="position-absolute top-0 start-0 w-100 d-flex justify-content-between p-2">
                      <span className={`badge rounded-pill px-2 py-1 ${book.availableCopies > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
                      </span>
                    </div>
                    {/* Action buttons overlay on hover */}
                    <div className="position-absolute top-0 end-0 p-2 d-flex flex-column gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="btn btn-sm btn-light rounded-circle p-2 shadow-sm"
                        onClick={() => openEdit(book)}
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        className="btn btn-sm btn-light rounded-circle p-2 shadow-sm"
                        onClick={() => handleDelete(book._id)}
                        title="Delete"
                      >
                        <Trash2 size={13} className="text-danger" />
                      </motion.button>
                    </div>
                    {/* Title overlay at bottom */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-3"
                      style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.75))' }}
                    >
                      <h6 className="text-white fw-bold mb-0 text-truncate">{book.title}</h6>
                      <small className="text-white text-opacity-75">{book.author}</small>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill small">
                        <Tag size={11} className="me-1" />{book.genre?.name || 'General'}
                      </span>
                      <small className="text-muted">{book.totalCopies} copies</small>
                    </div>
                    <Link
                      to={`/books/${book._id}`}
                      className="btn btn-outline-primary w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center py-2"
                    >
                      <BookOpen size={15} className="me-2" /> View Details
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="modal-dialog modal-dialog-centered modal-lg"
            >
              <div className="modal-content glass border-0 rounded-4 shadow-lg">
                <div className="modal-header border-0 pb-0 px-4 pt-4">
                  <h4 className="modal-title fw-bold d-flex align-items-center gap-2">
                    {currentBook._id
                      ? <><Edit2 size={22} className="text-primary" /> Edit Book</>
                      : <><Plus size={22} className="text-primary" /> Add New Book</>
                    }
                  </h4>
                  <button className="btn btn-sm btn-light rounded-circle border-0" onClick={() => setShowModal(false)}>
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body px-4 py-3">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label small fw-bold">Title *</label>
                        <input type="text" className="form-control rounded-3" placeholder="Book title"
                          value={currentBook.title} onChange={e => setCurrentBook({ ...currentBook, title: e.target.value })} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-bold">Total Copies *</label>
                        <input type="number" className="form-control rounded-3" min="1"
                          value={currentBook.totalCopies} onChange={e => setCurrentBook({ ...currentBook, totalCopies: parseInt(e.target.value) || 1 })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">Author *</label>
                        <input type="text" className="form-control rounded-3" placeholder="Author name"
                          value={currentBook.author} onChange={e => setCurrentBook({ ...currentBook, author: e.target.value })} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold">ISBN <span className="text-muted fw-normal">(optional)</span></label>
                        <input type="text" className="form-control rounded-3" placeholder="978-..."
                          value={currentBook.isbn} onChange={e => setCurrentBook({ ...currentBook, isbn: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Cover Image URL <span className="text-muted fw-normal">(optional)</span></label>
                        <input type="text" className="form-control rounded-3" placeholder="https://..."
                          value={currentBook.coverUrl} onChange={e => setCurrentBook({ ...currentBook, coverUrl: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-bold">Description <span className="text-muted fw-normal">(optional)</span></label>
                        <textarea className="form-control rounded-3" rows="3" placeholder="Brief description..."
                          value={currentBook.description} onChange={e => setCurrentBook({ ...currentBook, description: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 px-4 pb-4 pt-0 gap-2">
                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                    <motion.button
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center"
                      disabled={saving}
                    >
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                        : <><Save size={16} className="me-2" /> {currentBook._id ? 'Update Book' : 'Add Book'}</>
                      }
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookList;
