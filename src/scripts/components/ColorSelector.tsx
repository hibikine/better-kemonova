import * as React from 'react';
import { useState, useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useRecoilState } from 'recoil';
import { colorThemeState } from '../states/settings/colorThemeState';
export const colorRadios = [
  { name: 'ライトテーマ', value: 'light' },
  { name: 'ダークテーマ', value: 'dark' },
  { name: 'システムテーマ', value: 'system' },
] as const;
export const ColorSelector = () => {
  const [colorThemeSettings, setColorThemeSettings] =
    useRecoilState(colorThemeState);
  return (
    <>
      <ButtonGroup>
        {colorRadios.map(({ name, value }) => (
          <ToggleButton
            key={value}
            className={`color-selector-button-${value}`}
            id={`color-scheme-${value}`}
            type="radio"
            name="color-scheme"
            variant={`outline-${value === 'system' ? 'primary' : `${value}`}`}
            value={value}
            checked={colorThemeSettings === value}
            onChange={(e) => {
              setColorThemeSettings(e.currentTarget.value as typeof value);
            }}
          >
            {name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
};
