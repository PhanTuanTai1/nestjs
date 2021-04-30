import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

    async getTaskById(id: number) : Promise<Task> {
        const found = await this.taskRepository.findOne(id);
        
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto) : Promise<Task> {
        const {title, description} = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;  

        let taskCreated = await task.save();

        if(!taskCreated) {
            throw new BadRequestException('Can not insert task to database');
        }

        return task
    }

    async deleteTaskById(id: number) : Promise<void> {
        let execute = await this.taskRepository.delete(id);

        if(execute.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
    
    async updateStatusTask(id: number, status: TaskStatus) : Promise<Task> {
        let task = await this.getTaskById(id);

        task.status = status;
        task.save();

        return task;
    }

    async getTasks(filterDto: GetTaskFilterDto) : Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto);
    }
    // async getTaskWithFilters(filterDto: GetTaskFilterDto) : Promise<Task[]> {
    //     const {status, search} = filterDto;

    //     let tasks = await this.getAllTasks();

    //     if(status) {
    //         tasks = tasks.filter(el => el.status === status);
    //     }

    //     if(search) {
    //         tasks = tasks.filter(el => {
    //            return  el.title.includes(search) || el.description.includes(search)
    //         });
    //     }

    //     return tasks;
    // }
}
