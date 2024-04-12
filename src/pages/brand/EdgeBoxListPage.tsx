import {
  Badge,
  Box,
  Collapse,
  Divider,
  Flex,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  SimpleGrid,
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
import {
  EdgeBoxActivationStatus,
  EdgeBoxLocation,
  EdgeBoxStatus,
  EdgeboxInstallStatus,
} from "../../models/CamAIEnum";
import { useNavigate } from "react-router-dom";

const renderEdgeBoxActivationStatusBadge = (
  status: EdgeBoxActivationStatus | undefined
) => {
  switch (status) {
    case EdgeBoxActivationStatus.Activated:
      return <Badge color="green">{EdgeBoxActivationStatus.Activated}</Badge>;
    case EdgeBoxActivationStatus.Pending:
      return <Badge color={"orange"}>{EdgeBoxActivationStatus.Pending}</Badge>;
    case EdgeBoxActivationStatus.NotActivated:
      return <Badge color={"gray"}>INACTIVE</Badge>;
    case EdgeBoxActivationStatus.Failed:
      return <Badge color={"red"}>{EdgeBoxActivationStatus.Failed}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdgeboxStatusBadge = (status: EdgeBoxStatus | undefined) => {
  switch (status) {
    case EdgeBoxStatus.Active:
      return <Badge color="green">{EdgeBoxStatus.Active}</Badge>;
    case EdgeBoxStatus.Broken:
      return <Badge color={"orange"}>{EdgeBoxStatus.Broken}</Badge>;
    case EdgeBoxStatus.Inactive:
      return <Badge color={"red"}>{EdgeBoxStatus.Inactive}</Badge>;
    case EdgeBoxStatus.Disposed:
      return <Badge color={"gray"}>{EdgeBoxStatus.Disposed}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdgeboxInstallStatusBadge = (
  status: EdgeboxInstallStatus | undefined
) => {
  switch (status) {
    case EdgeboxInstallStatus.Working:
      return <Badge color="green">{EdgeboxInstallStatus.Working}</Badge>;
    case EdgeboxInstallStatus.Unhealthy:
      return <Badge color={"yellow"}>{EdgeboxInstallStatus.Unhealthy}</Badge>;
    case EdgeboxInstallStatus.Disabled:
      return <Badge color={"gray"}>{EdgeboxInstallStatus.Disabled}</Badge>;
    case EdgeboxInstallStatus.New:
      return <Badge color={"blue"}>{EdgeboxInstallStatus.New}</Badge>;
    case EdgeboxInstallStatus.Connected:
      return <Badge color={"teal"}>{EdgeboxInstallStatus.Connected}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdgeboxLocationBadge = (location: EdgeBoxLocation | undefined) => {
  switch (location) {
    case EdgeBoxLocation.Disposed:
      return <Badge color="teal">{EdgeBoxLocation.Disposed}</Badge>;
    case EdgeBoxLocation.Idle:
      return <Badge color={"blue"}>{EdgeBoxLocation.Idle}</Badge>;
    case EdgeBoxLocation.Installing:
      return <Badge color={"yellow"}>{EdgeBoxLocation.Installing}</Badge>;
    case EdgeBoxLocation.Occupied:
      return <Badge color={"green"}>{EdgeBoxLocation.Occupied}</Badge>;
    case EdgeBoxLocation.Uninstalling:
      return <Badge color={"orange"}>{EdgeBoxLocation.Uninstalling}</Badge>;
    case undefined:
      return <Badge>Empty</Badge>;
  }
};

const renderEdgeBoxDetail = (
  edgeBoxInstall: EdgeBoxInstallDetail | undefined
) => {
  if (edgeBoxInstall) {
    return (
      <>
        <Flex>
          <Image
            radius={"md"}
            src={
              "https://cdn.dribbble.com/users/40756/screenshots/2917981/media/56fae174592893d88f6ca1be266aaaa6.png?resize=450x338&vertical=center"
            }
          />
          <Box ml={rem(40)} style={{ flex: 1 }}>
            <Group gap={rem(40)}>
              <Box>
                <Text fw={500} c={"dimmed"}>
                  Name
                </Text>
                <Text fw={500}>{edgeBoxInstall?.edgeBox.name}</Text>
              </Box>

              <Box>
                <Text fw={500} c={"dimmed"}>
                  Edgebox status
                </Text>
                {renderEdgeboxStatusBadge(
                  edgeBoxInstall?.edgeBox?.edgeBoxStatus
                )}
              </Box>

              <Box>
                <Text fw={500} c={"dimmed"}>
                  Edgebox location
                </Text>
                {renderEdgeboxLocationBadge(
                  edgeBoxInstall?.edgeBox.edgeBoxLocation
                )}
              </Box>

              <Box>
                <Text fw={500} c={"dimmed"}>
                  Activation status
                </Text>
                {renderEdgeBoxActivationStatusBadge(
                  edgeBoxInstall?.activationStatus
                )}
              </Box>

              <Box>
                <Text fw={500} c={"dimmed"}>
                  Install status
                </Text>
                {renderEdgeboxInstallStatusBadge(
                  edgeBoxInstall?.edgeBoxInstallStatus
                )}
              </Box>
            </Group>
            <Divider my={rem(20)} color={"#000"} />
            <Group>
              <Text miw={rem(120)} fw={600}>
                Description :
              </Text>
              <Text>{edgeBoxInstall?.edgeBox?.edgeBoxModel?.description}</Text>
            </Group>
            <Divider my={rem(20)} color={"#000"} />
            <SimpleGrid cols={2}>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  Model name :
                </Text>
                <Text>{edgeBoxInstall?.edgeBox?.edgeBoxModel?.name}</Text>
              </Group>

              <Group>
                <Text miw={rem(120)} fw={600}>
                  Model code :
                </Text>
                <Text>{edgeBoxInstall?.edgeBox?.edgeBoxModel?.modelCode}</Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  Manufacturer :
                </Text>
                <Text>
                  {edgeBoxInstall?.edgeBox?.edgeBoxModel?.manufacturer}
                </Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  CPU :
                </Text>
                <Text>{edgeBoxInstall?.edgeBox?.edgeBoxModel?.cpu}</Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  RAM :
                </Text>
                <Text>{edgeBoxInstall?.edgeBox?.edgeBoxModel?.ram}</Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  Storage :
                </Text>
                <Text>{edgeBoxInstall?.edgeBox?.edgeBoxModel?.storage}</Text>
              </Group>
              <Group>
                <Text miw={rem(120)} fw={600}>
                  OS :
                </Text>
                <Text>{edgeBoxInstall?.edgeBox?.edgeBoxModel?.os}</Text>
              </Group>
            </SimpleGrid>
          </Box>
        </Flex>
      </>
    );
  }

  return (
    <Paper p={rem(32)} m={rem(32)} shadow="xs">
      <Group align="center" pb={rem(28)} gap={"sm"}>
        <Text size="lg" fw={"bold"} fz={25} c={"light-blue.4"} mr={"sm"}>
          Edge Box
        </Text>
      </Group>
      <Flex>
        <Image
          radius={"md"}
          src={
            "https://cdn.dribbble.com/users/40756/screenshots/2917981/media/56fae174592893d88f6ca1be266aaaa6.png?resize=450x338&vertical=center"
          }
        />
        <Box ml={rem(40)} style={{ flex: 1 }}>
          <Text>No edgebox available</Text>
        </Box>
      </Flex>
    </Paper>
  );
};

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
          {renderEdgeBoxDetail(props)}
        </Box>
      </Collapse>
    </Box>
  );
};

const EdgeBoxListPage = () => {
  const [opened] = useDisclosure(false);
  const { data: brandList, isLoading: isGetBrandListLoading } = useGetBrandList(
    { size: 1 }
  );
  const { data: edgeBoxList, isLoading: isGetEdgeBoxListLoading } =
    useGetEdgeBoxInstallByBrandId(
      brandList ? brandList?.values?.[0]?.id : null
    );

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
      <Collapse in={opened}>
        <form></form>
      </Collapse>
      {items}
    </Paper>
  );
};

export default EdgeBoxListPage;
