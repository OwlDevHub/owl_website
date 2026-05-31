import CustomSlider from "./ImageGallery";
import images from "../../data/images";

const ImagesSection = () => {
  return (
    <div className="slider-section">
      <CustomSlider>
        {images.map((image) => (
          <img src={image.imgURL} alt={image.imgAlt} key={image.imgURL} />
        ))}
      </CustomSlider>
    </div>
  );
};

export default ImagesSection;
