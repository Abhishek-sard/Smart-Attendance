import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AddDepartmentModal = ({ isOpen, onClose, onDepartmentAdded }) => {
    const [formData, setFormData] = useState({ name: '', code: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/departments`, formData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            onDepartmentAdded();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating department');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Department</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Department Name" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <input className="w-full border p-2 rounded" placeholder="Code (e.g., CS)" required onChange={e => setFormData({ ...formData, code: e.target.value })} />

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepartmentModal;
