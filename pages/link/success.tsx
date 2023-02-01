import { Text } from "@components/atoms";
import Card from "@components/moleculas/Card";
import { Stack } from "@mantine/core";
import * as React from "react";
import { CircleCheck } from "tabler-icons-react";

interface ISignSuccessPageProps {}

const SignSuccessPage: React.FunctionComponent<ISignSuccessPageProps> = (
  props
) => {
  return (
    <Stack
      mt={56}
      sx={{
        marginInline: "auto",
      }}
      align="center"
    >
      <Card p={30}>
        <Stack align="center">
          <CircleCheck style={{ color: "green" }} size={50} />
          <Text size="lg" weight="bold">
            Setup successfully
          </Text>
        </Stack>
      </Card>
    </Stack>
  );
};

export default SignSuccessPage;
