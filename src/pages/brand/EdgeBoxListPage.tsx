import {
  Box,
  Collapse,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import { useGetEdgeBoxInstallByBrandId } from "../../hooks/useGetEdgeBoxInstallByBrandId";
import { useDisclosure } from "@mantine/hooks";
import { EdgeBoxInstallDetail } from "../../models/Edgebox";
import classes from "./EdgeBoxListPage.module.scss";
import { IconChevronDown, IconHome2, IconRouter } from "@tabler/icons-react";

const EdgeBoxCard = (props: EdgeBoxInstallDetail) => {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <Box key={props.id}>
      <Group
        justify="space-between"
        align="center"
        className={opened ? classes["edgeBox-button-active"] : classes["edgeBox-button"]}
        px={rem(20)}
        py={rem(12)}
        onClick={toggle}
      >
        <Stack gap={"xs"}>
          <Group align="center">
            <IconRouter style={{ width: rem(20) }} stroke={1.5} />
            <Text>{props?.edgeBox?.name}</Text>
          </Group>
          <Group align="center">
            <IconHome2 style={{ width: rem(20) }} stroke={1.5} />
            <Text>{props?.shop?.name}</Text>
          </Group>
        </Stack>
        <IconChevronDown style={{ width: rem(20) }} stroke={1.5} />
      </Group>
      <Collapse in={opened}>
        <Box pt={rem(4)} pb={rem(12)} px={rem(20)} onClick={toggle} className={classes["edgeBox-collapse"]}>{props?.edgeBox?.name}</Box>
      </Collapse>
    </Box>
  );
};

const EdgeBoxListPage = () => {
  const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
    { size: 1 }
  );
  const { data: edgeBoxList, isLoading: isGetEdgeBoxListLoading } =
    useGetEdgeBoxInstallByBrandId(brandList?.values?.[0].id ?? null);

  const items = edgeBoxList?.values?.map((item) => <EdgeBoxCard {...item} />);

  if (isGetBrandListLoading || isGetEdgeBoxListLoading)
    return (
      <Paper style={{ flex: 1, height: "100vh" }} pos={"relative"}>
        <LoadingOverlay
          visible={isGetBrandListLoading || isGetEdgeBoxListLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 1 }}
        />
      </Paper>
    );

  return (
    <Paper m={rem(32)} p={rem(32)} style={{ flex: 1 }} shadow="xs">
      {" "}
      <Group mb={rem(20)} justify="space-between">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          EdgeBox List
        </Text>
      </Group>
      {items}
    </Paper>
  );
};

export default EdgeBoxListPage;
