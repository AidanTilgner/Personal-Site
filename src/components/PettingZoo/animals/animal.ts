import { useEffect, useRef } from "react";

interface usePetsOptions {
  name: string;
  petsRef: React.RefObject<HTMLParagraphElement>;
}

export const usePets = ({ name, petsRef }: usePetsOptions) => {
  const pets = useRef(0);

  const keyName = `${name}_total_pets`;

  const triggerPet = () => {
    pets.current += 1;
    petsRef.current!.innerHTML = `pets: ${pets.current}`;
    localStorage.setItem(keyName, pets.current.toString());
  };

  useEffect(() => {
    const numPets = localStorage.getItem(keyName)
      ? parseInt(localStorage.getItem(keyName)!)
      : 0;
    pets.current = numPets - 1;
    triggerPet();
  }, []);

  return { triggerPet };
};
