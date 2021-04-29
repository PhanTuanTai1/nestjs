import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    async getTask(@Query() filterDto: GetTaskFilterDto) : Promise<Task[]> {
        if(Object.keys(filterDto).length) {
            return await this.taskService.getTaskWithFilters(filterDto);
        }

        return await this.taskService.getAllTasks();
    }

    @Post()
    async createTask(@Body() createTaskDto : CreateTaskDto) : Promise<Task>{
        return await this.taskService.createTask(createTaskDto);
    }

    @Get('/:id')
    async getTaskById(@Param('id') id: string) : Promise<Task> {
        return await this.taskService.getTaskById(id);
    }

    @Delete('/:id')
    async deleteTaskById(@Param('id') id: string) : Promise<string> {
        let taskDeleted = await this.taskService.deleteTaskById(id);

        return taskDeleted != null ? "Deleted Successfully" : "Can't find the task"; 
    } 

    @Patch('/:id/status') 
    async updateStatusTask(@Param('id') id: string, @Body('status') status) {
        return await this.taskService.updateTask(id, status);
    }
}
