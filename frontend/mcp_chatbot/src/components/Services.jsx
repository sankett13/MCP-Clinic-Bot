import {
  Stethoscope,
  Heart,
  UserCheck,
  Shield,
  Activity,
  Baby,
  Eye,
  Bone,
  Brain,
  Pill,
} from "lucide-react";


const Services = () => {
  const services = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "General Medicine",
      description:
        "Comprehensive primary care services for adults and children, including routine check-ups and health maintenance.",
      features: [
        "Annual physicals",
        "Preventive care",
        "Chronic disease management",
      ],
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Cardiology",
      description:
        "Expert cardiac care including heart health assessments, monitoring, and treatment of cardiovascular conditions.",
      features: [
        "ECG testing",
        "Blood pressure monitoring",
        "Heart disease prevention",
      ],
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Family Medicine",
      description:
        "Complete healthcare solutions for the entire family, from newborns to seniors.",
      features: ["Pediatric care", "Geriatric medicine", "Family planning"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Preventive Care",
      description:
        "Proactive healthcare to prevent illness and maintain optimal health throughout your life.",
      features: ["Vaccinations", "Health screenings", "Wellness programs"],
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Emergency Care",
      description:
        "24/7 emergency medical services for urgent health situations and acute care needs.",
      features: ["Urgent care", "Minor surgeries", "Emergency treatment"],
    },
    {
      icon: <Baby className="h-8 w-8" />,
      title: "Pediatrics",
      description:
        "Specialized medical care for infants, children, and adolescents with pediatric expertise.",
      features: [
        "Well-child visits",
        "Developmental screenings",
        "Immunizations",
      ],
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Ophthalmology",
      description:
        "Comprehensive eye care services including vision testing and treatment of eye conditions.",
      features: ["Eye exams", "Vision correction", "Eye disease treatment"],
    },
    {
      icon: <Bone className="h-8 w-8" />,
      title: "Orthopedics",
      description:
        "Treatment of musculoskeletal conditions, injuries, and disorders affecting bones and joints.",
      features: ["Joint care", "Sports injuries", "Physical therapy"],
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Neurology",
      description:
        "Diagnosis and treatment of nervous system disorders and neurological conditions.",
      features: ["Headache treatment", "Neurological testing", "Brain health"],
    },
    {
      icon: <Pill className="h-8 w-8" />,
      title: "Pharmacy Services",
      description:
        "On-site pharmacy with prescription filling, medication counseling, and drug interactions.",
      features: [
        "Prescription filling",
        "Medication review",
        "Drug counseling",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Medical Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive healthcare services with state-of-the-art
            facilities and experienced medical professionals dedicated to your
            wellbeing.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-gray-700"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-blue-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Need Medical Assistance?
            </h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Our AI-powered chatbot can help you book appointments, answer
              questions about our services, and provide general medical
              information 24/7.
            </p>
            <button
              onClick={() => {
                // This will be handled by the ChatBot component
                const chatButton = document.querySelector("[data-chat-toggle]");
                if (chatButton) chatButton.click();
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Chat with Our Assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
