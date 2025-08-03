import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './schemas/author.schema';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  async findAll(): Promise<{ status: boolean; data: Author[] }> {
    const data = await this.authorService.findAll();
    return {
      status: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Author> {
    const author = await this.authorService.findOne(id);

    if (!author) {
      throw new NotFoundException(`Không tìm thấy tác giả với ID: ${id}`);
    }

    return author;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    const updatedAuthor = await this.authorService.update(id, updateAuthorDto);

    if (!updatedAuthor) {
      throw new NotFoundException(`Không tìm thấy tác giả với ID: ${id} để cập nhật`);
    }

    return updatedAuthor;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Author> {
    const deletedAuthor = await this.authorService.remove(id);

    if (!deletedAuthor) {
      throw new NotFoundException(`Không tìm thấy tác giả với ID: ${id} để xóa`);
    }

    return deletedAuthor;
  }
}