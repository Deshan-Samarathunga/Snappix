// src/components/Sidebar.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faFireAlt, faCameraRetro, faImage, faComments, faCompass,
  faUsers, faTags, faBookOpen, faBullhorn, faChartBar,
  faCircleQuestion, faPenNib, faScrewdriverWrench
} from '@fortawesome/free-solid-svg-icons';

const sidebarButtonClass = "d-flex align-items-center gap-2 px-3 py-2 rounded text-light sidebar-hover";

export default function Sidebar() {
  return (
    <div className="bg-dark text-light p-3 position-fixed top-0 start-0 z-2" style={{ width: '280px', height: '100vh', marginTop: '60px', overflowY: 'auto' }}>
      <style>{`
        .sidebar-hover:hover {
          background-color: #2a2a2c;
          color: #ffffff;
        }
      `}</style>

      <div className="mb-3">
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faHome} /> Home</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faFireAlt} /> Trending</div>
      </div>

      <hr className="border-secondary" />
      <h6 className="text-muted text-uppercase">Explore</h6>
      <div className="mb-3">
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faCameraRetro} /> Photography</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faImage} /> Cinematic</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faCompass} /> Discover</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faComments} /> Discussions</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faTags} /> Categories</div>
        <div className="px-3 text-info">See more</div>
      </div>

      <hr className="border-secondary" />
      <h6 className="text-muted text-uppercase">Community</h6>
      <div className="mb-3">
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faUsers} /> Creators</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faBullhorn} /> Promote Work</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faChartBar} /> Analytics <span className="text-warning">BETA</span></div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faCircleQuestion} /> Help Center</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faBookOpen} /> Blog</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faScrewdriverWrench} /> Careers</div>
        <div className={sidebarButtonClass}><FontAwesomeIcon icon={faPenNib} /> Press</div>
      </div>
    </div>
  );
}