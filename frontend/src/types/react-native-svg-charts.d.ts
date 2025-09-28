declare module 'react-native-svg-charts' {
  import * as React from 'react';
  import { ViewStyle } from 'react-native';

  export interface PieChartProps {
    style?: ViewStyle;
    data: Array<{
      key: number | string;
      value: number;
      svg?: object;
      label?: string;
    }>;
    innerRadius?: number;
    outerRadius?: number;
    padAngle?: number;
  }

  export class PieChart extends React.Component<PieChartProps> {}
}