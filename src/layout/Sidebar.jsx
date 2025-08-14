import { useState, useEffect, Profiler } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { RiMenuFold3Line } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  User,
  ClipboardList,
  ShieldCheck,
  BarChart2,
  CreditCard,
  Globe,
  LogOut,
  File
} from "lucide-react";

const Sidebar = ({ login, collapsed, toggleSidebar }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu(prev => prev === menuName ? null : menuName);
  };

  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (paths) => paths?.some(path => location.pathname.startsWith(path)) || false;

  const handleMenuItemClick = (item) => {
    if (item.submenu) {
      toggleSubmenu(item.name);
    } else {
      navigate(item.path);
      if (isMobile) {
        toggleSidebar();
      }
    }
  };

  const handleSubmenuItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const menuItems = {
    admin: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={18} className="mr-2" />
      },
      {
        name: "Leads & Inquiries",
        icon: <FileText size={18} className="mr-2" />,
        submenu: [
          { name: "Inquiry", path: "/inquiry" },
          { name: "Lead", path: "/lead" },
          { name: "All Lead", path: "/adminstatus" }
        ]
      },
      {
        name: "Student Management",
        icon: <GraduationCap size={18} className="mr-2" />,
        submenu: [
          { name: "Student Details", path: "/studentDetails" },
          { name: "Communication", path: "/communication" }
        ]
      },
      {
        name: "Applications",
        icon: <User size={18} className="mr-2" />,
        submenu: [
          { name: "Course & University", path: "/PaymentInvoiceManagement" },
          { name: "Application Tracker", path: "/tracker" },
          { name: "Admission Decision", path: "/applications" }
        ]
      },
      {
        name: "Task Management",
        icon: <ClipboardList size={18} className="mr-2" />,
        submenu: [
          { name: "Add Counselor", path: "/addcounselor" },
          { name: "Add Staff", path: "/addStaff" },
          { name: "Tasks", path: "/tasks" },
          { name: "Processor", path: "/addProcessor" }
        ]
      },
      {
        name: "Roles Permissions",
        path: "/RolesManagement",
        icon: <ShieldCheck size={18} className="mr-2" />
      },
      {
        name: "Reports & Analytics",
        path: "/CourseUniversityDatabase",
        icon: <BarChart2 size={18} className="mr-2" />
      },
      {
        name: "Payments & Invoices",
        path: "/ReportingAnalytics",
        icon: <CreditCard size={18} className="mr-2" />
      },
      {
        name: "Visa procesing list",
        path: "/visaprocesinglist",
        icon: <Globe size={18} className="mr-2" />
      }
    ],
    student: [
      {
        name: "Dashboard",
        path: "/dashboardvisa",
        icon: <LayoutDashboard size={18} className="mr-2" />
      },
      {
        name: "Student Management",
        icon: <GraduationCap size={18} className="mr-2" />,
        submenu: [
          { name: "Student Details", path: "/MainStudentDetails" },
          { name: "Apply University", path: "/Searchprograms" },
          { name: "Student Decision", path: "/studentDecision" }
        ]
      },
      {
        name: "Application Managment",
        path: "/myapplication",
        icon: <User size={18} className="mr-2" />
      },
      {
        name: "Task Management",
        path: "/studenttasks",
        icon: <ClipboardList size={18} className="mr-2" />
      },
      {
        name: "Payments & Invoices",
        path: "/payment",
        icon: <CreditCard size={18} className="mr-2" />
      },
      {
        name: "Course & University",
        path: "/UniversityCards",
        icon: <GraduationCap size={18} className="mr-2" />
      },
      {
        name: "Visa procesing",
        path: "/visaprocesing",
        icon: <Globe size={18} className="mr-2" />
      }
    ],
    counselor: [
      {
        name: "Dashboard",
        path: "/councelor",
        icon: <LayoutDashboard size={18} className="mr-2" />
      },
      {
        name: "Leads & Inquiries",
        icon: <GraduationCap size={20} className="mr-2" />,
        submenu: [
          { name: "Inquiry", path: "/inquiry" },
          { name: "Assign Inquiry / Lead", path: "/leadCouncelor" }
        ]
      },
      {
        name: "Student Management",
        icon: <GraduationCap size={20} className="mr-2" />,
        submenu: [
          { name: "Student Details", path: "/counslerStudentTable" },
          { name: "Communication", path: "/communication" }
        ]
      },
      {
        name: "Task",
        path: "/councelorTask",
        icon: <Globe size={18} className="mr-2" />
      },
      {
        name: "Application Tracking",
        path: "/applicationtracking",
        icon: <GraduationCap size={18} className="mr-2" />
      },
      {
        name: "Assign Student",
        path: "/counselorDetailsTable",
        icon: <FaUserPlus size={18} className="mr-2" />
      }
    ],
    staff: [
      {
        name: "Dashboard",
        path: "/staffDashboard",
        icon: <LayoutDashboard size={18} className="mr-2" />
      },
      {
        name: "Inquiry",
        path: "/staffInquiry",
        icon: <FileText size={18} className="mr-2" />
      },
      {
        name: "Lead",
        path: "/stafflead",
        icon: <FileText size={18} className="mr-2" />
      },
      {
        name: "Payments & Invoices",
        path: "/payment",
        icon: <CreditCard size={18} className="mr-2" />
      },
      {
        name: "Logout",
        path: "/",
        icon: <LogOut size={18} className="mr-2" />
      }
    ],
    processors: [
      {
        name: "Dashboard",
        path: "/processorsDashboard",
        icon: <LayoutDashboard size={18} className="mr-2" />
      },
      {
        name: "Applications",
        path: "/applicationProcessor",
        icon: <FileText size={18} className="mr-2" />
      },
      {
        name: "Documents",
        path: "/processorsDocument",
        icon: <File size={18} className="mr-2" />
      },
      {
        name: "Student Details",
        path: "/processordetails",
        icon: <User size={18} className="mr-2" />
      }
    ],
    masteradmin: [
      {
        name: "Dashboard",
        path: "/masterDashboard",
        icon: <LayoutDashboard size={18} className="mr-2" />
      },
      {
        name: "Admin Management",
        path: "/masterTable",
        icon: <File size={18} className="mr-2" />
      }
    ]
  };

  const renderMenuItems = () => {
    const items = menuItems[login] || [];
    return items.map((item, index) => (
      <li
        key={index}
        className={`menu-item ${(item.path && isActive(item.path)) ||
            (item.submenu && isSubmenuActive(item.submenu?.map(i => i.path)))
            ? "active"
            : ""
          } ${item.submenu && openSubmenu === item.name ? "submenu-open" : ""
          }`}
      >
        <div
          className="menu-link"
          onClick={() => handleMenuItemClick(item)}
        >
          {item.icon}
          {!collapsed && <span className="menu-text">{item.name}</span>}
          {item.submenu && !collapsed && (
            <i
              className={`fa-solid fa-chevron-${openSubmenu === item.name ? "up" : "down"
                } submenu-arrow`}
            ></i>
          )}
        </div>

        {item.submenu && openSubmenu === item.name && !collapsed && (
          <ul className="submenu">
            {item.submenu.map((subItem, subIndex) => (
              <li
                key={subIndex}
                className={`submenu-item ${isActive(subItem.path) ? "active" : ""
                  }`}
                onClick={() => handleSubmenuItemClick(subItem.path)}
              >
                {subItem.name}
              </li>
            ))}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className={`sidebar-container 
      ${collapsed === true ? "collapsed" : ""}
      ${collapsed === "mini" ? "collapsed-desktop" : ""}
    `}>
      <div className="sidebar-menu">
        <ul className="menu">{renderMenuItems()}</ul>
      </div>
    </div>
  );
};

export default Sidebar;