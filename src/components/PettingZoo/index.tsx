import React from "react";
import { land_animals } from "./animals";
import styles from "./index.module.scss";

export interface AnimalProps {
  is_talking: boolean;
  talk_speed: number;
}

function index() {
  return (
    <div className={styles.pettingZoo}>
      <div className={styles.land_animals}>
        {land_animals.map((Animal, index) => {
          return <Animal key={index} is_talking={false} talk_speed={300} />;
        })}
      </div>
    </div>
  );
}

export default index;
