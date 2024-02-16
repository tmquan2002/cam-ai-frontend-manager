import {
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Paper,
  Text,
  rem,
} from "@mantine/core";
import classes from "./IncidentDetail.module.scss";
import ReactPlayer from "react-player";
import BackButton from "../../components/button/BackButton";

const IncidentDetail = () => {
  return (
    <Box>
      <Box
        px={rem(64)}
        bg={"white"}
      >
        <Group
          py={rem(32)}
          align="center"
        >
          <BackButton
            color="#000"
            w={rem(36)}
            h={rem(36)}
          />
          <Text
            size={rem(20)}
            fw={500}
          >
            Incidents number 1
          </Text>
          <Badge color="green">Badge</Badge>
        </Group>
      </Box>
      <Divider />
      <Flex>
        <Box
          style={{
            flex: 1,
          }}
        >
          <Paper
            shadow="xs"
            mx={rem(64)}
            my={rem(40)}
            px={rem(32)}
            py={rem(20)}
          >
            <Text
              fw={500}
              size={rem(18)}
              mb={rem(20)}
            >
              Description
            </Text>
            <Divider
              color="#acacac"
              mb={rem(16)}
            />
            <Text>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque,
              repudiandae quos nam iure quo, laboriosam eos dolore quibusdam
              obcaecati enim omnis inventore animi nostrum et dolorum, est
              pariatur commodi excepturi.
            </Text>
          </Paper>
          <Paper
            shadow="xs"
            mx={rem(64)}
            my={rem(40)}
            px={rem(32)}
            py={rem(20)}
          >
            <Text
              fw={500}
              size={rem(18)}
              mb={rem(20)}
            >
              Evidence
            </Text>
            <Divider
              color="#acacac"
              mb={rem(20)}
            />
            <Box mb={rem(20)}>
              <ReactPlayer url="https://www.youtube.com/watch?v=TSwPIYczhPc&t=1s" />
            </Box>
            <Box>
              <ReactPlayer url="https://www.youtube.com/watch?v=e-EP1gMHP4k" />
            </Box>
          </Paper>
        </Box>
        <Box w={rem(500)}>
          <Paper
            shadow="xs"
            mt={rem(40)}
            mr={rem(20)}
            py={rem(4)}
          >
            <Box px={rem(32)}>
              <Text
                fw={500}
                size={rem(20)}
                my={rem(20)}
              >
                Time line
              </Text>
              <Divider color="#acacac" />
              <Box mt={rem(10)}>
                {[1, 2, 3].map((item) => {
                  return (
                    <Box key={item}>
                      <Group>
                        <Text className={classes.right_section_desctiption}>
                          June 28, 2024
                        </Text>
                        <Text className={classes.right_section_desctiption}>
                          Incident release
                        </Text>
                      </Group>
                      {item != 3 && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Divider
              color="#acacac"
              mt={rem(16)}
            />
            <Box px={rem(32)}>
              <Text
                fw={500}
                size={rem(20)}
                my={rem(20)}
              >
                Assigned to
              </Text>
              <Divider color="#acacac" />
              <Box mt={rem(10)}>
                {[1, 2, 3].map((item) => {
                  return (
                    <Box key={item}>
                      <Group>
                        <Text className={classes.right_section_desctiption}>
                          June 28, 2024
                        </Text>
                        <Text className={classes.right_section_desctiption}>
                          Incident release
                        </Text>
                      </Group>
                      {item != 3 && <Divider />}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Flex>
    </Box>
  );
};

export default IncidentDetail;
