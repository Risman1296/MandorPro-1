import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/worker.dart';

class WorkerManagementScreen extends StatefulWidget {
  const WorkerManagementScreen({Key? key}) : super(key: key);

  @override
  State<WorkerManagementScreen> createState() => _WorkerManagementScreenState();
}

class _WorkerManagementScreenState extends State<WorkerManagementScreen> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _nikController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _dailyWageController = TextEditingController();

  String _searchQuery = '';
  WorkerStatus _selectedStatus = WorkerStatus.active;
  List<Worker> _workers = [];
  Worker? _editingWorker;

  @override
  void initState() {
    super.initState();
    _loadWorkers();
  }

  void _loadWorkers() {
    // Mock data - replace with actual database call
    setState(() {
      _workers = [
        Worker(
          id: '1',
          name: 'Agus Wijaya',
          phone: '081234567890',
          nik: '3201010101010001',
          address: 'Jl. Merdeka No. 123, Jakarta',
          dailyWage: 150000,
          status: WorkerStatus.active,
          createdAt: DateTime.now().subtract(const Duration(days: 30)),
        ),
        Worker(
          id: '2',
          name: 'Budi Santoso',
          phone: '081234567891',
          nik: '3201010101010002',
          address: 'Jl. Sudirman No. 456, Jakarta',
          dailyWage: 175000,
          status: WorkerStatus.active,
          createdAt: DateTime.now().subtract(const Duration(days: 15)),
        ),
        Worker(
          id: '3',
          name: 'Cahyo Pratama',
          phone: '081234567892',
          nik: '3201010101010003',
          address: 'Jl. Thamrin No. 789, Jakarta',
          dailyWage: 200000,
          status: WorkerStatus.inactive,
          createdAt: DateTime.now().subtract(const Duration(days: 60)),
        ),
      ];
    });
  }

  List<Worker> get _filteredWorkers {
    return _workers.where((worker) {
      final matchesSearch = _searchQuery.isEmpty ||
          worker.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          worker.phone.contains(_searchQuery) ||
          worker.nik.contains(_searchQuery);
      return matchesSearch;
    }).toList();
  }

  void _showWorkerForm({Worker? worker}) {
    setState(() {
      _editingWorker = worker;
      _nameController.text = worker?.name ?? '';
      _phoneController.text = worker?.phone ?? '';
      _nikController.text = worker?.nik ?? '';
      _addressController.text = worker?.address ?? '';
      _dailyWageController.text = worker?.dailyWage.toString() ?? '';
      _selectedStatus = worker?.status ?? WorkerStatus.active;
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _buildWorkerForm(),
    );
  }

  Widget _buildWorkerForm() {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          // Handle bar
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _editingWorker == null ? 'Tambah Pekerja' : 'Edit Pekerja',
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
          // Form
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Nama Lengkap *',
                      prefixIcon: Icon(Icons.person_outline),
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Nomor Telepon *',
                      prefixIcon: Icon(Icons.phone_outlined),
                    ),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _nikController,
                    decoration: const InputDecoration(
                      labelText: 'NIK *',
                      prefixIcon: Icon(Icons.badge_outlined),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _addressController,
                    decoration: const InputDecoration(
                      labelText: 'Alamat *',
                      prefixIcon: Icon(Icons.location_on_outlined),
                    ),
                    maxLines: 2,
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _dailyWageController,
                    decoration: const InputDecoration(
                      labelText: 'Upah Harian (Rp) *',
                      prefixIcon: Icon(Icons.money_outlined),
                    ),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<WorkerStatus>(
                    value: _selectedStatus,
                    decoration: const InputDecoration(
                      labelText: 'Status',
                      prefixIcon: Icon(Icons.work_outline),
                    ),
                    items: WorkerStatus.values.map((status) {
                      return DropdownMenuItem(
                        value: status,
                        child: Text(status.displayName),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _selectedStatus = value;
                        });
                      }
                    },
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _saveWorker,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        _editingWorker == null ? 'Simpan' : 'Update',
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

  void _saveWorker() {
    if (_nameController.text.isEmpty ||
        _phoneController.text.isEmpty ||
        _nikController.text.isEmpty ||
        _addressController.text.isEmpty ||
        _dailyWageController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Semua field wajib diisi'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final worker = Worker(
      id: _editingWorker?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
      name: _nameController.text,
      phone: _phoneController.text,
      nik: _nikController.text,
      address: _addressController.text,
      dailyWage: double.tryParse(_dailyWageController.text) ?? 0,
      status: _selectedStatus,
      createdAt: _editingWorker?.createdAt ?? DateTime.now(),
    );

    setState(() {
      if (_editingWorker == null) {
        _workers.add(worker);
      } else {
        final index = _workers.indexWhere((w) => w.id == worker.id);
        if (index != -1) {
          _workers[index] = worker;
        }
      }
    });

    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _editingWorker == null
              ? 'Pekerja berhasil ditambahkan'
              : 'Pekerja berhasil diupdate',
        ),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _deleteWorker(Worker worker) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hapus Pekerja'),
        content: Text('Apakah Anda yakin ingin menghapus ${worker.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Batal'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _workers.removeWhere((w) => w.id == worker.id);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Pekerja berhasil dihapus'),
                  backgroundColor: Colors.green,
                ),
              );
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Hapus'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp ');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Kelola Pekerja'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari nama, telepon, atau NIK...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        onPressed: () {
                          _searchController.clear();
                          setState(() {
                            _searchQuery = '';
                          });
                        },
                        icon: const Icon(Icons.clear),
                      )
                    : null,
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),
          // Workers list
          Expanded(
            child: _filteredWorkers.isEmpty
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.people_outline,
                          size: 64,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Belum ada pekerja',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _filteredWorkers.length,
                    itemBuilder: (context, index) {
                      final worker = _filteredWorkers[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: worker.status == WorkerStatus.active
                                ? Colors.green
                                : Colors.grey,
                            child: Text(
                              worker.name.substring(0, 1).toUpperCase(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          title: Text(
                            worker.name,
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(worker.phone),
                              Text(currencyFormat.format(worker.dailyWage)),
                              Container(
                                margin: const EdgeInsets.only(top: 4),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: worker.status == WorkerStatus.active
                                      ? Colors.green.withOpacity(0.1)
                                      : Colors.grey.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  worker.status.displayName,
                                  style: TextStyle(
                                    color: worker.status == WorkerStatus.active
                                        ? Colors.green
                                        : Colors.grey,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          trailing: PopupMenuButton(
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
                              const PopupMenuItem(
                                value: 'delete',
                                child: Row(
                                  children: [
                                    Icon(Icons.delete, size: 16, color: Colors.red),
                                    SizedBox(width: 8),
                                    Text('Hapus', style: TextStyle(color: Colors.red)),
                                  ],
                                ),
                              ),
                            ],
                            onSelected: (value) {
                              if (value == 'edit') {
                                _showWorkerForm(worker: worker);
                              } else if (value == 'delete') {
                                _deleteWorker(worker);
                              }
                            },
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showWorkerForm(),
        child: const Icon(Icons.add),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    _nameController.dispose();
    _phoneController.dispose();
    _nikController.dispose();
    _addressController.dispose();
    _dailyWageController.dispose();
    super.dispose();
  }
}