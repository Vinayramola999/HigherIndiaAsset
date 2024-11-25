// src/DynamicForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; // Import your CSS file

const DynamicForm = () => {
  const [fields, setFields] = useState([]); // Existing fields from the database
  const [newFields, setNewFields] = useState([]); // New fields to be added
  const [newFieldInput, setNewFieldInput] = useState({ name: '', type: 'string', value: '' }); // Temporary input for new field
  const [feedback, setFeedback] = useState('');

  // Fetch the form fields from the backend when the component loads
  useEffect(() => {
    axios.get('http://higherindia.net:3006/form-fields', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        const fieldsData = response.data.map(field => ({
          id: field.id,
          name: field.field_name,
          type: field.field_type,
          value: ''
        }));
        setFields(fieldsData);
      })
      .catch(error => {
        console.error('Error fetching form fields:', error);
      });
  }, []);

  // Function to handle adding a new field to the list of new fields
  const handleAddField = () => {
    if (newFieldInput.name) {
      setNewFields([...newFields, { ...newFieldInput, id: fields.length + newFields.length + 1 }]);
      setNewFieldInput({ name: '', type: 'string', value: '' }); // Reset the new field input
    }
  };

  // Function to delete a new field before submission
  const handleDeleteField = (id) => {
    const updatedNewFields = newFields.filter(field => field.id !== id);
    setNewFields(updatedNewFields);
  };

  // Function to handle field changes for existing fields
  const handleFieldChange = (id, event) => {
    const { name, value } = event.target;
    const updatedFields = fields.map(field =>
      field.id === id ? { ...field, [name]: value } : field
    );
    setFields(updatedFields);
  };

  // Function to handle new field input changes (name, type, value)
  const handleNewFieldInputChange = (event) => {
    const { name, value } = event.target;
    setNewFieldInput({ ...newFieldInput, [name]: value });
  };

  // Function to handle new field value changes after adding them
  const handleNewFieldValueChange = (id, event) => {
    const { value } = event.target;
    const updatedNewFields = newFields.map(field =>
      field.id === id ? { ...field, value } : field
    );
    setNewFields(updatedNewFields);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {};

    // Add existing fields to formData
    fields.forEach(field => {
      if (field.type === 'number') {
        formData[field.name] = Number(field.value);
      } else if (field.type === 'boolean') {
        formData[field.name] = field.value.toLowerCase() === 'true';
      } else {
        formData[field.name] = field.value;
      }
    });

    // Add new fields to formData (optional values)
    newFields.forEach(field => {
      if (field.value) {
        if (field.type === 'number') {
          formData[field.name] = Number(field.value);
        } else if (field.type === 'boolean') {
          formData[field.name] = field.value.toLowerCase() === 'true';
        } else {
          formData[field.name] = field.value;
        }
      }
    });

    try {
      const response = await axios.post('http://higherindia.net:3006/submit', { formData, newFields });
      setFeedback('Form submitted successfully!');
      setFields([...fields, ...newFields]); // Update the fields state to include newly added fields
      setNewFields([]); // Reset new fields after submission
    } catch (error) {
      setFeedback('Error submitting form!');
    }
  };

  return (
    <div className="container">
      <h2>Dynamic Form</h2>

      <form onSubmit={handleSubmit} className="form">
        {/* Existing Fields */}
        {fields.map((field) => (
          <div key={field.id} className="field">
            <label>{field.name}:</label>
            <input
              type={field.type === 'number' ? 'number' : field.type === 'boolean' ? 'text' : 'text'}
              name="value"
              value={field.value}
              onChange={(e) => handleFieldChange(field.id, e)}
              className="input-field"
              placeholder={'Enter ${field.name}'}
              required // Existing fields are mandatory
            />
          </div>
        ))}

        {/* New Fields Section */}
        {newFields.length > 0 && (
          <div className="new-fields-list">
            <h3>New Fields</h3>
            {newFields.map((field) => (
              <div key={field.id} className="field">
                <label>{field.name}:</label>
                <input
                  type={field.type === 'number' ? 'number' : field.type === 'boolean' ? 'text' : 'text'}
                  name="value"
                  value={field.value || ''}
                  onChange={(e) => handleNewFieldValueChange(field.id, e)}
                  className="input-field"
                  placeholder={'Enter ${field.name}'}
                />
                <button type="button" className="btn delete-field" onClick={() => handleDeleteField(field.id)}>
                  Delete Field
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Field Section */}
        <div className="new-field-container">
          <h3>Add New Fields</h3>
          <input
            type="text"
            name="name"
            value={newFieldInput.name}
            onChange={handleNewFieldInputChange}
            className="input-field"
            placeholder="Field Name"
            required
          />
          <select
            name="type"
            value={newFieldInput.type}
            onChange={handleNewFieldInputChange}
            className="input-field"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
          </select>
          {/* New Field Value Input */}
          <input
            type="text"
            name="value"
            value={newFieldInput.value}
            onChange={handleNewFieldInputChange}
            className="input-field"
            placeholder="Field Value (optional)"
          />
        </div>

        <div className="button-container">
          <button type="button" className="btn add-field" onClick={handleAddField}>
            Add Field
          </button>

          <button type="submit" className="btn submit-form">
            Submit Form
          </button>
        </div>
      </form>

      {/* Feedback Message */}
      <div id="feedback" className="feedback">
        {feedback}
      </div>
    </div>
  );
};

export default DynamicForm;
