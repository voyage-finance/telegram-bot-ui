import { createStyles } from "@mantine/core";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { PropsWithChildren } from "react";

type IProps = LinkProps & {
  exact?: boolean;
};

const useStyles = createStyles((theme, _, getRef) => ({
  button: {
    boxSizing: "border-box",
    cursor: "pointer",
    fontSize: theme.fontSizes.lg,
    lineHeight: "20px",
    fontWeight: 700,
    color: "white",
    borderWidth: 0,
    [`&.active .${getRef("border")}, &:hover .${getRef("border")}`]: {
      width: "100%",
    },
    ["&:not(:last-child)"]: {
      marginRight: 40,
    },
  },
  border: {
    ref: getRef("border"),
    height: 2,
    width: 0,
    background: theme.fn.linearGradient(
      180,
      theme.other.gradients.brand.from,
      theme.other.gradients.brand.to
    ),
    transition: "width 0.1s linear",
  },
}));

const NavLink: React.FC<PropsWithChildren<IProps>> = ({
  exact,
  children,
  ...props
}) => {
  const { classes } = useStyles();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname;
    setIsActive(
      exact
        ? pathname === props.href.toString()
        : pathname.startsWith(props.href.toString())
    );
  }, []);
  return (
    <Link {...props}>
      <div className={`${classes.button} ${isActive ? "active" : ""}`}>
        <div>{children}</div>
        <div className={classes.border} />
      </div>
    </Link>
  );
};

export default NavLink;
