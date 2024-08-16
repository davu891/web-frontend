import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ManualCreateTable = ({ setCurrentView, fetchTables }) => {
    const [manualTableName, setManualTableName] = useState('');
    const [manualFields, setManualFields] = useState([{ fieldName: '', dataType: 'VARCHAR(255)' }]);

    const handleManualCreateTable = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to create this table?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, create it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.post('http://localhost:5000/api/create-table-manual', { tableName: manualTableName, fields: manualFields });
                Swal.fire({
                    title: 'Success',
                    text: 'Table created successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    setManualTableName('');
                    setManualFields([{ fieldName: '', dataType: 'VARCHAR(255)' }]);
                    setCurrentView('default');
                    fetchTables();
                });
            } catch (error) {
                Swal.fire('Error', 'An error occurred while creating the table.', 'error');
            }
        }
    };

    const handleAddField = () => {
        setManualFields([...manualFields, { fieldName: '', dataType: 'VARCHAR(255)' }]);
    };

    const handleRemoveField = (index) => {
        const newFields = manualFields.slice();
        newFields.splice(index, 1);
        setManualFields(newFields);
    };

    const handleFieldChange = (index, field, value) => {
        const newFields = manualFields.slice();
        newFields[index][field] = value;
        setManualFields(newFields);
    };

    return (
        <div className="manual-create-container">
            <button className="close-form-button" onClick={() => setCurrentView('default')}>X</button>
            <h2>Create Table Manually</h2>
            <form onSubmit={handleManualCreateTable}>
                <div className="form-group">
                    <label>Table Name:</label>
                    <input
                        type="text"
                        value={manualTableName}
                        onChange={(e) => setManualTableName(e.target.value)}
                        required
                    />
                </div>
                {manualFields.map((field, index) => (
                    <div className="form-group" key={index}>
                        <input
                            type="text"
                            placeholder="Field Name"
                            value={field.fieldName}
                            onChange={(e) => handleFieldChange(index, 'fieldName', e.target.value)}
                            required
                        />
                        <select
                            value={field.dataType}
                            onChange={(e) => handleFieldChange(index, 'dataType', e.target.value)}
                        >
                            <option value="VARCHAR(255)">VARCHAR(255)</option>
                            <option value="INT">INT</option>
                            <option value="TEXT">TEXT</option>
                            <option value="DATE">DATE</option>
                            <option value="BOOLEAN">BOOLEAN</option>
                        </select>
                        <button type="button" onClick={() => handleRemoveField(index)}>Remove</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddField}>Add Field</button>
                <button type="submit">Create Table</button>
            </form>
        </div>
    );
};

export default ManualCreateTable;
