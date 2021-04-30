import { BadGatewayException, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ]

    transform(value: any) {
        value = value.toUpperCase();

        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} isn't valid status`);
        }
        
        return value;
    }

    private isStatusValid(status: any) : Boolean{
        let index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }
}