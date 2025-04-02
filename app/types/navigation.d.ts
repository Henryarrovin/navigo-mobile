import { NavigatorScreenParams } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      '(tabs)': undefined;
      'category/[categoryId]': {
        categoryId: string;
        categoryName: string;
      };
      'map': {
        x: string;
        y: string;
        title: string;
      };
    }
  }
}