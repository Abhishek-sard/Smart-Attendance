import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import QRCodeGenerator from '../../components/QRCodeGenerator';

const MarkAttendance = () => {
    const { classId } = useParams();
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // { studentId: 'Present' | 'Absent' }
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [showQR, setShowQR] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastSynced, setLastSynced] = useState(null);

    // 1. Fetch static student list for the class
    useEffect(() => {
        const fetchStudentsOnly = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/classes', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                const cls = res.data.find(c => c._id === classId);
                if (cls) {
                    setStudents(cls.students);
                }
            } catch (err) {
                console.error("Error fetching students:", err);
            }
        };
        fetchStudentsOnly();
    }, [classId]);

    // 2. Fetch current attendance records for this date
    const fetchAttendanceRecords = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/attendance/${classId}?date=${date}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            // Map records to studentId: status
            const currentStatus = {};
            res.data.forEach(record => {
                currentStatus[record.student._id] = record.status;
            });

            setAttendanceData(prev => {
                // If a student doesn't have a status in currentStatus, default to 'Present' or 'Absent' as before
                // But we don't want to overwrite manual unsaved local changes if possible.
                // For now, let's merge: server status takes priority for those who have it
                const mergedStatus = { ...prev };
                Object.keys(currentStatus).forEach(sid => {
                    mergedStatus[sid] = currentStatus[sid];
                });
                return mergedStatus;
            });
            setLastSynced(new Date());
            setLoading(false);
        } catch (err) {
            console.error("Error fetching attendance records:", err);
            setLoading(false);
        }
    };

    // 3. Initial fetch and Polling logic
    useEffect(() => {
        fetchAttendanceRecords();

        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchAttendanceRecords();
            }, 5000); // Check every 5 seconds
        }

        return () => clearInterval(interval);
    }, [classId, date, autoRefresh]);

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const submitAttendance = async () => {
        const records = Object.keys(attendanceData).map(studentId => ({
            studentId,
            status: attendanceData[studentId],
            method: 'Manual'
        }));

        try {
            await axios.post('http://localhost:5000/api/attendance', {
                classId,
                date,
                records
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            alert('Attendance Saved Successfully!');
            fetchAttendanceRecords(); // Sync immediately after save
        } catch (err) {
            console.error(err);
            alert('Failed to mark attendance');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Attendance Management</h1>
                    <div className="flex items-center mt-1 space-x-3">
                        <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${autoRefresh ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            {autoRefresh ? 'Live Updates ON' : 'Auto-refresh OFF'}
                        </span>
                        {lastSynced && (
                            <span className="text-xs text-slate-400">
                                Last synced: {lastSynced.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${autoRefresh ? 'bg-slate-200 text-slate-700' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}
                    >
                        {autoRefresh ? 'Pause Live' : 'Resume Live'}
                    </button>
                    <button
                        onClick={() => setShowQR(!showQR)}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-sm"
                    >
                        {showQR ? 'Hide QR Code' : 'Show QR Code'}
                    </button>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border border-slate-200 p-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {showQR && (
                <div className="mb-8 flex justify-center">
                    <QRCodeGenerator classId={classId} date={date} />
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll/ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {students.map(s => (
                            <tr key={s._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{s.studentId || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(s._id, status)}
                                                className={`px-3 py-1 rounded text-sm font-medium transition
                                                    ${attendanceData[s._id] === status
                                                        ? (status === 'Present' ? 'bg-green-600 text-white' :
                                                            status === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white')
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={submitAttendance}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
                Submit Attendance
            </button>
        </div>
    );
};

export default MarkAttendance;
