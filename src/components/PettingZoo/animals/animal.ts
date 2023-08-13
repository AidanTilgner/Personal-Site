import { useEffect, useRef } from "react";

interface usePetsOptions {
  name: string;
  petsRef: React.RefObject<HTMLParagraphElement>;
  animalRef: React.RefObject<HTMLDivElement>;
  setTalking: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePets = ({
  name,
  petsRef,
  animalRef,
  setTalking,
}: usePetsOptions) => {
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

  useEffect(() => {
    // if the animal is talking, petting it will stop it from talking
    animalRef.current!.onmouseenter = () => {
      setTalking(false);
      triggerPet();
    };
    animalRef.current!.onmouseleave = () => {
      setTalking(true);
    };
  }, []);

  return { triggerPet };
};
