import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { ErrorCodes, UserRole } from "../enums";
import { CustomError } from "../errors";
import { calculatePasswordHash } from "../utils";
import { EmailService } from "./email.service";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export class InvitationService {
  static async setupPassword(token: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { invitationToken: token } });

    if (!user) {
      throw new CustomError("Invalid or expired invitation token", 400, ErrorCodes.ERR_INVALID_TOKEN);
    }

    if (!user.invitationExpires || user.invitationExpires < new Date()) {
      throw new CustomError("Invitation token has expired", 400, ErrorCodes.ERR_TOKEN_EXPIRED);
    }

    if (!user.isInvited) {
      throw new CustomError("User is not in invited state", 400, ErrorCodes.ERR_INVALID_TOKEN);
    }

    if (!user.isActive && !user.isInvited) {
      throw new CustomError("User account has been deactivated. The invitation is no longer valid.", 400, ErrorCodes.ERR_USER_DEACTIVATED);
    }

    const passwordSalt = crypto.randomBytes(64).toString("hex");
    const passwordHash = await calculatePasswordHash(password, passwordSalt);

    user.password = passwordHash;
    user.passwordSalt = passwordSalt;
    user.invitationToken = "";
    user.invitationExpires = new Date();
    user.isInvited = false;
    user.isActive = true;

    const savedUser = await userRepository.save(user);

    const authJwt = {
      userId: savedUser.id,
      email: savedUser.email,
      isAdmin: savedUser.role === UserRole.ADMIN,
      tokenVersion: savedUser.tokenVersion,
    };

    const authJwtToken = jwt.sign(authJwt, JWT_SECRET);

    return {
      user: {
        email: savedUser.email,
        name: savedUser.username,
        isAdmin: savedUser.role === UserRole.ADMIN
      },
      authJwtToken,
    };
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

    return await this.createAndSendInvitation(user);
  }

  static async cancelInvitation(id: number) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

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

    await userRepository.update(id, {
      isInvited: false,
      invitationToken: undefined,
      invitationExpires: undefined,
    });

    return await userRepository.findOne({ where: { id } });
  }

  /**
   * Generates invitation token and expiration date
   * @returns Object with invitationToken and invitationExpires
   */
  static generateInvitationToken() {
    const invitationToken = crypto.randomBytes(32).toString("hex");
    const expiresDays = Number(process.env.INVITE_EXPIRES_DAYS) || 7;
    const invitationExpires = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000);
    
    return { invitationToken, invitationExpires };
  }

  /**
   * Sends invitation email for a user
   * @param user The user to send invitation email for
   * @throws CustomError if email sending fails
   */
  static async sendInvitationEmail(user: User) {
    if (!user.invitationToken) {
      throw new CustomError(
        "User does not have an invitation token",
        400,
        ErrorCodes.ERR_INVALID_TOKEN
      );
    }

    try {
      await EmailService.sendInvitationEmail({ 
        to: user.email, 
        token: user.invitationToken, 
        name: user.username 
      });
    } catch (emailError) {
      throw new CustomError(
        `Failed to send invitation email: ${emailError instanceof Error ? emailError.message : "Unknown error"}`,
        500,
        ErrorCodes.ERR_EMAIL_SEND_FAILED
      );
    }
  }

  /**
   * Creates and sends an invitation for a user
   * Updates the user with invitation token and expiration, then sends the email
   * @param user The user to send invitation for
   * @returns The updated user
   */
  static async createAndSendInvitation(user: User) {
    const { invitationToken, invitationExpires } = this.generateInvitationToken();

    return await AppDataSource.transaction(async (manager) => {
      user.invitationToken = invitationToken;
      user.invitationExpires = invitationExpires;
      user.isInvited = true;
      
      const updatedUser = await manager.save(User, user);
      
      await this.sendInvitationEmail(updatedUser);
      return updatedUser;
    });
  }
}
