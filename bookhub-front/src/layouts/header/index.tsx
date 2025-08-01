import { logoutRequest } from "@/apis/auth/auth";
import { useEmployeeStore } from "@/stores/employee.store";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css"


export default function Header(){

    const[cookies, ,removeCookies] = useCookies(["accessToken"]);
    const logout = useEmployeeStore((state) => state.setLogout);
    const employee  = useEmployeeStore((state) => state.employee);
    const navigate = useNavigate();


    const onLogoutClick = async () => {
        await logoutRequest();
        removeCookies("accessToken", {path : "/"});
        logout();
    };
    
    const onLogoClick = () => {
        navigate("/main");
    };

    return(
        <header>
            <div>
                <img src="@/public/북허브_로고_배경제거_navy.png" 
                alt="북허브 로고"
                onClick = {onLogoClick}
                className = {styles.logoImg}
                />
            </div>
            <div>
                {/* <AlertIcon/> */}
                <div>
                    {employee?.branchName} {employee?.positionName}{""}
                    {employee?.employeeName}
                </div>
                <button onClick={onLogoutClick}>로그아웃</button>
            </div>

        </header>
    );
}