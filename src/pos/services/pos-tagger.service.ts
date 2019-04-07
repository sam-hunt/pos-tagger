import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class PosTaggerService {

    public tagTextWithPosInline(): string {
        throw new NotImplementedException();
    }

    public tagTextWithPos(): unknown {
        throw new NotImplementedException();
    }

    public tagTextWithPosAndLemmatize(): unknown {
        throw new NotImplementedException();
    }
}
