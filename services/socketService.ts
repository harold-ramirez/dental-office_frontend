import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { io, Socket } from "socket.io-client";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

let socket: Socket | null = null;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const socketService = {
  /**
   * Conecta el cliente al servidor Socket.IO
   * @param token - JWT token para autenticación
   */
  async connect(token: string): Promise<void> {
    if (socket?.connected) {
      return;
    }

    try {
      socket = io(API_URL, {
        auth: {
          token: `Bearer ${token}`,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Escuchar el evento de nueva solicitud de cita
      socket.on(
        "appointment-request-created",
        (payload: { patientFullName: string }) => {
          socketService.sendNotification(
            "Solicitud recibida",
            `${payload.patientFullName} envió una solicitud de cita`,
          );
        },
      );

      // Manejo de conexión
      socket.on("connect", () => {
        console.log("Socket conectado al servidor");
      });

      // Manejo de desconexión
      socket.on("disconnect", () => {
        console.log("Socket desconectado del servidor");
      });

      // Manejo de errores
      socket.on("error", (error) => {
        console.error("Error en Socket.IO:", error);
      });

      // Manejo de reconexión
      socket.on("reconnect", () => {
        console.log("Socket reconectado al servidor");
      });
    } catch (error) {
      console.error("Error al conectar Socket.IO:", error);
      throw error;
    }
  },

  /**
   * Desconecta el socket
   */
  disconnect(): void {
    if (socket?.connected) {
      socket.disconnect();
      socket = null;
    }
  },

  /**
   * Envía una notificación local
   * @param title - Título de la notificación
   * @param body - Cuerpo de la notificación
   */
  async sendNotification(title: string, body: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Error al enviar notificación:", error);
    }
  },

  /**
   * Solicita permisos de notificaciones
   */
  async requestNotificationPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Error al solicitar permisos de notificación:", error);
      return false;
    }
  },

  /**
   * Obtiene el estado actual de la conexión
   */
  isConnected(): boolean {
    return socket?.connected ?? false;
  },
};
