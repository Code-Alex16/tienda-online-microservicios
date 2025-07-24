export interface CartItem {
  id_item_carrito: number;
  id_producto: number;
  nombre_producto: string;
  imagen_url: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}