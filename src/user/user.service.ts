import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserProfileById(id: string) {
    return id;
  }
}
