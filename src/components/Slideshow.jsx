import { Slide } from "react-slideshow-image";
import slideImages from "../assets/images";
import "react-slideshow-image/dist/styles.css";
import styles from "./Slider.module.css";

export default function Slider() {
  return (
    <div className={styles.container}>
      <Slide easing="ease">
        {slideImages.map((slide, index) => (
          <div className={styles.slide} key={index}>
            <div 
              className={styles.imageContainer}
              style={{ backgroundImage: `url(${slide})` }}
            >
              
            </div>
          </div>
        ))}
      </Slide>
    </div>
  );
}
