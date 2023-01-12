import { Tooltip, TooltipProps } from "@mantine/core";
import * as React from "react";

interface ICopyTooltipProps extends Omit<TooltipProps, "label"> {
  copied?: boolean;
}

const CopyTooltip: React.FunctionComponent<ICopyTooltipProps> = ({
  copied,
  children,
  ...props
}) => {
  return (
    <Tooltip
      label={copied ? "Copied!" : "Click to copy"}
      withArrow
      position="bottom"
      styles={{
        tooltip: {
          width: "100px !important",
          textAlign: "center",
        },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default CopyTooltip;
