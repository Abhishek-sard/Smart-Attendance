import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { Link } from 'react-router-dom';

const TeacherClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/classes`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setClasses(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    if (loading) return <div>Loading Classes...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Classes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map(cls => (
                    <div key={cls._id} className="bg-white p-6 rounded shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-bold text-blue-600">{cls.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">{cls.subjectCode} - {cls.department}</p>

                        <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
                            <span>Students: {cls.students.length}</span>
                        </div>

                        <Link
                            to={`/attendance/${cls._id}`}
                            className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Mark Attendance
                        </Link>
                    </div>
                ))}

                {classes.length === 0 && (
                    <p className="text-gray-500">No classes assigned yet.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherClasses;
