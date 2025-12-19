import crypto from "crypto";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { ErrorCodes, UserRole } from "../enums";
import { CustomError } from "../errors";
import { calculatePasswordHash } from "../utils";
import { EmailService } from "./email.service";

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

  static async createUser(username: string, email: string, role: UserRole) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if (user) {
      if (user.isInvited && user.invitationExpires && user.invitationExpires > new Date()) {
        throw new CustomError(
          "User already has a pending invitation. Please wait for them to accept it or resend the invitation instead.",
          409,
          ErrorCodes.ERR_PENDING_INVITATION
        );
      }
      
      throw new CustomError("User already exists", 409, ErrorCodes.ERR_ALREADY_EXISTS);
    }

    const invitationToken = crypto.randomBytes(32).toString("hex");
    const invitationExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return await AppDataSource.transaction(async (manager) => {
      const newUser = userRepository.create({
        username,
        email,
        role,
        invitationToken,
        invitationExpires,
        isInvited: true,
      });

      const savedUser = await manager.save(User, newUser);
      
      try {
        await EmailService.sendInvitationEmail({ to: email, token: invitationToken, name: username });
        return savedUser;
      } catch (emailError) {
        throw new CustomError(
          `Failed to send invitation email: ${emailError instanceof Error ? emailError.message : "Unknown error"}`,
          500,
          ErrorCodes.ERR_EMAIL_SEND_FAILED
        );
      }
    });
  }

  static async updateUser(id: number, updateData: Partial<User>) {
    const userRepository = AppDataSource.getRepository(User);

    if (updateData.password) {
      const passwordSalt = crypto.randomBytes(64).toString("hex");
      const passwordHash = await calculatePasswordHash(updateData.password, passwordSalt);

      updateData.password = passwordHash;
      updateData.passwordSalt = passwordSalt;
    }

    await userRepository.update(id, updateData);
    return userRepository.findOne({ where: { id } });
  }

  static async deleteUserById(id: number) {
    const userRepository: Repository<User> = AppDataSource.getRepository(User);
    return await userRepository.delete(id);
  }

  static async toggleUserActiveStatus(id: number) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CustomError("User not found", 404, ErrorCodes.ERR_USER_NOT_FOUND);
    }

    user.isActive = !user.isActive;
    return await userRepository.save(user);
  }

  static async deactivateUser(id: number) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new CustomError("User not found", 404, ErrorCodes.ERR_USER_NOT_FOUND);
    }

    user.isActive = false;
    return await userRepository.save(user);
  }

  static async getInvitationStatus(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return { status: "not_found", message: "User not found" };
    }

    if (!user.isInvited) {
      return { status: "not_invited", message: "User is not in invited state" };
    }

    if (user.invitationExpires && user.invitationExpires < new Date()) {
      return { status: "expired", message: "Invitation has expired" };
    }

    return { 
      status: "pending", 
      message: "User has a pending invitation",
      expiresAt: user.invitationExpires
    };
  }

  static async resendInvitation(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new CustomError("User not found", 404, ErrorCodes.ERR_USER_NOT_FOUND);
    }

    if (!user.isInvited) {
      throw new CustomError(
        "User is not in invited state. They may have already accepted the invitation or it was never sent.",
        400,
        ErrorCodes.ERR_INVALID_TOKEN
      );
    }

    if (user.invitationExpires && user.invitationExpires < new Date()) {
      throw new CustomError(
        "Invitation has expired. Please create a new invitation instead.",
        400,
        ErrorCodes.ERR_TOKEN_EXPIRED
      );
    }

    const invitationToken = crypto.randomBytes(32).toString("hex");
    const invitationExpires = new Date(Date.now() + Number(process.env.INVITE_EXPIRES_DAYS) * 24 * 60 * 60 * 1000);

    return await AppDataSource.transaction(async (manager) => {
      user.invitationToken = invitationToken;
      user.invitationExpires = invitationExpires;
      
      const updatedUser = await manager.save(User, user);
      
      try {
        await EmailService.sendInvitationEmail({ 
          to: email, 
          token: invitationToken, 
          name: user.username 
        });
        return updatedUser;
      } catch (emailError) {
        throw new CustomError(
          `Failed to resend invitation email: ${emailError instanceof Error ? emailError.message : "Unknown error"}`,
          500,
          ErrorCodes.ERR_EMAIL_SEND_FAILED
        );
      }
    });
  }
}
