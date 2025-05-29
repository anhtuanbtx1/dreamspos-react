import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DatePicker, Select, Input } from 'antd';
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Target,
  Clock,
  FileText
} from 'feather-icons-react';
import { LoadingButton } from '../../components/Loading';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'planning',
    startDate: dayjs(),
    endDate: dayjs().add(1, 'month'),
    budget: '',
    client: '',
    manager: [],
    teamMembers: [],
    tags: [],
    attachments: []
  });

  const [errors, setErrors] = useState({});

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

  // Sample data
  const categories = [
    { value: 'web-development', label: 'Web Development', color: 'blue' },
    { value: 'mobile-app', label: 'Mobile App', color: 'green' },
    { value: 'design', label: 'Design', color: 'purple' },
    { value: 'marketing', label: 'Marketing', color: 'orange' },
    { value: 'devops', label: 'DevOps', color: 'cyan' },
    { value: 'data-science', label: 'Data Science', color: 'red' }
  ];

  const managers = [
    { value: 'john-smith', label: 'John Smith', initials: 'JS' },
    { value: 'sarah-johnson', label: 'Sarah Johnson', initials: 'SJ' },
    { value: 'mike-wilson', label: 'Mike Wilson', initials: 'MW' },
    { value: 'lisa-chen', label: 'Lisa Chen', initials: 'LC' }
  ];

  const teamMembers = [
    { value: 'alex-rodriguez', label: 'Alex Rodriguez', initials: 'AR' },
    { value: 'maria-garcia', label: 'Maria Garcia', initials: 'MG' },
    { value: 'david-brown', label: 'David Brown', initials: 'DB' },
    { value: 'emma-davis', label: 'Emma Davis', initials: 'ED' },
    { value: 'james-miller', label: 'James Miller', initials: 'JM' }
  ];

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

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Client name is required';
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }

    if (formData.manager.length === 0) {
      newErrors.manager = 'Please assign at least one manager';
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Project created:', formData);
      
      // Reset form or redirect
      alert('Project created successfully!');
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
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
                      className={`form-control ${errors.client ? 'is-invalid' : ''}`}
                      value={formData.client}
                      onChange={(e) => handleInputChange('client', e.target.value)}
                      placeholder="Enter client name"
                    />
                    {errors.client && <div className="invalid-feedback">{errors.client}</div>}
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
                      value={formData.category}
                      onChange={(value) => handleInputChange('category', value)}
                      className={`project-select ${errors.category ? 'is-invalid' : ''}`}
                      placeholder="Select category"
                    >
                      {categories.map(cat => (
                        <Option key={cat.value} value={cat.value}>
                          <span className={`badge badge-${cat.color} me-2`}></span>
                          {cat.label}
                        </Option>
                      ))}
                    </Select>
                    {errors.category && <div className="invalid-feedback d-block">{errors.category}</div>}
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
                {/* Timeline & Budget */}
                <div className="col-lg-12">
                  <div className="form-group-header">
                    <div className="form-group-icon">
                      <Clock size={20} />
                    </div>
                    <h5>Timeline & Budget</h5>
                  </div>
                </div>

                <div className="col-lg-4">
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

                <div className="col-lg-4">
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

                <div className="col-lg-4">
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
                    <label className="form-label">Project Manager <span className="text-danger">*</span></label>
                    <Select
                      mode="multiple"
                      value={formData.manager}
                      onChange={(value) => handleInputChange('manager', value)}
                      className={`project-select ${errors.manager ? 'is-invalid' : ''}`}
                      placeholder="Select project manager(s)"
                      optionLabelProp="label"
                    >
                      {managers.map(manager => (
                        <Option key={manager.value} value={manager.value} label={manager.label}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <UserAvatar initials={manager.initials} name={manager.label} />
                            {manager.label}
                          </div>
                        </Option>
                      ))}
                    </Select>
                    {errors.manager && <div className="invalid-feedback d-block">{errors.manager}</div>}
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
                      placeholder="Select team members"
                      optionLabelProp="label"
                    >
                      {teamMembers.map(member => (
                        <Option key={member.value} value={member.value} label={member.label}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <UserAvatar initials={member.initials} name={member.label} />
                            {member.label}
                          </div>
                        </Option>
                      ))}
                    </Select>
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
