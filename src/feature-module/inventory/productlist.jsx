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
import { setToogleHeader } from "../../core/redux/action";
import { Download } from "react-feather";
import {
  fetchProducts,
  fetchProduct,
  deleteProduct,
  clearProductError
} from "../../core/redux/actions/productActions";

// Add CSS animations for beautiful UI
const shimmerKeyframes = `
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); }
    50% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.6); }
  }
`;

// Inject CSS into head if not already present
if (typeof document !== 'undefined' && !document.getElementById('beautiful-pagination-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'beautiful-pagination-styles';
  styleSheet.type = 'text/css';
  styleSheet.innerText = shimmerKeyframes + `
    /* Hide all Ant Design pagination elements */
    .ant-pagination,
    .ant-pagination-item,
    .ant-pagination-item-active,
    .ant-pagination-prev,
    .ant-pagination-next,
    .ant-table-pagination,
    ul.ant-pagination,
    li.ant-pagination-item,
    .ant-pagination-item-1,
    .ant-pagination-item-2,
    .ant-pagination-item-3,
    .ant-pagination-item-4,
    .ant-pagination-item-5,
    .ant-pagination-jump-prev,
    .ant-pagination-jump-next,
    .ant-pagination-options,
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
  `;
  document.head.appendChild(styleSheet);
}

const ProductList = () => {
  // Use new Redux structure for API data, fallback to legacy for existing functionality
  const {
    products: apiProducts,
    loading,
    error,
    totalProducts,
    totalPages,
    pageSize: reduxPageSize,
    currentPage: reduxCurrentPage
  } = useSelector((state) => state.products);

  // Fallback to legacy data if API data is not available
  const legacyProducts = useSelector((state) => state.legacy?.product_list || []);
  const dataSource = apiProducts.length > 0 ? apiProducts : legacyProducts;

  const dispatch = useDispatch();
  const data = useSelector((state) => state.legacy?.toggle_header || false);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State for pagination - sync with Redux
  const [currentPage, setCurrentPage] = useState(reduxCurrentPage || 1);
  const [pageSize, setPageSize] = useState(reduxPageSize || 20);

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const route = all_routes;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products when debounced search term or pagination changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const searchParams = {
          page: currentPage,
          pageSize: pageSize,
          searchTerm: debouncedSearchTerm
        };

        await dispatch(fetchProducts(searchParams));
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm]);

  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await dispatch(deleteProduct(productId));
      // Show success message
      MySwal.fire({
        title: "Deleted!",
        text: "Product has been deleted successfully.",
        icon: "success",
        className: "btn btn-success",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      MySwal.fire({
        title: "Error!",
        text: "Failed to delete product. Please try again.",
        icon: "error",
        className: "btn btn-danger",
        customClass: {
          confirmButton: "btn btn-danger",
        },
      });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Dispatch action to fetch products for the new page
    const searchParams = {
      page: page,
      pageSize: pageSize,
      searchTerm: debouncedSearchTerm
    };

    dispatch(fetchProducts(searchParams));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size

    // Dispatch action to fetch products with new page size
    const searchParams = {
      page: 1,
      pageSize: newPageSize,
      searchTerm: debouncedSearchTerm
    };

    dispatch(fetchProducts(searchParams));
  };

  // Calculate pagination info
  const totalRecords = totalProducts || dataSource.length;
  const calculatedTotalPages = Math.ceil(totalRecords / pageSize);
  const actualTotalPages = totalPages || calculatedTotalPages;

  const startRecord = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  // Debug logs removed for production

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch]);
  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];
  const productlist = [
    { value: "choose", label: "Choose Product" },
    { value: "lenovo", label: "Lenovo 3rd Generation" },
    { value: "nike", label: "Nike Jordan" },
  ];
  const categorylist = [
    { value: "choose", label: "Choose Category" },
    { value: "laptop", label: "Laptop" },
    { value: "shoe", label: "Shoe" },
  ];
  const subcategorylist = [
    { value: "choose", label: "Choose Sub Category" },
    { value: "computers", label: "Computers" },
    { value: "fruits", label: "Fruits" },
  ];
  const brandlist = [
    { value: "all", label: "All Brand" },
    { value: "lenovo", label: "Lenovo" },
    { value: "nike", label: "Nike" },
  ];
  const price = [
    { value: "price", label: "Price" },
    { value: "12500", label: "$12,500.00" },
    { value: "13000", label: "$13,000.00" }, // Replace with your actual values
  ];

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      render: (text, record) => (
        <span className="productimgname">
          <Link to="/profile" className="product-img stock-img">
            <ImageWithBasePath
              alt={record.name || text || "Product"}
              src={record.productImage || record.image || record.img}
            />
          </Link>
          <Link to="/profile">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.product.length - b.product.length,
    },
    {
      title: "SKU",
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
      title: "Category",
      dataIndex: "category",
      render: (_, record) => {
        const category = record.category || record.categoryName || '-';
        return <span>{category}</span>;
      },
      sorter: (a, b) => {
        const catA = a.category || a.categoryName || '';
        const catB = b.category || b.categoryName || '';
        return catA.length - catB.length;
      },
    },

    {
      title: "Brand",
      dataIndex: "brand",
      render: (_, record) => {
        const brand = record.brand || record.brandName || '-';
        return <span>{brand}</span>;
      },
      sorter: (a, b) => {
        const brandA = a.brand || a.brandName || '';
        const brandB = b.brand || b.brandName || '';
        return brandA.length - brandB.length;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (_, record) => {
        const price = record.price || record.salePrice || record.unitPrice || 0;
        return <span>${Number(price).toFixed(2)}</span>;
      },
      sorter: (a, b) => {
        const priceA = Number(a.price || a.salePrice || a.unitPrice || 0);
        const priceB = Number(b.price || b.salePrice || b.unitPrice || 0);
        return priceA - priceB;
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      render: (_, record) => {
        const unit = record.unit || record.unitOfMeasure || '-';
        return <span>{unit}</span>;
      },
      sorter: (a, b) => {
        const unitA = a.unit || a.unitOfMeasure || '';
        const unitB = b.unit || b.unitOfMeasure || '';
        return unitA.length - unitB.length;
      },
    },
    {
      title: "Qty",
      dataIndex: "qty",
      render: (_, record) => {
        // Try multiple possible field names for quantity
        const quantity = record.qty || record.quantity || record.stock || record.stockQuantity || 0;
        return <span>{quantity}</span>;
      },
      sorter: (a, b) => {
        const qtyA = a.qty || a.quantity || a.stock || a.stockQuantity || 0;
        const qtyB = b.qty || b.quantity || b.stock || b.stockQuantity || 0;
        return Number(qtyA) - Number(qtyB);
      },
    },

    {
      title: "Created By",
      dataIndex: "createdby",
      render: (text, record) => (
        <span className="userimgname">
          <Link to="/profile" className="product-img">
            <ImageWithBasePath
              alt={record.createdBy || text || "User"}
              src={record.img || record.avatar || record.userImage}
            />
          </Link>
          <Link to="/profile">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.createdby.length - b.createdby.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <td className="action-table-data">
          <div className="edit-delete-action">
            <div className="input-block add-lists"></div>
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
                MySwal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  showCancelButton: true,
                  confirmButtonColor: "#00ff00",
                  confirmButtonText: "Yes, delete it!",
                  cancelButtonColor: "#ff0000",
                  cancelButtonText: "Cancel",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDeleteProduct(record.id || record.key);
                  }
                });
              }}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </td>
      ),
      sorter: (a, b) => a.createdby.length - b.createdby.length,
    },
  ];
  const MySwal = withReactContent(Swal);

  // Removed showConfirmationAlert as we handle confirmation inline

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Product List</h4>
              <h6>Manage your products</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <ImageWithBasePath
                    src="assets/img/icons/excel.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <i data-feather="printer" className="feather-printer" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setToogleHeader(!data));
                  }}
                >
                  <ChevronUp />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
          <div className="page-btn">
            <Link to={route.addproduct} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />
              Add New Product
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
              Import Product
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
                    placeholder="Search"
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
                  className={`btn btn-filter ${
                    isFilterVisible ? "setclose" : ""
                  }`}
                  id="filter_search"
                >
                  <Filter
                    className="filter-icon"
                    onClick={toggleFilterVisibility}
                  />
                  <span onClick={toggleFilterVisibility}>
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
                  className="select"
                  options={options}
                  placeholder="14 09 23"
                />
              </div>
            </div>
            {/* /Filter */}
            <div
              className={`card${isFilterVisible ? " visible" : ""}`}
              id="filter_inputs"
              style={{ display: isFilterVisible ? "block" : "none" }}
            >
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="row">
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <Box className="info-img" />
                          <Select
                            className="select"
                            options={productlist}
                            placeholder="Choose Product"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <StopCircle className="info-img" />
                          <Select
                            className="select"
                            options={categorylist}
                            placeholder="Choose Category"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <GitMerge className="info-img" />
                          <Select
                            className="select"
                            options={subcategorylist}
                            placeholder="Choose Sub Category"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <StopCircle className="info-img" />
                          <Select
                            className="select"
                            options={brandlist}
                            placeholder="Nike"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <i className="fas fa-money-bill info-img" />

                          <Select
                            className="select"
                            options={price}
                            placeholder="Price"
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <Link className="btn btn-filters ms-auto">
                            {" "}
                            <i
                              data-feather="search"
                              className="feather-search"
                            />{" "}
                            Search{" "}
                          </Link>
                        </div>
                      </div>
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
                  <p className="mt-2">Loading products...</p>
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
                  />

                  {/* Table Pagination like the image */}
                  <div
                    className="custom-pagination-container"
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
                    {/* Animated background glow */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(52, 152, 219, 0.1), transparent)',
                        animation: 'shimmer 3s infinite',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Row Per Page Section */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px'
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <span style={{color: '#bdc3c7', fontSize: '14px'}}>Row Per Page</span>
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
                        <span style={{color: '#bdc3c7', fontSize: '14px'}}>Entries</span>
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
                        <span style={{color: '#bdc3c7', fontSize: '14px'}}>
                          Showing <strong style={{color: '#3498db'}}>{startRecord}</strong> to <strong style={{color: '#3498db'}}>{endRecord}</strong> of <strong style={{color: '#e74c3c'}}>{totalRecords}</strong> entries
                          {debouncedSearchTerm && (
                            <span style={{color: '#2ecc71', marginLeft: '8px'}}>
                              (filtered from <strong style={{color: '#f39c12'}}>{totalProducts || totalRecords}</strong> total)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Pagination Section like the image */}
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
                      {Array.from({ length: actualTotalPages }, (_, i) => {
                        const pageNum = i + 1;
                        const isActive = currentPage === pageNum;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => !loading && handlePageChange(pageNum)}
                            disabled={loading}
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
                              opacity: loading ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.target.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.target.style.background = 'linear-gradient(45deg, #34495e, #2c3e50)';
                                e.target.style.transform = 'translateY(0)';
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

export default ProductList;
