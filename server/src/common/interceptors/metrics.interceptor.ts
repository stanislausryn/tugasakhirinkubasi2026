import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
      finalize(() => {
        const status = res.statusCode ? res.statusCode.toString() : '500';
        this.counter.labels(method, route, status).inc();
        end({ method, route, status });
      }),
    );
  }
}
