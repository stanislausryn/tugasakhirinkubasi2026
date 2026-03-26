import { IsUUID, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class AddToCartDto {
  @IsUUID('all', { message: 'productId must be a valid UUID' })
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
