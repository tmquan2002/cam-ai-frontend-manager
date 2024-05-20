import { Box, Grid, Group, RingProgress, Select, Table, Text, rem, useComputedColorScheme } from "@mantine/core";
import { useState } from "react";
import StatusBadge from "../../components/badge/StatusBadge";
import { StatusColor, StatusColorLight, TaskStatus } from "../../models/CamAIEnum";
import { TaskResult } from "../../models/Task";

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

const data: TaskResult = {
    status: TaskStatus.Success,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    inserted: 30,
    updated: 55,
    failed: 35
}

const total = (data.inserted ?? 0) + (data.updated ?? 0) + (data.failed ?? 0)

const ShopImportResultPage = () => {
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true })
    const [selectedShop, setSelectedShop] = useState<string | null>(null);

    return (
        <Box m={rem(32)}>
            <Group mb={rem(24)} justify="space-between">
                <Group>
                    <Text fw={600} size={rem(17)} >
                        Import Result
                    </Text>
                    <StatusBadge statusName={data.status} padding={10} size="md" />
                </Group>
            </Group>
            <Box mb={20}>
                <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                    style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                    <Text size={rem(17)} fw={500} mb={10}>{total} Rows Uploaded</Text>
                    <Text size="sm" c="dimmed" fw={500}>{data.description}</Text>

                    <Grid justify="space-between" mt={20} gutter={30}>
                        <RenderProgress name="Inserted"
                            color={computedColorScheme == "light" ? StatusColor.ACTIVE : StatusColorLight.ACTIVE}
                            value={data.inserted ?? 0} total={total} />
                        <RenderProgress name="Updated"
                            color={computedColorScheme == "light" ? StatusColor.MIDDLE : StatusColorLight.MIDDLE}
                            value={data.updated ?? 0} total={total} />
                        <RenderProgress name="Failed"
                            color={computedColorScheme == "light" ? StatusColor.INACTIVE : StatusColorLight.INACTIVE}
                            value={data.failed ?? 0} total={total} />
                    </Grid>
                </Box>
            </Box>
            <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                <Group mb={20} justify="right">
                    <Group>
                        <Select
                            label="Import Status"
                            value={selectedShop} onChange={setSelectedShop}
                            size="xs" radius={rem(8)} w={rem(200)}
                            style={{ fontWeight: 500, }}
                            styles={{ dropdown: { fontWeight: 500, }, }}
                            data={["Inserted", "Updated", "Failed"]}
                            nothingFoundMessage="Nothing Found"
                            placeholder={"Select Status"}
                        />
                    </Group>
                </Group>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>#</Table.Th>
                            <Table.Th>Shop</Table.Th>
                            <Table.Th>Manager</Table.Th>
                            <Table.Th>Open TIme</Table.Th>
                            <Table.Th>Close TIme</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                </Table>
            </Box>
        </Box>
    )
}

export default ShopImportResultPage;