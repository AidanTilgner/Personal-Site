import { useCallback, useEffect, useState } from "react";

interface UsePetsOptions {
  name: string;
  setTalking?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePets = ({ name, setTalking }: UsePetsOptions) => {
  const [numPets, setNumPets] = useState(0);
  const keyName = `${name}_total_pets`;

  useEffect(() => {
    const stored = Number.parseInt(localStorage.getItem(keyName) ?? "0", 10);
    setNumPets(Number.isFinite(stored) ? stored : 0);
  }, [keyName]);

  const triggerPet = useCallback(() => {
    setNumPets((current) => {
      const next = current + 1;
      localStorage.setItem(keyName, String(next));
      return next;
    });
  }, [keyName]);

  const petHandlers = {
    onMouseEnter: () => {
      setTalking?.(false);
      triggerPet();
    },
    onMouseLeave: () => setTalking?.(true),
  };

  return { triggerPet, numPets, petHandlers };
};
