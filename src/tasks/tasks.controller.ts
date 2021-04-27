import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    async getAllTasks() : Promise<Task[]> {
        return await this.taskService.getAllTasks();
    }

    @Post()
    async createTask(@Body('title') title: string, @Body('description') description: string) : Promise<Task>{
        return await this.taskService.createTask(title, description);
    }
}
