export interface User {
  id_usuario: number;
  username: string;
  email: string;
}

// Interfaz para la estructura del cuerpo (body) de la respuesta de login
export interface AuthResponseBody {
  token: string;
  id_usuario: number;
  username: string;
  email: string;
}

// Interfaz para la respuesta COMPLETA del backend al login
export interface AuthResponse {
  error: boolean;
  status: number;
  message: string;
  body: AuthResponseBody;
}