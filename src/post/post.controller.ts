import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from './schemas/post.schema';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postService.create(createPostDto);
  }

  @Get()
  async findAll(@Query('sort') sort?: string, @Query('search') search?: string): Promise<{ status: boolean; data: PostEntity[] }> {
    const data = await this.postService.findAll(sort, search);
    
    return {
      status: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    const post = await this.postService.findOne(id);
    
    if (!post) throw new NotFoundException(`Không tìm thấy bài viết với ID: ${id}`);

    return post;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto): Promise<PostEntity> {
    try {
      const updatedPost = await this.postService.update(id, updatePostDto);
      
      if (!updatedPost) throw new NotFoundException(`Không tìm thấy bài viết với ID: ${id} để cập nhật`);

      return updatedPost;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostEntity> {
    const deletedPost = await this.postService.remove(id);
    
    if (!deletedPost) throw new NotFoundException(`Không tìm thấy bài viết với ID: ${id} để xóa`);

    return deletedPost;
  }

  @Get('/category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string): Promise<{ status: boolean; data: PostEntity[] }> {
    const posts = await this.postService.findByCategory(categoryId);
    
    return {
      status: true,
      data: posts,
    };
  }

  @Get('/author/:authorId')
  async findByAuthor(@Param('authorId') authorId: string): Promise<{ status: boolean; data: PostEntity[] }> {
    const posts = await this.postService.findByAuthor(authorId);
    
    return {
      status: true,
      data: posts,
    };
  }
}