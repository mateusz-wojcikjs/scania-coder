import { AppDataSource } from "../data-source";
import { Layout } from "../entity";
import { UpdatePayload } from "@scania-coder/types";

export class XmlLayoutService {
  static async createLayout(authorId: number, name: string, updates: UpdatePayload[]) {
    const layoutRepository = AppDataSource.getRepository(Layout);
    const newLayout = layoutRepository.create({
      name,
      authorId,
      updates,
    });

    return await layoutRepository.save(newLayout);
  }

  static async getLayoutById(id: number) {
    return await AppDataSource
      .getRepository(Layout)
      .findOneBy({ id })
  }

  static async getAllLayouts() {
    return await AppDataSource
      .getRepository(Layout)
      .createQueryBuilder("layout")
      .getMany();
  }

  static async deleteLayoutById(id: number) {
    const layoutRepository = AppDataSource.getRepository(Layout);
    return await layoutRepository.delete(id);
  }
}
