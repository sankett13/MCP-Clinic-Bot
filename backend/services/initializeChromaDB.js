import { CloudClient } from "chromadb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const client = new CloudClient({
  apiKey: process.env.CHROMADB_API_KEY,
  tenant: process.env.CHROMADB_TENANT,
  database: process.env.CHROMADB_DATABASE,
});

async function initializeChromaDB() {
  try {
    const collection = await client.getOrCreateCollection({
      name: "clinic_mcp_collection",
      metadata: {
        description: "Collection for Clinic MCP Agent",
      },
    });

    await collection.add({
      documents: [
        "CareWell Medical Clinic is a multi-specialty health center located in Ahmedabad, India. We provide high-quality, affordable healthcare services ranging from general medicine to specialized treatments.",
        "Services offered by CareWell Medical Clinic: General Medicine, Pediatrics, Dermatology, Cardiology, Gynecology, Physiotherapy, Lab Testing, Vaccination.",
        "Our Doctors: Dr. Aarti Mehta – General Physician, Dr. Rakesh Shah – Cardiologist, Dr. Neha Rao – Pediatrician, Dr. Priya Sinha – Dermatologist, Dr. Kavita Joshi – Gynecologist.",
        "Clinic Hours: Monday to Friday: 9:00 AM – 7:00 PM, Saturday: 10:00 AM – 2:00 PM, Sunday: Closed.",
        "Appointments can be scheduled online via our chatbot, over the phone, or in person at the front desk. Walk-ins are accepted based on availability. Patients are advised to arrive at least 10 minutes before their scheduled time.",
        "Lab reports are usually available within 48 hours and can be accessed through a secure link sent via SMS or email. Patients may also request reports directly via the chatbot.",
        "CareWell Medical Clinic accepts most major insurance providers including Star Health, HDFC ERGO, ICICI Lombard, and New India Assurance.",
        "FAQ - Do you accept walk-ins? Yes, but only if time slots are available.",
        "FAQ - How do I cancel my appointment? You can cancel through the chatbot or by calling the clinic.",
        "FAQ - Do you provide emergency care? No, we recommend visiting a hospital for emergency services.",
        "FAQ - Is teleconsultation available? Yes, video consultations can be booked through the chatbot.",
      ],
      metadatas: [
        { source: "about" },
        { source: "services" },
        { source: "doctors" },
        { source: "hours" },
        { source: "appointments" },
        { source: "lab_reports" },
        { source: "insurance" },
        { source: "faq_walkins" },
        { source: "faq_cancel" },
        { source: "faq_emergency" },
        { source: "faq_teleconsultation" },
      ],
      ids: [
        "doc_about",
        "doc_services",
        "doc_doctors",
        "doc_hours",
        "doc_appointments",
        "doc_lab_reports",
        "doc_insurance",
        "doc_faq_walkins",
        "doc_faq_cancel",
        "doc_faq_emergency",
        "doc_faq_teleconsultation",
      ],
    });

    console.log("ChromaDB collection initialized successfully!");

    const result = await collection.query({
      queryTexts: ["What services do you offer?"],
      nResults: 2,
    });

    return collection;
  } catch (error) {
    console.error("Error initializing ChromaDB:", error);
    throw error;
  }
}

// Initialize the database
// initializeChromaDB("What services do you offer?").catch(console.error);

export { client, initializeChromaDB };
