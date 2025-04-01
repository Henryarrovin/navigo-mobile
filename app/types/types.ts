export interface ICoordinates {
  x: number;
  y: number;
}

export interface ILocation {
  coordinates: ICoordinates;
  zone: string;
}

export interface IProduct {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  location: ILocation;
}

export interface ICategory {
  _id: string;
  name: string;
}

export interface IApiResponse<T> {
  message?: string;
  error?: string;
  product?: IProduct;
  category?: ICategory;
  products?: IProduct[];
  categories?: ICategory[];
  data?: T;
}
