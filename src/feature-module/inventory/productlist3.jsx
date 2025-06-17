import {
  Box,
  Edit,
  Eye,
  Filter,
  GitMerge,
  Sliders,
  StopCircle,
  Trash2,
} from "feather-icons-react/build/IconComponents";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Brand from "../../core/modals/inventory/brand";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import {
  fetchProducts,
  fetchProduct,
  deleteProduct,
  searchProducts
} from "../../core/redux/actions/productActions";

import CustomPagination from "../../components/CustomPagination";

const MySwal = withReactContent(Swal);
const route = all_routes;

// Add CSS to hide Ant Design pagination and checkboxes
function hideAntElements() {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    .ant-pagination {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
    
    /* Hide all Ant Design checkboxes */
    .ant-checkbox,
    .ant-checkbox-input,
    .ant-checkbox-wrapper,
    .ant-table-selection-column,
    .ant-table-selection,
    .ant-table-thead > tr > th.ant-table-selection-column,
    .ant-table-tbody > tr > td.ant-table-selection-column {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

const ProductList3 = () => {
  // Use new Redux structure for API data, fallback to legacy for existing functionality
  const {
    products: apiProducts,
    loading,
    error,
    totalProducts,
    pageSize: reduxPageSize,
    currentPage: reduxCurrentPage
  } = useSelector((state) => state.products);

  // Fallback to legacy data if API data is not available
  const legacyProducts = useSelector((state) => state.legacy?.product_list || []);

  // Sample inventory data for demonstration
  const sampleInventoryData = [
    {
      key: 1,
      product: "MacBook Pro 13 inch",
      sku: "MBP13-001",
      totalImported: 50,
      totalExported: 35,
      currentStock: 15,
      minStock: 5,
      maxStock: 50,
      unitPrice: 25000000,
      totalValue: 375000000,
      productImage: "assets/img/products/macbook.jpg",
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-20"
    },
    {
      key: 2,
      product: "iPhone 15 Pro",
      sku: "IP15P-001",
      totalImported: 80,
      totalExported: 55,
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unitPrice: 28000000,
      totalValue: 700000000,
      productImage: "assets/img/products/iphone.jpg",
      createdDate: "2024-01-14",
      lastUpdated: "2024-01-19"
    },
    {
      key: 3,
      product: "Samsung Galaxy S24",
      sku: "SGS24-001",
      totalImported: 30,
      totalExported: 22,
      currentStock: 8,
      minStock: 5,
      maxStock: 30,
      unitPrice: 22000000,
      totalValue: 176000000,
      productImage: "assets/img/products/samsung.jpg",
      createdDate: "2024-01-13",
      lastUpdated: "2024-01-18"
    },
    {
      key: 4,
      product: "Dell XPS 13",
      sku: "DXP13-001",
      totalImported: 40,
      totalExported: 28,
      currentStock: 12,
      minStock: 8,
      maxStock: 40,
      unitPrice: 23000000,
      totalValue: 276000000,
      productImage: "assets/img/products/dell.jpg",
      createdDate: "2024-01-12",
      lastUpdated: "2024-01-17"
    },
    {
      key: 5,
      product: "iPad Pro 11 inch",
      sku: "IPD11-001",
      totalImported: 60,
      totalExported: 45,
      currentStock: 15,
      minStock: 10,
      maxStock: 60,
      unitPrice: 20000000,
      totalValue: 300000000,
      productImage: "assets/img/products/ipad.jpg",
      createdDate: "2024-01-11",
      lastUpdated: "2024-01-16"
    }
  ];

  const dataSource = apiProducts.length > 0 ? apiProducts : (legacyProducts.length > 0 ? legacyProducts : sampleInventoryData);

  const dispatch = useDispatch();

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State for pagination - sync with Redux
  const [currentPage, setCurrentPage] = useState(reduxCurrentPage || 1);
  const [pageSize, setPageSize] = useState(reduxPageSize || 20);

  // State for filter values
  const [filterValues, setFilterValues] = useState({
    product: '',
    stockLevel: '',
    quantityRange: '',
    stockStatus: ''
  });

  // Calculate total records and pages
  const totalRecords = totalProducts || dataSource.length;
  const actualTotalPages = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    hideAntElements();
    
    // Fetch products on component mount
    if (apiProducts.length === 0) {
      dispatch(fetchProducts({ page: currentPage, pageSize }));
    }
  }, [dispatch, apiProducts.length]);

  // Sync local state with Redux state
  useEffect(() => {
    if (reduxCurrentPage && reduxCurrentPage !== currentPage) {
      setCurrentPage(reduxCurrentPage);
    }
    if (reduxPageSize && reduxPageSize !== pageSize) {
      setPageSize(reduxPageSize);
    }
  }, [reduxCurrentPage, reduxPageSize, currentPage, pageSize]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      dispatch(searchProducts(value));
    } else {
      dispatch(fetchProducts({ page: 1, pageSize }));
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(fetchProducts({ page, pageSize, search: searchTerm }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    dispatch(fetchProducts({ page: 1, pageSize: newPageSize, search: searchTerm }));
  };

  const handleDelete = async (productId) => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await dispatch(deleteProduct(productId));
        
        MySwal.fire({
          title: "Deleted!",
          text: "Product has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#28a745",
        });

        // Refresh the product list
        dispatch(fetchProducts({ page: currentPage, pageSize, search: searchTerm }));
      }
    } catch (error) {
      MySwal.fire({
        title: "Error!",
        text: "Failed to delete product. Please try again.",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const oldandlatestvalue = [
    { value: "date", label: "Sắp xếp theo ngày" },
    { value: "newest", label: "Mới nhất" },
    { value: "oldest", label: "Cũ nhất" },
  ];

  const stockLevelOptions = [
    { value: "", label: "Chọn mức tồn kho" },
    { value: "low", label: "Tồn kho thấp" },
    { value: "normal", label: "Tồn kho bình thường" },
    { value: "high", label: "Tồn kho cao" },
  ];

  const stockStatusOptions = [
    { value: "", label: "Chọn trạng thái" },
    { value: "in-stock", label: "Còn hàng" },
    { value: "low-stock", label: "Sắp hết hàng" },
    { value: "out-of-stock", label: "Hết hàng" },
  ];

  const quantityRangeOptions = [
    { value: "", label: "Chọn khoảng số lượng" },
    { value: "0-10", label: "0 - 10" },
    { value: "11-50", label: "11 - 50" },
    { value: "51-100", label: "51 - 100" },
    { value: "100+", label: "Trên 100" },
  ];

  // Handle filter value changes
  const handleFilterChange = (filterType, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      render: (text, record) => (
        <span>{text || record.name || record.productName}</span>
      ),
      sorter: (a, b) => a.product.length - b.product.length,
    },
    {
      title: "Mã",
      dataIndex: "sku",
      render: (_, record) => {
        const sku = record.sku || record.code || record.productCode || '-';
        return <span>{sku}</span>;
      },
      sorter: (a, b) => {
        const skuA = a.sku || a.code || a.productCode || '';
        const skuB = b.sku || b.code || b.productCode || '';
        return skuA.length - skuB.length;
      },
    },
    {
      title: "Tổng nhập kho",
      dataIndex: "totalImported",
      render: (_, record) => {
        const totalImported = record.totalImported || 0;

        return (
          <span
            className="import-badge"
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#e8f5e8',
              color: '#28a745',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: '1px solid #c3e6cb',
              minWidth: '80px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            {totalImported.toLocaleString('vi-VN')}
          </span>
        );
      },
      sorter: (a, b) => {
        const importedA = a.totalImported || 0;
        const importedB = b.totalImported || 0;
        return importedA - importedB;
      },
    },
    {
      title: "Tổng xuất kho",
      dataIndex: "totalExported",
      render: (_, record) => {
        const totalExported = record.totalExported || 0;

        return (
          <span
            className="export-badge"
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#fff3cd',
              color: '#856404',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: '1px solid #ffeaa7',
              minWidth: '80px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            {totalExported.toLocaleString('vi-VN')}
          </span>
        );
      },
      sorter: (a, b) => {
        const exportedA = a.totalExported || 0;
        const exportedB = b.totalExported || 0;
        return exportedA - exportedB;
      },
    },
    {
      title: "Tồn kho hiện tại",
      dataIndex: "currentStock",
      render: (_, record) => {
        const stock = record.currentStock || record.qty || record.quantity || 0;
        const minStock = record.minStock || 5;

        let badgeColor = '#e3f2fd';
        let textColor = '#1565c0';
        let borderColor = '#bbdefb';

        if (stock <= 0) {
          badgeColor = '#f8d7da';
          textColor = '#721c24';
          borderColor = '#f5c6cb';
        } else if (stock <= minStock) {
          badgeColor = '#fff3cd';
          textColor = '#856404';
          borderColor = '#ffeaa7';
        }

        return (
          <span
            className="stock-badge"
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: badgeColor,
              color: textColor,
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: `1px solid ${borderColor}`,
              minWidth: '80px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            {stock.toLocaleString('vi-VN')}
          </span>
        );
      },
      sorter: (a, b) => {
        const stockA = a.currentStock || a.qty || a.quantity || 0;
        const stockB = b.currentStock || b.qty || b.quantity || 0;
        return stockA - stockB;
      },
    },
    {
      title: "Giá trị tồn kho",
      dataIndex: "totalValue",
      render: (_, record) => {
        const stock = record.currentStock || record.qty || record.quantity || 0;
        const price = record.unitPrice || record.price || record.sellPrice || 0;
        const totalValue = stock * price;

        return (
          <span
            className="value-badge"
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: '#f3e5f5',
              color: '#7b1fa2',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: '1px solid #e1bee7',
              minWidth: '120px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            {totalValue.toLocaleString('vi-VN')} ₫
          </span>
        );
      },
      sorter: (a, b) => {
        const valueA = (a.currentStock || 0) * (a.unitPrice || 0);
        const valueB = (b.currentStock || 0) * (b.unitPrice || 0);
        return valueA - valueB;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: (_, record) => (
        <td className="action-table-data">
          <div className="edit-delete-action">
            <Link className="me-2 p-2" to={route.productdetails}>
              <Eye className="feather-view" />
            </Link>
            <Link
              className="me-2 p-2"
              to={`${route.editproduct}/${record.id || record.key}`}
              onClick={() => {
                // Pre-fetch product details for editing
                if (record.id || record.key) {
                  dispatch(fetchProduct(record.id || record.key));
                }
              }}
            >
              <Edit className="feather-edit" />
            </Link>
            <Link
              className="confirm-text p-2"
              to="#"
              onClick={(e) => {
                e.preventDefault();
                handleDelete(record.id || record.key);
              }}
            >
              <Trash2 className="feather-delete" />
            </Link>
          </div>
        </td>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Tồn kho</h4>
              <h6>Quản lý thông tin tồn kho sản phẩm</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-top">Pdf</Tooltip>}
              >
                <Link>
                  <ImageWithBasePath
                    src="assets/img/icons/pdf.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-top">Excel</Tooltip>}
              >
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <ImageWithBasePath
                    src="assets/img/icons/excel.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-top">Print</Tooltip>}
              >
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <ImageWithBasePath
                    src="assets/img/icons/printer.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
        {/* /product list */}
        <div className="card mb-0" id="filter_inputs">
          <div className="card-body pb-0">
            <div className="row">
              <div className="col-lg-12 col-sm-12">
                <div className="row">
                  <div className="col-lg col-sm-6 col-12">
                    <div className="input-blocks">
                      <StopCircle className="info-img" />
                      <Select
                        className="img-select"
                        options={oldandlatestvalue}
                        placeholder="Sắp xếp theo ngày"
                      />
                    </div>
                  </div>
                  <div className="col-lg col-sm-6 col-12">
                    <div className="input-blocks">
                      <Box className="info-img" />
                      <Select
                        className="img-select"
                        options={stockLevelOptions}
                        placeholder="Chọn mức tồn kho"
                        value={stockLevelOptions.find(option => option.value === filterValues.stockLevel)}
                        onChange={(selectedOption) => handleFilterChange('stockLevel', selectedOption?.value || '')}
                      />
                    </div>
                  </div>
                  <div className="col-lg col-sm-6 col-12">
                    <div className="input-blocks">
                      <Sliders className="info-img" />
                      <Select
                        className="img-select"
                        options={quantityRangeOptions}
                        placeholder="Chọn khoảng số lượng"
                        value={quantityRangeOptions.find(option => option.value === filterValues.quantityRange)}
                        onChange={(selectedOption) => handleFilterChange('quantityRange', selectedOption?.value || '')}
                      />
                    </div>
                  </div>
                  <div className="col-lg col-sm-6 col-12">
                    <div className="input-blocks">
                      <Filter className="info-img" />
                      <Select
                        className="img-select"
                        options={stockStatusOptions}
                        placeholder="Chọn trạng thái"
                        value={stockStatusOptions.find(option => option.value === filterValues.stockStatus)}
                        onChange={(selectedOption) => handleFilterChange('stockStatus', selectedOption?.value || '')}
                      />
                    </div>
                  </div>
                  <div className="col-lg-1 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Link className="btn btn-filters ms-auto">
                        <i data-feather="search" className="feather-search" />
                        Tìm kiếm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Filter */}
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm tồn kho..."
                    className="form-control form-control-sm formsearch"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Link className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${
                    isFilterVisible ? "setclose" : ""
                  }`}
                  id="filter_search"
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  <Filter className="filter-icon" />
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/closes.svg"
                      alt="img"
                    />
                  </span>
                </Link>
              </div>
              <div className="form-sort">
                <Sliders className="info-img" />
                <Select
                  className="img-select"
                  options={oldandlatestvalue}
                  placeholder="Sắp xếp theo ngày"
                />
              </div>
            </div>
            {/* /Filter */}
            <div className="table-responsive">
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Đang tải dữ liệu tồn kho...</p>
                </div>
              ) : error ? (
                <div className="text-center p-4">
                  <div className="alert alert-danger">
                    <p>Lỗi: {error}</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => dispatch(fetchProducts({ page: currentPage, pageSize }))}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false} // Disable Ant Design pagination
                    rowSelection={null} // Disable row selection checkboxes
                  />

                  {/* Custom Pagination */}
                  <CustomPagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    totalCount={totalRecords}
                    totalPages={actualTotalPages}
                    loading={loading}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[10, 20, 50, 100]}
                    showInfo={true}
                    showPageSizeSelector={true}
                    compact={false}
                    className="inventory-pagination"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        {/* /product list */}
        <Brand />
      </div>
    </div>
  );
};

export default ProductList3;
