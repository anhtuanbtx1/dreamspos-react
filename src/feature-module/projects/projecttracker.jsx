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
import CustomPagination from '../../components/CustomPagination';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectTracker = () => {

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
          statusConfig: getStatusConfig(project.status),
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

  const getStatusConfig = (status) => {
    const statusLower = (status || 'planning').toLowerCase().replace(/\s+/g, '').replace(/-/g, '');

    const statusConfigs = {
      'planning': {
        color: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderColor: '#1890ff',
        textColor: '#1890ff',
        icon: '📋'
      },
      'completed': {
        color: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        borderColor: '#52c41a',
        textColor: '#52c41a',
        icon: '✅'
      },
      'pending': {
        color: '#faad14',
        backgroundColor: 'rgba(250, 173, 20, 0.1)',
        borderColor: '#faad14',
        textColor: '#faad14',
        icon: '⏳'
      },
      'inprogress': {
        color: '#722ed1',
        backgroundColor: 'rgba(114, 46, 209, 0.1)',
        borderColor: '#722ed1',
        textColor: '#722ed1',
        icon: '🚀'
      },
      'onhold': {
        color: '#f5222d',
        backgroundColor: 'rgba(245, 34, 45, 0.1)',
        borderColor: '#f5222d',
        textColor: '#f5222d',
        icon: '⏸️'
      }
    };

    return statusConfigs[statusLower] || statusConfigs['planning'];
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
      title: 'Tiến độ',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => {
        const config = record.statusConfig || getStatusConfig(status);
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: config.backgroundColor,
              border: `1px solid ${config.borderColor}`,
              fontSize: '12px',
              fontWeight: '500',
              color: config.textColor,
              minWidth: '100px',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '14px' }}>{config.icon}</span>
            <span>{status}</span>
          </div>
        );
      }
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
                    <Option value="Planning">📋 Planning</Option>
                    <Option value="Completed">✅ Completed</Option>
                    <Option value="Pending">⏳ Pending</Option>
                    <Option value="Inprogress">🚀 In Progress</Option>
                    <Option value="Onhold">⏸️ On Hold</Option>
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

          {/* Reusable Custom Pagination Component */}
          <div style={{
            paddingLeft: '16px',
            paddingRight: '16px'
          }}>
            <CustomPagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
              loading={loading}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50, 100]}
              showInfo={true}
              showPageSizeSelector={true}
              compact={false}
              className="project-tracker-pagination"
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProjectTracker;
