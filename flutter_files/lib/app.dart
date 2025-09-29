import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'screens/dashboard_screen.dart';
import 'screens/worker_management_screen.dart';
import 'screens/project_management_screen.dart';
import 'theme/app_theme.dart';

class MandorProApp extends StatelessWidget {
  const MandorProApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MandorPro',
      debugShowCheckedModeBanner: false,
      
      // Indonesian localization
      locale: const Locale('id', 'ID'),
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('id', 'ID'), // Indonesian
        Locale('en', 'US'), // English (fallback)
      ],
      
      theme: AppTheme.lightTheme,
      home: const DashboardScreen(),
      routes: {
        '/dashboard': (context) => const DashboardScreen(),
        '/workers': (context) => const WorkerManagementScreen(),
        '/projects': (context) => const ProjectManagementScreen(),
        // TODO: Add more routes as screens are implemented
        // '/materials': (context) => const MaterialManagementScreen(),
        // '/payroll': (context) => const PayrollManagementScreen(),
        // '/reports': (context) => const ReportScreen(),
        // '/settings': (context) => const SettingsScreen(),
      },
      onGenerateRoute: (settings) {
        // Handle unknown routes
        return MaterialPageRoute(
          builder: (context) => Scaffold(
            appBar: AppBar(
              title: const Text('Coming Soon'),
            ),
            body: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.construction,
                    size: 64,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Fitur ini sedang dalam pengembangan',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.grey,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Coming Soon!',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}