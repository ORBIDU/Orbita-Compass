import axios from 'axios';

// OpenWA Service URL (if running OpenWA REST server locally e.g. on port 8080 or project W:/home/naufal/OpenWA)
const OPENWA_API_URL = process.env.OPENWA_API_URL || 'http://localhost:8080';

export interface NotificationPayload {
  toPhoneNumber: string;
  toEmail: string;
  studentName: string;
  taskTitle: string;
  dueDate: string;
}

export const sendWaNotification = async (payload: NotificationPayload) => {
  try {
    const message = `🔔 *Pengingat Action Plan — ORBIDU Compass*\n\nHalo ${payload.studentName}!\nJangan lupa agenda berikut:\n📌 *${payload.taskTitle}*\n📅 Tenggat: ${payload.dueDate}\n\nTetap semangat meraih PTN impianmu! 🚀`;

    // Attempting sending via Open-WA HTTP endpoint
    const response = await axios.post(`${OPENWA_API_URL}/send-message`, {
      to: payload.toPhoneNumber,
      content: message
    }, { timeout: 5000 });

    console.log(`[OpenWA] Notification sent to ${payload.toPhoneNumber}`);
    return response.data;
  } catch (error: any) {
    console.warn(`[OpenWA Warning] Could not reach OpenWA endpoint (${OPENWA_API_URL}):`, error.message);
    // Fallback log demonstration
    console.log(`[WA Fallback Mock Output]:\nTo: ${payload.toPhoneNumber}\nMsg: Pengingat "${payload.taskTitle}" pada ${payload.dueDate}`);
    return { success: false, mode: 'mock', message: 'Logged to console' };
  }
};

export const sendEmailNotification = async (payload: NotificationPayload) => {
  console.log(`[Email Notification] Mock sent to ${payload.toEmail} for task "${payload.taskTitle}" on ${payload.dueDate}`);
  return { success: true, mode: 'mock' };
};
