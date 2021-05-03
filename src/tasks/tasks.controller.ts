import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService: TasksService) {}

    @Get()
    async getTask(@Query(ValidationPipe) filterDto: GetTaskFilterDto, @GetUser() user : User) : Promise<Task[]> {
        this.logger.verbose(`User ${user.username} retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return await this.taskService.getTasks(filterDto, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(@Body() createTaskDto : CreateTaskDto, @GetUser() user : User) : Promise<Task>{
        this.logger.verbose(`User ${user.username} creating new task. Data: ${JSON.stringify(createTaskDto)}`)
        return await this.taskService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    async getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) : Promise<Task> {
        let task = await this.taskService.getTaskById(id, user);

        return task;
    }

    @Delete('/:id')
    async deleteTaskById(@Param('id', ParseIntPipe) id: number,@GetUser() user: User) : Promise<string> {
        await this.taskService.deleteTaskById(id, user);
        return "Deleted Successfully";
    } 

    @Patch('/:id/status') 
    async updateStatusTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status, @GetUser() user: User) {
        return await this.taskService.updateStatusTask(id, status, user);
    }
}
