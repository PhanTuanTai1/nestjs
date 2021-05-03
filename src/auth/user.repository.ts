import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import {EntityRepository, Repository} from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import {User} from "./user.entity";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto : AuthCredentialsDto) : Promise<void> {
        const {username, password} = authCredentialsDto;

        try {
            let user = new User();
            user.username = username;
            user.salt = await bcrypt.genSalt();
            user.password = await this.hashPassword(password, user.salt);
            await user.save();
        }
        catch(error) {
            if(error.code === '23505' ) {
                throw new ConflictException('username already exists');
            }
            else {
                throw new InternalServerErrorException();
            }
        }
    }

    async hashPassword(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }

    async validateUserPassword(authCredentialsDto : AuthCredentialsDto) : Promise<string> {
        const {username, password} = authCredentialsDto;

        let user = this.findOne({username});

        if(user && await (await user).validatePassword(password)) {
            return (await user).username;
        }
        
        return null;
    }
}