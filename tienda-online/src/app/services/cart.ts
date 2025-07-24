import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/carrito`);
  }

  addProductToCart(id_producto: number, cantidad: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/carrito/add`, { id_producto, cantidad });
  }

  updateCartItemQuantity(id_producto: number, cantidad: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/carrito/update/${id_producto}`, { cantidad });
  }

  removeCartItem(id_producto: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/carrito/remove/${id_producto}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/carrito/clear`);
  }

  checkoutCart(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/carrito/checkout`, {});
  }
}