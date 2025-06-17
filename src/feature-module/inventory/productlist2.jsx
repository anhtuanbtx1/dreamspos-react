import {
  Box,
  ChevronUp,
  Edit,
  Eye,
  Filter,
  GitMerge,
  PlusCircle,
  RotateCcw,
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
import { setToogleHeader } from "../../core/redux/action";
import { Download } from "react-feather";
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

const ProductList2 = () => {
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

  // Sample import data for demonstration
  const sampleImportData = [
    {
      key: 1,
      product: "MacBook Pro 13 inch",
      sku: "MBP13-001",
      importPrice: 25000000,
      importQuantity: 5,
      productImage: "assets/img/products/macbook.jpg",
      supplier: "Apple Vietnam",
      createdDate: "2024-01-15",
      importDate: "2024-01-15"
    },
    {
      key: 2,
      product: "iPhone 15 Pro",
      sku: "IP15P-001",
      importPrice: 28000000,
      importQuantity: 10,
      productImage: "assets/img/products/iphone.jpg",
      supplier: "Apple Vietnam",
      createdDate: "2024-01-14",
      importDate: "2024-01-14"
    },
    {
      key: 3,
      product: "Samsung Galaxy S24",
      sku: "SGS24-001",
      importPrice: 22000000,
      importQuantity: 8,
      productImage: "assets/img/products/samsung.jpg",
      supplier: "Samsung Vietnam",
      createdDate: "2024-01-13",
      importDate: "2024-01-13"
    }
  ];

  const dataSource = apiProducts.length > 0 ? apiProducts : (legacyProducts.length > 0 ? legacyProducts : sampleImportData);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.legacy?.toggle_header || false);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State for pagination - sync with Redux
  const [currentPage, setCurrentPage] = useState(reduxCurrentPage || 1);
  const [pageSize, setPageSize] = useState(reduxPageSize || 20);

  // State for filter values
  const [filterValues, setFilterValues] = useState({
    product: '',
    supplier: '',
    importDate: '',
    priceRange: '',
    quantityRange: ''
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

  const supplierOptions = [
    { value: "", label: "Chọn nhà cung cấp" },
    { value: "supplier1", label: "Nhà cung cấp A" },
    { value: "supplier2", label: "Nhà cung cấp B" },
  ];

  const importDateOptions = [
    { value: "", label: "Chọn thời gian nhập" },
    { value: "today", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
  ];

  const priceRangeOptions = [
    { value: "", label: "Chọn khoảng giá" },
    { value: "0-100000", label: "0 - 100,000 ₫" },
    { value: "100000-500000", label: "100,000 - 500,000 ₫" },
    { value: "500000-1000000", label: "500,000 - 1,000,000 ₫" },
  ];

  const quantityRangeOptions = [
    { value: "", label: "Chọn số lượng" },
    { value: "1-10", label: "1 - 10" },
    { value: "11-50", label: "11 - 50" },
    { value: "51-100", label: "51 - 100" },
    { value: "100+", label: "Trên 100" },
  ];

  const handleMenuToggle = () => {
    dispatch(setToogleHeader(!data));
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
      title: "Giá nhập",
      dataIndex: "importPrice",
      render: (_, record) => {
        const price = record.price || record.price || record.price || 0;
        return (
          <span
            className="price-badge"
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
            {price.toLocaleString('vi-VN')} ₫
          </span>
        );
      },
      sorter: (a, b) => {
        const priceA = a.importPrice || a.purchasePrice || a.costPrice || 0;
        const priceB = b.importPrice || b.purchasePrice || b.costPrice || 0;
        return priceA - priceB;
      },
    },
    {
      title: "Số lượng nhập",
      dataIndex: "importQuantity",
      render: (_, record) => {
        const quantity = record.qty || record.quantity || record.inboundQuantity || 0;
        return (
          <span
            className="quantity-badge"
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: quantity > 0 ? '#e8f5e8' : '#f8f9fa',
              color: quantity > 0 ? '#28a745' : '#6c757d',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: `1px solid ${quantity > 0 ? '#c3e6cb' : '#dee2e6'}`,
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
            {quantity.toLocaleString('vi-VN')}
          </span>
        );
      },
      sorter: (a, b) => {
        const qtyA = a.importQuantity || a.receivedQuantity || a.inboundQuantity || 0;
        const qtyB = b.importQuantity || b.receivedQuantity || b.inboundQuantity || 0;
        return qtyA - qtyB;
      },
    },
    {
      title: "Ngày nhập",
      dataIndex: "importDate",
      render: (_, record) => {
        const importDate = record.createdDate || record.importDate || record.receivedDate || '';
        if (!importDate) return <span>-</span>;

        // Format date to Vietnamese format
        const date = new Date(importDate);
        const formattedDate = date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        // Calculate days ago
        const today = new Date();
        const diffTime = Math.abs(today - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let badgeColor = '#d1ecf1';
        let textColor = '#0c5460';
        let borderColor = '#bee5eb';

        if (diffDays <= 1) {
          badgeColor = '#d4edda';
          textColor = '#155724';
          borderColor = '#c3e6cb';
        } else if (diffDays <= 7) {
          badgeColor = '#fff3cd';
          textColor = '#856404';
          borderColor = '#ffeaa7';
        } else if (diffDays > 30) {
          badgeColor = '#f8d7da';
          textColor = '#721c24';
          borderColor = '#f5c6cb';
        }

        return (
          <span
            className="date-badge"
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              backgroundColor: badgeColor,
              color: textColor,
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              border: `1px solid ${borderColor}`,
              minWidth: '90px',
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
            title={`${diffDays} ngày trước`}
          >
            {formattedDate}
          </span>
        );
      },
      sorter: (a, b) => {
        const dateA = new Date(a.createdDate || a.importDate || a.receivedDate || 0);
        const dateB = new Date(b.createdDate || b.importDate || b.receivedDate || 0);
        return dateA - dateB;
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
              <h4>Nhập kho</h4>
              <h6>Quản lý thông tin nhập kho sản phẩm</h6>
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
            <li>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-top">Refresh</Tooltip>}
              >
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  onClick={() => dispatch(fetchProducts({ page: currentPage, pageSize }))}
                >
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-top">Collapse</Tooltip>}
              >
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={handleMenuToggle}
                >
                  <ChevronUp />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
          <div className="page-btn">
            <Link to="#" className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />
              Tạo phiếu nhập
            </Link>
          </div>
          <div className="page-btn import">
            <Link
              to="#"
              className="btn btn-added color"
              data-bs-toggle="modal"
              data-bs-target="#view-notes"
            >
              <Download className="me-2" />
              Import Excel
            </Link>
          </div>
        </div>
        {/* /product list */}
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm nhập kho..."
                    className="form-control form-control-sm formsearch"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Link to className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${isFilterVisible ? "setclose" : ""}`}
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
                  classNamePrefix="react-select"
                  options={oldandlatestvalue}
                  placeholder="Newest"
                />
              </div>
            </div>
            {/* /Filter */}
            <div
              className={`card${isFilterVisible ? " " : " d-none"}`}
              id="filter_inputs"
              style={{ display: isFilterVisible ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <GitMerge className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={[
                          { value: "", label: "Chọn sản phẩm" },
                          { value: "macbook-pro", label: "Macbook Pro" },
                          { value: "orange", label: "Cam" },
                        ]}
                        placeholder="Chọn sản phẩm"
                        value={[
                          { value: "", label: "Chọn sản phẩm" },
                          { value: "macbook-pro", label: "Macbook Pro" },
                          { value: "orange", label: "Cam" },
                        ].find(option => option.value === filterValues.product)}
                        onChange={(selectedOption) =>
                          setFilterValues(prev => ({ ...prev, product: selectedOption?.value || '' }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <StopCircle className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={supplierOptions}
                        placeholder="Chọn nhà cung cấp"
                        value={supplierOptions.find(option => option.value === filterValues.supplier)}
                        onChange={(selectedOption) =>
                          setFilterValues(prev => ({ ...prev, supplier: selectedOption?.value || '' }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <StopCircle className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={importDateOptions}
                        placeholder="Chọn thời gian nhập"
                        value={importDateOptions.find(option => option.value === filterValues.importDate)}
                        onChange={(selectedOption) =>
                          setFilterValues(prev => ({ ...prev, importDate: selectedOption?.value || '' }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <Box className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={priceRangeOptions}
                        placeholder="Chọn khoảng giá"
                        value={priceRangeOptions.find(option => option.value === filterValues.priceRange)}
                        onChange={(selectedOption) =>
                          setFilterValues(prev => ({ ...prev, priceRange: selectedOption?.value || '' }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-sm-6 col-12">
                    <div className="input-blocks">
                      <StopCircle className="info-img" />
                      <Select
                        className="img-select"
                        classNamePrefix="react-select"
                        options={quantityRangeOptions}
                        placeholder="Chọn số lượng"
                        value={quantityRangeOptions.find(option => option.value === filterValues.quantityRange)}
                        onChange={(selectedOption) =>
                          setFilterValues(prev => ({ ...prev, quantityRange: selectedOption?.value || '' }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-1 col-sm-6 col-12 ms-auto">
                    <div className="input-blocks">
                      <Link className="btn btn-filters ms-auto">
                        <i
                          data-feather="search"
                          className="feather-search"
                          style={{ marginRight: '8px' }}
                        />
                        Tìm kiếm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Filter */}
            <div className="table-responsive">
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Đang tải dữ liệu nhập kho...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  <strong>Error:</strong> {error}
                  <button
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={() => dispatch(fetchProducts())}
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

                  {/* Reusable Custom Pagination Component */}
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
                    className="product-list-pagination"
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

export default ProductList2;
