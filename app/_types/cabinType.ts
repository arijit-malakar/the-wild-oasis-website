export type CabinType = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
};

export type CabinCapacityFilter = "small" | "medium" | "large" | "all";
