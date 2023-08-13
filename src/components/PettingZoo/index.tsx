import React from "react";
import { land_animals, sea_creatures } from "./animals";
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
          return <Animal key={index} is_talking={true} talk_speed={300} />;
        })}
      </div>
      <div className={styles.sign}>
        <pre>
          {`
        __________________________________
        |                                |
        | under water beyond this point  |
        |________________________________|
        |                                |
        |                                |
          `}
        </pre>
      </div>
      <div className={styles.waterline}>{`~`.repeat(100)}</div>
      <div className={styles.sea_creatures}>
        {sea_creatures.map((Animal, index) => {
          return <Animal key={index} is_talking={true} talk_speed={300} />;
        })}
      </div>
    </div>
  );
}

export default index;
