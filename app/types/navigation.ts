export type RootStackParamList = {
  '(tabs)': undefined;
  'map': {
    x: number;
    y: number;
    title: string;
  };
  'category/[categoryId]': {
    categoryId: string;
    categoryName: string;
  };
};