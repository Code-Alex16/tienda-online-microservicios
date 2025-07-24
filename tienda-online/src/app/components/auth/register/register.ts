import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router, RouterLink } from '@angular/router'; 
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule,  
    RouterLink    
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  username!: string;
  email!: string;
  password!: string;
  confirmPassword!: string;
  message: string = '';
  isError: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    if (this.password !== this.confirmPassword) {
      this.message = 'Las contraseñas no coinciden.';
      this.isError = true;
      return;
    }

    if (!this.username || !this.email || !this.password) {
      this.message = 'Por favor, complete todos los campos.';
      this.isError = true;
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        this.message = response.message || 'Registro exitoso. ¡Ahora puedes iniciar sesión!';
        this.isError = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.message = err.error?.message || 'Error al registrar usuario.';
        this.isError = true;
        console.error('Error de registro:', err);
      }
    });
  }
}