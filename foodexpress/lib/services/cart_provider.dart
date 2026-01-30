import 'package:flutter/material.dart';

class CartItem {
  final String id;
  final String menuItemId;
  final String name;
  final double price;
  final String image;
  int quantity;

  CartItem({
    required this.id,
    required this.menuItemId,
    required this.name,
    required this.price,
    required this.image,
    this.quantity = 1,
  });

  Map<String, dynamic> toJson() {
    return {
      'menuItemId': menuItemId,
      'name': name,
      'price': price,
      'quantity': quantity,
      'image': image,
    };
  }
}

class CartProvider with ChangeNotifier {
  Map<String, CartItem> _items = {};
  String? _restaurantId;
  String? _restaurantName;

  Map<String, CartItem> get items => {..._items};
  String? get restaurantId => _restaurantId;
  String? get restaurantName => _restaurantName;

  int get itemCount => _items.length;

  double get totalAmount {
    double total = 0.0;
    _items.forEach((key, item) {
      total += item.price * item.quantity;
    });
    return total;
  }

  void addItem(String menuItemId, String name, double price, String image, String restId, String restName) {
    if (_restaurantId != null && _restaurantId != restId) {
      // Different restaurant - clear cart
      _items.clear();
    }

    _restaurantId = restId;
    _restaurantName = restName;

    if (_items.containsKey(menuItemId)) {
      _items.update(
        menuItemId,
            (existing) => CartItem(
          id: existing.id,
          menuItemId: existing.menuItemId,
          name: existing.name,
          price: existing.price,
          image: existing.image,
          quantity: existing.quantity + 1,
        ),
      );
    } else {
      _items.putIfAbsent(
        menuItemId,
            () => CartItem(
          id: DateTime.now().toString(),
          menuItemId: menuItemId,
          name: name,
          price: price,
          image: image,
          quantity: 1,
        ),
      );
    }
    notifyListeners();
  }

  void removeItem(String menuItemId) {
    _items.remove(menuItemId);
    if (_items.isEmpty) {
      _restaurantId = null;
      _restaurantName = null;
    }
    notifyListeners();
  }

  void decreaseQuantity(String menuItemId) {
    if (!_items.containsKey(menuItemId)) return;

    if (_items[menuItemId]!.quantity > 1) {
      _items.update(
        menuItemId,
            (existing) => CartItem(
          id: existing.id,
          menuItemId: existing.menuItemId,
          name: existing.name,
          price: existing.price,
          image: existing.image,
          quantity: existing.quantity - 1,
        ),
      );
    } else {
      _items.remove(menuItemId);
    }

    if (_items.isEmpty) {
      _restaurantId = null;
      _restaurantName = null;
    }
    notifyListeners();
  }

  void clear() {
    _items = {};
    _restaurantId = null;
    _restaurantName = null;
    notifyListeners();
  }

  List<Map<String, dynamic>> getCartItemsForOrder() {
    return _items.values.map((item) => item.toJson()).toList();
  }
}