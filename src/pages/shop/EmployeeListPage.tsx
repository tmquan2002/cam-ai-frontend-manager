import {
  Button,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Table,
  Text,
  rem,
} from "@mantine/core";
import { useGetEmployeeList } from "../../hooks/useGetEmployeeList";
import { replaceIfNun } from "../../utils/helperFunction";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { IconPlus } from "@tabler/icons-react";
import { EmployeeStatusBadge } from "../../components/badge/EmployeeStatusBadge";

const EmployeeListPage = () => {
  const navigate = useNavigate();

  const { data: employeeList, isLoading: isGetEmployeeListLoading } =
    useGetEmployeeList({});

  const rows = employeeList?.values?.map((row) => (
    <Table.Tr
      style={{
        cursor: "pointer",
      }}
      key={row.id}
      onClick={() => navigate(`/shop/employee/${row.id}`)}
    >
      <Table.Td>{replaceIfNun(row.name)}</Table.Td>
      <Table.Td>{replaceIfNun(row.email)}</Table.Td>
      <Table.Td>{replaceIfNun(row.phone)}</Table.Td>
      <Table.Td>{replaceIfNun(row.birthday)}</Table.Td>
      <Table.Td>{replaceIfNun(row.gender)}</Table.Td>
      <Table.Td>{replaceIfNun(row.addressLine)}</Table.Td>
      <Table.Td>
        <EmployeeStatusBadge employeeStatus={row.employeeStatus} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper shadow="xs" p={"xs"} m={rem(32)} px={rem(32)} py={rem(20)}>
      <Group justify={"space-between"} mt={rem(20)} mb={rem(40)}>
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Employee list
        </Text>
        <Button
          onClick={() => navigate("/shop/employee/create")}
          leftSection={<IconPlus size={14} />}
        >
          Add Employee
        </Button>
      </Group>

      {isGetEmployeeListLoading ? (
        <Loader />
      ) : (
        <ScrollArea h={600}>
          <Table
            miw={1000}
            highlightOnHover
            verticalSpacing={"md"}
            striped
            withTableBorder
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Phone</Table.Th>
                <Table.Th>Birthday</Table.Th>
                <Table.Th>Gender</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Paper>
  );
};

export default EmployeeListPage;
