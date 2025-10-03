import type { CabinType } from "./cabinType";
import type { GuestType } from "./guestType";

export interface BookingType {
  id: number;
  created_at: Date;
  startDate: Date;
  endDate: Date;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  observations: string;
  guestId: GuestType["id"];
  cabinId: CabinType["id"];
  cabins: Pick<CabinType, "name" | "image">;
}
