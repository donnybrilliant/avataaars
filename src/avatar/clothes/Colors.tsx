import { ClotheColorOption } from '../../options';
import Selector from '../../options/Selector';
import { withOptionValue } from '../../utils/optionValue';

export interface Props {
  maskID: string;
}

function makeColor(name: string, color: string) {
  function ColorComponent({ maskID }: Props) {
    return (
      <g
        id={`Color/Palette/${name}`}
        mask={`url(#${maskID})`}
        fillRule='evenodd'
        fill={color}>
        <rect id='🖍Color' x='0' y='0' width='264' height='110' />
      </g>
    );
  }
  return withOptionValue(ColorComponent, name);
}

export const Black = makeColor('Black', '#262E33');
export const Blue01 = makeColor('Blue01', '#65C9FF');
export const Blue02 = makeColor('Blue02', '#5199E4');
export const Blue03 = makeColor('Blue03', '#25557C');
export const Gray01 = makeColor('Gray01', '#E6E6E6');
export const Gray02 = makeColor('Gray02', '#929598');
export const Heather = makeColor('Heather', '#3C4F5C');
export const PastelBlue = makeColor('PastelBlue', '#B1E2FF');
export const PastelGreen = makeColor('PastelGreen', '#A7FFC4');
export const PastelOrange = makeColor('PastelOrange', '#FFDEB5');
export const PastelRed = makeColor('PastelRed', '#FFAFB9');
export const PastelYellow = makeColor('PastelYellow', '#FFFFB1');
export const Pink = makeColor('Pink', '#FF488E');
export const Red = makeColor('Red', '#FF5C5C');
export const White = makeColor('White', '#FFFFFF');

export default function Colors({ maskID }: Props) {
  return (
    <Selector option={ClotheColorOption} defaultOption={Blue03}>
      <Black maskID={maskID} />
      <Blue01 maskID={maskID} />
      <Blue02 maskID={maskID} />
      <Blue03 maskID={maskID} />
      <Gray01 maskID={maskID} />
      <Gray02 maskID={maskID} />
      <Heather maskID={maskID} />
      <PastelBlue maskID={maskID} />
      <PastelGreen maskID={maskID} />
      <PastelOrange maskID={maskID} />
      <PastelRed maskID={maskID} />
      <PastelYellow maskID={maskID} />
      <Pink maskID={maskID} />
      <Red maskID={maskID} />
      <White maskID={maskID} />
    </Selector>
  );
}
