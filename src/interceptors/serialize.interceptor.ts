import { 
    UseInterceptors,
    NestInterceptor,
    ExecutionContext, 
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor){}
    intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
        // run something before a request is handled
        // by tje request handler
        // console.log('Im running befor the handler', context);

        return handler.handle().pipe(
            map((data: ClassConstructor) => {
                //run something before the response is sent out
                // console.log('Im running befor the response is sent out', data)
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}