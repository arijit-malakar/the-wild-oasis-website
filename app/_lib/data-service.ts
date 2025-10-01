import { CabinType } from "@/app/_types/cabinType";
import { SettingsType } from "../_types/settingsType";

import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
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

export const getBookedDatesByCabinId = async (cabinId: CabinType["id"]) => {
  const today = new Date().setUTCHours(0, 0, 0, 0);
  const todayStr = new Date(today).toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${todayStr},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
};

export const getSettings = async (): Promise<SettingsType> => {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
};

export const getCountries = async (): Promise<
  { name: string; flag: string }[]
> => {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
};
