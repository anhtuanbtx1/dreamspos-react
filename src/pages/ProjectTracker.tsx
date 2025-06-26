import React, { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Plus, Filter, Search } from "feather-icons-react";
import Select from "react-select";

interface Project {
  id: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  budget: number;
  team: string[];
  description: string;
}

const ProjectTracker: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "🚀 Website Redesign",
      category: "Web Development",
      startDate: "2024-01-15",
      endDate: "2024-03-15",
      progress: 75,
      status: "In Progress",
      budget: 50000000,
      team: ["John Doe", "Jane Smith", "Mike Johnson"],
      description: "Complete redesign of company website with modern UI/UX"
    },
    {
      id: 2,
      name: "📱 Mobile App Development",
      category: "Mobile Development",
      startDate: "2024-02-01",
      endDate: "2024-06-01",
      progress: 45,
      status: "In Progress",
      budget: 120000000,
      team: ["Sarah Wilson", "David Brown", "Lisa Chen"],
      description: "Native mobile application for iOS and Android platforms"
    },
    {
      id: 3,
      name: "🔒 Security Audit",
      category: "Security",
      startDate: "2024-01-01",
      endDate: "2024-02-01",
      progress: 100,
      status: "Completed",
      budget: 25000000,
      team: ["Alex Turner", "Emma Davis"],
      description: "Comprehensive security audit and vulnerability assessment"
    },
    {
      id: 4,
      name: "☁️ Cloud Migration",
      category: "Infrastructure",
      startDate: "2024-03-01",
      endDate: "2024-05-01",
      progress: 20,
      status: "Planning",
      budget: 80000000,
      team: ["Tom Wilson", "Rachel Green", "Chris Lee"],
      description: "Migration of legacy systems to cloud infrastructure"
    },
    {
      id: 5,
      name: "📊 Data Analytics Platform",
      category: "Data Science",
      startDate: "2024-02-15",
      endDate: "2024-07-15",
      progress: 60,
      status: "In Progress",
      budget: 95000000,
      team: ["Kevin Zhang", "Maria Garcia", "James Park"],
      description: "Advanced analytics platform for business intelligence"
    }
  ]);

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, categoryFilter]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Completed": { bg: "#e8f5e8", color: "#28a745", border: "#c3e6cb" },
      "In Progress": { bg: "#e3f2fd", color: "#1565c0", border: "#bbdefb" },
      "Planning": { bg: "#fff3cd", color: "#856404", border: "#ffeaa7" },
      "On Hold": { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Planning"];

    return (
      <span
        style={{
          display: 'inline-block',
          padding: '6px 12px',
          backgroundColor: config.bg,
          color: config.color,
          borderRadius: '20px',
          fontSize: '13px',
          fontWeight: '600',
          border: `1px solid ${config.border}`,
          minWidth: '100px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {status}
      </span>
    );
  };

  const getProgressBar = (progress: number) => {
    let progressColor = "#28a745";
    if (progress < 30) progressColor = "#dc3545";
    else if (progress < 70) progressColor = "#ffc107";

    return (
      <div style={{ width: '100%', backgroundColor: '#e9ecef', borderRadius: '10px', height: '8px' }}>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: progressColor,
            height: '100%',
            borderRadius: '10px',
            transition: 'width 0.3s ease'
          }}
        />
        <small style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px', display: 'block' }}>
          {progress}%
        </small>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "Planning", label: "📋 Planning" },
    { value: "In Progress", label: "🔄 In Progress" },
    { value: "Completed", label: "✅ Completed" },
    { value: "On Hold", label: "⏸️ On Hold" }
  ];

  const categoryOptions = [
    { value: "", label: "Tất cả danh mục" },
    { value: "Web Development", label: "🌐 Web Development" },
    { value: "Mobile Development", label: "📱 Mobile Development" },
    { value: "Security", label: "🔒 Security" },
    { value: "Infrastructure", label: "☁️ Infrastructure" },
    { value: "Data Science", label: "📊 Data Science" }
  ];

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteProject = (projectId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setIsEditing(false);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="row align-items-center">
            <div className="col-lg-8 col-sm-12">
              <h3 className="page-title">🎯 Project Tracker</h3>
              <p className="text-muted">Quản lý và theo dõi tiến độ dự án</p>
            </div>
            <div className="col-lg-4 col-sm-12 text-end">
              <button className="btn btn-primary">
                <Plus size={16} className="me-2" />
                Thêm dự án mới
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm dự án..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <Select
                  options={statusOptions}
                  value={statusOptions.find(option => option.value === statusFilter)}
                  onChange={(selectedOption) => setStatusFilter(selectedOption?.value || "")}
                  placeholder="Lọc theo trạng thái"
                />
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <Select
                  options={categoryOptions}
                  value={categoryOptions.find(option => option.value === categoryFilter)}
                  onChange={(selectedOption) => setCategoryFilter(selectedOption?.value || "")}
                  placeholder="Lọc theo danh mục"
                />
              </div>
              <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setCategoryFilter("");
                  }}
                >
                  <Filter size={16} className="me-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Dự án</th>
                    <th>Danh mục</th>
                    <th>Ngày bắt đầu</th>
                    <th>Deadline</th>
                    <th>Tiến độ</th>
                    <th>Trạng thái</th>
                    <th>Ngân sách</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{project.name}</h6>
                          <small className="text-muted">
                            Team: {project.team.length} thành viên
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          {project.category}
                        </span>
                      </td>
                      <td>{new Date(project.startDate).toLocaleDateString('vi-VN')}</td>
                      <td>{new Date(project.endDate).toLocaleDateString('vi-VN')}</td>
                      <td style={{ minWidth: '120px' }}>
                        {getProgressBar(project.progress)}
                      </td>
                      <td>{getStatusBadge(project.status)}</td>
                      <td>
                        <span style={{ fontWeight: '600', color: '#7b1fa2' }}>
                          {formatCurrency(project.budget)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewProject(project)}
                            title="Xem chi tiết"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEditProject(project)}
                            title="Chỉnh sửa"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProject(project.id)}
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Project Details Modal */}
        {showModal && selectedProject && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">
                    {isEditing ? "Chỉnh sửa dự án" : "Chi tiết dự án"}
                  </h4>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Tên dự án</h6>
                      <p>{selectedProject.name}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Danh mục</h6>
                      <p>{selectedProject.category}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Ngày bắt đầu</h6>
                      <p>{new Date(selectedProject.startDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Deadline</h6>
                      <p>{new Date(selectedProject.endDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Tiến độ</h6>
                      {getProgressBar(selectedProject.progress)}
                    </div>
                    <div className="col-md-6">
                      <h6>Trạng thái</h6>
                      {getStatusBadge(selectedProject.status)}
                    </div>
                    <div className="col-md-6">
                      <h6>Ngân sách</h6>
                      <p style={{ fontWeight: '600', color: '#7b1fa2' }}>
                        {formatCurrency(selectedProject.budget)}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6>Thành viên team</h6>
                      <p>{selectedProject.team.join(", ")}</p>
                    </div>
                    <div className="col-md-12">
                      <h6>Mô tả</h6>
                      <p>{selectedProject.description}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Đóng
                  </button>
                  {isEditing && (
                    <button type="button" className="btn btn-primary">
                      Lưu thay đổi
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTracker;
