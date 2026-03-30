import { useState, useEffect } from 'react';
import axios from 'axios';

import AddDepartmentModal from '../../components/AddDepartmentModal';
import API_BASE_URL from '../../config/api';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Helper to get token
    const getToken = () => localStorage.getItem('token');

    const fetchDeps = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/departments`, {
                headers: { 'x-auth-token': getToken() }
            });
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDeps();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Departments</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Department
                </button>
            </div>

            <AddDepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDepartmentAdded={fetchDeps}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map(dept => (
                    <div key={dept._id} className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-bold text-gray-800">{dept.name}</h3>
                        <p className="text-gray-500">Code: {dept.code}</p>
                        {dept.headOfDepartment && <p className="text-sm mt-2">Head: {dept.headOfDepartment.name}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DepartmentManagement;
