import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs'; 
import { tap, catchError } from 'rxjs/operators'; 
import { environment } from '../../environments/environment';
import { AuthResponse, User, AuthResponseBody } from '../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    console.log('AuthService constructor: isPlatformBrowser =', this.isBrowser);

 
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.isBrowser) {
      console.log('AuthService constructor: Ejecutando lógica de localStorage en el navegador.');
      try {
        const userJson = localStorage.getItem('currentUser');
        const token = localStorage.getItem('jwtToken');
        console.log('AuthService constructor: userJson de localStorage =', userJson);
        console.log('AuthService constructor: token de localStorage =', token);

        if (userJson && token) {
          const storedUser = JSON.parse(userJson);
          console.log('AuthService constructor: Usuario parseado de localStorage =', storedUser);
          this.currentUserSubject.next(storedUser); 
        } else {
          console.log('AuthService constructor: No se encontró usuario o token en localStorage. Limpiando...');
          localStorage.removeItem('currentUser');
          localStorage.removeItem('jwtToken');
          this.currentUserSubject.next(null); 
        }
      } catch (e) {
        console.error('AuthService constructor: Error al parsear el usuario o token desde localStorage:', e);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('jwtToken');
        this.currentUserSubject.next(null);
      }
    } else {
      console.log('AuthService constructor: No es navegador, currentUserSubject permanece en null.');
    }

    this.currentUser.subscribe(user => {
      console.log('AuthService: currentUserSubject ha emitido un nuevo valor:', user);
    });
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string): Observable<any> {
    console.log('AuthService: Intentando registrar usuario:', { username, email });
    return this.http.post<any>(`${this.apiUrl}/usuarios/register`, { username, email, password }).pipe(
      tap((response: any) => { 
        console.log('AuthService: Respuesta de registro:', response);
      }),
      catchError((err: any) => { 
        console.error('AuthService: Error en el registro:', err);
        return throwError(() => err);
      })
    );
  }

  login(identifier: string, password: string): Observable<AuthResponse> {
    console.log('AuthService: Intentando iniciar sesión para:', identifier);
    return this.http.post<AuthResponse>(`${this.apiUrl}/usuarios/login`, { identifier, password }).pipe(
      tap((response: AuthResponse) => { 
        console.log('AuthService: Respuesta de login exitosa (antes de procesar body):', response);

        const responseBody = response.body;

        const token = responseBody?.token;
        const user: User = {
          id_usuario: responseBody?.id_usuario,
          username: responseBody?.username,
          email: responseBody?.email
        };

        if (token && user.id_usuario) {
          if (this.isBrowser) {
            console.log('AuthService: Guardando en localStorage (navegador):', { user, token });
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('jwtToken', token);
          } else {
            console.log('AuthService: No es navegador, no se guarda en localStorage. Actualizando subject de todas formas.');
          }
          this.currentUserSubject.next(user);
          console.log('AuthService: currentUserSubject actualizado con el usuario logueado.');
        } else {
          console.warn('AuthService: Respuesta de login incompleta (falta token o datos de usuario en body). No se guardará en localStorage.');
          if (this.isBrowser) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('jwtToken');
          }
          this.currentUserSubject.next(null);
        }
      }),
      catchError((err: any) => { 
        console.error('AuthService: Error en el login:', err);
        if (this.isBrowser) {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('jwtToken');
        }
        this.currentUserSubject.next(null);
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    console.log('AuthService: Ejecutando logout.');
    if (this.isBrowser) {
      console.log('AuthService: Limpiando localStorage.');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('jwtToken');
    }
    this.currentUserSubject.next(null);
    console.log('AuthService: currentUserSubject establecido a null.');
  }

  getToken(): string | null {
    if (this.isBrowser) {
      const token = localStorage.getItem('jwtToken');
      console.log('AuthService: getToken() - Token de localStorage:', token);
      return token;
    }
    console.log('AuthService: getToken() - No es navegador, retornando null.');
    return null;
  }

  isAuthenticated(): boolean {
    const authenticated = !!this.currentUserSubject.value;
    console.log('AuthService: isAuthenticated() - Resultado:', authenticated);
    return authenticated;
  }
}