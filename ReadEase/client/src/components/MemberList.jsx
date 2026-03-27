import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Edit2, Trash2, User } from 'lucide-react';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMember, setCurrentMember] = useState({ firstName: '', lastName: '', email: '' });

  const API_URL = 'http://localhost:5000/api/members';

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(API_URL);
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentMember._id) {
        await axios.put(`${API_URL}/${currentMember._id}`, currentMember);
      } else {
        await axios.post(API_URL, currentMember);
      }
      setShowModal(false);
      setCurrentMember({ firstName: '', lastName: '', email: '' });
      fetchMembers();
    } catch (err) {
      alert('Error saving member: ' + err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchMembers();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Member Management</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" /> Add Member
        </button>
      </div>

      <div className="card p-0 overflow-hidden glass shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="py-3">Email</th>
                <th className="py-3">Membership Date</th>
                <th className="py-3 text-center">Borrowed Books</th>
                <th className="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="p-2 rounded-circle bg-primary bg-opacity-10 me-3">
                        <User size={18} className="text-primary" />
                      </div>
                      <span className="fw-medium">{member.firstName} {member.lastName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-muted">{member.email}</td>
                  <td className="py-3 text-muted">{new Date(member.membershipDate).toLocaleDateString()}</td>
                  <td className="py-3 text-center">
                    <span className="badge bg-info bg-opacity-10 text-info px-3">
                      {member.borrowedBooks?.filter(b => !b.returnDate).length || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => { setCurrentMember(member); setShowModal(true); }}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(member._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">{currentMember._id ? 'Edit Member' : 'Register New Member'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-control" value={currentMember.firstName} onChange={(e) => setCurrentMember({...currentMember, firstName: e.target.value})} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-control" value={currentMember.lastName} onChange={(e) => setCurrentMember({...currentMember, lastName: e.target.value})} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" value={currentMember.email} onChange={(e) => setCurrentMember({...currentMember, email: e.target.value})} required />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Member</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList;
