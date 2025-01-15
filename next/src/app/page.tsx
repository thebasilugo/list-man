"use client";

import { useState } from "react";
import {
	Bell,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Flag,
	List,
	Plus,
	Search,
	Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskMan() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [tasks, setTasks] = useState([
		{
			id: 1,
			title: "Complete project proposal",
			priority: "high",
			dueDate: "2023-06-15",
			completed: false,
		},
		{
			id: 2,
			title: "Review team performance",
			priority: "medium",
			dueDate: "2023-06-20",
			completed: false,
		},
		{
			id: 3,
			title: "Prepare for client meeting",
			priority: "high",
			dueDate: "2023-06-18",
			completed: true,
		},
	]);
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		priority: "",
		dueDate: undefined,
	});
	const [filter, setFilter] = useState("all");

	const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

	const addTask = () => {
		if (newTask.title && newTask.priority && newTask.dueDate) {
			setTasks([
				...tasks,
				{ ...newTask, id: tasks.length + 1, completed: false },
			]);
			setNewTask({
				title: "",
				description: "",
				priority: "",
				dueDate: undefined,
			});
		}
	};

	const toggleTaskCompletion = (id) => {
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const filteredTasks = tasks.filter((task) => {
		if (filter === "all") return true;
		if (filter === "completed") return task.completed;
		if (filter === "pending") return !task.completed;
		if (filter === "high") return task.priority === "high" && !task.completed;
		return true;
	});

	return (
		<div className="flex h-screen bg-teal-50 text-teal-900">
			{/* Sidebar */}
			<motion.aside
				className={`bg-teal-800 text-white w-64 min-h-screen p-4 ${
					sidebarOpen ? "" : "hidden"
				} md:block`}
				initial={{ x: -100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<nav>
					<Button
						variant="ghost"
						className="w-full justify-start mb-2 text-teal-100 hover:text-white hover:bg-teal-700"
						onClick={() => setFilter("all")}
					>
						<List className="mr-2 h-4 w-4" /> All Tasks
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start mb-2 text-teal-100 hover:text-white hover:bg-teal-700"
						onClick={() => setFilter("high")}
					>
						<Flag className="mr-2 h-4 w-4" /> Priority Tasks
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start mb-2 text-teal-100 hover:text-white hover:bg-teal-700"
						onClick={() => setFilter("completed")}
					>
						<CheckCircle className="mr-2 h-4 w-4" /> Completed Tasks
					</Button>
					<Button
						variant="ghost"
						className="w-full justify-start text-teal-100 hover:text-white hover:bg-teal-700"
					>
						<Settings className="mr-2 h-4 w-4" /> Settings
					</Button>
				</nav>
			</motion.aside>

			{/* Main content */}
			<main className="flex-1 p-4 overflow-auto">
				<div className="flex justify-between items-center mb-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={toggleSidebar}
						className="md:hidden text-teal-800"
					>
						{sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
					</Button>
					<h1 className="text-2xl font-bold text-teal-800">Task Man</h1>
					<div className="flex items-center">
						<Input
							type="text"
							placeholder="Search tasks..."
							className="mr-2 border-teal-300 focus:border-teal-500 focus:ring-teal-500"
						/>
						<Select onValueChange={setFilter} defaultValue="all">
							<SelectTrigger className="w-[180px] border-teal-300 focus:border-teal-500 focus:ring-teal-500">
								<SelectValue placeholder="Filter tasks" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Tasks</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="high">High Priority</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Task list */}
				<AnimatePresence>
					{filteredTasks.map((task) => (
						<motion.div
							key={task.id}
							className={`flex items-center p-3 bg-white rounded-lg shadow mb-2 ${
								task.completed ? "opacity-50" : ""
							}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							<input
								type="checkbox"
								checked={task.completed}
								onChange={() => toggleTaskCompletion(task.id)}
								className="mr-3 form-checkbox h-5 w-5 text-teal-600 transition duration-150 ease-in-out"
							/>
							<div className="flex-1">
								<h3
									className={`font-medium ${
										task.completed ? "line-through" : ""
									}`}
								>
									{task.title}
								</h3>
								<p className="text-sm text-teal-600">Due: {task.dueDate}</p>
							</div>
							<span
								className={`px-2 py-1 rounded text-xs ${
									task.priority === "high"
										? "bg-red-100 text-red-800"
										: task.priority === "medium"
										? "bg-yellow-100 text-yellow-800"
										: "bg-green-100 text-green-800"
								}`}
							>
								{task.priority}
							</span>
							<Bell className="ml-2 h-4 w-4 text-teal-400" />
						</motion.div>
					))}
				</AnimatePresence>

				{/* Floating Action Button */}
				<Dialog>
					<DialogTrigger asChild>
						<Button
							className="fixed bottom-4 right-4 rounded-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300"
							size="icon"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-teal-50 border-teal-200">
						<DialogHeader>
							<DialogTitle className="text-teal-800">Add New Task</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid gap-2">
								<Label htmlFor="title" className="text-teal-700">
									Title
								</Label>
								<Input
									id="title"
									value={newTask.title}
									onChange={(e) =>
										setNewTask({ ...newTask, title: e.target.value })
									}
									className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="description" className="text-teal-700">
									Description
								</Label>
								<Textarea
									id="description"
									value={newTask.description}
									onChange={(e) =>
										setNewTask({ ...newTask, description: e.target.value })
									}
									className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="priority" className="text-teal-700">
									Priority
								</Label>
								<Select
									onValueChange={(value) =>
										setNewTask({ ...newTask, priority: value })
									}
								>
									<SelectTrigger className="border-teal-300 focus:border-teal-500 focus:ring-teal-500">
										<SelectValue placeholder="Select priority" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Low</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="high">High</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="grid gap-2">
								<Label className="text-teal-700">Due Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className="border-teal-300 text-teal-700 hover:bg-teal-100"
										>
											{newTask.dueDate
												? format(newTask.dueDate, "PPP")
												: "Pick a date"}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 bg-teal-50 border-teal-200">
										<Calendar
											mode="single"
											selected={newTask.dueDate}
											onSelect={(date) =>
												setNewTask({ ...newTask, dueDate: date })
											}
											initialFocus
											className="rounded-md border-teal-200"
										/>
									</PopoverContent>
								</Popover>
							</div>
						</div>
						<div className="flex justify-end">
							<Button
								onClick={addTask}
								className="bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-300"
							>
								Save Task
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</main>
		</div>
	);
}
