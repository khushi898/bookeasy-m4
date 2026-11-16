import "dotenv/config";
import mongoose from "mongoose";
import Service from "./models/Services.js";
import Slot from "./models/Slots.js";

const services = [
  { name: "General Check-up", description: "A full health check with a GP", duration: 30, price: 40 },
  { name: "Eye Test", description: "Vision check with an optician", duration: 20, price: 25 },
  { name: "Blood Test", description: "Routine blood work", duration: 15, price: 30 },
  { name: "Vaccination", description: "Flu and travel vaccines", duration: 15, price: 20 },
  { name: "Dental Check-up", description: "Teeth and gum examination", duration: 30, price: 45 },
  { name: "Physiotherapy", description: "Treatment for joint and muscle pain", duration: 45, price: 55 },
  { name: "Skin Consultation", description: "Check moles, rashes and skin concerns", duration: 20, price: 35 },
  { name: "Hearing Test", description: "Full hearing assessment", duration: 30, price: 30 },
  { name: "Nutrition Advice", description: "Personal diet plan with a nutritionist", duration: 40, price: 50 },
  { name: "Counselling Session", description: "Confidential talk with a counsellor", duration: 50, price: 60 },
];

const pad = (n) => String(n).padStart(2, "0");

// Half-hour slots, 09:00–17:00, for the next 7 days
const makeSlots = () => {
  const slots = [];
  for (let d = 1; d <= 7; d++) {
    const day = new Date();
    day.setDate(day.getDate() + d);
    const date = day.toISOString().slice(0, 10);

    for (let h = 9; h < 17; h++) {
      slots.push({ date, startTime: `${pad(h)}:00`, endTime: `${pad(h)}:30` });
      slots.push({ date, startTime: `${pad(h)}:30`, endTime: `${pad(h + 1)}:00` });
    }
  }
  return slots;
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Add or update each service by name (safe to run many times)
  for (const s of services) {
    await Service.updateOne({ name: s.name }, { $set: s }, { upsert: true });
  }

  // Add slots, skipping any that already exist
  try {
    await Slot.insertMany(makeSlots(), { ordered: false });
  } catch (error) {
    if (error.code !== 11000) throw error;
  }

  console.log(`Services: ${await Service.countDocuments()}`);
  console.log(`Slots: ${await Slot.countDocuments()}`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});