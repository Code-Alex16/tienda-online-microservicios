import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { CartService } from '../../services/cart';
import { CartItem } from '../../models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true, 
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data: any) => {
        if (data && data.body) {
          this.cartItems = data.body.map((item: any) => ({
            ...item,
            precio_unitario: typeof item.precio_unitario === 'string' ? parseFloat(item.precio_unitario) : item.precio_unitario,
            subtotal: typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal
          }));
        } else {
          this.cartItems = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar el carrito:', err);
        alert(err.error?.message || 'Error al cargar el carrito.');
      }
    });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  }

  updateQuantity(id_producto: number, newCantidad: number): void {
    if (newCantidad < 1) {
      alert('La cantidad no puede ser menor a 1.');
      this.loadCart();
      return;
    }

    this.cartService.updateCartItemQuantity(id_producto, newCantidad).subscribe({
      next: (response: any) => {
        alert(response.message || 'Cantidad actualizada.');
        this.loadCart();
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error al actualizar la cantidad.';
        alert(errorMessage);
        console.error('Error al actualizar cantidad:', err);
        this.loadCart(); 
      }
    });
  }

  onQuantityChange(id_producto: number, newQuantity: any): void { 
    const parsedQuantity = parseInt(newQuantity, 10);
    if (!isNaN(parsedQuantity)) {
      this.updateQuantity(id_producto, parsedQuantity);
    } else {
      alert('Cantidad inválida.');
      this.loadCart(); 
    }
  }

  removeItem(id_producto: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
      this.cartService.removeCartItem(id_producto).subscribe({
        next: (response: any) => {
          alert(response.message || 'Producto eliminado del carrito.');
          this.loadCart();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error al eliminar producto del carrito.';
          alert(errorMessage);
          console.error('Error al eliminar producto:', err);
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar completamente tu carrito?')) {
      this.cartService.clearCart().subscribe({
        next: (response: any) => {
          alert(response.message || 'Carrito vaciado exitosamente.');
          this.loadCart();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error al vaciar el carrito.';
          alert(errorMessage);
          console.error('Error al vaciar carrito:', err);
        }
      });
    }
  }

  checkout(): void {
    if (confirm('¿Estás seguro de que quieres finalizar la compra?')) {
      this.cartService.checkoutCart().subscribe({
        next: (response: any) => {
          alert(response.message || 'Compra finalizada exitosamente.');
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error al finalizar la compra.';
          alert(errorMessage);
          console.error('Error al finalizar compra:', err);
        }
      });
    }
  }
}