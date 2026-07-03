"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationData = exports.getPaginationOptions = void 0;
const getPaginationOptions = (query) => {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc';
    return {
        page: page > 0 ? page : 1,
        limit: limit > 0 ? limit : 10,
        sortBy,
        sortOrder
    };
};
exports.getPaginationOptions = getPaginationOptions;
const getPaginationData = (totalRecords, page, limit) => {
    return {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        limit
    };
};
exports.getPaginationData = getPaginationData;
