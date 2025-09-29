enum PayrollStatus { pending, paid }

class PayrollRecord {
  final String id;
  final String workerId;
  final String projectId;
  final DateTime periodStart;
  final DateTime periodEnd;
  final int daysWorked;
  final double overtimeHours;
  final double baseAmount;
  final double overtimeAmount;
  final double bonus;
  final double deductions;
  final double totalAmount;
  final PayrollStatus status;
  final DateTime createdAt;

  PayrollRecord({
    required this.id,
    required this.workerId,
    required this.projectId,
    required this.periodStart,
    required this.periodEnd,
    required this.daysWorked,
    this.overtimeHours = 0,
    required this.baseAmount,
    this.overtimeAmount = 0,
    this.bonus = 0,
    this.deductions = 0,
    required this.totalAmount,
    this.status = PayrollStatus.pending,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'worker_id': workerId,
      'project_id': projectId,
      'period_start': periodStart.toIso8601String(),
      'period_end': periodEnd.toIso8601String(),
      'days_worked': daysWorked,
      'overtime_hours': overtimeHours,
      'base_amount': baseAmount,
      'overtime_amount': overtimeAmount,
      'bonus': bonus,
      'deductions': deductions,
      'total_amount': totalAmount,
      'status': status.name,
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory PayrollRecord.fromMap(Map<String, dynamic> map) {
    return PayrollRecord(
      id: map['id'],
      workerId: map['worker_id'],
      projectId: map['project_id'],
      periodStart: DateTime.parse(map['period_start']),
      periodEnd: DateTime.parse(map['period_end']),
      daysWorked: map['days_worked'],
      overtimeHours: map['overtime_hours']?.toDouble() ?? 0.0,
      baseAmount: map['base_amount']?.toDouble() ?? 0.0,
      overtimeAmount: map['overtime_amount']?.toDouble() ?? 0.0,
      bonus: map['bonus']?.toDouble() ?? 0.0,
      deductions: map['deductions']?.toDouble() ?? 0.0,
      totalAmount: map['total_amount']?.toDouble() ?? 0.0,
      status: PayrollStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => PayrollStatus.pending,
      ),
      createdAt: DateTime.parse(map['created_at']),
    );
  }
}

enum CostCategory { materials, tools, transport, other }

class ProjectCost {
  final String id;
  final String projectId;
  final CostCategory category;
  final String description;
  final double amount;
  final DateTime date;
  final String? receiptUrl;
  final String? notes;
  final DateTime createdAt;

  ProjectCost({
    required this.id,
    required this.projectId,
    required this.category,
    required this.description,
    required this.amount,
    required this.date,
    this.receiptUrl,
    this.notes,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'project_id': projectId,
      'category': category.name,
      'description': description,
      'amount': amount,
      'date': date.toIso8601String(),
      'receipt_url': receiptUrl,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory ProjectCost.fromMap(Map<String, dynamic> map) {
    return ProjectCost(
      id: map['id'],
      projectId: map['project_id'],
      category: CostCategory.values.firstWhere(
        (e) => e.name == map['category'],
        orElse: () => CostCategory.other,
      ),
      description: map['description'],
      amount: map['amount']?.toDouble() ?? 0.0,
      date: DateTime.parse(map['date']),
      receiptUrl: map['receipt_url'],
      notes: map['notes'],
      createdAt: DateTime.parse(map['created_at']),
    );
  }

  String get categoryDisplayName {
    switch (category) {
      case CostCategory.materials:
        return 'Material';
      case CostCategory.tools:
        return 'Alat';
      case CostCategory.transport:
        return 'Transport';
      case CostCategory.other:
        return 'Lainnya';
    }
  }
}