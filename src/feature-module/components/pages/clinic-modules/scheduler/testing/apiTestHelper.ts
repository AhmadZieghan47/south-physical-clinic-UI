/**
 * Scheduler API Test Helper
 * 
 * Use this in browser console to test API integrations
 * 
 * Usage:
 * 1. Start backend server
 * 2. Open browser DevTools console on scheduler page
 * 3. Run: testSchedulerAPIs()
 */

import { SchedulerAPI } from "../api";
import { getTodayDate } from "../utils";

export async function testTherapistsAPI() {
  console.log("🧪 Testing Therapists API...");
  try {
    const therapists = await SchedulerAPI.listTherapists();
    console.log("✅ Therapists loaded:", therapists);
    return therapists;
  } catch (error) {
    console.error("❌ Therapists API failed:", error);
    throw error;
  }
}

export async function testAppointmentsAPI(date?: string) {
  const testDate = date || getTodayDate();
  console.log(`🧪 Testing Appointments API for ${testDate}...`);
  try {
    const appointments = await SchedulerAPI.listAppointmentsByDate(testDate);
    console.log("✅ Appointments loaded:", appointments);
    return appointments;
  } catch (error) {
    console.error("❌ Appointments API failed:", error);
    throw error;
  }
}

export async function testOverbookingAPI() {
  console.log("🧪 Testing Overbooking Queue API...");
  try {
    const queue = await SchedulerAPI.listOverbook();
    console.log("✅ Overbooking queue loaded:", queue);
    return queue;
  } catch (error) {
    console.error("❌ Overbooking API failed:", error);
    throw error;
  }
}

export async function testCreateAppointment(payload: {
  date: string;
  hour: number;
  patientId: string;
  therapistId: string;
  kind: "STANDARD" | "EXTRA_CARE";
}) {
  console.log("🧪 Testing Create Appointment API...", payload);
  try {
    const appointment = await SchedulerAPI.createAppointment(payload);
    console.log("✅ Appointment created:", appointment);
    return appointment;
  } catch (error) {
    console.error("❌ Create Appointment failed:", error);
    throw error;
  }
}

export async function testAddToQueue(payload: {
  patientId: string;
  extraCare: boolean;
  reason?: string;
}) {
  console.log("🧪 Testing Add to Overbooking Queue...", payload);
  try {
    const item = await SchedulerAPI.addOverbook(payload);
    console.log("✅ Added to queue:", item);
    return item;
  } catch (error) {
    console.error("❌ Add to Queue failed:", error);
    throw error;
  }
}

/**
 * Run all API tests sequentially
 */
export async function testSchedulerAPIs() {
  console.log("🚀 Starting Scheduler API Integration Tests...\n");

  const results = {
    therapists: false,
    appointments: false,
    overbooking: false,
  };

  // Test 1: Therapists
  try {
    await testTherapistsAPI();
    results.therapists = true;
  } catch (error) {
    console.error("Therapists test failed");
  }

  // Test 2: Appointments
  try {
    await testAppointmentsAPI();
    results.appointments = true;
  } catch (error) {
    console.error("Appointments test failed");
  }

  // Test 3: Overbooking
  try {
    await testOverbookingAPI();
    results.overbooking = true;
  } catch (error) {
    console.error("Overbooking test failed");
  }

  // Summary
  console.log("\n📊 Test Results:");
  console.log("Therapists API:", results.therapists ? "✅ PASS" : "❌ FAIL");
  console.log("Appointments API:", results.appointments ? "✅ PASS" : "❌ FAIL");
  console.log("Overbooking API:", results.overbooking ? "✅ PASS" : "❌ FAIL");

  const allPassed = Object.values(results).every((r) => r === true);
  if (allPassed) {
    console.log("\n🎉 All tests PASSED! Scheduler is ready to use.");
  } else {
    console.log("\n⚠️  Some tests FAILED. Check errors above and verify backend is running.");
  }

  return results;
}

// Export for window access in browser console
if (typeof window !== "undefined") {
  (window as any).testSchedulerAPIs = testSchedulerAPIs;
  (window as any).testTherapistsAPI = testTherapistsAPI;
  (window as any).testAppointmentsAPI = testAppointmentsAPI;
  (window as any).testOverbookingAPI = testOverbookingAPI;
  (window as any).testCreateAppointment = testCreateAppointment;
  (window as any).testAddToQueue = testAddToQueue;
}

