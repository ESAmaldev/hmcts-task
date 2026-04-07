import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { taskService } from '../services/api';
import { format } from 'date-fns';
import {
  PencilIcon, TrashIcon, CheckCircleIcon, ClockIcon,
  PlusCircleIcon, FunnelIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.30)' },
  COMPLETED: { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.30)' },
};

const FILTERS = ['ALL', 'PENDING', 'COMPLETED'];

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchTasks(); }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = filter === 'ALL'
        ? await taskService.getAllTasks()
        : await taskService.getTasksByStatus(filter);
      setTasks(response.data.data);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      fetchTasks();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await taskService.updateTaskStatus(id, newStatus);
      toast.success(`Marked as ${newStatus.toLowerCase()}`);
      fetchTasks();
    } catch {
      toast.error('Failed to update status');
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div>
        <PageHeader />
        <FilterBar filter={filter} setFilter={setFilter} />
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass shimmer" style={{ height: '190px', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader />
      <FilterBar filter={filter} setFilter={setFilter} />

      {tasks.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div style={{
          display: 'grid',
          gap: '1.25rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        }}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Sub-components ──────────────────────────────── */

const PageHeader = () => (
  <div style={{ marginBottom: '1.75rem' }}>
    <h1 style={{
      fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
      fontWeight: 800,
      background: 'linear-gradient(90deg, #f1f5f9, #a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
      marginBottom: '0.35rem',
    }}>My Tasks</h1>
    <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '0.95rem' }}>
      Manage and track all your tasks in one place.
    </p>
  </div>
);

const FilterBar = ({ filter, setFilter }) => (
  <div style={{
    display: 'flex', gap: '0.5rem', marginBottom: '1.75rem',
    flexWrap: 'wrap', alignItems: 'center',
  }}>
    <FunnelIcon style={{ width: '16px', height: '16px', color: 'rgba(148,163,184,0.6)', flexShrink: 0 }} />
    {FILTERS.map(s => {
      const active = filter === s;
      const cfg = STATUS_CONFIG[s] || {};
      return (
        <button key={s} onClick={() => setFilter(s)} style={{
          padding: '0.4rem 1rem',
          borderRadius: '99px',
          border: active
            ? `1px solid ${cfg.border || 'rgba(108,99,255,0.4)'}`
            : '1px solid rgba(255,255,255,0.1)',
          background: active
            ? (cfg.bg || 'rgba(108,99,255,0.2)')
            : 'rgba(255,255,255,0.05)',
          color: active ? (cfg.color || '#a78bfa') : 'rgba(148,163,184,0.8)',
          fontWeight: active ? 600 : 500,
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.18s',
          fontFamily: 'inherit',
        }}>
          {s === 'ALL' ? 'All Tasks' : s.charAt(0) + s.slice(1).toLowerCase()}
        </button>
      );
    })}
  </div>
);

const TaskCard = ({ task, onDelete, onStatusUpdate }) => {
  const cfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.PENDING;
  const isComplete = task.status === 'COMPLETED';

  return (
    <div className="glass" style={{
      padding: '1.4rem',
      borderRadius: '16px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, ${cfg.color}, transparent)`,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <h3 style={{
          fontSize: '1.05rem', fontWeight: 700,
          color: isComplete ? 'rgba(241,245,249,0.5)' : '#f1f5f9',
          textDecoration: isComplete ? 'line-through' : 'none',
          flex: 1, marginRight: '0.75rem', lineHeight: 1.3,
        }}>{task.title}</h3>
        <span style={{
          padding: '0.2rem 0.65rem',
          borderRadius: '99px',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>{cfg.label}</span>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{
          color: 'rgba(148,163,184,0.85)', fontSize: '0.88rem',
          lineHeight: 1.55, marginBottom: '0.85rem',
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{task.description}</p>
      )}

      {/* Due date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
        <ClockIcon style={{ width: '14px', height: '14px', color: 'rgba(148,163,184,0.6)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.7)' }}>
          {format(new Date(task.dueDate), 'MMM dd, yyyy · h:mm a')}
        </span>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.85rem',
      }}>
        <button onClick={() => onStatusUpdate(task.id, task.status)} style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '8px',
          border: `1px solid ${isComplete ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'}`,
          background: isComplete ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
          color: isComplete ? '#f59e0b' : '#10b981',
          fontSize: '0.8rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.18s',
          fontFamily: 'inherit',
        }}>
          {isComplete
            ? <ClockIcon style={{ width: '14px', height: '14px' }} />
            : <CheckCircleSolid style={{ width: '14px', height: '14px' }} />}
          {isComplete ? 'Mark Pending' : 'Complete'}
        </button>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <Link to={`/tasks/edit/${task.id}`} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.25)',
            color: '#a78bfa', textDecoration: 'none', transition: 'all 0.18s',
          }}>
            <PencilIcon style={{ width: '15px', height: '15px' }} />
          </Link>
          <button onClick={() => onDelete(task.id, task.title)} style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#ef4444', cursor: 'pointer', transition: 'all 0.18s',
            fontFamily: 'inherit',
          }}>
            <TrashIcon style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ filter }) => (
  <div style={{
    textAlign: 'center', padding: '5rem 1rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
  }}>
    <div style={{
      width: '72px', height: '72px', borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.2))',
      border: '1px solid rgba(108,99,255,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <CheckCircleIcon style={{ width: '36px', height: '36px', color: '#6c63ff' }} />
    </div>
    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>
      {filter === 'ALL' ? 'No tasks yet' : `No ${filter.toLowerCase()} tasks`}
    </h3>
    <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '0.9rem', maxWidth: '280px' }}>
      {filter === 'ALL' ? 'Create your first task to get started.' : `Switch to a different filter or create a new task.`}
    </p>
    <Link to="/tasks/new" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.6rem 1.4rem',
      borderRadius: '10px',
      background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
      color: '#fff', textDecoration: 'none',
      fontWeight: 600, fontSize: '0.9rem',
      boxShadow: '0 4px 14px rgba(108,99,255,0.4)',
      marginTop: '0.25rem',
    }}>
      <PlusCircleIcon style={{ width: '18px', height: '18px' }} />
      New Task
    </Link>
  </div>
);

export default TaskList;