import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<{ status: boolean; data: Category[] }> {
    const data = await this.categoryService.findAll();
    return {
      status: true,
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryService.findOne(id);

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    return category;
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryService.update(id, updateCategoryDto);

    if (!updatedCategory) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id} để cập nhật`);
    }

    return updatedCategory;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    const deletedCategory = await this.categoryService.remove(id);

    if (!deletedCategory) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id} để xóa`);
    }

    return deletedCategory;
  }
}
