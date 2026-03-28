import { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveApplication = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({ startDate: '', endDate: '', reason: '' });
    const [loading, setLoading] = useState(true);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/leaves/my', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setLeaves(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/leaves', formData, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchLeaves(); // Refresh list
            alert('Leave application submitted!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error applying for leave');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Application Form */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Start Date</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            required
                            value={formData.startDate}
                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">End Date</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            required
                            value={formData.endDate}
                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Reason</label>
                        <textarea
                            className="w-full border p-2 rounded"
                            rows="3"
                            placeholder="Reason for leave..."
                            required
                            value={formData.reason}
                            onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Submit Application
                    </button>
                </form>
            </div>

            {/* Leave History */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">My Leave History</h2>
                <div className="space-y-4">
                    {leaves.map(leave => (
                        <div key={leave._id} className="border-b pb-4 last:border-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800">{leave.reason}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold
                                    ${leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        leave.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {leave.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {leaves.length === 0 && <p className="text-gray-500">No leave history found.</p>}
                </div>
            </div>
        </div>
    );
};

export default LeaveApplication;
