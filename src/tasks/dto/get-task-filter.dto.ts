import { TaskStatus } from "../task-status.enum";
import {IsIn, IsOptional, IsNotEmpty} from 'class-validator'

export class GetTaskFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.IN_PROGRESS, TaskStatus.DONE, TaskStatus.OPEN])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;   
}