interface SubmenuItem{
    label: string;
    path : string;
}

export interface SidebarMenu{
    title: string;
    submenu: SubmenuItem[];
}