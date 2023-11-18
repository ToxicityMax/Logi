// search.dto.ts
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransformDateToTimestamp } from '../../../decorators/TransformDateToTimestamp';
import { ApiProperty } from '@nestjs/swagger';
import { Log } from '../ingestor.interface';

class MetadataDTO {
  @IsString()
  parentResourceId: string;
}

export class LogDTO {
  @ApiProperty()
  @IsString()
  level: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  resourceID: string;

  @ApiProperty()
  @TransformDateToTimestamp()
  timestamp: number;

  @ApiProperty()
  @IsString()
  traceID: string;

  @ApiProperty()
  @IsString()
  spanID: string;

  @ApiProperty()
  @IsString()
  commit: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => MetadataDTO)
  metadata: MetadataDTO;
}

export class FilterDTO {
  @IsOptional()
  @IsString()
  searchText?: string;

  @IsOptional()
  startDate?: number;

  @IsOptional()
  @IsNumber()
  endDate?: number;
}

export class SearchBodyDto {
  @ApiProperty()
  filters: FilterDTO;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  page: number = 1;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit: number = 20;
}

export class LogSearchResultDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  results: Log[];
}
