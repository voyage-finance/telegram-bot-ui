import { Group, GroupProps, Title } from "@mantine/core";
import * as React from "react";
import styles from "./index.module.scss";
import cn from "classnames";
import { X } from "tabler-icons-react";

interface IProps extends GroupProps {
  size?: "lg" | "md" | "s" | "xs";
  showClose?: boolean;
}

const TitleWithLine: React.FunctionComponent<IProps> = ({
  size = "lg",
  showClose,
  ...props
}) => {
  return (
    <Group align="center" spacing={11} {...props}>
      <Title
        className={cn(
          styles.title,
          size == "md" && styles.md,
          size == "xs" && styles.xs
        )}
      >
        {props.children}
      </Title>
      <span className={styles.line} />
      {showClose && (
        <div className={styles.closeBtn}>
          <X />
        </div>
      )}
    </Group>
  );
};

export default TitleWithLine;
