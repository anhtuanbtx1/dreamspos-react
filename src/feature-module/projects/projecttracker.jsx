import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Progress, Tag, Avatar, Button, DatePicker, Select, Spin } from 'antd';
import {
  Star,
  Edit,
  Trash2,
  Plus
} from 'feather-icons-react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectTracker = () => {
  // Get theme from Redux
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterManager, setFilterManager] = useState('All Managers');
  const [filterPriority, setFilterPriority] = useState('All Priority');
  const [sortBy, setSortBy] = useState('Last 7 Days');
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, 'day'),
    dayjs()
  ]);

  // API data state
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Load projects from API
  const loadProjects = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
      console.log('Loading projects from:', `${apiBaseUrl}Projects`);

      const response = await fetch(`${apiBaseUrl}Projects?page=${page}&pageSize=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (result.data) {
        // Map API data to table format
        const mappedData = result.data.map(project => ({
          key: project.id.toString(),
          id: project.id,
          projectName: project.projectName,
          category: [project.categoryName],
          categoryColor: getCategoryColor(project.categoryName),
          manager: [
            { name: project.createdByName, avatar: 'assets/img/profiles/avatar-01.jpg' }
          ],
          startDate: dayjs(project.startDate).format('DD MMM YYYY'),
          progress: project.progressPercentage,
          deadline: dayjs(project.endDate).format('DD MMM YYYY'),
          status: formatStatus(project.status),
          statusColor: getStatusColor(project.status),
          priority: project.priority,
          starred: false,
          budget: `$${project.budget.toLocaleString()}`,
          client: project.clientName
        }));

        setProjectData(mappedData);

        // Update pagination state
        if (result.pagination) {
          setCurrentPage(result.pagination.currentPage);
          setTotalCount(result.pagination.totalCount);
          setTotalPages(result.pagination.totalPages);
        } else {
          setTotalCount(result.data.length);
          setTotalPages(Math.ceil(result.data.length / size));
        }

        console.log('Mapped data:', mappedData);
      } else {
        console.warn('No data found in API response');
        setProjectData([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Set empty data on error
      setProjectData([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for mapping
  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'Web Development': 'blue',
      'Mobile App': 'green',
      'Design': 'purple',
      'Marketing': 'orange',
      'DevOps': 'cyan',
      'Data Science': 'red',
      'Security': 'red',
      'AI/ML': 'red'
    };
    return colorMap[categoryName] || 'blue';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'planning': 'default',
      'in-progress': 'warning',
      'review': 'processing',
      'completed': 'success',
      'on-hold': 'error'
    };
    return colorMap[status] || 'default';
  };

  const formatStatus = (status) => {
    const statusMap = {
      'planning': 'Planning',
      'in-progress': 'In Progress',
      'review': 'Review',
      'completed': 'Completed',
      'on-hold': 'On Hold'
    };
    return statusMap[status] || status;
  };

  // Load data on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadProjects(page, pageSize);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    loadProjects(1, newPageSize);
  };

  // Handle table change (for Ant Design Table)
  const handleTableChange = (paginationInfo) => {
    if (paginationInfo.current !== currentPage) {
      handlePageChange(paginationInfo.current);
    }
    if (paginationInfo.pageSize !== pageSize) {
      handlePageSizeChange(paginationInfo.pageSize);
    }
  };

  // Calculate pagination info
  const startRecord = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  // Table columns configuration
  const columns = [
    {
      title: '',
      dataIndex: 'starred',
      width: 50,
      render: (starred) => (
        <Star
          size={16}
          fill={starred ? '#ffc107' : 'none'}
          color={starred ? '#ffc107' : '#6c757d'}
          style={{ cursor: 'pointer' }}
        />
      )
    },
    {
      title: 'Mức độ',
      dataIndex: 'priority',
      width: 30,
      render: (priority) => (
        <div
          style={{
            width: '50px',
            height: '40px',
            backgroundColor: priority === 'high' ? '#dc3545' : priority === 'medium' ? '#ffc107' : '#28a745',
            borderRadius: '2px'
          }}
        />
      )
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text) => (
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{text}</span>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      width: 100,
      key: 'category',
      render: (category, record) => (
        <Tag color={record.categoryColor} style={{ borderRadius: '12px', fontSize: '12px' }}>
          {category[0]}
        </Tag>
      )
    },
    {
      title: 'Project Manager',
      dataIndex: 'manager',
      key: 'manager',
      render: (managers) => (
        <Avatar.Group maxCount={2} size="small">
          {managers.map((manager, index) => (
            <Avatar
              key={index}
              size={24}
              src={manager.avatar}
              alt={manager.name}
            />
          ))}
        </Avatar.Group>
      )
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => (
        <span style={{ fontSize: '13px' }}>{date}</span>
      )
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div style={{ width: '120px' }}>
          <Progress
            percent={progress}
            size="small"
            strokeColor={progress === 100 ? '#28a745' : progress > 70 ? '#17a2b8' : progress > 40 ? '#ffc107' : '#dc3545'}
            showInfo={false}
          />
          <span style={{ fontSize: '12px', marginLeft: '8px' }}>
            Progress: {progress}%
          </span>
        </div>
      )
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date) => (
        <span style={{ fontSize: '13px' }}>{date}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Tag
          color={record.statusColor}
          style={{
            borderRadius: '12px',
            fontSize: '12px',
            border: 'none',
            padding: '4px 12px'
          }}
        >
          {status}
        </Tag>
      )
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget) => (
        <span style={{ color: '#28a745', fontSize: '13px', fontWeight: '500' }}>{budget}</span>
      )
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: () => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Edit size={16} style={{ cursor: 'pointer' }} />
            <Trash2 size={16} style={{ cursor: 'pointer' }} />
          </div>
        </div>
      )
    }
  ];

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record) => ({
      name: record.projectName,
    }),
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Project Tracker</h4>
              <h6>Manage Your Projects</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/create-project">
              <Button
                type="primary"
                icon={<Plus size={16} />}
                className="btn btn-added"
              >
                Create New Project
              </Button>
            </Link>
          </div>
        </div>

        {/* Project Lists */}
        <div className="card table-list-card">
          <div className="card-body pb-0">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>
                    Project Lists
                  </span>
                  <span className="badge badge-primary ms-2">Active Projects</span>
                </div>
              </div>
              <div className="search-path">
                <div className="d-flex align-items-center gap-3">
                  <RangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder={['Start Date', 'End Date']}
                    className="project-date-picker"
                    format="DD/MM/YYYY"
                    allowClear={false}
                    style={{
                      height: '42px',
                      width: '280px'
                    }}
                  />

                  <Select
                    value={filterPriority}
                    onChange={setFilterPriority}
                    className="project-filter-select"
                    style={{ width: 120, height: 42 }}
                  >
                    <Option value="All Priority">Priority</Option>
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                  </Select>

                  <Select
                    value={filterManager}
                    onChange={setFilterManager}
                    className="project-filter-select"
                    style={{ width: 140, height: 42 }}
                  >
                    <Option value="All Managers">Manager</Option>
                    <Option value="John Smith">John Smith</Option>
                    <Option value="Sarah Johnson">Sarah Johnson</Option>
                    <Option value="Mike Wilson">Mike Wilson</Option>
                  </Select>

                  <Select
                    value={filterStatus}
                    onChange={setFilterStatus}
                    className="project-filter-select"
                    style={{ width: 140, height: 42 }}
                  >
                    <Option value="All Status">Select Status</Option>
                    <Option value="Planning">Planning</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Review">Review</Option>
                    <Option value="Completed">Completed</Option>
                  </Select>

                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    className="project-filter-select"
                    style={{ width: 140, height: 42 }}
                  >
                    <Option value="Last 7 Days">Sort By: Last 7 Days</Option>
                    <Option value="Last 30 Days">Last 30 Days</Option>
                    <Option value="This Month">This Month</Option>
                    <Option value="Deadline">By Deadline</Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <style>
              {`
                /* Hide default Ant Design pagination */
                .ant-pagination-total-text,
                .ant-table-wrapper .ant-pagination,
                .ant-spin-container .ant-pagination {
                  display: none !important;
                  visibility: hidden !important;
                  opacity: 0 !important;
                  position: absolute !important;
                  left: -9999px !important;
                  top: -9999px !important;
                  z-index: -1 !important;
                  width: 0 !important;
                  height: 0 !important;
                  overflow: hidden !important;
                }

                /* Ensure our custom pagination is visible */
                .custom-pagination-container {
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                  position: relative !important;
                  z-index: 1 !important;
                }

                /* Light mode pagination styling */
                .custom-pagination-container.light-mode {
                  background: linear-gradient(135deg, #ffffff, #f8f9fa) !important;
                  border: 1px solid rgba(0, 0, 0, 0.1) !important;
                  border-radius: 12px !important;
                  padding: 16px 20px !important;
                  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
                  margin-top: 20px !important;
                }

                /* Light mode text styling */
                .custom-pagination-container.light-mode .pagination-info {
                  color: #2c3e50 !important;
                  font-weight: 500 !important;
                }

                /* Light mode select styling */
                .custom-pagination-container.light-mode select {
                  background: #ffffff !important;
                  border: 1px solid #dee2e6 !important;
                  color: #495057 !important;
                  border-radius: 6px !important;
                }

                .custom-pagination-container.light-mode select:focus {
                  border-color: #80bdff !important;
                  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
                }

                /* Light mode pagination buttons */
                .custom-pagination-container.light-mode button {
                  background: linear-gradient(135deg, #ffffff, #f8f9fa) !important;
                  border: 1px solid #dee2e6 !important;
                  color: #495057 !important;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
                }

                .custom-pagination-container.light-mode button:hover {
                  background: linear-gradient(135deg, #e9ecef, #f8f9fa) !important;
                  border-color: #adb5bd !important;
                  transform: translateY(-1px) !important;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15) !important;
                }

                .custom-pagination-container.light-mode button.active {
                  background: linear-gradient(135deg, #007bff, #0056b3) !important;
                  border-color: #007bff !important;
                  color: #ffffff !important;
                  box-shadow: 0 3px 8px rgba(0, 123, 255, 0.3) !important;
                }

                .custom-pagination-container.light-mode button:disabled {
                  background: #f8f9fa !important;
                  border-color: #dee2e6 !important;
                  color: #6c757d !important;
                  opacity: 0.6 !important;
                  cursor: not-allowed !important;
                }
              `}
            </style>

            <Spin spinning={loading}>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={projectData}
                loading={loading}
                onChange={handleTableChange}
                pagination={false}
              />
            </Spin>
          </div>

          {/* Custom Pagination */}
          <div
            className={`custom-pagination-container ${isDarkMode ? '' : 'light-mode'}`}
            style={{
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              border: '1px solid rgba(52, 152, 219, 0.3)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(52, 152, 219, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              padding: '16px 24px',
              margin: '16px 0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(52, 152, 219, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(52, 152, 219, 0.1)';
            }}
          >
            {/* Pagination Info */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <span className="pagination-info" style={{color: '#bdc3c7', fontSize: '14px'}}>Row Per Page</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newPageSize = parseInt(e.target.value);
                    handlePageSizeChange(newPageSize);
                  }}
                  disabled={loading}
                  style={{
                    background: loading
                      ? 'linear-gradient(45deg, #7f8c8d, #95a5a6)'
                      : 'linear-gradient(45deg, #34495e, #2c3e50)',
                    border: '1px solid rgba(52, 152, 219, 0.3)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    padding: '4px 8px',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  <option value={10} style={{background: '#2c3e50', color: '#ffffff'}}>10</option>
                  <option value={20} style={{background: '#2c3e50', color: '#ffffff'}}>20</option>
                  <option value={50} style={{background: '#2c3e50', color: '#ffffff'}}>50</option>
                  <option value={100} style={{background: '#2c3e50', color: '#ffffff'}}>100</option>
                </select>
                <span className="pagination-info" style={{color: '#bdc3c7', fontSize: '14px'}}>Entries</span>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div
                  style={{
                    background: 'linear-gradient(45deg, #3498db, #2ecc71)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)'
                  }}
                >
                  📊
                </div>
                <span className="pagination-info" style={{color: '#bdc3c7', fontSize: '14px'}}>
                  Showing <strong style={{color: '#3498db'}}>{startRecord}</strong> to <strong style={{color: '#3498db'}}>{endRecord}</strong> of <strong style={{color: '#e74c3c'}}>{totalCount}</strong> entries
                </span>
              </div>
            </div>

            {/* Pagination Buttons */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {/* Numbered Pagination Buttons */}
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === pageNum;

                return (
                  <button
                    key={pageNum}
                    onClick={() => !loading && handlePageChange(pageNum)}
                    disabled={loading}
                    className={isActive ? 'active' : ''}
                    style={{
                      background: loading
                        ? 'linear-gradient(45deg, #7f8c8d, #95a5a6)'
                        : isActive
                        ? 'linear-gradient(45deg, #f39c12, #e67e22)'
                        : 'linear-gradient(45deg, #34495e, #2c3e50)',
                      border: isActive
                        ? '2px solid #f39c12'
                        : '1px solid rgba(52, 152, 219, 0.3)',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: loading
                        ? 'none'
                        : isActive
                        ? '0 4px 12px rgba(243, 156, 18, 0.4)'
                        : '0 2px 8px rgba(52, 73, 94, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && !isActive) {
                        e.target.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading && !isActive) {
                        e.target.style.background = 'linear-gradient(45deg, #34495e, #2c3e50)';
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 8px rgba(52, 73, 94, 0.3)';
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProjectTracker;
