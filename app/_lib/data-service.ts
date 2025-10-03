import { CabinType } from "@/app/_types/cabinType";
import { GuestType } from "../_types/guestType";
import { SettingsType } from "../_types/settingsType";
import { BookingType } from "../_types/bookingType";

import { notFound } from "next/navigation";
import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";

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

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
};

export const getGuest = async (email: string): Promise<GuestType> => {
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  return data;
};

export const createGuest = async (
  newGuest: Pick<GuestType, "email" | "fullName">
) => {
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
};

export const getBookings = async (
  guestId: number
): Promise<Omit<BookingType, "observations">[]> => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  const bookings = data.map((booking) => ({
    ...booking,
    cabins: Array.isArray(booking.cabins) ? booking.cabins[0] : booking.cabins,
  }));

  return bookings;
};

export const getBooking = async (bookingId: string): Promise<BookingType> => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be loaded");
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
