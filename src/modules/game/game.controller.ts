import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { BaseController } from '@modules/app/base.controller';
import { GameService } from '@modules/game/game.service';
import { Response } from 'express';

@Controller('api/games')
export class GameController extends BaseController {
  constructor(private readonly gameService: GameService) {
    super();
  }

  @Get()
  async findAll(@Res() res: Response) {
    const dataList = await this.gameService.findAll();
    return this.successResponse(
      {
        data: dataList,
        message: 'success',
      },
      res,
    );
  }

  @Get(':id')
  async findOne(@Param() params, @Res() res) {
    const dataResult = await this.gameService.findOne(params.id);
    if (!dataResult) {
      return this.errorsResponse(
        {
          message: `Don't have data`,
        },
        res,
      );
    } else {
      return this.successResponse(
        {
          data: dataResult,
          message: 'success',
        },
        res,
      );
    }
  }

  @Post('create')
  async create(@Request() req, @Body() game: object, @Res() res: Response) {
    const result = await this.gameService.checkOrCreateGame(game);
    console.log(result);
    return this.successResponse(
      {
        message: 'success',
      },
      res,
    );
  }

  @Post('create-logical-game')
  async createLogicalGame(
    @Body()
    logicalGameDto: {
      question: string;
      answer: any;
      correct_answer: string;
      score: number;
    },
    @Res() res: Response,
  ) {
    // convert object to JSON
    logicalGameDto.answer = JSON.stringify(logicalGameDto.answer);
    const result = await this.gameService.createLogicalGame(logicalGameDto);
    return this.successResponse(
      {
        message: 'success',
      },
      res,
    );
  }
  @Post('create-memory-game')
  async createMemoryLogicalGame(
    @Body()
    memoryGameDto: {
      level: number;
      correct_answer: string;
      score: number;
    },
    @Res() res: Response,
  ) {
    // convert object to JSON
    memoryGameDto.correct_answer = JSON.stringify(memoryGameDto.correct_answer);
    const result = await this.gameService.createMemoryGame(memoryGameDto);
    return this.successResponse(
      {
        message: 'success',
      },
      res,
    );
  }
}
