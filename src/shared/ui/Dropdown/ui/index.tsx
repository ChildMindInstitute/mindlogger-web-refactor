import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { DropdownOptionList } from '../lib/interfaces';

import { Box } from '~/shared/ui';

type BaseDropdownProps = {
  title: string;
  options: DropdownOptionList;
  beforeIndexDivider?: number;
  buttonSx?: SxProps;
};

const BaseDropdown = ({ title, options, beforeIndexDivider, buttonSx }: BaseDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    return setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    return setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="customized-button"
        aria-controls={open ? 'customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        sx={{ ...buttonSx, textTransform: 'none', borderRadius: '4px', fontWeight: '400' }}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {title}
      </Button>

      <Menu
        id="customized-menu"
        MenuListProps={{
          'aria-labelledby': 'customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '6px',
            marginTop: 1,
            minWidth: 180,
          },
        }}
      >
        {options.map((option, index) => {
          const beforeThisElement = index === beforeIndexDivider;

          const dividerStyles = beforeIndexDivider &&
            beforeThisElement && { borderWidth: '1px', borderTop: `1px solid rgba(0,0,0, 0.175)` };

          const onClick = () => {
            handleClose();
            return option.onSelect(option.key);
          };

          return (
            <MenuItem key={option.key} onClick={onClick} sx={{ ...dividerStyles }}>
              {option.value}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default BaseDropdown;
