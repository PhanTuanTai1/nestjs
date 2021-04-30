import { EntityRepository, Repository } from 'typeorm';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task } from './task.entity'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTaskFilterDto) : Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.createQueryBuilder('task');

        if(status) {
            query.andWhere('task.status = :status', {status});
        }

        if(search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`});
        }

        let tasks = await query.getMany();

        return tasks;
    }
}