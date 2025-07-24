import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth'; 

// Ajuste de las rutas de importación según tu estructura
import { ProductListComponent } from './components/product/product-list/product-list';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { CartComponent } from './components/cart/cart';
import { OrderHistoryComponent } from './components/order/order-history/order-history';
import { OrderDetailComponent } from './components/order/order-detail/order-detail';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ProductListComponent,
    LoginComponent,
    RegisterComponent,
    CartComponent,
    OrderHistoryComponent,
    OrderDetailComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'Mi Tienda Online'; 

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login después de cerrar 
  }
}