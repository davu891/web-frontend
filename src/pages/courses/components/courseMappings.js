// src/utils/courseMappings.js

export const titleMappings = {
    N5: 'abc',
    N4: 'def',
    N3: 'ghi',
    N2: 'jkl',
};

export const unitMappings = {
    1: '0001',
    2: '0002',
    3: '0003',
    // Add more unit mappings as necessary
};

export const getTitleFromCode = (code) => {
    return Object.keys(titleMappings).find(key => titleMappings[key] === code);
};

export const getUnitFromCode = (code) => {
    return Object.keys(unitMappings).find(key => unitMappings[key] === code);
};
