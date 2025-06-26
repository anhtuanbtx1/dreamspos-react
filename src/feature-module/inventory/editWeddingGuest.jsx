import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, message, Spin } from 'antd';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Users, FileText, Gift } from 'react-feather';
import { weddingGuestService } from '../../services/weddingGuestService';
import { LoadingButton } from '../../components/Loading';

const { Option } = Select;
const { TextArea } = Input;

const EditWeddingGuest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestData, setGuestData] = useState(null);



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
          /* Dropdown Lists Dark Theme Styling for Edit Wedding Guest */

          /* Light Mode Dropdown Styling */
          html[data-layout-mode="light_mode"] .ant-select-selector,
          html[data-layout-mode="light_mode"] .ant-select-single .ant-select-selector,
          body.light-mode .ant-select-selector,
          body.light .ant-select-selector {
            background-color: #ffffff !important;
            border-color: #d9d9d9 !important;
            color: #000000 !important;
          }

          html[data-layout-mode="light_mode"] .ant-select-dropdown,
          body.light-mode .ant-select-dropdown,
          body.light .ant-select-dropdown {
            background-color: #ffffff !important;
            border-color: #d9d9d9 !important;
          }

          html[data-layout-mode="light_mode"] .ant-select-item,
          body.light-mode .ant-select-item,
          body.light .ant-select-item {
            color: #000000 !important;
            background-color: #ffffff !important;
          }

          html[data-layout-mode="light_mode"] .ant-select-item:hover,
          body.light-mode .ant-select-item:hover,
          body.light .ant-select-item:hover {
            background-color: #f5f5f5 !important;
            color: #000000 !important;
          }

          html[data-layout-mode="light_mode"] .ant-select-item-option-selected,
          body.light-mode .ant-select-item-option-selected,
          body.light .ant-select-item-option-selected {
            background-color: #1890ff !important;
            color: #ffffff !important;
          }

          /* Dark Mode Dropdown Styling */
          html[data-layout-mode="dark_mode"] .ant-select-selector,
          html[data-layout-mode="dark_mode"] .ant-select-single .ant-select-selector,
          body.dark-mode .ant-select-selector,
          body.dark .ant-select-selector {
            background-color: #141432 !important;
            border-color: #434343 !important;
            color: #ffffff !important;
          }

          html[data-layout-mode="dark_mode"] .ant-select-dropdown,
          body.dark-mode .ant-select-dropdown,
          body.dark .ant-select-dropdown {
            background-color: #141432 !important;
            border-color: #434343 !important;
            box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.2) !important;
          }

          html[data-layout-mode="dark_mode"] .ant-select-item,
          body.dark-mode .ant-select-item,
          body.dark .ant-select-item {
            color: #ffffff !important;
            background-color: #141432 !important;
          }

          html[data-layout-mode="dark_mode"] .ant-select-item:hover,
          body.dark-mode .ant-select-item:hover,
          body.dark .ant-select-item:hover {
            background-color: #434343 !important;
            color: #ffffff !important;
          }

          html[data-layout-mode="dark_mode"] .ant-select-item-option-selected,
          body.dark-mode .ant-select-item-option-selected,
          body.dark .ant-select-item-option-selected {
            background-color: #177ddc !important;
            color: #ffffff !important;
          }

          /* Dropdown Arrow Icon Dark Mode */
          html[data-layout-mode="dark_mode"] .ant-select-arrow,
          body.dark-mode .ant-select-arrow,
          body.dark .ant-select-arrow {
            color: #ffffff !important;
          }

          /* Focus States for Dark Mode */
          html[data-layout-mode="dark_mode"] .ant-select-focused .ant-select-selector,
          body.dark-mode .ant-select-focused .ant-select-selector,
          body.dark .ant-select-focused .ant-select-selector {
            background-color: #141432 !important;
            border-color: #177ddc !important;
            box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2) !important;
          }

          /* Placeholder Text Dark Mode */
          html[data-layout-mode="dark_mode"] .ant-select-selection-placeholder,
          body.dark-mode .ant-select-selection-placeholder,
          body.dark .ant-select-selection-placeholder {
            color: #888888 !important;
          }

          /* Input Number Dark Mode Styling */
          html[data-layout-mode="dark_mode"] .ant-input-number,
          html[data-layout-mode="dark_mode"] .ant-input-number-input,
          body.dark-mode .ant-input-number,
          body.dark .ant-input-number {
            background-color: #141432 !important;
            border-color: #434343 !important;
            color: #ffffff !important;
          }

          html[data-layout-mode="dark_mode"] .ant-input-number:focus,
          html[data-layout-mode="dark_mode"] .ant-input-number-focused,
          body.dark-mode .ant-input-number:focus,
          body.dark .ant-input-number:focus {
            background-color: #141432 !important;
            border-color: #177ddc !important;
            box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2) !important;
          }

          /* TextArea Dark Mode Styling */
          html[data-layout-mode="dark_mode"] .ant-input,
          html[data-layout-mode="dark_mode"] textarea.ant-input,
          body.dark-mode .ant-input,
          body.dark textarea.ant-input {
            background-color: #141432 !important;
            border-color: #434343 !important;
            color: #ffffff !important;
          }

          html[data-layout-mode="dark_mode"] .ant-input:focus,
          html[data-layout-mode="dark_mode"] textarea.ant-input:focus,
          body.dark-mode .ant-input:focus,
          body.dark textarea.ant-input:focus {
            background-color: #141432 !important;
            border-color: #177ddc !important;
            box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2) !important;
          }

          /* Placeholder Text for Inputs */
          html[data-layout-mode="dark_mode"] .ant-input::placeholder,
          html[data-layout-mode="dark_mode"] .ant-input-number-input::placeholder,
          html[data-layout-mode="dark_mode"] textarea.ant-input::placeholder,
          body.dark-mode .ant-input::placeholder,
          body.dark .ant-input::placeholder {
            color: #888888 !important;
          }
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
              <h4>Chỉnh sửa khách mời đám cưới</h4>
              <h6>Cập nhật thông tin khách mời cho đám cưới</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/wedding-guest-list" className="btn btn-added">
              <ArrowLeft className="me-2" size={16} />
              Quay lại danh sách
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <div className="row">
                {/* Guest Basic Info */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <FileText size={20} />
                    </div>
                    <h5>Thông tin khách mời</h5>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Tên khách mời <span className="text-danger">*</span></label>
                    <Form.Item
                      name="name"
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên khách mời!' },
                        { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        placeholder="Nhập tên khách mời"
                        className="form-control"
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Đơn vị <span className="text-danger">*</span></label>
                    <Form.Item
                      name="unit"
                      rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        placeholder="Nhập đơn vị"
                        className="form-control"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Guest Details */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <Users size={20} />
                    </div>
                    <h5>Chi tiết khách mời</h5>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="mb-3">
                    <label className="form-label">Số người <span className="text-danger">*</span></label>
                    <Form.Item
                      name="numberOfPeople"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số người!' },
                        { type: 'number', min: 1, message: 'Số người phải lớn hơn 0!' }
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        placeholder="Nhập số người"
                        style={{ width: '100%' }}
                        min={1}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="mb-3">
                    <label className="form-label">Số tiền mừng (VND) <span className="text-danger">*</span></label>
                    <Form.Item
                      name="giftAmount"
                      rules={[
                        { required: true, message: 'Vui lòng nhập số tiền mừng!' },
                        { type: 'number', min: 0, message: 'Số tiền phải lớn hơn hoặc bằng 0!' }
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        placeholder="Nhập số tiền mừng"
                        style={{ width: '100%' }}
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="mb-3">
                    <label className="form-label">Trạng thái <span className="text-danger">*</span></label>
                    <Form.Item
                      name="status"
                      rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        placeholder="Chọn trạng thái"
                        style={{ width: '100%' }}
                      >
                        <Option value="Confirmed">✅ Đã xác nhận</Option>
                        <Option value="Pending">⏳ Chưa xác nhận</Option>
                        <Option value="Cancelled">❌ Hủy</Option>
                        <Option value="Attended">👥 Đã tham dự</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Additional Info */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <Gift size={20} />
                    </div>
                    <h5>Thông tin bổ sung</h5>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Mối quan hệ <span className="text-danger">*</span></label>
                    <Form.Item
                      name="relationship"
                      rules={[{ required: true, message: 'Vui lòng chọn mối quan hệ!' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        placeholder="Chọn mối quan hệ"
                        style={{ width: '100%' }}
                      >
                        <Option value="Family">👨‍👩‍👧‍👦 Gia đình</Option>
                        <Option value="Friend">👫 Bạn bè</Option>
                        <Option value="Colleague">💼 Đồng nghiệp</Option>
                        <Option value="Relative">👥 Họ hàng</Option>
                        <Option value="Other">🤝 Khác</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="mb-3">
                    <label className="form-label">Ghi chú</label>
                    <Form.Item
                      name="notes"
                      style={{ marginBottom: 0 }}
                    >
                      <TextArea
                        placeholder="Nhập ghi chú (tùy chọn)"
                        rows={4}
                        maxLength={500}
                        showCount
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              {/* Submit Buttons */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="btn-addproduct mb-4 d-flex align-items-center gap-3">
                    <LoadingButton
                      type="submit"
                      variant="primary"
                      size="medium"
                      loading={submitting}
                      loadingText="Đang cập nhật khách mời..."
                      className="create-project-btn"
                      icon={<Save size={16} />}
                    >
                      Cập nhật khách mời
                    </LoadingButton>

                    <Link to="/wedding-guest-list" className="btn btn-cancel btn-cancel-project">
                      Hủy
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWeddingGuest;
