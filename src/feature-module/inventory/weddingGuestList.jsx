import React, { useState, useEffect } from 'react';
import { Table, Button, Avatar, Spin, Select, Input, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Gift, Heart, Search, Download } from 'react-feather';
import CustomPagination from '../../components/CustomPagination';
import { weddingGuestService } from '../../services/weddingGuestService';

const { Option } = Select;
const { confirm } = Modal;

const WeddingGuestList = () => {
  // State management
  const [guestData, setGuestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterUnit, setFilterUnit] = useState('All Units');
  const [searchTerm, setSearchTerm] = useState('');

  // Statistics and options
  const [statistics, setStatistics] = useState({
    totalGuests: 0,
    confirmedGuests: 0,
    totalPeople: 0,
    totalGiftAmount: 0
  });


  // Mock data fallback for development/testing
  const mockGuestData = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      unit: 'Công ty ABC',
      numberOfPeople: 2,
      giftAmount: 500000,
      status: 'Going',
      phone: '0901234567',
      relationship: 'Friend',
      address: '123 Lê Lợi, Q1, TP.HCM',
      notes: 'Bạn thân từ đại học',
      inviteDate: '2024-01-15T00:00:00Z',
      confirmDate: '2024-01-20T00:00:00Z',
      createdDate: '2024-01-10T00:00:00Z',
      isActive: true
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      unit: 'Trường ĐH XYZ',
      numberOfPeople: 4,
      giftAmount: 1000000,
      status: 'Going',
      phone: '0912345678',
      relationship: 'Family',
      address: '456 Nguyễn Huệ, Q1, TP.HCM',
      notes: 'Chị gái',
      inviteDate: '2024-01-16T00:00:00Z',
      confirmDate: '2024-01-22T00:00:00Z',
      createdDate: '2024-01-11T00:00:00Z',
      isActive: true
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      unit: 'Ngân hàng DEF',
      numberOfPeople: 1,
      giftAmount: 300000,
      status: 'NotGoing',
      phone: '0923456789',
      relationship: 'Colleague',
      address: '789 Đồng Khởi, Q1, TP.HCM',
      notes: 'Đồng nghiệp cũ',
      inviteDate: '2024-01-17T00:00:00Z',
      confirmDate: '2024-01-25T00:00:00Z',
      createdDate: '2024-01-12T00:00:00Z',
      isActive: true
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      unit: 'Bệnh viện GHI',
      numberOfPeople: 3,
      giftAmount: 800000,
      status: 'Going',
      phone: '0934567890',
      relationship: 'Friend',
      address: '321 Hai Bà Trưng, Q3, TP.HCM',
      notes: 'Bạn cùng lớp',
      inviteDate: '2024-01-18T00:00:00Z',
      confirmDate: '2024-01-28T00:00:00Z',
      createdDate: '2024-01-13T00:00:00Z',
      isActive: true
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      unit: 'Công ty JKL',
      numberOfPeople: 2,
      giftAmount: 600000,
      status: 'Pending',
      phone: '0945678901',
      relationship: 'Colleague',
      address: '654 Cách Mạng Tháng 8, Q10, TP.HCM',
      notes: 'Đồng nghiệp hiện tại',
      inviteDate: '2024-01-19T00:00:00Z',
      confirmDate: null,
      createdDate: '2024-01-14T00:00:00Z',
      isActive: true
    }
  ];

  // Load wedding guests from API
  const loadGuests = async (page = 1, size = 10) => {
    console.log('🚀 Loading guests...', { page, size, searchTerm, filterStatus, filterUnit });
    setLoading(true);

    try {
      const params = {
        page: page,
        pageSize: size,
        searchTerm: searchTerm || undefined,
        status: (filterStatus && filterStatus !== 'All Status') ? filterStatus : undefined,
        unit: (filterUnit && filterUnit !== 'All Units') ? filterUnit : undefined,
        sortBy: 'name',
        sortOrder: 'asc'
      };

      console.log('📤 API Request params:', params);
      const response = await weddingGuestService.getWeddingGuests(params);
      console.log('📥 API Response:', response);

      if (response.success) {
        // Handle different API response structures
        let guests = [];
        let paginationInfo = null;

        // Check if response has pagination structure
        if (response.data && typeof response.data === 'object') {
          if (response.data.data && Array.isArray(response.data.data)) {
            // Structure: { data: [...], pagination: {...} }
            guests = response.data.data;
            paginationInfo = response.data.pagination;
          } else if (response.data.guests && Array.isArray(response.data.guests)) {
            // Structure: { guests: [...], pagination: {...} }
            guests = response.data.guests;
            paginationInfo = response.data.pagination;
          } else if (Array.isArray(response.data)) {
            // Structure: [...]
            guests = response.data;
          } else {
            // Fallback: try to extract array from response
            guests = Object.values(response.data).find(val => Array.isArray(val)) || [];
          }
        }

        console.log('👥 Setting guest data:', guests);
        setGuestData(guests);

        // Handle pagination info
        if (paginationInfo) {
          const totalCount = paginationInfo.totalCount || paginationInfo.total || 0;
          const totalPages = paginationInfo.totalPages || Math.ceil(totalCount / pageSize);

          setTotalCount(totalCount);
          setTotalPages(totalPages);

          console.log('📊 Pagination from API:', {
            paginationInfo,
            totalCount,
            totalPages,
            currentPage: page,
            pageSize
          });
        } else {
          // Calculate pagination from array length
          const totalCount = guests.length;
          const totalPages = Math.ceil(totalCount / pageSize);

          setTotalCount(totalCount);
          setTotalPages(totalPages);

          console.log('📊 Calculated pagination:', {
            totalCount,
            totalPages,
            currentPage: page,
            pageSize,
            guestsLength: guests.length
          });
        }
      } else {
        console.error('❌ API call failed:', response.message);
        console.log('🔄 Using mock data as fallback');

        // Use mock data as fallback
        setGuestData(mockGuestData);
        setTotalCount(mockGuestData.length);
        setTotalPages(1);

        message.warning('Using demo data - API connection failed: ' + response.message);
      }
    } catch (error) {
      console.error('💥 Exception in loadGuests:', error);
      console.log('🔄 Using mock data as fallback due to exception');

      // Use mock data as fallback
      setGuestData(mockGuestData);
      setTotalCount(mockGuestData.length);
      setTotalPages(1);

      message.warning('Using demo data - API connection error: ' + error.message);
    } finally {
      setLoading(false);
      console.log('✅ Loading complete');
    }
  };

  // Load statistics from API
  const loadStatistics = async () => {
    try {
      console.log('📊 Loading statistics...');
      const response = await weddingGuestService.getWeddingGuestStatistics();

      if (response.success) {
        setStatistics({
          totalGuests: response.data.totalGuests || 0,
          confirmedGuests: response.data.confirmedGuests || 0,
          totalPeople: response.data.totalPeople || 0,
          totalGiftAmount: response.data.totalGiftAmount || 0
        });
        console.log('✅ Statistics loaded:', response.data);
      } else {
        console.log('🔄 Using mock statistics as fallback');
        // Calculate mock statistics
        const mockStats = {
          totalGuests: mockGuestData.length,
          confirmedGuests: mockGuestData.filter(g => g.status === 'Going').length,
          totalPeople: mockGuestData.filter(g => g.status === 'Going').reduce((sum, g) => sum + g.numberOfPeople, 0),
          totalGiftAmount: mockGuestData.filter(g => g.status === 'Going').reduce((sum, g) => sum + g.giftAmount, 0)
        };
        setStatistics(mockStats);
        console.log('📊 Mock statistics:', mockStats);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      console.log('🔄 Using mock statistics as fallback due to exception');

      // Calculate mock statistics
      const mockStats = {
        totalGuests: mockGuestData.length,
        confirmedGuests: mockGuestData.filter(g => g.status === 'Going').length,
        totalPeople: mockGuestData.filter(g => g.status === 'Going').reduce((sum, g) => sum + g.numberOfPeople, 0),
        totalGiftAmount: mockGuestData.filter(g => g.status === 'Going').reduce((sum, g) => sum + g.giftAmount, 0)
      };
      setStatistics(mockStats);
    }
  };

  // Load available units for filter
  const loadUnits = async () => {
    try {
      console.log('🏢 Loading units...');
      const response = await weddingGuestService.getUnits();

      if (response.success) {

        console.log('✅ Units loaded:', response.data);
      } else {
        console.log('🔄 Using mock units as fallback');

      }
    } catch (error) {
      console.error('Error loading units:', error);
      console.log('🔄 Using mock units as fallback due to exception');

    }
  };

  // Handle delete guest
  const handleDeleteGuest = async (id) => {
    confirm({
      title: 'Xác nhận xóa khách mời',
      content: 'Bạn có chắc chắn muốn xóa khách mời này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await weddingGuestService.deleteWeddingGuest(id);

          if (response.success) {
            message.success('Xóa khách mời thành công');
            loadGuests(currentPage, pageSize);
            loadStatistics();
          } else {
            message.error(response.message || 'Failed to delete guest');
          }
        } catch (error) {
          console.error('Error deleting guest:', error);
          message.error('An error occurred while deleting guest');
        }
      }
    });
  };

  // Handle export guests
  const handleExportGuests = async () => {
    try {
      const response = await weddingGuestService.exportWeddingGuests('excel');

      if (response.success) {
        message.success('Export completed successfully');
      } else {
        message.error(response.message || 'Failed to export guests');
      }
    } catch (error) {
      console.error('Error exporting guests:', error);
      message.error('An error occurred while exporting guests');
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const statusConfigs = {
      'Going': {
        color: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        borderColor: '#52c41a',
        textColor: '#52c41a',
        icon: '✅',
        label: 'Đi'
      },
      'NotGoing': {
        color: '#f5222d',
        backgroundColor: 'rgba(245, 34, 45, 0.1)',
        borderColor: '#f5222d',
        textColor: '#f5222d',
        icon: '❌',
        label: 'Không đi'
      },
      'Pending': {
        color: '#faad14',
        backgroundColor: 'rgba(250, 173, 20, 0.1)',
        borderColor: '#faad14',
        textColor: '#faad14',
        icon: '⏳',
        label: 'Chưa xác nhận'
      }
    };

    return statusConfigs[status] || statusConfigs['Pending'];
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Theme detection with multiple approaches
  useEffect(() => {
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;

      // Get all possible theme indicators
      const layoutMode = htmlElement.getAttribute('data-layout-mode');
      const dataTheme = htmlElement.getAttribute('data-theme');
      const bodyClass = bodyElement.className;
      const colorSchema = localStorage.getItem('colorschema');

      // Check multiple ways to detect dark mode
      const isDarkByLayoutMode = layoutMode === 'dark_mode';
      const isDarkByDataTheme = dataTheme === 'dark';
      const isDarkByLocalStorage = colorSchema === 'dark_mode';
      const isDarkByBodyClass = bodyClass.includes('dark') || bodyClass.includes('dark-mode');

      // Use any method that indicates dark mode
      const isDark = isDarkByLayoutMode || isDarkByDataTheme || isDarkByLocalStorage || isDarkByBodyClass;

      console.log('🎨 Theme debug:', {
        layoutMode,
        dataTheme,
        bodyClass,
        colorSchema,
        isDarkByLayoutMode,
        isDarkByDataTheme,
        isDarkByLocalStorage,
        isDarkByBodyClass,
        finalIsDark: isDark
      });

      setIsDarkTheme(isDark);
    };

    // Initial check
    checkTheme();

    // Check again after a short delay to catch late theme application
    setTimeout(checkTheme, 100);
    setTimeout(checkTheme, 500);

    // Listen for all possible theme changes
    const observer = new MutationObserver(() => {
      console.log('🔄 DOM mutation detected, rechecking theme...');
      checkTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-layout-mode', 'data-theme', 'class']
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'colorschema') {
        console.log('📦 localStorage colorschema changed:', e.newValue);
        setTimeout(checkTheme, 50);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically as fallback
    const interval = setInterval(checkTheme, 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadGuests();
    loadStatistics();
    loadUnits();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (currentPage === 1) {
      loadGuests(1, pageSize);
    } else {
      setCurrentPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterUnit, searchTerm]);

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
            <span>{config.label}</span>
          </div>
        );
      }
    },

    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link to={`/edit-wedding-guest/${record.id}`}>
              <Edit
                size={16}
                style={{
                  cursor: 'pointer',
                  color: isDarkTheme ? '#ffffff' : '#666666',
                  marginRight: '8px',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = isDarkTheme ? '#cccccc' : '#333333';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = isDarkTheme ? '#ffffff' : '#666666';
                }}
              />
            </Link>
            <Trash2
              size={16}
              style={{ cursor: 'pointer', color: '#ff4d4f' }}
              onClick={() => handleDeleteGuest(record.id)}
            />
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

  // Statistics from API data
  const { totalGuests, confirmedGuests, totalPeople, totalGiftAmount } = statistics;

  return (
    <div className="page-wrapper">
      <style>
        {`
          /* Dynamic theme styling for wedding guest list */
          .card.table-list-card {
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          .wedding-guest-search-input input,
          .wedding-guest-search-input .ant-input {
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
          }

          .wedding-guest-search-input .ant-input::placeholder {
            color: ${isDarkTheme ? '#888888' : '#999999'} !important;
          }

          .ant-select-selector {
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
          }

          .ant-select-selection-item {
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          .ant-table {
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          .ant-table-thead > tr > th {
            background-color: ${isDarkTheme ? '#2a2a2a' : '#fafafa'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
            border-bottom: 1px solid ${isDarkTheme ? '#434343' : '#f0f0f0'} !important;
          }

          .ant-table-tbody > tr > td {
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
            border-bottom: 1px solid ${isDarkTheme ? '#434343' : '#f0f0f0'} !important;
          }

          .ant-table-tbody > tr:hover > td {
            background-color: ${isDarkTheme ? '#2a2a2a' : '#f5f5f5'} !important;
          }

          /* Page wrapper ant-card styling - match website background */
          .page-wrapper .content .ant-card {
            background-color: ${isDarkTheme ? '#141432' : '#FAFBFE'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          /* All ant-card elements in page-wrapper - match website background */
          .page-wrapper .ant-card,
          .page-wrapper .content .ant-card,
          .page-wrapper .content .ant-card.ant-card-bordered {
            background-color: ${isDarkTheme ? '#141432' : '#FAFBFE'} !important;
            background: ${isDarkTheme ? '#141432' : '#FAFBFE'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          /* Override any CSS-in-JS styles */
          .page-wrapper .ant-card[style],
          .page-wrapper .content .ant-card[style] {
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            background: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
          }

          /* Force dark mode styles when data-layout-mode is dark_mode - match website background */
          html[data-layout-mode="dark_mode"] .page-wrapper .content .ant-card,
          html[data-layout-mode="dark_mode"] .page-wrapper .ant-card,
          body.dark-mode .page-wrapper .content .ant-card,
          body.dark .page-wrapper .content .ant-card {
            background-color: #141432 !important;
            background: #141432 !important;
            border-color: #434343 !important;
            color: #ffffff !important;
          }

          /* Force light mode styles when data-layout-mode is light_mode - match website background */
          html[data-layout-mode="light_mode"] .page-wrapper .content .ant-card,
          html[data-layout-mode="light_mode"] .page-wrapper .ant-card,
          body.light-mode .page-wrapper .content .ant-card,
          body.light .page-wrapper .content .ant-card {
            background-color: #FAFBFE !important;
            background: #FAFBFE !important;
            border-color: #d9d9d9 !important;
            color: #000000 !important;
          }

          /* Edit button styling - remove blue hover */
          .action-table-data .edit-delete-action a {
            text-decoration: none !important;
          }

          .action-table-data .edit-delete-action a:hover {
            background-color: transparent !important;
            color: inherit !important;
          }

          .action-table-data .edit-delete-action svg {
            transition: color 0.2s ease !important;
          }

          .action-table-data .edit-delete-action svg:hover {
            color: ${isDarkTheme ? '#cccccc' : '#333333'} !important;
          }

          /* Remove any blue hover effects from links */
          a:hover {
            color: inherit !important;
          }

          /* Ant Design link hover override */
          .ant-table-tbody > tr > td a:hover {
            color: inherit !important;
            background-color: transparent !important;
          }
        `}
      </style>
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                type="default"
                icon={<Download size={16} />}
                onClick={handleExportGuests}
                style={{ marginRight: '8px' }}
              >
                Export Excel
              </Button>
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
                    style={{
                      width: 300,
                      color: '#000000 !important',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d9d9d9'
                    }}
                    className="wedding-guest-search-input"
                  />
                </div>
              </div>
              <div className="search-path">
                <div className="d-flex align-items-center gap-3">
                  <Select
                    value={filterStatus}
                    onChange={(value) => {
                      setFilterStatus(value);
                    }}
                    className="project-filter-select"
                    style={{ width: 160, height: 42 }}
                  >
                    <Option value="All Status">📋 Tất cả trạng thái</Option>
                    <Option value="Going">✅ Đi</Option>
                    <Option value="NotGoing">❌ Không đi</Option>
                    <Option value="Pending">⏳ Chưa xác nhận</Option>
                  </Select>

                  <Select
                    value={filterUnit}
                    onChange={(value) => {
                      setFilterUnit(value);
                    }}
                    className="project-filter-select"
                    style={{ width: 180, height: 42 }}
                  >
                    <Option value="All Units">📋 Tất cả đơn vị</Option>
                    <Option value="Nội">Nội</Option>
                    <Option value="Ngoại">Ngoại</Option>
                    <Option value="Pending">Bạn bè</Option>
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