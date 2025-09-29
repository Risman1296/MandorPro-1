import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/project.dart';
import '../models/worker.dart';

class ProjectManagementScreen extends StatefulWidget {
  const ProjectManagementScreen({Key? key}) : super(key: key);

  @override
  State<ProjectManagementScreen> createState() => _ProjectManagementScreenState();
}

class _ProjectManagementScreenState extends State<ProjectManagementScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();
  
  // Project form controllers
  final TextEditingController _projectNameController = TextEditingController();
  final TextEditingController _projectDescriptionController = TextEditingController();
  final TextEditingController _projectBudgetController = TextEditingController();
  final TextEditingController _projectLocationController = TextEditingController();
  
  // Task form controllers
  final TextEditingController _taskNameController = TextEditingController();
  final TextEditingController _taskDescriptionController = TextEditingController();

  String _searchQuery = '';
  List<Project> _projects = [];
  List<Task> _tasks = [];
  List<Worker> _workers = [];
  Project? _editingProject;
  Task? _editingTask;
  String? _selectedProjectId;
  TaskStatus _selectedTaskStatus = TaskStatus.pending;
  List<String> _selectedWorkerIds = [];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  void _loadData() {
    setState(() {
      _workers = [
        Worker(
          id: '1',
          name: 'Agus Wijaya',
          phone: '081234567890',
          nik: '3201010101010001',
          address: 'Jl. Merdeka No. 123',
          dailyWage: 150000,
          status: WorkerStatus.active,
          createdAt: DateTime.now(),
        ),
        Worker(
          id: '2',
          name: 'Budi Santoso',
          phone: '081234567891',
          nik: '3201010101010002',
          address: 'Jl. Sudirman No. 456',
          dailyWage: 175000,
          status: WorkerStatus.active,
          createdAt: DateTime.now(),
        ),
      ];

      _projects = [
        Project(
          id: '1',
          name: 'Pembangunan Rumah Pak Budi',
          description: 'Renovasi rumah 2 lantai dengan penambahan kamar mandi',
          location: 'Jl. Kebon Jeruk No. 45, Jakarta Barat',
          budget: 150000000,
          status: ProjectStatus.active,
          startDate: DateTime.now().subtract(const Duration(days: 10)),
          endDate: DateTime.now().add(const Duration(days: 50)),
          progress: 35.0,
          createdAt: DateTime.now(),
        ),
        Project(
          id: '2',
          name: 'Renovasi Kantor PT ABC',
          description: 'Renovasi interior kantor lantai 3-4',
          location: 'Gedung ABC, Jl. Sudirman, Jakarta',
          budget: 300000000,
          status: ProjectStatus.active,
          startDate: DateTime.now().subtract(const Duration(days: 5)),
          endDate: DateTime.now().add(const Duration(days: 90)),
          progress: 15.0,
          createdAt: DateTime.now(),
        ),
      ];

      _tasks = [
        Task(
          id: '1',
          projectId: '1',
          name: 'Pembongkaran dinding lama',
          description: 'Membongkar dinding kamar mandi lama',
          assignedWorkerIds: ['1', '2'],
          status: TaskStatus.completed,
          createdAt: DateTime.now().subtract(const Duration(days: 8)),
        ),
        Task(
          id: '2',
          projectId: '1',
          name: 'Pemasangan keramik',
          description: 'Memasang keramik lantai dan dinding kamar mandi',
          assignedWorkerIds: ['1'],
          status: TaskStatus.inProgress,
          createdAt: DateTime.now().subtract(const Duration(days: 3)),
        ),
        Task(
          id: '3',
          projectId: '2',
          name: 'Persiapan area kerja',
          description: 'Membersihkan dan mempersiapkan area renovasi',
          assignedWorkerIds: ['2'],
          status: TaskStatus.pending,
          createdAt: DateTime.now().subtract(const Duration(days: 1)),
        ),
      ];
    });
  }

  List<Project> get _filteredProjects {
    return _projects.where((project) {
      return _searchQuery.isEmpty ||
          project.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          project.location.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  List<Task> get _filteredTasks {
    final projectTasks = _selectedProjectId == null
        ? _tasks
        : _tasks.where((task) => task.projectId == _selectedProjectId).toList();

    return projectTasks.where((task) {
      return _searchQuery.isEmpty ||
          task.name.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  void _showProjectForm({Project? project}) {
    setState(() {
      _editingProject = project;
      _projectNameController.text = project?.name ?? '';
      _projectDescriptionController.text = project?.description ?? '';
      _projectBudgetController.text = project?.budget.toString() ?? '';
      _projectLocationController.text = project?.location ?? '';
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildProjectForm(),
    );
  }

  Widget _buildProjectForm() {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _editingProject == null ? 'Tambah Proyek' : 'Edit Proyek',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
          ),
          const Divider(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _projectNameController,
                    decoration: const InputDecoration(
                      labelText: 'Nama Proyek *',
                      prefixIcon: Icon(Icons.work_outline),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _projectDescriptionController,
                    decoration: const InputDecoration(
                      labelText: 'Deskripsi',
                      prefixIcon: Icon(Icons.description_outlined),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _projectLocationController,
                    decoration: const InputDecoration(
                      labelText: 'Lokasi *',
                      prefixIcon: Icon(Icons.location_on_outlined),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _projectBudgetController,
                    decoration: const InputDecoration(
                      labelText: 'Budget (Rp) *',
                      prefixIcon: Icon(Icons.money_outlined),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _saveProject,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        _editingProject == null ? 'Simpan' : 'Update',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _saveProject() {
    if (_projectNameController.text.isEmpty ||
        _projectLocationController.text.isEmpty ||
        _projectBudgetController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Field yang wajib diisi tidak boleh kosong'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final project = Project(
      id: _editingProject?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
      name: _projectNameController.text,
      description: _projectDescriptionController.text,
      location: _projectLocationController.text,
      budget: double.tryParse(_projectBudgetController.text) ?? 0,
      status: _editingProject?.status ?? ProjectStatus.planning,
      startDate: _editingProject?.startDate ?? DateTime.now(),
      endDate: _editingProject?.endDate ?? DateTime.now().add(const Duration(days: 30)),
      progress: _editingProject?.progress ?? 0,
      createdAt: _editingProject?.createdAt ?? DateTime.now(),
    );

    setState(() {
      if (_editingProject == null) {
        _projects.add(project);
      } else {
        final index = _projects.indexWhere((p) => p.id == project.id);
        if (index != -1) {
          _projects[index] = project;
        }
      }
    });

    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _editingProject == null
              ? 'Proyek berhasil ditambahkan'
              : 'Proyek berhasil diupdate',
        ),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _showTaskForm({Task? task}) {
    setState(() {
      _editingTask = task;
      _taskNameController.text = task?.name ?? '';
      _taskDescriptionController.text = task?.description ?? '';
      _selectedTaskStatus = task?.status ?? TaskStatus.pending;
      _selectedWorkerIds = List.from(task?.assignedWorkerIds ?? []);
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildTaskForm(),
    );
  }

  Widget _buildTaskForm() {
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _editingTask == null ? 'Tambah Tugas' : 'Edit Tugas',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
          ),
          const Divider(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_projects.isNotEmpty && _editingTask == null)
                    DropdownButtonFormField<String>(
                      value: _selectedProjectId,
                      decoration: const InputDecoration(
                        labelText: 'Pilih Proyek *',
                        prefixIcon: Icon(Icons.work_outline),
                      ),
                      items: _projects.map((project) {
                        return DropdownMenuItem(
                          value: project.id,
                          child: Text(project.name),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedProjectId = value;
                        });
                      },
                    ),
                  if (_projects.isNotEmpty && _editingTask == null)
                    const SizedBox(height: 16),
                  TextField(
                    controller: _taskNameController,
                    decoration: const InputDecoration(
                      labelText: 'Nama Tugas *',
                      prefixIcon: Icon(Icons.task_outlined),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _taskDescriptionController,
                    decoration: const InputDecoration(
                      labelText: 'Deskripsi',
                      prefixIcon: Icon(Icons.description_outlined),
                    ),
                    maxLines: 3,
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<TaskStatus>(
                    value: _selectedTaskStatus,
                    decoration: const InputDecoration(
                      labelText: 'Status',
                      prefixIcon: Icon(Icons.flag_outlined),
                    ),
                    items: TaskStatus.values.map((status) {
                      return DropdownMenuItem(
                        value: status,
                        child: Text(status.displayName),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _selectedTaskStatus = value;
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Pekerja yang Ditugaskan',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  ..._workers.map((worker) => CheckboxListTile(
                        title: Text(worker.name),
                        subtitle: Text(worker.phone),
                        value: _selectedWorkerIds.contains(worker.id),
                        onChanged: (bool? value) {
                          setState(() {
                            if (value == true) {
                              _selectedWorkerIds.add(worker.id);
                            } else {
                              _selectedWorkerIds.remove(worker.id);
                            }
                          });
                        },
                      )),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _saveTask,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        _editingTask == null ? 'Simpan' : 'Update',
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _saveTask() {
    if (_taskNameController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Nama tugas tidak boleh kosong'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    if (_editingTask == null && _selectedProjectId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pilih proyek terlebih dahulu'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final task = Task(
      id: _editingTask?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
      projectId: _editingTask?.projectId ?? _selectedProjectId!,
      name: _taskNameController.text,
      description: _taskDescriptionController.text,
      assignedWorkerIds: _selectedWorkerIds,
      status: _selectedTaskStatus,
      createdAt: _editingTask?.createdAt ?? DateTime.now(),
    );

    setState(() {
      if (_editingTask == null) {
        _tasks.add(task);
      } else {
        final index = _tasks.indexWhere((t) => t.id == task.id);
        if (index != -1) {
          _tasks[index] = task;
        }
      }
    });

    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _editingTask == null
              ? 'Tugas berhasil ditambahkan'
              : 'Tugas berhasil diupdate',
        ),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kelola Proyek'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Theme.of(context).colorScheme.onPrimary,
          labelColor: Theme.of(context).colorScheme.onPrimary,
          unselectedLabelColor: Theme.of(context).colorScheme.onPrimary.withOpacity(0.7),
          tabs: const [
            Tab(text: 'Proyek'),
            Tab(text: 'Tugas'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildProjectsTab(),
          _buildTasksTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (_tabController.index == 0) {
            _showProjectForm();
          } else {
            _showTaskForm();
          }
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildProjectsTab() {
    final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ');

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: TextField(
            controller: _searchController,
            decoration: const InputDecoration(
              hintText: 'Cari proyek...',
              prefixIcon: Icon(Icons.search),
            ),
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
          ),
        ),
        Expanded(
          child: _filteredProjects.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.work_outline, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('Belum ada proyek', style: TextStyle(fontSize: 18, color: Colors.grey)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _filteredProjects.length,
                  itemBuilder: (context, index) {
                    final project = _filteredProjects[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    project.name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                PopupMenuButton(
                                  itemBuilder: (context) => [
                                    const PopupMenuItem(
                                      value: 'edit',
                                      child: Row(
                                        children: [
                                          Icon(Icons.edit, size: 16),
                                          SizedBox(width: 8),
                                          Text('Edit'),
                                        ],
                                      ),
                                    ),
                                  ],
                                  onSelected: (value) {
                                    if (value == 'edit') {
                                      _showProjectForm(project: project);
                                    }
                                  },
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(project.location, style: TextStyle(color: Colors.grey[600])),
                            const SizedBox(height: 8),
                            Text(
                              currencyFormat.format(project.budget),
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.green,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: project.status.color.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    project.status.displayName,
                                    style: TextStyle(
                                      color: project.status.color,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                                const Spacer(),
                                Text(
                                  '${project.progress.toStringAsFixed(1)}%',
                                  style: const TextStyle(fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            LinearProgressIndicator(
                              value: project.progress / 100,
                              backgroundColor: Colors.grey[300],
                              valueColor: AlwaysStoppedAnimation<Color>(
                                project.status.color,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildTasksTab() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              if (_projects.isNotEmpty)
                DropdownButtonFormField<String?>(
                  value: _selectedProjectId,
                  decoration: const InputDecoration(
                    labelText: 'Filter by Proyek',
                    prefixIcon: Icon(Icons.filter_list),
                  ),
                  items: [
                    const DropdownMenuItem(
                      value: null,
                      child: Text('Semua Proyek'),
                    ),
                    ..._projects.map((project) {
                      return DropdownMenuItem(
                        value: project.id,
                        child: Text(project.name),
                      );
                    }),
                  ],
                  onChanged: (value) {
                    setState(() {
                      _selectedProjectId = value;
                    });
                  },
                ),
              const SizedBox(height: 12),
              TextField(
                controller: _searchController,
                decoration: const InputDecoration(
                  hintText: 'Cari tugas...',
                  prefixIcon: Icon(Icons.search),
                ),
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
              ),
            ],
          ),
        ),
        Expanded(
          child: _filteredTasks.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.task_outlined, size: 64, color: Colors.grey),
                      SizedBox(height: 16),
                      Text('Belum ada tugas', style: TextStyle(fontSize: 18, color: Colors.grey)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _filteredTasks.length,
                  itemBuilder: (context, index) {
                    final task = _filteredTasks[index];
                    final project = _projects.firstWhere(
                      (p) => p.id == task.projectId,
                      orElse: () => Project(
                        id: '',
                        name: 'Unknown Project',
                        description: '',
                        location: '',
                        budget: 0,
                        status: ProjectStatus.planning,
                        startDate: DateTime.now(),
                        endDate: DateTime.now(),
                        progress: 0,
                        createdAt: DateTime.now(),
                      ),
                    );

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    task.name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                PopupMenuButton(
                                  itemBuilder: (context) => [
                                    const PopupMenuItem(
                                      value: 'edit',
                                      child: Row(
                                        children: [
                                          Icon(Icons.edit, size: 16),
                                          SizedBox(width: 8),
                                          Text('Edit'),
                                        ],
                                      ),
                                    ),
                                  ],
                                  onSelected: (value) {
                                    if (value == 'edit') {
                                      _showTaskForm(task: task);
                                    }
                                  },
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              project.name,
                              style: TextStyle(
                                color: Colors.grey[600],
                                fontSize: 14,
                              ),
                            ),
                            if (task.description.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Text(task.description),
                            ],
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: task.status.color.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    task.status.displayName,
                                    style: TextStyle(
                                      color: task.status.color,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                                const Spacer(),
                                if (task.assignedWorkerIds.isNotEmpty)
                                  Row(
                                    children: [
                                      const Icon(Icons.people, size: 16, color: Colors.grey),
                                      const SizedBox(width: 4),
                                      Text('${task.assignedWorkerIds.length}'),
                                    ],
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    _projectNameController.dispose();
    _projectDescriptionController.dispose();
    _projectBudgetController.dispose();
    _projectLocationController.dispose();
    _taskNameController.dispose();
    _taskDescriptionController.dispose();
    super.dispose();
  }
}