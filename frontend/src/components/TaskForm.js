import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { taskService } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './TaskForm.css';;

/* ─── Custom date input ─────────────────────────────────────── */
const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <button type="button" className="tf-date-trigger" onClick={onClick} ref={ref}>
    {value || 'Select…'}
  </button>
));
CustomDateInput.displayName = 'CustomDateInput';

/* ─── Status dot color ──────────────────────────────────────── */
const DOT_COLORS = {
  PENDING:   { active: '#BA7517', inactive: '#d0cec8' },
  COMPLETED: { active: '#3B6D11', inactive: '#d0cec8' },
};

/* ─── TaskForm ──────────────────────────────────────────────── */
const TaskForm = () => {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title:       '',
    description: '',
    status:      'PENDING',
    dueDate:     new Date(),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskService.getTaskById(id);
      const task     = response.data.data;
      setFormData({
        title:       task.title,
        description: task.description || '',
        status:      task.status,
        dueDate:     task.dueDate ? new Date(task.dueDate) : new Date(),
      });
    } catch {
      toast.error('Failed to fetch task');
      navigate('/');
    }
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const setStatus = (s) =>
    setFormData((prev) => ({ ...prev, status: s }));

  const handleDateChange = (date) =>
    setFormData((prev) => ({ ...prev, dueDate: date }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim())  { toast.error('Title is required');    return; }
    if (!formData.dueDate)       { toast.error('Due date is required'); return; }

    setLoading(true);
    const payload = { ...formData, dueDate: formData.dueDate.toISOString() };

    try {
      if (isEditing) {
        await taskService.updateTask(id, payload);
        toast.success('Task updated');
      } else {
        await taskService.createTask(payload);
        toast.success('Task created');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const charCount = formData.description.length;

  /* ── Due date display ── */
  const dateLabel = formData.dueDate
    ? formData.dueDate.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
    : '—';
  const timeLabel = formData.dueDate
    ? formData.dueDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <>
      <div className="tf-root">
        <form onSubmit={handleSubmit} noValidate>
          <div className="tf-card">

            {/* ── Sidebar ── */}
            <div className="tf-sidebar">
              {/* Heading */}
              <div>
                <span className="tf-eyebrow">
                  {isEditing ? 'Editing entry' : 'New entry'}
                </span>
                <h1 className="tf-heading">
                  {isEditing ? <>Edit<br /><em>task</em></> : <>Create<br /><em>a task</em></>}
                </h1>
              </div>

              {/* Status */}
              <div className="tf-status-group">
                <span className="tf-status-label">Status</span>

                {[
                  { value: 'PENDING',   label: 'Pending'   },
                  { value: 'COMPLETED', label: 'Completed' },
                ].map(({ value, label }) => {
                  const isActive = formData.status === value;
                  const pillClass = isActive
                    ? `tf-pill active-${value.toLowerCase()}`
                    : 'tf-pill';
                  const dotColor = isActive
                    ? DOT_COLORS[value].active
                    : DOT_COLORS[value].inactive;
                  return (
                    <button
                      key={value}
                      type="button"
                      className={pillClass}
                      onClick={() => setStatus(value)}
                    >
                      <span
                        className="tf-dot"
                        style={{ background: dotColor }}
                      />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Due date display (read-only summary; picker is in main panel) */}
              <div className="tf-due-section">
                <span className="tf-eyebrow">Due</span>
                <div className="tf-date-row">
                  <div>
                    <span className="tf-date-sub">Date</span>
                    <div className="tf-date-trigger" style={{ cursor: 'default' }}>
                      {dateLabel}
                    </div>
                  </div>
                  <div>
                    <span className="tf-date-sub">Time</span>
                    <div className="tf-date-trigger" style={{ cursor: 'default' }}>
                      {timeLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Main panel ── */}
            <div className="tf-main">
              {/* Title */}
              <div className="tf-field">
                <label className="tf-field-label">
                  Title
                  <span className="tf-required-badge">required</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="tf-input"
                  placeholder="What needs doing…"
                  required
                />
              </div>

              {/* Due date & time picker */}
              <div className="tf-field">
                <label className="tf-field-label">
                  Due date &amp; time
                  <span className="tf-required-badge">required</span>
                </label>
                <DatePicker
                  selected={formData.dueDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="h:mm aa"
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  customInput={<CustomDateInput />}
                  wrapperClassName="w-full"
                />
              </div>

              {/* Description */}
              <div className="tf-field">
                <label className="tf-field-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  maxLength={500}
                  className="tf-input"
                  placeholder="Add context, links, or notes…"
                />
                <span className="tf-char-count">{charCount} / 500</span>
              </div>

              <div className="tf-divider" />

              {/* Actions */}
              <div className="tf-actions">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading
                    ? <><span className="tf-spinner" />Saving…</>
                    : isEditing ? 'Update task' : 'Create task'
                  }
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
};

export default TaskForm;
