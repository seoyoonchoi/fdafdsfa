import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import styles from './Sidebar.module.css';
import { useEmployeeStore } from "@/stores/employee.store";
import { adminMenu } from "./admin";
import { commonMenu } from "./common";


export default function Sidebar(){
    const navigate = useNavigate();
    //*zustand 관리 후 주석 해제
    const employee = useEmployeeStore((state) => state.employee);
    const isAdmin = employee?.authorityName.includes("ADMIN");

    const [isAdminMode, setIsAdminMode] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(() =>{
        const savedIndex = localStorage.getItem("sidebarActiveIndex");
        return savedIndex !== null?Number(savedIndex) : null;
    });

    const menuData = isAdminMode ? adminMenu : commonMenu;

    const toggleMenu = (index: number) =>{
        const newIndex = activeIndex === index? null : index;
        setActiveIndex(newIndex);
        if(newIndex === null){
            localStorage.removeItem("sidebarActiveIndex");
        }else{
            localStorage.setItem("sidebarActiveIndex", String(newIndex));
        }
    };

    const toggleAdminMode = () => {
        if(!isAdmin) {
            alert("관리자 권한이 필요합니다");
            return;
        }

        const nextMode = !isAdminMode;
        setIsAdminMode(nextMode);
        localStorage.setItem("sidebarIsAdminMode", String(nextMode));
        setActiveIndex(null);
        localStorage.removeItem("sidebarActiveIndex");
    };

    useEffect(() => {
        const isFirstLogin = sessionStorage.getItem("isFirstLogin") === "true";
        if(isFirstLogin) {
            localStorage.removeItem("sidebarActiveIndex");
            sessionStorage.removeItem("isFirstLogin");
            setActiveIndex(null);
        }
    }, []);

    return (
        <div className={styles.sidebar}>
            <div className={styles.menuWrapper}>
                <div className={styles.menu}>
                    {menuData.map((menu, idx)=> (
                        <div key = {idx}>
                            <div className={`${styles.menuItem} ${activeIndex === idx ? styles.active : ""}`}
                                onClick = {() => toggleMenu(idx)}
                                tabIndex={-1}>
                                    {menu.title}
                            </div>
                            <div className={styles.submenu}
                            style={{
                                maxHeight: activeIndex === idx ? `${menu.submenu.length*40}px` : "0",
                                padding: activeIndex === idx ? "15px 30px" : "0 30px",
                                transition: "all 0.3s ease",
                                overflow: "hidden",
                            }}>
                                {menu.submenu.map((sub, subIndex) => (
                                    <div className={styles.submenuIndex} key={subIndex} tabIndex={-1} 
                                    onClick={() => navigate(sub.path)}>{sub.label}</div>
                                ))}

                            </div>
                        </div>
                    ))}

                </div>
                <div className={styles.modeChange} onClick={toggleAdminMode}>{isAdminMode ? "통합모드로 이동" : "관리자 모드로 이동"}</div>
            </div>
        </div>
    )
}