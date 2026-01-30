class User {
  final String id;
  final String username;
  final String email;
  final String? phone;
  final String? address;

  User({
    required this.id,
    required this.username,
    required this.email,
    this.phone,
    this.address,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['userId'] ?? json['_id'],
      username: json['username'],
      email: json['email'],
      phone: json['phone'],
      address: json['address'],
    );
  }
}