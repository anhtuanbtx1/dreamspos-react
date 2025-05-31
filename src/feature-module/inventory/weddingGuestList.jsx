import React, { useState, useEffect } from 'react';
import { Table, Button, Avatar, Spin, Select, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Gift, Heart, Search } from 'react-feather';
import CustomPagination from '../../components/CustomPagination';

const { Option } = Select;

const WeddingGuestList = () => {
  // State management
  const [guestData, setGuestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterUnit, setFilterUnit] = useState('All Units');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for wedding guests
  const mockGuestData = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      unit: 'Công ty ABC',
      numberOfPeople: 2,
      giftAmount: 500000,
      status: 'Đi',
      phone: '0901234567',
      relationship: 'Bạn bè',
      inviteDate: '2024-01-15',
      confirmDate: '2024-01-20'
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      unit: 'Trường ĐH XYZ',
      numberOfPeople: 4,
      giftAmount: 1000000,
      status: 'Đi',
      phone: '0912345678',
      relationship: 'Gia đình',
      inviteDate: '2024-01-16',
      confirmDate: '2024-01-22'
    },
    {
      id: 3,
      name: 'Lê Minh Cường',
      unit: 'Ngân hàng DEF',
      numberOfPeople: 1,
      giftAmount: 300000,
      status: 'Không đi',
      phone: '0923456789',
      relationship: 'Đồng nghiệp',
      inviteDate: '2024-01-17',
      confirmDate: '2024-01-25'
    },
    {
      id: 4,
      name: 'Phạm Thị Dung',
      unit: 'Bệnh viện GHI',
      numberOfPeople: 3,
      giftAmount: 800000,
      status: 'Đi',
      phone: '0934567890',
      relationship: 'Bạn bè',
      inviteDate: '2024-01-18',
      confirmDate: '2024-01-28'
    },
    {
      id: 5,
      name: 'Hoàng Văn Em',
      unit: 'Công ty JKL',
      numberOfPeople: 2,
      giftAmount: 600000,
      status: 'Chưa xác nhận',
      phone: '0945678901',
      relationship: 'Đồng nghiệp',
      inviteDate: '2024-01-19',
      confirmDate: null
    }
  ];

  // Load guest data
  const loadGuests = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter and paginate mock data
      let filteredData = mockGuestData;

      // Apply filters
      if (filterStatus !== 'All Status') {
        filteredData = filteredData.filter(guest => guest.status === filterStatus);
      }

      if (filterUnit !== 'All Units') {
        filteredData = filteredData.filter(guest => guest.unit === filterUnit);
      }

      if (searchTerm) {
        filteredData = filteredData.filter(guest =>
          guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.unit.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Pagination
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setGuestData(paginatedData);
      setTotalCount(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / size));

    } catch (error) {
      console.error('Error loading guests:', error);
      setGuestData([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const statusConfigs = {
      'Đi': {
        color: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        borderColor: '#52c41a',
        textColor: '#52c41a',
        icon: '✅'
      },
      'Không đi': {
        color: '#f5222d',
        backgroundColor: 'rgba(245, 34, 45, 0.1)',
        borderColor: '#f5222d',
        textColor: '#f5222d',
        icon: '❌'
      },
      'Chưa xác nhận': {
        color: '#faad14',
        backgroundColor: 'rgba(250, 173, 20, 0.1)',
        borderColor: '#faad14',
        textColor: '#faad14',
        icon: '⏳'
      }
    };

    return statusConfigs[status] || statusConfigs['Chưa xác nhận'];
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Load data on component mount
  useEffect(() => {
    loadGuests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadGuests(page, pageSize);
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    loadGuests(1, newPageSize);
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    loadGuests(1, pageSize);
  };

  // Handle filter change
  const handleFilterChange = () => {
    setCurrentPage(1);
    loadGuests(1, pageSize);
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Tên khách mời',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar
            style={{ backgroundColor: '#1890ff' }}
            size={32}
          >
            {text.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.relationship}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      render: (text) => (
        <span style={{ fontSize: '13px' }}>{text}</span>
      )
    },
    {
      title: 'Số người',
      dataIndex: 'numberOfPeople',
      key: 'numberOfPeople',
      align: 'center',
      render: (count) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <Users size={14} color="#1890ff" />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{count}</span>
        </div>
      )
    },
    {
      title: 'Số tiền mừng',
      dataIndex: 'giftAmount',
      key: 'giftAmount',
      align: 'right',
      render: (amount) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
          <Gift size={14} color="#52c41a" />
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#52c41a' }}>
            {formatCurrency(amount)}
          </span>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        const config = getStatusConfig(status);
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
              minWidth: '120px',
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
      title: 'Liên hệ',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <span style={{ fontSize: '13px', color: '#1890ff' }}>{phone}</span>
      )
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: () => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Edit size={16} style={{ cursor: 'pointer', color: '#1890ff' }} />
            <Trash2 size={16} style={{ cursor: 'pointer', color: '#ff4d4f' }} />
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
      name: record.name,
    }),
  };

  // Calculate statistics
  const totalGuests = mockGuestData.length;
  const confirmedGuests = mockGuestData.filter(g => g.status === 'Đi').length;
  const totalPeople = mockGuestData.reduce((sum, g) => sum + (g.status === 'Đi' ? g.numberOfPeople : 0), 0);
  const totalGiftAmount = mockGuestData.reduce((sum, g) => sum + (g.status === 'Đi' ? g.giftAmount : 0), 0);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>
                <Heart size={20} style={{ marginRight: '8px', color: '#ff69b4' }} />
                Danh sách khách mời đám cưới
              </h4>
              <h6>Quản lý khách mời và mừng cưới</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/add-wedding-guest">
              <Button
                type="primary"
                icon={<Plus size={16} />}
                className="btn btn-added"
                style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}
              >
                Thêm khách mời
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-sm-6 col-12">
            <div className="dash-widget">
              <div className="dash-widgetimg">
                <span><Users color="#ff69b4" /></span>
              </div>
              <div className="dash-widgetcontent">
                <h5>{totalGuests}</h5>
                <h6>Tổng khách mời</h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-12">
            <div className="dash-widget">
              <div className="dash-widgetimg">
                <span><Heart color="#52c41a" /></span>
              </div>
              <div className="dash-widgetcontent">
                <h5>{confirmedGuests}</h5>
                <h6>Xác nhận tham dự</h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-12">
            <div className="dash-widget">
              <div className="dash-widgetimg">
                <span><Users color="#1890ff" /></span>
              </div>
              <div className="dash-widgetcontent">
                <h5>{totalPeople}</h5>
                <h6>Tổng số người</h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-12">
            <div className="dash-widget">
              <div className="dash-widgetimg">
                <span><Gift color="#faad14" /></span>
              </div>
              <div className="dash-widgetcontent">
                <h5>{formatCurrency(totalGiftAmount)}</h5>
                <h6>Tổng tiền mừng</h6>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Lists */}
        <div className="card table-list-card">
          <div className="card-body pb-0">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <Input
                    placeholder="Tìm kiếm khách mời..."
                    prefix={<Search size={16} />}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
                  />
                </div>
              </div>
              <div className="search-path">
                <div className="d-flex align-items-center gap-3">
                  <Select
                    value={filterStatus}
                    onChange={(value) => {
                      setFilterStatus(value);
                      handleFilterChange();
                    }}
                    className="project-filter-select"
                    style={{ width: 160, height: 42 }}
                  >
                    <Option value="All Status">Tất cả trạng thái</Option>
                    <Option value="Đi">✅ Đi</Option>
                    <Option value="Không đi">❌ Không đi</Option>
                    <Option value="Chưa xác nhận">⏳ Chưa xác nhận</Option>
                  </Select>

                  <Select
                    value={filterUnit}
                    onChange={(value) => {
                      setFilterUnit(value);
                      handleFilterChange();
                    }}
                    className="project-filter-select"
                    style={{ width: 180, height: 42 }}
                  >
                    <Option value="All Units">Tất cả đơn vị</Option>
                    <Option value="Công ty ABC">Công ty ABC</Option>
                    <Option value="Trường ĐH XYZ">Trường ĐH XYZ</Option>
                    <Option value="Ngân hàng DEF">Ngân hàng DEF</Option>
                    <Option value="Bệnh viện GHI">Bệnh viện GHI</Option>
                    <Option value="Công ty JKL">Công ty JKL</Option>
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
                dataSource={guestData}
                loading={loading}
                pagination={false}
                rowKey="id"
              />
            </Spin>
          </div>

          {/* Custom Pagination */}
          <div style={{
            marginTop: '24px',
            marginBottom: '24px',
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
              className="wedding-guest-pagination"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeddingGuestList;