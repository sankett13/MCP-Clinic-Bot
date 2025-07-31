import { Award, Users, Clock, MapPin } from "lucide-react";
import MedicalTeam from "../assets/images/Medical_Team.jpg";
import Doctor1 from "../assets/images/Doctor1.jpg";
import Doctor2 from "../assets/images/Doctor2.jpg";
import Doctor3 from "../assets/images/Doctor3.jpg";

const About = () => {
  const stats = [
    {
      icon: <Award className="h-8 w-8" />,
      number: "15+",
      label: "Years of Excellence",
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: "50+",
      label: "Medical Professionals",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      number: "24/7",
      label: "Emergency Support",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      number: "3",
      label: "Clinic Locations",
    },
  ];

  const team = [
    {
      name: "Dr. James Anderson",
      specialty: "Chief Medical Officer",
      experience: "20+ years",
      image: Doctor1,
    },
    {
      name: "Dr. Olivia Patel",
      specialty: "Cardiologist",
      experience: "15+ years",
      image: Doctor2,
    },
    {
      name: "Dr. David Kim",
      specialty: "Pediatrician",
      experience: "12+ years",
      image: Doctor3,
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About CareWell Medical Clinic
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Founded in 2009, CareWell Medical Clinic has been a trusted
            healthcare provider in our community, committed to delivering
            exceptional medical care with compassion and expertise.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Our Story & Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              CareWell Medical Clinic was established with a simple yet powerful
              vision: to provide accessible, high-quality healthcare that puts
              patients first. Over the years, we've grown from a small practice
              to a comprehensive medical facility serving thousands of families.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to deliver personalized, evidence-based medical
              care while fostering long-term relationships with our patients. We
              believe in treating not just symptoms, but the whole person,
              ensuring comprehensive care that addresses both physical and
              emotional wellbeing.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Excellence in Care
                  </h4>
                  <p className="text-gray-600">
                    Continuously improving our services and maintaining the
                    highest medical standards.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Patient-Centered Approach
                  </h4>
                  <p className="text-gray-600">
                    Every decision we make is guided by what's best for our
                    patients and their families.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={MedicalTeam}
              alt="Medical team"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />
            <div className="absolute inset-0 bg-blue-600 bg-opacity-10 rounded-2xl"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-blue-600">{stat.icon}</div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Medical Team
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced healthcare professionals are dedicated to
              providing you with the highest quality medical care in a
              compassionate environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((doctor, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative mb-6">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-0 hover:bg-opacity-10 rounded-full transition-all duration-300"></div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {doctor.name}
                </h4>
                <p className="text-blue-600 font-semibold mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-gray-600">{doctor.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
