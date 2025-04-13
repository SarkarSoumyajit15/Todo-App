import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags() {
    const tags = await this.tagsService.findAll();
    return {
      status: 'success',
      results: tags.length,
      data: {
        tags
      }
    };
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto, @Request() req) {
    const tag = await this.tagsService.create(createTagDto, req.user);
    return {
      status: 'success',
      data: {
        tag
      }
    };
  }

  @Patch(':id')
  async updateTag(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Request() req
  ) {
    const tag = await this.tagsService.update(id, updateTagDto, req.user);
    return {
      status: 'success',
      data: {
        tag
      }
    };
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: string, @Request() req) {
    await this.tagsService.remove(id, req.user);
    return {
      status: 'success',
      data: null
    };
  }
}
