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

const TodoList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterAssignee, setFilterAssignee] = useState('All Assignees');
  const [filterTags, setFilterTags] = useState('All Tags');
  const [sortBy, setSortBy] = useState('Last 7 Days');

  // Sample todo data
  const todoData = [
    {
      key: '1',
      id: 1,
      companyName: 'Respond to any pending messages',
      tags: ['Social'],
      tagColor: 'blue',
      assignee: [
        { name: 'John Doe', avatar: 'assets/img/profiles/avatar-01.jpg' },
        { name: 'Jane Smith', avatar: 'assets/img/profiles/avatar-02.jpg' }
      ],
      createdOn: '14 Jan 2024',
      progress: 100,
      dueDate: '14 Jan 2024',
      status: 'Completed',
      statusColor: 'success',
      priority: 'high',
      starred: true
    },
    {
      key: '2',
      id: 2,
      companyName: 'Update calendar and schedule',
      tags: ['Meeting'],
      tagColor: 'purple',
      assignee: [
        { name: 'Mike Johnson', avatar: 'assets/img/profiles/avatar-03.jpg' },
        { name: 'Sarah Wilson', avatar: 'assets/img/profiles/avatar-04.jpg' }
      ],
      createdOn: '21 Jan 2024',
      progress: 15,
      dueDate: '21 Jan 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'medium',
      starred: true
    },
    {
      key: '3',
      id: 3,
      companyName: 'Respond to any pending messages',
      tags: ['Research'],
      tagColor: 'pink',
      assignee: [
        { name: 'David Brown', avatar: 'assets/img/profiles/avatar-05.jpg' },
        { name: 'Lisa Davis', avatar: 'assets/img/profiles/avatar-06.jpg' }
      ],
      createdOn: '20 Feb 2024',
      progress: 45,
      dueDate: '20 Feb 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'low',
      starred: false
    },
    {
      key: '4',
      id: 4,
      companyName: 'Attend team meeting at 10:00 AM',
      tags: ['Work Details'],
      tagColor: 'cyan',
      assignee: [
        { name: 'Tom Wilson', avatar: 'assets/img/profiles/avatar-07.jpg' },
        { name: 'Emma Johnson', avatar: 'assets/img/profiles/avatar-08.jpg' }
      ],
      createdOn: '15 Mar 2024',
      progress: 45,
      dueDate: '15 Mar 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'high',
      starred: true
    },
    {
      key: '5',
      id: 5,
      companyName: 'Check and respond to emails',
      tags: ['Reminder'],
      tagColor: 'blue',
      assignee: [
        { name: 'Alex Chen', avatar: 'assets/img/profiles/avatar-09.jpg' },
        { name: 'Maria Garcia', avatar: 'assets/img/profiles/avatar-10.jpg' }
      ],
      createdOn: '12 Apr 2024',
      progress: 65,
      dueDate: '12 Apr 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'medium',
      starred: false
    },
    {
      key: '6',
      id: 6,
      companyName: 'Coordinate with department head',
      tags: ['Internal'],
      tagColor: 'red',
      assignee: [
        { name: 'Robert Lee', avatar: 'assets/img/profiles/avatar-11.jpg' },
        { name: 'Sophie Turner', avatar: 'assets/img/profiles/avatar-12.jpg' }
      ],
      createdOn: '20 Apr 2024',
      progress: 85,
      dueDate: '20 Apr 2024',
      status: 'Ongoing',
      statusColor: 'warning',
      priority: 'high',
      starred: false
    },
    {
      key: '7',
      id: 7,
      companyName: 'Plan tasks for the next day',
      tags: ['Social'],
      tagColor: 'blue',
      assignee: [
        { name: 'Michael Brown', avatar: 'assets/img/profiles/avatar-13.jpg' },
        { name: 'Jessica Davis', avatar: 'assets/img/profiles/avatar-14.jpg' }
      ],
      createdOn: '06 Jul 2024',
      progress: 100,
      dueDate: '06 Jul 2024',
      status: 'Completed',
      statusColor: 'success',
      priority: 'low',
      starred: true
    },
    {
      key: '8',
      id: 8,
      companyName: 'Finalize project proposal',
      tags: ['Projects'],
      tagColor: 'green',
      assignee: [
        { name: 'Daniel Wilson', avatar: 'assets/img/profiles/avatar-15.jpg' },
        { name: 'Amanda Johnson', avatar: 'assets/img/profiles/avatar-16.jpg' }
      ],
      createdOn: '02 Sep 2024',
      progress: 65,
      dueDate: '02 Sep 2024',
      status: 'Ongoing',
      statusColor: 'warning',
      priority: 'high',
      starred: false
    },
    {
      key: '9',
      id: 9,
      companyName: 'Submit to supervisor by EOD',
      tags: ['Reminder'],
      tagColor: 'blue',
      assignee: [
        { name: 'Christopher Lee', avatar: 'assets/img/profiles/avatar-17.jpg' },
        { name: 'Michelle Garcia', avatar: 'assets/img/profiles/avatar-18.jpg' }
      ],
      createdOn: '15 Nov 2024',
      progress: 75,
      dueDate: '15 Nov 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'medium',
      starred: true
    },
    {
      key: '10',
      id: 10,
      companyName: 'Prepare presentation slides',
      tags: ['Research'],
      tagColor: 'pink',
      assignee: [
        { name: 'Kevin Martinez', avatar: 'assets/img/profiles/avatar-19.jpg' },
        { name: 'Rachel Thompson', avatar: 'assets/img/profiles/avatar-20.jpg' }
      ],
      createdOn: '10 Dec 2024',
      progress: 50,
      dueDate: '10 Dec 2024',
      status: 'In Progress',
      statusColor: 'warning',
      priority: 'medium',
      starred: false
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
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text) => (
        <span style={{ color: '#ffffff', fontSize: '14px' }}>{text}</span>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags, record) => (
        <Tag color={record.tagColor} style={{ borderRadius: '12px', fontSize: '12px' }}>
          {tags[0]}
        </Tag>
      )
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignees) => (
        <Avatar.Group maxCount={2} size="small">
          {assignees.map((assignee, index) => (
            <Avatar
              key={index}
              size={24}
              src={assignee.avatar}
              alt={assignee.name}
            />
          ))}
        </Avatar.Group>
      )
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (date) => (
        <span style={{ color: '#6c757d', fontSize: '13px' }}>{date}</span>
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
            strokeColor={progress === 100 ? '#28a745' : progress > 50 ? '#17a2b8' : '#ffc107'}
            showInfo={false}
          />
          <span style={{ color: '#6c757d', fontSize: '12px', marginLeft: '8px' }}>
            Progress: {progress}%
          </span>
        </div>
      )
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => (
        <span style={{ color: '#6c757d', fontSize: '13px' }}>{date}</span>
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
      title: '',
      key: 'actions',
      width: 100,
      render: () => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Edit size={16} color="#6c757d" style={{ cursor: 'pointer' }} />
          <Trash2 size={16} color="#6c757d" style={{ cursor: 'pointer' }} />
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
      name: record.companyName,
    }),
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 style={{ color: '#ffffff', margin: 0 }}>Todo</h4>
              <h6 style={{ color: '#6c757d', margin: '4px 0 0 0' }}>Manage Your Todo</h6>
            </div>
          </div>
          <div className="page-btn">
            <Button
              type="primary"
              icon={<Plus size={16} />}
              style={{
                background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                border: 'none',
                borderRadius: '6px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Create New
            </Button>
          </div>
        </div>

        {/* Todo Lists Header */}
        <div style={{
          background: '#2d2d2d',
          padding: '16px 24px',
          borderRadius: '8px 8px 0 0',
          borderBottom: '1px solid #404040'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>
                Todo Lists
              </span>
              <Tag
                style={{
                  background: '#ff6b35',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
              >
                My Todo List
              </Tag>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RangePicker
                style={{
                  background: '#404040',
                  border: '1px solid #555',
                  borderRadius: '6px'
                }}
                placeholder={['05/23/2025', '05/29/2025']}
              />

              <Select
                value={filterTags}
                onChange={setFilterTags}
                style={{ width: 120, background: '#404040' }}
                dropdownStyle={{ background: '#2d2d2d' }}
              >
                <Option value="All Tags">Tags</Option>
                <Option value="Social">Social</Option>
                <Option value="Meeting">Meeting</Option>
                <Option value="Research">Research</Option>
              </Select>

              <Select
                value={filterAssignee}
                onChange={setFilterAssignee}
                style={{ width: 120, background: '#404040' }}
                dropdownStyle={{ background: '#2d2d2d' }}
              >
                <Option value="All Assignees">Assignee</Option>
                <Option value="John Doe">John Doe</Option>
                <Option value="Jane Smith">Jane Smith</Option>
              </Select>

              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 140, background: '#404040' }}
                dropdownStyle={{ background: '#2d2d2d' }}
              >
                <Option value="All Status">Select Status</Option>
                <Option value="Completed">Completed</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Pending">Pending</Option>
              </Select>

              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 140, background: '#404040' }}
                dropdownStyle={{ background: '#2d2d2d' }}
              >
                <Option value="Last 7 Days">Sort By: Last 7 Days</Option>
                <Option value="Last 30 Days">Last 30 Days</Option>
                <Option value="This Month">This Month</Option>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{
          background: '#2d2d2d',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden'
        }}>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={todoData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Row Per Page: ${range[1] - range[0] + 1} Entries | Showing ${range[0]} to ${range[1]} of ${total} entries`,
              style: {
                background: '#2d2d2d',
                padding: '16px 24px'
              }
            }}
            style={{
              background: '#2d2d2d'
            }}
            className="todo-table"
          />
        </div>
      </div>

      <style>{`
        .todo-table .ant-table {
          background: #2d2d2d !important;
        }
        .todo-table .ant-table-thead > tr > th {
          background: #404040 !important;
          border-bottom: 1px solid #555 !important;
          color: #ffffff !important;
          font-weight: 500 !important;
        }
        .todo-table .ant-table-tbody > tr > td {
          background: #2d2d2d !important;
          border-bottom: 1px solid #404040 !important;
          color: #ffffff !important;
        }
        .todo-table .ant-table-tbody > tr:hover > td {
          background: #404040 !important;
        }
        .todo-table .ant-pagination {
          background: #2d2d2d !important;
        }
        .todo-table .ant-pagination .ant-pagination-item {
          background: #404040 !important;
          border: 1px solid #555 !important;
        }
        .todo-table .ant-pagination .ant-pagination-item a {
          color: #ffffff !important;
        }
        .todo-table .ant-pagination .ant-pagination-item-active {
          background: #ff6b35 !important;
          border-color: #ff6b35 !important;
        }
        .todo-table .ant-pagination .ant-pagination-item-active a {
          color: #ffffff !important;
        }
        .ant-select-dropdown {
          background: #2d2d2d !important;
        }
        .ant-select-item {
          color: #ffffff !important;
        }
        .ant-select-item:hover {
          background: #404040 !important;
        }
        .ant-picker-dropdown {
          background: #2d2d2d !important;
        }
      `}</style>
    </div>
  );
};

export default TodoList;
