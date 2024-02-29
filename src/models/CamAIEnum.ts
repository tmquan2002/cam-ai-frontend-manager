export enum AccountStatus {
  New = "New",
  Active = "Active",
  Inactive = "Inactive",
}
export enum BrandStatus {
  Active = "Active",
  Inactive = "Inactive",
}
export enum EdgeboxInstallStatus {
  Valid = "Valid",
  Expired = "Expired",
}
export enum EdgeBoxLocation {
  Idle = "Idle",
  Installing = "Installing",
  Occupied = "Occupied",
  Uninstalling = "Uninstalling",
  Disposed = "Disposed",
}

export enum EdgeBoxStatus {
  Active = "Active",
  Inactive = "Inactive",
  Broken = "Broken",
}

export enum EmployeeStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum NotificationStatus {
  Unread = "Unread",
  Read = "Read",
}

export enum NotificationType {
  Normal = "Normal",
  Warning = "Warning",
  Urgent = "Urgent",
}

export enum RequestStatus {
  Open = "Open",
  Canceled = "Canceled",
  Done = "Done",
  Rejected = "Rejected",
}

export enum RequestType {
  Install = "Install",
  Repair = "Repair",
  Remove = "Remove",
  Other = "Other",
}

export enum Role {
  Admin = "Admin",
  Technician = "Technician",
  BrandManager = "BrandManager",
  ShopManager = "ShopManager",
  Employee = "Employee",
}

export enum ShopStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum TokenType {
  AccessToken,
  RefreshToken,
}

export enum Zone {
  Cashier = "Cashier",
  Customer = "Customer",
}
