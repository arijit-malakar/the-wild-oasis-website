import { CabinType } from "@/app/_types/cabinType";

import { notFound } from "next/navigation";
import { supabase } from "./supabase";

/////////////
// GET

export const getCabin = async (id: string): Promise<CabinType> => {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
};

export const getCabins = async (): Promise<
  Omit<CabinType, "description">[]
> => {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  // For testing
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};
