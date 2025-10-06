import { DeviceEventEmitter } from "react-native";
import { io, Socket } from "socket.io-client";
import { showNotification } from "./notificationService";

class SocketService {
  private socket: Socket | null;

  constructor() {
    this.socket = null;
  }

  connect() {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    this.socket = io(apiUrl);
    this.socket.on("connect", () => {
      console.log("Conectado al servidor WebSocket");
    });
    this.socket.on("disconnect", () => {
      console.log("Desconectado del servidor WebSocket");
    });
    this.socket.on("onNewRequest", (data) => {
      showNotification(
        "Nueva Solicitud de Cita",
        `${
          data.patientFullName || "Un Paciente"
        } envió una solicitud de cita. Entra para ver los detalles`
      );
      // Event trigger to refresh screen
      DeviceEventEmitter.emit("newAppointmentRequest", data);
    });
    this.socket.on("error", (error) => {
      console.log("Error en WebSocket:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
