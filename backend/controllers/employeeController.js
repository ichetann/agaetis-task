const Employee = require('../models/employeeModel');

const employeeController = {
  getEmployees: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || '';

      const query = search ? { name: { $regex: search, $options: 'i' } } : {};

      const total = await Employee.countDocuments(query);
      const employees = await Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

      res.json({
        data: employees,
        currentPage: page,
        totalPages: Math.ceil(total / limit) || 1,
        totalEmployees: total,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  createEmployee: async (req, res) => {
    try {
      const { name, email, role } = req.body;
      if (!name || !email || !role) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const newEmployee = new Employee({ name, email, role });
      await newEmployee.save();
      res.status(201).json(newEmployee);
    } catch (err) {
      res.status(500).json({ error: 'Email already exists or server error' });
    }
  },

  updateEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id, 
        { name, email, role }, 
        { new: true, runValidators: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(updatedEmployee);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedEmployee = await Employee.findByIdAndDelete(id);

      if (!deletedEmployee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted successfully', employee: deletedEmployee });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = employeeController;