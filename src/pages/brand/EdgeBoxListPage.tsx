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
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconHome2,
  IconHomeLink,
  IconPointFilled,
  IconRouter,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { EdgeBoxInstallDetailComp } from "../../components/edgeBoxInstall/EdgeBoxInstallDetailComp";
import { useGetBrandList } from "../../hooks/useGetBrandList";
import { useGetEdgeBoxInstallByBrandId } from "../../hooks/useGetEdgeBoxInstallByBrandId";
import { EdgeboxInstallStatus } from "../../models/CamAIEnum";
import { EdgeBoxInstallDetail } from "../../models/Edgebox";
import classes from "./EdgeBoxListPage.module.scss";

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
        px={rem(32)}
        py={rem(20)}
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
          pb={rem(32)}
          px={rem(32)}
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
  // const [opened] = useDisclosure(false);
  const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
    { size: 1 }
  );
  const { data: edgeBoxList, isLoading: isGetEdgeBoxListLoading } =
    useGetEdgeBoxInstallByBrandId(
      brandList ? brandList?.values?.[0]?.id : null
    );

  const items = edgeBoxList?.values?.filter((x) => x.edgeBoxInstallStatus != EdgeboxInstallStatus.Disabled)

  return (
    <Paper m={rem(32)} p={rem(32)} shadow="xs" pos={"relative"}>
      <LoadingOverlay
        visible={isGetBrandListLoading || isGetEdgeBoxListLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 1 }}
      />
      {" "}
      <Group mb={rem(20)} justify="space-between">
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"}>
          Edge Box List
        </Text>
      </Group>
      {!items || items?.length == 0 ? <Text c="dimmed" fs="italic" ta="center">No Edge Box Found</Text> :
        <>
          {items.map((item) => <EdgeBoxCard {...item} />)}
        </>
      }
    </Paper>
  );
};

export default EdgeBoxListPage;
