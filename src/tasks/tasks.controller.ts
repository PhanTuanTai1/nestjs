import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    async getTask(@Query(ValidationPipe) filterDto: GetTaskFilterDto) : Promise<Task[]> {
        return await this.taskService.getTasks(filterDto);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(@Body() createTaskDto : CreateTaskDto) : Promise<Task>{
        return await this.taskService.createTask(createTaskDto);
    }

    @Get('/:id')
    async getTaskById(@Param('id', ParseIntPipe) id: number) : Promise<Task> {
        let task = await this.taskService.getTaskById(id);

        return task;
    }

    @Delete('/:id')
    async deleteTaskById(@Param('id', ParseIntPipe) id: number) : Promise<string> {
        await this.taskService.deleteTaskById(id);
        return "Deleted Successfully";
    } 

    @Patch('/:id/status') 
    async updateStatusTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status) {
        return await this.taskService.updateStatusTask(id, status);
    }
}
