import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('http_requests_total') private counter: Counter<string>,
    @InjectMetric('http_request_duration_seconds') private histogram: Histogram<string>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const end = this.histogram.startTimer();
    const method = req.method;

    res.on('finish', () => {
      const status = res.statusCode ? res.statusCode.toString() : '500';
      
      // req.route is only populated if a route was successfully matched by NestJS.
      // If it's a 404, we fallback to req.originalUrl to prevent losing metrics tracking.
      const route = req.route ? req.route.path : req.originalUrl;
      
      this.counter.labels(method, route, status).inc();
      end({ method, route, status });
    });

    next();
  }
}
