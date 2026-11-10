import React, { useEffect, useState } from 'react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from './services/api';
import type { Employee } from './services/api';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal & Search States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadEmployees();
  }, [currentPage, searchTerm]);

  const loadEmployees = async () => {
    try {
      const response = await getEmployees(currentPage, limit, searchTerm);
      setEmployees(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ name: '', email: '', role: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    if (emp._id) {
      setEditingId(emp._id);
      setForm({ name: emp.name, email: emp.email, role: emp.role });
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEmployee(editingId, form);
      } else {
        await addEmployee(form);
      }
      setIsModalOpen(false);
      setForm({ name: '', email: '', role: '' });
      setEditingId(null);
      loadEmployees();
    } catch (err) {
      console.error('Failed to save employee', err);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteEmployee(id);
      loadEmployees();
    } catch (err) {
      console.error('Failed to delete employee', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Employee Directory</h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Filter by employee name..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-72 border border-slate-300 px-4 py-2 rounded-lg text-sm focus:outline-blue-500 bg-slate-50"
          />
          
          {/* Add Employee Button */}
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-sm transition-colors"
          >
            + Add Employee
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
        {/* Table & Pagination Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No employees found.</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">{emp.name}</td>
                    <td className="p-4 text-slate-600">{emp.email}</td>
                    <td className="p-4 text-slate-600">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 disabled:opacity-40 hover:bg-slate-100 font-medium shadow-sm"
            >
              Previous
            </button>
            <span className="text-slate-600 text-sm font-medium">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 disabled:opacity-40 hover:bg-slate-100 font-medium shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Employee Record' : 'Add New Employee'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. jane.doe@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Job Role</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm"
                >
                  {editingId ? 'Save Changes' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}