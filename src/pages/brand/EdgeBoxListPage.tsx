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
import {
  IconChevronDown,
  IconHome2,
  IconHomeLink,
  IconPointFilled,
  IconRouter,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { EdgeBoxInstallDetailComp } from "../../components/edgeBoxInstall/EdgeBoxInstallDetailComp";
import { EdgeboxInstallStatus } from "../../models/CamAIEnum";

const EdgeBoxCard = (props: EdgeBoxInstallDetail) => {
  const [opened, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();

  return (
    <Box key={props?.edgeBoxId} mt={rem(12)}>
      <Group
        justify="space-between"
        align="center"
        className={
          opened ? classes["edgeBox-button-active"] : classes["edgeBox-button"]
        }
        px={rem(20)}
        py={rem(12)}
        onClick={toggle}
      >
        <Stack gap={"xs"}>
          <Group align="center">
            <IconRouter style={{ width: rem(20) }} stroke={1.5} />
            <Text>{props?.edgeBox?.name}</Text>
          </Group>
          <Group
            align="center"
            className={classes["clickable-style"]}
            onClick={() => navigate(`/brand/shop/${props?.shopId}`)}
          >
            <IconHome2 style={{ width: rem(20) }} stroke={1.5} />
            <Text>{props?.shop?.name}</Text>
            <IconPointFilled style={{ width: rem(16) }} stroke={1.5} />
            <IconHomeLink style={{ width: rem(20) }} stroke={1.5} />
            <Text>{props?.shop?.addressLine}</Text>
          </Group>
        </Stack>
        <IconChevronDown style={{ width: rem(20) }} stroke={1.5} />
      </Group>
      <Collapse in={opened}>
        <Box
          pt={rem(12)}
          pb={rem(20)}
          px={rem(20)}
          mb={rem(12)}
          onClick={toggle}
          className={classes["edgeBox-collapse"]}
        >
          <EdgeBoxInstallDetailComp edgeBoxInstall={props} />
        </Box>
      </Collapse>
    </Box>
  );
};

const EdgeBoxListPage = () => {
  const [opened] = useDisclosure(false);
  const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
    { size: 1 },
  );
  const { data: edgeBoxList, isLoading: isGetEdgeBoxListLoading } =
    useGetEdgeBoxInstallByBrandId(
      brandList ? brandList?.values?.[0]?.id : null,
    );

  const items = edgeBoxList?.values
    ?.filter((x) => x.edgeBoxInstallStatus != EdgeboxInstallStatus.Disabled)
    .map((item) => <EdgeBoxCard {...item} />);

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
      <Collapse in={opened}>
        <form></form>
      </Collapse>
      {items}
    </Paper>
  );
};

export default EdgeBoxListPage;
