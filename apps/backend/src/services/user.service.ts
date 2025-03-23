import crypto from "crypto";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { UserRole } from "../enums";
import { CustomError } from "../errors";
import { calculatePasswordHash } from "../utils";

export class UserService {
  static async getUsers(
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "ASC" | "DESC" = "DESC",
    filters?: { username?: string; email?: string; role?: UserRole }
  ) {
    const userRepository: Repository<User> = AppDataSource.getRepository(User);

    let query = userRepository.createQueryBuilder("user");

    if (filters) {
      if (filters.username) {
        query = query.andWhere("user.username ILIKE :username", { username: `%${filters.username}%` });
      }
      if (filters.email) {
        query = query.andWhere("user.email ILIKE :email", { email: `%${filters.email}%` });
      }
      if (filters.role) {
        query = query.andWhere("user.role = :role", { role: filters.role });
      }
    }

    query = query.orderBy(`user.${sortBy}`, sortOrder);

    const [users, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUser(id: number) {
    return await AppDataSource.getRepository(User).findOneBy({ id });
  }

  static async createUser(username: string, email: string, password: string, role: UserRole) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (user) {
      throw new CustomError("User already exists", 409, "ERR_ALREADY_EXISTS");
    }

    const passwordSalt = crypto.randomBytes(64).toString("hex");
    const passwordHash = await calculatePasswordHash(password, passwordSalt);

    const newUser = userRepository.create({
      username,
      email,
      password: passwordHash,
      role,
      passwordSalt,
    });

    return await userRepository.save(newUser);
  }

  static async updateUser(id: number, updateData: Partial<any>) {
    const userRepository = AppDataSource.getRepository(User);

    await userRepository.update(id, updateData);
    return userRepository.findOne({ where: { id } });
  }

  static async deleteUserById(id: number) {
    const userRepository: Repository<User> = AppDataSource.getRepository(User);
    return await userRepository.delete(id);
  }

}
