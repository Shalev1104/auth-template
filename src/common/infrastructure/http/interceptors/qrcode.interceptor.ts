import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<string>) {
    return next.handle().pipe(
      map(async (url) => {
        const response = context.switchToHttp().getResponse();

        response.header('Content-Type', 'image/png');
        response.header('Content-Disposition', 'inline; filename=qr-code.png');

        const qrCodeData = await QRCode.toDataURL(url);
        const qrCodeImageBuffer = Buffer.from(
          qrCodeData.replace('data:image/png;base64,', ''),
          'base64',
        );
        response.end(qrCodeImageBuffer);
      }),
    );
  }
}
