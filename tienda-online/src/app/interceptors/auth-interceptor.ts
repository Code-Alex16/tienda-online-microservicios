import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth'; 

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authService = inject(AuthService);

  const token = authService.getToken();
  console.log('AuthInterceptorFn: Interceptando petición. Token encontrado:', token ? 'Sí' : 'No');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('AuthInterceptorFn: Cabecera Authorization añadida.');
  } else {
    console.warn('AuthInterceptorFn: No se encontró token, la petición se enviará sin Authorization.');
  }

  return next(req);
};