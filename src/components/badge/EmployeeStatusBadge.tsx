import { Badge } from "@mantine/core";
import { EmployeeStatus } from "../../models/CamAIEnum";

export const EmployeeStatusBadge = ({
  employeeStatus,
}: {
  employeeStatus: EmployeeStatus;
}) => {
  switch (employeeStatus) {
    case EmployeeStatus.Active:
      return <Badge>{EmployeeStatus.Active}</Badge>;
    case EmployeeStatus.Inactive:
      return <Badge color="gray">{EmployeeStatus.Inactive}</Badge>;
  }
};
