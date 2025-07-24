import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard'; 

import { ProductListComponent } from './components/product/product-list/product-list';
import { CartComponent } from './components/cart/cart';
import { OrderHistoryComponent } from './components/order/order-history/order-history';
import { OrderDetailComponent } from './components/order/order-detail/order-detail';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrderHistoryComponent, canActivate: [AuthGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/products' }
];