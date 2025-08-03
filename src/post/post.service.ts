import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(sortBy?: string, search?: string): Promise<any> {
    let query = this.postModel.find();
    
    query = query.populate('author_id', 'name email').populate('category_id', 'name');

    if (search) {
      query = query.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // if (sortBy === 'createdAt') {
    //   query = query.sort({ createdAt: 1 });
    // } else if (sortBy === '-createdAt') {
    //   query = query.sort({ createdAt: -1 });
    // } else if (sortBy === 'title') {
    //   query = query.sort({ title: 1 });
    // } else if (sortBy === '-title') {
    //   query = query.sort({ title: -1 });
    // } else {
    //   query = query.sort({ createdAt: -1 });
    // }

    if (sortBy) {
      const sortFields = sortBy.split(',');
      const sortObject: any = {};
      
      for (const field of sortFields) {
        const trimmedField = field.trim();
        const sortOrder = trimmedField.startsWith('-') ? -1 : 1;
        const fieldName = trimmedField.startsWith('-') ? trimmedField.substring(1) : trimmedField;
        const allowedFields = ['createdAt', 'title'];

        if (allowedFields.includes(fieldName)) {
          sortObject[fieldName] = sortOrder;
        }
      }
      
      if (Object.keys(sortObject).length > 0) {
        query = query.sort(sortObject);
      } else {
        query = query.sort({ createdAt: -1 });
      }
    } else {
      query = query.sort({ createdAt: -1 });
    }
    
    //return query.exec();

    const posts = await query.exec();

    return posts.map(post => {
      const postObj = post.toObject();
      return {
        ...postObj,
        category: postObj.category_id,
        category_id: undefined,
        author:postObj.author_id,
        author_id: undefined
      };
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Không tìm thấy bài post với ID: ${id}`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
    if (!updatedPost) {
      throw new NotFoundException(`Không tìm thấy bài post với ID: ${id}`);
    }
    return updatedPost as Post;
  }

  async remove(id: string): Promise<Post> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    if (!deletedPost) {
      throw new NotFoundException(`Không tìm thấy bài post với ID: ${id}`);
    }
    return deletedPost;
  }

  async findByCategory(categoryId: string): Promise<Post[]> {
    //return this.postModel.find({ category_id: categoryId }).populate('category').exec();
    return this.postModel.find({ category_id: categoryId }).exec();
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postModel.find({ author_id: authorId }).exec();
  }
}