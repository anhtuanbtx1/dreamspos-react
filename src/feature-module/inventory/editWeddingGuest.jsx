import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, message, Spin, Row, Col } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Heart } from 'react-feather';
import { weddingGuestService } from '../../services/weddingGuestService';

const { Option } = Select;
const { TextArea } = Input;

const EditWeddingGuest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestData, setGuestData] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Check theme with multiple approaches
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

      console.log('🎨 Theme debug (Edit):', {
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
      console.log('🔄 DOM mutation detected (Edit), rechecking theme...');
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
        console.log('📦 localStorage colorschema changed (Edit):', e.newValue);
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

  // Load guest data
  const loadGuestData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading guest data for ID:', id);
      const response = await weddingGuestService.getWeddingGuestById(id);

      if (response.success) {
        const guest = response.data;
        setGuestData(guest);

        // Set form values
        form.setFieldsValue({
          name: guest.name,
          unit: guest.unit,
          numberOfPeople: guest.numberOfPeople,
          giftAmount: guest.giftAmount,
          status: guest.status,
          relationship: guest.relationship,
          notes: guest.notes
        });

        console.log('✅ Guest data loaded:', guest);
      } else {
        message.error(response.message || 'Failed to load guest data');
        navigate('/wedding-guest-list');
      }
    } catch (error) {
      console.error('Error loading guest data:', error);
      message.error('An error occurred while loading guest data');
      navigate('/wedding-guest-list');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      console.log('📤 Updating guest with values:', values);

      // Prepare update data according to API model (không gửi id, createdDate, createdBy)
      const updateData = {
        name: values.name,
        unit: values.unit,
        numberOfPeople: values.numberOfPeople,
        giftAmount: values.giftAmount,
        status: values.status,
        relationship: values.relationship,
        notes: values.notes || '',
        updatedDate: new Date().toISOString(),
        updatedBy: 'current-user', // You might want to get this from auth context
        isActive: guestData?.isActive !== false // Default to true if not specified
      };

      console.log('📤 Final update data (using POST method):', updateData);

      const response = await weddingGuestService.updateWeddingGuest(id, updateData);

      if (response.success) {
        message.success('Cập nhật khách mời thành công!');
        navigate('/wedding-guest-list');
      } else {
        message.error(response.message || 'Failed to update guest');
      }
    } catch (error) {
      console.error('Error updating guest:', error);
      message.error('An error occurred while updating guest');
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic styles based on theme
  const getInputStyle = () => ({
    color: isDarkTheme ? '#ffffff' : '#000000',
    backgroundColor: isDarkTheme ? '#1f1f1f' : '#ffffff',
    borderColor: isDarkTheme ? '#434343' : '#d9d9d9',
  });

  const getLabelStyle = () => ({
    color: isDarkTheme ? '#ffffff' : '#000000',
  });

  // Force DOM styling update
  useEffect(() => {
    const forceCardStyling = () => {
      // Find all ant-card elements
      const cards = document.querySelectorAll('.ant-card, .wedding-guest-form');
      cards.forEach(card => {
        if (card) {
          card.style.backgroundColor = isDarkTheme ? '#141432' : '#FAFBFE';
          card.style.background = isDarkTheme ? '#141432' : '#FAFBFE';
          card.style.borderColor = isDarkTheme ? '#434343' : '#d9d9d9';
          card.style.color = isDarkTheme ? '#ffffff' : '#000000';
        }
      });
    };

    // Apply immediately
    forceCardStyling();

    // Apply after a short delay to catch any late-rendered elements
    const timer = setTimeout(forceCardStyling, 100);

    return () => clearTimeout(timer);
  }, [isDarkTheme]);

  // Load data on component mount
  useEffect(() => {
    if (id) {
      loadGuestData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <style>
        {`
          /* Nuclear option - override everything with maximum specificity */
          div[class*="ant-card"] {
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            background: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          /* Target specific CSS classes that Ant Design generates */
          .css-dev-only-do-not-override-1ae8k9u,
          [class*="css-dev-only-do-not-override"] {
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            background: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          /* Ultra high specificity for all possible selectors */
          html body div.page-wrapper div.content div.ant-card,
          html body div.page-wrapper div.content .ant-card,
          html body .page-wrapper .content .ant-card,
          html body .ant-card,
          .ant-card,
          .wedding-guest-form {
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            background: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          /* Form elements */
          .wedding-guest-form .ant-form-item-label > label {
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
          }

          .wedding-guest-form .ant-input,
          .wedding-guest-form .ant-input-number-input,
          .wedding-guest-form .ant-select-selector,
          .wedding-guest-form textarea {
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
            background-color: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
            border-color: ${isDarkTheme ? '#434343' : '#d9d9d9'} !important;
            background: ${isDarkTheme ? '#1f1f1f' : '#ffffff'} !important;
          }

          .wedding-guest-form .ant-input::placeholder,
          .wedding-guest-form .ant-input-number-input::placeholder,
          .wedding-guest-form textarea::placeholder {
            color: ${isDarkTheme ? '#888888' : '#999999'} !important;
          }

          .wedding-guest-form .ant-select-selection-item {
            color: ${isDarkTheme ? '#ffffff' : '#000000'} !important;
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
          html[data-layout-mode="dark_mode"] .wedding-guest-form,
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
          html[data-layout-mode="light_mode"] .wedding-guest-form,
          body.light-mode .page-wrapper .content .ant-card,
          body.light .page-wrapper .content .ant-card {
            background-color: #FAFBFE !important;
            background: #FAFBFE !important;
            border-color: #d9d9d9 !important;
            color: #000000 !important;
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
                Chỉnh sửa khách mời đám cưới
              </h4>
              <h6>Cập nhật thông tin khách mời</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/wedding-guest-list">
              <Button
                type="default"
                icon={<ArrowLeft size={16} />}
              >
                Quay lại
              </Button>
            </Link>
          </div>
        </div>

        {/* Form */}
        <Card
          className="wedding-guest-form"
          style={{
            backgroundColor: isDarkTheme ? '#141432' : '#FAFBFE',
            borderColor: isDarkTheme ? '#434343' : '#d9d9d9',
            color: isDarkTheme ? '#ffffff' : '#000000',
            background: isDarkTheme ? '#141432' : '#FAFBFE'
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            className="wedding-guest-form"
          >
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={getLabelStyle()}>Tên khách mời</span>}
                  name="name"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên khách mời!' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                  ]}
                >
                  <Input placeholder="Nhập tên khách mời" style={getInputStyle()} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={getLabelStyle()}>Đơn vị</span>}
                  name="unit"
                  rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
                >
                  <Input placeholder="Nhập đơn vị" style={getInputStyle()} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label={<span style={getLabelStyle()}>Số người</span>}
                  name="numberOfPeople"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số người!' },
                    { type: 'number', min: 1, message: 'Số người phải lớn hơn 0!' }
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số người"
                    style={{ width: '100%', ...getInputStyle() }}
                    min={1}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  label={<span style={getLabelStyle()}>Số tiền mừng (VND)</span>}
                  name="giftAmount"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số tiền mừng!' },
                    { type: 'number', min: 0, message: 'Số tiền phải lớn hơn hoặc bằng 0!' }
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số tiền mừng"
                    style={{ width: '100%', ...getInputStyle() }}
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  label={<span style={getLabelStyle()}>Trạng thái</span>}
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select placeholder="Chọn trạng thái" style={getInputStyle()}>
                    <Option value="Going">✅ Đi</Option>
                    <Option value="NotGoing">❌ Không đi</Option>
                    <Option value="Pending">⏳ Chưa xác nhận</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span style={getLabelStyle()}>Mối quan hệ</span>}
                  name="relationship"
                  rules={[{ required: true, message: 'Vui lòng chọn mối quan hệ!' }]}
                >
                  <Select placeholder="Chọn mối quan hệ" style={getInputStyle()}>
                    <Option value="Family">👨‍👩‍👧‍👦 Gia đình</Option>
                    <Option value="Friend">👫 Bạn bè</Option>
                    <Option value="Colleague">💼 Đồng nghiệp</Option>
                    <Option value="Relative">👥 Họ hàng</Option>
                    <Option value="Other">🤝 Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  label={<span style={getLabelStyle()}>Ghi chú</span>}
                  name="notes"
                >
                  <TextArea
                    placeholder="Nhập ghi chú (tùy chọn)"
                    rows={4}
                    maxLength={500}
                    showCount
                    style={getInputStyle()}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <Link to="/wedding-guest-list">
                    <Button type="default">
                      Hủy
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<Save size={16} />}
                    style={{ backgroundColor: '#ff69b4', borderColor: '#ff69b4' }}
                  >
                    Cập nhật khách mời
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditWeddingGuest;
