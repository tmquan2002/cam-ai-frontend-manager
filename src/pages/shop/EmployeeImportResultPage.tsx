import { Box, Divider, Grid, Group, LoadingOverlay, RingProgress, Table, Text, rem, useComputedColorScheme } from "@mantine/core";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import CustomBreadcrumb from "../../components/breadcrumbs/CustomBreadcrumb";
import { useGetEmployeeUpsertTaskResult } from "../../hooks/useFiles";
import { StatusColor, StatusColorLight } from "../../models/CamAIEnum";
import { randomInRange } from "../../utils/helperFunction";

const RenderProgress = ({ name, value, total, color }: { name: string; value: number; total: number, color: string }) => {
    return (
        <Grid.Col span={4}>
            <Box>
                <Group justify="center" gap={rem(100)}>
                    <Box>
                        <Text size="lg">{name}</Text>
                        <Text fw="500" fz={20}>{value}</Text>
                    </Box>
                    <RingProgress size={90} thickness={8} roundCaps
                        sections={[{
                            value: total !== 0 ? Math.round(value / total * 100) : 0,
                            color: color
                        }]}
                        label={
                            <Text c={color} fw={700} ta="center">
                                {total !== 0 ? Math.round(value / total * 100) : 0}%
                            </Text>
                        }
                    />
                </Group>
            </Box>
        </Grid.Col>
    )
}

const sizeTest = 5

const reasonData = [...Array(Number(sizeTest))].map((_, i) => (
    <Grid key={i} ta="left">
        <Grid.Col span={2}>
            <Text fw="bold">Test Manager</Text>
        </Grid.Col>
        <Grid.Col span={10}>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
        </Grid.Col>
        {i !== sizeTest - 1 &&
            <Grid.Col span={12}>
                <Divider />
            </Grid.Col>
        }
    </Grid>
))

const loadingData = [...Array(Number(2))].map((_, i) => (
    <Table.Tr key={i}>
        <Table.Td w={30} ta="center">{i + 1}</Table.Td>
        <Table.Td w={50} ta="center">{randomInRange(1, 200)}</Table.Td>
        <Table.Td align={"center"}>{reasonData}</Table.Td>
    </Table.Tr>
))



const EmployeeImportResultPage = () => {
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true })
    const params = useParams();
    const { data, isLoading } = useGetEmployeeUpsertTaskResult(params?.id ?? "")
    const total = (data?.inserted ?? 0) + (data?.updated ?? 0) + (data?.failed ?? 0)

    return (
        <Box p={rem(32)} pos="relative" flex={1}>
            <LoadingOverlay visible={isLoading} />
            <Group mb={rem(24)} justify="space-between">
                <Group>
                    <CustomBreadcrumb items={[]} goBack />
                    <Text fw={600} size={rem(17)} >
                        Import Result
                    </Text>
                    <StatusBadge statusName={data?.status || "None"} padding={10} size="md" />
                </Group>
            </Group>
            <Box mb={20}>
                <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                    style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                    <Text size={rem(17)} fw={500} mb={10}>{total} Rows Uploaded</Text>
                    {/* <Text size="sm" c="dimmed" fw={500}>{data?.description}</Text> */}

                    <Grid justify="space-between" mt={20} gutter={30}>
                        <RenderProgress name="Inserted"
                            color={computedColorScheme == "light" ? StatusColor.ACTIVE : StatusColorLight.ACTIVE}
                            value={data?.inserted ?? 0} total={total} />
                        <RenderProgress name="Updated"
                            color={computedColorScheme == "light" ? StatusColor.MIDDLE : StatusColorLight.MIDDLE}
                            value={data?.updated ?? 0} total={total} />
                        <RenderProgress name="Failed"
                            color={computedColorScheme == "light" ? StatusColor.INACTIVE : StatusColorLight.INACTIVE}
                            value={data?.failed ?? 0} total={total} />
                    </Grid>
                </Box>
            </Box>
            <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                <Group mb={20} justify="left">
                    <Text fw={600} size={rem(17)}>Failed Log</Text>
                </Group>
                <Table striped withRowBorders withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={30} ta="center">#</Table.Th>
                            <Table.Th w={50} ta="center">Row</Table.Th>
                            <Table.Th>Reason</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{loadingData}</Table.Tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default EmployeeImportResultPage;