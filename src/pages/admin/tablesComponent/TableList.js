import React from 'react';

const TableList = ({ tables, fetchTableDetails, downloadTemplate, setSelectedTable, setCurrentView, handleDeleteTable, indexOfFirstTable, tableDataStatus }) => (
    <ul>
        {tables.map((table, index) => (
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
                <button className="details-button" onClick={() => { setSelectedTable({ tableName: table }); setCurrentView('upload'); }}>Upload</button>
                <button className="delete-button" onClick={() => handleDeleteTable(table)}>Xóa csdl</button>
            </li>
        ))}
    </ul>
);

export default TableList;
