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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1
  });

  // Load projects from API
  const loadProjects = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/Projects?page=${page}&pageSize=${pageSize}`);
      const result = await response.json();

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
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
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
  const handleTableChange = (paginationInfo) => {
    loadProjects(paginationInfo.current, paginationInfo.pageSize);
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
      title: '',
      dataIndex: 'priority',
      width: 20,
      render: (priority) => (
        <div
          style={{
            width: '4px',
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
      title: 'Category',
      dataIndex: 'category',
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
            <Spin spinning={loading}>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={projectData}
                loading={loading}
                onChange={handleTableChange}
                pagination={{
                  current: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  total: pagination.totalCount,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `Row Per Page: ${range[1] - range[0] + 1} Entries | Showing ${range[0]} to ${range[1]} of ${total} entries`
                }}
              />
            </Spin>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProjectTracker;
