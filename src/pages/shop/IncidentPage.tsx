import {
  Badge,
  Box,
  Card,
  Table,
  Text,
  rem,
  useComputedColorScheme,
} from "@mantine/core";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const incidents = [
  {
    id: "1",
    name: "name",
    time: "time",
    createBy: "create By",
    status: "Active",
    assignTo: "someone",
  },
  {
    id: "2",
    name: "name",
    time: "time",
    createBy: "create By",
    status: "Active",
    assignTo: "someone",
  },
  {
    id: "3",
    name: "name",
    time: "time",
    createBy: "create By",
    status: "Active",
    assignTo: "someone",
  },
  {
    id: "4",
    name: "name",
    time: "time",
    createBy: "create By",
    status: "Active",
    assignTo: "someone",
  },
];

const IncidentPage = () => {
  const navigate = useNavigate();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const rows = incidents.map((row, index) => {
    return (
      <Table.Tr
        style={{
          cursor: "pointer",
        }}
        key={index}
        onClick={() => navigate(`/shop/incident/${row.id}`)}
      >
        <Table.Td>
          <Text c={"blue"}>{row.name}</Text>
        </Table.Td>
        <Table.Td>{row.createBy}</Table.Td>
        <Table.Td>{row.time}</Table.Td>
        <Table.Td>{row.assignTo}</Table.Td>
        <Table.Td>
          {_.isEqual(row.status, "Active") ? (
            <Badge variant="light">Active</Badge>
          ) : (
            <Badge
              color="gray"
              variant="light"
            >
              Disabled
            </Badge>
          )}
        </Table.Td>
      </Table.Tr>
    );
  });
  return (
    <Box>
      <Card
        shadow="md"
        m={rem(32)}
        style={{
          backgroundColor:
            computedColorScheme === "light" ? "white" : "#1f1f1f",
        }}
      >
        <Card.Section
          withBorder
          inheritPadding
          py={rem(20)}
          mb={rem(20)}
        >
          <Text
            size="lg"
            fw={"bold"}
            fz={22}
            c={"light-blue.4"}
          >
            INICIDENT VALUES
          </Text>
        </Card.Section>

        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          verticalSpacing={"md"}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Incident</Table.Th>
              <Table.Th>Capture by</Table.Th>
              <Table.Th>Time</Table.Th>
              <Table.Th>Assign to</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
};

export default IncidentPage;
