import { Box, ColorSwatch, Divider, Grid, Group, LoadingOverlay, RingProgress, Table, Text, rem, useComputedColorScheme } from "@mantine/core";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/badge/StatusBadge";
import CustomBreadcrumb from "../../components/breadcrumbs/CustomBreadcrumb";
import { useGetShopUpsertTaskResult } from "../../hooks/useFiles";
import { StatusColor, StatusColorLight } from "../../models/CamAIEnum";
import { hasErrorType } from "../../utils/helperFunction";

type RenderProgressParams = {
    name: string;
    value: number;
    type: "Success" | "Failed";
    valueShop?: number;
    valueManager?: number;
    total: number;
    color: string;
    colorShop?: string;
    colorManager?: string;
}

const RenderProgress = ({ name, value, total, color, type, colorManager, colorShop, valueManager, valueShop }: RenderProgressParams) => {
    return (
        <Grid.Col span={4}>
            <Box>
                <Text size="lg" ta="center" c="dimmed">{name} :
                    <Text fw="500" size="lg" span c={color}>{"  " + value}</Text>
                </Text>
                <Group justify="center" gap={rem(30)}>
                    {type == "Failed" ?

                        <RingProgress size={90} thickness={8} roundCaps
                            sections={[
                                { value: total !== 0 ? Math.round(value / total * 100) : 0, color: color }
                            ]}
                            label={
                                <Text c={color} fw={700} ta="center">
                                    {total !== 0 ? Math.round(value / total * 100) : 0}%
                                </Text>
                            }
                        />
                        :
                        <Group justify="center" gap={rem(30)}>
                            <RingProgress size={90} thickness={8} roundCaps
                                sections={[
                                    {
                                        value: total !== 0 && valueShop ? Math.round(valueShop / total * 100) : 0,
                                        color: colorShop ?? "grey",
                                        tooltip: `Shops - ${total !== 0 && valueShop ? Math.round(valueShop / total * 100) : 0}%`
                                    },
                                    {
                                        value: total !== 0 && valueManager ? Math.round(valueManager / total * 100) : 0,
                                        color: colorManager ?? "grey",
                                        tooltip: `Managers - ${total !== 0 && valueManager ? Math.round(valueManager / total * 100) : 0}%`
                                    },
                                ]}
                                label={
                                    <Text c={color} fw={700} ta="center">
                                        {total !== 0 ? Math.round(value / total * 100) : 0}%
                                    </Text>
                                }
                            />
                            <Box>
                                <Group>
                                    <ColorSwatch color={colorShop ?? "grey"} size={15} /> <Text>Shops - <Text span fw={500}>{valueShop}</Text></Text>
                                </Group>
                                <Group>
                                    <ColorSwatch color={colorManager ?? "grey"} size={15} /><Text>Managers - <Text span fw={500}>{valueManager}</Text></Text>
                                </Group>
                            </Box>
                        </Group>
                    }
                </Group>
            </Box>
        </Grid.Col>
    )
}

const ShopImportResultPage = () => {
    const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true })
    const params = useParams();
    const { data, isLoading, isError } = useGetShopUpsertTaskResult(params?.id ?? "")
    const total = (data?.inserted ?? 0) + (data?.updated ?? 0) + (data?.failed ?? 0)
    const shopInserted = data?.metadata?.find(metadata => 'shopInserted' in metadata)?.shopInserted?.length;
    const accountInserted = data?.metadata?.find(metadata => 'accountInserted' in metadata)?.accountInserted?.length;
    const shopUpdated = data?.metadata?.find(metadata => 'shopUpdated' in metadata)?.shopUpdated?.length;
    const accountUpdated = data?.metadata?.find(metadata => 'accountUpdated' in metadata)?.accountUpdated?.length;
    const containsError = data?.metadata?.find(metadata => hasErrorType(metadata))

    const ErrorList = containsError?.errors.map((errorRow, i) => (
        <Table.Tr key={i}>
            <Table.Td w={30} ta="center">{i + 1}</Table.Td>
            <Table.Td w={50} ta="center">{errorRow?.row}</Table.Td>
            <Table.Td align={"center"}>
                {Object.entries(errorRow?.reasons).map(([key, value], index) => (
                    <Grid key={index} ta="left">
                        <Grid.Col span={2}>
                            <Text fw="bold">{key ? key.toString().replace(/([A-Z])/g, ' $1').trim() : ""}</Text>
                        </Grid.Col>
                        <Grid.Col span={10}>
                            <Text>{value as string}</Text>
                        </Grid.Col>
                        {index !== Object.entries(errorRow?.reasons).length - 1 &&
                            <Grid.Col span={12}>
                                <Divider />
                            </Grid.Col>
                        }
                    </Grid>
                ))}
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <Box p={rem(32)} pos="relative" flex={1}>
            <LoadingOverlay visible={isLoading} />
            {isError ? <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                <Text c="dimmed" fs="italic" ta="center">Task not found or Expired</Text>
            </Box>
                :
                <>
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
                            {/* <Text size={rem(17)} mb={10} ta="center">Total Uploaded:
                                <Text c="light-blue.7" fw={500} span inherit>{" " + total}</Text>
                            </Text> */}
                            {/* <Text size="sm" c="dimmed" fw={500}>{data?.description}</Text> */}

                            <Grid justify="space-between">
                                <RenderProgress name="Inserted"
                                    color={computedColorScheme == "light" ? StatusColor.ACTIVE : StatusColorLight.ACTIVE}
                                    colorShop={StatusColor.ACTIVE} colorManager={StatusColorLight.ACTIVE}
                                    valueShop={shopInserted ?? 0} valueManager={accountInserted ?? 0}
                                    type="Success"
                                    value={data?.inserted ?? 0} total={total} />
                                <RenderProgress name="Updated"
                                    color={computedColorScheme == "light" ? StatusColor.MIDDLE : StatusColorLight.MIDDLE}
                                    colorShop={StatusColor.MIDDLE} colorManager={StatusColorLight.MIDDLE}
                                    valueShop={shopUpdated ?? 0} valueManager={accountUpdated ?? 0}
                                    type="Success"
                                    value={data?.updated ?? 0} total={total} />
                                <RenderProgress name="Failed"
                                    color={computedColorScheme == "light" ? StatusColor.INACTIVE : StatusColorLight.INACTIVE}
                                    type="Failed"
                                    value={data?.failed ?? 0} total={total} />
                            </Grid>
                        </Box>
                    </Box>
                    {containsError ?
                        <Box bg={computedColorScheme == "dark" ? "#1f1f1f" : "white"} p={rem(20)}
                            style={{ borderRadius: "5px", boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}>
                            {containsError.errors.length == 0 ?
                                <Text c="dimmed" fs="italic" ta="center">All datas are successfully imported!</Text>
                                :
                                <>
                                    <Group mb={20} justify="left">
                                        <Text fw={600} size={rem(17)}>Failed Log</Text>
                                    </Group>
                                    <Table striped withRowBorders withColumnBorders>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th w={50} ta="center">#</Table.Th>
                                                <Table.Th w={100} ta="center">Row</Table.Th>
                                                <Table.Th>Reason</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>{ErrorList}</Table.Tbody>
                                    </Table>
                                </>
                            }
                        </Box>
                        :
                        <Text c="dimmed" fs="italic" ta="center">Something wrong happen trying to get the errors or no import errors detected</Text>
                    }
                </>
            }
        </Box>
    )
}

export default ShopImportResultPage;