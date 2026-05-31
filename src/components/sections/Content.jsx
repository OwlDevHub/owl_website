import ImagesSection from "./ImagesSection";

const Content = () => {
  return (
    <div className="about">
      <div className="about-header">
        <span className="about-badge">About OWL</span>
      </div>
      <p>
        OWL is a powerful and intuitive platform for managing projects, tasks,
        and teams, created specifically for developers and IT teams.
      </p>
      <div className="about-divider" />
      <ImagesSection />
    </div>
  );
};

export default Content;
