import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://duongdangtuananh:1234567890@blogs.ygtg28s.mongodb.net/blogs?retryWrites=true&w=majority&appName=blogs'),
    PostModule,
    CategoryModule,
    AuthorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
