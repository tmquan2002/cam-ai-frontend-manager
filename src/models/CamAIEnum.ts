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
  Working = "Working",
  Unhealthy = "Unhealthy",
  Disabled = "Disabled",
  New = "New",
  Connected = "Connected",
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
  Disposed = "Disposed",
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

export enum IncidentType {
  Phone = "Phone",
  Uniform = "Uniform",
}

export enum IncidentStatus {
  New = "New",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

export enum EvidenceStatus {
  ToBeFetched = "ToBeFetched",
  Fetched = "Fetched",
  NotFound = "NotFound",
}

export enum EvidenceType {
  Image = "Image",
}
