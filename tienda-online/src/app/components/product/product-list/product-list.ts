import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product';
import { CartService } from '../../../services/cart';
import { AuthService } from '../../../services/auth'; 
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule  
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isAuthenticated: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.authService.currentUser.subscribe(user => {
      this.isAuthenticated = !!user; 
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        if (data && data.body) {
          this.products = data.body.map((p: any) => ({
            ...p,
            precio: typeof p.precio === 'string' ? parseFloat(p.precio) : p.precio,
            stock: typeof p.stock === 'string' ? parseInt(p.stock, 10) : p.stock
          }));
        } else {
          this.products = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        alert('Error al cargar productos. Por favor, intente de nuevo más tarde.');
      }
    });
  }

  addToCart(id_producto: number, quantity: string): void {
    const cantidad = parseInt(quantity, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor, ingrese una cantidad válida y mayor a 0.');
      return;
    }

    const product = this.products.find(p => p.id_producto === id_producto);
    if (product && cantidad > product.stock) {
        alert(`No hay suficiente stock para ${product.nombre}. Solo quedan ${product.stock} unidades.`);
        return;
    }

    this.cartService.addProductToCart(id_producto, cantidad).subscribe({
      next: (response: any) => {
        alert(response.message || 'Producto añadido al carrito.');
        if (product) {
            product.stock -= cantidad;
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error al añadir producto al carrito.';
        alert(errorMessage);
        console.error('Error al añadir al carrito:', err);
      }
    });
  }
}