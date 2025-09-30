import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:go_router/go_router.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({super.key});

  final GoRouter _router = GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const MainPage(initialIndex: 0),
      ),
      GoRoute(
        path: '/todo',
        builder: (context, state) => const MainPage(initialIndex: 1),
      ),
    ],
  );

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Flutter - Tic-Tac-Toe',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}

class MainPage extends StatefulWidget {
  final int initialIndex;
  const MainPage({super.key, this.initialIndex = 0});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  late int currentIndex;

  final pages = [
    const TicTacToePage(),
    const TodoPage(),
  ];

  @override
  void initState() {
    super.initState();
    currentIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flutter - Tic-Tac-Toe'),
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
      ),
      body: pages[currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
          // Update URL without full page reload
          if (index == 0) {
            context.go('/');
          } else {
            context.go('/todo');
          }
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.games),
            label: 'Tic Tac Toe',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.list),
            label: 'Todo List',
          ),
        ],
      ),
    );
  }
}

class TicTacToePage extends StatefulWidget {
  const TicTacToePage({super.key});

  @override
  State<TicTacToePage> createState() => _TicTacToePageState();
}

class _TicTacToePageState extends State<TicTacToePage> {
  List<String?> board = List.filled(9, null);
  String currentPlayer = 'X';
  String status = "Player X's turn";

  void handleTap(int index) {
    if (board[index] != null || checkWinner() != null) return;

    setState(() {
      board[index] = currentPlayer;
      String? winner = checkWinner();
      if (winner != null) {
        status = '$winner wins!';
      } else if (!board.contains(null)) {
        status = "It's a draw!";
      } else {
        currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
        status = "Player $currentPlayer's turn";
      }
    });
  }

  String? checkWinner() {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (var line in lines) {
      if (board[line[0]] != null &&
          board[line[0]] == board[line[1]] &&
          board[line[0]] == board[line[2]]) {
        return board[line[0]];
      }
    }
    return null;
  }

  void resetGame() {
    setState(() {
      board = List.filled(9, null);
      currentPlayer = 'X';
      status = "Player X's turn";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Tic-Tac-Toe',
                style: Theme.of(context).textTheme.headlineLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              Container(
                width: 320,
                height: 320,
                child: GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 10,
                    mainAxisSpacing: 10,
                  ),
                  itemCount: 9,
                  itemBuilder: (context, index) {
                return ElevatedButton(
                  onPressed: () => handleTap(index),
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(100, 100),
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    side: const BorderSide(color: Colors.black),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    board[index] ?? '',
                    style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 20),
          Text(
            status,
            style: Theme.of(context).textTheme.titleLarge,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: resetGame,
            child: const Text('Reset Game'),
          ),
            ],
          ),
        ),
      ),
    );
  }
}

class Task {
  final int id;
  final String task;
  final bool completed;
  final String completionDate;
  final int order;

  Task({
    required this.id,
    required this.task,
    required this.completed,
    required this.completionDate,
    required this.order,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      task: json['task'],
      completed: json['completed'],
      completionDate: json['completionDate'],
      order: json['order'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'task': task,
      'completed': completed,
      'completionDate': completionDate,
    };
  }
}

class TodoPage extends StatefulWidget {
  const TodoPage({super.key});

  @override
  State<TodoPage> createState() => _TodoPageState();
}

class _TodoPageState extends State<TodoPage> {
  List<Task> tasks = [];
  final TextEditingController taskController = TextEditingController();
  final TextEditingController dateController = TextEditingController();
  final String apiUrl = 'http://localhost:3000/tasks';

  @override
  void initState() {
    super.initState();
    fetchTasks();
  }

  Future<void> fetchTasks() async {
    try {
      final response = await http.get(Uri.parse(apiUrl));
      if (response.statusCode == 200) {
        final List<dynamic> jsonData = json.decode(response.body);
        setState(() {
          tasks = jsonData.map((item) => Task.fromJson(item)).toList();
        });
      }
    } catch (e) {
      print('Error fetching tasks: $e');
    }
  }

  Future<void> addTask() async {
    if (taskController.text.trim().isEmpty) return;

    final newTask = {
      'task': taskController.text.trim(),
      'completed': false,
      'completionDate': dateController.text.isNotEmpty 
          ? dateController.text 
          : DateTime.now().add(const Duration(days: 1)).toIso8601String(),
    };

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(newTask),
      );

      if (response.statusCode == 201) {
        taskController.clear();
        dateController.clear();
        fetchTasks();
      }
    } catch (e) {
      print('Error adding task: $e');
    }
  }

  Future<void> toggleComplete(Task task) async {
    try {
      final response = await http.put(
        Uri.parse('$apiUrl/${task.id}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'completed': !task.completed}),
      );

      if (response.statusCode == 200) {
        fetchTasks();
      }
    } catch (e) {
      print('Error updating task: $e');
    }
  }

  Future<void> deleteTask(int id) async {
    try {
      final response = await http.delete(Uri.parse('$apiUrl/$id'));
      if (response.statusCode == 200) {
        fetchTasks();
      }
    } catch (e) {
      print('Error deleting task: $e');
    }
  }

  Future<void> editTask(Task task, String newTask, String newDate) async {
    try {
      final response = await http.put(
        Uri.parse('$apiUrl/${task.id}'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'task': newTask,
          'completionDate': newDate,
        }),
      );

      if (response.statusCode == 200) {
        fetchTasks();
      }
    } catch (e) {
      print('Error updating task: $e');
    }
  }

  Future<void> reorderTasks(List<Task> newOrder) async {
    try {
      final order = newOrder.map((task) => task.id).toList();
      final response = await http.patch(
        Uri.parse('$apiUrl/reorder'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'order': order}),
      );

      if (response.statusCode == 200) {
        fetchTasks();
      }
    } catch (e) {
      print('Error reordering tasks: $e');
    }
  }

  void showEditDialog(Task task) {
    final TextEditingController editTaskController = TextEditingController(text: task.task);
    final TextEditingController editDateController = TextEditingController(
      text: DateTime.parse(task.completionDate).toLocal().toString().substring(0, 16),
    );

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Task'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: editTaskController,
              decoration: const InputDecoration(labelText: 'Task'),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: editDateController,
              decoration: const InputDecoration(labelText: 'Due Date (YYYY-MM-DD HH:MM)'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              editTask(task, editTaskController.text.trim(), editDateController.text);
              Navigator.of(context).pop();
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Todo List',
            style: Theme.of(context).textTheme.headlineLarge,
          ),
          const SizedBox(height: 20),
          // Add Task Form
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  TextField(
                    controller: taskController,
                    decoration: const InputDecoration(
                      labelText: 'Enter new task',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: dateController,
                    decoration: const InputDecoration(
                      labelText: 'Due Date (YYYY-MM-DD HH:MM)',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: addTask,
                      child: const Text('Add Task'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          // Task List
          Expanded(
            child: tasks.isEmpty
                ? const Center(child: Text('No tasks yet'))
                : ReorderableListView.builder(
                    itemCount: tasks.length,
                    onReorder: (oldIndex, newIndex) {
                      if (newIndex > oldIndex) {
                        newIndex--;
                      }
                      setState(() {
                        final task = tasks.removeAt(oldIndex);
                        tasks.insert(newIndex, task);
                      });
                      reorderTasks(tasks);
                    },
                    itemBuilder: (context, index) {
                      final task = tasks[index];
                      return Card(
                        key: ValueKey(task.id),
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          title: Text(
                            task.task,
                            style: TextStyle(
                              decoration: task.completed 
                                  ? TextDecoration.lineThrough 
                                  : TextDecoration.none,
                            ),
                          ),
                          subtitle: Text(
                            'Due: ${DateTime.parse(task.completionDate).toLocal().toString().substring(0, 16)}',
                          ),
                          leading: Checkbox(
                            value: task.completed,
                            onChanged: (_) => toggleComplete(task),
                          ),
                          trailing: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                icon: const Icon(Icons.edit, color: Colors.orange),
                                onPressed: () => showEditDialog(task),
                              ),
                              IconButton(
                                icon: const Icon(Icons.delete, color: Colors.red),
                                onPressed: () => deleteTask(task.id),
                              ),
                              const Icon(Icons.drag_handle),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    taskController.dispose();
    dateController.dispose();
    super.dispose();
  }
}
