import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class PosTaggerService {

    public tagTextWithPosInline(text: string): string {
        throw new NotImplementedException();
    }

    public tagTextWithPos(text: string): unknown {
        throw new NotImplementedException();
    }

    public tagTextWithPosAndLemmatize(text: string): unknown {
        throw new NotImplementedException();
    }
}
