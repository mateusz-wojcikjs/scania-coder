import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity";
import { ErrorCodes, UserRole } from "../enums";
import { CustomError } from "../errors";
import { calculatePasswordHash } from "../utils";

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

    if (!user.isActive) {
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
}
