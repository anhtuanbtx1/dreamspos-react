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
import CustomPagination from '../../components/CustomPagination';

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

    /* Light mode input-blocks styling */
    .input-blocks.light-mode {
      background: linear-gradient(135deg, #ffffff, #f8f9fa) !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      border-radius: 12px !important;
      padding: 16px 20px !important;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
      margin-bottom: 20px !important;
    }

    /* Light mode custom-dropdown styling */
    .input-blocks.light-mode .custom-select {
      background: #ffffff !important;
      border: 1px solid #dee2e6 !important;
      color: #495057 !important;
      border-radius: 6px !important;
      padding: 8px 40px 8px 40px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
      height: 40px !important;
      line-height: 24px !important;
    }

    .input-blocks.light-mode .custom-select:focus {
      border-color: #80bdff !important;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
      outline: none !important;
    }

    .input-blocks.light-mode .custom-select:hover {
      border-color: #adb5bd !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
    }

    /* Light mode input styling */
    .input-blocks.light-mode input[type="text"] {
      background: #ffffff !important;
      border: 1px solid #dee2e6 !important;
      color: #495057 !important;
      border-radius: 6px !important;
      padding: 8px 12px !important;
      font-size: 14px !important;
      transition: all 0.3s ease !important;
    }

    .input-blocks.light-mode input[type="text"]:focus {
      border-color: #80bdff !important;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
      outline: none !important;
    }

    .input-blocks.light-mode input[type="text"]:hover {
      border-color: #adb5bd !important;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
    }

    /* Light mode button styling in input-blocks */
    .input-blocks.light-mode button {
      background: linear-gradient(135deg, #007bff, #0056b3) !important;
      border: 1px solid #007bff !important;
      color: #ffffff !important;
      border-radius: 6px !important;
      padding: 8px 16px !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
      cursor: pointer !important;
    }

    .input-blocks.light-mode button:hover {
      background: linear-gradient(135deg, #0056b3, #004085) !important;
      border-color: #0056b3 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3) !important;
    }

    .input-blocks.light-mode button:active {
      transform: translateY(0) !important;
      box-shadow: 0 2px 6px rgba(0, 123, 255, 0.2) !important;
    }

    /* Light mode search icon styling */
    .input-blocks.light-mode .feather-search {
      color: #ffffff !important;
    }

    /* Light mode filter icon styling */
    .input-blocks.light-mode .feather-filter {
      color: #495057 !important;
    }

    /* Light mode icon positioning fix */
    .input-blocks.light-mode .info-img {
      position: absolute !important;
      left: 12px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      z-index: 2 !important;
      pointer-events: none !important;
      font-size: 16px !important;
    }

    /* Light mode custom-dropdown container positioning */
    .input-blocks.light-mode.custom-dropdown {
      position: relative !important;
      display: flex !important;
      align-items: center !important;
    }

    /* Override inline styles for light mode dropdowns */
    .input-blocks.light-mode .custom-select {
      background: #ffffff !important;
      border: 1px solid #dee2e6 !important;
      color: #495057 !important;
    }

    /* Light mode dropdown arrow styling */
    .input-blocks.light-mode .custom-select {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23495057' viewBox='0 0 16 16'%3e%3cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3e%3c/svg%3e") !important;
      background-repeat: no-repeat !important;
      background-position: right 12px center !important;
      background-size: 12px !important;
    }

    /* Fix input-blocks positioning for icons */
    .input-blocks {
      position: relative !important;
    }

    /* Clean filter inputs styling */
    .input-blocks input.form-control {
      height: 40px !important;
      padding-left: 40px !important;
      background: #2c3e50 !important;
      border: 1px solid rgba(52, 152, 219, 0.3) !important;
      color: #ffffff !important;
      border-radius: 6px !important;
    }

    .input-blocks input.form-control::placeholder {
      color: #bdc3c7 !important;
    }

    .input-blocks input.form-control:focus {
      border-color: #3498db !important;
      box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25) !important;
      background: #34495e !important;
    }

    /* Custom dropdown styling */
    .custom-dropdown select.custom-select {
      height: 40px !important;
      padding-left: 40px !important;
      padding-right: 40px !important;
      background: #2c3e50 !important;
      border: 1px solid rgba(52, 152, 219, 0.3) !important;
      color: #ffffff !important;
      border-radius: 6px !important;
      appearance: none !important;
      cursor: pointer !important;
    }

    .custom-dropdown select.custom-select:focus {
      border-color: #3498db !important;
      box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25) !important;
      background: #34495e !important;
      outline: none !important;
    }

    .custom-dropdown select.custom-select option {
      background: #2c3e50 !important;
      color: #ffffff !important;
      padding: 8px 12px !important;
      border: none !important;
    }

    .custom-dropdown select.custom-select option:hover {
      background: #34495e !important;
      color: #3498db !important;
    }

    .custom-dropdown select.custom-select option:checked {
      background: #3498db !important;
      color: #ffffff !important;
    }

    /* Hide ALL React Select elements completely */
    .select,
    .select *,
    .css-*,
    [class*="css-"],
    [id*="react-select"],
    .react-select__control,
    .react-select__value-container,
    .react-select__placeholder,
    .react-select__single-value,
    .react-select__indicators,
    .react-select__indicator,
    .react-select__dropdown-indicator,
    .react-select__clear-indicator,
    .react-select__loading-indicator,
    .react-select__menu,
    .react-select__menu-list,
    .react-select__option,
    .react-select__group,
    .react-select__input,
    .react-select__input-container,
    .css-1jqq78o-placeholder,
    .css-1dimb5e-singleValue,
    .css-1fdsijx-ValueContainer,
    .css-1hwfws3,
    .css-15lsz6c-indicatorContainer,
    .css-1okebmr-indicatorSeparator,
    .css-tlfecz-indicatorContainer,
    .css-1gtu0rj-indicatorContainer,
    .css-1xc3v61-indicatorContainer,
    .css-tj5bde-Svg,
    .css-8mmkcg,
    .css-1rhbuit-multiValue,
    .css-12jo7m5,
    .css-1u9des2-indicatorSeparator,
    .css-1wa3eu0-placeholder,
    .css-1uccc91-singleValue,
    .css-qc6sy-singleValue,
    .css-1pahdxg-control,
    .css-yk16xz-control,
    .css-1s2u09g-control,
    .css-1hwfws3-placeholder,
    .css-b62m3t-container,
    .css-2b097c-container,
    .css-hlgwow,
    .css-art2ul-ValueContainer2,
    .css-g1d714-ValueContainer,
    .css-1d8n9bt,
    .css-6j8wv5-Input,
    .css-qbdosj-Input,
    div[id*="react-select"][id*="placeholder"],
    div[class*="css-"],
    span[class*="css-"],
    input[class*="css-"] {
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
      pointer-events: none !important;
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

  // Detect theme mode from document attribute
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-layout-mode') === 'dark_mode'
  );

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-layout-mode') {
          const newTheme = document.documentElement.getAttribute('data-layout-mode');
          setIsDarkMode(newTheme === 'dark_mode');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-layout-mode']
    });

    return () => observer.disconnect();
  }, []);

  // State for pagination - sync with Redux
  const [currentPage, setCurrentPage] = useState(reduxCurrentPage || 1);
  const [pageSize, setPageSize] = useState(reduxPageSize || 20);

  // State for filter values
  const [filterValues, setFilterValues] = useState({
    product: '',
    category: '',
    subCategory: '',
    brand: '',
    priceRange: ''
  });

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
          Page: currentPage,
          PageSize: pageSize,
          SearchTerm: debouncedSearchTerm || ''
        };

        // Remove empty parameters
        const cleanParams = Object.fromEntries(
          Object.entries(searchParams).filter(([, value]) => value !== '')
        );

        await dispatch(fetchProducts(cleanParams));
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
      Page: page,
      PageSize: pageSize,
      SearchTerm: debouncedSearchTerm || ''
    };

    // Remove empty parameters
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([, value]) => value !== '')
    );

    dispatch(fetchProducts(cleanParams));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size

    // Dispatch action to fetch products with new page size
    const searchParams = {
      Page: 1,
      PageSize: newPageSize,
      SearchTerm: debouncedSearchTerm || ''
    };

    // Remove empty parameters
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([, value]) => value !== '')
    );

    dispatch(fetchProducts(cleanParams));
  };

  // Handle filter value changes
  const handleFilterChange = (filterType, value) => {
    setFilterValues(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle search with filters
  const handleSearchWithFilters = () => {
    setCurrentPage(1); // Reset to first page when searching

    // Combine search term with filter values
    const searchParams = {
      Page: 1,
      PageSize: pageSize,
      SearchTerm: debouncedSearchTerm || '',
      // Map filter values to API expected parameters
      ProductName: filterValues.product || '',
      Category: filterValues.category || '',
      SubCategory: filterValues.subCategory || '',
      Brand: filterValues.brand || '',
      PriceRange: filterValues.priceRange || ''
    };

    // Remove empty parameters to clean up API call
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([, value]) => value !== '')
    );

    console.log('Search with filters (clean params):', cleanParams);
    dispatch(fetchProducts(cleanParams));
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
  // Removed unused select option arrays since we're using simple inputs now

  const columns = [
    {
      title: "Sản phẩm",
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
      title: "Danh mục",
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
      title: "Thương hiệu",
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
      title: "Giá",
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
      title: "Đơn vị",
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
      title: "Người tạo",
      dataIndex: "createdby",
      render: (text, record) => (
        <span className="created-by-text">
          <Link to="/profile" style={{ color: '#3498db', textDecoration: 'none' }}>
            {record.createdBy || text || "Admin"}
          </Link>
        </span>
      ),
      sorter: (a, b) => a.createdby.length - b.createdby.length,
    },
    {
      title: "Thao tác",
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
              <h4>Danh sách sản phẩm</h4>
              <h6>Quản lý sản phẩm</h6>
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
              Thêm mới
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
              Nhập sản phẩm
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
                        <div className="input-blocks custom-dropdown">
                          <select
                            className="form-control custom-select"
                            value={filterValues.product}
                            onChange={(e) => handleFilterChange('product', e.target.value)}
                            style={{
                              paddingLeft: '40px',
                              background: '#2c3e50',
                              border: '1px solid rgba(52, 152, 219, 0.3)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              height: '40px',
                              appearance: 'none',
                              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 12px center',
                              backgroundSize: '16px',
                              paddingRight: '40px'
                            }}
                          >
                            <option value="">Choose Product</option>
                            <option value="lenovo">Lenovo 3rd Generation</option>
                            <option value="nike">Nike Jordan</option>
                            <option value="apple">Apple iPhone</option>
                            <option value="samsung">Samsung Galaxy</option>
                          </select>
                          <Box
                            className="info-img"
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#3498db',
                              zIndex: 2,
                              pointerEvents: 'none'
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks custom-dropdown">
                          <select
                            className="form-control custom-select"
                            value={filterValues.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            style={{
                              paddingLeft: '40px',
                              background: '#2c3e50',
                              border: '1px solid rgba(52, 152, 219, 0.3)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              height: '40px',
                              appearance: 'none',
                              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 12px center',
                              backgroundSize: '16px',
                              paddingRight: '40px'
                            }}
                          >
                            <option value="">Choose Category</option>
                            <option value="laptop">Laptop</option>
                            <option value="phone">Phone</option>
                            <option value="shoe">Shoe</option>
                            <option value="clothing">Clothing</option>
                          </select>
                          <StopCircle
                            className="info-img"
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#e74c3c',
                              zIndex: 2,
                              pointerEvents: 'none'
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks custom-dropdown">
                          <select
                            className="form-control custom-select"
                            value={filterValues.subCategory}
                            onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                            style={{
                              paddingLeft: '40px',
                              background: '#2c3e50',
                              border: '1px solid rgba(52, 152, 219, 0.3)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              height: '40px',
                              appearance: 'none',
                              backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'white\' viewBox=\'0 0 16 16\'%3e%3cpath d=\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3e%3c/svg%3e")',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 12px center',
                              backgroundSize: '12px',
                              paddingRight: '40px'
                            }}
                          >
                            <option value="">Choose Sub Category</option>
                            <option value="computers">Computers</option>
                            <option value="accessories">Accessories</option>
                            <option value="sports">Sports</option>
                            <option value="electronics">Electronics</option>
                          </select>
                          <GitMerge
                            className="info-img"
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#2ecc71',
                              zIndex: 2,
                              pointerEvents: 'none'
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks custom-dropdown">
                          <select
                            className="form-control custom-select"
                            value={filterValues.brand}
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                            style={{
                              paddingLeft: '40px',
                              background: '#2c3e50',
                              border: '1px solid rgba(52, 152, 219, 0.3)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              height: '40px',
                              appearance: 'none',
                              backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'white\' viewBox=\'0 0 16 16\'%3e%3cpath d=\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3e%3c/svg%3e")',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 12px center',
                              backgroundSize: '12px',
                              paddingRight: '40px'
                            }}
                          >
                            <option value="">Choose Brand</option>
                            <option value="lenovo">Lenovo</option>
                            <option value="nike">Nike</option>
                            <option value="apple">Apple</option>
                            <option value="samsung">Samsung</option>
                            <option value="adidas">Adidas</option>
                          </select>
                          <StopCircle
                            className="info-img"
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#f39c12',
                              zIndex: 2,
                              pointerEvents: 'none'
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks custom-dropdown">
                          <select
                            className="form-control custom-select"
                            value={filterValues.priceRange}
                            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                            style={{
                              paddingLeft: '40px',
                              background: '#2c3e50',
                              border: '1px solid rgba(52, 152, 219, 0.3)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              height: '40px',
                              appearance: 'none',
                              backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'white\' viewBox=\'0 0 16 16\'%3e%3cpath d=\'M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z\'/%3e%3c/svg%3e")',
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 12px center',
                              backgroundSize: '12px',
                              paddingRight: '40px'
                            }}
                          >
                            <option value="">Choose Price Range</option>
                            <option value="0-100">$0 - $100</option>
                            <option value="100-500">$100 - $500</option>
                            <option value="500-1000">$500 - $1,000</option>
                            <option value="1000+">$1,000+</option>
                          </select>
                          <i
                            className="fas fa-money-bill info-img"
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#9b59b6',
                              zIndex: 2,
                              pointerEvents: 'none'
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-lg-2 col-sm-6 col-12">
                        <div className="input-blocks">
                          <button
                            className="btn btn-filters ms-auto"
                            onClick={handleSearchWithFilters}
                            type="button"
                            style={{
                              background: 'linear-gradient(45deg, #3498db, #2980b9)',
                              border: '1px solid rgba(52, 152, 219, 0.3)',
                              color: '#ffffff',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'linear-gradient(45deg, #2980b9, #3498db)';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }}
                          >
                            <i
                              data-feather="search"
                              className="feather-search"
                              style={{ marginRight: '8px' }}
                            />
                            Search
                          </button>
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

export default ProductList;
