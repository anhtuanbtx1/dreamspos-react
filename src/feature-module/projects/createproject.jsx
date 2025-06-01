import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DatePicker, Select, Input, message } from 'antd';
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Target,
  FileText,
  CheckCircle,
  TrendingUp
} from 'feather-icons-react';
import { LoadingButton } from '../../components/Loading';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    clientName: '',
    categoryId: '',
    priority: 'medium',
    status: 'planning',
    startDate: dayjs(),
    endDate: dayjs().add(1, 'month'),
    budget: '',
    progressPercentage: 0,
    managers: [],
    teamMembers: [],
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // Load categories from API
  const loadCategories = async () => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}ProjectCategories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCategories(result.data || []);
      } else {
        console.error('Failed to load categories');
        // Fallback to sample data
        setCategories([
          { id: 1, name: 'Web Development', color: 'blue' },
          { id: 2, name: 'Mobile App', color: 'green' },
          { id: 3, name: 'Design', color: 'purple' },
          { id: 4, name: 'Marketing', color: 'orange' }
        ]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to sample data
      setCategories([
        { id: 1, name: 'Web Development', color: 'blue' },
        { id: 2, name: 'Mobile App', color: 'green' },
        { id: 3, name: 'Design', color: 'purple' },
        { id: 4, name: 'Marketing', color: 'orange' }
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Load users from API
  const loadUsers = async () => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}Users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
      } else {
        console.error('Failed to load users');
        // Fallback to sample data
        setUsers([
          { id: 1, fullName: 'John Smith', email: 'john@example.com' },
          { id: 2, fullName: 'Sarah Johnson', email: 'sarah@example.com' },
          { id: 3, fullName: 'Mike Wilson', email: 'mike@example.com' },
          { id: 4, fullName: 'Lisa Chen', email: 'lisa@example.com' }
        ]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to sample data
      setUsers([
        { id: 1, fullName: 'John Smith', email: 'john@example.com' },
        { id: 2, fullName: 'Sarah Johnson', email: 'sarah@example.com' },
        { id: 3, fullName: 'Mike Wilson', email: 'mike@example.com' },
        { id: 4, fullName: 'Lisa Chen', email: 'lisa@example.com' }
      ]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadCategories();
    loadUsers();
  }, []);

  // Avatar component with initials fallback
  const UserAvatar = ({ initials, name }) => (
    <div
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff9f43, #e8890a)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: '600',
        marginRight: '8px',
        flexShrink: 0
      }}
      title={name}
    >
      {initials}
    </div>
  );

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    if (formData.progressPercentage < 0 || formData.progressPercentage > 100) {
      newErrors.progressPercentage = 'Progress must be between 0 and 100';
    }

    if (dayjs(formData.endDate).isBefore(dayjs(formData.startDate))) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

      // Prepare data for API - Simple format
      const projectData = {
        projectName: formData.projectName,
        description: formData.description,
        clientName: formData.clientName,
        categoryId: parseInt(formData.categoryId),
        priority: formData.priority,
        status: formData.status,
        startDate: formData.startDate.format('YYYY-MM-DD'),
        endDate: formData.endDate.format('YYYY-MM-DD'),
        budget: parseFloat(formData.budget),
        progressPercentage: parseInt(formData.progressPercentage)
      };

      console.log('Sending project data:', projectData);

      const response = await fetch(`${apiBaseUrl}Projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Project created successfully:', result);

        message.success('Project created successfully!');

        // Redirect to project list
        setTimeout(() => {
          navigate('/project-tracker');
        }, 1500);

      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        message.error(errorData.message || 'Failed to create project. Please try again.');
      }

    } catch (error) {
      console.error('Error creating project:', error);
      message.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Header */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Create New Project</h4>
              <h6>Add a new project to your workspace</h6>
            </div>
          </div>
          <div className="page-btn">
            <Link to="/project-tracker" className="btn btn-secondary">
              <ArrowLeft size={16} className="me-2" />
              Back to Projects
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Project Basic Info */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <FileText size={20} />
                    </div>
                    <h5>Project Information</h5>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Project Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
                      value={formData.projectName}
                      onChange={(e) => handleInputChange('projectName', e.target.value)}
                      placeholder="Enter project name"
                    />
                    {errors.projectName && <div className="invalid-feedback">{errors.projectName}</div>}
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Client Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className={`form-control ${errors.clientName ? 'is-invalid' : ''}`}
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Enter client name"
                    />
                    {errors.clientName && <div className="invalid-feedback">{errors.clientName}</div>}
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="mb-3">
                    <label className="form-label">Project Description <span className="text-danger">*</span></label>
                    <TextArea
                      rows={4}
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your project goals, requirements, and deliverables..."
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Project Settings */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <Target size={20} />
                    </div>
                    <h5>Project Settings</h5>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="mb-3">
                    <label className="form-label">Category <span className="text-danger">*</span></label>
                    <Select
                      value={formData.categoryId}
                      onChange={(value) => handleInputChange('categoryId', value)}
                      className={`project-select ${errors.categoryId ? 'is-invalid' : ''}`}
                      placeholder="Select category"
                      loading={categoriesLoading}
                    >
                      {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>
                          <span className={`badge badge-${cat.color || 'primary'} me-2`}></span>
                          {cat.name}
                        </Option>
                      ))}
                    </Select>
                    {errors.categoryId && <div className="invalid-feedback d-block">{errors.categoryId}</div>}
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <Select
                      value={formData.priority}
                      onChange={(value) => handleInputChange('priority', value)}
                      className="project-select"
                    >
                      <Option value="low">
                        <span className="badge badge-success me-2"></span>
                        Low Priority
                      </Option>
                      <Option value="medium">
                        <span className="badge badge-warning me-2"></span>
                        Medium Priority
                      </Option>
                      <Option value="high">
                        <span className="badge badge-danger me-2"></span>
                        High Priority
                      </Option>
                    </Select>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <Select
                      value={formData.status}
                      onChange={(value) => handleInputChange('status', value)}
                      className="project-select"
                    >
                      <Option value="planning">Planning</Option>
                      <Option value="in-progress">In Progress</Option>
                      <Option value="review">Review</Option>
                      <Option value="completed">Completed</Option>
                      <Option value="on-hold">On Hold</Option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Timeline, Budget & Progress */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <TrendingUp size={20} />
                    </div>
                    <h5>Timeline, Budget & Progress</h5>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <DatePicker
                      value={formData.startDate}
                      onChange={(date) => handleInputChange('startDate', date)}
                      className="form-control project-date-picker"
                      format="DD/MM/YYYY"
                      suffixIcon={<Calendar size={16} />}
                    />
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <DatePicker
                      value={formData.endDate}
                      onChange={(date) => handleInputChange('endDate', date)}
                      className={`form-control project-date-picker ${errors.endDate ? 'is-invalid' : ''}`}
                      format="DD/MM/YYYY"
                      suffixIcon={<Calendar size={16} />}
                    />
                    {errors.endDate && <div className="invalid-feedback d-block">{errors.endDate}</div>}
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="mb-3">
                    <label className="form-label">Budget <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <DollarSign size={16} />
                      </span>
                      <input
                        type="text"
                        className={`form-control ${errors.budget ? 'is-invalid' : ''}`}
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.budget && <div className="invalid-feedback">{errors.budget}</div>}
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="mb-3">
                    <label className="form-label">Progress Percentage</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className={`form-control ${errors.progressPercentage ? 'is-invalid' : ''}`}
                        value={formData.progressPercentage}
                        onChange={(e) => handleInputChange('progressPercentage', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                      <span className="input-group-text">%</span>
                    </div>
                    {errors.progressPercentage && <div className="invalid-feedback">{errors.progressPercentage}</div>}
                    <small className="form-text text-muted">Enter progress from 0 to 100</small>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Team Assignment */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <Users size={20} />
                    </div>
                    <h5>Team Assignment</h5>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Project Manager</label>
                    <Select
                      mode="multiple"
                      value={formData.managers}
                      onChange={(value) => handleInputChange('managers', value)}
                      className="project-select"
                      placeholder="Select project manager(s) (Optional)"
                      optionLabelProp="label"
                      loading={usersLoading}
                      allowClear
                    >
                      {users.map(user => (
                        <Option key={user.id} value={user.id} label={user.fullName}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <UserAvatar initials={getInitials(user.fullName)} name={user.fullName} />
                            <div>
                              <div>{user.fullName}</div>
                              <small style={{ color: '#666' }}>{user.email}</small>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                    <small className="form-text text-muted">You can assign managers later</small>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="mb-3">
                    <label className="form-label">Team Members</label>
                    <Select
                      mode="multiple"
                      value={formData.teamMembers}
                      onChange={(value) => handleInputChange('teamMembers', value)}
                      className="project-select"
                      placeholder="Select team members (Optional)"
                      optionLabelProp="label"
                      loading={usersLoading}
                      allowClear
                    >
                      {users.map(user => (
                        <Option key={user.id} value={user.id} label={user.fullName}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <UserAvatar initials={getInitials(user.fullName)} name={user.fullName} />
                            <div>
                              <div>{user.fullName}</div>
                              <small style={{ color: '#666' }}>{user.email}</small>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                    <small className="form-text text-muted">You can assign team members later</small>
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
                      loading={loading}
                      loadingText="Creating Project..."
                      className="create-project-btn"
                      icon={<CheckCircle size={16} />}
                    >
                      Create Project
                    </LoadingButton>

                    <Link to="/project-tracker" className="btn btn-cancel btn-cancel-project">
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
