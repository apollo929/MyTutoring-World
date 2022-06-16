// Sidebar route metadata
export interface RouteInfo {
  path: String;
  title: String;
  icon: String;
  class: String;
  label: String;
  labelClass: String;
  extralink: Boolean;
  submenu: RouteInfo[];
}
