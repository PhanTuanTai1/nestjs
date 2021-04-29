import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid} from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    private tasks : Task[] = [];

    getAllTasks() : Task[] {
        return this.tasks;
    }

    createTask(createTaskDto: CreateTaskDto) : Task {
        const {title, description} = createTaskDto;

        const task: Task = {
            id : uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task);

        return task
    }

    async getTaskById(id: string) : Promise<Task> {
        return await this.tasks.find(x => x.id === id);
    }

    async deleteTaskById(id: string) : Promise<Task> {
        let taskIndex = await this.tasks.findIndex(el => el.id === id);

        if(taskIndex >= 0) {
            let task = this.tasks[taskIndex];
            this.tasks.splice(taskIndex, 1);

            return task;
        }

        return null;
    }

    async updateTask(id: string, status: TaskStatus) {
        let task = await this.getTaskById(id);
        task.status = status;

        return task;
    }

    async getTaskWithFilters(filterDto: GetTaskFilterDto) : Promise<Task[]> {
        const {status, search} = filterDto;

        let tasks = await this.getAllTasks();

        if(status) {
            tasks = tasks.filter(el => el.status === status);
        }

        if(search) {
            tasks = tasks.filter(el => {
               return  el.title.includes(search) || el.description.includes(search)
            });
        }

        return tasks;
    }
}
