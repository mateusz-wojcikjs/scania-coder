import crypto from "crypto";
import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { ErrorCodes, UserRole } from "../enums";
import { CustomError } from "../errors";
import { calculatePasswordHash } from "../utils";
import { InvitationService } from "./invitation.service";

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
      data: users,
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

    const { invitationToken, invitationExpires } = InvitationService.generateInvitationToken();

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
      
      await InvitationService.sendInvitationEmail(savedUser);
      return savedUser;
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

  static async deleteUserById(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new CustomError(
        "You cannot delete your own account. Use account settings to deactivate your account instead.",
        403,
        ErrorCodes.ERR_CANNOT_DELETE_OWN_ACCOUNT
      );
    }

    const userRepository: Repository<User> = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new CustomError("User not found", 404, ErrorCodes.ERR_USER_NOT_FOUND);
    }
    if (user.isActive) {
      throw new CustomError("User is active. Please deactivate the user instead.", 400, ErrorCodes.ERR_USER_IS_ACTIVE);
    }
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

  static async deactivateUserAsAdmin(targetUserId: number, actorUserId: number) {
    return this.deactivateUser({ targetUserId, actorUserId, mode: "admin" });
  }

  static async deactivateUserAsSelf(targetUserId: number, actorUserId: number) {
    return this.deactivateUser({ targetUserId, actorUserId, mode: "self" });
  }

  private static async deactivateUser(params: { targetUserId: number; actorUserId: number; mode: "admin" | "self" }) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: params.targetUserId } });

    if (!user) {
      throw new CustomError("User not found", 404, ErrorCodes.ERR_USER_NOT_FOUND);
    }

    if (params.mode === "self") {
      if (params.targetUserId !== params.actorUserId) {
        throw new CustomError(
          "You can only deactivate your own account",
          403,
          ErrorCodes.ERR_CANNOT_DELETE_OWN_ACCOUNT
        );
      }
    } else if (params.mode === "admin") {
      const actor = await userRepository.findOne({ where: { id: params.actorUserId } });
      if (!actor) {
        throw new CustomError("Actor user not found", 404, ErrorCodes.ERR_USER_NOT_FOUND);
      }
      if (actor.role !== UserRole.ADMIN) {
        throw new CustomError(
          "Admin privileges required to deactivate users",
          403,
          ErrorCodes.ERR_UNEXPECTED_ERROR
        );
      }

      if (user.role === UserRole.ADMIN) {
        const activeAdminCount = await userRepository.count({
          where: {
            role: UserRole.ADMIN,
            isActive: true,
          },
        });
        if (activeAdminCount <= 1) {
          throw new CustomError(
            "Cannot deactivate the last active admin",
            400,
            ErrorCodes.ERR_UNEXPECTED_ERROR
          );
        }
      }
    }

    user.isActive = false;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    return await userRepository.save(user);
  }
}
