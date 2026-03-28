import { useState, useEffect } from 'react';
import axios from 'axios';
import AddClassModal from '../../components/AddClassModal';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchClasses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/classes', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setClasses(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const deleteClass = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/classes/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setClasses(classes.filter(c => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Class Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Class
                </button>
            </div>

            <AddClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClassAdded={fetchClasses}
            />

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {classes.map(c => (
                            <tr key={c._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.subjectCode}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.teacher?.name || 'Unassigned'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => deleteClass(c._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassManagement;
