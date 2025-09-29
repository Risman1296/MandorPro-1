class Material {
  final String id;
  final String name;
  final String unit;
  final double? price;
  final String? supplier;
  final double balance;
  final DateTime? createdAt;

  Material({
    required this.id,
    required this.name,
    required this.unit,
    this.price,
    this.supplier,
    required this.balance,
    this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'unit': unit,
      'price': price,
      'supplier': supplier,
      'balance': balance,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  factory Material.fromMap(Map<String, dynamic> map) {
    return Material(
      id: map['id'],
      name: map['name'],
      unit: map['unit'],
      price: map['price']?.toDouble(),
      supplier: map['supplier'],
      balance: map['balance']?.toDouble() ?? 0.0,
      createdAt: map['created_at'] != null ? DateTime.parse(map['created_at']) : null,
    );
  }

  String get stockStatus {
    if (balance <= 0) return 'habis';
    if (balance <= 10) return 'menipis';
    return 'tersedia';
  }
}

enum TransactionType { stockIn, stockOut, adjustment }

class StockTransaction {
  final String id;
  final String projectId;
  final String materialId;
  final DateTime dateTime;
  final TransactionType type;
  final double qty;
  final String? reference;
  final String? note;

  StockTransaction({
    required this.id,
    required this.projectId,
    required this.materialId,
    required this.dateTime,
    required this.type,
    required this.qty,
    this.reference,
    this.note,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'project_id': projectId,
      'material_id': materialId,
      'date_time': dateTime.toIso8601String(),
      'type': type.name,
      'qty': qty,
      'reference': reference,
      'note': note,
    };
  }

  factory StockTransaction.fromMap(Map<String, dynamic> map) {
    return StockTransaction(
      id: map['id'],
      projectId: map['project_id'],
      materialId: map['material_id'],
      dateTime: DateTime.parse(map['date_time']),
      type: TransactionType.values.firstWhere(
        (e) => e.name == map['type'],
        orElse: () => TransactionType.stockOut,
      ),
      qty: map['qty']?.toDouble() ?? 0.0,
      reference: map['reference'],
      note: map['note'],
    );
  }
}