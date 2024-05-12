export enum AccountStatus {
  New = "New",
  Active = "Active",
  Inactive = "Inactive",
}
export enum BrandStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export enum EdgeBoxActivationStatus {
  NotActivated = "NotActivated",
  Activated = "Activated",
  Pending = "Pending",
  Failed = "Failed",
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
  EdgeBoxUnhealthy = "EdgeBoxUnhealthy",
  EdgeBoxInstallActivation = "EdgeBoxInstallActivation",
}

export enum NotificationPriority {
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
  BrandManager = "BrandManager",
  ShopManager = "ShopManager",
  SystemHandler = "SystemHandler",
  ShopHeadSupervisor = "ShopHeadSupervisor",
  ShopSupervisor = "ShopSupervisor",
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
  Interaction = "Interaction",
  Incident = "Incident",
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

export enum CameraStatus {
  New = "New",
  Connected = "Connected",
  Disconnected = "Disconnected",
  Disabled = "Disabled",
}

export enum ReportInterval {
  HalfHour = "HalfHour",
  Hour = "Hour",
  HalfDay = "HalfDay",
  Day = "Day",
  Week = "Week",
}

export enum ReportTimeRange {
  Day = "Day",
  Week = "Week",
  Month = "Month",
}

export enum EventType {
  NewIncident = "NewIncident",
  MoreEvidence = "MoreEvidence",
}

//Status badge section

export enum CommonStatus {
  New = "New",
  Active = "Active",
  Inactive = "Inactive",
}
export enum ActiveStatusGroup {
  Active = CommonStatus.Active,
  Activated = EdgeBoxActivationStatus.Activated,
  Connected = CameraStatus.Connected,
  Fetched = EvidenceStatus.Fetched,
  Accepted = IncidentStatus.Accepted,
  Working = EdgeboxInstallStatus.Working,
  Installing = EdgeBoxLocation.Installing,
}

export enum InactiveStatusGroup {
  Inactive = CommonStatus.Inactive,
  Failed = EdgeBoxActivationStatus.Failed,
  Disconnected = CameraStatus.Disconnected,
  Rejected = IncidentStatus.Rejected,
  Unhealthy = EdgeboxInstallStatus.Unhealthy,
}

export enum IdleStatusGroup {
  New = CommonStatus.New,
  Pending = EdgeBoxActivationStatus.Pending,
  ToBeFetched = EvidenceStatus.ToBeFetched,
  Idle = EdgeBoxLocation.Idle,
}

export enum MiddleStatusGroup {
  Occupied = EdgeBoxLocation.Occupied,
}

export enum StatusColor {
  ACTIVE = "#23a55a",
  MIDDLE = "#465574",
  INACTIVE = "#f23f43",
  IDLE = "#f0b232",
  NONE = "#80848e",
}

export enum StatusColorLight {
  ACTIVE = "#9DFF9E",
  MIDDLE = "#748dc0",
  INACTIVE = "#F08080",
  IDLE = "#E7E48C",
  NONE = "#c4cbda",
}
