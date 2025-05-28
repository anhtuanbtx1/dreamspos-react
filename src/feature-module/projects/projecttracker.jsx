import React, { useState } from 'react';
import { Table, Progress, Tag, Avatar, Button, DatePicker, Select } from 'antd';
import {
  Star,
  Edit,
  Trash2,
  Plus
} from 'feather-icons-react';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectTracker = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterManager, setFilterManager] = useState('All Managers');
  const [filterPriority, setFilterPriority] = useState('All Priority');
  const [sortBy, setSortBy] = useState('Last 7 Days');

  // Sample project data
  const projectData = [
    {
      key: '1',
      id: 1,
      projectName: 'E-commerce Website Development',
      category: ['Web Development'],
      categoryColor: 'blue',
      manager: [
        { name: 'John Smith', avatar: 'assets/img/profiles/avatar-01.jpg' },
        { name: 'Sarah Johnson', avatar: 'assets/img/profiles/avatar-02.jpg' }
      ],
      startDate: '01 Jan 2024',
      progress: 85,
      deadline: '15 Mar 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'high',
      starred: true,
      budget: '$45,000',
      client: 'TechCorp Inc.'
    },
    {
      key: '2',
      id: 2,
      projectName: 'Mobile App UI/UX Design',
      category: ['Design'],
      categoryColor: 'purple',
      manager: [
        { name: 'Mike Wilson', avatar: 'assets/img/profiles/avatar-03.jpg' },
        { name: 'Lisa Chen', avatar: 'assets/img/profiles/avatar-04.jpg' }
      ],
      startDate: '15 Feb 2024',
      progress: 60,
      deadline: '30 Apr 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'medium',
      starred: false,
      budget: '$28,000',
      client: 'StartupXYZ'
    },
    {
      key: '3',
      id: 3,
      projectName: 'Database Migration Project',
      category: ['Backend'],
      categoryColor: 'green',
      manager: [
        { name: 'David Brown', avatar: 'assets/img/profiles/avatar-05.jpg' },
        { name: 'Emma Davis', avatar: 'assets/img/profiles/avatar-06.jpg' }
      ],
      startDate: '10 Mar 2024',
      progress: 100,
      deadline: '25 Mar 2024',
      status: 'Completed',
      statusColor: 'success',
      priority: 'high',
      starred: true,
      budget: '$35,000',
      client: 'DataFlow Ltd.'
    },
    {
      key: '4',
      id: 4,
      projectName: 'Marketing Campaign Platform',
      category: ['Marketing'],
      categoryColor: 'orange',
      manager: [
        { name: 'Tom Anderson', avatar: 'assets/img/profiles/avatar-07.jpg' },
        { name: 'Jessica White', avatar: 'assets/img/profiles/avatar-08.jpg' }
      ],
      startDate: '20 Mar 2024',
      progress: 40,
      deadline: '15 Jun 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'medium',
      starred: false,
      budget: '$52,000',
      client: 'MarketPro Agency'
    },
    {
      key: '5',
      id: 5,
      projectName: 'Cloud Infrastructure Setup',
      category: ['DevOps'],
      categoryColor: 'cyan',
      manager: [
        { name: 'Alex Rodriguez', avatar: 'assets/img/profiles/avatar-09.jpg' },
        { name: 'Maria Garcia', avatar: 'assets/img/profiles/avatar-10.jpg' }
      ],
      startDate: '05 Apr 2024',
      progress: 75,
      deadline: '20 May 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'high',
      starred: true,
      budget: '$38,000',
      client: 'CloudTech Solutions'
    },
    {
      key: '6',
      id: 6,
      projectName: 'AI Chatbot Development',
      category: ['AI/ML'],
      categoryColor: 'red',
      manager: [
        { name: 'Robert Lee', avatar: 'assets/img/profiles/avatar-11.jpg' },
        { name: 'Sophie Turner', avatar: 'assets/img/profiles/avatar-12.jpg' }
      ],
      startDate: '12 Apr 2024',
      progress: 30,
      deadline: '30 Jul 2024',
      status: 'Planning',
      statusColor: 'default',
      priority: 'low',
      starred: false,
      budget: '$65,000',
      client: 'AI Innovations'
    },
    {
      key: '7',
      id: 7,
      projectName: 'Security Audit & Compliance',
      category: ['Security'],
      categoryColor: 'red',
      manager: [
        { name: 'Michael Brown', avatar: 'assets/img/profiles/avatar-13.jpg' },
        { name: 'Rachel Davis', avatar: 'assets/img/profiles/avatar-14.jpg' }
      ],
      startDate: '25 Apr 2024',
      progress: 90,
      deadline: '10 May 2024',
      status: 'Review',
      statusColor: 'processing',
      priority: 'high',
      starred: true,
      budget: '$42,000',
      client: 'SecureBank Corp'
    },
    {
      key: '8',
      id: 8,
      projectName: 'Content Management System',
      category: ['Web Development'],
      categoryColor: 'blue',
      manager: [
        { name: 'Daniel Wilson', avatar: 'assets/img/profiles/avatar-15.jpg' },
        { name: 'Amanda Johnson', avatar: 'assets/img/profiles/avatar-16.jpg' }
      ],
      startDate: '01 May 2024',
      progress: 55,
      deadline: '15 Aug 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'medium',
      starred: false,
      budget: '$48,000',
      client: 'ContentHub Media'
    }
  ];

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
            <Button
              type="primary"
              icon={<Plus size={16} />}
              className="btn btn-added"
            >
              Create New Project
            </Button>
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
                <div className="d-flex align-items-center">
                  <RangePicker
                    placeholder={['Start Date', 'End Date']}
                    className="form-control"
                  />

                  <Select
                    value={filterPriority}
                    onChange={setFilterPriority}
                    className="form-control"
                    style={{ width: 120 }}
                  >
                    <Option value="All Priority">Priority</Option>
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                  </Select>

                  <Select
                    value={filterManager}
                    onChange={setFilterManager}
                    className="form-control"
                    style={{ width: 140 }}
                  >
                    <Option value="All Managers">Manager</Option>
                    <Option value="John Smith">John Smith</Option>
                    <Option value="Sarah Johnson">Sarah Johnson</Option>
                    <Option value="Mike Wilson">Mike Wilson</Option>
                  </Select>

                  <Select
                    value={filterStatus}
                    onChange={setFilterStatus}
                    className="form-control"
                    style={{ width: 140 }}
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
                    className="form-control"
                    style={{ width: 140 }}
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
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={projectData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `Row Per Page: ${range[1] - range[0] + 1} Entries | Showing ${range[0]} to ${range[1]} of ${total} entries`
              }}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProjectTracker;
