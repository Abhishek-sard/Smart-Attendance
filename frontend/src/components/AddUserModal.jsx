import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: '', // specific to teacher/student
        studentId: '' // specific to student
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/users`, formData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            onUserAdded();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating user');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Email" type="email" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Password" type="password" required onChange={e => setFormData({ ...formData, password: e.target.value })} />

                    <select className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>

                    {formData.role === 'student' && (
                        <input className="w-full border p-2 rounded" placeholder="Student ID" onChange={e => setFormData({ ...formData, studentId: e.target.value })} />
                    )}

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
