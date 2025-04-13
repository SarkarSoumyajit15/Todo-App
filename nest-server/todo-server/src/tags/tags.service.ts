import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>
  ) {}

  async findAll(): Promise<TagDocument[]> {
    return this.tagModel.find().exec();
  }

  async create(createTagDto: CreateTagDto, user: UserDocument): Promise<TagDocument> {
    const tagData = {
      ...createTagDto,
      createdBy: user._id
    };

    const newTag = await this.tagModel.create(tagData);
    return newTag;
  }

  async update(id: string, updateTagDto: UpdateTagDto, user: UserDocument): Promise<TagDocument> {
    const tag = await this.tagModel.findById(id).exec();

    if (!tag) {
      throw new NotFoundException('No tag found with that ID');
    }

    // Only the creator can update the tag
    if (tag.createdBy && tag.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to update this tag');
    }

    const updatedTag = await this.tagModel.findByIdAndUpdate(id, updateTagDto, {
      new: true,
      runValidators: true
    }).exec();

    if(!updatedTag) {
      throw new NotFoundException('No tag found with that ID');
    }

    return updatedTag;
  }

  async remove(id: string, user: UserDocument): Promise<void> {
    const tag = await this.tagModel.findById(id).exec();

    if (!tag) {
      throw new NotFoundException('No tag found with that ID');
    }

    // Only the creator can delete the tag
    if (tag.createdBy && tag.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('You do not have permission to delete this tag');
    }

    await this.tagModel.findByIdAndDelete(id).exec();
  }
}
