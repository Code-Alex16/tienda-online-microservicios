import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../../services/auth'; 

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule,  
    RouterLink    
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  identifier!: string;
  password!: string;
  message: string = '';
  isError: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    if (!this.identifier || !this.password) {
      this.message = 'Por favor, ingrese su usuario/email y contraseña.';
      this.isError = true;
      return;
    }

    this.authService.login(this.identifier, this.password).subscribe({
      next: (response) => {
        this.message = response.message || 'Inicio de sesión exitoso.';
        this.isError = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        this.isError = true;
        console.error('Error de login:', err);
      }
    });
  }
}