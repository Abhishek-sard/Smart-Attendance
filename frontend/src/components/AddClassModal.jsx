import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const AddClassModal = ({ isOpen, onClose, onClassAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        subjectCode: '',
        department: '',
        teacher: ''
    });
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                const token = localStorage.getItem('token');
                if (!token) return;

                try {
                    const depsRes = await axios.get(`${API_BASE_URL}/departments`, {
                        headers: { 'x-auth-token': token }
                    });
                    setDepartments(depsRes.data);

                    const usersRes = await axios.get(`${API_BASE_URL}/users`, {
                        headers: { 'x-auth-token': token }
                    });
                    setTeachers(usersRes.data.filter(u => u.role === 'teacher'));
                } catch (err) {
                    console.error(err);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                location: {
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    radius: formData.radius || 100
                }
            };
            await axios.post(`${API_BASE_URL}/classes`, payload, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            onClassAdded();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating class');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Class</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Class Name"
                        required
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Subject Code"
                        required
                        onChange={e => setFormData({ ...formData, subjectCode: e.target.value })}
                    />

                    <select
                        className="w-full border p-2 rounded"
                        required
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                    >
                        <option value="">Select Department</option>
                        {departments.map(d => (
                            <option key={d._id} value={d.name}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        className="w-full border p-2 rounded"
                        required
                        onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map(t => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-3 gap-2">
                        <input
                            className="border p-2 rounded"
                            placeholder="Lat"
                            type="number"
                            step="any"
                            onChange={e => setFormData({ ...formData, latitude: e.target.value })}
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Lng"
                            type="number"
                            step="any"
                            onChange={e => setFormData({ ...formData, longitude: e.target.value })}
                        />
                        <input
                            className="border p-2 rounded"
                            placeholder="Rad (m)"
                            type="number"
                            defaultValue={100}
                            onChange={e => setFormData({ ...formData, radius: e.target.value })}
                        />
                    </div>
                    <button type="button"
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition(pos => {
                                setFormData({
                                    ...formData,
                                    latitude: pos.coords.latitude,
                                    longitude: pos.coords.longitude
                                });
                                // Manual update needed for controlled inputs or separate state, 
                                // simplistic approach for now:
                                alert(`Fetched: ${pos.coords.latitude}, ${pos.coords.longitude}`);
                            });
                        }}
                        className="text-xs text-blue-600 underline"
                    >
                        Get Current Location
                    </button>

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClassModal;
