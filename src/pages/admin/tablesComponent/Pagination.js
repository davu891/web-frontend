import React from 'react';

const Pagination = ({ currentPage, totalPages, paginate, nextPage, prevPage }) => {
    const paginationItems = [];
    for (let number = currentPage - 2; number <= currentPage + 2; number++) {
        if (number > 0 && number <= totalPages) {
            paginationItems.push(
                <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                    {number}
                </button>
            );
        }
    }

    return (
        <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>Back</button>
            {paginationItems}
            <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
    );
};

export default Pagination;
