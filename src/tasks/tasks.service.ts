import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) {}

    async getTaskById(id: number, user: User) : Promise<Task> {
        const found = await this.taskRepository.findOne({where: {id, userId: user.id}});
        
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User) : Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number, user: User) : Promise<void> {
        let execute = await this.taskRepository.delete({id, userId: user.id});

        if(execute.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
    
    async updateStatusTask(id: number, status: TaskStatus, user: User) : Promise<Task> {
        let task = await this.getTaskById(id, user);

        task.status = status;
        task.save();

        return task;
    }

    async getTasks(filterDto: GetTaskFilterDto, user : User) : Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto, user);
    }
}
