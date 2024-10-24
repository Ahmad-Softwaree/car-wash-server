import { Inject, Injectable } from '@nestjs/common';
import { CompanyInfo, Config } from 'database/types';
import { Knex } from 'knex';
import { UpdateConfigDto } from './dto/update-configdto';
import { CompanyDto } from './dto/update-company.dto';
import { InsetCompanyImageDto } from './dto/insert-image.dto';

@Injectable()
export class ConfigService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}
  async getAll(): Promise<Config> {
    try {
      const configs: Config = await this.knex<Config>('config')
        .select('*')
        .first();
      return configs;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getCompanyData(): Promise<CompanyInfo> {
    try {
      const company_info: CompanyInfo = await this.knex<CompanyInfo>(
        'company_info',
      )
        .select('*')
        .first();
      return company_info;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(key: string, body: UpdateConfigDto): Promise<Config> {
    try {
      const config: Config[] = await this.knex<Config>('config')
        .update({
          [key]: body.value,
        })
        .returning('*');

      return config[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async insertImage(body: InsetCompanyImageDto): Promise<CompanyInfo> {
    try {
      const company_info: CompanyInfo[] = await this.knex<CompanyInfo>(
        'company_info',
      )
        .update({
          image_name: body.image_name,
          image_url: body.image_url,
        })
        .returning('*');

      return company_info[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteImage(): Promise<CompanyInfo> {
    try {
      const company_info: CompanyInfo[] = await this.knex<CompanyInfo>(
        'company_info',
      )
        .update({
          image_name: '',
          image_url: '',
        })
        .returning('*');

      return company_info[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async updateCompanyInfo(body: CompanyDto): Promise<CompanyInfo> {
    try {
      const company_info: CompanyInfo[] = await this.knex<CompanyInfo>(
        'company_info',
      )
        .update(body)
        .returning('*');

      return company_info[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
