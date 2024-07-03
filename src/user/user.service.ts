import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { UserEntity } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { ProducerService } from 'src/queues/producer.service';
@Injectable()
export class UserService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private producerService: ProducerService,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param EditUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async createUser(CreateUserDto: CreateUserDto): Promise<UserEntity> {
    const emailData = {
      email: CreateUserDto.email,
      subject: 'Welcome to Our Community',
      html: `<p>Hello ${CreateUserDto.username},</p>
      <p>Welcome to our community! Your account is now active.</p>
      <p>Enjoy your time with us!</p>`,
    };
    await this.producerService.addToEmailQueue(emailData);

    const user: UserEntity = new UserEntity();
    user.lastName = CreateUserDto.lastName;
    user.email = CreateUserDto.email;
    user.firstName = CreateUserDto.firstName;
    user.username = CreateUserDto.username;
    return this.userRepository.save(user);
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  findAllBook(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  viewBook(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  removeBUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
