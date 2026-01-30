import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // For Android Emulator use 10.0.2.2 (this routes to your computer's localhost)
  // For real device, replace with your computer's IP address (e.g., 192.168.1.100)
  static const String baseUrl = 'http://192.168.1.111:3000/api';

  static Future<Map<String, dynamic>> register(
      String username, String email, String password, String phone, String address) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
          'phone': phone,
          'address': address,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'message': 'Connection error. Make sure backend is running.'};
    }
  }

  // Login User
  static Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'message': 'Connection error. Make sure backend is running.'};
    }
  }

  // Get All Restaurants
  static Future<List<dynamic>> getRestaurants() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/restaurants'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Get Restaurant Menu
  static Future<List<dynamic>> getMenu(String restaurantId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/restaurants/$restaurantId/menu'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  // Place Order
  static Future<Map<String, dynamic>> placeOrder(
      String userId, String restaurantId, List items, double total, String address, String phone) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/orders'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'restaurantId': restaurantId,
          'items': items,
          'totalAmount': total,
          'deliveryAddress': address,
          'phone': phone,
        }),
      );
      return jsonDecode(response.body);
    } catch (e) {
      return {'message': 'Connection error'};
    }
  }

  // Get User Orders
  static Future<List<dynamic>> getUserOrders(String userId) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/orders/user/$userId'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}