"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/AuthProvider";
import type { GarageCar } from "./matching";

const GUEST_KEY = "rlc_garage_guest";
const ACTIVE_KEY = "rlc_garage_active";

interface GarageContextValue {
  cars: GarageCar[];
  activeCar: GarageCar | null;
  loading: boolean;
  isOpen: boolean;
  openGarage: () => void;
  closeGarage: () => void;
  addCar: (car: Omit<GarageCar, "id">) => Promise<void>;
  removeCar: (id: string) => Promise<void>;
  setActiveCar: (id: string | null) => void;
}

const GarageContext = createContext<GarageContextValue>({
  cars: [], activeCar: null, loading: false, isOpen: false,
  openGarage: () => {}, closeGarage: () => {},
  addCar: async () => {}, removeCar: async () => {}, setActiveCar: () => {},
});

function readGuestCars(): GarageCar[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [cars, setCars] = useState<GarageCar[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (authLoading) return;
    setLoading(true);
    let list: GarageCar[];
    if (user) {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_cars")
        .select("id, make, model, year, nickname")
        .eq("user_id", user.id)
        .order("created_at");
      list = (data as GarageCar[]) ?? [];
    } else {
      list = readGuestCars();
    }
    setCars(list);
    const savedActive = localStorage.getItem(ACTIVE_KEY);
    setActiveId(list.some(c => c.id === savedActive) ? savedActive : (list[0]?.id ?? null));
    setLoading(false);
  }, [user, authLoading]);

  useEffect(() => { refresh(); }, [refresh]);

  async function addCar(car: Omit<GarageCar, "id">) {
    if (user) {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_cars")
        .insert({ user_id: user.id, make: car.make, model: car.model, year: car.year, nickname: car.nickname })
        .select("id, make, model, year, nickname")
        .single();
      if (data) {
        setCars(prev => [...prev, data as GarageCar]);
        setActiveCar((data as GarageCar).id);
      }
    } else {
      const newCar: GarageCar = { ...car, id: crypto.randomUUID() };
      const next = [...readGuestCars(), newCar];
      localStorage.setItem(GUEST_KEY, JSON.stringify(next));
      setCars(next);
      setActiveCar(newCar.id);
    }
  }

  async function removeCar(id: string) {
    if (user) {
      const supabase = createClient();
      await supabase.from("user_cars").delete().eq("id", id);
    } else {
      localStorage.setItem(GUEST_KEY, JSON.stringify(readGuestCars().filter(c => c.id !== id)));
    }
    setCars(prev => {
      const next = prev.filter(c => c.id !== id);
      if (activeId === id) setActiveCar(next[0]?.id ?? null);
      return next;
    });
  }

  function setActiveCar(id: string | null) {
    setActiveId(id);
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  }

  const activeCar = cars.find(c => c.id === activeId) ?? null;

  return (
    <GarageContext.Provider value={{
      cars, activeCar, loading, isOpen,
      openGarage: () => setIsOpen(true),
      closeGarage: () => setIsOpen(false),
      addCar, removeCar, setActiveCar,
    }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  return useContext(GarageContext);
}
