enum ProjectStatus { planning, active, completed, paused }

class Project {
  final String id;
  final String name;
  final String code;
  final String? description;
  final DateTime startDate;
  final DateTime endDate;
  final ProjectStatus status;
  final double? budget;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Project({
    required this.id,
    required this.name,
    required this.code,
    this.description,
    required this.startDate,
    required this.endDate,
    this.status = ProjectStatus.planning,
    this.budget,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'description': description,
      'start_date': startDate.toIso8601String(),
      'end_date': endDate.toIso8601String(),
      'status': status.name,
      'budget': budget,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  factory Project.fromMap(Map<String, dynamic> map) {
    return Project(
      id: map['id'],
      name: map['name'],
      code: map['code'],
      description: map['description'],
      startDate: DateTime.parse(map['start_date']),
      endDate: DateTime.parse(map['end_date']),
      status: ProjectStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => ProjectStatus.planning,
      ),
      budget: map['budget']?.toDouble(),
      createdAt: DateTime.parse(map['created_at']),
      updatedAt: map['updated_at'] != null ? DateTime.parse(map['updated_at']) : null,
    );
  }
}

enum TaskStatus { pending, inProgress, completed }
enum TaskPriority { low, medium, high }

class Task {
  final String id;
  final String projectId;
  final String title;
  final String? description;
  final String? assignedTo;
  final TaskStatus status;
  final TaskPriority priority;
  final DateTime? startDate;
  final DateTime? dueDate;
  final DateTime createdAt;
  final DateTime? updatedAt;

  Task({
    required this.id,
    required this.projectId,
    required this.title,
    this.description,
    this.assignedTo,
    this.status = TaskStatus.pending,
    this.priority = TaskPriority.medium,
    this.startDate,
    this.dueDate,
    required this.createdAt,
    this.updatedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'project_id': projectId,
      'title': title,
      'description': description,
      'assigned_to': assignedTo,
      'status': status.name,
      'priority': priority.name,
      'start_date': startDate?.toIso8601String(),
      'due_date': dueDate?.toIso8601String(),
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  factory Task.fromMap(Map<String, dynamic> map) {
    return Task(
      id: map['id'],
      projectId: map['project_id'],
      title: map['title'],
      description: map['description'],
      assignedTo: map['assigned_to'],
      status: TaskStatus.values.firstWhere(
        (e) => e.name == map['status'],
        orElse: () => TaskStatus.pending,
      ),
      priority: TaskPriority.values.firstWhere(
        (e) => e.name == map['priority'],
        orElse: () => TaskPriority.medium,
      ),
      startDate: map['start_date'] != null ? DateTime.parse(map['start_date']) : null,
      dueDate: map['due_date'] != null ? DateTime.parse(map['due_date']) : null,
      createdAt: DateTime.parse(map['created_at']),
      updatedAt: map['updated_at'] != null ? DateTime.parse(map['updated_at']) : null,
    );
  }
}