import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { useRecoilState } from 'recoil';
import { fontSizeState } from '../states/settings/fontSizeState';
export const fontSizes = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' },
] as const;
export const FontSizeSelector = () => {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);
  return (
    <Form>
      <div className="mb-3">
        {fontSizes.map(({ label, value }) => (
          <Form.Check
            inline
            label={label}
            key={value}
            id={`font-size-${value}`}
            type="radio"
            value={value}
            checked={fontSize === value}
            onChange={(e) => setFontSize(e.target.value)}
          />
        ))}
      </div>
    </Form>
  );
};
