import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { saveAs } from 'file-saver';

const ReportsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [classReport, setClassReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const statsRes = await axios.get('http://localhost:5000/api/reports/dashboard-stats', {
                    headers: { 'x-auth-token': token }
                });
                setStats(statsRes.data);

                const classesRes = await axios.get('http://localhost:5000/api/classes', {
                    headers: { 'x-auth-token': token }
                });
                setClasses(classesRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const fetchClassReport = async (classId) => {
        try {
            setSelectedClass(classId);
            const res = await axios.get(`${API_BASE_URL}/reports/class/${classId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setClassReport(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const exportCSV = () => {
        if (!classReport.length) return;

        let csvContent = "Student ID,Name,Total Classes,Present,Absent,Percentage\n";
        classReport.forEach(row => {
            csvContent += `${row.studentId},${row.name},${row.total},${row.present},${row.absent},${row.percentage}%\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
        saveAs(blob, "attendance_report.csv");
    };

    if (loading) return <div>Loading...</div>;

    const pieData = stats ? [
        { name: 'Present', value: stats.attendanceToday.present },
        { name: 'Absent', value: stats.attendanceToday.absent }
    ] : [];
    const COLORS = ['#82ca9d', '#8884d8'];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>

            {/* Overall Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                    <p className="text-gray-500">Students</p>
                    <p className="text-2xl font-bold">{stats?.totalStudents}</p>
                </div>
                <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
                    <p className="text-gray-500">Teachers</p>
                    <p className="text-2xl font-bold">{stats?.totalTeachers}</p>
                </div>
                <div className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
                    <p className="text-gray-500">Classes</p>
                    <p className="text-2xl font-bold">{stats?.totalClasses}</p>
                </div>
                <div className="bg-white p-4 rounded shadow border-l-4 border-orange-500">
                    <p className="text-gray-500">Today's Attendance</p>
                    <p className="text-lg">
                        <span className="text-green-600">{stats?.attendanceToday.present} P</span> /
                        <span className="text-red-600"> {stats?.attendanceToday.absent} A</span>
                    </p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Today's Attendance Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Class Report Generation</h3>
                    <div className="mb-4 space-y-2">
                        <p className="text-sm text-gray-600">Select a class to generate detailed report and export CSV.</p>
                        <select
                            className="w-full border p-2 rounded"
                            onChange={(e) => fetchClassReport(e.target.value)}
                        >
                            <option value="">Select Class</option>
                            {classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedClass && classReport.length > 0 && (
                        <div className="text-center">
                            <p className="mb-4 text-green-600 font-semibold">Report Generated for {classReport.length} Students</p>
                            <button
                                onClick={exportCSV}
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center justify-center w-full"
                            >
                                Download CSV Report
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Table for Selected Class */}
            {selectedClass && classReport.length > 0 && (
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Detailed Class Attendance</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {classReport.map(row => (
                                    <tr key={row.studentId}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{row.name}</div>
                                            <div className="text-gray-500 text-sm">{row.studentId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">{row.present}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-red-600 font-bold">{row.absent}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold">{row.percentage}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {Number(row.percentage) < 75 ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Low Attendance</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Good</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsDashboard;
