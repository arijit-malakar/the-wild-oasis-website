"use client";

import { createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

type ReservationContextType = {
  range: DateRange | undefined;
  setRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  resetRange: () => void;
};

type ReservationProviderProps = {
  children: React.ReactNode;
};

const initialState = {
  from: undefined,
  to: undefined,
};

const ReservationContext = createContext<ReservationContextType>({
  range: initialState,
  setRange: () => {},
  resetRange: () => {},
});

const ReservationProvider: React.FC<ReservationProviderProps> = ({
  children,
}) => {
  const [range, setRange] = useState<DateRange | undefined>(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
};

const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error("Context was used outisde of Provider");
  return context;
};

export { ReservationProvider, useReservation };
