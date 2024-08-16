import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Tables.css';

const Tables = () => {
    const [currentView, setCurrentView] = useState('default'); // 'default', 'create', 'details', 'upload', 'manualCreate'
    const [tableType, setTableType] = useState('vocab');
    const [level, setLevel] = useState('N5');
    const [tableName, setTableName] = useState('');
    const [manualTableName, setManualTableName] = useState('');
    const [manualFields, setManualFields] = useState([{ fieldName: '', dataType: 'VARCHAR(255)' }]);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [tablesPerPage] = useState(5); // Số bảng trên mỗi trang
    const [searchTerm, setSearchTerm] = useState('');
    const [dbInfo, setDbInfo] = useState({ dbName: '', tableCount: 0 });
    const [tableDataStatus, setTableDataStatus] = useState({});
    const [detailsPage, setDetailsPage] = useState(1);
    const [detailsPerPage] = useState(10); // Số hàng chi tiết trên mỗi trang
    const [detailSearchTerm, setDetailSearchTerm] = useState('');

    useEffect(() => {
        fetchTables();
        fetchDbInfo();
    }, []);

    useEffect(() => {
        updateTableName();
    }, [tableType, level]);

    const updateTableName = () => {
        let prefix = '';
        switch (tableType) {
            case 'vocab':
                prefix = 'TV';
                break;
            case 'gramm':
                prefix = 'NP';
                break;
            case 'kanji':
                prefix = 'KJ';
                break;
            case 'minitest':
                prefix = 'MT';
                break;
            default:
                prefix = '';
        }
        setTableName(`${prefix}_${level}`);
    };

    const handleCreateTable = async (e) => {
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
                await axios.post('http://localhost:5000/api/create-table', { tableType, level, tableName });
                Swal.fire({
                    title: 'Success',
                    text: 'Table created successfully. Do you want to create another table?',
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTableType('vocab');
                        setLevel('N5');
                        setTableName('');
                    }
                    setTables(prevTables => [tableName, ...prevTables]); // Thêm bảng mới lên đầu danh sách
                    setCurrentView('default');
                });
            } catch (error) {
                Swal.fire('Error', 'An error occurred while creating the table.', 'error');
            }
        }
    };

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
                    setTables(prevTables => [manualTableName, ...prevTables]); // Thêm bảng mới lên đầu danh sách
                    setManualTableName('');
                    setManualFields([{ fieldName: '', dataType: 'VARCHAR(255)' }]);
                    setCurrentView('default');
                });
            } catch (error) {
                Swal.fire('Error', 'An error occurred while creating the table.', 'error');
            }
        }
    };

    const handleDeleteTable = async (tableName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete the table "${tableName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/delete-table/${tableName}`);
                Swal.fire('Deleted!', `The table "${tableName}" has been deleted.`, 'success');
                setTables(prevTables => prevTables.filter(table => table !== tableName)); // Xóa bảng khỏi danh sách
                fetchTables();
            } catch (error) {
                Swal.fire('Error', 'An error occurred while deleting the table.', 'error');
            }
        }
    };
    const handleInsertRow = async (tableName) => {
        const htmlContent = selectedTable.columns.map((column, index) => {
            if (column === 'id') {
                return '';
            } else {
                return `<div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <label for="swal-input${index}" style="width: 30%; text-align: left;">${column}</label>
                            <input id="swal-input${index}" class="swal2-input" style="width: 70%;" value="">
                        </div>`;
            }
        }).join('');
    
        const { value: formValues } = await Swal.fire({
            title: 'Insert Row',
            html: htmlContent,
            focusConfirm: false,
            preConfirm: () => {
                const newRow = {};
                selectedTable.columns.forEach((column, index) => {
                    if (column !== 'id') {
                        newRow[column] = document.getElementById(`swal-input${index}`).value || null;
                    }
                });
                return newRow;
            }
        });
    
        if (formValues) {
            try {
                await axios.post(`http://localhost:5000/api/tables/${tableName}/rows`, formValues);
                Swal.fire('Success', 'Row inserted successfully.', 'success');
                fetchTableDetails(tableName); // Refresh table details
            } catch (error) {
                Swal.fire('Error', 'An error occurred while inserting the row.', 'error');
            }
        }
    };
    
    const handleEditRow = async (tableName, row) => {
        const htmlContent = selectedTable.columns.map((column, index) => {
            if (column === 'id') {
                return `<div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <label for="swal-input${index}" style="width: 30%; text-align: left;">${column}</label>
                            <input id="swal-input${index}" class="swal2-input" style="width: 70%;" value="${row[column]}" readonly>
                        </div>`;
            } else {
                return `<div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <label for="swal-input${index}" style="width: 30%; text-align: left;">${column}</label>
                            <input id="swal-input${index}" class="swal2-input" style="width: 70%;" value="${row[column] || ''}">
                        </div>`;
            }
        }).join('');
    
        const { value: formValues } = await Swal.fire({
            title: 'Edit Row',
            html: htmlContent,
            focusConfirm: false,
            preConfirm: () => {
                const updatedRow = {};
                selectedTable.columns.forEach((column, index) => {
                    updatedRow[column] = document.getElementById(`swal-input${index}`).value || null;
                });
                return updatedRow;
            }
        });
    
        if (formValues) {
            try {
                await axios.put(`http://localhost:5000/api/tables/${tableName}/rows/${row.id}`, formValues);
                Swal.fire('Success', 'Row updated successfully.', 'success');
                fetchTableDetails(tableName); // Refresh table details
            } catch (error) {
                Swal.fire('Error', 'An error occurred while updating the row.', 'error');
            }
        }
    };
    
    
    const handleDeleteRow = async (tableName, rowId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete this row?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/tables/${tableName}/rows/${rowId}`);
                Swal.fire('Deleted!', `The row has been deleted.`, 'success');
                fetchTableDetails(tableName); // Refresh table details
            } catch (error) {
                Swal.fire('Error', 'An error occurred while deleting the row.', 'error');
            }
        }
    };

    const fetchTables = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tables');
            setTables(response.data);
            fetchTableDataStatus(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleInsertColumn = async (tableName) => {
        const { value: formValues } = await Swal.fire({
            title: 'Insert Column',
            html: `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="column-name" style="width: 30%; text-align: left;">Column Name</label>
                    <input id="column-name" class="swal2-input" style="width: 70%;">
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="data-type" style="width: 30%; text-align: left;">Data Type</label>
                    <select id="data-type" class="swal2-input" style="width: 70%;">
                        <option value="VARCHAR(255)">VARCHAR(255)</option>
                        <option value="INT">INT</option>
                        <option value="TEXT">TEXT</option>
                        <option value="DATE">DATE</option>
                        <option value="BOOLEAN">BOOLEAN</option>
                    </select>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="after-column" style="width: 30%; text-align: left;">Insert After</label>
                    <select id="after-column" class="swal2-input" style="width: 70%;">
                        ${selectedTable.columns.map(column => `<option value="${column}">${column}</option>`).join('')}
                    </select>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    columnName: document.getElementById('column-name').value,
                    dataType: document.getElementById('data-type').value,
                    afterColumn: document.getElementById('after-column').value
                };
            }
        });
    
        if (formValues) {
            try {
                await axios.post(`http://localhost:5000/api/tables/${tableName}/columns`, formValues);
                Swal.fire('Success', 'Column inserted successfully.', 'success');
                fetchTableDetails(tableName); // Refresh table details
            } catch (error) {
                Swal.fire('Error', 'An error occurred while inserting the column.', 'error');
            }
        }
    };

    const handleDeleteColumn = async (tableName) => {
        const { value: formValues } = await Swal.fire({
            title: 'Delete Column',
            html: `
                <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <label for="column-name" style="width: 30%; text-align: left;">Column Name</label>
                    <select id="column-name" class="swal2-input" style="width: 70%;">
                        ${selectedTable.columns.filter(column => column !== 'id').map(column => `<option value="${column}">${column}</option>`).join('')}
                    </select>
                </div>
            `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    columnName: document.getElementById('column-name').value
                };
            }
        });
    
        if (formValues) {
            try {
                await axios.delete(`http://localhost:5000/api/tables/${tableName}/columns/${formValues.columnName}`);
                Swal.fire('Success', 'Column deleted successfully.', 'success');
                fetchTableDetails(tableName); // Refresh table details
            } catch (error) {
                Swal.fire('Error', 'An error occurred while deleting the column.', 'error');
            }
        }
    };
    
    const fetchDbInfo = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/db-info');
            setDbInfo(response.data);
        } catch (error) {
            console.error('Error fetching database info:', error);
        }
    };

    const fetchTableDataStatus = async (tables) => {
        try {
            const status = {};
            for (const table of tables) {
                const response = await axios.get(`http://localhost:5000/api/table-data-status/${table}`);
                status[table] = response.data.hasData;
            }
            setTableDataStatus(status);
        } catch (error) {
            console.error('Error fetching table data status:', error);
        }
    };

    const fetchTableDetails = async (tableName) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/tables/${tableName}`);
            const tableData = response.data;
    
            if (tableData.data.length === 0) {
                Swal.fire({
                    title: 'Thông báo',
                    text: 'Bảng chưa có dữ liệu, vui lòng Insert.',
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            } else {
                setSelectedTable({
                    tableName: tableData.tableName,
                    columns: tableData.columns,
                    data: tableData.data
                });
                setCurrentView('details');
                setDetailsPage(1); // Reset to first page of details view
            }
        } catch (error) {
            console.error('Error fetching table details:', error);
        }
    };
    

    const downloadTemplate = async (tableName) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/download-template/${tableName}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${tableName}_template.xlsx`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading template:', error);
        }
    };

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0]);
    };

const handleFileUpload = async () => {
    if (!uploadFile || !selectedTable) {
        Swal.fire('Error', 'No file selected or table not selected.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('tableName', selectedTable.tableName);

    try {
        await axios.post('http://localhost:5000/api/upload-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        Swal.fire('Success', 'File uploaded and data imported successfully.', 'success');
        setCurrentView('default');
        fetchTables();
    } catch (error) {
        console.error('Error uploading file:', error);
        Swal.fire('Error', `An error occurred while uploading the file: ${error.message}`, 'error');
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

    // Logic for displaying tables
    const indexOfLastTable = currentPage * tablesPerPage;
    const indexOfFirstTable = indexOfLastTable - tablesPerPage;
    const filteredTables = tables.filter(table => table.toLowerCase().includes(searchTerm.toLowerCase()));
    const currentTables = filteredTables.slice(indexOfFirstTable, indexOfLastTable);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTables.length / tablesPerPage)));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const paginationItems = [];
    for (let number = currentPage - 2; number <= currentPage + 2; number++) {
        if (number > 0 && number <= Math.ceil(filteredTables.length / tablesPerPage)) {
            paginationItems.push(
                <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                    {number}
                </button>
            );
        }
    }

    // Logic for displaying table details with pagination
    const indexOfLastDetail = detailsPage * detailsPerPage;
    const indexOfFirstDetail = indexOfLastDetail - detailsPerPage;
    const currentDetails = selectedTable ? selectedTable.data.filter(row => {
        return selectedTable.columns.some(column => row[column] && row[column].toString().toLowerCase().includes(detailSearchTerm.toLowerCase()));
    }).slice(indexOfFirstDetail, indexOfLastDetail) : [];

    const detailsPaginate = (pageNumber) => setDetailsPage(pageNumber);
    const detailsNextPage = () => setDetailsPage(prev => Math.min(prev + 1, Math.ceil((selectedTable ? selectedTable.data.length : 0) / detailsPerPage)));
    const detailsPrevPage = () => setDetailsPage(prev => Math.max(prev - 1, 1));

    const detailsPaginationItems = [];
    for (let number = detailsPage - 2; number <= detailsPage + 2; number++) {
        if (number > 0 && selectedTable && number <= Math.ceil(selectedTable.data.length / detailsPerPage)) {
            detailsPaginationItems.push(
                <button key={number} onClick={() => detailsPaginate(number)} className={detailsPage === number ? 'active' : ''}>
                    {number}
                </button>
            );
        }
    }

    return (
        <div className="tables-container">
            {currentView === 'default' && (
                <>
                    <div className="top-bar">
                        <button className="create-table-button" onClick={() => setCurrentView('create')}>
                            <i className="fa fa-plus"></i> Tạo bảng cơ sở dữ liệu
                        </button>
                        <button className="create-table-button" onClick={() => setCurrentView('manualCreate')}>
                            <i className="fa fa-plus"></i> Tạo csdl manual
                        </button>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm kiếm bảng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="db-info">
                        <p>Tên cơ sở dữ liệu: <strong>{dbInfo.dbName}</strong></p>
                        <p>Số lượng bảng: <strong>{dbInfo.tableCount}</strong></p>
                    </div>
                    <div className="existing-tables">
                        <h3>Existing Tables</h3>
                        <ul>
                            {currentTables.map((table, index) => (
                                <li key={index} className="table-item">
                                    <span className="table-index">
                                        <span
                                            className={`status-dot ${tableDataStatus[table] ? 'has-data' : 'no-data'}`}
                                        ></span>
                                        {indexOfFirstTable + index + 1}.
                                    </span>
                                    <span className="table-name">{table}</span>
                                    <button className="details-button" onClick={() => fetchTableDetails(table)}>Chi tiết</button>
                                    <button className="details-button" onClick={() => downloadTemplate(table)}>Download Template</button>
                                    <button className="details-button" onClick={() => {
    setSelectedTable({ tableName: table, columns: [], data: [] }); // Thiết lập selectedTable với tên bảng
    setCurrentView('upload');
}}>Upload</button>

                                    <button className="delete-button" onClick={() => handleDeleteTable(table)}>Xóa csdl</button>
                                </li>
                            ))}
                        </ul>
                        <div className="pagination">
                            <button onClick={prevPage} disabled={currentPage === 1}>Back</button>
                            {paginationItems}
                            <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredTables.length / tablesPerPage)}>Next</button>
                        </div>
                    </div>
                </>
            )}

            {currentView === 'create' && (
                <div className="manage-tables-container">
                    <button className="close-form-button" onClick={() => setCurrentView('default')}>X</button>
                    <h2>Manage Tables</h2>
                    <form onSubmit={handleCreateTable}>
                        <div className="form-group">
                            <label>Table Type:</label>
                            <select value={tableType} onChange={(e) => setTableType(e.target.value)}>
                                <option value="vocab">Từ vựng </option>
                                <option value="gramm">Ngữ pháp </option>
                                <option value="kanji">Kanji</option>
                                <option value="minitest">minitest</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Level:</label>
                            <select value={level} onChange={(e) => setLevel(e.target.value)}>
                                <option value="N5">N5</option>
                                <option value="N4">N4</option>
                                <option value="N3">N3</option>
                                <option value="N2">N2</option>
                                <option value="N1">N1</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Table Name:</label>
                            <input type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} required />
                        </div>
                        <button type="submit">Create Table</button>
                    </form>
                </div>
            )}

            {currentView === 'manualCreate' && (
                <div className="manual-create-container">
                    <button className="close-form-button" onClick={() => setCurrentView('default')}><i className="fas fa-times"></i></button>
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
                        <button type="button" className="details-button" onClick={handleAddField}>Add Field</button>
                        <button type="submit" className="details-button">Create Table</button>
                    </form>
                </div>
            )}

{currentView === 'upload' && selectedTable && (
    <div className="upload-modal">
        <div className="modal-content">
            <h2>Import Excel for "{selectedTable.tableName}"</h2>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            <button onClick={() => setCurrentView('default')}>Cancel</button>
        </div>
    </div>
)}

{currentView === 'details' && selectedTable && (
                <div className="table-details">
                    <div className="table-details-header">
                        <h3>Table Details: {selectedTable.tableName}</h3>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm kiếm..."
                            value={detailSearchTerm}
                            onChange={(e) => setDetailSearchTerm(e.target.value)}
                        />
                        <button className="details-button" onClick={() => handleInsertRow(selectedTable.tableName)}>Insert Row</button>
                        <button className="details-button" onClick={() => handleInsertColumn(selectedTable.tableName)}>Insert Column</button>
                        <button className="details-button" onClick={() => handleDeleteColumn(selectedTable.tableName)}>Delete Column</button>
                        <button className="hide-details-button" onClick={() => setCurrentView('default')}>Ẩn nội dung</button>
                    </div>
                    <div className="table-details-content">
                        <table>
                            <thead>
                                <tr>
                                    {selectedTable.columns.map((column, index) => (
                                        <th key={index}>{column}</th>
                                    ))}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDetails.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {selectedTable.columns.map((column, cellIndex) => (
                                            <td key={cellIndex}>{row[column]}</td>
                                        ))}
                                        <td>
                                            <button className="edit-button" onClick={() => handleEditRow(selectedTable.tableName, row)}>Edit</button>
                                            <button className="delete-button" onClick={() => handleDeleteRow(selectedTable.tableName, row.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button onClick={detailsPrevPage} disabled={detailsPage === 1}>Back</button>
                            {detailsPaginationItems}
                            <button onClick={detailsNextPage} disabled={detailsPage === Math.ceil(selectedTable.data.length / detailsPerPage)}>Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tables;
