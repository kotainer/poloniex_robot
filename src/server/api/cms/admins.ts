import { Crud } from '../crud-service';

export class Admin extends Crud {
    constructor(model: any, type: string) {
        super(model, type);
    }

}
