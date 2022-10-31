import * as React from "react";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import styled, { withTheme } from "styled-components";
import theme from "../styles/theme";
import MenuItem from './MenuItem';
import GreenAccentText from './GreenAccentText';

export type Props = {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  theme: typeof theme;
  icon?: typeof React.Component | React.FC<any>;
  iconSVGProps?: any;
  innerRef?: (ref: HTMLDivElement) => void;
  title: React.ReactNode;
  containerId?: string;
  accentText?: string;
  iconColor?: string;
  isDarkMode?: boolean;
};

function BlockMenuItem({
  selected,
  disabled,
  onClick,
  title,
  icon,
  iconSVGProps,
  innerRef,
  accentText,
  containerId = "block-menu-container",
  theme,
  iconColor,
  isDarkMode,
}: Props) {
  const Icon = icon;

  const ref = React.useCallback(
    (node) => {
      innerRef?.(node);
      if (selected && node) {
        scrollIntoView(node, {
          scrollMode: "if-needed",
          block: "center",
          boundary: (parent) => parent.id !== containerId,
        });
      }
    },
    [selected, containerId]
  );

  return (
    <MenuItem
      selected={selected}
      onClick={disabled ? undefined : onClick}
      ref={ref}
    >
      <Group>
        {Icon && (
          <>
            <Icon color={iconColor || theme.blockToolbarIconColor}
              className={!isDarkMode && iconColor ? 
                'block-menu-item-icon light' : 'block-menu-item-icon'}
              size={20} {...iconSVGProps} />
            &nbsp;&nbsp;
          </>
        )}
        <Title>{title}</Title>
      </Group>
      <Group>
        {accentText && (
          <GreenAccentText>
            {accentText}
          </GreenAccentText>
        )}
      </Group>
    </MenuItem>
  );
}

const Group = styled.div`
  display: flex;
  align-items: center;

  .block-menu-item-icon {
    &.light {
      filter: saturate( 300% ) brightness( 93% );
    }
  }
`;

const Title = styled.span`
  margin-right: 60px;
`;

export default withTheme(BlockMenuItem);