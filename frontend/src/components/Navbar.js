import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardDocumentListIcon, PlusCircleIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(15,12,41,0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '68px' }}>

          {/* Brand */}
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              boxShadow: '0 0 16px rgba(108,99,255,0.5)',
              flexShrink: 0,
            }}>
              <ClipboardDocumentListIcon style={{ width: '22px', height: '22px', color: '#fff' }} />
            </span>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              background: 'linear-gradient(90deg, #a78bfa, #67e8f9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              TaskManager
            </span>
          </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: location.pathname === '/' ? '#a78bfa' : 'rgba(241,245,249,0.7)',
              background: location.pathname === '/' ? 'rgba(108,99,255,0.18)' : 'transparent',
              border: location.pathname === '/' ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
              transition: 'all 0.2s',
            }}>
              <Squares2X2Icon style={{ width: '17px', height: '17px' }} />
              Dashboard
            </Link>

            <Link to="/tasks/new" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1.1rem',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
              boxShadow: '0 4px 14px rgba(108,99,255,0.45)',
              transition: 'all 0.2s',
            }}>
              <PlusCircleIcon style={{ width: '18px', height: '18px' }} />
              New Task
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;