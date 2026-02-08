import "./styles.css";
const services = [
  {
    title: "Online Reading",
    description:
      "Read your favorite books directly within the app anytime, anywhere.",
    icon: "📖",
  },
  {
    title: "Book Discussion",
    description:
      "Join conversations, share opinions, and explore different perspectives on books.",
    icon: "💬",
  },
  {
    title: "Book Exchange",
    description:
      "Exchange books with other users and discover new reads from the community.",
    icon: "🔄",
  },
];

function ServicesSection() {
  return (
    <div className="container mx-auto my-5">
      <h2 className="mb-5 text-center">Services</h2>
      <div className="gap-3 container-services">
        {services.map((service) => (
          <div className="px-4 shadow-sm service col-md-4" key={service.title}>
            <div className="text-center h-100">
              <div className="icon">{service.icon}</div>
              <h5 className="my-3 ps-0 card-title">{service.title}</h5>
              <p className="pb-4 card-text">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesSection;
