import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, Button, Card, message, Row, Col } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Heart } from 'react-feather';
import { weddingGuestService } from '../../services/weddingGuestService';

const { Option } = Select;
const { TextArea } = Input;

const AddWeddingGuest = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      console.log('📤 Creating guest with values:', values);

      // Prepare create data according to API model (không gửi id, createdDate, createdBy)
      const createData = {
        name: values.name,
        unit: values.unit,
        numberOfPeople: values.numberOfPeople,
        giftAmount: values.giftAmount,
        status: values.status,
        relationship: values.relationship,
        notes: values.notes || '',
        updatedDate: new Date().toISOString(),
        updatedBy: 'current-user', // You might want to get this from auth context
        isActive: true
      };

      console.log('📤 Final create data:', createData);

      const response = await weddingGuestService.createWeddingGuest(createData);

      if (response.success) {
        message.success('Thêm khách mời thành công!');
        navigate('/wedding-guest-list');
      } else {
        message.error(response.message || 'Failed to create guest');
      }
    } catch (error) {
      console.error('Error creating guest:', error);
      message.error('An error occurred while creating guest');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrapper">
      <style>
        {`
          /* Force light theme styles for all form elements */
          .page-wrapper .content .ant-form-item-label > label,
          .page-wrapper .content .ant-form-item label {
            color: #000000 !important;
          }

          .page-wrapper .content .ant-input,
          .page-wrapper .content .ant-input-number,
          .page-wrapper .content .ant-input-number-input,
          .page-wrapper .content .ant-select-selection-item,
          .page-wrapper .content .ant-select-selector,
          .page-wrapper .content .ant-select-single .ant-select-selector,
          .page-wrapper .content textarea.ant-input {
            color: #000000 !important;
            background-color: #ffffff !important;
            border-color: #d9d9d9 !important;
          }

          .page-wrapper .content .ant-input:focus,
          .page-wrapper .content .ant-input-number:focus,
          .page-wrapper .content .ant-input-number-input:focus,
          .page-wrapper .content .ant-select-focused .ant-select-selector,
          .page-wrapper .content textarea.ant-input:focus {
            color: #000000 !important;
            background-color: #ffffff !important;
            border-color: #40a9ff !important;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
          }

          .page-wrapper .content .ant-input::placeholder,
          .page-wrapper .content .ant-input-number-input::placeholder,
          .page-wrapper .content textarea.ant-input::placeholder {
            color: #999999 !important;
          }

          .page-wrapper .content .ant-card {
            background-color: #ffffff !important;
            border-color: #d9d9d9 !important;
          }

          /* Dark theme overrides */
          [data-theme="dark"] .page-wrapper .content .ant-form-item-label > label,
          [data-theme="dark"] .page-wrapper .content .ant-form-item label {
            color: #ffffff !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-input,
          [data-theme="dark"] .page-wrapper .content .ant-input-number,
          [data-theme="dark"] .page-wrapper .content .ant-input-number-input,
          [data-theme="dark"] .page-wrapper .content .ant-select-selection-item,
          [data-theme="dark"] .page-wrapper .content .ant-select-selector,
          [data-theme="dark"] .page-wrapper .content .ant-select-single .ant-select-selector,
          [data-theme="dark"] .page-wrapper .content textarea.ant-input {
            color: #ffffff !important;
            background-color: #1f1f1f !important;
            border-color: #434343 !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-input:focus,
          [data-theme="dark"] .page-wrapper .content .ant-input-number:focus,
          [data-theme="dark"] .page-wrapper .content .ant-input-number-input:focus,
          [data-theme="dark"] .page-wrapper .content .ant-select-focused .ant-select-selector,
          [data-theme="dark"] .page-wrapper .content textarea.ant-input:focus {
            color: #ffffff !important;
            background-color: #1f1f1f !important;
            border-color: #177ddc !important;
            box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2) !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-input::placeholder,
          [data-theme="dark"] .page-wrapper .content .ant-input-number-input::placeholder,
          [data-theme="dark"] .page-wrapper .content textarea.ant-input::placeholder {
            color: #888888 !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-card {
            background-color: #1f1f1f !important;
            border-color: #434343 !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-select-dropdown {
            background-color: #1f1f1f !important;
            border-color: #434343 !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-select-item {
            color: #ffffff !important;
            background-color: #1f1f1f !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-select-item:hover {
            background-color: #434343 !important;
            color: #ffffff !important;
          }

          [data-theme="dark"] .page-wrapper .content .ant-select-item-option-selected {
            background-color: #177ddc !important;
            color: #ffffff !important;
          }

          /* System dark theme detection */
          @media (prefers-color-scheme: dark) {
            body:not([data-theme="light"]) .page-wrapper .content .ant-form-item-label > label,
            body:not([data-theme="light"]) .page-wrapper .content .ant-form-item label {
              color: #ffffff !important;
            }

            body:not([data-theme="light"]) .page-wrapper .content .ant-input,
            body:not([data-theme="light"]) .page-wrapper .content .ant-input-number,
            body:not([data-theme="light"]) .page-wrapper .content .ant-input-number-input,
            body:not([data-theme="light"]) .page-wrapper .content .ant-select-selection-item,
            body:not([data-theme="light"]) .page-wrapper .content .ant-select-selector,
            body:not([data-theme="light"]) .page-wrapper .content .ant-select-single .ant-select-selector,
            body:not([data-theme="light"]) .page-wrapper .content textarea.ant-input {
              color: #ffffff !important;
              background-color: #1f1f1f !important;
              border-color: #434343 !important;
            }

            body:not([data-theme="light"]) .page-wrapper .content .ant-input::placeholder,
            body:not([data-theme="light"]) .page-wrapper .content .ant-input-number-input::placeholder,
            body:not([data-theme="light"]) .page-wrapper .content textarea.ant-input::placeholder {
              color: #888888 !important;
            }

            body:not([data-theme="light"]) .page-wrapper .content .ant-card {
              background-color: #1f1f1f !important;
              border-color: #434343 !important;
            }
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
                Thêm khách mời đám cưới
              </h4>
              <h6>Thêm khách mời mới vào danh sách</h6>
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
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            initialValues={{
              numberOfPeople: 1,
              giftAmount: 0,
              status: 'Pending'
            }}
          >
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tên khách mời"
                  name="name"
                  rules={[
                    { required: true, message: 'Vui lòng nhập tên khách mời!' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                  ]}
                >
                  <Input placeholder="Nhập tên khách mời" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Đơn vị"
                  name="unit"
                  rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
                >
                  <Input placeholder="Nhập đơn vị" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Số người"
                  name="numberOfPeople"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số người!' },
                    { type: 'number', min: 1, message: 'Số người phải lớn hơn 0!' }
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số người"
                    style={{ width: '100%' }}
                    min={1}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  label="Số tiền mừng (VND)"
                  name="giftAmount"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số tiền mừng!' },
                    { type: 'number', min: 0, message: 'Số tiền phải lớn hơn hoặc bằng 0!' }
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số tiền mừng"
                    style={{ width: '100%' }}
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select placeholder="Chọn trạng thái">
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
                  label="Mối quan hệ"
                  name="relationship"
                  rules={[{ required: true, message: 'Vui lòng chọn mối quan hệ!' }]}
                >
                  <Select placeholder="Chọn mối quan hệ">
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
                  label="Ghi chú"
                  name="notes"
                >
                  <TextArea
                    placeholder="Nhập ghi chú (tùy chọn)"
                    rows={4}
                    maxLength={500}
                    showCount
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
                    Thêm khách mời
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

export default AddWeddingGuest;
