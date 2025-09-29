class DailyReport {
  final String id;
  final String projectId;
  final DateTime date;
  final int workersPresent;
  final int workersAbsent;
  final double progressToday;
  final String workCompleted;
  final String materialsUsed;
  final List<String> issuesEncountered;
  final String weatherConditions;
  final String? photos;
  final String? notes;
  final DateTime createdAt;

  DailyReport({
    required this.id,
    required this.projectId,
    required this.date,
    required this.workersPresent,
    required this.workersAbsent,
    required this.progressToday,
    required this.workCompleted,
    required this.materialsUsed,
    required this.issuesEncountered,
    required this.weatherConditions,
    this.photos,
    this.notes,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'project_id': projectId,
      'date': date.toIso8601String(),
      'workers_present': workersPresent,
      'workers_absent': workersAbsent,
      'progress_today': progressToday,
      'work_completed': workCompleted,
      'materials_used': materialsUsed,
      'issues_encountered': issuesEncountered.join(','),
      'weather_conditions': weatherConditions,
      'photos': photos,
      'notes': notes,
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory DailyReport.fromMap(Map<String, dynamic> map) {
    return DailyReport(
      id: map['id'],
      projectId: map['project_id'],
      date: DateTime.parse(map['date']),
      workersPresent: map['workers_present'],
      workersAbsent: map['workers_absent'],
      progressToday: map['progress_today']?.toDouble() ?? 0.0,
      workCompleted: map['work_completed'],
      materialsUsed: map['materials_used'],
      issuesEncountered: map['issues_encountered']?.split(',') ?? [],
      weatherConditions: map['weather_conditions'],
      photos: map['photos'],
      notes: map['notes'],
      createdAt: DateTime.parse(map['created_at']),
    );
  }

  int get totalWorkers => workersPresent + workersAbsent;
  
  double get attendancePercentage => 
      totalWorkers > 0 ? (workersPresent / totalWorkers) * 100 : 0;

  bool get hasIssues => issuesEncountered.isNotEmpty;
}