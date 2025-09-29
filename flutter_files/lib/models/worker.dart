class Worker {
  final String id;
  final String name;
  final String skill;
  final double dailyWage;
  final String phone;
  final String? nik;
  final String? address;
  final bool active;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Worker({
    required this.id,
    required this.name,
    required this.skill,
    required this.dailyWage,
    required this.phone,
    this.nik,
    this.address,
    this.active = true,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'skill': skill,
      'daily_wage': dailyWage,
      'phone': phone,
      'nik': nik,
      'address': address,
      'active': active ? 1 : 0,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  factory Worker.fromMap(Map<String, dynamic> map) {
    return Worker(
      id: map['id'],
      name: map['name'],
      skill: map['skill'],
      dailyWage: map['daily_wage']?.toDouble() ?? 0.0,
      phone: map['phone'] ?? '',
      nik: map['nik'],
      address: map['address'],
      active: map['active'] == 1,
      createdAt: DateTime.parse(map['created_at']),
      updatedAt: map['updated_at'] != null ? DateTime.parse(map['updated_at']) : null,
    );
  }

  Worker copyWith({
    String? name,
    String? skill,
    double? dailyWage,
    String? phone,
    String? nik,
    String? address,
    bool? active,
    DateTime? updatedAt,
  }) {
    return Worker(
      id: id,
      name: name ?? this.name,
      skill: skill ?? this.skill,
      dailyWage: dailyWage ?? this.dailyWage,
      phone: phone ?? this.phone,
      nik: nik ?? this.nik,
      address: address ?? this.address,
      active: active ?? this.active,
      createdAt: createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}