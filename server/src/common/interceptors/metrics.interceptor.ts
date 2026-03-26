import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total') private counter: Counter<string>,
    @InjectMetric('http_request_duration_seconds') private histogram: Histogram<string>,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const method = req.method;

    const route = req.route ? req.route.path : req.path;

    const end = this.histogram.startTimer();

    return next.handle().pipe(
      tap({
        next: () => {
          const status = res.statusCode || 200;
          this.counter.labels(method, route, status.toString()).inc();
          end({ method, route, status: status.toString() });
        },
        error: (error) => {
          const status = error.status || error.statusCode || 500;
          this.counter.labels(method, route, status.toString()).inc();
          end({ method, route, status: status.toString() });
        },
      }),
    );
  }
}
