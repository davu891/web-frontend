import { useState, useEffect } from 'react';
import axios from 'axios';

const useTables = () => {
    const [tables, setTables] = useState([]);
    const [tableDataStatus, setTableDataStatus] = useState({});
    const [dbInfo, setDbInfo] = useState({ dbName: '', tableCount: 0 });

    useEffect(() => {
        fetchTables();
        fetchDbInfo();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tables');
            setTables(response.data);
            fetchTableDataStatus(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
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

    return { tables, tableDataStatus, dbInfo, fetchTables, setTables };
};

export default useTables;
