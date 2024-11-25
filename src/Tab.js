import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Button, TextField, Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import axios from 'axios';

const LeaveManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [formData, setFormData] = useState({
    leave_type: '',
    description: '',
    allocation_type: '',
    allocation: '',
    carry_forward: false,
    carry_forward_type: '',
    percentage: ''
  });
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch leaves on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await axios.get('http://intranet.higherindia.net:3006/leave/leave-types');
      if (response.data.leave_types && Array.isArray(response.data.leave_types)) {
        setLeaves(response.data.leave_types);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let cleanedFormData = { ...formData };

    // Handle carry forward logic
    if (!cleanedFormData.carry_forward) {
      delete cleanedFormData.carry_forward_type;
      delete cleanedFormData.percentage;
    } else if (!cleanedFormData.carry_forward_type || !cleanedFormData.percentage) {
      setError('Carry Forward Type and Value are required when Carry Forward is Yes.');
      return;
    }

    try {
      const response = await axios.post('http://intranet.higherindia.net:3006/leave/leave-types', cleanedFormData);
      setLeaves([...leaves, response.data]); // Assuming response contains the new leave
      // Reset form after successful submission
      setFormData({
        leave_type: '',
        description: '',
        allocation_type: '',
        allocation: '',
        carry_forward: false,
        carry_forward_type: '',
        percentage: ''
      });
      setError('');
    } catch (error) {
      setError('Failed to add leave. Please try again.');
      console.error('Error occurred while adding leave:', error);
    }
  };

  return (
    <Box>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="leave management tabs">
        <Tab label="Create Leave" />
        <Tab label="Apply Leave" />
        <Tab label="Balance Leave" />
        <Tab label="Leave Approval" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Create Leave</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Leave Type</InputLabel>
            <TextField
              name="leave_type"
              value={formData.leave_type}
              onChange={handleChange}
              label="Leave Type"
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              name="description"
              value={formData.description}
              onChange={handleChange}
              label="Description"
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Allocation Type</InputLabel>
            <Select
              name="allocation_type"
              value={formData.allocation_type}
              onChange={handleChange}
              required
            >
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              name="allocation"
              value={formData.allocation}
              onChange={handleChange}
              label="Allocation"
              type="number"
              required
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Carry Forward</InputLabel>
            <Select
              name="carry_forward"
              value={formData.carry_forward}
              onChange={handleChange}
              required
            >
              <MenuItem value={false}>No</MenuItem>
              <MenuItem value={true}>Yes</MenuItem>
            </Select>
          </FormControl>

          {formData.carry_forward && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Carry Forward Type</InputLabel>
                <Select
                  name="carry_forward_type"
                  value={formData.carry_forward_type}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Percentage">Percentage</MenuItem>
                  <MenuItem value="Value">Value</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <TextField
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  label="Carry Forward Value"
                  type="number"
                  required
                />
              </FormControl>
            </>
          )}

          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary">Create Leave</Button>
        </form>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Apply Leave</Typography>
        {/* Add Apply Leave content here */}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Balance Leave</Typography>
        {/* Add Balance Leave content here */}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Leave Approval</Typography>
        {/* Add Leave Approval content here */}
      </TabPanel>
    </Box>
  );
};

const TabPanel = ({ children, value, index }) => {
  return value === index && (
    <Box p={3}>
      {children}
    </Box>
  );
};

export default LeaveManagement;
