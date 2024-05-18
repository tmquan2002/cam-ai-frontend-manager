import { Box, Grid, Group, Text, rem, useComputedColorScheme } from "@mantine/core";
import StatusBadge from "../../components/badge/StatusBadge";
import { TaskStatus } from "../../models/CamAIEnum";

const ShopImportResultPage = () => {
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true })
    return (
        <Box m={rem(32)}>
            <Group mb={rem(24)}>
                <Text fw={600} size={rem(17)} >
                    Import Result:
                </Text>
                <StatusBadge statusName={TaskStatus.Fail} padding={10} size="md" />
            </Group>
            <Box>
                <Grid justify="space-between" columns={12} gutter={28}>
                    <Grid.Col span={4} >
                        <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                            style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                            <Text fw="500">Inserted</Text>
                            <Text>0</Text>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                            style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                            <Text fw="500">Updated</Text>
                            <Text>0</Text>
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                            style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                            <Text fw="500">Failed</Text>
                            <Text>0</Text>
                        </Box>
                    </Grid.Col>
                </Grid>
            </Box>
        </Box>
    )
}

export default ShopImportResultPage;