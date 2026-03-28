import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/attendance/student/me', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setAttendance(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    // Calculate aggregated stats
    const stats = attendance.reduce((acc, curr) => {
        const className = curr.class?.name || 'Unknown';
        if (!acc[className]) {
            acc[className] = { total: 0, present: 0 };
        }
        acc[className].total += 1;
        if (curr.status === 'Present') {
            acc[className].present += 1;
        }
        return acc;
    }, {});

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Attendance</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.keys(stats).map(cls => (
                    <div key={cls} className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                        <h3 className="text-lg font-bold text-gray-700">{cls}</h3>
                        <div className="flex items-end mt-2">
                            <span className="text-3xl font-bold text-blue-600">
                                {Math.round((stats[cls].present / stats[cls].total) * 100)}%
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                                ({stats[cls].present}/{stats[cls].total})
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendance.map(record => (
                            <tr key={record._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {record.class?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                                            record.status === 'Absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {record.method}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentAttendance;
