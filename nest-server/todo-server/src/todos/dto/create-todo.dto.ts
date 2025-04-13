import { IsString, IsOptional, IsEnum, IsBoolean, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['Low', 'Medium', 'High'])
  @IsOptional()
  priority?: string;

  @IsEnum(['Pending', 'In Progress', 'Completed'])
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsOptional()
  mentions?: string[];
}